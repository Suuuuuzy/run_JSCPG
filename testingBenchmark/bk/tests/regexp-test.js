function checkPattern(str) {
  var patt = /hello/i;
  return str.match(patt);
}

checkPattern("HELLO");
checkPattern("hello world");
checkPattern("hEllo123");
