function foo(target, k1, k2, value) {
  target[k1][k2] = value;
}
exports.foo = foo;
//foo((1), '__proto__', 'toString', "sink");
//console.log((1024).toString);
