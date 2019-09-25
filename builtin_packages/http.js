var request_builtin_object = function(){
  this.Accept = 'accept';
  this.Accept-Charset = '';
  this.Accept-Encoding = '';
  this.Accept-Language = '';
  this.Authorization = '';
  this.Expect = '';
  this.From = '';
  this.Host = '';
  this.If-Match = '';
  this.If-Modified-Since = '';
  this.If-None-Match = '';
  this.If-Range = '';
  this.If-Unmodified-Since = '';
  this.Max-Forwards = '';
  this.Proxy-Authorization = '';
  this.Range = '';
  this.Referer = '';
  this.TE = '';
  this.User-Agent = '';
}
function createServer(requestListener) {
  var req = new request_builtin_object();
  var res = new request_builtin_object();
  requestListener(req, res);
}

module.exports = {
  createServer
};
