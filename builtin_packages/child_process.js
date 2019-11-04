function exec(command, options='nothing',callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_hqbpillvul_exec(sink);
  callback(err, stdout, stderr);
}

function execSync(command, options='nothing',callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_hqbpillvul_execSync(sink);
  callback(err, stdout, stderr);
}

function execFile(command, options='nothing', dict='nothing', callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_hqbpillvul_execFile(sink);
  callback(err, stdout, stderr);
}

module.exports = {
  exec,
  execFile,
  execSync
}
