/*global QUnit*/

sap.ui.define([
	"zc503sdgw0001/sapure_sd_fert_view/controller/FertView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FertView Controller");

	QUnit.test("I should test the FertView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
