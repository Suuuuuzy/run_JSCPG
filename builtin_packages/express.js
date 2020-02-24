var http = require("http");
function express() {
  this.res = {};
  this.req = {};

  http.createServer(function(res, req){
    this.res = res;
    this.req = req;
  }).listen(123);

}

express.prototype.use = function (cb) {
  cb(this.req, this.res);
}

express.prototype.get = function(file_path, cb) {
  cb(this.req, this,res);
}

module.exports = new express();
