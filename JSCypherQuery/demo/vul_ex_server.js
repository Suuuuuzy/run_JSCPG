function server_function(request, response) {
  var year = url.parse(request.url, true).query['year'];
  var child = execSync('cal ' + year);
  response.write(child.toString());
  response.end();
}
