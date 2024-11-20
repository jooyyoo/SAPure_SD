/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zc503sdgw0004/sapure_sd_auth_view/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
