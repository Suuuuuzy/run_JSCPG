var x = 1;
var y_test_string = 'test_string';
var z = -3;
// debug_sink('in out');
// if (x>z){
//     debug_sink('in 1 if');
//     y_test_string += '1';
//     z += 1;
//     if(x>z+2){
//         debug_sink('in val if');
//         y_test_string += '2';
//     }
//     else{
//         debug_sink('in val else');
//         y_test_string +='3';
//     }
// }
// else{
//     y_test_string += '4';
//     z += -1;
// }

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
debug_sink('in out');
if (x>z){
    debug_sink('in if');
    y_test_string += '8';
    z = z+1;
}
else{
    debug_sink('in else');
    y_test_string += '9';
    z = z-1;
}

console.log(x);
console.log(y_test_string);
console.log(z);