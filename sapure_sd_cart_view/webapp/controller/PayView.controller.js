sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
    // "sap/m/Dialog"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("zc503sd.gw0011.sapuresdcartview.controller.PayView", {
        onInit: function () 
        {

            var sImagePath = sap.ui.require.toUrl("zc503sd/gw0011/sapuresdcartview/images/water1.png");
            this.getView().byId("Water").setSrc(sImagePath);

            // 결제 데이터를 담을 JSON 모델 초기화
            const oPaymentData = new sap.ui.model.json.JSONModel({
                originalAmount: "9,033,000 원",  // 기본 결제 금액
                discountAmount: "0 원",          // 할인 금액
                finalAmount: "9,033,000 원"     // 최종 결제 금액
            });

            // 뷰에 모델 연결
            this.getView().setModel(oPaymentData, "paymentData");

            // 결제 성공 메시지 리스너 추가
            window.addEventListener("message", (event) => {
                if (event.data === "payment_success") {
                    MessageToast.show("결제가 완료되었습니다!");
                    // Dialog 팝업 닫기
                    if (this._oDialog) {
                        this._oDialog.close();
                    }
                }
            });

        },

        onVoucherApply: function () {
            // 선택된 할인 쿠폰 가져오기
            const sVoucherCode = this.byId("voucherCodeSelect").getSelectedKey();
            const originalAmount = 9033000; // 기본 결제 금액 (숫자 형태)
        
            // 하드코딩된 쿠폰 데이터와 할인 금액
            const testVouchers = {
                "TEST10": 20000, // 10,000원 할인
                "TEST20": 30000, // 20,000원 할인
                "TEST30": 50000  // 50,000원 할인
            };
        
            // JSON 모델 가져오기
            const oModel = this.getView().getModel("paymentData");
        
            // 쿠폰 검증 및 처리
            if (testVouchers[sVoucherCode]) {
                const discountAmount = testVouchers[sVoucherCode];
                const finalAmount = originalAmount - discountAmount;
        
                // 모델 데이터 업데이트 (자동으로 UI에 반영됨)
                oModel.setProperty("/discountAmount", discountAmount.toLocaleString() + " 원");
                oModel.setProperty("/finalAmount", finalAmount.toLocaleString() + " 원");
        
                // 사용자에게 메시지 표시
                sap.m.MessageToast.show(`할인 적용 성공: ${discountAmount.toLocaleString()}원이 할인되었습니다.`);
            } else {
                sap.m.MessageToast.show("유효하지 않은 쿠폰 코드입니다. 다시 선택하세요.");
            }
        },


        onPaymentPress: function () {
            // 팝업 열기
            if (!this._oDialog) {
                this._oDialog = this.byId("paymentDialog");
            }
            this._oDialog.open();
        },

        onCloseDialog: function () {
            const oDialog = this.byId("installationDialog");
            if (oDialog) {
                oDialog.close();
            } else {
                console.error("Dialog를 찾을 수 없습니다.");
            }
        },

        onConfirmPaymentPress: function () {
            // Dialog 닫기
            this.onDialogClose();
            // 결제 처리 시작
            this.onKakaoPaymentPress();
        },
     
        onKakaoPaymentPress: function () {
            const apiKey = "7d328dae96b8911d54d4562ee947456e"; // REST API 키
            const requestData = {
                cid: "TC0ONETIME", // 테스트용 CID
                partner_order_id: "FO00000001", // 주문 번호
                partner_user_id: "조현영", // 사용자 ID
                item_name: "WPFS011 라이트 정수기 외 2건", // 상품 이름
                quantity: 6, // 수량
                total_amount: 9003000, // 결제 금액
                vat_amount: 100, // 부가세
                tax_free_amount: 0, // 비과세 금액
                approval_url: "http://localhost:8080/success.html", // 결제 성공 URL
                cancel_url: "http://localhost:8080/cancel.html", // 결제 취소 URL
                fail_url: "http://localhost:8080/fail.html" // 결제 실패 URL
            };
        
            fetch("https://kapi.kakao.com/v1/payment/ready", {
                method: "POST",
                headers: {
                    Authorization: "KakaoAK " + apiKey, // REST API 키 사용
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(requestData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.next_redirect_pc_url) {
                        // 팝업 창 크기와 위치 설정
                        const width = 500; // 팝업 너비
                        const height = 700; // 팝업 높이
                        const left = (window.screen.width - width) / 2; // 화면 중앙 위치
                        const top = (window.screen.height - height) / 2; // 화면 중앙 위치
        
                        // 팝업 창 열기
                        const paymentWindow = window.open(data.next_redirect_pc_url, "_blank",
                            `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`);
                            MessageToast.show("카카오 결제 페이지로 이동합니다.");
                        // 메시지 리스너 추가
                        // const messageListener = (event) => {
                        //     if (event.data === "payment_success") {
                        //         sap.m.MessageToast.show("결제가 성공적으로 완료되었습니다!");
                        //         paymentWindow.close(); // 팝업 닫기
                        //         window.removeEventListener("message", messageListener); // 리스너 제거
                        //     }
                        // };
                        window.addEventListener("message", messageListener);
                    } else {
                        console.error("결제 요청 실패:", data);
                        sap.m.MessageToast.show("결제 요청에 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error("결제 API 호출 오류:", error);
                    sap.m.MessageToast.show("결제 요청 중 오류가 발생했습니다.");
                });
        },

                // 체크박스 이벤트: 계약자 정보를 설치자 정보에 복사
            onSameInfoSelected: function (oEvent) {
                const bSelected = oEvent.getParameter("selected");
                const oView = this.getView();

                // 계약자 정보
                const oContractInfo = {
                    name: "조현영",
                    phone: "010-4217-0081",
                    zip: "03190",
                    address: "서울 종로구 종로12길 15 코아빌딩1",
                    detailAddress: "205호"
                };

                // 설치자 Input 필드 참조
                const aFields = [
                    { id: "installerName", value: bSelected ? oContractInfo.name : "" },
                    { id: "installerPhone", value: bSelected ? oContractInfo.phone : "" },
                    { id: "installerZip", value: bSelected ? oContractInfo.zip : "" },
                    { id: "installerAddress", value: bSelected ? oContractInfo.address : "" },
                    { id: "installerDetailAddress", value: bSelected ? oContractInfo.detailAddress : "" }
                ];

                // 필드 값 설정
                aFields.forEach(field => {
                    const oInput = oView.byId(field.id);
                    if (oInput) {
                        oInput.setValue(field.value);
                    }
                });

                // 설치자 정보 변경 로직 호출 -> 등록 버튼 활성화 상태 업데이트
                this.onInstallerInfoChange();
            },

            // 우편번호 찾기 로직
            onFindZipCode: function () {
                MessageToast.show("우편번호 찾기 버튼이 클릭되었습니다.");
            },

            // 첫 번째 팝업 열기
            onOpenInstallationDialog: function () {
                if (!this._installationDialog) {
                    this._installationDialog = this.byId("installationDialog");
                }
                this._installationDialog.open();
            },

            // 첫 번째 팝업 닫기
            onCloseInstallationDialog: function () {
                if (this._installationDialog) {
                    this._installationDialog.close();
                }
            },

            // "등록하기" 버튼 클릭 시
            onSubmitInstallationDialog: function () {
                MessageToast.show("설치 정보가 등록되었습니다.");
                this.onCloseInstallationDialog();

                // 두 번째 팝업 열기
                if (!this._dateSelectionDialog) {
                    this._dateSelectionDialog = this.byId("dateSelectionDialog");
                }
                this._dateSelectionDialog.open();
            },

            // 두 번째 팝업 닫기
            onCloseDateSelectionDialog: function () {
                if (this._dateSelectionDialog) {
                    this._dateSelectionDialog.close();
                }
            },
            
            onSubmitInstallationDialog: function () {
                // 설치자 정보 등록 로직
                sap.m.MessageToast.show("설치 정보가 등록되었습니다.");
            },

            //우편 번호 찾기 api

            onFindZipCode: function () {
                // Daum Postcode API 연동
                this.loadPostcodeScript()
                    .then(() => {
                        // Daum Postcode 객체 사용
                        new daum.Postcode({
                            oncomplete: function (data) {
                                // 우편번호와 주소 가져오기
                                const sZipCode = data.zonecode; // 우편번호
                                const sAddress = data.roadAddress; // 도로명 주소
            
                                // Input 필드 업데이트
                                const oView = this.getView();
                                oView.byId("installerZip").setValue(sZipCode); // 우편번호 입력
                                oView.byId("installerAddress").setValue(sAddress); // 주소 입력
            
                                // Toast로 알림 표시
                                sap.m.MessageToast.show("주소가 성공적으로 입력되었습니다!");
                            }.bind(this),
                            onclose: function () {
                                // 팝업 닫힘 시 알림
                                // sap.m.MessageToast.show("우편번호 검색이 취소되었습니다.");
                            },
                        }).open();
                    })
                    .catch((err) => {
                        // 스크립트 로드 실패 시 에러 처리
                        sap.m.MessageToast.show(err.message || "우편번호 API를 로드하는 중 오류가 발생했습니다.");
                    });
            },
            
            loadPostcodeScript: function () {
                return new Promise((resolve, reject) => {
                    if (typeof daum !== "undefined") {
                        // 이미 스크립트가 로드된 경우
                        resolve();
                        return;
                    }
            
                    // 다이나믹 스크립트 태그 생성
                    const script = document.createElement("script");
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

            // onInstallerInfoChange: function (oEvent) {
            //     console.log("liveChange 호출됨");
            // },
            onInstallerInfoChange: function () {
                // 설치자 정보 필드 값 가져오기
                const installerName = this.byId("installerName").getValue().trim();
                const installerPhone = this.byId("installerPhone").getValue().trim();
                const installerZip = this.byId("installerZip").getValue().trim();
                const installerAddress = this.byId("installerAddress").getValue().trim();
                const installerDetailAddress = this.byId("installerDetailAddress").getValue().trim();
            
                // 모든 필드가 채워져 있는지 확인
                const isAllFilled = installerName && installerPhone && installerZip && installerAddress && installerDetailAddress;
            
                console.log("isAllFilled:", isAllFilled); // 디버깅용 출력
                this.byId("submitButton").setEnabled(!!isAllFilled); // 논리값으로 변환
            },
            
            onSubmitInstallationDialog: function () {
                // 기존 설치정보 Dialog 닫기 (필요시)
                if (this._installationDialog) {
                    this._installationDialog.close();
                }
            
                // 설치 날짜와 시간 설정
                if (this._selectedDateTime) {
                    const sSelectedDateTime = `${this._selectedDateTime.date} ${this._selectedDateTime.time}`;
                    
                    // 설치 날짜 Input 필드에 값 설정
                    this.byId("installationDateInput").setValue(sSelectedDateTime);
            
                    // 메시지 출력
                    sap.m.MessageToast.show(`설치 날짜가 설정되었습니다: ${sSelectedDateTime}`);
                } else {
                    // 선택된 날짜가 없을 경우 기본 메시지 출력
                    // sap.m.MessageToast.show("설치 날짜와 시간이 설정되지 않았습니다. 날짜를 선택해주세요.");
                }
            
                // 설치정보 확인 Dialog 열기
                if (!this._oConfirmDialog) {
                    this._oConfirmDialog = this.byId("installationConfirmDialog");
            
                    if (!this._oConfirmDialog) {
                        sap.m.MessageBox.error("설치 정보 확인 Dialog가 초기화되지 않았습니다. XML View를 확인하세요.");
                        return;
                    }
                }
            
                // Dialog 열기 전에 데이터 설정 (예: 주소)
                const oView = this.getView();
                oView.byId("installationAddress").setText("서울특별시 종로구 종로 19 (종로1가) 211");
                oView.byId("installerInfo").setText("조현영 010-8796-8002");
            
                // Dialog 열기
                this._oConfirmDialog.open();
                
            },
            
    
            onSubmitConfirmationDialog: function () {
                // 선택된 날짜와 시간 확인
                if (this._selectedDateTime) {
                    const sSelectedDateTime = `${this._selectedDateTime.date} ${this._selectedDateTime.time}`;
            
                    // Input 필드에 값 설정
                    const oInput = this.byId("installationDateInput");
                    if (oInput) {
                        oInput.setValue(sSelectedDateTime);
                    } else {
                        console.error("Input field with ID 'installationDateInput' not found.");
                    }
            
                    // 성공 메시지 표시
                    sap.m.MessageToast.show(`설치 날짜가 설정되었습니다: ${sSelectedDateTime}`);
                } else {
                    // 선택된 날짜와 시간이 없는 경우 메시지 표시
                    // sap.m.MessageToast.show("설치 날짜와 시간을 선택하지 않았습니다.");
                }
            
                // Dialog 닫기
                const oDialog = this.byId("installationConfirmDialog");
                if (oDialog) {
                    oDialog.close();
                } else {
                    console.error("Dialog with ID 'installationConfirmDialog' not found.");
                }
            },
            

            onSelectDesiredDate: function () {
                const oDialog = this.byId("desiredDateDialog");
                if (!oDialog) {
                    sap.m.MessageBox.error("Dialog가 초기화되지 않았습니다.");
                    return;
                }
            
                const oDateSelectionContainer = this.byId("dateSelectionContainer");
                oDateSelectionContainer.removeAllItems();
            
                const aDates = [
                    { date: "11.30 토", times: ["8:30~11:00 마감", "11:00~12:00 ○", "13:00~15:00 ○", "15:00~17:00 ○"] },
                    { date: "12.01 일", times: ["휴일", "휴일", "휴일", "휴일"] },
                    { date: "12.02 월", times: ["8:30~11:00 ○", "11:00~12:00 ○", "13:00~15:00 마감", "15:00~17:00 ○"] },
                    { date: "12.03 화", times: ["8:30~11:00 ○", "11:00~12:00 ○", "13:00~15:00 ○", "15:00~17:00 ○"] },
                    { date: "12.04 수", times: ["8:30~11:00 ○", "11:00~12:00 마감", "13:00~15:00 ○", "15:00~17:00 ○"] },
                    { date: "12.05 목", times: ["8:30~11:00 ○", "11:00~12:00 ○", "13:00~15:00 ○", "15:00~17:00 마감"] },
                    { date: "12.06 금", times: ["8:30~11:00 ○", "11:00~12:00 ○", "13:00~15:00 ○", "15:00~17:00 마감"] }
                ];
            
                  // 동적으로 날짜와 시간 생성
                aDates.forEach((oDate) => {
                    const oHBox = new sap.m.HBox({
                        justifyContent: "SpaceBetween",
                        items: [
                            new sap.m.Text({
                                text: oDate.date,
                                class: "dateLabel"
                            }),
                            ...oDate.times.map((time) =>
                                new sap.m.Button({
                                    text: time.split(" ")[0], // 시간만 표시
                                    enabled: time.includes("○"),
                                    press: this.onDateTimeSelected.bind(this),
                                    class: "timeButton"
                                })
                            )
                        ]
                    }).addStyleClass("dateRow");

                    oDateSelectionContainer.addItem(oHBox);
                });

                oDialog.open();
            },
            
    
            onCloseDesiredDateDialog: function () {
                // 팝업 닫기
                const oDialog = this.byId("desiredDateDialog");
                oDialog.close();
            },
    
    
            onLoadMoreDates: function () {
                // 더보기 로직 처리
                sap.m.MessageToast.show("더 많은 날짜를 불러옵니다...");
            },

            onDateTimeSelected: function (oEvent) {
                // 선택된 버튼 텍스트 가져오기
                const sSelectedTime = oEvent.getSource().getText();
            
                // 선택된 HBox(행) 가져오기
                const oHBox = oEvent.getSource().getParent();
            
                // 행에서 날짜(label) 데이터 가져오기
                const sDate = oHBox.getItems()[0].getText();
            
                // 선택된 데이터를 저장
                this._selectedDateTime = {
                    date: sDate,
                    time: sSelectedTime
                };
            
                // 메시지 출력
                sap.m.MessageToast.show(`선택된 날짜와 시간: ${sDate} - ${sSelectedTime}`);
            
                // 팝업 닫기
                const oDialog = this.byId("desiredDateDialog");
                if (oDialog) {
                    oDialog.close();
                }
            },
    });
});
