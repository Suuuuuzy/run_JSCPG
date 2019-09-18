function test(req) {
  exec(req.text);
}
var Req = function(){
  this.text = "text";
}
var req = new Req();
test(req);
