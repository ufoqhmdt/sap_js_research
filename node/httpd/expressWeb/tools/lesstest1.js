var less = require("less");
// console.log(less);
less.render('.class { width: 1 + 1 }', function(e, css) {
	console.log(e);
	console.log(css);
});

var parser = new (less.Parser);

parser.parse('.class { width: 1 + 1 }', function(err, tree) {
	if (err) {
		return console.error(err);
	}
	console.log(tree.toCSS());
});

var parser = new (less.Parser)({
	paths : ['.', './lib'], // Specify search paths for @import directives
	filename : 'FixNavBar.less' // Specify a filename, for better error messages
});

parser.parse(".FixNavBar.less",function(e, tree) {
	var css=tree.toCSS({
		compress : false
	});
	// Minify CSS output
	console.log(css);
}); 