module.exports = function(input) {
  exec(input);
  return (function(){console.log(input);})();
}
