function exec(command, options='nothing',callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_exec_hqbpillvul(sink);
  callback(err, stdout, stderr);
}

function execSync(command, options='nothing',callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_execSync_hqbpillvul(sink);
  callback(err, stdout, stderr);
}

function execFile(command, options='nothing', dict='nothing', callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_execFile_hqbpillvul(sink);
  callback(err, stdout, stderr);
}

module.exports = {
  exec,
  execFile,
  execSync
}
