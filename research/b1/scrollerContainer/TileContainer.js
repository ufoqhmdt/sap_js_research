 /*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.m.TileContainer');
jQuery.sap.require('sap.m.library');
jQuery.sap.require('sap.ui.core.Control');
sap.ui.core.Control.extend('sap.m.TileContainer', {
    metadata: {
        publicMethods: ['moveTile', 'scrollIntoView', 'getPageFirstTileIndex'],
        library: 'sap.m',
        properties: {
            'width': {
                type: 'sap.ui.core.CSSSize'
                ,group: 'Dimension'
                ,defaultValue: '100%'
            }
            ,'height': {
                type: 'sap.ui.core.CSSSize'
                ,group: 'Dimension'
                ,defaultValue: '100%'
            }
            ,'editable': {
                type: 'boolean'
                ,group: 'Misc'
                ,defaultValue: null
            }
            ,'allowAdd': {
                type: 'boolean'
                ,group: 'Misc'
                ,defaultValue: null
            }
        }
        ,defaultAggregation: 'tiles'
        ,aggregations: {
            'tiles': {
                type: 'sap.ui.core.Control'
                ,multiple: true,singularName: 'tile'}
            }
            ,events: {
                'tileMove': {}
                ,'tileDelete': {}
                ,'tileAdd': {}
            }
        }
    });
sap.m.TileContainer.M_EVENTS = {'tileMove': 'tileMove','tileDelete': 'tileDelete','tileAdd': 'tileAdd'};
jQuery.sap.require('sap.ui.core.IconPool');
sap.ui.core.IconPool.insertFontFaceStyle();
sap.m.TileContainer.prototype.init = function() {
    this._bRendered = false;
    this._iCurrentTileStartIndex = 0;
    this._iCurrentPage = 0;
    this._iPages = 0;
    this._iScrollLeft = 0;
    this._iScrollGap = 0;
    if (!jQuery.device.is.desktop) {
        this._iScrollGap = 0
    }
    this.bAllowTextSelection = false;
    this._iInitialResizeTimeout = 400;
    this._oDragSession = null;
    this._oTouchSession = null;
    this._bAvoidChildTapEvent = false;
    this._iEdgeShowStart = jQuery.device.is.phone ? 10 : 20;
    this._iTriggerScrollOffset = jQuery.device.is.phone ? 10 : jQuery.device.is.desktop ? -40 : 20;
    if (jQuery.sap.touchEventMode == 'ON') {
        this.ontouchstart = this._onstart;
        this.ontouchend = this._onend;
        this.ontouchmove = this._onmove
    } else {
        this.onmousedown = this._onstart
    }
};
sap.m.TileContainer.prototype.onBeforeRendering = function() {
    if (this._sResizeListenerId) {
        sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
        this._sResizeListenerId = null
    }
};
sap.m.TileContainer.prototype.onAfterRendering = function() {
    this._bRendered = true;
    this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef().parentElement, jQuery.proxy(this._resize, this));
    this._applyDimension();
    this.$().toggleClass('sapMTCEditable', this.getEditable() === true);
    var t = this;
    this._sInitialResizeTimeoutId = setTimeout(function() {
        t._update(true)
    }, this._iInitialResizeTimeout)
};
sap.m.TileContainer.prototype.setEditable = function(v) {
    var t = this.getTiles();
    this.setProperty('editable', v, true);
    var e = this.getEditable();
    this.$().toggleClass('sapMTCEditable', e);
    for (var i = 0; i < t.length; i++) {
        var T = t[i];
        if (T instanceof sap.m.Tile) {
            T.isEditable(e)
        }
    }
    return this
};
sap.m.TileContainer.prototype._applyDimension = function() {
    var d = this._getContainerDimension(), i = this.getId(), $ = this.$(), t, o = 10, c = jQuery.sap.byId(i + '-cnt'), a, b, p = jQuery.sap.byId(i + '-pager').outerHeight();
    jQuery.sap.byId(i + '-scrl').css({width: d.outerwidth + 'px',height: (d.outerheight - p) + 'px'});
    c.css({height: (d.outerheight - p) + 'px',visibility: 'visible'});
    $.css('visibility', 'visible');
    t = $.position();
    a = c.position();
    b = c.outerHeight();
    if (jQuery.device.is.phone) {
        o = 2
    } else if (jQuery.device.is.desktop) {
        o = 0
    }
    jQuery.sap.byId(i + '-blind').css({top: (a.top + o) + 'px',left: (a.left + o) + 'px',width: (c.outerWidth() - o) + 'px',height: (b - o) + 'px'});
    jQuery.sap.byId(i + '-rightedge').css({top: (t.top + o) + 'px',right: o + 'px',height: (b - o) + 'px'});
    jQuery.sap.byId(i + '-leftedge').css({top: (t.top + o) + 'px',left: (t.left + o) + 'px',height: (b - o) + 'px'})
};
sap.m.TileContainer.prototype._resize = function() {
    if (this._oDragSession) {
        return
    }
    setTimeout(jQuery.proxy(function() {
        this._update(true);
        delete this._iInitialResizeTimeout
    }, this), this._iInitialResizeTimeout);
    this._iInitialResizeTimeout = 0
};
sap.m.TileContainer.prototype.exit = function() {
    if (this._sResizeListenerId) {
        sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
        this._sResizeListenerId = null
    }
    if (this._sInitialResizeTimeoutId) {
        clearTimeout(this._sInitialResizeTimeoutId)
    }
};
sap.m.TileContainer.prototype._update = function(a) {
    if (!this._bRendered)
        return;
    this._updateTilePositions();
    if (this._oTileDimension) {
        jQuery.sap.byId(this.getId() + '-cnt')[0].style.width = ((this._iPages * this._iOffsetX * 2) + (this._iPages * this._iMaxTilesX * this._oTileDimension.width)) + 'px'
    }
    if (!this._oDragSession) {
        this.scrollIntoView(this._iCurrentTileStartIndex || 0, a)
    }
};
sap.m.TileContainer.prototype.getPageFirstTileIndex = function() {
    return this._iCurrentTileStartIndex || 0
};
sap.m.TileContainer.prototype.moveTile = function(t, n) {
    if (!isNaN(t)) {
        t = this.getTiles()[t]
    }
    if (!t) {
        jQuery.sap.log.info('No Tile to move');
        return this
    }
    this.deleteTile(t);
    this.insertTile(t, n);
    return this
};
sap.m.TileContainer.prototype.addTile = function(t) {
    this.insertTile(t, this.getTiles().length)
};
sap.m.TileContainer.prototype.insertTile = function(t, i) {
    if (this._bRendered) {
        this.insertAggregation('tiles', t, i, true);
        if (!this._oDragSession) {
            var r = sap.ui.getCore().createRenderManager(), c = jQuery.sap.byId(this.getId() + '-cnt')[0];
            r.render(t, c);
            r.destroy()
        }
        this._update(false)
    } else {
        this.insertAggregation('tiles', t, i)
    }
    return this
};
sap.m.TileContainer.prototype.deleteTile = function(t) {
    if (this._bRendered) {
        var i = this.indexOfAggregation('tiles', t) - 1;
        this.removeAggregation('tiles', t, true);
        if (!this._oDragSession) {
            t.getDomRef().parentNode.removeChild(t.getDomRef())
        }
        this._applyPageStartIndex(i < 0 ? 0 : i);
        this._update(false)
    } else {
        this.removeAggregation('tiles', t, false)
    }
    return this
};
sap.m.TileContainer.prototype.rerender = function() {
    if (!this._oDragSession || this._oDragSession.bDropped) {
        sap.ui.core.Control.prototype.rerender.apply(this)
    }
};
sap.m.TileContainer.prototype.scrollLeft = function() {
    this.scrollIntoView(this._iCurrentTileStartIndex - this._iMaxTiles)
};
sap.m.TileContainer.prototype.scrollRight = function() {
    this.scrollIntoView(this._iCurrentTileStartIndex + this._iMaxTiles)
};
sap.m.TileContainer.prototype.scrollIntoView = function(t, a) {
    var T = this.getTiles(), i = t, s;
    if (isNaN(t)) {
        i = this.indexOfAggregation('tiles', t)
    }
    var o = T[i];
    if (!o) {
        return
    }
    this._applyPageStartIndex(i);
    jQuery.sap.byId(this.getId() + '-scrl').scrollLeft(0);
    s = this._iCurrentTileStartIndex;
    var b = T[s];
    this._scrollTo(b._posX - (this._iOffsetX || 0), a);
    this._iCurrentPage = Math.floor(s / this._iMaxTiles);
    this._updatePager()
};
sap.m.TileContainer.prototype._updateTilePositions = function() {
    if (this.getTiles().length == 0)
        return;
    this._applyPageStartIndex(this._iCurrentTileStartIndex);
    this._applyDimension();
    var t = this.getTiles(), c = this._getContentDimension();
    for (var i = 0; i < t.length; i++) {
        if (t[i].isDragged()) {
            continue
        }
        var p = Math.floor(i / this._iMaxTiles), T = t[i], l = (p * c.outerwidth) + this._iOffsetX + i % this._iMaxTilesX * this._oTileDimension.width, a = this._iOffsetY + Math.floor(i / this._iMaxTilesX) * this._oTileDimension.height - (p * this._iMaxTilesY * this._oTileDimension.height);
        T.setPos(l, a);
        T.setSize(this._oTileDimension.width, this._oTileDimension.height);
        T.$().css('visibility', 'visible')
    }
    this._iPages = Math.ceil(t.length / this._iMaxTiles)
};
sap.m.TileContainer.prototype._updatePager = function() {
    var p = jQuery.sap.byId(this.getId() + '-pager')[0], s = jQuery.sap.byId(this.getId() + '-leftscroller')[0], S = jQuery.sap.byId(this.getId() + '-rightscroller')[0];
    if (this._iPages > 1) {
        var h = [''];
        for (var i = 0; i < this._iPages; i++) {
            h.push('')
        }
        p.innerHTML = h.join('<span></span>');
        p.style.display = 'block';
        p.childNodes[this._iCurrentPage].className = 'sapMTCActive';
        if (jQuery.device.is.desktop) {
            S.style.right = this._iCurrentPage == this._iPages - 1 ? '-100px' : '1rem';
            s.style.left = this._iCurrentPage == 0 ? '-100px' : '1rem';
            s.style.display = 'block';
            S.style.display = 'block';
            if (this._iCurrentPage == this._iPages - 1) {
                S.style.display = 'none'
            }
            if (this._iCurrentPage == 0) {
                s.style.display = 'none'
            }
        }
    } else {
        p.innerHTML = '';
        S.style.right = '-100px';
        s.style.left = '-100px';
        s.style.display = 'none';
        S.style.display = 'none'
    }
};
sap.m.TileContainer.prototype._getContentDimension = function() {
    if (!this._bRendered)
        return;
    var s = jQuery.sap.byId(this.getId() + '-scrl');
    return {width: s.width(),height: s.height() - 20,outerheight: s.outerHeight() - 20,outerwidth: s.outerWidth()}
};
sap.m.TileContainer.prototype._getContainerDimension = function() {
    if (!this._bRendered)
        return;
    var d = this.$();
    return {width: d.width(),height: d.height(),outerheight: d.outerHeight(),outerwidth: d.outerWidth()}
};
sap.m.TileContainer.prototype._getTileDimension = function() {
    if (!this._bRendered)
        return;
    if (this._oTileDim)
        return this._oTileDim;
    var t = this.getTiles()[0];
    this._oTileDim = {width: t.$().outerWidth(true),height: t.$().outerHeight(true)};
    return this._oTileDim
};
sap.m.TileContainer.prototype._calculatePositions = function() {
    if (this.getTiles().length == 0)
        return;
    this._oTileDimension = this._getTileDimension();
    var c = this._getContainerDimension(), t = this.getTiles().length, p = jQuery.sap.byId(this.getId() + '-pager')[0].offsetHeight;
    if (c.height == 0)
        return;
    if (jQuery.device.is.desktop) {
        c.width -= 45 * 2
    }
    var m = Math.max(Math.floor(c.width / this._oTileDimension.width), 1), M = Math.max(Math.floor((c.height - p) / this._oTileDimension.height), 1), n = (t < m) ? t : m, N = (t / n < M) ? Math.ceil(t / n) : M;
    this._iMaxTiles = m * M;
    this._iMaxTilesX = m;
    this._iMaxTilesY = M;
    this._iOffsetX = Math.floor((c.width - (this._oTileDimension.width * n)) / 2);
    if (jQuery.device.is.desktop) {
        this._iOffsetX += 45
    }
    this._iOffsetY = Math.floor((c.height - p - (this._oTileDimension.height * N)) / 2);
    jQuery.sap.log.debug('maxtiles ' + this._iMaxTiles + ' on page ' + this.getId())
};
sap.m.TileContainer.prototype._getTilesFromPosition = function(x, y) {
    if (!this.getTiles().length)
        return [];
    x = x + this._iScrollLeft;
    var t = this.getTiles(), r = [];
    for (var i = 0; i < t.length; i++) {
        var T = t[i], R = {top: T._posY,left: T._posX,width: T._width,height: T._height};
        if (!t[i].isDragged() && y > R.top && y < R.top + R.height && x > R.left && x < R.left + R.width) {
            r.push(t[i])
        }
    }
    return r
};
sap.m.TileContainer.prototype._applyPageStartIndex = function(i) {
    this._calculatePositions();
    var l = this.getTiles().length;
    if (i < 0) {
        i = 0
    } else if (i > l - 1) {
        i = l - 1
    }
    var c = Math.floor(i / this._iMaxTiles || 0);
    this._iCurrentTileStartIndex = c * (this._iMaxTiles || 0);
    jQuery.sap.log.info('current index ' + this._iCurrentTileStartIndex)
};
sap.m.TileContainer.prototype._scrollTo = function(s, a) {
    if (a !== false)
        a = true;
    this._applyTranslate(jQuery.sap.byId(this.getId() + '-cnt'), -s, 0, a);
    this._iScrollLeft = s
};
sap.m.TileContainer.prototype._applyTranslate = function(a, x, y, A) {
    var o = a[0];
    jQuery.sap.byId(this.getId() + '-cnt').toggleClass('sapMTCAnim', A);
    if ('webkitTransform' in o.style) {
        a.css('-webkit-transform', 'translate3d(' + x + 'px,' + y + 'px,0)')
    } else if ('transform' in o.style) {
        a.css('transform', 'translate3d(' + x + 'px,' + y + 'px,0)')
    } else if ('msTransform' in o.style) {
        a.css('-ms-transform', 'translate(' + x + 'px,' + y + 'px)')
    } else if ('MozTransform' in o.style) {
        a.css('-moz-transform', 'translate3d(' + x + 'px,' + y + 'px,0)')
    }
};
sap.m.TileContainer.prototype._initTouchSession = function(e) {
    if (e.type == 'touchstart') {
        var t = e.targetTouches[0];
        this._oTouchSession = {dStartTime: new Date(),fStartX: t.pageX,fStartY: t.pageY,fDiffX: 0,fDiffY: 0,oControl: e.srcControl,iOffsetX: t.pageX - e.target.offsetLeft}
    } else {
        this._oTouchSession = {dStartTime: new Date(),fStartX: e.pageX,fStartY: e.pageY,fDiffX: 0,fDiffY: 0,oControl: e.srcControl,iOffsetX: e.pageX - e.target.offsetLeft}
    }
};
sap.m.TileContainer.prototype._initDragSession = function(e) {
    while (e.srcControl && e.srcControl.getParent() != this) {
        e.srcControl = e.srcControl.getParent()
    }
    var i = this.indexOfAggregation('tiles', e.srcControl);
    if (e.type == 'touchstart') {
        this._oDragSession = {oTile: e.srcControl,oTileElement: e.srcControl.$()[0],iOffsetLeft: e.targetTouches[0].pageX - e.srcControl._posX + this._iScrollLeft,iOffsetTop: e.targetTouches[0].pageY - e.srcControl._posY,iIndex: i,iOldIndex: i,iDiffX: e.targetTouches[0].pageX,iDiffY: e.targetTouches[0].pageY}
    } else {
        this._oDragSession = {oTile: e.srcControl,oTileElement: e.srcControl.$()[0],iOffsetLeft: e.pageX - e.srcControl._posX + this._iScrollLeft,iOffsetTop: e.pageY - e.srcControl._posY,iIndex: i,iOldIndex: i,iDiffX: e.pageX,iDiffY: e.pageY}
    }
};
sap.m.TileContainer.prototype.onclick = function(e) {
    var p = jQuery.sap.byId(this.getId() + '-pager')[0];
    if (e.target.id == this.getId() + '-leftscroller' || e.target.parentNode.id == this.getId() + '-leftscroller') {
        this.scrollLeft()
    } else if (e.target.id == this.getId() + '-rightscroller' || e.target.parentNode.id == this.getId() + '-rightscroller') {
        this.scrollRight()
    } else if (e.target == p && jQuery.device.is.desktop) {
        if (e.offsetX < p.offsetWidth / 2) {
            this.scrollLeft()
        } else {
            this.scrollRight()
        }
    }
};
sap.m.TileContainer.prototype._onstart = function(e) {
    if (e.targetTouches && e.targetTouches.length > 1 || this._oTouchSession)
        return;
    while (e.srcControl && e.srcControl.getParent() != this) {
        e.srcControl = e.srcControl.getParent()
    }
    if (e.srcControl instanceof sap.m.Tile && this.getEditable() === true) {
        if (e.target.className != 'sapMTCRemove') {
            this._initDragSession(e);
            this._initTouchSession(e);
            this._oDragSession.oTile.isDragged(true)
        } else {
            this._initTouchSession(e)
        }
        this._bAvoidChildTapEvent = true
    } else {
        this._initTouchSession(e)
    }
    if (e.type == 'mousedown') {
        jQuery(document).bind('mousemove', jQuery.proxy(this._onmove, this));
        jQuery(document).bind('mouseup', jQuery.proxy(this._onend, this))
    }
};
sap.m.TileContainer.prototype._onmove = function(e) {
    if (document.selection && document.selection.clear) {
        document.selection.clear()
    }
    if (e.targetTouches && e.targetTouches.length > 1)
        return;
    if (!e.targetTouches) {
        e.targetTouches = [{pageX: e.pageX,pageY: e.pageY}]
    }
    var t = this._oTouchSession;
    t.fDiffX = t.fStartX - e.targetTouches[0].pageX;
    t.fDiffY = t.fStartY - e.targetTouches[0].pageY;
    if (this._oDragSession) {
        if (Math.abs(t.fDiffX) > 5) {
            if (!this._oDragSession.bStarted) {
                this._oDragSession.bStarted = true;
                this._onDragStart(e)
            } else {
                this._onDrag(e)
            }
            this._bAvoidChildTapEvent = true
        }
    } else if (t) {
        var n = -this._iScrollLeft - t.fDiffX;
        if (n > this._iScrollGap) {
            return
        } else if (n < -(((this._iPages - 1) * this._getContentDimension().outerwidth) + this._iScrollGap)) {
            return
        }
        this._applyTranslate(jQuery.sap.byId(this.getId() + '-cnt'), n, 0, false)
    }
};
sap.m.TileContainer.prototype._onend = function(e) {
    if (jQuery.sap.touchEventMode != 'ON') {
        jQuery(document).unbind('mousemove', this._onmove);
        jQuery(document).unbind('mouseup', this._onend)
    }
    if (this._oDragSession) {
        this._onDrop(e);
        delete this._oTouchSession;
        return
    }
    if (!this._oTouchSession)
        return;
    var t = this._oTouchSession, d = new Date(), f = (d - t.dStartTime < 600);
    if (f) {
        var p = jQuery.sap.byId(this.getId() + '-pager')[0];
        if (Math.abs(t.fDiffX) > 30) {
            this._applyPageStartIndex(this._iCurrentTileStartIndex + ((t.fDiffX > 0 ? 1 : -1) * this._iMaxTiles));
            this._bAvoidChildTapEvent = true
        } else if (e.target == p && !jQuery.device.is.desktop) {
            if (t.iOffsetX < p.offsetWidth / 2) {
                this.scrollLeft()
            } else {
                this.scrollRight()
            }
            this._bAvoidChildTapEvent = true
        } else if (e.target.className == 'sapMTCRemove') {
            this.fireTileDelete({tile: t.oControl})
        }
    } else {
        var c = this._getContentDimension();
        if (Math.abs(t.fDiffX) > c.outerwidth / 2) {
            this._applyPageStartIndex(this._iCurrentTileStartIndex + ((t.fDiffX > 0 ? 1 : -1) * this._iMaxTiles));
            this._bAvoidChildTapEvent = true
        }
    }
    this._update();
    delete this._oDragSession;
    delete this._oTouchSession;
    var a = this;
    setTimeout(function() {
        a._bAvoidChildTapEvent = false
    }, 100)
};
sap.m.TileContainer.prototype._onDragStart = function(e) {
    this.$().append(this._oDragSession.oTileElement);
    this._oDragSession.iDiffX = this._oTouchSession.fStartX - this._oTouchSession.fDiffX;
    this._oDragSession.iDiffY = this._oTouchSession.fStartY - this._oTouchSession.fDiffY;
    this._oDragSession.oTile.setPos(this._oDragSession.iDiffX - this._oDragSession.iOffsetLeft, this._oDragSession.iDiffY - this._oDragSession.iOffsetTop);
    jQuery.sap.byId(this.getId() + '-blind').css('display', 'block')
};
sap.m.TileContainer.prototype._onDrag = function(e) {
    if (!this._oTouchSession) {
        clearTimeout(this.iScrollTimer);
        this._oDragSession = null;
        this.iScrollTimer = null;
        this._bTriggerScroll = false;
        return
    }
    this._oDragSession.iDiffX = this._oTouchSession.fStartX - this._oTouchSession.fDiffX;
    this._oDragSession.iDiffY = this._oTouchSession.fStartY - this._oTouchSession.fDiffY;
    var c = this._getContentDimension(), t = this._oDragSession.iDiffY - this._oDragSession.iOffsetTop, l = this._oDragSession.iDiffX - this._oDragSession.iOffsetLeft, m = t + (this._oDragSession.oTileElement.offsetHeight / 2), C = l + (this._oDragSession.oTileElement.offsetWidth / 2), s = l + this._oDragSession.oTileElement.offsetWidth - this._iTriggerScrollOffset > c.width, S = l < -this._iTriggerScrollOffset, n = c.width - (l + this._oDragSession.oTileElement.offsetWidth), N = l;
    this._oDragSession.oTile.setPos(l, t);
    this._oDragSession.oTile.$().css('clip', 'auto');
    var r = jQuery.sap.byId(this.getId() + '-rightedge')[0];
    if (l + this._oDragSession.oTile._width > r.offsetLeft + r.offsetWidth && this._iCurrentPage < this._iPages - 1) {
        var i = r.offsetLeft + r.offsetWidth - l - ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2) - 2;
        this._oDragSession.oTile.$().css('clip', 'rect(-25px,' + i + 'px,' + (this._oDragSession.oTile._height + 20) + 'px,-25px)')
    }
    var L = jQuery.sap.byId(this.getId() + '-leftedge')[0];
    if (l < L.offsetLeft + 2 + ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2) && this._iCurrentPage > 0) {
        var a = L.offsetLeft + 4 - l - ((this._oDragSession.oTile._width - this._oDragSession.oTile.$().outerWidth(false)) / 2);
        this._oDragSession.oTile.$().css('clip', 'rect(-25px,' + this._oDragSession.oTile._width + 'px,' + (this._oDragSession.oTile._height + 20) + 'px,' + a + 'px)')
    }
    if (n < this._iEdgeShowStart && this._iCurrentPage < this._iPages - 1) {
        var o = (this._iEdgeShowStart - n) / (this._iEdgeShowStart + this._iTriggerScrollOffset);
        jQuery.sap.byId(this.getId() + '-rightedge').css('opacity', '' + o)
    } else {
        jQuery.sap.byId(this.getId() + '-rightedge').css('opacity', '0.01')
    }
    if (N < this._iEdgeShowStart && this._iCurrentPage > 0) {
        var o = (this._iEdgeShowStart - N) / (this._iEdgeShowStart + this._iTriggerScrollOffset);
        jQuery.sap.byId(this.getId() + '-leftedge').css('opacity', '' + o)
    } else {
        jQuery.sap.byId(this.getId() + '-leftedge').css('opacity', '0.01')
    }
    if ((S && this._iCurrentPage > 0) || (s && this._iCurrentPage < this._iPages - 1)) {
        if (this._bTriggerScroll) {
            if (S) {
                this.scrollLeft()
            } else {
                this.scrollRight()
            }
        } else {
            var b = this;
            if (!this.iScrollTimer) {
                this.iScrollTimer = setInterval(function() {
                    b._bTriggerScroll = true;
                    b._onDrag(e);
                    b._bTriggerScroll = false
                }, 1000)
            }
        }
        return
    } else {
        if (this.iScrollTimer) {
            clearTimeout(this.iScrollTimer);
            this._bTriggerScroll = false;
            this.iScrollTimer = null
        }
    }
    var h = this._getTilesFromPosition(C, m);
    if (h && h.length > 0) {
        var H = h[0], R = {top: H._posY,left: H._posX,width: H._width,height: H._height};
        var I = this.indexOfAggregation('tiles', H);
        if (C + this._iScrollLeft < ((R.left + R.width) / 2) && (I % this._iMaxTilesX) != 0) {
            I--
        }
        this._oDragSession.iIndex = I;
        this.moveTile(this._oDragSession.oTile, this._oDragSession.iIndex)
    } else if (this._iCurrentPage == this._iPages - 1) {
        var T = this.getTiles(), d = T[T.length - 1];
        if (d && C > d._posX - this._iScrollLeft && m > d._posY) {
            this._oDragSession.iIndex = T.length - 1;
            this.moveTile(this._oDragSession.oTile, this._oDragSession.iIndex)
        }
    }
};
sap.m.TileContainer.prototype._onDrop = function(e) {
    if (this._oDragSession) {
        var t = this._oDragSession.oTile, i = this._oDragSession.iIndex;
        this._oDragSession.oTile.isDragged(false);
        if (this._oDragSession.iOldIndex != this._oDragSession.iIndex) {
            this.fireTileMove({tile: t,newIndex: i})
        }
        jQuery.sap.byId(this.getId() + '-blind').css('display', 'block');
        if (this._oDragSession.bStarted) {
            this._oDragSession.oTile.setPos(this._oDragSession.oTile._posX + this._iScrollLeft, this._oDragSession.oTile._posY)
        }
        this._oDragSession.oTile.$().css('clip', 'auto');
        jQuery.sap.byId(this.getId() + '-rightedge').css('opacity', '0.01');
        jQuery.sap.byId(this.getId() + '-leftedge').css('opacity', '0.01');
        jQuery.sap.byId(this.getId() + '-cnt').append(this._oDragSession.oTileElement);
        delete this._oDragSession;
        this.moveTile(t, i);
        this.scrollIntoView(t, false);
        jQuery.sap.byId(this.getId() + '-blind').css('display', 'none')
    }
};

//@ sourceURL=http://veui5infra.dhcp.wdf.sap.corp:8080/demokit/resources/sap/m/library-preload.json/sap/m/TileContainer.js