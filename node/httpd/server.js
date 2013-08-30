var http = require("http");
var url = require("url");

function start(route, handles) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");

		response.writeHead(200, {
			"Content-Type" : "text/plain"
		});
		route(handles, pathname, response);
	}


	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

function start2(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");

		request.setEncoding("utf8");

		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
			console.log("Received POST data chunk '" + postDataChunk + "'.");
		});

		request.addListener("end", function() {
			route(handle, pathname, response, postData);
		});
	}


	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

function start4Img(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}


	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;
exports.start2 = start2;
exports.start4Img = start4Img;
