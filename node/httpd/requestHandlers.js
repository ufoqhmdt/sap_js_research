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

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" ' + 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/upload" enctype="multipart/form-data" ' + 'method="post">' + '<input type="file" name="upload">' + '<input type="submit" value="Upload file" />' + '</form>' + '</body>' + '</html>';

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

var querystring = require("querystring"), fs = require("fs"), formidable = require("formidable");

function start4Img(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" content="text/html; ' + 'charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/upload4Img" enctype="multipart/form-data" ' + 'method="post">' + '<input type="file" name="upload" multiple="multiple">' + '<input type="submit" value="Upload file" />' + '</form>' + '</body>' + '</html>';

	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function upload4Img(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		fs.renameSync(files.upload.path, "./test.png");
		response.writeHead(200, {
			"Content-Type" : "text/html"
		});
		response.write("received image:<br/>");
		response.write("<img src='/show4Img' />");
		response.end();
	});
}

function show4Img(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./test.png", "binary", function(error, file) {
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

exports.start4Img = start4Img;
exports.upload4Img = upload4Img;
exports.show4Img = show4Img;
