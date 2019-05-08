#!/usr/bin/env node

const outputStyle = 'php'; // 'php' or 'c'
const delimiter = '\t'; // '\t' or ','

var path = require('path');
var fs = require('fs');
var esprima = require('esprima');

var sourceCode = "";

var csvHead1PHP = `id:ID\tlabels:label\ttype\tflags:string[]\tlineno:int\tcode\tchildnum:int\tfuncid:int\tclassname\tnamespace\tendlineno:int\tname\tdoccomment\n`.replace(/\t/g, delimiter);
var csvHead1C = `command\tkey\ttype\tcode\tlocation\tfunctionId\tchildNum\tisCFGNode\toperator\tbaseType\tcompleteType\tidentifier\n`.replace(/\t/g, delimiter);
var csvHead2PHP = `start\tend\ttype\n`.replace(/\t/g, delimiter);
var csvHead2C = `start\tend\ttype\tvar\n`.replace(/\t/g, delimiter);
var nodesStream = fs.createWriteStream('nodes.csv');
var relsStream = fs.createWriteStream(outputStyle == 'php' ? 'rels.csv' : 'edges.csv');
var parentOf;
if (outputStyle == 'php') {
    nodesStream.write(csvHead1PHP);
} else if (outputStyle == 'c') {
    nodesStream.write(csvHead1C);
}
if (outputStyle == 'php') {
    relsStream.write(csvHead2PHP);
    parentOf = 'PARENT_OF';
} else if (outputStyle == 'c') {
    relsStream.write(csvHead2C);
    parentOf = 'IS_AST_PARENT';
}

var nodeIdCounter;
var nodes = [];
if (outputStyle == 'php') {
    nodeIdCounter = 0;
} else if (outputStyle == 'c') {
    nodeIdCounter = 1;
}

function walkDir(dir, parentNodeId, callback) {
    /**
     * walk the dir and combine files together
     */
    let currentId = nodeIdCounter;
    if (outputStyle == 'php') {
        if (parentNodeId !== null) {
            relsStream.write([parentNodeId, currentId, 'DIRECTORY_OF'].join(delimiter) + '\n');
        }
        nodes[currentId] = {
            label: 'Filesystem',
            type: 'Directory',
            name: dir
        };
    } else if (outputStyle == 'c') {
        if (parentNodeId !== null) {
            relsStream.write([parentNodeId, currentId, 'IS_DIRECTORY_OF'].join(delimiter) + '\n');
        }
        nodes[currentId] = {
            label: 'Filesystem',
            type: 'Directory',
            name: dir
        };
    }
    nodeIdCounter++;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, currentId, callback);
        } else {
            if (f.endsWith(".js")) callback(path.join(dir, f), currentId);
        }
    });
};

if (process.argv.length != 3) {
    console.log('Wrong arguments: ' + process.argv);
    console.log('Usage: ' + process.argv[1] + ' filename');
    process.exit();
}

var dirname = process.argv[2];
var filename = "";

var requiredModules = [],
    analyzedModules = [];
var searchPaths = ['~/packagecrawler', '.'].concat(module.paths);
const builtInModules = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'stream', 'string_decoder', 'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

// main

// analyze the designated source code files
if (!fs.statSync(dirname).isDirectory()) {
    analyze(dirname, null);
} else {
    walkDir(dirname, null, analyze);
}

// analyze any required packages
console.log('Package search paths: ' + searchPaths);
while (requiredModules.length > 0) {
    let currentModule = requiredModules.shift();
    if (builtInModules.includes(currentModule)) {
        console.log(`${currentModule} is a built-in module.`);
        continue;
    }
    let found = false;
    for (let p of searchPaths) {
        // search file
        let currentPath = path.join(p, currentModule);
        if (!currentModule.endsWith('.js'))
            currentPath += '.js';
        if (analyzedModules.includes(currentPath)) {
            found = true;
            console.log(`Package ${currentModule} had been analyzed.`);
            break;
        } else if (fs.existsSync(currentPath) && fs.statSync(currentPath).isFile()) {
            console.log(`Package ${currentModule} found at ${currentPath}.`);
            analyzedModules.push(currentPath);
            analyze(currentPath, null);
            found = true;
            break;
        }
        // search directory
        if (!currentModule.endsWith('.js')) {
            if (analyzedModules.includes(currentPath)) {
                found = true;
                console.log(`Package ${currentModule} had been analyzed.`);
                break;
            } else if (fs.existsSync(currentPath) && fs.statSync(currentPath).isDirectory()) {
                // check if package.json exists
                let jsonPath = path.join(currentPath, 'package.json');
                let main = 'main.js';
                if (fs.existsSync(jsonPath) && fs.statSync(jsonPath).isFile()) {
                    try {
                        main = JSON.parse(fs.readFileSync(filePath, 'utf8'))['main'];
                    } catch (e) {
                        console.error(`Error: package.json (${jsonPath}) does not include main field.`);
                    }
                }
                let mainPath = path.join(currentPath, main);
                if (fs.existsSync(mainPath) && fs.statSync(mainPath).isFile()) {
                    console.log(`Package ${currentModule} found at ${mainPath}.`);
                    analyzedModules.push(currentPath);
                    analyze(mainPath, null);
                    found = true;
                    break;
                }
            }
        }
    }
    if (!found) {
        console.error(`Error: required package ${currentModule} not found.`);
    }
}

function getCode(node, sourceCode) {
    /* get corresponding source code string of a node */
    if (node.range) {
        return sourceCode.substr(node.range[0], node.range[1] - node.range[0]).replace(/\n/g, '');
    } else {
        return null;
    }
};

function getParameterList(node) {
    /* get argument list of a function call */
    let p = [];
    if (node.params) {
        for (var i of node.params) {
            p.push(i.name);
        }
    }
    return p.join(', ');
};

function getFunctionDef(node) {
    /* get the line of code of a function call */
    let pl = getParameterList(node);
    let id = node.id ? node.id.name : '[anonymous]';
    return id + ' (' + pl + ')';
};

function dfs(currentNode, currentId, parentId, childNum, currentFunctionId, extra) {
    if (currentNode == null) return "";
    console.log(`Current node: ${currentId} ${currentNode.type} (line: ${currentNode.loc ? currentNode.loc.start.line : '?'}, parent: ${parentId}, funcid: ${currentFunctionId})`);
    let childNumberCounter = 0;
    let vNodeId, vNodeName, vNodeChildNumberCounter = 0;
    let ctype, phptype, phpflag;
    let prevFunctionId;
    let blockExtra;
    // switch (currentNode.constructor.name){
    fs.appendFile('./out.dat', currentNode.type + '\n', function(err) {
        if (err) return console.log(err);
    });
    switch (currentNode.type) {
        // case 'Script':
        // case 'Module':
        case 'Program':
            prevFunctionId = currentFunctionId;
            if (outputStyle == 'c') {
                for (var child of currentNode.body) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(child, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                }
            } else if (outputStyle == 'php') {
                currentFunctionId = currentId;
                // make CFG_FUNC_ENTRY artificial node
                nodeIdCounter++;
                let vCFGFuncEntryId = nodeIdCounter;
                relsStream.write([currentId, vCFGFuncEntryId, 'ENTRY'].join(delimiter) + '\n');
                nodes[vCFGFuncEntryId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_ENTRY',
                    name: filename,
                    funcId: currentFunctionId
                };
                // make CFG_FUNC_EXIT artificial node
                nodeIdCounter++;
                let vCFGFuncExitId = nodeIdCounter;
                relsStream.write([currentId, vCFGFuncExitId, 'EXIT'].join(delimiter) + '\n');
                nodes[vCFGFuncExitId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_EXIT',
                    name: filename,
                    funcId: currentFunctionId
                };
                // make AST_STMT_LIST virtual node
                nodeIdCounter++;
                let vASTStmtListId = nodeIdCounter;
                relsStream.write([currentId, vASTStmtListId, parentOf].join(delimiter) + '\n');
                nodes[vASTStmtListId] = {
                    label: 'AST_V',
                    type: 'AST_STMT_LIST',
                    childNum: childNum,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                childNumberCounter = 0;
                for (var child of currentNode.body) {
                    nodeIdCounter++;
                    blockExtra = {
                        childNumberCounter: childNumberCounter
                    };
                    relsStream.write([vASTStmtListId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(child, nodeIdCounter, vASTStmtListId, childNumberCounter, currentFunctionId, blockExtra);
                    childNumberCounter = blockExtra.childNumberCounter;
                    childNumberCounter++;
                }
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_TOPLEVEL',
                phpflag: 'TOPLEVEL_FILE',
                name: filename,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                // childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: prevFunctionId
            };
            break;
        case 'VariableDeclaration':
            if (outputStyle == 'c') {
                for (var child of currentNode.declarations) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(child, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null, null);
                    childNumberCounter++;
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'IdentifierDeclStatement',
                    kind: currentNode.kind,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php' && extra && extra.parentType == 'ForStatement') {
                for (var child of currentNode.declarations) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(child, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null, null);
                    childNumberCounter++;
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_EXPR_LIST',
                    kind: currentNode.kind,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php') {
                // Make its children its parent's children
                // Let's assume its parent is a BlockStatement node, which provides an 'extra' information,
                // otherwise the script can only handle one variable declaration.
                if (currentNode.declarations.length >= 1) {
                    if (extra && 'childNumberCounter' in extra) {
                        // console.log(`Got extra: ${JSON.stringify(extra)}`);
                        let firstChildFlag = true,
                            flattenedId;
                        for (var child of currentNode.declarations) {
                            if (firstChildFlag) {
                                firstChildFlag = false;
                                flattenedId = currentId;
                            } else {
                                nodeIdCounter++;
                                flattenedId = nodeIdCounter;
                                extra.childNumberCounter++;
                                relsStream.write([parentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                            }
                            dfs(child, flattenedId, parentId, extra.childNumberCounter, currentFunctionId, {
                                kind: currentNode.kind
                            });
                        }
                        break;
                    } else {
                        console.error("Situation cannot be handled: VariableDeclaration with more than one children but not under a BlockStatment or no extra information");
                        console.error(`Parent ID: ${parentId}, extra: ${JSON.stringify(extra)}`);
                    }
                }
                // dfs(currentNode.declarations[0], currentId, parentId, childNum, currentFunctionId, null);
            }
            break;
        case 'VariableDeclarator':
            if (outputStyle == 'c') {
                nodeIdCounter++;
                childNumberCounter = 0;
                let vVarTypeId = nodeIdCounter;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[vVarTypeId] = {
                    label: 'AST_V',
                    type: 'IdentifierDeclType',
                    code: 'any',
                    childNum: 0,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                nodeIdCounter++;
                relsStream.write([vVarTypeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.id, nodeIdCounter, vVarTypeId, 0, currentFunctionId, {
                    doNotUseVar: true
                });
                if (currentNode.init) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.init, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'IdentifierDecl',
                    phptype: 'AST_ASSIGN',
                    childNum: childNum,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php') {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.id, nodeIdCounter, currentId, 0, currentFunctionId, {
                    doNotUseVar: false,
                    kind: (extra && extra.kind) ? extra.kind : null
                });
                if (currentNode.init) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.init, nodeIdCounter, currentId, 1, currentFunctionId, null);
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'IdentifierDecl',
                    phptype: 'AST_ASSIGN',
                    phpflag: phpflag,
                    childNum: childNum,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'UpdateExpression':
            switch (currentNode.operator) {
                case '++':
                    phptype = currentNode.prefix ? 'AST_PRE_INC' : 'AST_POST_INC';
                    break;
                case '--':
                    phptype = currentNode.prefix ? 'AST_PRE_DEC' : 'AST_POST_DEC';
                    break;
            }
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: phptype,
                code: currentNode.operator || null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'UnaryExpression':
            if (currentNode.operator == 'typeof' && outputStyle == 'php') {
                // converts "typeof foo" to "gettype(foo)"
                // make the AST_NAME virtual node (childnum = 0)
                nodeIdCounter++;
                let vAstNameId = nodeIdCounter;
                relsStream.write([currentId, vAstNameId, parentOf].join(delimiter) + '\n');
                nodes[vAstNameId] = {
                    label: 'AST_V',
                    phptype: 'AST_NAME',
                    phpflag: 'NAME_NOT_FQ',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                // make the string virtual node ('gettype')
                nodeIdCounter++;
                let vAstGettypeStringId = nodeIdCounter;
                relsStream.write([vAstNameId, vAstGettypeStringId, parentOf].join(delimiter) + '\n');
                nodes[vAstGettypeStringId] = {
                    label: 'AST_V',
                    phptype: 'string',
                    code: 'gettype',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                // make the AST_ARG_LIST virtual node (childnum = 1)
                nodeIdCounter++;
                let vAstArgListId = nodeIdCounter;
                relsStream.write([currentId, vAstArgListId, parentOf].join(delimiter) + '\n');
                nodes[vAstArgListId] = {
                    label: 'AST_V',
                    phptype: 'AST_ARG_LIST',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 1,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                // goto the argument
                nodeIdCounter++;
                relsStream.write([vAstArgListId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.argument, nodeIdCounter, vAstArgListId, 0, currentFunctionId, null);
                // finally write the converted AST_CALL node
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_CALL',
                    code: currentNode.operator || null,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            } else {
                switch (currentNode.operator) {
                    case '!':
                        phpflag = 'UNARY_BOOL_NOT';
                        break;
                    case '~':
                        phpflag = 'UNARY_BITWISE_NOT';
                        break;
                    case '+':
                        phpflag = 'UNARY_PLUS';
                        break;
                    case '-':
                        phpflag = 'UNARY_MINUS';
                        break;
                }
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_UNARY_OP',
                    phpflag: phpflag,
                    code: currentNode.operator || null,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'AwaitExpression':
        case 'SpreadElement':
        case 'YieldExpression':
            phptype = 'AST_YIELD';
            switch (currentNode.type) {
                case 'AwaitExpression':
                    phpflag = 'JS_AWAIT_EXPRESSION';
                    break;
                case 'SpreadElement':
                    phpflag = 'JS_SPREAD_ELEMENT';
                    break;
                case 'YieldExpression':
                    phpflag = 'JS_YIELD';
                    if (this.delegate) phptype = 'AST_YIELD_FROM';
                    break;
            }
            // console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
            if (currentNode.argument) {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
            } else {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                // if argument is null, insert a NULL node
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId
                };
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: phptype,
                phpflag: phpflag,
                code: currentNode.operator || null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'BinaryExpression':
        case 'LogicalExpression':
        case 'AssignmentExpression':
        case 'AssignmentPattern':
            ctype = null;
            phptype = null;
            phpflag = null;
            if (currentNode.type == 'AssignmentExpression') {
                ctype = 'AssignmentExpression';
                switch (currentNode.operator) {
                    case '=':
                        phptype = 'AST_ASSIGN';
                        break;
                    case '+=':
                        phptype = 'AST_ASSIGN_OP';
                        phpflag = 'BINARY_ADD';
                        break;
                    case '-=':
                        phptype = 'AST_ASSIGN_OP';
                        phpflag = 'BINARY_SUB';
                        break;
                    case '*=':
                        phptype = 'AST_ASSIGN_OP';
                        phpflag = 'BINARY_MUL';
                        break;
                    case '/=':
                        phptype = 'AST_ASSIGN_OP';
                        phpflag = 'BINARY_DIV';
                        break;
                }
            } else if (currentNode.type == 'BinaryExpression') {
                phptype = 'AST_BINARY_OP';
                switch (currentNode.operator) {
                    case '+':
                        ctype = 'AdditiveExpression';
                        phpflag = 'BINARY_ADD';
                        break;
                    case '-':
                        ctype = 'AdditiveExpression';
                        phpflag = 'BINARY_SUB';
                        break;
                    case '*':
                        ctype = 'MultiplicativeExpression';
                        phpflag = 'BINARY_MUL';
                        break;
                    case '/':
                        ctype = 'MultiplicativeExpression';
                        phpflag = 'BINARY_DIV';
                        break;
                    case '==':
                        phpflag = 'BINARY_IS_EQUAL';
                        break;
                    case '!=':
                        phpflag = 'BINARY_IS_NOT_EQUAL';
                        break;
                    case '===':
                        phpflag = 'BINARY_IS_IDENTICAL';
                        break;
                    case '!==':
                        phpflag = 'BINARY_IS_NOT_IDENTICAL';
                        break;
                    case '<':
                        phpflag = 'BINARY_IS_SMALLER';
                        break;
                    case '<':
                        phpflag = 'BINARY_IS_GREATER';
                        break;
                    case '>=':
                        phpflag = 'BINARY_IS_GREATER_OR_EQUAL';
                        break;
                    case '<=':
                        phpflag = 'BINARY_IS_SMALLER_OR_EQUAL';
                        break;
                    case '&':
                        phpflag = 'BINARY_BITWISE_AND';
                        break;
                    case '|':
                        phpflag = 'BINARY_BITWISE_OR';
                        break;
                    case '^':
                        phpflag = 'BINARY_BITWISE_XOR';
                        break;
                }
            } else if (currentNode.type == 'LogicalExpression') {
                phptype = 'AST_BINARY_OP';
                switch (currentNode.operator) {
                    case '||':
                        phpflag = 'BINARY_BOOL_OR';
                        break;
                    case '&&':
                        phpflag = 'BINARY_BOOL_AND';
                        break;
                }
            } else if (currentNode.type == 'AssignmentPattern') {
                phptype = 'AST_ASSIGN';
                phpflag = 'JS_ASSIGNMENT_PATTERN';
            }
            // left
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.left, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // right
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.right, nodeIdCounter, currentId, 1, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                ctype: ctype,
                phptype: phptype,
                phpflag: phpflag,
                operator: currentNode.operator || null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'Literal':
            let phpLiteralType = typeof(currentNode.value);
            if (outputStyle == 'php' && (phpLiteralType == 'boolean' || phpLiteralType == 'object')) {
                // true, false or null
                nodeIdCounter++;
                let vNameId = nodeIdCounter;
                relsStream.write([currentId, vNameId, parentOf].join(delimiter) + '\n');
                nodes[vNameId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    phptype: 'AST_NAME',
                    phpflag: 'NAME_NOT_FQ',
                    code: currentNode.raw,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId,
                };
                nodeIdCounter++;
                let vTrueFalseId = nodeIdCounter;
                relsStream.write([vNameId, vTrueFalseId, parentOf].join(delimiter) + '\n');
                nodes[vTrueFalseId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    phptype: 'string',
                    code: currentNode.raw,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId,
                };
                nodes[currentId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    phptype: 'AST_CONST',
                    code: currentNode.raw,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    funcId: currentFunctionId,
                };
            } else {
                if (phpLiteralType === 'number') {
                    if (Number.isInteger(currentNode.value))
                        phpLiteralType = 'integer';
                    else
                        phpLiteralType = 'double';
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'PrimaryExpression',
                    phptype: phpLiteralType,
                    code: currentNode.raw,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    childNum: childNum,
                    funcId: currentFunctionId,
                };
            }
            break;
        case 'FunctionExpression':
        case 'FunctionDeclaration':
        case 'ArrowFunctionExpression':
            prevFunctionId = currentFunctionId;
            currentFunctionId = currentId;
            if (outputStyle == 'c') {
                // make FunctionDef virtual node
                nodeIdCounter++;
                let vFunctionDefId = nodeIdCounter;
                relsStream.write([currentId, vFunctionDefId, parentOf].join(delimiter) + '\n');
                // body
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([vFunctionDefId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, vFunctionDefId, 0, currentFunctionId, null);
                // returnType
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'ReturnType',
                    code: 'any',
                    childNum: 1,
                    funcId: currentFunctionId
                };
                // id
                if (currentNode.id) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.id, nodeIdCounter, vFunctionDefId, 2, currentFunctionId, null);
                }
                // params
                // Make a virtual node
                nodeIdCounter++;
                childNumberCounter++;
                vNodeId = nodeIdCounter;
                relsStream.write([vFunctionDefId, vNodeId, parentOf].join(delimiter) + '\n');
                vNodeChildNumberCounter = 0;
                for (param of currentNode.params) {
                    // write the Parameter virtual node
                    nodeIdCounter++;
                    let vParameterId = nodeIdCounter;
                    relsStream.write([vNodeId, vParameterId, parentOf].join(delimiter) + '\n');
                    nodes[vParameterId] = {
                        label: 'AST_V',
                        type: 'Parameter',
                        childNum: vNodeChildNumberCounter,
                        code: param.name || null,
                        funcId: currentFunctionId
                    };
                    vNodeChildNumberCounter++;
                    // write the ParameterType virtual node
                    nodeIdCounter++;
                    relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'ParameterType',
                        code: 'any',
                        childNum: 0,
                        funcId: currentFunctionId
                    };
                    // go to the parameter Identifier node
                    nodeIdCounter++;
                    relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(param, nodeIdCounter, vParameterId, 1, currentFunctionId, null);
                }
                // Write the params virtual node
                nodes[vNodeId] = {
                    label: 'AST_V',
                    type: 'FunctionDeclarationParams',
                    ctype: 'ParameterList',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 3,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getParameterList(currentNode),
                    funcId: currentFunctionId
                };
                // Write the FunctionDef virtual node
                nodes[vFunctionDefId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    ctype: 'FunctionDef',
                    code: getFunctionDef(currentNode),
                    childNum: 0,
                    funcId: currentFunctionId
                };
                // Finally, write the FunctionDeclaration itself
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'Function',
                    code: currentNode.id ? currentNode.id.name : null,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    // code: getCode(currentNode, sourceCode),
                    funcId: prevFunctionId // function itself does not use functionId
                };
            } else if (outputStyle == 'php') {
                phptype = null;
                phpflag = null;
                // make CFG_FUNC_ENTRY artificial node
                nodeIdCounter++;
                let vCFGFuncEntryId = nodeIdCounter;
                relsStream.write([currentId, vCFGFuncEntryId, 'ENTRY'].join(delimiter) + '\n');
                nodes[vCFGFuncEntryId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_ENTRY',
                    funcId: currentFunctionId
                };
                // make CFG_FUNC_EXIT artificial node
                nodeIdCounter++;
                let vCFGFuncExitId = nodeIdCounter;
                relsStream.write([currentId, vCFGFuncExitId, 'EXIT'].join(delimiter) + '\n');
                nodes[vCFGFuncExitId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_EXIT',
                    funcId: currentFunctionId
                };
                // id, childnum = 0
                if (currentNode.id) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.id, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, {
                        doNotUseVar: true
                    });
                    phptype = 'AST_FUNC_DECL';
                } else {
                    // anonymous function, or method in a class
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST',
                        type: 'string',
                        code: (extra && extra.methodName) ? extra.methodName : '{closure}',
                        childNum: childNumberCounter,
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId
                    };
                    if (extra && extra.methodName) {
                        phptype = 'AST_METHOD';
                        phpflag = 'MODIFIER_PUBLIC';
                    } else {
                        phptype = 'AST_CLOSURE';
                    }
                }
                childNumberCounter++;
                // NULL node, childnum = 1
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST',
                    type: 'NULL',
                    childNum: childNumberCounter,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    funcId: currentFunctionId
                };
                childNumberCounter++;
                // params, childnum = 2
                // Make a virtual node
                nodeIdCounter++;
                vNodeId = nodeIdCounter;
                relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
                vNodeChildNumberCounter = 0;
                for (param of currentNode.params) {
                    // write the Parameter virtual node
                    nodeIdCounter++;
                    let vParameterId = nodeIdCounter;
                    relsStream.write([vNodeId, vParameterId, parentOf].join(delimiter) + '\n');
                    nodes[vParameterId] = {
                        label: 'AST_V',
                        type: 'Parameter',
                        phptype: 'AST_PARAM',
                        childNum: vNodeChildNumberCounter,
                        code: param.name || null,
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId
                    };
                    // write the 1st NULL virtual node (childnum = 0)
                    nodeIdCounter++;
                    relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'ParameterType',
                        phptype: 'NULL',
                        childNum: 0,
                        code: 'any',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId
                    };
                    if (param.type == 'Identifier') { // no default value
                        // go to the parameter Identifier node (childnum = 1)
                        nodeIdCounter++;
                        relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        dfs(param, nodeIdCounter, vParameterId, 1, currentFunctionId, {
                            doNotUseVar: true
                        });
                        // write the 2nd NULL virtual node (childnum = 2)
                        nodeIdCounter++;
                        relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        nodes[nodeIdCounter] = {
                            label: 'AST_V',
                            // type: 'ParameterType',
                            phptype: 'NULL',
                            childNum: 2,
                            code: 'any',
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            funcId: currentFunctionId
                        };
                    } else if (param.type == 'AssignmentPattern') { // with default value
                        // go to the parameter Identifier node (childnum = 1)
                        nodeIdCounter++;
                        relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        dfs(param.left, nodeIdCounter, vParameterId, 1, currentFunctionId, {
                            doNotUseVar: true
                        });
                        // write the 2nd NULL virtual node (childnum = 2)
                        nodeIdCounter++;
                        relsStream.write([vParameterId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        dfs(param.right, nodeIdCounter, vParameterId, 2, currentFunctionId, {
                            doNotUseVar: true
                        });
                    }
                    // finally update the childnum counter
                    vNodeChildNumberCounter++;
                }
                // Write the params virtual node (childnum = 2)
                nodes[vNodeId] = {
                    label: 'AST_V',
                    type: 'FunctionDeclarationParams',
                    ctype: 'ParameterList',
                    phptype: 'AST_PARAM_LIST',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 2,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getParameterList(currentNode),
                    funcId: currentFunctionId
                };
                childNumberCounter++;
                // NULL node, childnum = 3 (anonymous function only)
                if (!currentNode.id && !(extra && extra.methodName)) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST',
                        type: 'NULL',
                        childNum: childNumberCounter,
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId
                    };
                    childNumberCounter++;
                }
                // body (statement list), childnum = 3 (named), 4 (anonymous)
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                childNumberCounter++;
                // NULL node, childnum = 4 (named), 5 (anonymous)
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST',
                    type: 'NULL',
                    childNum: childNumberCounter,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    funcId: currentFunctionId
                };
                childNumberCounter++;
                // return type node, childnum = 5
                // This node can be NULL node. Let's ignore it and use a NULL node first.
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST',
                    type: 'NULL',
                    childNum: childNumberCounter,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    funcId: currentFunctionId
                };
                childNumberCounter++;
                // Finally, write the FunctionDeclaration itself
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    ctype: 'Function',
                    phptype: phptype,
                    phpflag: phpflag,
                    code: currentNode.id ? currentNode.id.name : null,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    // code: getCode(currentNode, sourceCode),
                    funcId: prevFunctionId // function itself does not use functionId
                };
            }
            break;
        case 'ClassBody':
            if (outputStyle == 'php') {
                prevFunctionId = currentFunctionId;
                currentFunctionId = currentId;
                // make AST_TOPLEVEL virtual node, as the new parent node
                // nodeIdCounter++; // do not write this
                let vAstToplevelClass = nodeIdCounter;
                nodes[vAstToplevelClass] = {
                    label: 'AST_V',
                    type: 'AST_TOPLEVEL',
                    phpflag: 'TOPLEVEL_CLASS',
                    funcId: prevFunctionId
                };
                // make CFG_FUNC_ENTRY artificial node
                nodeIdCounter++;
                let vCFGFuncEntryId = nodeIdCounter;
                relsStream.write([vAstToplevelClass, vCFGFuncEntryId, 'ENTRY'].join(delimiter) + '\n');
                nodes[vCFGFuncEntryId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_ENTRY',
                    funcId: currentFunctionId
                };
                // make CFG_FUNC_EXIT artificial node
                nodeIdCounter++;
                let vCFGFuncExitId = nodeIdCounter;
                relsStream.write([vAstToplevelClass, vCFGFuncExitId, 'EXIT'].join(delimiter) + '\n');
                nodes[vCFGFuncExitId] = {
                    label: 'Artificial',
                    type: 'CFG_FUNC_EXIT',
                    funcId: currentFunctionId
                };
                // reserve a node id for AST_STMT_LIST
                nodeIdCounter++;
                let classBodyId = nodeIdCounter;
                // go into the body
                for (b of currentNode.body) {
                    nodeIdCounter++;
                    relsStream.write([classBodyId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    blockExtra = {
                        childNumberCounter: childNumberCounter
                    };
                    dfs(b, nodeIdCounter, classBodyId, childNumberCounter, currentFunctionId, blockExtra);
                    childNumberCounter = blockExtra.childNumberCounter;
                    childNumberCounter++;
                    /*
                        The purpose of childNumberCounter in blockExtra is to make VariableDeclaration
                        child node in the next recursion able to modify its parent's childNumberCounter,
                        so the VariableDeclarator nodes in PHP style can be flattened as if they are
                        BlockStatement's children instead of VariableDeclaration's children.
                    */
                }
                // finally, write the ClassBody node
                nodes[classBodyId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_STMT_LIST',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                currentFunctionId = prevFunctionId
            }
            break;
        case 'BlockStatement':
            ctype = 'CompoundStatement';
            phptype = 'AST_STMT_LIST';
            for (b of currentNode.body) {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                blockExtra = {
                    childNumberCounter: childNumberCounter
                };
                dfs(b, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, blockExtra);
                childNumberCounter = blockExtra.childNumberCounter;
                childNumberCounter++;
                /*
                    The purpose of childNumberCounter in blockExtra is to make VariableDeclaration
                    child node in the next recursion able to modify its parent's childNumberCounter,
                    so the VariableDeclarator nodes in PHP style can be flattened as if they are
                    BlockStatement's children instead of VariableDeclaration's children.
                */
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                ctype: ctype,
                phptype: phptype,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'SequenceExpression':
            for (e of currentNode.expressions) {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                let blockExtra = {
                    childNumberCounter: childNumberCounter
                };
                dfs(e, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, blockExtra);
                childNumberCounter = blockExtra.childNumberCounter;
                childNumberCounter++;
                /*
                    The purpose of childNumberCounter in blockExtra is to make VariableDeclaration
                    child node in the next recursion able to modify its parent's childNumberCounter,
                    so the VariableDeclarator nodes in PHP style can be flattened as if they are
                    BlockStatement's children instead of VariableDeclaration's children.
                */
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_EXPR_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'ReturnStatement':
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            if (currentNode.argument) {
                dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
            } else {
                // insert a NULL node
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId
                };
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_RETURN',
                code: currentNode.operator ? currentId.operator : null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'ArrayPattern':
            // console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
        case 'ArrayExpression':
            for (element of currentNode.elements) {
                // make AST_ARRAY_ELEM virtual node
                nodeIdCounter++;
                let vAstArrayElemId = nodeIdCounter;
                relsStream.write([currentId, vAstArrayElemId, parentOf].join(delimiter) + '\n');
                nodes[vAstArrayElemId] = {
                    label: 'AST_V',
                    type: currentNode.type + 'Element',
                    phptype: 'AST_ARRAY_ELEM',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNumberCounter,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                // value
                nodeIdCounter++;
                relsStream.write([vAstArrayElemId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(element, nodeIdCounter, currentId, 0, currentFunctionId, null);
                // key (null)
                nodeIdCounter++;
                relsStream.write([vAstArrayElemId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 1,
                    funcId: currentFunctionId
                };
                childNumberCounter++;
            }
            // Finally, write the ArrayPattern itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_ARRAY',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'RestElement':
            console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'ObjectPattern':
            // console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
        case 'ObjectExpression':
            // vNodeName = currentNode.type + 'Properties';
            // // Make a virtual node
            // // nodeIdCounter++;
            // // childNumberCounter++;
            // // vNodeId = nodeIdCounter;
            // // relsStream.write([currentId, vNodeId, parentOf].join(delimiter)+'\n');
            // // vNodeChildNumberCounter = 0;
            // for (prop of currentNode.properties) {
            //     nodeIdCounter++;
            //     // vNodeChildNumberCounter++;
            //     // relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter)+'\n');
            //     // dfs(param, nodeIdCounter, vNodeId, currentFunctionId, null);
            //     childNumberCounter++;
            //     relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            //     dfs(prop, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // }
            // // Write the virtual node
            // // nodes[vNodeId]=['AST_V',vNodeName,'',currentNode.loc?currentNode.loc.start.line:null,vNodeChildNumberCounter,'','','',currentNode.loc.end.line,'',''];
            // // Finally, write the ObjectPattern itself
            // nodes[currentId] = {
            //     label: 'AST',
            //     type: currentNode.type,
            //     lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
            //     childNum: childNum,
            //     lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
            //     colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
            //     colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
            //     code: getCode(currentNode, sourceCode),
            //     funcId: currentFunctionId
            // };
            if (outputStyle == 'php') {
                for (var prop of currentNode.properties) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(prop, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                    childNumberCounter++;
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_ARRAY',
                    phpflag: 'ARRAY_SYNTAX_SHORT',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    // code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'Property':
            if (outputStyle == 'php') {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.value, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.key, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, {
                    doNotUseVar: true
                });
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_ARRAY_ELEM',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    // code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'Identifier':
            let name = currentNode.name,
                code = getCode(currentNode, sourceCode);
            if (outputStyle == 'c' || (extra && extra.doNotUseVar)) {
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'string',
                    // name: name,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: code,
                    funcId: currentFunctionId
                };
            } else {
                // receive the kind information passed from VariableDeclaration via VariableDeclarator
                // then convert kind to PHP flag
                if (extra && extra.kind) {
                    switch (extra.kind) {
                        case 'var':
                            phpflag = 'JS_DECL_VAR';
                            break;
                        case 'let':
                            phpflag = 'JS_DECL_LET';
                            break;
                        case 'const':
                            phpflag = 'JS_DECL_CONST';
                            break;
                    }
                }
                // make AST_VAR virtual node
                let vAstVarId = currentId;
                nodes[vAstVarId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    phptype: 'AST_VAR',
                    phpflag: phpflag,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                nodeIdCounter++;
                relsStream.write([vAstVarId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                // write the Identifier node
                nodes[nodeIdCounter] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'string',
                    name: name,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: code,
                    funcId: currentFunctionId
                };
            }
            break;
        case 'MethodDefinition':
            // directly go to the value child node
            dfs(currentNode.value, currentId, parentId, childNum, currentFunctionId, {
                methodName: currentNode.key.name
            });
            // console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
            // nodeIdCounter++;
            // childNumberCounter++;
            // relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            // dfs(currentNode.key, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // nodeIdCounter++;
            // childNumberCounter++;
            // relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            // dfs(currentNode.value, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // nodes[currentId] = {
            //     label: 'AST',
            //     type: currentNode.type,
            //     code: currentNode.kind,
            //     lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
            //     childNum: childNum,
            //     lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
            //     colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
            //     colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
            //     funcId: currentFunctionId
            // };
            break;
        case 'ClassExpression':
        case 'ClassDeclaration':
            // console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
            if (outputStyle == 'c') {
                if (currentNode.id) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.id, nodeIdCounter, currentId, 0, currentFunctionId, null);
                }
                if (currentNode.superClass) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.superClass, nodeIdCounter, currentId, 0, currentFunctionId, null);
                }
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, currentId, 0, currentFunctionId, null);
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    code: currentNode.kind,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php') {
                // name/id
                if (currentNode.id) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.id, nodeIdCounter, currentId, 0, currentFunctionId, {
                        doNotUseVar: true
                    });
                }
                // docComment, insert a NULL node
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 1,
                    funcId: currentFunctionId
                };
                // extends/superClass
                if (currentNode.superClass) {
                    nodeIdCounter++;
                    let vAstNameId = nodeIdCounter;
                    relsStream.write([currentId, vAstNameId, parentOf].join(delimiter) + '\n');
                    nodes[vAstNameId] = {
                        label: 'AST_V',
                        phptype: 'AST_NAME',
                        phpflag: 'NAME_NOT_FQ',
                        childNum: 2,
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                        colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                        colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                        funcId: currentFunctionId
                    };
                    nodeIdCounter++;
                    relsStream.write([vAstNameId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.superClass, nodeIdCounter, vAstNameId, 0, currentFunctionId, {
                        doNotUseVar: true
                    });
                } else {
                    // no super class, insert a NULL node
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'NULL',
                        phptype: 'NULL',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: 2,
                        funcId: currentFunctionId
                    };
                }
                // implements, JavaScript does not support interface, insert a NULL node
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 3,
                    funcId: currentFunctionId
                };
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, currentId, 4, currentFunctionId, null);
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_CLASS',
                    code: currentNode.kind,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
            }
            break;
        case 'NewExpression':
        case 'CallExpression':
            vNodeName = currentNode.type + 'Arguments';
            if (currentNode.type == 'NewExpression') phptype = 'AST_NEW';
            else phptype = 'AST_CALL';
            // callee
            nodeIdCounter++; // virtual Callee node
            let vCalleeId = nodeIdCounter;
            relsStream.write([currentId, vCalleeId, parentOf].join(delimiter) + '\n');
            nodes[vCalleeId] = {
                label: 'AST_V',
                type: 'Callee',
                phptype: 'AST_NAME',
                phpflag: 'NAME_NOT_FQ',
                childNum: childNumberCounter,
                // code: currentNode.callee.name || getCode(currentNode.callee, sourceCode) || '',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            if (outputStyle == 'c') {
                nodeIdCounter++; // go to Identifier node
                relsStream.write([vCalleeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.callee, nodeIdCounter, vCalleeId, 0, currentFunctionId, null);
            } else if (outputStyle == 'php') {
                if (currentNode.callee.type == 'MemberExpression') {
                    // if it's a member function call, we need to convert it to the PHP format
                    phptype = 'AST_METHOD_CALL';
                    // overwrite the virtual Callee node
                    dfs(currentNode.callee.object, vCalleeId, currentId, 0, currentFunctionId);
                    // go to the method (member) child node
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.callee.property, nodeIdCounter, currentId, 1, currentFunctionId, {
                        doNotUseVar: true
                    });
                    childNumberCounter++;
                } else {
                    nodeIdCounter++;
                    relsStream.write([vCalleeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'Identifier',
                        phptype: 'string',
                        childNum: 0,
                        code: getCode(currentNode.callee, sourceCode),
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId
                    };
                }
            }
            childNumberCounter++;
            // arguments
            // Make a virtual ArgumentList node
            nodeIdCounter++;
            vNodeId = nodeIdCounter;
            relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
            vNodeChildNumberCounter = 0;
            for (argument of currentNode.arguments) {
                if (outputStyle == 'c') {
                    nodeIdCounter++; // virtual Argument node
                    let vArgumentId = nodeIdCounter;
                    relsStream.write([vNodeId, vArgumentId, parentOf].join(delimiter) + '\n');
                    nodes[vArgumentId] = {
                        label: 'AST_V',
                        type: 'Argument',
                        childNum: vNodeChildNumberCounter,
                        code: argument.name || argument.raw || '',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        funcId: currentFunctionId,
                    };
                    nodeIdCounter++; // go to Identifier / Literal node
                    vNodeChildNumberCounter++;
                    relsStream.write([vArgumentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(argument, nodeIdCounter, vArgumentId, 0, currentFunctionId, null);
                } else if (outputStyle == 'php') {
                    nodeIdCounter++; // virtual Argument node
                    relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(argument, nodeIdCounter, vNodeId, vNodeChildNumberCounter, currentFunctionId, null);
                }
                vNodeChildNumberCounter++;
            }
            // Write the virtual ArgumentList node
            nodes[vNodeId] = {
                label: 'AST_V',
                type: vNodeName,
                ctype: 'ArgumentList',
                phptype: 'AST_ARG_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNumberCounter,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode).match(/\(([^\)]*)\)/)[0],
                funcId: currentFunctionId
            };
            childNumberCounter++;
            // Finally, write the CallExpression/NewExpression itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: phptype,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                // code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            // if the callee is 'require', add the required module into the queue
            if (currentNode.callee && currentNode.callee.name == 'require') {
                if (currentNode.arguments && currentNode.arguments.length >= 1 && currentNode.arguments[0].type == 'Literal') {
                    requiredModules.push(currentNode.arguments[0].value);
                } else {
                    console.error(`Invalid require expression: ${getCode(currentNode, sourceCode)}`);
                }
            }
            break;
        case 'SwitchStatement':
            // discriminant
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.discriminant, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // cases
            // Make a virtual node
            nodeIdCounter++;
            vNodeId = nodeIdCounter;
            relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
            vNodeChildNumberCounter = 0;
            for (c of currentNode.cases) {
                nodeIdCounter++;
                relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(c, nodeIdCounter, vNodeId, vNodeChildNumberCounter, currentFunctionId, null);
                vNodeChildNumberCounter++;
            }
            // Write the virtual node
            nodes[vNodeId] = {
                label: 'AST_V',
                type: 'SwitchStatementCases',
                phptype: 'AST_SWITCH_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: 1,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            // Finally, write the SwitchStatement itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_SWITCH',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'SwitchCase':
            // test
            if (currentNode.test) {
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.test, nodeIdCounter, currentId, 0, currentFunctionId, null);
            } else {
                // insert a NULL node
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId
                };
            }
            // consequent
            // Make a virtual node
            nodeIdCounter++;
            childNumberCounter++;
            vNodeId = nodeIdCounter;
            relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
            vNodeChildNumberCounter = 0;
            // go to consequents
            for (c of currentNode.consequent) {
                nodeIdCounter++;
                blockExtra = {
                    childNumberCounter: childNumberCounter
                };
                relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(c, nodeIdCounter, vNodeId, vNodeChildNumberCounter, currentFunctionId, blockExtra);
                vNodeChildNumberCounter = blockExtra.childNumberCounter;
                vNodeChildNumberCounter++;
            }
            // Write the virtual node
            nodes[vNodeId] = {
                label: 'AST_V',
                type: 'SwitchCaseConsequents',
                phptype: 'AST_STMT_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: 1,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            // Finally, write the SwitchCase itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_SWITCH_CASE',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'WhileStatement':
            // test
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.test, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // body
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.body, nodeIdCounter, currentId, 1, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_WHILE',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'WithStatement':
            console.log(`  Warning: uncompleted support for ${currentNode.type}.`);
            // object
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.object, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // body
            nodeIdCounter++;
            childNumberCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.body, nodeIdCounter, currentId, 0, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'ForStatement':
            // init
            if (currentNode.init) {
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.init, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, {
                    parentType: 'ForStatement'
                });
                childNumberCounter++;
            }
            // test
            if (currentNode.test) {
                if (outputStyle == 'c') {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.test, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
                } else if (outputStyle == 'php') {
                    // make the AST_EXPR_LIST virtual node
                    nodeIdCounter++;
                    let vExprListId = nodeIdCounter;
                    relsStream.write([currentId, vExprListId, parentOf].join(delimiter) + '\n');
                    // go to the test child node
                    nodeIdCounter++;
                    relsStream.write([vExprListId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.test, nodeIdCounter, vExprListId, 0, currentFunctionId, {
                        parentType: 'ForStatement'
                    });
                    // write the AST_EXPR_LIST virtual node
                    nodes[vExprListId] = {
                        label: 'AST_V',
                        type: 'SequenceExpression',
                        phptype: 'AST_EXPR_LIST',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: childNumberCounter,
                        lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                        colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                        colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                        funcId: currentFunctionId
                    };
                }
                childNumberCounter++;
            }
            // update
            if (currentNode.update) {
                if (outputStyle == 'php' && currentNode.update.type != 'SequenceExpression') {
                    // make the AST_EXPR_LIST virtual node
                    nodeIdCounter++;
                    let vExprListId = nodeIdCounter;
                    relsStream.write([currentId, vExprListId, parentOf].join(delimiter) + '\n');
                    // go to the update child node
                    nodeIdCounter++;
                    relsStream.write([vExprListId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.update, nodeIdCounter, vExprListId, 0, currentFunctionId, {
                        parentType: 'ForStatement'
                    });
                    // write the AST_EXPR_LIST virtual node
                    nodes[vExprListId] = {
                        label: 'AST_V',
                        type: 'SequenceExpression',
                        phptype: 'AST_EXPR_LIST',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: childNumberCounter,
                        lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                        colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                        colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                        funcId: currentFunctionId
                    };
                } else { // C or the update node is already a SequenceExpression node (more than one updates)
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.update, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, {
                        parentType: 'ForStatement'
                    });
                }
                childNumberCounter++;
            }
            // body
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.body, nodeIdCounter, currentId, childNumberCounter, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_FOR',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            childNumberCounter++;
            break;
        case 'ForInStatement':
        case 'ForOfStatement':
            if (outputStyle == 'c') {
                // left
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.left, nodeIdCounter, currentId, 0, currentFunctionId, null);
                // right
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.right, nodeIdCounter, currentId, 1, currentFunctionId, null);
                // body
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, currentId, 2, currentFunctionId, null);
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_FOREACH',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                break;
            } else if (outputStyle == 'php') {
                // right
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.right, nodeIdCounter, currentId, 0, currentFunctionId, null);
                if (currentNode.type == 'ForInStatement') {
                    // null (value)
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'NULL',
                        phptype: 'NULL',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: 1,
                        funcId: currentFunctionId
                    };
                    // left (key)
                    if (currentNode.left.declarations && currentNode.left.declarations[0]) {
                        // make AST_VAR virtual node
                        nodeIdCounter++;
                        let vAstVarId = nodeIdCounter;
                        nodes[vAstVarId] = {
                            label: 'AST_V',
                            type: 'VariableDeclarator',
                            phptype: 'AST_VAR',
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            childNum: 2,
                            funcId: currentFunctionId
                        };
                        nodeIdCounter++;
                        relsStream.write([vAstVarId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        // write the Identifier node
                        nodes[nodeIdCounter] = {
                            label: 'AST',
                            type: 'Identifier',
                            phptype: 'string',
                            name: currentNode.left.declarations[0].id.name,
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            childNum: 0,
                            code: currentNode.left.declarations[0].id.name,
                            funcId: currentFunctionId
                        };
                    } else {
                        console.error('Abnormal for loop that program cannot handle.')
                    }
                } else if (currentNode.type == 'ForOfStatement') {
                    // left (value)
                    if (currentNode.left.declarations && currentNode.left.declarations[0]) {
                        // make AST_VAR virtual node
                        nodeIdCounter++;
                        let vAstVarId = nodeIdCounter;
                        nodes[vAstVarId] = {
                            label: 'AST_V',
                            type: 'VariableDeclarator',
                            phptype: 'AST_VAR',
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            childNum: 1,
                            funcId: currentFunctionId
                        };
                        nodeIdCounter++;
                        relsStream.write([vAstVarId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        // write the Identifier node
                        nodes[nodeIdCounter] = {
                            label: 'AST',
                            type: 'Identifier',
                            phptype: 'string',
                            name: currentNode.left.declarations[0].id.name,
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            childNum: 0,
                            code: currentNode.left.declarations[0].id.name,
                            funcId: currentFunctionId
                        };
                    } else {
                        console.error('Abnormal for loop that program cannot handle.')
                    }
                    // null (key)
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'NULL',
                        phptype: 'NULL',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: 2,
                        funcId: currentFunctionId
                    };
                }
                // body
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.body, nodeIdCounter, currentId, 3, currentFunctionId, null);
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'AST_FOREACH',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
            }
        case 'ExpressionStatement':
            if (outputStyle == 'php') { // Ignore this level in PHP
                dfs(currentNode.expression, nodeIdCounter, parentId, childNum, currentFunctionId, null);
            } else if (outputStyle == 'c') {
                // expression
                nodeIdCounter++;
                childNumberCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.expression, nodeIdCounter, currentId, 0, currentFunctionId, null);
                // directive
                if (currentNode.directive) {
                    nodeIdCounter++;
                    childNumberCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.directive, nodeIdCounter, currentId, 0, currentFunctionId, null);
                }
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'MemberExpression':
            if (outputStyle == 'php') {
                // object
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.object, nodeIdCounter, currentId, 0, currentFunctionId, null);
                // property
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.property, nodeIdCounter, currentId, 1, currentFunctionId, {
                    doNotUseVar: true
                });
                if (getCode(currentNode, sourceCode).search(/\[/) != -1) // PHP distinguishes subscript and member, but JavaScript does not
                    phptype = 'AST_DIM';
                else
                    phptype = 'AST_PROP';
                nodes[currentId] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: phptype,
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'TemplateLiteral':
            if (outputStyle == 'c') {
                // quasis
                // Make a virtual node
                nodeIdCounter++;
                childNumberCounter++;
                vNodeId = nodeIdCounter;
                relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
                vNodeChildNumberCounter = 0;
                for (q of currentNode.quasis) {
                    nodeIdCounter++;
                    vNodeChildNumberCounter++;
                    relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(q, nodeIdCounter, vNodeId, 0, currentFunctionId, null);
                }
                // Write the virtual node
                nodes[vNodeId] = {
                    label: 'AST_V',
                    type: 'TemplateLiteralQuasis',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                // expressions
                // Make a virtual node
                nodeIdCounter++;
                childNumberCounter++;
                vNodeId = nodeIdCounter;
                relsStream.write([currentId, vNodeId, parentOf].join(delimiter) + '\n');
                vNodeChildNumberCounter = 0;
                for (e of currentNode.expressions) {
                    nodeIdCounter++;
                    vNodeChildNumberCounter++;
                    relsStream.write([vNodeId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(e, nodeIdCounter, vNodeId, 0, currentFunctionId, null);
                }
                // Write the virtual node
                nodes[vNodeId] = {
                    label: 'AST_V',
                    type: 'TemplateLiteralExpressions',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php') {
                // Warning: experimental support in PHP format.
                // quasis
                for (q of currentNode.quasis) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(q, nodeIdCounter, vNodeId, childNumberCounter, currentFunctionId, null);
                    childNumberCounter++;
                }
                // expressions
                for (e of currentNode.expressions) {
                    nodeIdCounter++;
                    relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(e, nodeIdCounter, vNodeId, childNumberCounter, currentFunctionId, null);
                    childNumberCounter++;
                }
            }
            // Finally, write the TemplateLiteral itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_ENCAPS_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'TemplateElement':
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'string',
                code: currentNode.value.raw,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'IfStatement':
            // test
            // Make a virtual node
            nodeIdCounter++;
            let testId = nodeIdCounter;
            relsStream.write([currentId, testId, parentOf].join(delimiter) + '\n');
            // go to test
            nodeIdCounter++;
            relsStream.write([testId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.test, nodeIdCounter, testId, 0, currentFunctionId, null);
            // Write the virtual node
            nodes[testId] = {
                label: 'AST_V',
                type: 'IfStatementTest',
                phptype: 'AST_IF_ELEM',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 0,
                funcId: currentFunctionId
            };
            // consequent
            if (outputStyle == 'c') {
                // Make a virtual node
                nodeIdCounter++;
                let consequentId = nodeIdCounter;
                relsStream.write([currentId, consequentId, parentOf].join(delimiter) + '\n');
                // goto the consequent child node
                nodeIdCounter++;
                relsStream.write([consequentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                dfs(currentNode.consequent, nodeIdCounter, consequentId, 0, currentFunctionId, null);
                // Write the virtual node
                nodes[consequentId] = {
                    label: 'AST_V',
                    type: 'IfStatementConsequent',
                    phptype: 'AST_STMT_LIST',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    childNum: 1,
                    funcId: currentFunctionId
                };
            } else if (outputStyle == 'php') {
                // If the child is not BlockStatement (AST_STMT_LIST in php), make the AST_STMT_LIST virtual node
                if (currentNode.consequent.type != 'BlockStatement') {
                    nodeIdCounter++;
                    let consequentId = nodeIdCounter;
                    relsStream.write([testId, consequentId, parentOf].join(delimiter) + '\n');
                    nodeIdCounter++;
                    relsStream.write([consequentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.consequent, nodeIdCounter, consequentId, 0, currentFunctionId, null);
                    // Write the AST_STMT_LIST virtual node
                    nodes[consequentId] = {
                        label: 'AST_V',
                        type: 'IfStatementConsequent',
                        phptype: 'AST_STMT_LIST',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: childNum,
                        lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                        colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                        colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                        childNum: 1,
                        funcId: currentFunctionId
                    };
                } else { // If the child is BlockStatement
                    // goto the consequent child node
                    nodeIdCounter++;
                    relsStream.write([testId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    dfs(currentNode.consequent, nodeIdCounter, testId, 1, currentFunctionId, null);
                }
            }
            // alternate (else)
            if (currentNode.alternate) {
                if (outputStyle == 'php') {
                    // Make the first virtual node
                    nodeIdCounter++;
                    let elseIfElemId = nodeIdCounter;
                    relsStream.write([currentId, elseIfElemId, parentOf].join(delimiter) + '\n');
                    // insert NULL node
                    nodeIdCounter++;
                    relsStream.write([elseIfElemId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                    nodes[nodeIdCounter] = {
                        label: 'AST_V',
                        type: 'NULL',
                        phptype: 'NULL',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        childNum: 0,
                        funcId: currentFunctionId
                    };
                    // If the child is not BlockStatement (AST_STMT_LIST in php), make the second virtual node
                    if (currentNode.alternate.type != 'BlockStatement') {
                        nodeIdCounter++;
                        let alternateId = nodeIdCounter;
                        relsStream.write([elseIfElemId, alternateId, parentOf].join(delimiter) + '\n');
                        nodeIdCounter++;
                        relsStream.write([alternateId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        dfs(currentNode.alternate, nodeIdCounter, alternateId, 0, currentFunctionId, null);
                        // Write the second virtual node
                        nodes[alternateId] = {
                            label: 'AST_V',
                            type: 'IfStatementAlternate',
                            phptype: 'AST_STMT_LIST',
                            lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                            childNum: childNum,
                            lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                            colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                            colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                            childNum: 1,
                            funcId: currentFunctionId
                        };
                    } else { // If the child is BlockStatement
                        nodeIdCounter++;
                        relsStream.write([elseIfElemId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                        dfs(currentNode.alternate, nodeIdCounter, elseIfElemId, 1, currentFunctionId, null);
                    }
                    // Write the first virtual node
                    nodes[elseIfElemId] = {
                        label: 'AST_V',
                        type: 'IfStatementTest',
                        phptype: 'AST_IF_ELEM',
                        lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                        lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                        colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                        colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                        childNum: 1,
                        funcId: currentFunctionId
                    };
                }
            }
            // Write the virtual node
            nodes[testId] = {
                label: 'AST_V',
                type: 'IfStatementTest',
                phptype: 'AST_IF_ELEM',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 0,
                funcId: currentFunctionId
            };
            // Finally, write the IfStatement itself
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_IF',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                // code: getCode(currentNode, sourceCode), // code would be too long
                funcId: currentFunctionId
            };
            break;
        case 'ThisExpression':
            if (outputStyle == 'php') {
                // make AST_VAR virtual node
                let vAstVarId = currentId;
                nodes[vAstVarId] = {
                    label: 'AST_V',
                    type: currentNode.type,
                    phptype: 'AST_VAR',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: childNum,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    funcId: currentFunctionId
                };
                nodeIdCounter++;
                relsStream.write([vAstVarId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                // write the Identifier node
                nodes[nodeIdCounter] = {
                    label: 'AST',
                    type: currentNode.type,
                    phptype: 'string',
                    name: 'this',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                    colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                    colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                    code: getCode(currentNode, sourceCode),
                    funcId: currentFunctionId
                };
            }
            break;
        case 'ConditionalExpression':
            // test
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.test, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // consequent
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.consequent, nodeIdCounter, currentId, 1, currentFunctionId, null);
            // alternate
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.alternate, nodeIdCounter, currentId, 2, currentFunctionId, null);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_CONDITIONAL',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'ContinueStatement':
        case 'BreakStatement':
            if (currentNode.type == 'ContinueStatement') phptype = 'AST_CONTINUE';
            else if (currentNode.type == 'BreakStatement') phptype = 'AST_BREAK';
            if (outputStyle == 'php') {
                // NULL node for depth (different in PHP & JS, currently no support)
                if (currentNode.label) console.log(`  Warning: uncompleted support for ${currentNode.type} with labels.`);
                nodeIdCounter++;
                relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId
                };
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: phptype,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        case 'EmptyStatement':
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'NULL',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                childNum: childNum,
                funcId: currentFunctionId
            };
            break;
        case 'TryStatement':
            // block
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.block, nodeIdCounter, currentId, 0, currentFunctionId, null);
            // handler
            // make a virtual AST_CATCH_LIST node
            nodeIdCounter++;
            let vAstCatchListId = nodeIdCounter;
            relsStream.write([currentId, vAstCatchListId, parentOf].join(delimiter) + '\n');
            // go to handler
            nodeIdCounter++;
            relsStream.write([vAstCatchListId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.handler, nodeIdCounter, vAstCatchListId, 0, currentFunctionId, null);
            // write the virtual AST_CATCH_LIST node
            nodes[vAstCatchListId] = {
                label: 'AST_V',
                type: 'TryStatementCatchList',
                phptype: 'AST_CATCH_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 1,
                funcId: currentFunctionId
            };
            // finalizer
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.finalizer, nodeIdCounter, currentId, 2, currentFunctionId, null);
            // finally, write the TryStatement node
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_TRY',
                code: currentNode.operator ? currentId.operator : null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'CatchClause':
            // make a virtual AST_NAME_LIST node
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            nodes[nodeIdCounter] = {
                label: 'AST_V',
                type: 'AstNameList',
                phptype: 'AST_NAME_LIST',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 0,
                funcId: currentFunctionId
            };
            // make a virtual AST_NAME node
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            nodes[nodeIdCounter] = {
                label: 'AST_V',
                type: 'AstName',
                phptype: 'AST_NAME',
                phpflag: 'NAME_NOT_FQ',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 0,
                funcId: currentFunctionId
            };
            // make a virtual string node
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            nodes[nodeIdCounter] = {
                label: 'AST_V',
                type: 'Literal',
                phptype: 'string',
                code: 'Exception',
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: 0,
                funcId: currentFunctionId
            };
            // param
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.param, nodeIdCounter, currentId, 1, currentFunctionId, null);
            // body
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            dfs(currentNode.body, nodeIdCounter, currentId, 2, currentFunctionId, null);
            // finally, write the CatchClause node
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_CATCH',
                code: currentNode.operator ? currentId.operator : null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                funcId: currentFunctionId
            };
            break;
        case 'ThrowStatement':
            nodeIdCounter++;
            relsStream.write([currentId, nodeIdCounter, parentOf].join(delimiter) + '\n');
            if (currentNode.argument) {
                dfs(currentNode.argument, nodeIdCounter, currentId, 0, currentFunctionId, null);
            } else {
                // insert a NULL node
                nodes[nodeIdCounter] = {
                    label: 'AST_V',
                    type: 'NULL',
                    phptype: 'NULL',
                    lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                    childNum: 0,
                    funcId: currentFunctionId
                };
            }
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                phptype: 'AST_THROW',
                code: currentNode.operator ? currentId.operator : null,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                childNum: childNum,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                code: getCode(currentNode, sourceCode),
                funcId: currentFunctionId
            };
            break;
        default:
            console.log(`  ${currentNode.type} goes default.`);
            nodes[currentId] = {
                label: 'AST',
                type: currentNode.type,
                lineLocStart: currentNode.loc ? currentNode.loc.start.line : null,
                lineLocEnd: currentNode.loc ? currentNode.loc.end.line : null,
                colLocStart: currentNode.loc ? currentNode.loc.start.column : null,
                colLocEnd: currentNode.loc ? currentNode.loc.end.column : null,
                childNum: childNum,
                funcId: currentFunctionId
            };
            break;
    }
};

function analyze(filePath, parentNodeId) {
    // read the file
    filename = filePath;
    console.log("Analyzing " + filename);
    sourceCode = fs.readFileSync(filePath, 'utf8');
    // initialize
    let currentId = nodeIdCounter;
    if (outputStyle == 'php') {
        if (parentNodeId !== null) {
            relsStream.write([parentNodeId, currentId, 'DIRECTORY_OF'].join(delimiter) + '\n');
        }
        nodes[currentId] = {
            label: 'Filesystem',
            type: 'File',
            name: filename
        };
    } else if (outputStyle == 'c') {
        if (parentNodeId !== null) {
            relsStream.write([parentNodeId, currentId, 'IS_DIRECTORY_OF'].join(delimiter) + '\n');
        }
        nodes[currentId] = {
            label: 'Filesystem',
            type: 'File',
            name: filename
        };
    }
    nodeIdCounter++;
    // parse
    try {
        var root = esprima.parseModule(sourceCode, {
            loc: true,
            range: true
        });
    } catch (e) {
        console.log(e);
    }
    console.dir(root);
    // console.log(JSON.stringify(root, null, 2));
    let rootId = nodeIdCounter;
    dfs(root, rootId, rootId - 1, 0, null, null);
    // output
    for (var i in nodes) {
        let u = nodes[i];
        let label = u.label;
        label = label == 'AST_V' ? 'AST' : u.label; // AST_V -> AST
        let childNum = u.childNum === 0 ? 0 : u.childNum || '';
        if (outputStyle == 'php') {
            let code = u.operator || u.code || '';
            if (delimiter != ',') {
                code = code.replace(/\t|\n/g, '');
            }
            if (code.search(/\s|,|"/) != -1) {
                code = '"' + code.replace(/"/g, '\"\"') + '"'; // quote code if space or comma is found
                // code = ""; // delete code if space or comma is found
            }
            nodesStream.write([i, label, u.phptype || u.type, u.phpflag || '',
                u.lineLocStart || '', code, childNum, u.funcId || '', '', '', u.lineLocEnd || '', u.name || '', ''
            ].join(delimiter) + '\n');
        } else if (outputStyle == 'c') {
            if (i == 0) continue;
            label = 'ANR';
            let location = u.lineLocStart ? [u.lineLocStart, u.colLocStart || 0, u.lineLocEnd || '', u.colLocEnd || 0].join(':') : '';
            let code = u.code || u.name || '';
            if (delimiter != ',') {
                code = code.replace(/\t|\n/g, '');
            }
            if (code.search(/\s|,|"/) != -1) {
                code = '"' + code.replace(/"/g, '\"\"') + '"';
            }
            nodesStream.write([label, i, u.ctype || u.type, code, location,
                u.funcId || '', childNum, '', u.operator || '', '', '', ''
            ].join(delimiter) + '\n');
        }
    }

    if (outputStyle == 'php') {
        relsStream.write([rootId - 1, rootId, 'FILE_OF'].join(delimiter) + '\n');
    } else if (outputStyle == 'c') {
        relsStream.write([rootId - 1, rootId, 'IS_FILE_OF'].join(delimiter) + '\n');
    }

    nodeIdCounter++;
    nodes = []; // reset the node array but not the nodeIdCounter
};

nodesStream.end();
relsStream.end();
