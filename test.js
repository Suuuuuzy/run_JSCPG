var x = 1;
var y = 0;
var z = -3;
if (x>z){
    y = y+1;
    if(x>z+2){
        y = y+3;
    }
}
else{
    y = y-1;
}

switch(c){
    case 1:
        y=5;
        break;
    case 2:
        y=6;
        break;
    default:
        y=7;
}


console.log(y);