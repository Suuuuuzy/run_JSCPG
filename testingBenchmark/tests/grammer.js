var undefined_built_in = require("undefined_built_in");
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
      result = false;
    } else {
      result = true;
    }
    return result;
  }
}

var inputs = {
  username: 'username',
  password: 'password'
}

