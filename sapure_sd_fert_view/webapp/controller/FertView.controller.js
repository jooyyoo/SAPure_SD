sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zc503sd.gw0001.sapuresdfertview.controller.FertView", {
            onInit: function () {

                var oModel = new JSONModel({
                    expanded: true // 사이드 네비게이션의 기본 상태
                });
                this.getView().setModel(oModel, "expand");

            },

            onCollapseExpandPress: function () {
                var oModel = this.getView().getModel("expand");
                var bExpanded = oModel.getProperty("/expanded"); // boolean 값
                oModel.setProperty("/expanded", !bExpanded); // expanded 상태 토글 
            },

            onBomSelect:function(){
                sap.m.MessageToast.show("죄송합니다. \n재정비 중인 페이지입니다");
            },

            onPressMatnr: function (oEvent) {

                console.log("Press 이벤트 발생:", oEvent);
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();

                console.log("BindingContext:", oContext); // 컨텍스트 정보 출력

                if (oContext) {
                    var sMatnr = oContext.getProperty("Matnr");
                    console.log("Matnr 값: ", sMatnr);  // Matnr 값이 잘 출력되는지 확인
                    sap.m.MessageToast.show("제품 번호: " + sMatnr);
                } else {
                    console.log("선택된 항목이 없습니다.");
                }
            },

        });
    });
