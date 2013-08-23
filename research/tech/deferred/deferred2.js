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
	aDeferred.push("aaaaaa");

	var dtd = $.Deferred(); // 新建一个Deferred对象	　　
	var wait = function(dtd) {　　　　
		var tasks = function() {　　　　　　
			log("执行完毕！");　　　　　　
			dtd.resolve(); // 改变Deferred对象的执行状态			　　　　
		};　　　　
		setTimeout(tasks, 1000);　　　　
		return dtd;　　
	};

	$.when(wait(dtd)).done(function(dtd) {
		log(dtd)
		log("---done1");
	}).fail(function() {
		log("---fail1");
	}).always(function() {
		log("---always1");
	});

	//传入{}或不传都会执行done和alway.
	$.when().done(function(dtd) {
		log(dtd)
		log("---done2");
	}).fail(function() {
		log("---fail2");
	}).always(function() {
		log("---always2");
	});


	var dtd3 = $.Deferred();
	log($.when.call(this, dtd3).done(function(dtd) {
		log(dtd)
		log("---done3");
	}).fail(function() {
		log("---fail3");
	}).always(function() {
		log("---always3");
	}))


	var dtd4 = $.Deferred();
	dtd4.reject();//when总是接受deferred对象.而deferred对象如果是原生为改变状态的是无法触发done fail执行的.必须有个地方去改变他的状态.
	log($.when.call(this,dtd4).done(function(dtd) {
		log(dtd)
		log("---done4");
	}).fail(function() {
		log("---fail4");
	}).always(function() {
		log("---always4");
	}))


	var dtd5 = {};//如果传入普通非deferred对象就和传入空对象一样.会直接执行的.
	log($.when.call(this, {}).done(function(dtd) {
		log(dtd)
		log("---done5");
	}).fail(function() {
		log("---fail5");
	}).always(function() {
		log("---always5");
	}))	


	//让他延迟执行而且返回{},但是done和fail立即执行了
	var fun1=function(){
		setTimeout(function(){
			log("----6666666");
		}, 2000);
		return {};
	}
	log($.when.call(this, fun1()).done(function(dtd) {
		log(dtd)
		log("---done6");
	}).fail(function() {
		log("---fail6");
	}).always(function() {
		log("---always6");
	}))	

	//让他延迟执行而且返回Deferred,但是done和fail不执行了
	var fun7=function(){
		var dtd=$.Deferred();
		window.ufodtd=dtd;//我要在外面手动修改他的状态.
		setTimeout(function(){
			log("----777777");
		}, 2000);
		return dtd;
	}
	log($.when.call(this, fun7()).done(function(dtd) {
		log(dtd)
		log("---done7");
	}).fail(function() {
		log("---fail7");
	}).always(function() {
		log("---always7");
	}))

	//让他延迟执行而且返回Deferred,如果我改了dtd的状态 哈哈. done和fail执行了.但是马上执行. 
	var fun8=function(){
		var dtd=$.Deferred();
		setTimeout(function(){
			log("----888888");
		}, 2000);
		dtd.resolve("==8=8=8=8=8=8=8=8=8=8=8=8=8=8=8=8=8");
		return dtd;
	}
	log($.when.call(this, fun8()).done(function(dtd) {
		log(dtd)
		log("---done8");
	}).fail(function() {
		log("---fail8");
	}).always(function() {
		log("---always8");
	}))


	//让他延迟执行而且返回Deferred,如果我改了dtd的状态,而且放在延迟里面. 哈哈. done和fail执行了.而且也延迟了. 
	//所以我突然领悟了.当返回deferred的时候没反应是when一直中等待他的状态变化.没地方可以让他变化.
	var fun9=function(){
		var dtd=$.Deferred();
		setTimeout(function(){
			log("----999999");
			dtd.resolve();
		}, 2000);
		return dtd;
	}
	log($.when.call(this, fun9()).done(function(dtd) {
		log(dtd)
		log("---done9");
	}).fail(function() {
		log("---fail9");
	}).always(function() {
		log("---always9");
	}));


	$(function(){
		$("#ufo").click(function(){
			window.ufodtd.resolve();
		})
	})

});