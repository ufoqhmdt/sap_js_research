function log() {
	console.log(arguments);
}

var http = require('http');

var events = require("events");
var emitter = new events.EventEmitter();
emitter.on("ufoEvent", function(arg1, arg2) {
	log("listener1", arg1, arg2);
});
emitter.on("ufoEvent", function(arg1, arg2) {
	log("listener2", arg1, arg2);
});

emitter.once("ufoEvent",function(arg1,arg2){
	log("listener3",arg1,arg2);
});
emitter.once("error1",function(arg1,arg2){
	log("----error");
});

emitter.emit("ufoEvent", "byvoid", 1991);
emitter.emit("ufoEvent", "byvoid", 1991);
emitter.emit("ufoEvent", "byvoid", 1991);
emitter.emit("error");


