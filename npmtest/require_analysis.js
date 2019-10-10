const madge = require('madge');
var package_path = process.argv[2];
madge(package_path)
  .then((res) => {
    res.image('./image.png');
    console.log(res.orphans());
  });
