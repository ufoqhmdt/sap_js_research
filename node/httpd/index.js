var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handles = {};
handles["/"] = requestHandlers.start;
handles["/start"] = requestHandlers.start;
handles["/upload"] = requestHandlers.upload;
handles["/execLs"] = requestHandlers.execLs;
handles["/login"] = requestHandlers.login;
handles["/uploadFile"] = requestHandlers.uploadFile;
handles["/uploadImgstart"] = requestHandlers.uploadImgstart;
handles["/uploadImg"] = requestHandlers.uploadImg;
handles["/show"] = requestHandlers.show;

server.start2(router.route, handles);  