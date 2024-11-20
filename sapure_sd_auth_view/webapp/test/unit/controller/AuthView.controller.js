/*global QUnit*/

sap.ui.define([
	"zc503sdgw0004/sapure_sd_auth_view/controller/AuthView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AuthView Controller");

	QUnit.test("I should test the AuthView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
