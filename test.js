var runtime = process.versions['electron'] ? 'electron': 'node';
var name = runtime + '-v' + process.versions.modules + '-' + process.platform + '-' + process.arch
