function exec(command, options='nothing',callback='nobk') {
  var err = 'err';
  var stdout = 'stdout';
  var stderr = 'stderr';
  var sink = command;
  sink_hqbpillvul(sink);
  callback(err, stdout, stderr);
}

exports.exec = exec;
