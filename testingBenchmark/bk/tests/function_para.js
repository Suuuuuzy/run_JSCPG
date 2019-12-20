function repeat(word) {
   
  for (var i = 0; i < 5 ; i++) {
  	console.log(word + "\n");
  }
  
}

function execute(someFunction, value) {
  someFunction(value);
}

execute(repeat, "Hello");


execute(function(word){ console.log(word) }, "hi");
