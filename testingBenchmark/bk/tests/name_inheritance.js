function Father() {
    this.first_name = 'Donald'
    this.last_name = 'Trump'
    this.a = 2,
    this.m = function(){
    return this.a + 1;
    }
}

function Son() {
    this.first_name = 'Melania'
}

Son.prototype = new Father()

let son = new Son()

console.log(son.first_name)
console.log(son.last_name)
console.log(son.m())

Father.prototype.last_name = "Anna";
Father.prototype.middle_name = "li";

son.a = 4;

// console.log(`Name: ${son.first_name} ${son.last_name}`)
console.log(son.first_name)
console.log(son.last_name)
console.log(son.middle_name)
console.log(son.m())


