let foo = {bar: 1}

console.log(foo.bar)

foo.__proto__.bar = 2

console.log(foo.bar)

let zoo = {}

console.log(zoo.bar)
