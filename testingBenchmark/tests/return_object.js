var app = {
	name: 'app',
	verison:'1.0.0',
	sayName: function(name){
		console.log(name + ' version is ' + this.verison);
	}
} 

module.exports =app; //return a JSON objects