// var x = 1;
// var y_test_string = 'test_string';
// var z = -3;
// if (x>z){
//     y_test_string += '1';
//     if(x>z+2){
//         y_test_string += '2';
//     }
//     else{
//         y_test_string +='3';
//     }
// }
// else{
//     y_test_string += '4';
//     z = z+1;
// }
//
// console.log(x);
// console.log(y_test_string);
// console.log(z);

// switch(c){
//     case 1:
//         y=5;
//         break;
//     case 2:
//         y=6;
//         break;
//     default:
//         y=7;
// }

var x = 1;
var y_test_string = 'test_string';
var z = -3;
z = z+1;
if (x>z){
    y_test_string += '4';
    z = z+1;
}
// else{
//     y_test_string += '5';
//     z = z-1;
// }

console.log(x);
console.log(y_test_string);
console.log(z);