var fruits, i;
fruits = ["Banana", "Orange", "Apple", "Mango"];
// fruits.push("Lemon"); 
fruits[fruits.length] = "pineapple"; 


var person = {fname:"John", lname:"Doe", age:25};

//test for
var text1 = "";
for (i = 0; i < fruits.length; i++) {
  text1 += "The fruit is " + fruits[i] + "\n";
}

//test forEach
var text2 = "";
fruits.forEach(myFunction);

function myFunction(value) {
  text2 += value + "\n";
}

//test for in
var text3 = "";
var x;
for (x in person) {
  text3 += person[x];
}

//test for of
var text4 = "";
var y;
for (y of fruits) {
	text4 += y + "\n";
}

// var txt = 'JavaScript';
// var z;
// for (z of txt){
// 	console.log(z);
// }


module.exports ={
	fruits: fruits,
	person: person,
	// myFunction: myFunction, 
};

// exports.fruits = fruits

// console.log(flen);

// console.log(text2);
// console.log(text1);
// console.log(text4);