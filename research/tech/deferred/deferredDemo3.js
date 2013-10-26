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
	var aDeferred = [];

	var dtd1 = $.Deferred(function(dtd) {
		setTimeout(function() {
			console.log("inggggggg dtd1");
			dtd.resolve(">>");
		}, 2000);
	}).promise(); // 新建一个Deferred对象	　　
	dtd1.done(function(data) {
		console.log("==done dtd1" + data);
	}).always(function(data) {
		console.log("==always dtd1" + data);
	});

	var dtd2 = $.Deferred(function(dtd) {
		setTimeout(function() {
			console.log("inggggggg dtd2");
			dtd.resolve(">>");
		}, 3000);
	}).promise(); // 新建一个Deferred对象	　　

	dtd2.done(function(data) {
		console.log("==done dtd2" + data);
	}).always(function(data) {
		console.log("==always dtd2" + data);
	});

	aDeferred.push(dtd1);
	aDeferred.push(dtd2);

	/*
	$.when.call($, aDeferred).done(function(dtds) {
		for (var i = 0; i < dtds.length; i++) {
			var dtd = dtds[i];
			dtd.resolve("UFO")
		};
		log("---done1");
	}).fail(function() {
		log("---fail1");
	}).always(function() {
		log("---always1");
	});*/


	　　
	var wait = function(dtd) {
		var dtd = $.Deferred();
		var tasks = function() {
			log("执行完毕！");
			dtd.resolve({
				"myhope": "guaiguaihuilai"
			}); // 改变Deferred对象的执行状态
		};
		setTimeout(tasks, 2000);
		return dtd.promise("ufo");
	};
	// var dtd1 = 
	$.when.call({}, aDeferred).done(function(args) {
		log(args);
		log("哈哈，成功了！");
	}).fail(function(args) {
		log(args);
		log("出错啦！");
	});


	/*
	$.Deferred(function(dtd) {
		$.when.apply(this, aDeferred)
			.done(function() {
				dtd.resolve();
			})
			.fail(function(ex) {
				dtd.reject(ex);
			});
	}).promise();
	*/

});