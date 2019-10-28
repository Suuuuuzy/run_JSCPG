// require a constructor function returned by module.exports
var xiaoming = require('./return_constructor_function')
var xiaoming = new xiaoming('Tony')


console.log(xiaoming.sayHello())
console.log(xiaoming.sayGoodBye())
console.log(xiaoming.name)

//test prototype property
xiaoming.setHi("egg");
console.log(xiaoming.sayHello())
console.log(xiaoming.sayGoodBye())
console.log(xiaoming.name)

// require a JSON object returned by module.exports 
var app = require('./return_object');
app.sayName('camera');

// require a instance object returned by module.exports
var instance = require('./return_instance')
instance.func();

//test how to require exports.Function_Name
var functions = require('./test_exports')
functions.function1();
functions.function1();







