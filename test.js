function pure(test) {
  return parseInt(test);
}

var command = "testing";
command = pure(command);
exec(command);
