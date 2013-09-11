/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.m.StandardTileRenderer');
jQuery.sap.require('sap.m.TileRenderer');
sap.m.StandardTileRenderer = sap.ui.core.Renderer.extend(sap.m.TileRenderer);
sap.m.StandardTileRenderer._renderContent = function(r, t) {
	r.write('<div');
	r.addClass('sapMStdTileTopRow');
	r.writeClasses();
	r.write('>');
	if (t.getIcon()) {
		r.write('<div');
		r.addClass('sapMStdTileIconDiv');
		switch (t.getType()) {
			case sap.m.StandardTileType.Monitor:
				r.addClass('sapMStdIconMonitor');
				break;
			case sap.m.StandardTileType.Create:
				r.addClass('sapMStdIconCreate');
				break
		}
		r.writeClasses();
		r.write('>');
		r.renderControl(t._getImage());
		r.write('</div>');
	}
	if (t.getNumber()) {
		r.write('<div');
		r.addClass('sapMStdTileNumDiv');
		r.writeClasses();
		r.write('>');
		r.write('<div');
		r.writeAttribute('id', t.getId() + '-number');
		var n = t.getNumber().length;
		if (n < 5) {
			r.addClass('sapMStdTileNum');
		} else if (n < 8) {
			r.addClass('sapMStdTileNumM');
		} else {
			r.addClass('sapMStdTileNumS');
		}
		r.writeClasses();
		r.write('>');
		r.writeEscaped(t.getNumber());
		r.write('</div>');
		if (t.getNumberUnit()) {
			r.write('<div');
			r.writeAttribute('id', t.getId() + '-numberUnit');
			r.addClass('sapMStdTileNumUnit');
			r.writeClasses();
			r.write('>');
			r.writeEscaped(t.getNumberUnit());
			r.write('</div>');
		}
		r.write('</div>');
	}
	r.write('</div>');
	r.write('<div');
	r.addClass('sapMStdTileBottomRow');
	if (t.getType() === sap.m.StandardTileType.Monitor) {
		r.addClass('sapMStdTileMonitorType');
	}
	r.writeClasses();
	r.write('>');
	r.write('<div');
	r.writeAttribute('id', t.getId() + '-title');
	r.addClass('sapMStdTileTitle');
	r.writeClasses();
	r.write('>');
	if (t.getTitle()) {
		r.writeEscaped(t.getTitle());
	}
	r.write('</div>');
	if (t.getInfo()) {
		r.write('<div');
		r.writeAttribute('id', t.getId() + '-info');
		r.addClass('sapMStdTileInfo');
		r.addClass('sapMStdTileInfo' + t.getInfoState());
		r.writeClasses();
		r.write('>');
		if (t.getInfo()) {
			r.writeEscaped(t.getInfo());
		}
		r.write('</div>');
	}
	r.write('</div>');
};

//@ sourceURL=http://veui5infra.dhcp.wdf.sap.corp:8080/demokit/resources/sap/m/library-preload.json/sap/m/StandardTileRenderer.js