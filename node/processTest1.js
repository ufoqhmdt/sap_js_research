// var process=require("process");
// console.log(process.argv);
console.log(process.stdout.write);
console.log(process.prototype);

// process.stdin.resume();
// process.stdin.on("data",function(data){
// 	process.stdout.write("read from console:"+data.toString());
// })


function sthComplicated(){
	setTimeout(function(){
		console.log("sthComplicated---run over!");
	}, 3000);
}

function compute(){
	setTimeout(function(){
		console.log("compute---run over!");
	}, 3000);
}

function doSth(args,callback){
	sthComplicated(args);
	callback();
}

console.log = function(d) {
  process.stdout.write(d + '-----------------\n');
};

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

process.on('exit', function() {
  setTimeout(function() {
    console.log('This will not run');
  }, 0);
  console.log('About to exit.');
});

setTimeout(function() {
  console.log('This will still run.');
}, 1000);



// Intentionally cause an exception, but don't catch it.
// nonexistentFunc();
console.log('This will not run.');

// process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
  process.stdout.write('data: ' + chunk);
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});

process.on('SIGINT', function() {
  console.log('Got SIGINT.  Press Control-D to exit.');
});

console.log("--------------");
console.log(process.execPath);

console.log('Starting directory: ' + process.cwd());
try {
  process.chdir('tmp');
  console.log('New directory: ' + process.cwd());
}
catch (err) {
  console.log('chdir: ' + err);
}


if (process.getgid) {
  console.log('Current gid: ' + process.getgid());
}

process.on('SIGHUP', function() {
  console.log('Got SIGHUP signal.');
});

setTimeout(function() {
  console.log('Exiting.');
  process.exit(0);
}, 3000);

process.kill(process.pid, 'SIGHUP');
// console.log(process instanceof EventEmitter);
/*doSth(function onEnd(){
	compute();
})*/