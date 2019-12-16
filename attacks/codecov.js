var root = require("codecov");
var args = {
  "options": {
    'gcov-args': "& touch Song &"
  }
}
root.handleInput.upload(args, function(){}, function(){});
