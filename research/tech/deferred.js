/**
 * @author UFO
 */

function log(l) {
	console.log(l);
}

require.config({
	baseUrl: '../../lib/js/vendor',
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
	aDeferred.push("aaaaaa");
	// var pro = $.Deferred(function(dtd) {
	// 	$.when.apply(this, aDeferred).done(function() {
	// 		log("---done");
	// 		// dtd.resolve();
	// 	}).fail(function() {
	// 		log("---fail");
	// 		dtd.reject();
	// 	}).always(function() {
	// 		log("---always")
	// 	});
	// }).promise();


	　　
	var dtd = $.Deferred(); // 新建一个Deferred对象	　　
	var wait = function(dtd) {　　　　
		var tasks = function() {　　　　　　
			log("执行完毕！");　　　　　　
			dtd.reject(); // 改变Deferred对象的执行状态			　　　　
		};　　　　
		setTimeout(tasks, 2000);　　　　
		return dtd;　　
	};


	var abc = function(dtd) {
		log("----");
		dtd.reject();
		return dtd;
	}


	log($.when.apply(this, aDeferred))
	log($.when())
	log($.when(dtd).done(function(a) {
		log("---done");
	}).fail(function() {
		log("---fail");
	}).always(function() {
		log("---always");
	}))
	log($.when(function() {
		var dtd = $.Deferred();
		setTimeout(function() {
			log("---<<<");
			dtd.resolve();
		}, 1000);
		return dtd;
	}()).done(function(a) {
		log(a)
		log("---done2");
	}).fail(function() {
		log("---fail2");
	}).always(function() {
		log("---always2");
	}))
	/*.done(function(a) {
		var dtd=$.Deferred()
		dtd.reject();
		log("---done");
	}).fail(function(){
		log("---fail");
	}).always(function(){
		log("---always");
	})*/
	　　
	$.when(wait(dtd)).done(function() {
		log("哈哈，成功了！");
	}).fail(function() {
		log("出错啦！");
	}).always(function() {
		log("always!");
	});


	log("----->>>>>>>")
	log($.when(dtd))
	log($.when())
	var dtd3 = $.Deferred();
	log($.when.call(this, dtd3).done(function(dtd) {
		log(dtd)
		log("---done3");
	}).fail(function() {
		log("---fail3");
	}).always(function() {
		log("---always3");
	}))
});