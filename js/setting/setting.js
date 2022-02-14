'use strict';

(function (kat) {
  kat.locales["zh-tw"] = {
    images: {
      logo: 'images/CTBC-logo-greenfont.png',
      zoominMpsBtn: 'images/icon-Document-ZoomIn.svg',//放大
      zoomoutMpsBtn: 'images/icon-Document-ZoomOut.svg',//縮小
      leftMpsBtn: 'images/icon-Document-RotateL.svg',//左轉
      rightMpsBtn: 'images/icon-Document-RotateR.svg',//右轉
      printMpsBtn: 'images/icon-Document-Printer.svg',//列印
      printOneMpsBtn: 'images/icon-Document-Printer.svg',//列印單張
      downloadMpsBtn: 'images/icon-Document-Download.svg',//下載
      closeMpsBtn: 'images/icon-CloseCross.svg',//關閉
      copyOneBtn: 'images/icon-Document-Copy.svg',//複製單一文件
      verCompareBtn: 'images/icon-Document-VersionDiff.svg',//版本比對
      rmThirdDocMpsBtn: 'images/icon-Btnsm-Cross.svg',//叉叉
      rmThirdDocMpsBtnDisa: 'images/icon-CloseCross.svg',//白色叉叉
      delMpsBtn: 'images/icon-SquareBtn-Delete.svg',//垃圾桶
      delMpsBtnDisa: 'images/icon-SquareBtn-Delete_Disable.svg',//垃圾桶disabled
      copyMpsBtn: 'images/icon-SquareBtn-Copy.svg',//複製
      copyMpsBtnDisa: 'images/icon-SquareBtn-Copy_Disable.svg',//複製disabled
      delFormBtn: 'images/icon-Btnsm-Delete.svg',//刪除文件
      hideDocMpsBtn: 'images/icon-Btnsm-Up.svg',//往上箭頭
      showDocMpsBtn: 'images/icon-Btnsm-Down.svg',//往下箭頭
      creditLetter: 'images/icon-SideBarBtn-LC.svg',//信用狀開/修狀查詢 圓圈
      oldCases: 'images/icon-SideBarBtn-History.svg',//歷史單據查詢 圓圈
      thirdDoc: 'images/icon-SideBarBtn-Mainpoit.svg',//第三方文件製作重點列表 圓圈
      bankDocument: 'images/icon-SideBarBtn-Bank.svg',//銀行模擬文件 圓圈
      oriDocument: 'images/icon-SideBarBtn-Original.svg',//原始提交文件 圓圈
      lastPreReview: 'images/icon-SideBarBtn-OPView.svg',//上次預審文件 圓圈
      verCompare: 'images/icon-SideBarBtn-VersionDiff.svg',//文件版本比對報表 圓圈
      opUpload: 'images/icon-SideBarBtn-Upload.svg',//OP上傳文件查詢列表 圓圈
      searchMpsBtn: 'images/icon-SquareBtn-Search.svg',//搜尋
      calendar: 'images/icon-Calendar.svg',//日曆
      triDown: 'images/icon-triangle-down.svg',
      warning: 'images/icon-alert.svg',
      right: 'images/icon-right.svg',
      crossGreen: 'images/icon-Btnsm-CrossGreen.svg',
    },
    elements: {
      bookmark: {
        //製單要件
        makerDocument: {
          katType: 'div',
          text: $.i18n.transtale('message.page.makerDocForm'), // 製單要件
          content: [
            [
              {
                katType: 'greenHead',
                text: $.i18n.transtale('message.page.transactionAndOperatingTime')
              }
            ], [
              {
                katType: 'katDocForm',
                formid: 'makerDocument'
              }
            ]
          ],
        },
        //押匯申請書
        applyDoc: {
          text: $.i18n.transtale('message.page.applyDocAndBill'), // 押匯申請書與匯票
          content: [
            [
              {
                id: 'applyDocForm_katDocs',
                katType: 'katDocs',
                box: 'box-full',
                defaultButton: [
                  //要加在隊伍前面(複製 刪除)
                  [
                    {
                      katType: 'katButton',
                      id: 'copyMpsBtnDisa_Apply',
                      text: $.i18n.transtale('message.page.copy'), // 複製
                      funname: '_',
                      className: 'tooltip-sdrm mr-1',
                      disabled: true
                    },
                    {
                      katType: 'katButton',
                      id: 'delMpsBtnDisa_Apply',
                      text: $.i18n.transtale('message.page.delete'), // 刪除
                      funname: '_',
                      className: 'tooltip-sdrm mr-1',
                      disabled: true
                    },
                  ],
                  //要加在隊伍後面(新增匯票)
                  [
                    {
                      katType: 'button',
                      id: 'addYYYMpsBtn',
                      text: $.i18n.transtale('message.page.zhTw.addYYY'),
                      funname: 'addYYYMpsBtn',
                      className: 'btn-sm-add btn-light overlayFlag'
                    },
                  ],
                  //放在畫面下面
                  [
                    {
                      katType: 'katButton',
                      id: 'showDocMpsBtnApply',
                      text: $.i18n.transtale('message.page.showDocMpsBtnApply'), //展開顯示多套文件
                      funname: 'showDocMpsBtn',
                      className: 'tooltip-sdrm mr-1'
                    },
                  ]
                ],
              },
            ]
          ],
        },
        //提示文件
        tipDoc: {
          text: $.i18n.transtale('message.page.tipDocForm'), // 提示文件
          content: [
            [
              {
                id: 'tipDocForm_katDocs',
                katType: 'katDocs',
                box: 'box-half',
                defaultButton: [
                  //要加在隊伍前面(複製 刪除)
                  [
                    {
                      katType: 'katButton',
                      id: 'copyMpsBtn',
                      text: $.i18n.transtale('message.page.copy'), // 複製
                      funname: 'copyMpsBtn',
                      className: 'tooltip-sdrm mr-1'
                    },
                    {
                      katType: 'katButton',
                      id: 'delMpsBtn',
                      text: $.i18n.transtale('message.page.delete'), // 刪除
                      funname: 'delMpsBtn',
                      className: 'tooltip-sdrm mr-1'
                    },
                    {
                      katType: 'div',
                    }
                  ],
                  //要加在隊伍後面(新增文件)
                  [
                    {
                      katType: 'katButton',
                      id: 'thirdPartyDocBtn',
                      text: $.i18n.transtale('message.page.thirdPartyDocUplodad'), // 第三方文件上傳
                      funname: 'formButton',
                      formid: 'thirdPartyDocUpload'
                    },
                    {
                      katType: 'button',
                      id: 'addDocMpsBtn',
                      text: $.i18n.transtale('message.page.addDoc'), //新增文件
                      funname: 'addDocMpsBtn',
                      className: 'btn-sm-add btn-light overlayFlag'
                    },
                  ],
                  //放在畫面下面
                  [
                    {
                      katType: 'katButton',
                      id: 'showDocMpsBtn',
                      text: $.i18n.transtale('message.page.showDocMpsBtnApply'), //展開顯示多套文件
                      funname: 'toggleDocMpsBtn',
                      className: 'tooltip-sdrm mr-1',
                      display: 'none',
                    },
                    {
                      katType: 'katButton',
                      id: 'hideDocMpsBtn',
                      text: $.i18n.transtale('message.page.hideDoc'), //收合多套文件
                      funname: 'toggleDocMpsBtn',
                      className: 'tooltip-sdrm mr-1',
                    },
                  ]
                ],
              },
            ]
          ],
        },
      },
      forms: {
        //==========================    1.頁籤畫面   ==========================
        //製單要件-客戶作業-頁籤畫面
        makerDocument: {
          katType: 'div',
          className: 'katMakerDocumentForm',
          content: [
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.checkLcOfIssuing'),
                className: 'katUlGreen'
              }
            ], [
              {
                katType: 'katCheckboxs',
                className: 'katMarkerCheckboxs',
                dataKey: 'katMakerIssueCheck',
                //options: [{ value: '1', text: '受益人' }, { value: '2', text: '第三方機構 簽發' }],
                options: [{ value: '1', text: $.i18n.transtale('message.page.beneficiary') }, { value: '2', text: $.i18n.transtale('message.page.thirdPartyIssue') }],
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.speDirTradeOfDesc'),//本筆交易如有需告知銀行的特殊指示，請於空格中描述
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katTextarea',
                placeholder: $.i18n.transtale('message.page.docNoPrompt'), //例：某份單據本次不提示(後續會由OP人員刪除該單據頁籤)、...
                dataKey: 'katMakerIssueText',
                height: '100px'
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.caseReassignHistory'), //案件改派歷程
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katLabels',
                className: 'katMarkerLabels',
                dataKey: 'katMakerAssignLabel',
                idxFlag: true
              }
            ],
            [
              {
                katType: 'button',
                id: 'katMakerSave',
                text: $.i18n.transtale('message.page.ok'), // 確定
                funname: 'katMakerSave',
                className: 'btn btn-green'
              }
            ],

            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.summary'), //摘要
                className: 'katUlGreen'
              },
              {
                katType: 'button',
                id: '',
                text: $.i18n.transtale('message.page.previewResultHistorySearch'), //預審結果歷程查詢
                funname: 'previewResultHistorySearch',
                className: 'btn btn-light',
                margin: '15px 1%',
                width: '170px'
              }
            ],
            [
              {
                katType: 'katHint',
                label: $.i18n.transtale('message.page.bankPreviewResult'), // 銀行預審結果：
                width: '100%',
                margin: '0px 20px 5px 40px',
                text1: $.i18n.transtale('message.page.previewPassCheckResultForPrint'), //預審通過，請回覆下方貿融檢核提問(if any)並點選同意預審結果，即可列印文件送交銀行
                text2: $.i18n.transtale('message.page.bankProvidSuggForTipDoc'), //銀行已提供建議版本，請依建議檢視或修改提示文件，再送出預審回覆
                text3: $.i18n.transtale('message.page.previewNoPassCheckResult') //預審未通過，請依瑕疵內容檢視或修改提示文件，再送出預審回覆
              }
            ],
            [
              {
                katType: 'katHint',
                label: $.i18n.transtale('message.page.cusInstructions'), //客戶指示：
                width: '100%',
                margin: '0px 20px 0px 40px',
                text1: $.i18n.transtale('message.page.agreeSubmit'), //同意提交
                text2: $.i18n.transtale('message.page.defectsNoFixToSumit'), //瑕疵皆不修正，直接提交
                text3: $.i18n.transtale('message.page.submitForReviewAgain'), //再次送審
                text4: $.i18n.transtale('message.page.docChangedDirectlyTipByNoReview')  //單據經更改，但直接提示不再預審
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.othDefect'), //其他瑕疵
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katTable',
                id: 'otherDisc',
                thead: [
                  {
                    katType: 'label',
                    text: '',
                    width: '2%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.discrepancies'), //瑕疵內容
                    width: '28%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.bankSuggest'), //銀行建議
                    width: '30%',
                  },
                  {
                    katType: 'katRadio',
                    id: 'custAllOkNok',
                    label: $.i18n.transtale('message.page.custInstructions'), //客戶指示
                    funname: 'custAllOkNok',
                    name: 'custHint',
                    width: '40%',
                    //options: [{ value: '1', text: '全選同意修改/已修改' }, { value: '2', text: '全選不同意/不修改' }],
                    options: [{ value: '1', text: $.i18n.transtale('message.page.allAgreeModify') }, { value: '2', text: $.i18n.transtale('message.page.allDisagreeNotModify') }],
                  },
                ],
                dataKey: 'otherDiscrepancies',
                cssSerial: true,
                showHis: false
              }
            ],
            [
              {
                katType: 'katTable',
                id: 'otherDiscNoData',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.discrepancies'), //瑕疵內容
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.bankSuggest'), //銀行建議
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.custInstructions'), //客戶指示
                    width: '40%',
                  },
                ],
                tbody: [
                  [
                    {
                      katType: 'label',
                      text: $.i18n.transtale('message.page.noData'), //暫無資料
                      colspan: '3'
                    },
                  ],
                ],
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.amlCheckQu'), //貿融檢核提問
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katTable',
                id: 'traAndFinaCheck',
                thead: [
                  {
                    katType: 'label',
                    width: '2%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.qu'), //問題
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.custReply'), //客戶回覆
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.uploadFile'), //上傳檔案
                    width: '13%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.fileList'), //檔案清單
                    width: '25%',
                  },
                  {
                    katType: 'label',
                    width: '10%',
                  },
                ],
                dataKey: 'exportAml',
                cssSerial: true,
                showHis: false
              }
            ],
            [
              {
                katType: 'input',
                dataKey: 'cafcCheck',
                display: 'none'
              }
            ],
            [
              {
                katType: 'katTable',
                id: 'traAndFinaCheckNoData',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.qu'), //問題
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.custReply'), //客戶回覆
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.uploadFile'), //上傳檔案
                    width: '10%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.fileList'), //檔案清單
                    width: '30%',
                  },
                ],
                tbody: [
                  [
                    {
                      katType: 'label',
                      text: $.i18n.transtale('message.page.noData'), //暫無資料
                      colspan: '4'
                    },
                  ],
                ],
              }
            ],
          ],
        },
        //========================== 2.mouseover小框 ==========================
        //信用狀小框-客戶作業-mouseover小框
        creditLetter: {
          katType: 'div',
          className: 'katBlockDiv',
          content: [
            [
              {
                katType: 'katUls',
                text: $.i18n.transtale('message.page.creditLetter'), //信用狀
                dataKey: 'creditLetter'
              },
            ],
          ],
        },
        //歷史單據小框-客戶作業-mouseover小框
        oldCases: {
          katType: 'div',
          className: 'katBlockDiv',
          width: '450px',
          height: '600px',
          overflow: 'scroll',
          'overflow-x': 'hidden',
          content: [
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.oldCases'), //歷史單據
                className: 'katUlGreen'
              },

            ], [
              {
                katType: 'katLabelInput',
                id: 'lcNo',
                className: 'form-control',
                placeholder: $.i18n.transtale('message.page.lcNo'), //信用狀號碼
                width: '90%',
                margin: '0px 2%',
              },
            ], [
              {
                katType: 'katLabelInput',
                id: 'openBankName',
                className: 'form-control',
                placeholder: $.i18n.transtale('message.page.openBankName'), //開狀銀行名稱
                width: '90%',
                margin: '0px 2%',
              },
            ], [
              {
                katType: 'katLabelInput',
                id: 'caseNo',
                className: 'form-control',
                placeholder: $.i18n.transtale('message.page.caseNo'), //案件編號
                width: '90%',
                margin: '0px 2%',
              },
            ], [
              {
                katType: 'katDate',
                id: 'openDate',
                className: 'form-control',
                placeholder: $.i18n.transtale('message.page.openDate'), //開狀日期
                width: '90%',
                margin: '0px 0px 0px 2%',
              },
              {
                katType: 'katButton',
                funname: 'searchMpsBtn',
                className: 'tooltip-sdrm',
                text: $.i18n.transtale('message.page.queryBtn'), //搜尋
                marginTop: '2px',
                width: '6%'
              },
              {
                katType: 'div',
                width: '2%'
              }

            ], [
              {
                katType: 'divider',
                margin: '5px',
              },
            ], [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.sameLc'), //同一信用狀
                className: 'katUlWhite'
              },
            ], [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.zhTw.lcNo')  //信用狀編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.caseNo'), //案件編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.beginDt')  //起案日
                  },
                ],
                dataKey: 'ocLcno'
              },
            ], [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.sameCounterParty'), //同一交易對手
                className: 'katUlWhite'
              },
            ], [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.zhTw.lcNo')  //信用狀編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.caseNo'), //案件編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.beginDt')  //起案日
                  },
                ],
                dataKey: 'ocParty'
              },
            ], [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.custSame'), //同一客戶
                className: 'katUlWhite'
              },
            ], [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.zhTw.lcNo')  //信用狀編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.caseNo'), //案件編號
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.beginDt')  //起案日
                  },
                ],
                dataKey: 'ocCustomer'
              },
            ]
          ],
        },
        //第三方文件製單重點-客戶作業-mouseover小框
        thirdDoc: {
          katType: 'div',
          className: 'katBlockDiv',
          content: [
            [
              {
                id: 'tdc',
                katType: 'katDocForm',
                formid: 'thirdDocContent'
              },
            ],
          ],
        },
        thirdDocContent: {
          content: [
            [
              {
                katType: 'katUls',
                text: $.i18n.transtale('message.page.zhTw.doc1'), //第三方文件製單重點
                dataKey: 'thirdDoc'
              },
            ],
          ],
        },
        //銀行模擬文件-客戶作業-mouseover小框
        bankDocument: {
          katType: 'div',
          className: 'katBlockDiv',
          content: [
            [
              {
                katType: 'katUls',
                text: $.i18n.transtale('message.page.bankSimulateFile'), //銀行模擬文件
                dataKey: 'bankDocument'
              },
            ],
          ],
        },
        //原始提交文件
        oriDocument: {
          katType: 'div',
          className: 'katBlockDiv',
          content: [
            [
              {
                katType: 'katUls',
                text: $.i18n.transtale('message.page.originalSubmitDoc'), //原始提交文件
                dataKey: 'oriDocument'
              },
            ],
          ],
        },
        //比對版本差異-OP-mouseover小框
        verCompare: {
          katType: 'div',
          className: 'katBlockDiv',
          content: [
            [
              {
                id: 'vcc',
                katType: 'katDocForm',
                formid: 'verCompareContent'
              },
            ],
          ],
        },
        verCompareContent: {
          width: '550px',
          content: [
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.verCompareDiff'), //比對版本差異
                className: 'katUlGreen',
                width: '50%'
              },
              {
                katType: 'div',
                width: '20%'
              },
              {
                katType: 'button',
                id: 'download_vc',
                text: $.i18n.transtale('message.page.dowmload'), //下載
                funname: 'verCompareDownload',
                className: 'btn-sm btn-light',
                minWidth: '15%',
                marginTop: '20px',
              },
              {
                katType: 'button',
                id: 'print_vc',
                text: $.i18n.transtale('message.page.print'), //列印
                funname: 'verComparePrint',
                className: 'btn-sm btn-light',
                minWidth: '15%',
                marginTop: '20px',
              },

            ],
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.lcNo_dot'),  //信用狀編號:
                marginLeft: '35px',
                width: '120px'
              },
              {
                katType: 'label',
                dataKey: 'lcNo',
                width: '200px'
              },
              {
                katType: 'div',
                width: 'calc(100% - 320px)'
              },
            ],
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.caseNo_dot'), //案件編號：
                marginLeft: '35px',
                width: '120px'
              },
              {
                katType: 'label',
                dataKey: 'caseNo',
                width: '200px'
              },
              {
                katType: 'div',
                width: 'calc(100% - 320px)'
              },
            ],
            [
              {
                katType: 'katVerCompareDatas',
                //wordings: ['套數：', '文件名稱：'],
                wordings: [$.i18n.transtale('message.page.numSet'), $.i18n.transtale('message.page.fileName_dot')],
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.fieldName'), //欄位名稱
                    width: '40%'
                  },
                  {
                    katType: 'label',
                    text: 'Before',
                    width: '30%'
                  },
                  {
                    katType: 'label',
                    text: 'After',
                    width: '30%'
                  },
                ],
                dataKey: 'katVerCompareData'
              }
            ],
          ],
        },
        //========================== 3.編輯視窗+彈窗 ==========================
        //押匯申請書-申請書-編輯視窗
        XXX: kat.applyDoc(),
        //押匯申請書-匯票-編輯視窗
        YYY: kat.exchangeBill(),
        //第三方文件上傳-客戶作業-編輯視窗
        thirdPartyDocUpload: {
          katType: 'div',
          id: 'thirdPartyDocUpload',
          content: [
            [
              {
                funname: 'addDocCatagoryMpsBtn',
                katType: 'button',
                text: $.i18n.transtale('message.page.zhTw.fileTypeAdd'), //新增文件種類
                className: 'btn-sm-add btn-light',
                margin: '20px 0px 10px 20px'
              },
            ],
            [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.delete') , //刪除
                    width: '6%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.zhTw.fileType'), //文件種類
                    width: '20%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.giveUpPrompt'), //放棄提示
                    width: '9.5%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.uploadFiles'), //上傳文件
                    width: '12.5%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.fileList'), //檔案清單
                    width: '25%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.delete'), // 刪除
                    width: '7%'
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.shareOthDoc'), //與其他文件共用
                    width: '20%'
                  },
                ],
                dataKey: 'thirdPartyDocUpload'
              }
            ],
            [
              {
                katType: 'input',
                type: 'text',
                display: 'none',
                dataKey: 'thirdPartyDocUploadFiles'
              },
              {
                katType: 'input',
                type: 'text',
                display: 'none',
                dataKey: 'checkUploadAll'
              },
            ]
          ],
        },
        //提示文件 新增文件 彈窗
        addDocMpsBtn: {
          katType: 'div',
          title: $.i18n.transtale('message.page.addDoc'), //新增文件
          padding: '30px 30px 20px 30px',
          wi: '35%',//彈窗寬度,
          existAlert: $.i18n.transtale('message.page.zhTw.fileTypeExsist'), //該文件種類已存在。
          content: [
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.chooseFileType'), //請選擇一種文件類型及資料來源
                fontWeight: 'bold',
              }
            ],
            [
              {
                katType: 'katSelect',
                id: 'addDocMpsBtn_select',
                sysMenu: '1004_1',
                placeholder: $.i18n.transtale('message.page.choose'), //請選擇
                label: $.i18n.transtale('message.page.fileType'), //文件類型
                margin: '5px 20px 15px 20px',
                width: '70%'
              },
              {
                katType: 'input',
                id: 'addDocMpsBtn_save',
                display: 'none'
              },
            ],
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.zhTw.ifAddPKL'),
                fontSize: '12px',
                fontWeight: 'bold',
                position: 'relative',
                top: '-10px',
                left: '20px',
                color: '#24A09A',
              }
            ],
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.zhTw.doc2'), //請設定文件頁籤名稱
                fontWeight: 'bold',
              }
            ],
            [
              {
                katType: 'katLabelInput',
                id: 'addDocMpsBtn_input',
                label: $.i18n.transtale('message.page.fileName'), //文件名稱
                className: 'form-control',
                margin: '5px 20px',
                width: '70%',
                disabled: true,
              },
            ],
            [
              {
                katType: 'div',
                height: '60px'
              },
            ],
            [
              {
                katType: 'button',
                id: 'addDocOk',
                text: $.i18n.transtale('message.page.confirm'), // 確認
                className: 'btn btn-green',
                display: 'none',
                marginTop: '20px'
              }
            ],
          ]
        },
        addDocMpsBtnThreeDocs: {
          katType: 'div',
          content: [
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.zhTw.doc3'), //請選擇要複製的單據資料
                fontSize: '20px',
                margin: '20px 30px',
              }

            ],
            [
              {
                katType: 'katCheckbox',
                id: 'addDocMpsBtnThreeDocs_checkbox',
                margin: '0px 50px 20px',
              },
            ],
          ]
        },
        //列印 下載
        printDownloadMpsBtn: {
          katType: 'div',
          titleP: $.i18n.transtale('message.page.choosePrintFile'), //選擇列印文件
          titleD: $.i18n.transtale('message.page.chooseDowmloadFile'), //選擇下載文件
          okP: $.i18n.transtale('message.page.previewPrint'), //預覽列印
          okD: $.i18n.transtale('message.page.dowmload'), //下載
          content: [
            [
              {
                katType: 'katCheckbox',
                id: 'pdSelectAll',
                options: [{ value: 'all', text: $.i18n.transtale('message.page.chooseAll') }], // 全選
                margin: '20px 50px',
              },
            ],
            [
              {
                katType: 'divider',
                margin: '0px 50px',
              }
            ],
            [
              {
                katType: 'katTreeCheckboxs',
                id: 'pdOptions',
                //firstLayerLabel: ['第一套', '第二套', '第三套', '第四套', '第五套', '第六套', '第七套', '第八套', '第九套'],
                firstLayerLabel: [$.i18n.transtale('message.page.set1'), $.i18n.transtale('message.page.set2'), $.i18n.transtale('message.page.set3'), $.i18n.transtale('message.page.set4'), $.i18n.transtale('message.page.set5'), $.i18n.transtale('message.page.set6'), $.i18n.transtale('message.page.set7'), $.i18n.transtale('message.page.set8'), $.i18n.transtale('message.page.set9')],
                margin: '20px 50px',
              },
            ],
          ]
        },
        //提示文件-版本比對 + 列印所有異動單據左右並列比對結果-彈窗
        printVerCompare: {
          katType: 'div',
          titleV: $.i18n.transtale('message.page.verCompare'), //版本比對
          titleP: $.i18n.transtale('message.page.zhTw.doc4'), //列印開啟單據比對結果
          content: [
            [
              {
                katType: 'div',
                width: '80%',
              },
              {
                katType: 'button',
                id: 'printAllMpsBtn',
                text: $.i18n.transtale('message.page.print'), //列印
                className: 'btn btn-light',
                margin: '15px 1%',
              },

            ],
            [
              {
                katType: 'katVerCompares',
                id: 'katVerCompares',
              },
            ]
          ]
        },
        //提示文件-版本比對 + 列印所有異動單據左右並列比對結果-詢問列印內容-彈窗
        printVerCompareAsk: {
          katType: 'div',
          title: '',
          ok: $.i18n.transtale('message.page.print'), //列印
          content: [
            [
              {
                katType: 'label',
                text: $.i18n.transtale('message.page.choosePrintFormat'), //請選擇列印格式
                fontSize: '20px',
                margin: '20px 30px',
              }
            ],
            [
              {
                katType: 'katCheckbox',
                id: 'printAsk',
                margin: '0px 50px 20px',
                options: [
                  { value: 1, text: $.i18n.transtale('message.page.zhTw.doc5') }, //單據列印於同一張
                  { value: 2, text: $.i18n.transtale('message.page.zhTw.doc6') }, //單據分別列印於不同張
                  { value: 3, text: $.i18n.transtale('message.page.printVercompareReport') }, //列印版本比對報表
                ],
              },
            ],
          ]
        },
        //預審結果-列印提交-條款
        preReviewTerm: {
          katType: 'div',
          title: $.i18n.transtale('message.page.agreedTerms'), // 約定條款
          ok: $.i18n.transtale('message.page.submit'), // 提交
          content: [
            [
              {
                katType: 'label',
                //text: '本平台僅供貴公司模擬、製作單據之用，貴公司應對單據之真實性及正確性負責；若貴公司以本平台產出之單據向本行申請出口託收或押匯，仍應遵守相關申請書及同意書之約定，且本行對於承作與否保有最後決定之權利',
                text: $.i18n.transtale('message.page.zhTw.longMsg1'),
                textAlign: 'left',
                margin: '20px 30px',
              }
            ],
            [
              {
                katType: 'div'
              },
              {
                katType: 'katCheckbox',
                id: 'preReviewTerm',
                options: [
                  {
                    value: '1',
                    text: $.i18n.transtale('message.page.agree')  // 同意
                  }
                ],
                margin: '10px 30px',
              },
              {
                katType: 'div'
              },
            ],
          ]
        },
        //預審結果-預審結果歷程查詢-彈窗
        previewResultHistorySearch: {
          katType: 'div',
          height: '500px',
          wi: '1200px',
          textAlign: 'left',
		  overflowX: 'scroll',
          title: $.i18n.transtale('message.page.previewResultHistorySearch'), // 預審結果歷程查詢
          ok: $.i18n.transtale('message.page.close'), // 關閉
          content: []
        },
        previewResultHistorySearchDetail: {
          katType: 'div',
          content:[
            [
              {
                katType: 'greenHead',
                width: '100%',
				textAlign: 'left',
				paddingLeft: '20px'
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.summary'), //摘要
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katHint',
                label: $.i18n.transtale('message.page.bankPreviewResult'), // 銀行預審結果：
                width: '100%',
                margin: '0px 20px 5px 40px',
				src: 'warning'
              }
            ],
            [
              {
                katType: 'katHint',
                label: $.i18n.transtale('message.page.cusInstructions'), //客戶指示：
                width: '100%',
                margin: '0px 20px 0px 40px',
				src: 'warning',
                text: $.i18n.transtale('message.page.submitForReviewAgain'), //再次送審
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.majorDefect'), //重大瑕疵
                className: 'katUlGreen',
              }
            ],
            [
              {
                katType: 'katLabels',
                idxFlag: true
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.othDefect'), //其他瑕疵
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    text: '',
                    width: '2%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.discrepancies'), //瑕疵內容
                    width: '28%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.bankSuggest'), //銀行建議
                    width: '30%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.custInstructions'), //客戶指示
                    width: '40%',
                  },
                ],
                dataKey: 'otherDiscrepanciesHis',
                cssSerial: true,
                showCur: false
              }
            ],
            [
              {
                katType: 'katUl',
                text: $.i18n.transtale('message.page.amlCheckQu'), //貿融檢核提問
                className: 'katUlGreen'
              }
            ],
            [
              {
                katType: 'katTable',
                thead: [
                  {
                    katType: 'label',
                    width: '2%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.qu'), //問題
                    width: '35%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.custReply'), //客戶回覆
                    width: '35%',
                  },
                  {
                    katType: 'label',
                    text: $.i18n.transtale('message.page.fileList'), //檔案清單
                    width: '28%',
                  },
                ],
                dataKey: 'exportAmlHis',
                cssSerial: true,
                showCur: false
              }
            ],
		  ]
		},
        //========================== 4.與...有關畫面 ==========================
        //與BL有關資訊
        BL_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela7'), 'font-size': '22px', 'font-weight': 'bold' }], // 與BL有關資訊
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 44C:LATEST DATE OF SHIPMENT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DATE_OF_SHIPMENT' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'SHIP_OTHER_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //與AWB有關資訊
        AWB_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela8'), 'font-size': '22px', 'font-weight': 'bold' }], // 與AWB有關資訊
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 44C:LATEST DATE OF SHIPMENT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DATE_OF_SHIPMENT' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'SHIP_OTHER_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },        
        //與FCR(FORWARDER CARGO RECEIPT)有關資訊
        FCR_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela2'), 'font-size': '22px', 'font-weight': 'bold' }], // 與FCR(FORWARDER CARGO RECEIPT)有關資訊
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 44C:LATEST DATE OF SHIPMENT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DATE_OF_SHIPMENT' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'SHIP_OTHER_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //與產證有關資訊
        CERT_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela3'), 'font-size': '22px', 'font-weight': 'bold' }],
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //與保單有關資訊
        INSUR_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela4'), 'font-size': '22px', 'font-weight': 'bold' }],
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'INCOTERM' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //與檢驗證明有關資訊
        COA_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.zhTw.rela5'), 'font-size': '22px', 'font-weight': 'bold' }],
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'INCOTERM' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //與(文件名稱)有關資訊
        OTHER_DOC_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', dataKey: 'NAME_FROM_46', fontSize: '22px', fontweight: 'bold' }],
            [{ katType: 'label', text: 'Tag 20:DCOUMENTARY CREDIT NUMBER' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'LC_NO' }],
            [{ katType: 'label', text: 'Tag 31C:DATE OF ISSUE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ISSUE_DATE' }],
            [{ katType: 'label', text: 'Tag 50:APPLICANT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'APP_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 59:BENEFICIARY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'BEN_NAME_ADD' }],
            [{ katType: 'label', text: 'Tag 44A:PLACE OF TAKING IN CHARGE/DISPATCH FROM/PLACE OF RECEIPT' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_RECEIPT_ALL' }],
            [{ katType: 'label', text: 'Tag 44E:PORT OF LOADING/AIRPORT OF DEPARTURE' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_LOADING_ALL' }],
            [{ katType: 'label', text: 'Tag 44F:PORT OF DISCHARGE/AIRPORT OF DESTINATION' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PORT_OF_DISCHARGE_ALL' }],
            [{ katType: 'label', text: 'Tag 44B:PLACE OF FINAL DESTINATION/FOR TRANSPORTATION TO/PLACE OF DELIVERY' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'PLACE_OF_DELIVERY_ALL' }],
            [{ katType: 'label', text: 'Tag 45A:DESCRIPTION OF GOODS AND/OR SERVICES' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DESC_OF_GOODS_ALL' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'INCOTERM' }],
            [{ katType: 'label', text: 'Tag 46A:DOCUMENTS REQUIRED' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOCUMENTS_REQUIRED' }],
            [{ katType: 'div', height: '25px', }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'ALL_DOCS_NOTE_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'DOC_INFO_FROM_47' }],
          ],
        },
        //信用狀規定的費用  
        FEE_INFO: {
          katType: 'div',
          width: '700px',
          className: 'katHTMLForm',
          content: [
            [{ katType: 'label', text: $.i18n.transtale('message.page.lcRuleFee'), 'font-size': '22px', 'font-weight': 'bold' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'FEE_CHG_INFO' }],
            [{ katType: 'katTextarea', className: 'katINFOTextArea', label: '', width: '100%', dataKey: 'FEE_INFO' }],
          ]
        },
        //欄位匯入(勾選匯入)
        columnImport: {
          katType: 'div',
          background: 'rgb(230,230,230)',
          content: [
            [
              {
                katType: 'label',
                //text: '藍色:本次信用狀要求資訊且已自動匯入</br>綠色: 本次信用狀要求資訊但尚未匯入, 可依需求自行匯入:', 
                text: $.i18n.transtale('message.page.zhTw.longMsg2'),
                width: '70%',
                margin: '10px 20px',
                fontWeight: 'bold',
              },
              {
                katType: 'button',
                text: $.i18n.transtale('message.page.chooseAll'), // 全選
                funname: 'selectAllMpsBtn',
                className: 'btn btn-light',
                margin: '20px 0px'
              },
              {
                katType: 'button',
                text: $.i18n.transtale('message.page.import'), //匯入
                funname: 'importMpsBtn',
                className: 'btn btn-light',
                margin: '20px 10px'
              },
              {
                katType: 'button',
                text: $.i18n.transtale('message.page.importComplete'), //匯入完成
                funname: 'importCompleteMpsBtn',
                className: 'btn btn-light',
                margin: '20px 20px 20px 0px'
              },
            ],
          ],
        },
      },
      viewTemplate: {
        ocLcno: [
          {
            katType: 'label',
            id: 'toggleDocName',
            funname: 'toggleDocName',
            funevent: 'onload_click',
            key: 'lcno'
          },
          {
            katType: 'label',
            key: 'caseNo'
          },
          {
            katType: 'label',
            key: 'beginDate'
          },
          {
            katType: 'label'
          },
          {
            katType: 'katFileHref',
            id: 'oldCasesDocName',
            funname: 'oldCasesDocName',
            className: 'katFileHref',
            key: 'oldCasesDocs',
            colspan: '2'
          },
        ],
        ocParty: [
          {
            katType: 'label',
            id: 'toggleDocName',
            funname: 'toggleDocName',
            funevent: 'onload_click',
            key: 'lcno'
          },
          {
            katType: 'label',
            key: 'caseNo'
          },
          {
            katType: 'label',
            key: 'beginDate'
          },
          {
            katType: 'label'
          },
          {
            katType: 'katFileHref',
            id: 'oldCasesDocName',
            funname: 'oldCasesDocName',
            className: 'katFileHref',
            key: 'oldCasesDocs',
            colspan: '2'
          },
        ],
        ocCustomer: [
          {
            katType: 'label',
            id: 'toggleDocName',
            funname: 'toggleDocName',
            funevent: 'onload_click',
            key: 'lcno'
          },
          {
            katType: 'label',
            key: 'caseNo'
          },
          {
            katType: 'label',
            key: 'beginDate'
          },
          {
            katType: 'label'
          },
          {
            katType: 'katFileHref',
            id: 'oldCasesDocName',
            funname: 'oldCasesDocName',
            className: 'katFileHref',
            key: 'oldCasesDocs',
            colspan: '2'
          },
        ],
        thirdPartyDocUpload: [
          {
            katType: 'katButton',
            text: $.i18n.transtale('message.page.delete') , //刪除
            id: 'rmThirdDocMpsBtn',
            funname: 'rmThirdDocMpsBtn',
            className: 'tooltip-sdrm',
            key: 'docCategory',
            title: $.i18n.transtale('message.page.delete')  // 刪除
          },
          {
            katType: 'label',
            key: 'docCategory'
          },
          {
            katType: 'input',
            id: 'giveupHintMpsBtn',
            funname: 'shareWithOtherMpsRadio',
            type: 'radio',
            key: 'hint',
            checked: '',
          },
          {
            katType: 'katButton',
            id: 'chooseDocMpsBtn',
            text: $.i18n.transtale('message.page.chooseFile'), // 選擇檔案
            funname: 'chooseDocMpsBtn',
            className: 'katFileButton',
            disabled: '',
            funtype: 'CUS_UPLOAD_THIRD_DOC'
          },
          {
            katType: 'katFileHref',
            text: '...',
            funname: 'fileOpenPdfViewer',
            key: 'fileNames',
          },
          {
            katType: 'katButtons',
            text: $.i18n.transtale('message.page.delete'), // 刪除
            funname: 'delMpsBtn',
            className: 'tooltip-sdrm',
            key: 'fileNames',
            title: $.i18n.transtale('message.page.deleteFile')  // 刪除檔案
          },
          {
            katType: 'input',
            id: 'shareWithOtherMpsRadio',
            funname: 'shareWithOtherMpsRadio',
            type: 'radio',
            key: 'shareWithOther',
            disabled: '',
            checked: '',
          }
        ],
        katMakerIssueCheck: {},
        otherDiscrepancies: [
          {
            katType: 'none',
            key: 'caseVer'
          },
          {
            katType: 'katTextarea',
            className: 'katTextAreaNoBorder',
            disabled: true,
            key: 'discrepancies',
          },
          {
            katType: 'label',
            key: 'bankSuggestText',
          },
          {
            katType: 'katRadio',
            funname: 'cutermerInstructions',
            //options1: [{ value: '1', text: '同意修改' }, { value: '2', text: '不同意銀行建議，已更正' }],
            //options2: [{ value: '1', text: '已修改' }, { value: '2', text: '不修改，直接瑕疵提示' }],
            options1: [{ value: '1', text: $.i18n.transtale('message.page.agreeModify') }, { value: '2', text: $.i18n.transtale('message.page.zhTw.doc9') }],
            options2: [{ value: '1', text: $.i18n.transtale('message.page.zhTw.hasEdit') }, { value: '2', text: $.i18n.transtale('message.page.zhTw.doc10') }],
            key: 'cutermerInstructions'
          },
        ],
        otherDiscrepanciesHis: [
          {
            katType: 'none',
            key: 'caseVer'
          },
          {
            katType: 'label',
            key: 'discrepancies',
          },
          {
            katType: 'label',
            key: 'bankSuggestText',
          },
          {
            katType: 'label',
            key: 'cutermerInstructionsText'
          },
        ],
        exportAml: [
          {
            katType: 'none',
            key: 'caseVer'
          },
          {
            katType: 'katTextarea',
            className: 'katTextAreaNoBorder',
            areaHeight: '25px',
            disabled: true,
            key: 'qu'
          },
          {
            katType: 'katTextarea',
            className: 'katTextAreaBorderBottom',
            // areaHeight: '25px',
            key: 'custReply',
            id: 'custReplyInput',
            funname: 'custReplyInput',
            funevent: 'focusout',
          },
          {
            katType: 'katButton',
            id: 'chooseDocMpsBtn',
            text: $.i18n.transtale('message.page.chooseFile'), //選擇檔案
            funname: 'chooseDocMpsBtn',
            className: 'katFileButton',
            disabled: '',
            margin: '0px 10px',
            funtype: 'CUS_UP_AML'
          },
          {
            katType: 'katFileHref',
            text: '...',
            funname: 'fileOpenPdfViewer',
            key: 'fileNames',
          },
          {
            katType: 'katButtons',
            id: 'crossGreen',
            text: $.i18n.transtale('message.page.delete'), // 刪除
            funname: 'delMpsBtn',
            className: 'katImgBtn',
            src: 'crossGreen',
            key: 'fileNames',
            title: $.i18n.transtale('message.page.deleteFile')  // 刪除檔案
          },
        ],
        exportAmlHis: [
          {
            katType: 'none',
            key: 'caseVer'
          },
          {
            katType: 'label',
            key: 'qu'
          },
          {
            katType: 'label',
            key: 'custReply'
          },
          {
            katType: 'katFileHref',
            text: '...',
            funname: 'fileOpenPdfViewer',
            key: 'fileNames',
          },
        ],
      },
      //left_buttons:信用狀 歷史單據 第三方文件製單重點 銀行模擬文件
      //top_buttons:垂直排列 下載 列印 儲存 送出預審
      oneButton: {
        left_buttons: [
          {
            katType: 'katButton',
            id: 'creditLetter',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle'
          },
          {
            katType: 'katButton',
            id: 'oldCases',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle'
          },
          {
            katType: 'katButton',
            id: 'thirdDoc',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle'
          },
          {
            katType: 'katButton',
            id: 'bankDocument',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle'
          },
          {
            katType: 'katButton',
            id: 'oriDocument',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle'
          },
          //為了報表列印所以前台也要版本比對小框
          {
            katType: 'katButton',
            id: 'verCompare',
            funname: 'leftButtons',
            funevent: 'mouseenter',
            className: 'tooltip-sdrm leftCircle',
            display: 'none'
          },
        ],
        top_buttons: [
          {
            katType: 'button',
            id: 'noSaveLeaveMpsBtn',
            text: $.i18n.transtale('message.page.noSaveLeave'), //未編輯離開
            funname: 'noSaveLeaveMpsBtn',
            className: 'btn btn-light overlayFlag',
            display: 'none',
            show: true,
            fontSize: '14px'
          },
          {
            katType: 'button',
            id: 'preReviewPrintMpsBtn',
            text: $.i18n.transtale('message.page.printSubmitDoc'), //列印提交文件
            funname: 'printMpsBtn',
            className: 'btn btn-light',
            display: 'none',
            show: true,
            fontSize: '14px'
          },
          {
            katType: 'button',
            id: 'verticalArrangMpsBtn',
            text: $.i18n.transtale('message.page.verticalArrange'), //垂直排列
            funname: 'verticalArrangMpsBtn',
            className: 'btn btn-light',
            show: true,
          },
          {
            katType: 'button',
            id: 'downloadMpsBtn',
            text: $.i18n.transtale('message.page.dowmload'), //下載
            funname: 'downloadMpsBtn',
            className: 'btn btn-light overlayFlag',
          },
          {
            katType: 'button',
            id: 'printMpsBtn',
            text: $.i18n.transtale('message.page.print'), //列印
            funname: 'printMpsBtn',
            className: 'btn btn-light',
            status45: true,
          },
          {
            katType: 'button',
            id: 'saveMpsBtn',
            text: $.i18n.transtale('message.page.save'), //儲存
            funname: 'saveMpsBtn',
            className: 'btn btn-light overlayFlag',
          },
          {
            katType: 'button',
            id: 'submitMpsBtn',
            text: $.i18n.transtale('message.page.sendPreTrial'), //送出預審
            funname: 'submitMpsBtn',
            className: 'btn btn-light overlayFlag',
          },
        ],
      },
      //提示文件 按鈕功能設定
      //view(檢視舊案資料):將舊資料匯入新單據 左轉 右轉 放大 縮小 下載 列印 關閉
      //close:關閉
      //katform:複製單一文件 版本比對 關閉
      //imgview(檢視pdf):左轉 右轉 放大 縮小 下載 列印 關閉
      //print(列印模式):左轉 右轉 放大 縮小 下載 列印 
      //dft 匯票: 版本比對 關閉
      docWindowElement: {
        //上次預審/提交文件
        imgview: [
          [
            {
              funname: 'leftMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateLeft90'), //向左旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'rightMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateRight90'), //向右旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoominMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeLarge'), //Pdf放大
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoomoutMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeSmall'), //Pdf縮小
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'downloadMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.dowmload'), //下載
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'printOneMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.printOneFile'), //列印單一文件
              className: 'tooltip-sdrm DocBtn mr-3'
            },

          ],
          [
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ],
        //檢視歷史單據
        view: [
          [
            {
              funname: 'leftMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateLeft90'), //向左旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'rightMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateRight90'), //向右旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoominMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeLarge'), //Pdf放大
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoomoutMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeSmall'), //Pdf縮小
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'downloadMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.dowmload'), //下載
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'printOneMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.printOneFile'), //列印單一文件
              className: 'tooltip-sdrm DocBtn mr-3'
            },

          ],
          [
            {
              katType: 'div',
              text: $.i18n.transtale('message.page.oldDataImport'), // 將舊資料匯入新單據
              funname: 'addOldDataMpsBtn',
              className: 'katTextWindowBtn overlayFlag'
            },
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ],
        //全選匯入
        close: [
          [],
          [
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ],
        //單據katform
        katform: [
          [
            {
              funname: 'copyOneBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.copyOneFile'), // 複製單一文件
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'verCompareBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.verCompare'), // 版本比對
              className: 'tooltip-sdrm DocBtn mr-3'
            },
          ],
          [
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ],
        //信用狀
        textview: [
          [
            {
              funname: 'downloadMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.dowmload'), //下載
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'printOneMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.printOneFile'), //列印單一文件
              className: 'tooltip-sdrm DocBtn mr-3'
            },

          ],
          [
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ],
        //版本比對
        print: [
          [
            {
              funname: 'leftMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateLeft90'), //向左旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'rightMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.rotateRight90'), //向右旋轉90度
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoominMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeLarge'), //Pdf放大
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'zoomoutMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.pdfBeSmall'), //Pdf縮小
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'downloadMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.dowmload'), //下載
              className: 'tooltip-sdrm DocBtn mr-3'
            },
            {
              funname: 'printOneMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.printOneFile'), //列印單一文件
              className: 'tooltip-sdrm DocBtn mr-3'
            },

          ],
          []
        ],
        //匯票
        dft: [
          [
            {
              funname: 'verCompareBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.versionCompare'), // 版本比對
              className: 'tooltip-sdrm DocBtn mr-3'
            },
          ],
          [
            {
              funname: 'closeMpsBtn',
              katType: 'katButton',
              text: $.i18n.transtale('message.page.closeOneFile'), //關閉單一文件
              className: 'tooltip-sdrm DocBtn mr-1'
            },
          ]
        ]
      }
    },

    loadIndicator: {
      loading: $.i18n.transtale('message.page.load_dot'), //載入中...
      saving: $.i18n.transtale('message.page.dataSavingDot'),// 資料儲存中...
    },

    api: {
      queryCaseInfo: {
        url: 'F010002_SCN1/doQueryCaseInfo',
        wording: $.i18n.transtale('message.page.load_dot'), //載入中...
        error: $.i18n.transtale('message.page.loadDataFail') // 載入資料失敗
      },
      mergeCase: {
        url: 'F010002_SCN1/doMergeCase',
        wording: $.i18n.transtale('message.page.saving_dot'), // 儲存中...
        error: $.i18n.transtale('message.page.saveFail'), //儲存失敗
        ok: $.i18n.transtale('message.page.saveSuccess')  //儲存成功
      },
      preReview: {
        url: 'F010002_SCN1/doSubmitCase',
        wording: $.i18n.transtale('message.page.sendPreTrial'), // 送出預審中...
        error: $.i18n.transtale('message.page.sendPreTrialFail'), //送出預審失敗
        ok: $.i18n.transtale('message.page.sendSuccess')  //送出成功
      },
      print: {
        url: 'F010002_SCN1/doSubmitCase',
        wording: $.i18n.transtale('message.page.zhTw.printSend'), //列印提交中...
        error: $.i18n.transtale('message.page.zhTw.printSendFail'), //列印提交失敗
      },
      queryPage: {
        url: 'F010001_SCN1',
      },
      uploadFile: {
        url: 'F010002_SCN1/doSaveFile',
        wording: $.i18n.transtale('message.page.fileUpload_dot'), //檔案上傳中...
        error: $.i18n.transtale('message.page.uploadFail')  //上傳失敗
      },
      downloadFile: {
        url: 'F010002_SCN1/doGetFile',
        wording: $.i18n.transtale('message.page.fileUpDowmload'), //檔案上下載中...
        error: $.i18n.transtale('message.page.dowmloadFail') //下載失敗
      },
      deleteFile: {
        url: 'F010002_SCN1/doDelFile',
        wording: $.i18n.transtale('message.page.fileDelete_dot'), //檔案刪除中...
        error: $.i18n.transtale('message.page.deleteFail')  //刪除失敗
      },
      oldKeyin: {
        url: 'F010002_SCN1/doQueryCaseSetJsonInfo',
        wording: $.i18n.transtale('message.page.load_dot'), //載入中...
        error: $.i18n.transtale('message.page.loadDataFail') // 載入資料失敗
      },
      convertExcel: {
        url: 'F010002_SCN1/doUploadExcelToHtml',
        wording: $.i18n.transtale('message.page.convertingDot'), //轉換中...
        error: $.i18n.transtale('message.page.ConvertFail')  //轉換失敗
      },
      delCaseOfficer: {
        url: 'F010002_SCN1/doDelCaseOfficer',
        wording: $.i18n.transtale('message.page.deleting'), //刪除中...
        error: $.i18n.transtale('message.page.deleteFail')  //刪除失敗
      },
      getLc:{
        url: 'F010002_SCN1/doGetLcLcInf',
        wording: $.i18n.transtale('message.page.load_dot'), //載入中...
      }
    },

    popup: {
      //第三方文件上傳-客戶作業-放棄提示-彈窗 20210824修改 彈窗出現時機和彈窗內容
      giveupHintMpsBtn: {
        title: $.i18n.transtale('message.page.tip'),//'請確認是否放棄提示文件正本', //提示
        // ok: '放棄提示',
        // nok: '重新上傳',
        text: $.i18n.transtale('message.page.zhTw.doc11')  // 請注意，選擇「放棄提示」後，該單據上傳功能將永久關閉
      },
      //確認匯入欄位彈窗
      confirmImport: {
        title: $.i18n.transtale('message.page.zhTw.doc12'), //請確認是否整套資料全部匯入
        ok: $.i18n.transtale('message.page.zhTw.doc13'), //整套匯入
        nok: $.i18n.transtale('message.page.cancel'), // 取消
        text: $.i18n.transtale('message.page.zhTw.doc14')  //歷史文件資料將匯入整套模擬單據，如只需要<br>特定單據或特定欄位，建議個別複製即可
      },
      //送出預審缺檔彈窗
      sendAlert: {
        title: $.i18n.transtale('message.page.zhTw.doc15'), //上傳文件未齊全，無法提交預審
        ok: $.i18n.transtale('message.page.zhTw.doc16'), //放棄提交預審
        text: $.i18n.transtale('message.page.fileMissing') // {0}文件缺漏
      },
      //送出預審與其他文件共用彈窗
      sendAlert2: {
        title: $.i18n.transtale('message.page.zhTw.doc15'), //上傳文件未齊全，無法提交預審
        ok: $.i18n.transtale('message.page.zhTw.doc16'), //放棄提交預審
        text: $.i18n.transtale('message.page.shareFileMissing') // {0}文件勾選與其他文件共用，但未上傳檔案
      },
      //未預審列印彈窗
      printMpsBtn: {
        title: $.i18n.transtale('message.page.zhTw.doc17'), // 未經銀行預審，將列印帶有浮水印的文件
        ok: $.i18n.transtale('message.page.continuePrint'), //繼續列印
        nok: $.i18n.transtale('message.page.directSend'), //直接提交
        text: $.i18n.transtale('message.page.zhTw.doc18')  //文件未經預審，會出現銀行浮水印；如選擇直接提交不預審(列印後行送交銀行)，需自負文件往返之風險
      },
      //預審結果-預審作業已完成
      preReviewFinish: {
        title: $.i18n.transtale('message.page.zhTw.doc19'), // 作業已完成！
        ok: $.i18n.transtale('message.page.printNow'), //立即列印
        nok: $.i18n.transtale('message.page.talkLater'), //稍後再說
        text: $.i18n.transtale('message.page.zhTw.doc20'),  //本筆交易已結束，可立即列印文件送交銀行？
        text2: $.i18n.transtale('message.page.zhTw.docPrintSubmit')  //文件須整批重印並整批重提示
      },
      //預審結果-文件內容與瑕疵指示不符
      preReviewNotFinish1: {
        title: $.i18n.transtale('message.page.zhTw.doc21'), //文件內容與瑕疵指示不符
        ok: $.i18n.transtale('message.page.iknow'),//知道了
        text: $.i18n.transtale('message.page.zhTw.doc22')  //瑕疵處理指示與單據內容不符，請協助確認
      },
      //預審結果-尚未完成瑕疵指示/貿融提問回覆
      preReviewNotFinish2: {
        title: $.i18n.transtale('message.page.zhTw.doc23'), //提醒：您尚未完成瑕疵指示/貿融提問回覆
        text: $.i18n.transtale('message.page.zhTw.doc24')  //為確保單據正確性，請先答覆瑕疵指示/貿融提問後，再送出回覆
      },
      //預審結果-送出預審
      preReviewAgain: {
        title: $.i18n.transtale('message.page.zhTw.doc25'), //請確認文件是否再次預審
        ok: $.i18n.transtale('message.page.directSend'), //直接提交
        nok: $.i18n.transtale('message.page.zhTw.doc26'), //再次提交預審
        text: $.i18n.transtale('message.page.zhTw.doc27')  //文件內容異動，建議再次提交預審<br>提醒您，如選擇直接提交，將可能增加後續瑕疵改單往返時間
      },
      //預審結果-送出預審-提交警示視窗
      preReviewAlert: {
        title: $.i18n.transtale('message.page.zhTw.submitAlert'), //提交警示視窗
        ok: $.i18n.transtale('message.page.AAAA'), //提交
        text: $.i18n.transtale('message.page.zhTw.doc28')  //確定直接提交？
      },
      notSave: {
        title: $.i18n.transtale('message.page.tip'), //提示
        text: $.i18n.transtale('message.page.zhTw.doc29')  //本單據編輯資料未儲存
      },
      fullStr: {
        title: $.i18n.transtale('message.page.tip'), //提示
        text: $.i18n.transtale('message.page.zhTw.halfStr')  //僅可輸入半形文字
      },
      //非連動欄位修改警語 2022/1/14說要移掉
      notSyncPleaseCheck: {
        title: $.i18n.transtale('message.page.tip'), //提示
        text: $.i18n.transtale('message.page.zhTw.notSyncPleaseCheck'),  //{0}欄位值各表單未連動，如有需要，請逐一修改
        ok: $.i18n.transtale('message.page.iknow'),//知道了
      }
     },

    msg: {
      page: $.i18n.transtale('message.page.loadingScreenDot'), // 畫面載入中...
      filejpgpdf: $.i18n.transtale('message.page.onlyJpgPdfType'), // 檔案類型僅支援jpg、pdf:{0}
      filexls: $.i18n.transtale('message.page.onlyXlsType'), // 檔案類型僅支援.xls
      file5mb: $.i18n.transtale('message.page.file5MBlarger'), // 檔案大小不可超過5MB:{0}
      copyMpsBtn: $.i18n.transtale('message.page.zhTw.doc30'), //1.如需製作多套文件，請於第一套文件完成編輯後再行複製</br>2.整套複製內容不包含第三方文件上傳之檔案
      dataProcess: $.i18n.transtale('message.page.dataVerificationDot'), //資料驗證中...
      printDownloadP: $.i18n.transtale('message.page.previewPrintingDot'), //預覽列印中...
      printDownloadD: $.i18n.transtale('message.page.downloadingDot'), //下載中...
      printDownloadB: $.i18n.transtale('message.page.generatingBarcodeDot'), //產生條碼中...
      makerSave: $.i18n.transtale('message.page.zhTw.doc31'), //尚有信用狀未註明單據的簽發機構，請自行勾選指定
      haveToAgree: $.i18n.transtale('message.page.zhTw.doc32'), //必須點選同意才可列印提交
      cannotCompare: $.i18n.transtale('message.page.zhTw.cannotCompare'), //無可比對版本
      amountTooLarge: $.i18n.transtale('message.page.zhTw.amountTooLarge'), //總金額與申請書金額不符，
      tableChanged: $.i18n.transtale('message.page.zhTw.tableChanged'), //表格異動
      currencyInconsistency: $.i18n.transtale('message.page.zhTw.currencyInconsistency'), //幣別檢核不一致，
      sureToSend: $.i18n.transtale('message.page.zhTw.sureToSend'),//是否繼續送出？
      pleaseOpenInTipDoc: $.i18n.transtale('message.page.zhTw.pleaseOpenInTipDoc'),//{0}不可在此頁籤開啟
      pleaseAddApp: $.i18n.transtale('message.page.zhTw.pleaseAddApp')
    },
  };

}(katctbc));
