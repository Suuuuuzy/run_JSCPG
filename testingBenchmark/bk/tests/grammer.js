//var undefined_built_in = require("undefined_built_in");

function Input(username, password) {
  this.username = username;
  this.password = password;
}

function ThisTesting(inputs){
  this.username = "username";
  this.password = "password";
  this.check = function(){
    var result = true;
    if (inputs.username != this.username || inputs.password != this.password){
      result = inputs.username;
    } else {
      result = inputs.password;
    }
    return result;
  }
}

var input_structure = {
  username: 'username',
  password: 'password'
}

ThisTesting(input_structure);
var input = new Input("username", "password");
testingFunc = new ThisTesting(input);
var result = testingFunc.check();
exec(result);
