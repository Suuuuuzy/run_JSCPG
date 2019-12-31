var arr1 = require('./array_loop.js')
var arr2 = arr1.fruits;
var arr3 = arr1.person;


var text1 = ""; 
var text2 = "";


for (i = 0 ; i < arr2.length; i++) {
  
	text1 += "The fruits is " + arr2[i] + "\n";

}


for (i = 0; i < arr1.fruits.length; i++){

	text2 += arr1.fruits[i] + "\n";

}


console.log(text1);
console.log(text2);
console.log(arr3);
// console.log(typeof arr3);
