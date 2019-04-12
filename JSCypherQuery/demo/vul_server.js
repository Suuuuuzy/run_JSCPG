const url = require("url");
const http = require("http");
const child_process = require('child_process');

function server_function(request, response) {
  var cur_url = request.url;
  var year = url.parse(cur_url, true).query['year'];
  if (typeof year == 'undefined'){
    response.end();
    return 0;
  }
  console.log('cal ' + year);
  var child = child_process.execSync('cal ' + year);
  var calRes = child.toString();
  console.log(calRes);
  response.writeHead(200);
  response.write(calRes);
  response.end();
}

const app = http.createServer(server_function);
app.listen(23456);
