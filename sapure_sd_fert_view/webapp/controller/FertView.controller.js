sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zc503sd.gw0001.sapuresdfertview.controller.FertView", {
            onInit: function () {

                var oModel = new JSONModel({
                    expanded: true // 사이드 네비게이션의 기본 상태
                  });
                  this.getView().setModel(oModel, "expand");
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC503SDCDS0001_CDS/");
                // this.getView().setModel(oModel);

            },

            // onCollapseExpandPress() {
            //     const oSideNavigation = this.byId("sideNavigation"),
            //         bExpanded = oSideNavigation.getExpanded();

            //     oSideNavigation.setExpanded(!bExpanded);
            // },

            onCollapseExpandPress() {
                var oModel = this.getView().getModel("expand");
                var bExpanded = oModel.getProperty("/expanded"); // boolean 값
                oModel.setProperty("/expanded", !bExpanded); // expanded 상태 토글 
            },
        });
    });
