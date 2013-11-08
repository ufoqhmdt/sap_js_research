function route(handle, pathname, response, postData) {
	console.log("About to route a request for " + pathname);
	if ( typeof handle[pathname] === 'function') {
		handle[pathname](response, postData);
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {
			"Content-Type" : "text/plain"
		});
		response.write("404 Not found");
		response.end();
	}
}

function route4Img(handles, pathname, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handles[pathname] === 'function') {
    handles[pathname](response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route; 
exports.route4Img = route4Img; 