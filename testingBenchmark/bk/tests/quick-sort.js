function swap(items, left, right) {
	var tmp = items[left];
	items[left] = items[right];
	items[right] = tmp;
}

function partition(items, left, right) {
	var pivot = items[Math.floor((right+left)/2)];
	var i = left;
	var j = right;
	while (i <= j) {
		while (items[i] < pivot) {
			++i;	
		}
		while (items[j] > pivot) {
			--j;	
		}
		if(i <= j) {
			swap(items, i, j);
			++i;
			--j;
		}
	}
	return i;
}

function quickSort(items, left, right) {
	var index;
	if (items.length > 1) {
		index = partition(items, left, right);
		if (left < index - 1) {
			quickSort(items, left, index-1);
		}
		if (right > index) {
			quickSort(items, index, right);
		}
	}
	return items;
}

var unsorted_array = [3,67,2,97,1,23,532,783,12,75,245,733,834,546,,30,52,2111,4442,5,7,7,4];
var sorted_array = quickSort(unsorted_array, 0, unsorted_array.length-1);
