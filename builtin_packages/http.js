var request_builtin_object = function(){
  var source_hqbpillvul_url = '';
  this.url = source_hqbpillvul_url;
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

var response_builtin_object = function() {
  this.setHeader = function(key, value) {
    sink_hqbpillvul_http_setHeader(value);
    return null;
  }

  this.write = function(value) {
    sink_hqbpillvul_http_write(value);
  }

  this.end = function(value) {
    sink_hqbpillvul_http_write(value);
    return null;
  }
}

function createServer(requestListener) {
  var req = new request_builtin_object();
  var res = new response_builtin_object();
  requestListener(req, res);
}

module.exports = {
  createServer
};
