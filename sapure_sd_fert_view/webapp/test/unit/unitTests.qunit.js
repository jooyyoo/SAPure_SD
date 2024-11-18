/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc503sdgw0001/sapure_sd_fert_view/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
