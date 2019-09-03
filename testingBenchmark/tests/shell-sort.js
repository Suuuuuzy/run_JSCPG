function shellSort(items) {
    var increment = items.length / 2;
    while (increment > 0) {
        for (i = increment; i < items.length; i++) {
            var j = i;
            var temp = items[i];
    
            while (j >= increment && items[j-increment] > temp) {
                items[j] = items[j-increment];
                j = j - increment;
            }
    
            items[j] = temp;
        }
    
        if (increment == 2) {
            increment = 1;
        } else {
            increment = parseInt(increment*5 / 11);
        }
    }
  return items;
}

var array = [3,2,5,8,1,1,29,5,8,9,4,2];
shellSort(array);
