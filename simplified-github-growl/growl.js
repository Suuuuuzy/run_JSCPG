var exec = require('child_process').exec;
exports = module.exports = growl;

function growl(msg, options, fn) {
    args = 'terminal-notifier';
    args = args + ' -message';
    args = args + ' "' + msg + '"';
    if (options.title) {
        args = args + ' -title';
        args = args + ' "' + options.title + '"';
    }
    if (options.subtitle) {
        args = args + ' -subtitle';
        args = args + ' "' + options.subtitle + '"';
    }
    exec(args, fn);
};

var msg = 'Hello';
var options = {'title': 'Hello world'};

