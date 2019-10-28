var Instance = function(){
	this.name = 'instance';
}

Instance.prototype.func = function(){
	console.log(this.name);
}

module.exports = new Instance(); // return an instance