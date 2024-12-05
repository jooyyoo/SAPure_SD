sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/NumberFormat",
    "sap/m/MessageToast",
],
    function (Controller, JSONModel, NumberFormat, MessageToast) {
        "use strict";

        var oCartModel = new JSONModel({
            PaySet: [
                {
                    Matnr: "WPFS011",
                    Wmeng: 3,
                    Meins: "EA",
                    Netpr: 1010000,
                    Waers: "KRW",
                    Image: "/sap/bc/ui5_ui5/sap/zc503sdcds0010/image/WPFS011.png",
                    Sale: 0,
                    percent: 10,
                },
                {
                    Matnr: "WPFS012",
                    Wmeng: 2,
                    Meins: "EA",
                    Netpr: 2000000,
                    Waers: "KRW",
                    Image: "/sap/bc/ui5_ui5/sap/zc503sdcds0010/image/WPFS012.png",
                    Sale: 0,
                    percent: 10,
                },
                {
                    Matnr: "WPFS013",
                    Wmeng: 3,
                    Meins: "EA",
                    Netpr: 3000000,
                    Waers: "KRW",
                    Image: "/sap/bc/ui5_ui5/sap/zc503sdcds0010/image/WPFS013.png",
                    Sale: 0,
                    percent: 10,
                }
            ],
            TotalPrice: 0,
            TotalSale: 0,
            FinalPrice: 0,
            ShippingFee: 0, //배송비
            allSelected: true,
        });

        return Controller.extend("zc503sd.gw0011.sapuresdcartview.controller.CartView", {
            onInit: function () {
                this._setSaleValues(); // Sale 값 설정 메서드 호출
                this._calculatePrice(oCartModel);
                this.getView().setModel(oCartModel, "cart");

                var oModel = this.getView().getModel("cart"); // 모델 가져오기
                var aPaySet = oModel.getProperty("/PaySet"); // PaySet 가져오기
                aPaySet.forEach(function (item) {
                    item.TotalNetpr = item.Netpr * item.Wmeng; // 원가 * 수량
                    item.TotalSale = item.Sale * item.Wmeng; // 할인가 * 수량
                });
                oModel.setProperty("/PaySet", aPaySet); // 변경된 PaySet 모델에 반영

                this._updateShippingFee();
                this._updateFinalPrice();
            },
            onQuantityChange: function (oEvent) {
                // 수량 변경 처리 로직
                var oModel = this.getView().getModel("cart"); // 모델 가져오기
                var oSource = oEvent.getSource(); // 이벤트를 발생시킨 StepInput
                var sPath = oSource.getBindingContext("cart").getPath(); // 변경된 항목의 경로
                var oData = oModel.getProperty(sPath); // 해당 항목 데이터 가져오기

                // 수량 변경 반영
                var iNewQuantity = oSource.getValue(); // StepInput에서 변경된 수량 가져오기
                oData.Wmeng = iNewQuantity; // 모델 데이터에 수량 업데이트

                oData.TotalNetpr = oData.Netpr * iNewQuantity; // 원가 * 수량
                oData.TotalSale = oData.Sale * iNewQuantity; // 할인가 * 수량

                oModel.setProperty(sPath, oData); // 변경된 데이터 모델에 반영

                // 선택된 항목만 총 가격 계산
                var oList = this.byId("listId"); // 리스트 객체
                var aSelectedItems = oList.getSelectedItems(); // 선택된 항목 가져오기
                var iTotalPrice = 0;

                // 선택된 항목의 가격 합산
                aSelectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext("cart"); // 선택된 항목의 바인딩 컨텍스트
                    var oItemData = oContext.getObject(); // 항목 데이터 가져오기
                    iTotalPrice += oItemData.Sale * oItemData.Wmeng; // 가격 계산
                });

                // TotalPrice 업데이트
                oModel.setProperty("/TotalPrice", iTotalPrice);
                this._updateFinalPrice();
            },
            onDeleteItem: function () {
                var oList = this.byId("listId"); // List ID 사용
                var aSelectedItems = oList.getSelectedItems(); // 선택된 항목 가져오기
                var oModel = this.getView().getModel("cart");

                // PaySet 데이터 가져오기
                var aPaySet = oModel.getProperty("/PaySet");

                // 선택된 항목 삭제 (역순으로 처리)
                for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                    var sPath = aSelectedItems[i].getBindingContext("cart").getPath(); // 경로 가져오기
                    var iIndex = parseInt(sPath.split("/")[2], 10); // 인덱스 추출
                    aPaySet.splice(iIndex, 1); // PaySet에서 항목 제거
                }

                // 변경된 데이터 모델에 반영
                oModel.setProperty("/PaySet", aPaySet);

                // 리스트 선택 초기화
                oList.removeSelections();

                this._updatePrice();
                this._updateShippingFee();
                this._updateFinalPrice();
            },
            onCheckout: function () {
                // 결제 처리 로직
                var oModel = this.getView().getModel("cart");
                var iFinalPrice = oModel.getProperty("/FinalPrice");

                if (iFinalPrice === 0) {
                    // FinalPrice가 0인 경우 경고 메시지 표시
                    MessageToast.show("1개 이상의 상품을\n선택해주세요");
                }

                // 여기서 결제로 라우팅 하면 됨
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutePayView");

            },
            _calculatePrice: function (oCartModel) {
                var aPaySet = oCartModel.getProperty("/PaySet"); // PaySet 배열 가져오기

                // TotalPrice 계산
                var iTotalPrice = aPaySet.reduce(function (sum, item) {
                    return sum + item.Wmeng * item.Sale;
                }, 0);

                // TotalPrice 값 설정
                oCartModel.setProperty("/TotalPrice", iTotalPrice);
            },
            onParentClicked: function (oEvent) {
                var bSelected = oEvent.getParameter("selected"); // 체크박스 상태 (선택 여부)

                if (bSelected) {
                    this._calculatePrice(oCartModel);
                } else {
                    oCartModel.setProperty("/TotalPrice", 0);
                }

                var oList = this.byId("listId"); // 리스트 객체
                var aItems = oList.getItems(); // 리스트의 모든 항목

                // 리스트의 모든 항목 선택/해제
                aItems.forEach(function (oItem) {
                    oList.setSelectedItem(oItem, bSelected); // 선택 상태 설정
                });

                // 모델에 전체 선택 상태 업데이트
                var oModel = this.getView().getModel("cart");
                oModel.setProperty("/allSelected", bSelected);

                this._updateShippingFee();
                this._updateFinalPrice();
            },
            onSelectionChange: function () {
                var oList = this.byId("listId"); // 리스트 객체
                var aSelectedItems = oList.getSelectedItems(); // 선택된 항목
                var oModel = this.getView().getModel("cart"); // 모델 가져오기

                var iTotalPrice = 0; // 총 금액 초기화

                // 선택된 항목의 가격 합산
                aSelectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext("cart"); // 항목의 바인딩 컨텍스트
                    var oData = oContext.getObject(); // 선택된 항목의 데이터 가져오기
                    iTotalPrice += oData.Sale * oData.Wmeng; // 가격 합산
                });

                // TotalPrice 업데이트
                oModel.setProperty("/TotalPrice", iTotalPrice);

                // 전체 선택 상태 업데이트
                var bAllSelected = aSelectedItems.length === oList.getItems().length;
                oModel.setProperty("/allSelected", bAllSelected);

                this._updateShippingFee();
                this._updateFinalPrice();
            },
            _updatePrice: function () {
                var oList = this.byId("listId"); // 리스트 객체
                var aSelectedItems = oList.getSelectedItems(); // 선택된 항목
                var oModel = this.getView().getModel("cart"); // 모델 가져오기

                var iTotalPrice = 0; // 총 금액 초기화

                // 선택된 항목의 가격 합산
                aSelectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext("cart"); // 항목의 바인딩 컨텍스트
                    var oData = oContext.getObject(); // 선택된 항목의 데이터 가져오기
                    iTotalPrice += oData.Sale * oData.Wmeng; // 가격 합산
                });

                // TotalPrice 업데이트
                oModel.setProperty("/TotalPrice", iTotalPrice);
            },
            _updateShippingFee: function () {
                var oList = this.byId("listId"); // 리스트 객체
                var aSelectedItems = oList.getSelectedItems(); // 선택된 항목 가져오기
                var oModel = this.getView().getModel("cart"); // 모델 가져오기

                // 선택된 항목이 있는 경우 배송비 3000원, 없으면 0원
                var iShippingFee = aSelectedItems.length > 0 ? 3000 : 0;
                oModel.setProperty("/ShippingFee", iShippingFee);
            },
            formatDiscount: function (sValue) {
                var oCurrencyFormat = NumberFormat.getCurrencyInstance({
                    currencyCode: false,
                    decimals: 0, // 통화 키 숨기기 (KRW는 아래에서 제공)
                });
                return "- " + oCurrencyFormat.format(sValue) + " KRW";
            },
            _updateFinalPrice: function () {
                var oModel = this.getView().getModel("cart");
                var iTotalPrice = oModel.getProperty("/TotalPrice");
                var iTotalSale = oModel.getProperty("/TotalSale");
                var iShippingFee = oModel.getProperty("/ShippingFee");

                var iFinalPrice = iTotalPrice - iTotalSale + iShippingFee;
                oModel.setProperty("/FinalPrice", iFinalPrice);
            },
            _setSaleValues: function () {
                var aPaySet = oCartModel.getProperty("/PaySet");

                // Sale 값 설정
                aPaySet.forEach(function (item) {
                    item.Sale = item.Netpr - Math.floor(item.Netpr / item.percent);
                });

                // 모델에 업데이트된 PaySet 반영
                oCartModel.setProperty("/PaySet", aPaySet);
            },
        });
    });
