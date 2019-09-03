var LRAN2_MAX = 714025;
var IA		  = 1366;
var IC		  = 150889;

// create a new struct (if it is a "struct")
var d = new Object();
d.x = 0;
d.y = 0;
d.v = new Array(97);

function lran2_init(seed) {
	var x, j;
	x = (IC - seed) % LRAN2_MAX;
	if(x < 0) x = -x;
    for(j=0; j<97; j++) {
		x = (IA*x + IC) % LRAN2_MAX;
		d.v[j] = x;	
	}
	d.x = (IA*x + IC) % LRAN2_MAX;
	d.y = d.x;
}

function lran2() {
	var j = d.y % 97;
	d.y = d.v[j];
	d.x = (IA*d.x + IC) % LRAN2_MAX;
	d.v[j] = d.x;
	return d.y;
}

lran2_init(1234);
lran2();




