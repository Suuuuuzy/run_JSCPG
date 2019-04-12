const url = require("url");
const http = require("http");
const child_process = require('child_process');

function serverFunction(request, response) {
  var cur_url = request.url;
  var year = url.parse(cur_url, true).query['year'];
  var parsedYear = parseInt(year, 10);
  if (isNaN(parsedYear)) {
    response.end();
    return 0;
  }
  var child = child_process.execSync('cal ' + parsedYear);
  var calRes = child.toString();
  console.log(calRes);
  response.writeHead(200);
  response.write(calRes);
  response.end();
}

const app = http.createServer(serverFunction);
app.listen(23456);
