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
	baseUrl: "../../lib/js/vendor",
	paths: {　　　
		"jquery": "jquery",
		"underscore": "underscore",
		"backbone": "backbone"
	}　　
});
require(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
});