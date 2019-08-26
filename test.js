var mother = function() {
  this.child = "child1";
  this.other = "other";
  this.check = function() {
    console.log("a");
  }
}
var m = new mother();
m.bar = "bar";
m.child = "child";
exec(m.bar);
