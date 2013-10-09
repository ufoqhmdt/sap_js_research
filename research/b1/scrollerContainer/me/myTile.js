define("sap.sbo.layout.TileContainer", ["sap.ui.Control", "sap.core.klass", "sap.ui.View", 'sap.core.IProcessable', "sap.sbo.ui.PageController", "css!sap.sbo.layout.TileContainer",
// "css!sap.sbo.layout.BaseTilesLayout",
"html!sap.sbo.layout.TileContainer"], function() {"use strict";
	var ns = this.getNS(), sap = ns.sap;

	var layout = sap.ui.Control.declare({
		Name : this.getModuleInfo().moduleName,
		// DomClass: "sbo-advtiles-layout",
		DomClass : "sapTilesContainer",
		Interfaces : [sap.core.IProcessable],
		Events : [],
		Options : {
			editable : {
				type : "boolean",
				defaultValue : true
			},
			tilePadding : {
				type : "integer",
				defaultValue : 10,
				immutable : true
			},
			tileHeight : {
				type : "integer",
				defaultValue : 220,
				immutable : true
			},
			tileWidth : {
				type : "integer",
				defaultValue : 220,
				immutable : true
			},
			pagePadding : {//could change when screen size changed?
				type : "integer",
				defaultValue : 100,
				immutable : false
			},
			pageColumn : {//how many columns of tiles in each page, calculated by screen szie
				type : "integer",
				defaultValue : 3,
				immutable : false
			},
			pageRow : {//how many rows of tiles in each page, calculated by screen size
				type : "integer",
				defaultValue : 3,
				immutable : false
			},
			configures : {
				type : "array",
				arrayType : {
					type : 'any'
				},
				defaultValue : []
			},
			coordinates : {
				type : "array",
				arrayType : {
					type : 'any'
				},
				defaultValue : []
			}
		},
		Public : {
			init : function() {
				sap.ui.Control.prototype.init.apply(this, arguments);

				(function() {"use strict";
					var $, GuilinPager, ____bind = function(fn, me) {
						return function() {
							return fn.apply(me, arguments);
						};
					}, __slice = [].slice, log = function(l) {
						console.log(l);
					};

					$ = jQuery;

					GuilinPager = (function() {

						GuilinPager.settings = {
							tilesSwitcher : {
								width : 60
							},
							sapTilesContainerContent : {
								height : 800,
								width : 1024
							}
						};

						GuilinPager.guilinPager = function($el, settings) {
							var guilinPagerInstance, __iScroll;

							guilinPagerInstance = new GuilinPager($el, settings);

							guilinPagerInstance.__tiles = null;

							return guilinPagerInstance;
						};

						function GuilinPager($el, settings) {
							if (settings == null) {
								settings = {};
							}
							this.settings = $.extend({}, GuilinPager.settings, settings);
							this.$el = $el;
							this.coordinate = ____bind(this.coordinate, this);
							this.appendPage = ____bind(this.appendPage, this);
							this.reducePage = ____bind(this.reducePage, this);
							this.lazyResizeHandler();
							this.initRender(3);
							this.createIscroll();
							this.createPager();
							this.calcContainerSize();
							// return this;
						};

						GuilinPager.prototype.coordinate = function(event) {
							switch (event.type) {
								case 'touchstart':
								case 'touchmove':
								case 'touchend':
								case 'touchcancel':
									return event.originalEvent.touches[0];
								default:
									return event;
							}
						};

						GuilinPager.prototype.calcContainerSize = function() {
							var self = this;
							if (!self.viewport) {
								self.viewport = {};
							}
							self.viewport.width = self.$el.get(0).clientWidth;
							self.viewport.height = self.$el.get(0).clientHeight;
						};

						GuilinPager.prototype.lazyResizeHandler = function(callback) {
							var marginOffset = this.settings.marginOffset || 0;
							var tileContainerControl = this.settings.tileContainerControl;
							var self = this;
							var resizedwProxy = function(event) {
								return function() {
									(function resizeCustomProxyHandler(event) {
										//this is custom proxy handler,You can add code that you want execute when window rezise event trigger
										self.calcContainerSize();
										var changed = tileContainerControl.calculateScreenSize(self.viewport.width, self.viewport.height);
										if (changed) {
											tileContainerControl.doScreenResize();
										}
										console.log(self);
									})(event);
								};
							};

							var resizeTimeoutFlag;
							$(window).resize(function(event) {
								clearTimeout(resizeTimeoutFlag);
								resizeTimeoutFlag = setTimeout(resizedwProxy(event), 50);
							});
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.initRender = function(pageCount, callback) {
							this.sapTilesContainerContent = this.$el.find(".sapTilesContainerContent");
							this.sapTilesContainerContent.width(this.sapTilesContainerContent.parent().width() * pageCount);
							var pagerSpan = "<span class='sapGuilinActive'></span>";
							for (var i = 0; i < pageCount - 1; i++) {
								pagerSpan += "<span></span>";
							};
							this.$sapTilesContainerPager = $(".sapTilesContainerPager");
							this.$sapTilesContainerPager.empty().append(pagerSpan);
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.edgeChange = function() {

						};

						GuilinPager.prototype.createIscroll = function() {
							var __iScroll = new iScroll('sapTilesContainerViewPort', {
								snap : true,
								hScroll : true,
								vScroll : false,
								momentum : false,
								hScrollbar : false,
								vScrollbar : false,
								lockDirection : true,
								fixedScrollbar : false,
								fadeScrollbar : false,
								onScrollEnd : function() {
									console.log(this);
									$('.sapTilesContainerPager > span.sapGuilinActive').removeClass('sapGuilinActive');
									document.querySelector('.sapTilesContainerPager > span:nth-child(' + (this.currPageX + 1) + ')').className = 'sapGuilinActive';
									if (this.currPageX == 0) {
										$("#sapTilesSwitcherLeft").hide();
									} else if (this.currPageX == 3) {
										$("#sapTilesSwitcherRight").hide();
									} else {
										$("#sapTilesSwitcherLeft").show();
										$("#sapTilesSwitcherRight").show();
									}
								}
							});
							this.__iScroll = __iScroll;
							return __iScroll;
						};

						GuilinPager.prototype.createPager = function() {
							var self = this;
							$("#sapTilessSwitcherLeft,#sapTilessSwitcherRight").on("mousedown", function(e) {
								self.__iScroll._start(e);
							});
							$("#sapTilessSwitcherLeft").click(function(e) {
								self.__iScroll.scrollToPage('prev', 0);
								return false;
							})
							$("#sapTilessSwitcherRight").click(function(e) {
								self.__iScroll.scrollToPage('next', 0);
								return false;
							})
						};

						GuilinPager.prototype.appendPage = function(pageCount, callback) {
							if (this.sapTilesContainerContent) {
								var newWidth = this.sapTilesContainerContent.width() + this.sapTilesContainerContent.parent().width() * pageCount;
								this.sapTilesContainerContent.width(newWidth);
							}
							var pagerSpan = "";
							for (var i = 0; i < pageCount; i++) {
								pagerSpan += "<span></span>";
							};
							this.$sapTilesContainerPager.append(pagerSpan);
							this.createIscroll();
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.reducePage = function(pageCount, callback) {
							if (this.sapTilesContainerContent) {
								var newWidth = this.sapTilesContainerContent.width() - this.sapTilesContainerContent.parent().width() * pageCount;
								this.sapTilesContainerContent.width(newWidth);
							}
							var pagerSpanNow = this.$sapTilesContainerPager.find("span");
							var slicePagerSpan = [].slice.apply(pagerSpanNow, [0, -pageCount]);
							this.$sapTilesContainerPager.empty().append(slicePagerSpan);
							this.createIscroll();
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.scrollToPrev = function(event, callback) {
							this.__iScroll && this.__iScroll.scrollToPage('prev', 0);
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.scrollToNext = function(event, callback) {
							this.__iScroll && this.__iScroll.scrollToPage('next', 0);
							callback && ( typeof callback === "function") && callback();
						};

						GuilinPager.prototype.scrollToPrevProxy = function(event) {
							var self = this;
							return function() {
								(function() {
									self.__iScroll && self.__iScroll.scrollToPage('prev', 0);
									self.timeOutFlag = setTimeout((function(event) {
										return function() {
											self.isEdge(event);
										};
									})(event), 500);
								})();
							};
						};

						GuilinPager.prototype.scrollToNextProxy = function(event) {
							var self = this;
							return function() {
								(function() {
									self.__iScroll && self.__iScroll.scrollToPage('next', 0);
									self.timeOutFlag = setTimeout((function(event) {
										return function() {
											self.isEdge(event);
										};
									})(event), 500);
								})();
							};
						};

						GuilinPager.prototype.clearTimer = function() {
							clearTimeout(this.timeOutFlag);
						};

						GuilinPager.prototype.isEdge = function(event, callback) {
							if (!event) {
								return;
							}
							var self = this, isLeft = false, isRight = false, innerHeight = this.sapTilesContainerContent.parent().height(), innerWidth = this.sapTilesContainerContent.parent().width(), clientX = event.clientX, clientY = event.clientY, tilesSwitcherWidth = this.settings.tilesSwitcher.width, leftInXMax = tilesSwitcherWidth, rightXMin = innerWidth - tilesSwitcherWidth;

							if (clientX > 0 && clientX < leftInXMax) {
								isLeft = true;
								isRight = false;
							} else if (clientX > rightXMin && clientX < innerWidth) {
								isLeft = false;
								isRight = true;
							} else {
								isLeft = false;
								isRight = false;
							}
							if (isLeft) {
								self.scrollToPrev(event);
							} else if (isRight) {
								self.scrollToNext(event);
							} else {
								this.clearTimer();
							}
							callback && ( typeof callback === "function") && callback();
						};

						return GuilinPager;
					})();

					// $.fn.extend({
					this.guilinPager =function  (els, settings) {
						var rtn = {};
						settings = arguments[0];
						if (settings == null) {
							settings = {};
						};
						rtn.$el = els.each(function(e) {
							var $this;
							$this = $(this);
							rtn.instance = GuilinPager.guilinPager($this, settings);
						});
						return rtn;
					};
					// });

				}).call(this);

				sap.ui.Control.declareMember(this, {
					_$content : null, //shortcut for main content
					_tiles : [],
					_blankMode : "2x2",
					_initConfigures : [],
					_guilinPagerInstance : null,
					_guilinPager : null
				});

				this._fetchInitTemplate();
				this._createDom();
				this._initConfigures = this._getDefaultConfigures();
				this.setOption("configures", this._initConfigures);

				this._guilinPager = this.guilinPager($(".sapTilesContainer"), {
					marginOffset : 120,
					tileContainerControl : this
				});
				this._guilinPagerInstance = this._guilinPager.instance;
				this._initTileButtons();
				// this.doScreenResize();
			},
			destroy : function() {

			},

			update : function(mChanges) {
				console.log("update");
				this._tilesLayout(mChanges);
			},
			_tilesLayout : function(mChanges) {
				if ((mChanges["configures"])) {
					var configures = this.getOption("configures");
					if (!!!this.created) {
						this._createTiles(configures);
						this.created = true;
					}
					var viewport = this._guilinPager.instance.viewport;
					this.calculateScreenSize(viewport.width, viewport.height);
					var coordinates = this._buildCoordinateMap(configures);
					this.setOption("coordinates", coordinates);
				}

				if (mChanges["coordinates"]) {
					var coordinates = this.getOption("coordinates");
					var positions = this._calcPosition(coordinates);
					this.applyPosition(positions);
				}
			},
			_createTileTemplateByUuid : function(uuid) {
				var config = this._initConfigures;
				for (var i = 0; i < config.length; i++) {
					var $sapGuilinTile = $("<div class='sapGuilinTile small sapGuilinBreatheDiv'></div>");
					var $sapGuilinTileRemove = $("<div class='sapGuilinTileRemove'></div>");
					var $sapGuilinTileContent = $("<div class='sapGuilinTileContent'></div>");
					var $sapGuilinTileMask = $("<div class='sapGuilinTileMask'></div>");
					$sapGuilinTile.append($sapGuilinTileRemove);
					if (config[i].uuid == uuid) {
						var sMode = config[i].mode;
						$sapGuilinTileContent.append($("<div></div>").attr({
							"data-sap-widget" : "sap.sbo.layout.TileView",
							"data-sap-option" : "name: '" + config[i].tileName + "', mode: '" + sMode + "'" + (config[i].option ? ", " + config[i].option : "")
						}));
						$sapGuilinTile.append($sapGuilinTileContent);
						$sapGuilinTile.append($sapGuilinTileMask);
						return $sapGuilinTile;
					}
				}
				return null;
			},

			_getDefaultConfigures : function() {
				var configures = [];

				for (var i = 0; i < this._tiles.length; i++) {
					configures.push({
						uuid : this._tiles[i].uuid,
						mode : this._tiles[i].mode,
						tileName : this._tiles[i].data,
						option : this._tiles[i].option,
						type : this._tiles[i].type
					});
				}
				return configures;
			},

			_fetchInitTemplate : function() {
				var $templates = this.$().children("[data-sap-template]");

				for (var i = 0; i < $templates.length; i++) {
					var $template = $($templates[i]);
					var type = $template.attr("data-sap-template");

					var mInfo = {
						uuid : $template.attr("uuid"),
						mode : $template.attr("mode")
					};

					if (!mInfo.uuid) {
						sap.log.error("Template must has a 'uuid' attribute.");
					}

					if (type == "Html") {
						mInfo.type = "Html";
						mInfo.data = $template.children();

						if (mInfo.data.length != 1) {
							sap.log.error("HTML template under tile layout can only has one sub node");
						}

					} else if (type == "View") {
						mInfo.type = "View";
						mInfo.data = $template.attr("name");
						mInfo.option = $template.attr("option");

					} else {
						sap.log.error();
					}

					this._tiles.push(mInfo);
				}

				$templates.remove();
			},
			_createDom : function() {
				this._$content = this.$();
				var tileContainer = ns.html.sap.sbo.layout.TileContainer;
				this.$().append(tileContainer);
				// this.$().append(this._$content);
			},
			_createTiles : function(configures) {
				var aTilesDom = [];
				// for (var i = 0; i < aSequence.length; i++) {
				// if (true) {
				// var $tile = this._createTileTemplateByUuid(aSequence[i].uuid);
				// if ($tile) {
				// aTilesDom.push($tile);
				// } else {
				// sap.log.error("Can't find tile by Uuid '" + aSequence[i].uuid + "'");
				// }
				// }
				// };

				for (var i = 0; i < configures.length; i++) {
					var uuid = configures[i].uuid;
					var $tile = this._createTileTemplateByUuid(configures[i].uuid);
					$tile.attr("uuid", uuid);
					this._addDraggingEvent4Tile($tile);
					aTilesDom.push($tile);
				};

				var that = this, iprocessCount = 0;
				that._$content.find(".sapGuilinGridly").html(aTilesDom);
				aTilesDom.forEach(function(item) {
					item.process(that.__ns).done(function() {
						iprocessCount++;
						if (iprocessCount === aTilesDom.length) {
							that.fireEvent("afterProcess");
						}
					});
				});

			},
			_initTileButtons : function() {
				var self = this;
				self._$content.find(".sapTilesSetEditable").on("vclick", function() {
					var sapTilesSetEditableBtn = self._$content.find(".sapTilesSetEditable");
					var sapTilesContainer = self._$content.find(".sapTilesContainer");
					self._$content.find(".sapTilesContainer").toggleClass('sapGuilinEditable');
					if (sapTilesContainer.hasClass('sapGuilinEditable')) {
						self._addDraggingEvent4Tile();
					} else {
						self._offDraggingEvent4Tile();
					}
				})
			},
			_addDraggingEvent4Tile : function() {
				var self = this;
				var sapGuilinTiles = self._$content.find(".sapGuilinTile");
				sapGuilinTiles.each(function(index, tile) {
					$(tile).on("vdragstart", function(event) {
						console.log("drag start");
						var $tile = $(event.delegateTarget);
						var coordinates = self.getOption("coordinates");
						self.sourceCoordinate = self._getTileCenterCoordinate(coordinates, $tile);

					}).on("vdragging", function(event) {
						console.log("dragging");
						if (!self.sourceCoordinate) {
							return;
						}
						var $tile = $(event.delegateTarget);
						var coordinates = self.getOption("coordinates");
						var configures = self.getOption("configures");
						var sourceUuid = $tile.attr("uuid");
						var targetCoordinate = self._getTileCenterCoordinate(coordinates, $tile);
						if (targetCoordinate) {
							var newCoordinates = self._copyCoordinates(coordinates);
							var newConfigures = self._copyConfigures(configures);
							self.doMovement(newCoordinates, newConfigures, self.sourceCoordinate, targetCoordinate, false);
						} else {
							console.log("target is null");
						}

					}).on("vdragend", function(event) {
						console.log("drag end");
						var $tile = $(event.delegateTarget);
						var sourceUuid = $tile.attr("uuid");
						var coordinates = self.getOption("coordinates");
						var configures = self.getOption("configures");

						var targetCoordinate = self._getTileCenterCoordinate(coordinates, $tile);
						if (targetCoordinate) {
							console.log("target is x=" + targetCoordinate.x + ", y=" + targetCoordinate.y);
							self.doMovement(coordinates, configures, self.sourceCoordinate, targetCoordinate, true);
						} else {
							coordinates = self.buildCoordinateMap(configures);
							var positions = self.calcPosition(coordinates);
							self.applyPosition(positions);
						}
						self.sourceCoordinate = undefined;
					});
				});
			},
			_offDraggingEvent4Tile : function() {
				var self = this;
				var sapGuilinTiles = self._$content.find(".sapGuilinTile");
				sapGuilinTiles.each(function(index, tile) {
					$(tile).off("vdragstart").off("vdragging").off("vdragend");
				})
			},
			_addEvent : function() {
				var that = this;
				var bEditable = this.getOption("editable");
				if (bEditable) {
					that._addClickOnMode();
					that._addClickOnBlank();
					that._addClickOnRemove();
					that._addPressAndDraggingEvent();
				}
			},
			setProcessContext : function(nsOuter) {
				this.__ns = nsOuter;
			},
			getModes : function() {
				return this._modes;
			},
			calculateScreenSize : function(screenWidth, screenHeight) {
				var tileWidth = this.getOption("tileWidth");
				var tileHeight = this.getOption("tileHeight");
				var tilePadding = this.getOption("tilePadding");
				var pagePadding = this.getOption("pagePadding");

				var xCount = Math.floor(screenWidth / (tileWidth + tilePadding));
				var xLeft = screenWidth % (tileWidth + tilePadding);

				var yCount = Math.floor(screenHeight / (tileHeight + tilePadding));
				var yLeft = screenHeight % (tileHeight + tilePadding);

				var oldPageColumn = this.getOption("pageColumn");
				var oldPageRow = this.getOption("pageRow");

				if (oldPageColumn != xCount || oldPageRow != yCount) {
					this.setOption("pageColumn", xCount);
					this.setOption("pageRow", yCount);
					return true;
				} else {
					return false;
				}
			},
			doScreenResize : function() {
				var configures = this.getOption("configures");
				var coordinates = this._buildCoordinateMap(configures);
				this.setOption("coordinates", coordinates);
			},
			doMovement : function(coordinates, configures, sourceCoordinate, targetCoordinate, dragStop) {
				var sourceModeKey = coordinates[sourceCoordinate.x][sourceCoordinate.y].mode;
				var sourceMode = this.getModes()[sourceModeKey];
				var sourceSize = sourceMode.size;
				var source = coordinates[sourceCoordinate.x][sourceCoordinate.y];
				var sourceUuid = source.uuid;
				var targetStart = {}, targetEnd = {};
				var page = this._getPageByCoordinate(targetCoordinate);
				var found = sourceMode.findTargetArea(this, targetCoordinate, targetStart, targetEnd);
				if (!found) {
					console.log("no target area can be found");
					return;
				}

				if (this._canPlaced(coordinates, targetCoordinate.x, targetCoordinate.y, page, sourceMode)) {
					console.log("empty place found, try to find its next tile");
					this._place(coordinates[sourceCoordinate.x][sourceCoordinate.y], coordinates, targetCoordinate.x, targetCoordinate.y, page, sourceMode);
					this._removeSource(coordinates, sourceCoordinate, sourceSize);
					var configures = this._getConfiguresByCoordinates(coordinates);
					var newCoordinates = this._buildCoordinateMap(configures);
					var positions = this._calcPosition(newCoordinates);
					if (dragStop) {
						this.applyPosition(positions);
						//TODO: prevent it trigger another position change
						this.setOption("coordinates", newCoordinates);
						this.setOption("configures", configures);
					} else {
						this.applyPosition(positions, sourceUuid);
					}
				} else {
					var replacedTileUuid = this._findFirstTileInTargetArea(coordinates, page, targetStart, targetEnd, sourceUuid);
					if (replacedTileUuid) {
						console.log("replaced tile is " + replacedTileUuid);
						var newConfigures = this._reOrderTiles(configures, sourceUuid, replacedTileUuid);
						var newCoordinates = this._buildCoordinateMap(newConfigures);
						var positions = this._calcPosition(newCoordinates);
						if (dragStop) {
							this.applyPosition(positions);
							//TODO: prevent it trigger another position change
							this.setOption("coordinates", newCoordinates);
						} else {
							this.applyPosition(positions, sourceUuid);
						}
					} else {
						var newCoordinates = this._buildCoordinateMap(configures);
						var positions = this._calcPosition(newCoordinates);
						if (dragStop) {
							this.applyPosition(positions);
							//TODO: prevent it trigger another position change
							this.setOption("coordinates", newCoordinates);
						} else {
							this.applyPosition(positions, sourceUuid);
						}
					}
				}
			},
			applyPosition : function(positions, exceptUuid) {
				for (var i = 0; i < positions.length; i++) {
					if (exceptUuid && positions[i].uuid === exceptUuid) {
						continue;
					}

					var uuid = positions[i].uuid;
					var width = positions[i].width;
					var height = positions[i].height;
					var left = positions[i].x;
					var top = positions[i].y;

					var $tile = this.$("[uuid='" + uuid + "']");
					$tile.css("top", top);
					$tile.css("left", left);
					$tile.css("width", width);
					$tile.css("height", height);
				}
			}
			//TODO: change it with actuall tiles
			// createTiles : function(positions) {
			// for (var i = 0; i < positions.length; i++) {
			// var uuid = positions[i].uuid;
			// var width = positions[i].width;
			// var height = positions[i].height;
			// var left = positions[i].x;
			// var top = positions[i].y;
			// var tile = $("<div class='tile' style='position:absolute;' ><p>" + uuid + "</p></div>");
			// tile.css("top", top);
			// tile.css("left", left);
			// tile.css("width", width);
			// tile.css("height", height);
			// tile.attr("uuid", uuid);
			// $("#scroller").append(tile);
			// };
			// }
		},
		Protected : {
			/**
			 * all supported modes here.
			 * TODO: please add mode here if need to add more supported modes,
			 * please implement findTargetArea() also
			 */
			_modes : {
				"1x1" : {
					size : {
						x : 1,
						y : 1
					},
					findTargetArea : function(that, targetCoordinate, targetStart, targetEnd) {
						targetStart.x = targetEnd.x = targetCoordinate.x;
						targetStart.y = targetEnd.y = targetCoordinate.y;
						return true;
					}
				},
				"2x1" : {
					size : {
						x : 2,
						y : 1
					},
					findTargetArea : function(that, targetCoordinate, targetStart, targetEnd) {
						var pageColumn = that.getOption("pageColumn");
						var maxColumn = ((targetCoordinate.page + 1) * pageColumn);

						targetStart.x = targetCoordinate.x;
						targetEnd.x = targetStart.x + 1;
						targetEnd.y = targetStart.y = targetCoordinate.y;

						if (targetEnd.x > (maxColumn - 1)) {//adjust if meet maxColumn
							return false;
							//can not be placed
						} else {
							return true;
						}
					}
				}
			},
			_canPlaced : function(coordinates, x, y, page, mode) {
				var pageColumn = this.getOption("pageColumn");
				var pageRow = this.getOption("pageRow");
				var maxColumn = ((page + 1) * pageColumn);
				for (var i = x; i < (x + mode.size.x); i++) {
					for (var j = y; j < (y + mode.size.y); j++) {

						if (j >= pageRow) {
							return false;
						}
						if (i >= maxColumn) {
							return false;
						}
						if (coordinates[i] === undefined) {
							continue;
						} else if (coordinates[i][j] == undefined) {
							continue;
						} else {
							return false;
						}
					}
				}
				return true;
			},
			_place : function(configure, coordinates, x, y, page, mode) {
				var start = {
					x : x,
					y : y
				};
				var end = {
					x : (x + mode.size.x - 1),
					y : (y + mode.size.y - 1)
				};
				for (var i = x; i < (x + mode.size.x); i++) {
					for (var j = y; j < (y + mode.size.y); j++) {
						if (coordinates[i] === undefined) {
							coordinates[i] = [];
						}
						coordinates[i][j] = configure;
						coordinates[i][j].start = start;
						coordinates[i][j].end = end;
						coordinates[i][j].page = page;
					}
				}
			},
			_removeSource : function(coordinates, sourceCoordinate, sourceSize) {
				for (var i = sourceCoordinate.x; i < (sourceCoordinate.x + sourceSize.x); i++) {
					for (var j = sourceCoordinate.y; j < (sourceCoordinate.y + sourceSize.y); j++) {
						coordinates[i][j] = undefined;
					}
				}
			},
			_convertTileModeToSize : function(mode, iWidth, iHeight, iPadding) {
				var oMode = this.getModes()[mode], mBlock;
				if (oMode) {
					mBlock = {
						x : oMode.size.x,
						y : oMode.size.y
					};
				} else {
					mBlock = {
						x : 1,
						y : 1
					};
				}
				return {
					width : iWidth * mBlock.x + (mBlock.x - 1) * iPadding,
					height : iHeight * mBlock.y + (mBlock.y - 1) * iPadding
				};
			},
			_calcPosition : function(coordinates) {
				var tileWidth = this.getOption("tileWidth");
				var tileHeight = this.getOption("tileHeight");
				var tilePadding = this.getOption("tilePadding");
				var pagePadding = this.getOption("pagePadding");
				var positions = [];
				var uuids = {};
				for (var i = 0; i < coordinates.length; i++) {
					var coordinateColumn = coordinates[i];
					if (!coordinateColumn) {//by moving, there maybe some undefined columns
						continue;
					}
					for (var j = 0; j < coordinateColumn.length; j++) {

						if (!coordinateColumn[j]) {
							continue;
							//it is a empty block
						}
						var uuid = coordinateColumn[j].uuid;
						if (uuids[uuid] !== undefined) {
							//already calculated
							continue;
						} else {
							uuids[uuid] = uuid;
						}
						var actualTileSize = this._convertTileModeToSize(coordinateColumn[j].mode, tileWidth, tileHeight, tilePadding);
						positions.push({
							uuid : coordinateColumn[j].uuid,
							x : i * tilePadding + i * tileWidth + coordinateColumn[j].page * pagePadding,
							y : j * tilePadding + j * tileHeight,
							width : actualTileSize.width,
							height : actualTileSize.height,
							mode : coordinateColumn[j].mode
						});
					}
				}
				return positions;
			},
			_getTileCenterCoordinate : function(coordinates, tile) {
				var widthHalf = Math.floor(tile.outerWidth() / 2);
				var heightHalf = Math.floor(tile.outerHeight() / 2);
				var center = {
					x : tile.position().left + widthHalf,
					y : tile.position().top + heightHalf
				};
				var c = this._findCoordinateByPosition(coordinates, center);
				return c;
			},
			_findCoordinateByPosition : function(coordinates, center) {
				var tileWidth = this.getOption("tileWidth");
				var tileHeight = this.getOption("tileHeight");
				var tilePadding = this.getOption("tilePadding");
				var pagePadding = this.getOption("pagePadding");
				var pageColumn = this.getOption("pageColumn");

				var prePageCount = Math.floor(center.x / ((tileWidth + tilePadding ) * pageColumn + pagePadding));

				var x = (center.x - prePageCount * pagePadding) / (tileWidth + tilePadding);
				var xCount = Math.floor(x);
				var xLeft = (center.x - prePageCount * pagePadding) % (tileWidth + tilePadding);

				var y = center.y / (tileHeight + tilePadding);
				var yCount = Math.floor(y);
				var yLeft = center.y % (tileHeight + tilePadding);
				//sap.log.info("x="+x + ", y="+y + ", xLeft = " + xLeft + ", yLeft=" + yLeft);
				var coordinate = null;
				if (xLeft > tileWidth) {
					if (coordinates[xCount] == undefined) {
						coordinate = null;
					} else if (coordinates[xCount][yCount] == undefined) {
						coordinate = null;
					} else if (coordinates[xCount + 1] == undefined) {
						coordinate = null;
					} else if (coordinates[xCount + 1][yCount] == undefined) {
						coordinate = null;
					} else if (coordinates[xCount][yCount].uuid === coordinates[xCount + 1][yCount].uuid) {
						//the vertical padding's left and right are the same, meaning it is on a tile
						coordinate = {
							x : xCount,
							y : yCount
						};
					} else {
						//locate on the vertical padding, can not be placed
						coordinate = null;
					}
				} else if (xLeft <= tileWidth) {
					//locate on a tile horizontally
					if (yLeft > tileHeight) {
						//on the horizontal padding, replace below tile
						yCount++;
						coordinate = {
							x : xCount,
							y : yCount
						};
					} else {
						//on a tile
						coordinate = {
							x : xCount,
							y : yCount
						};
					}
				}
				var ret = this._validateCoordinate(coordinate);
				return ret;
			},
			_validateCoordinate : function(coordinate) {
				var pageRow = this.getOption("pageRow");
				if (coordinate && (coordinate.y < 0 || coordinate.x < 0)) {
					return null;
				}
				if (coordinate && (coordinate.y > (pageRow - 1))) {
					return null;
				} else {
					return coordinate;
				}
			},
			//move related functions below
			_findFirstTileInTargetArea : function(coordinates, page, checkStart, checkEnd, sourceUuid) {
				var pageColumn = this.getOption("pageColumn");
				var pageRow = this.getOption("pageRow");
				var maxColumn = ((page + 1) * pageColumn);
				for (var i = checkStart.x; i <= checkEnd.x; i++) {
					for (var j = checkStart.y; j <= checkEnd.y; j++) {
						if (i < 0) {
							return null;
						}
						if (j < 0) {
							return null;
						}
						if (j >= pageRow) {
							//sap.log.info("can not place on " + i + "," + j);
							return null;
						}

						if (i >= pageColumn) {
							//sap.log.info("can not place on " + i + "," + j);
							return null;
						}

						if (coordinates[i] === undefined || coordinates[i][j] === undefined || coordinates[i][j].uuid === sourceUuid) {
							return null;
						} else {
							//sap.log.info("need move place on " + i + "," + j);
							return coordinates[i][j].uuid;
						}
					}
				}
				return null;
			},
			_reOrderTiles : function(configures, sourceUuid, replacedUuid) {
				var sourceIndex, replacedIndex;
				$(configures).each(function(index) {
					if (this.uuid === sourceUuid) {
						sourceIndex = index;
					}

					if (this.uuid === replacedUuid) {
						replacedIndex = index;
					}
				});

				var source = configures[sourceIndex];
				var target = configures[replacedIndex];
				configures.splice(sourceIndex, 1);
				/*
				 if (sourceIndex < replacedIndex) {
				 replacedIndex--;
				 }*/

				configures.splice(replacedIndex, 0, source);
				return configures;
			},
			_copyConfigure : function(c) {
				if (c) {
					var ret = {
						end : {
							x : c.end.x,
							y : c.end.y
						},
						start : {
							x : c.start.x,
							y : c.start.y
						},
						uuid : c.uuid,
						mode : c.mode
					};
					return ret;
				} else {
					return c;
				}
			},
			_copyCoordinates : function(coordinates) {
				var copied = [];
				for (var i = 0; i < coordinates.length; i++) {
					if (!coordinates[i]) {
						coordinates[i] = [];
						//be moving, has length but it is undefined
					}
					for (var j = 0; j < coordinates[i].length; j++) {
						if (copied[i] === undefined) {
							copied[i] = [];
						}
						copied[i][j] = this._copyConfigure(coordinates[i][j]);
					}
				}
				return copied;
			},
			_copyConfigures : function(configures) {
				var newConfigures = [];
				$(configures).each(function(index, value) {
					newConfigures.push({
						uuid : value.uuid,
						mode : value.mode
					});
				});
				return newConfigures;
			},
			_getPageByCoordinate : function(coordinate) {
				var pageColumn = this.getOption("pageColumn");
				return Math.floor(coordinate.x / pageColumn);
			},
			_getConfiguresByCoordinatePage : function(coordinates, configures, uuids, fromColumn, toColumn) {
				var pageRow = this.getOption("pageRow");
				for (var j = 0; j < pageRow; j++) {
					for (var i = fromColumn; i <= toColumn; i++) {
						if (coordinates[i] && coordinates[i][j]) {
							var uuid = coordinates[i][j].uuid;
							if (jQuery.inArray(uuid, uuids) === -1) {
								configures.push({
									uuid : uuid,
									mode : coordinates[i][j].mode,
								});
								uuids.push(uuid);
							}
						}
					}
				}
			},
			_getConfiguresByCoordinates : function(coordinates) {
				var pageColumn = this.getOption("pageColumn");
				//do it by scanning each page
				var configures = [];
				var uuids = [];
				for (var i = 0; i < coordinates.length; i++) {
					if ((i % pageColumn) == 0) {
						//new page reaches
						if (i + pageColumn >= coordinates.length) {
							var to = coordinates.length - 1;
							this._getConfiguresByCoordinatePage(coordinates, configures, uuids, i, to);
							return configures;
						} else {
							var to = i + pageColumn - 1;
							this._getConfiguresByCoordinatePage(coordinates, configures, uuids, i, to);
						}
					}
				}
				return configures;
			},
			_buildCoordinateMap : function(configures) {
				var pageColumn = this.getOption("pageColumn");
				var pageRow = this.getOption("pageRow");
				var coordinates = [];
				var x = 0, y = 0, page = 0;
				var maxColumn = ((page + 1) * pageColumn);
				for (var i = 0; i < configures.length; i++) {
					var mode = this.getModes()[configures[i].mode];
					while (!this._canPlaced(coordinates, x, y, page, mode)) {

						maxColumn = ((page + 1) * pageColumn);
						if (x + 1 >= maxColumn) {
							//try put it on a new row
							if (y + 1 >= pageRow) {
								page++;
								//start a new page
								x++;
								y = 0;
							} else {
								//new row in current page
								x = page * pageColumn;
								y++;
							}
						} else {
							x++;
						}
					}
					this._place(configures[i], coordinates, x, y, page, mode);
				}
				return coordinates;
			}
		}
	});
	return layout;

});
