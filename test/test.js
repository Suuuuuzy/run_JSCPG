function run(test) {
  if (test == 0) {
    console.log(test);
  }else {
    var instance = {
      testFunc: require("./testlib.js")(test),
      showVar: function(Var) {
        return Var;
      }
    }
  }
}

module.exports = run;
