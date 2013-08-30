/*
function foo() {
	console.log('foo');
}
process.nextTick(foo);

(function bar() {
	console.log("bar go");
		// setTimeout(function(){
		// console.log('bar'); 
	// }, 3000);	
})()
*/

function log(a) {
	console.log(a);
}

var http = require('http');

function compute1() {
	console.log("----compute")
	for (var i = 1000000000 - 1; i >= 0; i--) {
		if (i % 100000000 == 0) {
			console.log("-----" + i);
		}
		// process.nextTick(compute);
	};
	process.nextTick(compute);

}

function compute() {
	log("---->>>compute")
	for (var i = 0; i < 1024 * 1024; i++) {
		if (i % 100000000 == 0) {
			console.log("-----" + i);
		}
		process.nextTick(function() {
			Math.sqrt(i);
		})
	}
}
// process.nextTick(compute);

http.createServer(function(req, res) {
	console.log("====request");
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.end('Hello World');
}).listen(5000, '127.0.0.1');

compute();