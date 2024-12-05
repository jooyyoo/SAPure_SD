sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(
	Controller, ODataModel, MessageToast, MessageBox
) {
	"use strict";

	return Controller.extend("zc503sd.gw0004.sapuresdauthview.controller.JoinView", {
	
        onInit: function () 
        {
            // Wizard 초기화
            this._wizard = this.byId("idWizard");

            // OData 모델 초기화
            let oODataModel = new ODataModel("/sap/opu/odata/sap/ZC503SDGW0003_SRV/");
            oODataModel.attachMetadataFailed(() => {
                MessageBox.error("OData 메타데이터 로드 실패. 서비스 URL을 확인하세요.");
            });
            this.getView().setModel(oODataModel, "odata");
        },

        onStep1Validate: function () 
        {
            // UI 요소에서 약관 동의 상태 가져오기
            let oServiceCheckBox = this.byId("serviceAgreementCheckBox");
            let oPrivacyCheckBox = this.byId("privacyAgreementCheckBox");
        
            let bServiceAgreed = oServiceCheckBox.getSelected();
            let bPrivacyAgreed = oPrivacyCheckBox.getSelected();
        
            // Step1 유효성 확인 및 단계 처리
            if (bServiceAgreed && bPrivacyAgreed) 
            {
                // 모든 체크박스가 체크된 경우
                this._wizard.validateStep(this.byId("step1"));
                MessageToast.show("모든 약관에 동의했습니다.");
                this.byId("step2").setVisible(true); // Step2를 표시
                oServiceCheckBox.setValueState("None"); // 정상 상태로 설정
                oPrivacyCheckBox.setValueState("None"); // 정상 상태로 설정
            } 
            else 
            {
                // 체크박스가 하나라도 체크되지 않은 경우
                this._wizard.invalidateStep(this.byId("step1")); // Step1 비활성화
                MessageBox.error("모든 약관에 동의해야 다음 단계로 이동할 수 있습니다.");
        
                // 각각의 체크박스 상태 업데이트
                if (!bServiceAgreed) 
                {
                    oServiceCheckBox.setValueState("Error"); // 에러 상태
                    oServiceCheckBox.setValueStateText("서비스 약관에 동의해야 합니다.");
                } 
                else 
                {
                    oServiceCheckBox.setValueState("None"); // 정상 상태
                }
        
                if (!bPrivacyAgreed) 
                {
                    oPrivacyCheckBox.setValueState("Error"); // 에러 상태
                    oPrivacyCheckBox.setValueStateText("개인정보 수집 및 이용에 동의해야 합니다.");
                } 
                else 
                {
                    oPrivacyCheckBox.setValueState("None"); // 정상 상태
                }
            }
        },

        onValidateStep2: function () 
        {
            // UI 요소에서 값 가져오기
            let vId = this.byId("idInput").getValue().trim(),
                vPassword = this.byId("passwordInput").getValue().trim(),
                vConfirmPassword = this.byId("confirmPasswordInput").getValue().trim(),
                vName = this.byId("nameInput").getValue().trim(),
                vEmail = this.byId("emailInput").getValue().trim(),
                vPhone = this.byId("phoneInput").getValue().trim().replaceAll('-',''),
                vZipCode = this.byId("addrnumInput").getValue().trim(), // 우편번호
                vAddress = this.byId("addressInput").getValue().trim(); // 주소

            // 유효성 검사
            if (!vId || !vPassword || !vName || !vEmail || !vPhone || !vAddress)
            {
                MessageToast.show("모든 필드를 채워주세요!");
                return;
            }

            if (vPassword !== vConfirmPassword) 
            {
                MessageToast.show("비밀번호가 일치하지 않습니다!");
                return;
            }

            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(vEmail)) 
            {
                MessageToast.show("유효한 이메일 주소를 입력하세요!");
                return;
            }

            let phoneRegex = /^\d{10,11}$/;
            if (!phoneRegex.test(vPhone)) 
            {
                MessageToast.show("전화번호는 10~11자리 숫자만 입력 가능합니다!");
                return;
            }

            // 우편번호와 주소를 결합
            let vFullAddress = `${vZipCode}, ${vAddress}`; // 형식: "우편번호, 주소"

            // OData 모델로 보낼 데이터 생성
            let oCreatePayload = 
            {
                Customer: vId,
                Password: vPassword,
                Name: vName,
                Email: vEmail,
                Phone: vPhone.substr(0,3) + "-" + vPhone.substr(3,4) + "-"
                    + vPhone.substr(7,4),
                Addr: vFullAddress // 결합된 주소
                // Addr: vAddress  // 주소
            };

            // ODataModel의 create 메서드 호출
            let oODataModel = this.getView().getModel("odata");
            if (!oODataModel) 
            {
                MessageBox.error("OData 모델이 초기화되지 않았습니다.");
                return;
            }

            oODataModel.create("/CustomerSet", oCreatePayload, 
            {
                success: function () 
                {
                    oODataModel.refresh(); // 데이터 새로고침
                    MessageToast.show("회원가입이 성공적으로 완료되었습니다!");
                    this._wizard.nextStep(); // Step2에서 Step3로 이동
                }.bind(this),
                error: function (oError) 
                {
                    console.error("Error:", oError);
                    MessageBox.error("회원가입에 실패했습니다. 다시 시도해주세요.");
                }
            });
        },

        loadPostcodeScript: function () 
        {
            return new Promise((resolve, reject) => {
                if (typeof daum !== "undefined") {
                    // 이미 스크립트가 로드된 경우
                    resolve();
                    return;
                }
                // 다이나믹 스크립트 태그 생성
                let script = document.createElement("script");
                script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
                script.async = true;

                // 스크립트 로드 완료 후 확인
                script.onload = function () {
                    if (typeof daum !== "undefined") {
                        console.log("다음 우편번호 스크립트 로드 완료");
                        resolve();
                    } else {
                        console.error("daum 객체를 찾을 수 없습니다.");
                        reject(new Error("daum 객체를 찾을 수 없습니다."));
                    }
                };

                script.onerror = function () {
                    console.error("다음 우편번호 스크립트 로드 실패");
                    reject(new Error("다음 우편번호 스크립트 로드 실패"));
                };

                // 스크립트를 HTML 문서에 추가
                document.head.appendChild(script);
            });
        },

        onOpenZipCodeDialog: function () 
        {
            this.loadPostcodeScript()
            .then(() => {
                if (daum.postcode && typeof daum.postcode.load === "function") {
                    daum.postcode.load(() => {
                        new daum.Postcode({
                            oncomplete: function (data) {
                                let oView = this.getView();
                                // console.log(data);
                                oView.byId("addrnumInput").setValue(data.zonecode);
                                oView.byId("addressInput").setValue(data.roadAddress);
                            }.bind(this),
                        }).open();
                    });
                } else {
                    MessageToast.show("우편번호 API가 올바르게 로드되지 않았습니다.");
                }
            })
            .catch((err) => {
                MessageToast.show(err.message || "우편번호 검색에 실패했습니다.");
            });
        },


        onCloseZipCodeDialog: function () 
        {
            // 우편번호 팝업 닫기
            let oDialog = this.byId("zipCodeDialog");
            oDialog.close();
        },
        
        onSelectZipCode: function (oEvent) 
        {
            // 선택된 우편번호 데이터 가져오기
            let oSelectedItem = oEvent.getSource();
            let oBindingContext = oSelectedItem.getBindingContext("zipCodeModel");
            let oSelectedData = oBindingContext.getObject();
        
            // 선택한 우편번호와 주소를 Step2의 Input에 반영
            this.byId("addrnumInput").setValue(oSelectedData.zip); // 우편번호 입력
            this.byId("addressInput").setValue(oSelectedData.address); // 주소 입력
        
            // 팝업 닫기
            this.onCloseZipCodeDialog();
        },

        onSearchZipCode: function () 
        {
            // Daum Postcode API 호출
            new daum.Postcode({
                oncomplete: function (data) 
                {
                    // 우편번호 및 주소 가져오기
                    let sZipCode = data.zonecode; // 우편번호
                    let sAddress = data.address; // 기본주소
        
                    // 모델 업데이트
                    let aResults = [
                        {
                            zip: sZipCode,
                            address: sAddress,
                        },
                    ];
        
                    // zipCodeModel에 결과 설정
                    this.getView().getModel("zipCodeModel").setProperty("/zipCodes", aResults);
        
                    // 검색 결과를 Toast로 알림
                    sap.m.MessageToast.show("주소가 성공적으로 검색되었습니다!");
                }.bind(this),
                onclose: function () 
                {
                    sap.m.MessageToast.show("우편번호 검색이 취소되었습니다.");
                },
            }).open(); // 우편번호 검색 팝업 열기
        },
    
    });
});