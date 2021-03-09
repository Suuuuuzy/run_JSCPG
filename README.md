OPGen
=======

OPGen is a tool that generates object property graph (OPG) and analyze
vulnerabilities for JavaScript.

## Installation
OPGen requires Python 3.7+ and Node.js 12+. To set up the environment, simply
run `install.sh`.

## Command line arguments
Use the following arugments to run the tool:

```bash
generate_graph.py [-h] [-p] [-t VUL_TYPE] [-P] [-m] [-q] [-s] [-a]
                  [-f FUNCTION_TIMEOUT] [-c CALL_LIMIT]
                  [-e ENTRY_FUNC] [input_file]
```

| Argument | Description |
| -------- | ----------- |
| `input_file` | See subsection Input. |
|  `-p, --print` | Print logs to console, instead of files. |
| `-t VUL_TYPE, --vul-type VUL_TYPE` | Set the vulnerability type to be checked. (See the Vulterability Types section.) |
| `-P, --prototype-pollution, --pp` | Shortcut for checking prototype pollution. |
| `-m, --module` | Module mode. Indicate the input is a module, instead of a script. This implies -a. |
| `--export LEVEL` | export the graph to Neo4J. The value can be 'light' or 'all'. Run import2neo4j.sh after the generation. | 
| `-a, --run-all` | Run all exported functions in module.exports. By default, only main functions will be run. |
| `-q, --exit` | Exit the analysis immediately when vulnerability is found. Do not use this if you need a complete graph. |
| `-s, --single-branch` | Single branch mode (or single execution). Do not execute multiple branches in parallel. |
| `-f SEC, --function-timeout SEC` | Set the time limit when running all exported function, in seconds. (Defaults to no limit.) Do NOT use this parameter as it is very unstable.
| `-c CALL_LIMIT, --call-limit CALL_LIMIT` | Set the how many times at most the same call statement can appear in the caller stack. (Defaults to 3.) |
| `-e ENTRY_FUNC, --entry-func ENTRY_FUNC` | Mannualy set the entry point function. Use this parameter only if you know which function to start the analysis with. This only affects the input module, i.e., dependent packages will not be affected. |

## Input

The tool accepts any of the three input types.

1. Use `-` to get source code from stdin.
2. Use a path to specify a source code file (or directory).
3. Ignore the argument to analyze AST CSV files (`./nodes.csv` and `./rels.csv`).

## Examples

```shell
$ ./generate_opg.py ./tests/test.js -m -t os_command
```
