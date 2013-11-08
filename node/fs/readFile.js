var fs = require('fs');

console.log("------");
var b=fs.readFile('text.txt',"utf-8", function(err,c) {
	if (err) {
		console.log(err);
		// throw err;
	}
	console.log(c);
});
console.log(b);

var a=fs.readFileSync("text.txt","utf-8");
console.log(a);
