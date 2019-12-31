var xiaoming = function(name){
    this.name = name

    this.sayHello = function(){
        return 'hello '+this.name
    }
    this.sayGoodBye = function(){
        return 'goodbye '+this.name
    }
}

function setHi(name) {
    this.name = name;
}
xiaoming.prototype.setHi = setHi;

module.exports = xiaoming // return a constructor function

