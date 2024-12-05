/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc503sdgw0011/sapure_sd_cart_view/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
