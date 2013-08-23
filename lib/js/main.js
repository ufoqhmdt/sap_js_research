/**
 * @author C5193511
 */

function log(l) {
	console.log(l);
}

require.config({
	shim: {　　　
		'underscore': {　　　
			exports: '_'　　　　　　
		},
		'backbone': {　　　　　　　　
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'　　　　　　
		}
	},
	paths: {　　　
		"jquery": "vendor/jquery",
		"underscore": "vendor/underscore",
		"backbone": "vendor/backbone",
		"ufo": "my/ufo",
		"txtimg": "my/txtimg",
		"d":"my/a/b/c/d"
	}　　
});
require(['jquery', 'underscore', 'backbone', 'ufo', 'txtimg'], function($, _, backbone, ufo, txtimg) {
	log("--->");
	ufo.foo();
	log(txtimg)
});

require(["d"], function(d) {
	log("----d>>")
	d.foo();
});