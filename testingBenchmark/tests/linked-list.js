function node(val) {
	this.data = val,
	this.next = null;
    this.addNode = function(n) {
		var ptr = this;
		while (ptr.next != null) {
			ptr = ptr.next;
		}
    ptr.next = new node(n);
	}
	this.delNode = function(n) {
		var d = new node(0);
		d.next = this;
		//if (n == 1) 
		//	this = this.next;
		for (var i = 0; i < n-1; i++) {
			d = d.next;
		}
		d.next = d.next.next;
	}
}

const head = new node(1);
head.addNode(2);
head.addNode(3);
head.delNode(2);
