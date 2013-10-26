qing.registNS("qext.Yoyo"), qing.registNS("qext.yoyo"), qext.Yoyo = function() {
	var e = [], t = 50, n = 10, r = "zoom", i = 50, s = 5, o = 6, u = "", a = {
		zoom : {
			open : function(e, t, n, r, i, s) {
				var o = e.length;
				qing.array.each(e, function(e, u) {
					var a = 2 * Math.PI / o, f = u * a, l = parseInt(n / 2) + i + parseInt(r / 2), c = t.left + (n - r) / 2, h = t.top + (n - r) / 2, p = c + l * Math.cos(f), d = h + l * Math.sin(f);
					e.elem.style.left = c + "px", e.elem.style.top = h + "px", e.elem.style.display = "block";
					var v;
					qing.browser.ie < 9 ? v = qani.animate(e.elem, {
						left : p + "px$tween:decelerate",
						top : d + "px$tween:decelerate"
					}, 150) : (e.elem.style.opacity = "0", v = qani.animate(e.elem, {
						opacity : 0
					}, {
						left : p + "px$tween:decelerate",
						top : d + "px$tween:decelerate",
						opacity : 1
					}, 150)), v.on("finish", function() {
						s && s()
					})
				})
			},
			hide : function(e, t, n, r, i, s) {
				qing.array.each(e, function(e, i) {
					var o = t.left + (n - r) / 2, u = t.top + (n - r) / 2, a;
					qing.browser.ie < 9 ? a = qani.animate(e.elem, {
						left : o + "px$tween:accelerate",
						top : u + "px$tween:accelerate"
					}, 150) : a = qani.animate(e.elem, {
						opacity : 1
					}, {
						left : o + "px$tween:accelerate",
						top : u + "px$tween:accelerate",
						opacity : 0
					}, 150), a.on("finish", function() {
						e.elem.style.display = "none", s && s()
					})
				})
			}
		},
		scroll : {
			open : function(e, t, n, r, i, s) {
				var o = e.length, u = 500 / o;
				qing.array.each(e, function(e, a) {
					function f() {
						var f = 2 * Math.PI / o, l = a * f, c = parseInt(n / 2) + i + parseInt(r / 2), h = t.left + n + i, p = t.top + (n - r) / 2, d = h + c * (Math.cos(l) - 1), v = p + c * Math.sin(l);
						e.elem.style.left = h + "px", e.elem.style.top = p + "px", e.elem.style.display = "block";
						var m = qani.animation({
							obj : e.elem,
							changes : [{
								type : "left",
								from : h,
								to : d,
								tween : function(e, t, n, r, i) {
									var s = (n - r) / i;
									return e + (Math.cos(l * s) - 1) * c
								}
							}, {
								type : "top",
								from : p,
								to : v,
								tween : function(e, t, n, r, i) {
									var s = (n - r) / i;
									return e + Math.sin(l * s) * c
								}
							}]
						}, u * (a + 1));
						m.start(), m.on("finish", function() {
							s && s()
						})
					}
					a == o - 1 ? f() : setTimeout(function() {
						f()
					}, u * (o - a - 1))
				})
			},
			hide : function(e, t, n, r, i, s) {
				var o = e.length, u = 500 / o;
				qing.array.each(e, function(e, a) {
					var f = 2 * Math.PI / o, l = a * f, c = (o - a) * f, h = parseInt(n / 2) + i + parseInt(r / 2), p = t.left + n + i, d = t.top + (n - r) / 2;
					e.elem.style.display = "block";
					var v = qani.animation({
						obj : e.elem,
						changes : [{
							type : "left",
							to : p,
							tween : function(e, t, n, r, i) {
								var s = (n - r) / i;
								return t + (Math.cos(l + c * s) - 1) * h
							}
						}, {
							type : "top",
							to : d,
							tween : function(e, t, n, r, i) {
								var s = (n - r) / i;
								return t + Math.sin(l + c * s) * h
							}
						}]
					}, u * (o - a));
					v.start(), v.on("finish", function() {
						e.elem.style.display = "none", s && s()
					})
				})
			}
		}
	};
	return qing.lang.createClass(function(e) {
		this.yoyoId = qing.lang.guid(), this.size = t, this.seedSize = i, this.space = n, this.animateStyle = r, this.flagShow = !1, e && (e.position && this.setPosition(e.position.left, e.position.top), this.size = e.size || t, this.seedSize = e.seedSize || i, this.space = e.space || n, this.animateStyle = e.animateStyle || r), this.seeds = []
	}).extend({
		addSeeds : function(e, t) {
			arguments.length > 1 ? this.seeds.concat({
				tpl : e,
				controllers : [].concat(t)
			}) : this.seeds = this.seeds.concat(e)
		},
		build : function() {
			var e = this;
			qing.array.each(e.seeds, function(t, n) {
				t.id = qing.lang.guid();
				var r = e.seedSize;
				t.elem = qing.dom.create("div", {
					id : t.id,
					className : "mod-yoyo-seed-item mod-user-unselect",
					style : "z-index:99999;display:none;position:absolute;overflow:hidden;width:" + r + "px;height:" + r + "px"
				}), t.elem.innerHTML = t.tpl;
				var i = t.controllers || [];
				document.body.appendChild(t.elem), qing.array.each(i, function(e, n) {
					qing.event.on(t.elem, e.event, e.controller)
				})
			});
			var n = this.size || t;
			this.elem = qing.dom.create("div", {
				id : this.yoyoId,
				className : "yoyo-wraper mod-user-unselect",
				style : "z-index:99999;display:none;position:absolute;overflow:hidden;width:" + n + "px;height:" + n + "px;"
			}), this.elem.innerHTML = u, document.body.appendChild(this.elem)
		},
		show : function() {
			var e = qing.dom.getAttr(document.body, "data-layershow");
			if (e === "1")
				return;
			this.elem.style.display = "block", this.flagShow = !0;
			var t = qing.dom.getPosition(this.elem);
			!qing.dom.hasClass(document.body, "mod-user-unselect") && qing.dom.addClass(document.body, "mod-user-unselect"), a[this.animateStyle].open(this.seeds, t, this.size, this.seedSize, this.space)
		},
		hide : function() {
			if (this.flagShow) {
				this.flagShow = !1;
				var e = qing.dom.getPosition(this.elem), t = this;
				qing.dom.hasClass(document.body, "mod-user-unselect") && qing.dom.removeClass(document.body, "mod-user-unselect"), a[this.animateStyle].hide(this.seeds, e, this.size, this.seedSize, this.space, function() {
					t.elem.style.display = "none"
				})
			}
		},
		setPosition : function(e, n) {
			this.elem.style.left = parseInt(e) - parseInt(t / 2) + "px", this.elem.style.top = parseInt(n) - parseInt(t / 2) + "px"
		}
	})
}(), qext.yoyo.init = function(e, t) {
	var n = 1e3, r = new qext.Yoyo(e), t = [].concat(t);
	r.addSeeds(t), r.build();
	var i = !1, s = "mousedown", o = "mouseup", u = "mousemove";
	if (qing.platform.isIpad || qing.platform.isIphone)
		s = "touchstart", o = "touchend", u = "touchemove";
	qing.event.on(document.body, s, function(e) {
		var t = qing.event.getTarget(e);
		if (t == r.elem || qing.dom.contains(r.elem, t))
			return;
		var o = t.scrollTop || 0, u = t.scrollLeft || 0;
		for (var a = 0, f = r.seeds.length; a < f; a++) {
			var l = r.seeds[a];
			if (qing.dom.contains(l.elem, t))
				return
		}
		var c = s == "mousedown" ? qing.page.getMousePosition() : {
			x : e.touches[0].pageX,
			y : e.touches[0].pageY
		};
		r.hide(), i = setTimeout(function() {
			var n = s == "mousedown" ? qing.page.getMousePosition() : {
				x : e.touches[0].pageX,
				y : e.touches[0].pageY
			};
			if (n.x < c.x + 5 && n.x > c.x - 5 && n.y < c.y + 5 && n.y > c.y - 5)
				if (t == document.body || o == t.scrollTop && u == t.scrollLeft) {
					var i = n.x, a = n.y;
					r.setPosition(i, a), r.show()
				}
		}, n)
	});
	var a = function() {
		i && (clearTimeout(i), i = !1)
	};
	qing.event.on(document.body, o, a)
}, qing.dom.ready(function() {
	qext.yoyo.init({
		seedSize : 36,
		space : 0,
		size : 36
	}, [{
		tpl : '<a href="' + qDomain.qing + '/pub/show/createmusic" class="mod-yoyoseed-item music" title="\u53d1\u5e03\u97f3\u4e50"><div class="yoyo-seed-bg-sprite">a</div></a>'
	}, {
		tpl : '<a href="' + qDomain.qing + qVisitorInfo.qingUrl + '" class="mod-yoyoseed-item fans" title="\u6211\u7684\u4e3b\u9875"><div class="yoyo-seed-bg-sprite">b</div></a>'
	}, {
		tpl : '<a href="' + qDomain.qing + '/home" class="mod-yoyoseed-item home" title="\u9996\u9875"><div class="yoyo-seed-bg-sprite">c</div></a>'
	}, {
		tpl : '<a href="' + qDomain.qing + '/pub/show/createtext" class="mod-yoyoseed-item text" title="\u53d1\u5e03\u6587\u5b57"><div class="yoyo-seed-bg-sprite">d</div></a>'
	}, {
		tpl : '<a href="' + qDomain.qing + '/pub/show/createpic" class="mod-yoyoseed-item picture" title="\u53d1\u5e03\u56fe\u7247"><div class="yoyo-seed-bg-sprite">e</div></a>'
	}, {
		tpl : '<a href="' + qDomain.qing + '/pub/show/createvideo" class="mod-yoyoseed-item video" title="\u53d1\u5e03\u89c6\u9891"><div class="yoyo-seed-bg-sprite">f</div></a>'
	}])
}); 