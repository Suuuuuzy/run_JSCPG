var request_builtin_object = function(){
  var source_hqbpillvul_url = '';
  this.url = source_hqbpillvul_url;
  this.path = source_hqbpillvul_url;

  this.on = function(str, cb) {
    // on should be counted as input
    var data1 = source_hqbpillvul_url;
    var data2 = source_hqbpillvul_url;
    cb(data1, data2);
  }
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

function express(requestListener) {
  var req = new request_builtin_object();
  var res = new response_builtin_object();
  requestListener(req, res);

  this.use = function(cb) {
    cb(req, res);
  }

  this.get = function(file_path, cb) {
    cb(req, res);
  }
}


module.exports = function() {return new express()};
