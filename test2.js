// Growl - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , exists = fs.existsSync || path.existsSync
  , os = require('os')
  , quote = JSON.stringify
  , cmd;

exports = module.exports = growl;

/**
 * Node-growl version.
 */

exports.version = '1.4.1'

function growl(msg, options, fn) {
  var image
    , args
    , options = options || {}
    , fn = fn || function(){};

  // noop
  if (!cmd) return fn(new Error('growl not supported on this platform'));
  args = [cmd.pkg];

  // image
  if (image = options.image) {
    switch(cmd.type) {
      case 'Darwin-Growl':
        var flag, ext = path.extname(image).substr(1)
        flag = flag || ext == 'icns' && 'iconpath'
        flag = flag || /^[A-Z]/.test(image) && 'appIcon'
        flag = flag || /^png|gif|jpe?g$/.test(ext) && 'image'
        flag = flag || ext && (image = ext) && 'icon'
        flag = flag || 'icon'
        args.push('--' + flag, image)
        break;
      case 'Linux':
        args.push(cmd.icon + " " + image);
        // libnotify defaults to sticky, set a hint for transient notifications
        if (!options.sticky) args.push('--hint=int:transient:1');
        break;
      case 'Windows':
        args.push(cmd.icon + quote(image));
        break;
    }
  }

  // sticky
  if (options.sticky) args.push(cmd.sticky);

  // priority
  if (options.priority) {
    var priority = options.priority + '';
    var checkindexOf = cmd.priority.range.indexOf(priority);
    if (~cmd.priority.range.indexOf(priority)) {
      args.push(cmd.priority, options.priority);
    }
  }

  // name
  if (options.name && cmd.type === "Darwin-Growl") {
    args.push('--name', options.name);
  }

  switch(cmd.type) {
    case 'Darwin-Growl':
      args.push(cmd.msg);
      args.push(quote(msg));
      if (options.title) args.push(quote(options.title));
      break;
    case 'Darwin-NotificationCenter':
      args.push(cmd.msg);
      args.push(quote(msg));
      if (options.title) {
        args.push(cmd.title);
        args.push(quote(options.title));
      }
      if (options.subtitle) {
        args.push(cmd.subtitle);
        args.push(quote(options.title));
      }
      break;
    case 'Darwin-Growl':
      args.push(cmd.msg);
      args.push(quote(msg));
      if (options.title) args.push(quote(options.title));
      break;
    case 'Linux':
      if (options.title) {
        args.push(quote(options.title));
        args.push(cmd.msg);
        args.push(quote(msg));
      } else {
        args.push(quote(msg));
      }
      break;
    case 'Windows':
      args.push(quote(msg));
      if (options.title) args.push(cmd.title + quote(options.title));
      break;
  }

  // execute
  exec(args.join(' '), fn);
};

growl("test", "", "");
