const names = require("all-the-package-names");
const fs = require("fs");
fs.writeFile('package_list', names.join('\n'), function(){});
