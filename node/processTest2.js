process.on('SIGHUP', function() {
  console.log('Got SIGHUP signal.');
});

setTimeout(function() {
  console.log('Exiting.');
  process.exit(0);
}, 3000);

process.kill(process.pid, 'SIGHUP');
