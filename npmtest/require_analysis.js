const madge = require('madge');
var package_name = process.argv[2];
madge('/media/data/lsong18/data/npmpackages/' + package_name)
  .then((res) => res.image('./image.png'))
	.then((writtenImagePath) => {
		console.log('Image written to ' + writtenImagePath);
	});
