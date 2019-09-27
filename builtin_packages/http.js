var request_builtin_object = function(){
  this.url = '';
  this.body = '';
  this.bodyUsed = '';
  this.cache = '';
  this.context = '';
  this.credentials = '';
  this.destination = '';
  this.headers = '';
  this.integrity = '';
  this.method = '';
  this.mode = '';
  this.redirect = '';
  this.referrer = '';
  this.referrerPolicy = '';
  this.Accept = 'accept';
  this.Authorization = '';
  this.Expect = '';
  this.From = '';
  this.Host = '';
  this.Range = '';
  this.Referer = '';
  this.TE = '';
}
function createServer(requestListener) {
  var req = new request_builtin_object();
  var res = new request_builtin_object();
  requestListener(req, res);
}

module.exports = {
  createServer
};
