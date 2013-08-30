var exec = require("child_process").exec;
var querystring = require("querystring");

function start(response) {
	exec("find /", {
		timeout : 10000,
		maxBuffer : 20000 * 1024
	}, function(error, stdout, stderr) {
		response.writeHead(200, {
			"Content-Type" : "text/plain"
		});
		response.write(stdout);
		response.end();
	});
}

function execLs(response) {
	exec("ls -lah", function(error, stdout, stderr) {
		response.writeHead(200, {
			"Content-Type" : "text/plain"
		});
		response.write(stdout);
		response.end();
	});
}

function upload(response) {
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {
		"Content-Type" : "text/plain"
	});
	response.write("Hello Upload");
	response.end();
}

function login(response) {
	console.log("Request handler 'login' was called.");

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" content="text/html; ' + 'charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/uploadFile" method="post">' + '<textarea name="text" rows="20" cols="60"></textarea>' + '<input type="submit" value="Submit text" />' + '</form>' + '</body>' + '</html>';

	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function uploadFile(response, postData) {
	console.log("Request handler 'uploadFile' was called.");
	response.writeHead(200, {
		"Content-Type" : "text/plain"
	});
	// response.write("You've sent the text: " + querystring.parse(postData).text);
	response.write("You've sent the text: " + postData);
	response.end();
}

var querystring = require("querystring"), fs = require("fs");

function uploadImgstart(response, postData) {
	console.log("Request handler 'start' was called.");

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" ' 
	+ 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>' 
	+ '<form action="/uploadImg" method="post">' + '<textarea name="text" rows="20" cols="60"></textarea>' 
	+ '<input type="submit" value="Submit text" />' + '</form>' 
	+ '</body>' + '</html>';

	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function uploadImg(response, postData) {
	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {
		"Content-Type" : "text/plain"
	});
	response.write("You've sent the text: " + querystring.parse(postData).text);
	response.end();
}

function show(response, postData) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./test.jpg", "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {
				"Content-Type" : "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type" : "image/png"
			});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.uploadImgstart = uploadImgstart;
exports.uploadImg = uploadImg;
exports.show = show;

exports.start = start;
exports.upload = upload;
exports.execLs = execLs;
exports.login = login;
exports.uploadFile = uploadFile;
