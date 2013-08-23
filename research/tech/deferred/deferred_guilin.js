/**
 * @author UFO
 */

function log(l) {
	console.log(l);
}

require.config({
	baseUrl: '../../../lib/js/vendor',
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		waitSeconds: 15
	},
	paths: {　　　
		"jquery": "jquery",
		"underscore": "underscore",
		"backbone": "backbone"
	}　　
});

require(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	
	var pro = $.Deferred(function(dtd1) {
		$.when.apply(this, dtd1).done(function(a) {
			log("---done1");
			dtd1.reject();
		}).fail(function() {
			log("---fail1");
		}).always(function() {
			log("---always1")
		});
	}).promise();


	log("===================2");

	var dtd2 = $.Deferred();
	$.when.apply(this)
		.done(function() {
			log("---done2");
			dtd2.resolve("GOOOOD");
		})
		.fail(function(ex) {
			log("---fail2");
			dtd2.reject(ex);
		}).always(function() {
			log("---always2")
		});


	log("===================3");
	var aDeferred = [];
	aDeferred.push($.Deferred());
	aDeferred.push($.Deferred());
	var dtd3=$.Deferred(function(dtd3) {
		$.when.apply(this, aDeferred)
			.done(function() {
				log("---done3");
				dtd3.resolve();
			})
			.fail(function() {
				log("---fail3");
				dtd3.reject();
			}).always(function() {
				log("---always2")
			});

	}).promise();

});