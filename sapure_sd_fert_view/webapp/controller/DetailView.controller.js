sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (
    Controller
) {
    "use strict";

    return Controller.extend("zc503sd.gw0001.sapuresdfertview.controller.DetailView", {

        onInit: function () {

            var oExpandModel = new sap.ui.model.json.JSONModel({ expanded: true });
            this.getView().setModel(oExpandModel, "expand");

<<<<<<< HEAD
            // expand 모델 초기화 및 뷰에 설정
=======
>>>>>>> a40ff916d60f852d55034333381ad574436407bf
            var oExpandModel = new sap.ui.model.json.JSONModel({ expanded: true });
            this.getView().setModel(oExpandModel, "expand");

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteDetailView").attachPatternMatched(this._onObjectMatched, this);

            // OData 모델 설정 (DetailSet 데이터)
            const oODataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC503SDCDS0002_CDS/");
            const oModel = new sap.ui.model.json.JSONModel();

            // 데이터 로딩 상태를 관리할 플래그 추가
            this.isModelLoaded = false;

            oODataModel.read("/DetailSet", {
                success: function (OData) {

                    var sortedData = OData.results.sort(function (a, b) {
                        if (a.Matnr < b.Matnr) return -1; // Matnr 기준 오름차순
                        if (a.Matnr > b.Matnr) return 1;
                        return 0;
                    });

                    console.log("DetailSet data after sorting:", sortedData);

                    // JSON 모델에 데이터 설정
                    oModel.setData({ oData: sortedData });
                    this.getView().setModel(oModel, "oModel");

                    // 데이터 로드 완료 플래그 설정
                    this.isModelLoaded = true;

                    // `select_Maktx`가 필요한 경우 실행
                    if (this.pendingId) {
                        this.processSelectMaktx(this.pendingId);
                        this.pendingId = null; // 대기 중인 ID를 초기화
                    }
                }.bind(this),
                error: function (error) {
                    console.error("Error loading DetailSet:", error);
                },
            });

            this._startCarouselAutoSlide();
        },

        onCollapseExpandPress() {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },

<<<<<<< HEAD
        onAddToCart: function () {
            sap.m.MessageToast.show("장바구니에 추가되었습니다!");
        },

=======
>>>>>>> a40ff916d60f852d55034333381ad574436407bf
        onCollapseExpandPress() {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },

        processSelectMaktx: function (sId) {
            const oModel = this.getView().getModel("oModel");
            if (!oModel) {
                console.error("oModel이 설정되지 않았습니다.");
                return;
            }

            console.log("oModel: ", oModel);

            console.log("Processing select_Maktx with ID:", sId);

            const aData = oModel.getProperty("/oData") || [];

            console.log("aData: ", aData);

            if (!Array.isArray(aData)) {
                console.error("oData가 배열이 아닙니다. 데이터 구조를 확인하세요.");
                return;
            }

            let sDes = "";
            let sAmount = "";
            for (let i = 0; i < aData.length; i++) {
                if (sId === aData[i].Matnr) {
                    sDes = aData[i].Maktx;
                    sAmount = aData[i].Netpr
                    break;
                }
            }

            if (sDes) {
                oModel.setProperty("/selectedId", sId);
                oModel.setProperty("/selectedDes", sDes);
                oModel.setProperty("/selectedAmount", sAmount);
                console.log("Description 설정 완료:", sDes);
            } else {
                console.warn("주어진 ID와 일치하는 데이터를 찾을 수 없습니다.");
            }
        },

        _onObjectMatched: function (oEvent) {

            const sId = oEvent.getParameter("arguments").id;
            console.log("Received ID:", sId);

            if (this.isModelLoaded) {
                // 데이터가 이미 로드된 상태라면 즉시 처리
                this.processSelectMaktx(sId);
            } else {
                // 데이터가 아직 로드되지 않은 경우, 대기 상태로 저장
                console.warn("Model data not loaded yet. Storing pending ID:", sId);
                this.pendingId = sId;
            }
        },

        onCollapseExpandPress() {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },

        _startCarouselAutoSlide: function () {
            var oCarousel = this.byId("productImages");
            var iSlideIndex = 0; // 현재 슬라이드 인덱스
            var iSlideCount = oCarousel.getPages().length; // 슬라이드 총 개수

            // 3초마다 슬라이드 변경
            setInterval(function () {
                iSlideIndex = (iSlideIndex + 1) % iSlideCount; // 다음 슬라이드 인덱스 계산
                oCarousel.setActivePage(oCarousel.getPages()[iSlideIndex]); // 슬라이드 전환
            }, 3000); // 3000ms = 3초
        },

    });
});