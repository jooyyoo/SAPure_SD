sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/layout/HorizontalLayout",
    "sap/ui/layout/VerticalLayout",
    "sap/m/TextArea",
    "sap/ui/model/Binding",
],
    function (Controller, Dialog, List, StandardListItem, Text, Button, library, HorizontalLayout, VerticalLayout, TextArea,) {
        "use strict";

        return Controller.extend("zc503sd.gw0004.sapuresdauthview.controller.AuthView", {
            onInit: function () {

            },

            onPressLogin: function () {

                //서버에서 해당 아이디를 가진 고객을 read
                let oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZC503SDGW0001_SRV/");

                console.log(oModel);

                var id = this.getView().byId('Iid').getValue();

                oModel.read("/AuthSet(Customer='" + id + "')", {
                    success: function (oData) {
                        // 성공적으로 데이터를 가져온 경우
                        sap.m.MessageToast.show("Customer Name: " + oData.Name);
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


                if (password !== passwordConfirm) {
                    sap.m.MessageToast.show("비밀번호가 일치하지 않습니다.");
                    return;
                }

                // 서버로 전송하는 로직 (예시)F
                let oModel = this.getView().getModel();

                var oUpdate = {
                    Customer: username,
                    Email: email,
                    Password: password,
                };

                oModel.update
                    (
                        "/AuthSet(Customer='" + oUpdate.Customer + "')",
                        oUpdate,
                        {
                            success: function () {
                                // 서버 응답 성공 시 처리

                                // oModel.refresh()
                                sap.m.MessageToast.show("비밀번호 재설정이 완료되었습니다.");
                                this.oResizableDialog.close();
                            }.bind(this),
                            error: function (oError) {
                                // 서버 응답 실패 시 처리
                                console.log(oUpdate.username);
                                sap.m.MessageToast.show("서버 오류가 발생했습니다. 다시 시도해주세요.");
                            }
                        }
                    );
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
                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({ text: "아이디: ", width: "120px" }),
                                    new sap.m.Input({
                                        id: "DI_id",
                                        placeholder: "아이디 입력",
                                        type: sap.m.InputType.Text,
                                        width: "100%"
                                    })
                                ]
                            }),
                            // 이메일 필드
                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({ text: "이메일: ", width: "120px" }),
                                    new sap.m.Input({
                                        id: "DI_email",
                                        placeholder: "이메일 입력",
                                        type: sap.m.InputType.Email,
                                        width: "100%"
                                    })
                                ]
                            }),
                            // 비밀번호 필드
                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({ text: "비밀번호: ", width: "120px" }),
                                    new sap.m.Input({
                                        id: "DI_pw",
                                        placeholder: "비밀번호 입력",
                                        type: sap.m.InputType.Password,
                                        width: "100%"
                                    })
                                ]
                            }),
                            // 비밀번호 확인 필드
                            new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({ text: "비밀번호 확인: ", width: "120px" }),
                                    new sap.m.Input({
                                        id: "DI_rpw",
                                        placeholder: "비밀번호 확인",
                                        type: sap.m.InputType.Password,
                                        width: "100%"
                                    })
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




        });
    });
