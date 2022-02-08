'use strict';

/**
 * 頁籤物件 
 * 點頁籤可以切換畫面 按鈕(垂直排列 下載 列印 儲存 送出預審)
 */
var MpsBookmark = function (o) {
  /**
   * 頁籤設定資料 katctbc.elements.bookmark
   */
  this.bmSettings = o.bmSettings || katctbc.elements.bookmark;
  /**
   * 按鈕設定資料 katctbc.elements.oneButton
   */
  this.btnSettings = o.btnSettings || katctbc.elements.oneButton;
  /**
   * form設定資料 katctbc.elements.forms
   */
  this.formSettings = o.formSettings || katctbc.elements.forms;
  /**
   * 文件編輯區域物件(內容是很多小視窗)
   */
  this.windowsDiv = {};
  /**
   * 選中的頁籤index(預設第一個)
   */
  this.bookIdx = 0;
  /**
   * 所有頁籤id 
   */
  this.bookIdList = [];
  /**
   * 焦點頁籤id
   */
  this.activeMark = ''
  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'MpsBookmark';

  this.attrMap.className = 'flexLeft';
}

MpsBookmark.prototype = Object.create(MpsElement.prototype);

MpsBookmark.prototype.constructor = MpsBookmark;

MpsBookmark.prototype = Object.assign(MpsBookmark.prototype, (function () {

  return {
    step1: function () {},
    initElementHTML: function () {
      var self = this;
      var res = self.createMpsElement({ katType: 'div' });

      //左邊mouseover按鈕
      var $left = self.createMpsElement({ katType: 'div', id: 'leftButtonsDiv', funname: 'leftButtonsDiv', funevent: 'mouseleave', className: 'sideBar' });
      self.btnSettings.left_buttons.forEach(function (btn) {

        var $div = self.createMpsElement({ katType: 'div', id: btn.id + 'div' });

        $div.append(self.createMpsElement(btn));//圓形圖示

        var $formdiv = self.createMpsElement({ katType: 'div', className: self.formSettings[btn.id].className });
        delete self.formSettings[btn.id].className;
        $formdiv.append(self.createForm(self.formSettings[btn.id]));
        $div.append($formdiv); //要跑出的框框

        $left.append($div);
      });


      var $right = self.createMpsElement({
        katType: 'div',
        width: 'calc(100% - 45px)',
        marginLeft: '45px'
      });
      //標籤 + 按鈕們 + 中間wording
      var $div1 = self.createMpsElement({ katType: 'div', className: 'flexSpaceBetween tab ml-2' });
      var $div1_1 = self.createMpsElement({ katType: 'div', className: 'tab-group' });
      var bookmark_list = self.service.bookmarkData(self.bmSettings);
      bookmark_list.forEach(function (bookmark) {
        $div1_1.append(self.createMpsElement(bookmark));
      });

      var $div1_2 = self.createMpsElement({ katType: 'div', className: 'flexRight'});
      self.btnSettings.top_buttons.forEach(function (btn) {
        $div1_2.append(self.createMpsElement(btn));
      });
      $div1.append($div1_1);
      $div1.append($div1_2);
      $right.append($div1);

      //頁籤對應畫面
      var $div2 = self.createMpsElement({ katType: 'div', width: '100%' });
      Object.keys(self.bmSettings).forEach(function (key) {
        var formData = self.bmSettings[key];
        formData.id = key + 'Form';
        formData.className = 'katBookmarkPage ml-2 mr-2';
        delete formData.text;
        $div2.append(self.createForm(formData));
      });
      $right.append($div2);

      //先加右邊區域 再加左邊區域 因為sidebar用 position: fixed 為了mouseover小框可以蓋住整個畫面
      res.append($right);
      res.append($left);

      return res.children();
    },
    step3: function () {
      var self = this;
      //提示文件+預覽底稿 初始視窗
      setTimeout(function () {
        var open = {}; //20210810拿掉載入時先開起 'tipDocForm': ['katINV']
        Object.keys(self.windowsDiv).forEach(function (k) {
          var windowD = self.windowsDiv[k];
          if (windowD) {

            self.katELement.find('.katBlockDiv .katUlWhiteGreen').each(function (i, e) {
              var funname = $(e).attr('funname');
            
              switch(funname){
                case 'imgviewPDF':
                  windowD.addWindow({
                    windowsDiv: windowD,
                    $parent: windowD.katELement,
                    mode: e.getAttribute('katformid') ? 'katform' : 'textview',
                    katformid: e.getAttribute('katformid'),
                    barmode: e.getAttribute('katformid') ? 'close' : 'textview',
                    title: e.textContent + '_' + $(e).prevAll('.katUlGreen')[0].textContent,
                    btnid: e.id,
                    id: [k, e.id, 'window'].join('_'),
                    disabled: true,
                    guid: e.getAttribute('guid') || '',
                  });

                  if (open[k] && open[k].indexOf(e.id) != -1) {
                    windowD.showWindow([k, e.id, 'window'].join('_'));
                  }
                  break;
                case 'formButton':
                  self.formButton(e, self, $(e), windowD);
                  break;
              }
            
            });

          }
        });

        setTimeout(function () {

          //歷史單據查詢初始化
          self.searchMpsBtn(null, self);
          
          //先把頁籤都點一遍
          self.katELement.find('.tab-item').each(function (i, book) {
            //頁籤id
            var page_id = $(book).attr('id');
   
            if (page_id == 'tipDoc') {
              $(book).katTrigger('click');
              return;
            }
   
          });

          //初始時 隱藏所有頁籤畫面
          setTimeout(function(){
            myLoading(katctbc.msg.page, 'abc');
            //因為要最後執行 再多一層
            setTimeout(function(){
              self.katELement.find('.tab-item').each(function (i, book) {
                //頁籤id
                var page_id = $(book).attr('id');
           
                //20211230 新增 開完就關掉
                var forms = self.service.getFormListByPageId(page_id + 'Form');
                for (var i = 1; i <= forms.length; i++) {
                  self.closeWindows(page_id + 'Form', i);
                }
                
              });
              self.katELement.find('.katBookmarkPage').katHide();

              var open_idx = 0;//製單要件 or 押匯申請書

              if (katctbc.caseVer > 2) {
                open_idx = 2;//提示文件
              }

              self.katELement.find('.tab-item').eq(open_idx).katTrigger('click');

              if (katctbc.isCaseAgain) {
                self.service.saveMpsMaker(true);
              }

              $('.abc').remove();

            }, -1);
            
          }, -1);
          
        }, -1);

      }, -1);
    },
    addEvent: function () { },
    // 取得MpsDocsWindows
    getMpsDocsWindows: function () {
      var am = this.activeMark;
      if (am) {//確認有被激活的頁籤
        if (this.windowsDiv[am + 'Form']) {//該頁籤有MpsDocsWindows物件
          return this.windowsDiv[am + 'Form'];
        }
      }
    },
    //頁籤
    bookmarkButton: (function () {
      // put some flag
      return function (e, self, jqobj) {

        self.activeMark = jqobj.attr('id');
        //頁籤變色 畫面改變
        if ($('.tab-item.active').length > 0) {

          var $ele = $('.tab-item.active');
          $ele.removeMpsClass('active');
          katJqobject[self.katType][$ele.attr('id') + 'Form'].katHide();

        }

        jqobj.addMpsClass('active');

        var page_btn_id = jqobj.attr('id');
        katJqobject[self.katType][page_btn_id + 'Form'].katShow();
      };

    })(),
    //左邊按鈕 mouseleave
    leftButtonsDiv: function () {
      $('.katBlockDiv[show!=true]').katHide();
    },
    //左邊按鈕 mouseenter
    leftButtons: (function () {
      var prev = '';
      var forVer = '""';
      return function (e, self, jqobj) {

        if (katJqobject['MpsBookmark'][prev]) {
          katJqobject['MpsBookmark'][prev].next().katHide();
        }

        prev = jqobj.attr('id');
        jqobj.next().katShow();

        switch (jqobj.attr('id')) {
          case 'verCompare':
            // 比對資料
            var data = self.service.getVerCompareData();
            data = JSON.stringify(data);

            $('#vcc_verCompareContent .katVerCompareData').katShow();

            if (data != forVer) {
              // 重長畫面
              myEvent['docFormRefresh'].detail.formid = 'verCompareContent'
              document.dispatchEvent(myEvent['docFormRefresh']);
              forVer = data;
            }

            break;
        }
      }
    }()),
    //信用狀 第三方
    imgviewPDF: function (e, self, jqobj) {

      var $ele = self.getMpsDocsWindows();
      if ($ele) {

        var needClose = jqobj.data('closeWin');
        jqobj.removeData('closeWin');
        $ele.toggleWindow(self.activeMark + 'Form_' + jqobj.attr('id') + '_window', null, !needClose);

      }else{

        var ul_title = jqobj.parents('.katBlockDiv').find('.katUlGreen').eq(0).text();
        $.alert($.format(katctbc.msg.pleaseOpenInTipDoc, ul_title));
     
      }

    },
    //歷史單據 搜尋
    searchMpsBtn: function (e, self, jqobj) {
      var lcNo = katJqobject[self.katType]['lcNo'].val();//信用狀號碼 預設用這筆案件的信用狀號碼查
      var openBankName = katJqobject[self.katType]['openBankName'].val();//開狀銀行名稱
      var caseNo = katJqobject[self.katType]['caseNo'].val();//案件編號
      var openDate = katJqobject[self.katType]['openDate'].val();//開狀日期


      //TODO 要分同信用狀號碼 同交易對手 然後只取前三項 
      var res = self.service.queryOldCases({
        lcno: lcNo,
        issbkn: openBankName,
        caseNo: caseNo,
        openDate: openDate
      });

      //依照結果顯示隱藏
      //同信用狀
      $('table[dataKey=ocLcno]').find('tbody tr').katHide();
      $('table[dataKey=ocLcno]').find('tbody tr').each(function (i, e) {

        if (res.lc.map(function (n) { return n * 2; }).indexOf(i) != -1) {
          $(e).katShow();
        }

      });
      //同交易對手
      $('table[dataKey=ocParty]').find('tbody tr').katHide();
      $('table[dataKey=ocParty]').find('tbody tr').each(function (i, e) {

        if (res.party.map(function (n) { return n * 2; }).indexOf(i) != -1) {
          $(e).katShow();
        }

      });

      //同客戶
      $('table[dataKey=ocCustomer]').find('tbody tr').katHide();
      $('table[dataKey=ocCustomer]').find('tbody tr').each(function (i, e) {

        if (res.customer.map(function (n) { return n * 2; }).indexOf(i) != -1) {
          $(e).katShow();
        }

      });
    },
    //歷史單據 案件編號
    toggleDocName: function (e, self, jqobj) {
      jqobj.parents('tr').next().katToggle();
    },
    //歷史單據 文件清單
    oldCasesDocName: function (e, self, jqobj) {

      //關掉用來判斷要不要開全選匯入視窗的flag
      katctbc.addAllData = [];

      var dataKey = jqobj.attr('guid') || '';
      self.casesDocName(e, self, jqobj, 'view', dataKey.split('__')[0]);
    },
    //前次提交文件 前次預審文件 文件清單
    oriCasesDocName: function (e, self, jqobj) {
      var dataKey = jqobj.attr('guid');
      self.casesDocName(e, self, jqobj, 'imgview', dataKey);
    },
    casesDocName: function (e, self, jqobj, mode, dataKey) {

      var ul_title = jqobj.parents('.katBlockDiv').find('.katUlGreen').text();

      if (self.activeMark != 'tipDoc') {
        $.alert($.format(katctbc.msg.pleaseOpenInTipDoc, ul_title));
        return;
      }

      var katformid = jqobj.attr('katformid');

      var cs = self.service.getCaseSetGuidKey(dataKey);
      var id = cs.id;

      var key = jqobj.attr('key');
      if(key){
        id = $('.btn-doc[key=' + key + ']').attr('id');
      }

      id = id + '_katform_window';
    
      if (!$('#' + id).is(':visible')) {
        if (jqobj.attr('key')) {
          $('.btn-doc[key=' + jqobj.attr('key') + ']').katTrigger('click');
        } else {
          katJqobject['MpsDocsButtons'][katformid + '_1'].katTrigger('click');
        }
        self.casesDocName(e, self, jqobj, mode, dataKey);
      } else {

        //歷史單據
        if (mode == 'view') {
          self.service.getOldCaseAllKeyin(cs.caseGuid);
        }

        var docWindowsDiv = self.getMpsDocsWindows();
        var modeid = id.replace('katform', mode);

        docWindowsDiv.setWindowSetting(modeid, {
          guid: dataKey,
        });

        //改變綠標
        docWindowsDiv.changeGreenTitle(modeid, jqobj.text() + '_' + ul_title);

        docWindowsDiv.showWindow(modeid);
        docWindowsDiv.hideWindow(id.replace('katform', 'close'));
        
        docWindowsDiv.toggleWindow(id, id, true);
      }
    },
    //第三方製單要點
    formButton: function (e, self, jqobj, windowD) {
      // 按鈕變色
      var title = [jqobj.prop('innerText')];//視窗綠底標題

      windowD = windowD || self.getMpsDocsWindows();

      if (!windowD){
        return;
      }

      windowD.addWindow({
        windowsDiv: windowD,
        $parent: windowD.katELement,
        barmode: jqobj.attr('barmode') || 'textview',
        mode: 'formwindow',
        title: title.join('_'),//視窗綠底標題
        btnid: jqobj.attr('id'),
        formid: jqobj.attr('formid'),
        disabled: true,
        docsWindowsId: windowD.id.split('_')[0] + '_view',
        serialNo: jqobj.attr('serialNo'),
      });

    },
    //未編輯直接離開
    noSaveLeaveMpsBtn: function (e, self, jqobj) {

      if (katctbc.isCaseAgain){
        var fs = katctbc.popup['notSave'];

        $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {
          window.location.href = $(ee).attr('href');
        });

        return;
      }

      self.service.delCaseOfficer();
    },
    //垂直排列
    verticalArrangMpsBtn: function (e, self, jqobj) {
      self.getMpsDocsWindows().verticalArrangMpsBtn();
    },
    //下載
    downloadMpsBtn: function (e, self, jqobj) {
      self.callDownloadCaseSet();
    },
    //列印
    printMpsBtn: function (e, self, jqobj) {
      self.callPrintCaseSet();
    },
    //儲存
    saveMpsBtn: function (e, self, jqobj) {
      self.callSaveCaseData();
    },
    //送出預審
    submitMpsBtn: function (e, self, jqobj) {

      var seqList = self.service.getFormSeqList();

      var hintFlag = false;

      //預審第三方文件上傳檢查
      for (var i = 0; i < seqList.length; i++) {//看提示文件有幾套

        //第三方文件上傳 檢查有無放棄提示
        var thirdPartyDocUpload = self.service.getSaveDataByKey('thirdPartyDocUpload_' + seqList[i]);
        for (var i = 0 ; i < thirdPartyDocUpload.length ; i++){
          var s = thirdPartyDocUpload[i];

          if ((s.hint || {}).value) {
            hintFlag = true;
            break;
          }
        }

        if (hintFlag) {
          break;
        }

      }

      //有勾選放棄提示
      if (hintFlag) {

        var fs = katctbc.popup['giveupHintMpsBtn'];

        $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {
          setTimeout(function () {
            self.callSubmitCaseData('preReview');
          }, -1);
        });

      }else{

        self.callSubmitCaseData('preReview');

      }

    },
  };
})());
