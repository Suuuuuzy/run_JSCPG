var array = ["e1", "e2", "e3", "e4", "e5"];
var it = 4, tmp;
do {
	tmp = array[it];
	array[it] = array[4-it];
	array[4-it] = tmp;
	--it;
} while (it/2 > 1)



