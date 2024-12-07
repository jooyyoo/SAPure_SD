sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Binding",
    "sap/ui/core/UIComponent"
],
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("zc503sd.gw0004.sapuresdauthview.controller.AuthView", {
            onInit: function () {

            },

            onPressLogin: function () {

                //서버에서 해당 아이디를 가진 고객을 read
                let oModel = this.getView().getModel();

                console.log(oModel);

                var id = this.getView().byId('Iid').getValue(),
                    pw = this.getView().byId('Ipw').getValue();

                oModel.read("/AuthSet(Customer='" + id + "')", {
                    success: function (oData) {
                        // 성공적으로 데이터를 가져온 경우
                        console.log(oData);
                        if (pw != oData.Password) {
                            sap.m.MessageToast.show("비밀번호가 틀렸습니다.");
                        } else {
                            sap.m.MessageToast.show(oData.Name + "님 환영합니다.");
                        }

                    },
                    error: function (oError) {
                        // 오류 처리
                        sap.m.MessageToast.show("Customer not found or error occurred.");
                    }
                });

            },

            onPressSave: function () {

                var username = sap.ui.getCore().byId("DI_id").getValue();
                var email = sap.ui.getCore().byId("DI_email").getValue();
                var password = sap.ui.getCore().byId("DI_pw").getValue();
                var passwordConfirm = sap.ui.getCore().byId("DI_rpw").getValue();

                let oModel = this.getView().getModel();

                var oUpdate = {
                    Password: password,
                };

                if (password !== passwordConfirm) {
                    sap.m.MessageToast.show("비밀번호가 일치하지 않습니다.");
                    return;
                }

                oModel.read("/AuthSet(Customer='" + username + "')", {
                    success: (oData) => {
                        if (email !== oData.Email) {
                            sap.m.MessageToast.show("가입한 이메일이 아닙니다.");
                        } else {
                            // 이메일이 일치하는 경우 업데이트 진행
                            oModel.update(
                                "/AuthSet(Customer='" + username + "')", oUpdate,
                                {
                                    success: () => {
                                        sap.m.MessageToast.show("비밀번호 재설정이 완료되었습니다.");
                                        this.oResizableDialog.close(); // 'this'가 유지됨
                                    },
                                    error: (oError) => {
                                        sap.m.MessageToast.show("서버 오류가 발생했습니다. 다시 시도해주세요.");
                                    }
                                }
                            );
                        }
                    },
                    error: (oError) => {
                        sap.m.MessageToast.show("Customer not found or error occurred.");
                    }
                });
            },

            onLinkPress: function () {

                if (!this.oResizableDialog) {
                    this.oResizableDialog = new sap.m.Dialog({
                        id: "reDialog",
                        title: "비밀번호 재설정",
                        contentWidth: "450px",
                        contentHeight: "auto",
                        resizable: true,
                        content: [
                            // 아이디 필드
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Text({ text: "아이디: ", width: "50px" }),
                                            new sap.m.Input({
                                                id: "DI_id",
                                                placeholder: "아이디 입력",
                                                type: sap.m.InputType.Text,
                                                width: "100%"
                                            })
                                        ],
                                        justifyContent: "SpaceBetween", // 아이템 간격 조정
                                        alignItems: "Center",
                                        width: "70%"
                                    }).addStyleClass("customPadding")
                                ]
                            }),

                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Text({ text: "이메일: ", width: "50px" }),
                                            new sap.m.Input({
                                                id: "DI_email",
                                                placeholder: "이메일 입력",
                                                type: sap.m.InputType.Email,
                                                width: "100%"
                                            })
                                        ],
                                        justifyContent: "SpaceBetween", // 아이템 간격 조정
                                        alignItems: "Center",
                                        width: "70%"
                                    }).addStyleClass("customPadding")
                                ]
                            }),

                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Text({ text: "비밀번호: ", width: "70px" }),
                                            new sap.m.Input({
                                                id: "DI_pw",
                                                placeholder: "비밀번호 입력",
                                                type: sap.m.InputType.Password,
                                                width: "100%"
                                            })
                                        ],
                                        justifyContent: "SpaceBetween", // 아이템 간격 조정
                                        alignItems: "Center",
                                        width: "70%"
                                    }).addStyleClass("customPadding")
                                ]
                            }),

                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Text({ text: "비밀번호 확인: ", width: "100px" }),
                                            new sap.m.Input({
                                                id: "DI_rpw",
                                                placeholder: "비밀번호 확인",
                                                type: sap.m.InputType.Password,
                                                width: "100%"
                                            })
                                        ],
                                        justifyContent: "SpaceBetween", // 아이템 간격 조정
                                        alignItems: "Center",
                                        width: "70%"
                                    }).addStyleClass("customPadding")
                                ]
                            }),
                        ],
                        buttons: [
                            // 초기화 버튼
                            new sap.m.Button({
                                text: "취소",
                                press: function () {
                                    this.oResizableDialog.close();
                                }.bind(this)
                            }),
                            // 닫기 버튼
                            new sap.m.Button({
                                id: "btnSave",
                                text: "저장",
                                press: function () {

                                    var username = sap.ui.getCore().byId("DI_id").getValue();
                                    var email = sap.ui.getCore().byId("DI_email").getValue();
                                    var password = sap.ui.getCore().byId("DI_pw").getValue();
                                    var passwordConfirm = sap.ui.getCore().byId("DI_rpw").getValue();
                                    if (!username || !email || !password || !passwordConfirm) {
                                        // 하나라도 비어 있으면 메시지 표시
                                        sap.m.MessageToast.show("모두 입력해주세요.", {
                                            duration: 3000,
                                            width: "15em",
                                            at: "center center"
                                        });
                                    } else {
                                        // 모든 값이 입력되었을 때 처리
                                        this.onPressSave();
                                    }
                                }.bind(this)
                            })
                        ],

                    });
                }

                // 다이얼로그 열기
                this.oResizableDialog.open();

            },

            onPressJoin: function () {

                console.log("회원가입 클릭");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteJoinView");
            }
        });
    });
