sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("zc503sd.gw0004.sapuresdauthview.controller.AuthView", {
            onInit: function () {

            },

            onPressLogin: function () {

                //서버에서 해당 아이디를 가진 고객을 read
                let oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC503SDGW0001_SRV/");
                var id = this.getView().byId('Iid').getValue();

                oModel.read("/AuthSet(Customer='"+id+"')",{
                    success: function (oData) {
                        // 성공적으로 데이터를 가져온 경우
                        sap.m.MessageToast.show("Customer Name: " + oData.Name);
                      },
                      error: function (oError) {
                        // 오류 처리
                        sap.m.MessageToast.show("Customer not found or error occurred.");
                      }
                });

            }
        });
    });
