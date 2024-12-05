/*global QUnit*/

sap.ui.define([
	"zc503sdgw0011/sapure_sd_cart_view/controller/CartView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CartView Controller");

	QUnit.test("I should test the CartView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
