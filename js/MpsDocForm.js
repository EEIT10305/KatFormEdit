'use strict';

/**
 * katType為katDocForm
 */
var MpsDocForm = function (o) {
  /**
   * form id
   */
  this.formid = o.formid;
  /**
   * 對應的按鈕id
   */
  this.btnid = o.btnid || '';
  /**
   * 是否存第0版
   */
  this.save0 = false;
  /**
   * 文件編輯區域物件(內容是很多小視窗)
   */
  this.windowsDiv = o.windowsDiv || {};
  /**
   * 資料key
   */
  this.dataKey = o.dataKey || {};

  MpsElement.call(this, o);
  /**
   * form設定
   */
  this.formSetting = this.formSettings[this.formid];
  /**
   * 物件類型
   */
  this.katType = 'MpsDocForm';
}

MpsDocForm.prototype = Object.create(MpsElement.prototype);

MpsDocForm.prototype.constructor = MpsDocForm;

MpsDocForm.prototype = Object.assign(MpsDocForm.prototype, (function () {
  return {
    step1: function () {

    },
    initElementHTML: function () {
      var self = this;
      var copySetting = Object.assign({}, this.formSetting);

      copySetting.id = this.$parent.attr('id');

      copySetting.btnid = this.btnid || '';
      //form裡的元素如果有設dataKey要補流水號 因為提示文件會有多組
      copySetting.content = (copySetting.content || []).map(function (c) {
        return c.map(function (ele, i) {
          ele = Object.assign({}, ele);

          if (ele.dataKey && self.btnid) {
            ele.dataKey = ele.dataKey + '_' + (self.btnid.split('_')[1] || '1');
            ele.id = ele.dataKey;
          }
          //匯票
          self.renameYYY(self, ele);
          return ele;
        });
      });

      return this.createForm(copySetting);
    },
    step3: function () {

      var self = this;

      switch (this.formid) {
        case 'XXX':
          setTimeout(function () {
            
            //電文的文件份數
            var docAmount = self.service.getDocAmount();//[[], []]

            docAmount.forEach(function (doc, i) {

              doc.forEach(function (d, j) {

                var $table_th = self.katELement.find('[datakey=Table' + (i + 1) + '_TH' + (j + 1) + ']');
                $table_th.disableMcu();

                var $table_td = self.katELement.find('[datakey=Table' + (i + 1) + '_TD1_' + (j + 1) + ']');
                $table_td.disableMcu();

                if (self.save0) {
                  $table_th.setMcuVal($table_th.getMcuVal() || d.docId);
                  $table_td.setMcuVal($table_td.getMcuVal() || d.num);
                }

              });

            });

            //第二個份數表格是否有值
            var flag = false;
            self.katELement.find('#applyDocTable4_1').find('input').each(function (i, inp) {
              if ($(inp).getMcuVal()) {
                flag = true;
              }
            });

            //新增表格的按鈕
            var $addAppTableBtn = self.katELement.find('[funname=addAppTableBtn]').parent();
            //表格隱藏
            $addAppTableBtn.next().katToggle(flag);
            //判斷是列印
            var flag2 = self.$parent.attr('id') == 'printDownload';
            //按鈕顯示(非列印)隱藏(列印) 
            $addAppTableBtn.katToggle(!flag && !flag2);
            //把最下面的表格往下擠
            self.katELement.find('[id=justADiv]').parent().katToggle(flag && flag2);

            //依表格內input字數，計算文字大小
            self.katELement.find('[kattype=katTable]').each(function (i, table) {
              $(table).find('[kattype=katLabelInput]').each(function (ii, label) {
                var $label = $(label);
                var scale = self.calculateInputWidth($label)
                //列印走這裡，input改div再縮小
                if (flag2) {
                  //label有值的input不轉div，避免列印疊字
                  if (!!$label.find('[kattype=label]').getMcuVal()) {
                    return;
                  }
                  var $input = $label.find('[kattype=input]');
                  var value = $input.getMcuVal();
                  var $div = self.createMpsElement({
                    katType: 'div',
                    text: value,
                    transform: 'scale(' + (scale > 1 ? 1 : scale) + ')',
                    position: 'absolute',
                    'transform-origin': 'left',
                  });
                  $input.after($div);
                  $input.remove();
                }
              });
            });

            //如果是OP編輯過的欄位要disabled
            var opEditXXX = self.service.getSaveDataByKey('opEditXXX') || [];
            opEditXXX.forEach(function(k){
              
              if(!k){
                return;
              }

              var $input = self.katELement.find('[dataKey=' + k + '] input');
              if($input.getMcuVal()){//多判斷如果欄位有值才去disable欄位
                $input.disableMcu();
              }

            });

          }, -1);
          break;
        case 'previewResult':

          //其他瑕疵 radio 
          if (katJqobject[this.katType]['otherDisc']) {
            var flag = true;
            var v = '';
            katJqobject[this.katType]['otherDisc'].find('tbody tr').each(function (idx, e) {
              if (v && $(e).find('[katType=katRadio]').getMcuVal() != v) {
                flag = false;
              }
              v = $(e).find('[katType=katRadio]').getMcuVal();
            });

            katJqobject[this.katType]['otherDisc'].find('thead tr [katType=katRadio]').setMcuVal(flag ? v : '');
          }

          //貿融檢核提問(增加textarea換行)
          if (katJqobject[this.katType]['previewResult']) {
            var obj = katJqobject[this.katType]['previewResult'];
            self.textareaEnter(obj);
          }
      }

      //押匯申請書或匯票要存第0版
      if (['XXX', 'YYY'].indexOf(this.formid) != -1 && this.save0) {

        // 要存第0版
        var applyDocForm = this.service.getFormListByPageId('applyDocForm')[0];

        var applyDocForm_ver0 = applyDocForm.filter(function (f) { return f.caseNowVer == '0' && f.formid == self.formid });

        setTimeout(function () {
          applyDocForm_ver0.forEach(function (f) {
            self.service.addKeySaveData(f.caseSetGuid, self.$parent.getMcuVal());
          });
        }, -1);
      }

    },
    addEvent: function () {
      var self = this;

      //避免事件重覆綁定造成一直呼叫refresh
      if (['thirdPartyDocBtn'].indexOf(self.btnid.split('_')[0]) != -1 && !self.$parent.data('eventBtnid')) {
        self.$parent.data('eventBtnid', true);
        $(document).on('buttonDataChange', function (e) {
          self.refresh();
        });
      }

      switch (this.formid) {
        case 'XXX':
          if (self.$parent.attr('id') == 'printDownload') break; //若為列印不綁定事件
          self.katELement.find('[kattype=katTable]').each(function (i, table) {
            $(table).on('focusout', '[kattype=input]', function () {
              var $label = $(this).parents('[kattype=katLabelInput]');
              self.calculateInputWidth($label)
            });
          });

          break;
      }

    },
    // 只重長單個div元素
    refreshOneDiv: function (idx) {
      var newHtml = this.initElementHTML();

      this.katELement.find('.flexSpaceBetween').eq(idx).html(newHtml.find('.flexSpaceBetween').eq(idx).html());

      //取物件
      this.step2_2();

      //綁事件
      this.addEvents();
    },
    // 押匯申請書 新增份數表格按鈕
    addAppTableBtn: function (e, self, jqobj) {
      var $addAppTableBtn = jqobj.parent();
      $addAppTableBtn.next().katShow();
      $addAppTableBtn.katHide();
    },
    //製單要件 checkbox
    issueCheckChange: function (e, self, jqobj) {
      var $pa = jqobj.parents('[kattype=katCheckbox]');
      var v = jqobj.attr('value');
      $pa.attr('value', v);
      $pa.find('input:checked').prop('checked', false);
      $pa.find('input[value=' + v + ']').prop('checked', true);
    },
    //製單要件 儲存
    katMakerSave: function (e, self, jqobj) {

      var flag = self.service.saveMpsMaker();

      document.dispatchEvent(myEvent['buttonDataChange']);

      //成功 儲存 打開頁籤
      if (flag) {
        //儲存
        self.service.saveCaseData();
        //打開頁籤
        $('[funname=bookmarkButton]').removeMpsClass('disabled');

      } else {//失敗 跳錯誤訊息

        $.alert(katctbc.msg.makerSave);

      }

    },
    //第三方上傳文件-客戶作業-新增文件種類+
    addDocCatagoryMpsBtn: function (e, self, jqobj) {
      var fs = self.formSettings['addDocMpsBtn'];
      var html = self.createForm(fs).prop('outerHTML');
      var key = jqobj.parents('.flexSpaceBetween').eq(0).parent().find('.katTableStyle').attr('dataKey');
      $.window(html, fs.title, fs.ok, function () {
        self.addDocCatagoryOk(self, key);
      });
      setTimeout(function () {
        var $sle = $('#' + fs.content[1][0].id);//下拉選單

        var $save = $('#' + fs.content[1][1].id);//用來存下拉選單選的值

        var $inp = $('#' + fs.content[4][0].id);//輸入框

        $sle.data('placeholder', $sle.attr('placeholder')).select2({
          dropdownParent: $('.popupBody'),
          allowClear: true,
          scrollAfterSelect: true,
          minimumResultsForSearch: -1,
        });
        setTimeout(function () {
          $sle.change(function (e) {
            var v = $sle.val();

            if (!v) {
              return;
            }

            var flag = (v == 'OTH');

            //打開輸入欄位
            $inp.attr('disabled', !flag);

            $save.val(flag ? '' : $sle.find('option[value=' + v + ']').text());
            $save.attr('katformid', flag ? '' : v);
          });

          $sle.change();
        }, -1);
      }, -1);
    },
    //第三方上傳文件-客戶作業-新增文件種類+ 確認
    addDocCatagoryOk: function (self, key) {
      var fs = self.formSettings['addDocMpsBtn'];

      var $save = $('#' + fs.content[1][1].id);
      var $inp = $('#' + fs.content[4][0].id);

      var v = $save.attr('katformid') || 'OTH';;
      var t = $save.val() || $inp.val();

      //檢查有沒有這項文件種類
      var flag = false;
      var sdata = self.service.getSaveData()[key] || [];
      var maxSeq = sdata.length;
      sdata.forEach(function (data) {
        flag = flag ? flag : (data.docCategory.text == t);
        if (data.serialNo) {
          var intSerialNo = parseInt(data.serialNo);
          if (intSerialNo > maxSeq) maxSeq = intSerialNo;
        }
      });

      if (flag) {
        setTimeout(function () {
          $.alert(fs.existAlert, fs.title, fs.ok);
        }, -1)
      } else {
        //更新第三方文件上傳
        self.service.updateKeySaveDataByKeyIdx(key, sdata.length, {
          docCategory: {
            value: v,
            text: t
          },
          canUpload: true,
          serialNo: suppleZero((maxSeq + 1), '000'),
          byCust: true,
          inPoint: false,
        });

        self.refresh();

        //更新第三方文件要點
        self.service.thirdUploadToPoint();

        var status = self.service.getCaseData().status;

        //如果是模擬待審 第三方製單要點是頁籤
        if (status == 1) {
          //重長文件按鈕
          myEvent['buttonDataChange'].detail.pageId = 'thirdDocForm';
          document.dispatchEvent(myEvent['buttonDataChange']);
          //將pageId重置為初始值
          myEvent['buttonDataChange'].detail.pageId = '';
        } else {
          //重長mouseover小框框
          myEvent['docFormRefresh'].detail.formid = 'thirdDocContent';
          document.dispatchEvent(myEvent['docFormRefresh']);
        }

        $.alert(katctbc.msg.pleaseAddApp);

      }
    },
    // 取得MpsDocsWindows
    getMpsDocsWindows: function () {
      var am = $('.tab-item.active').attr('id');
      if (am) {//確認有被激活的頁籤
        if (this.windowsDiv[am + 'Form']) {//該頁籤有MpsDocsWindows物件
          return this.windowsDiv[am + 'Form'];
        }
      }
    },
    //第三方製單要點
    formButton: function (e, self, jqobj, windowD) {

      var title = [jqobj.prop('innerText')];//視窗綠底標題

      windowD = windowD || self.getMpsDocsWindows();

      if (!windowD) {
        var ul_title = jqobj.parents('.katBlockDiv').find('.katUlGreen').text();
        $.alert($.format(katctbc.msg.pleaseOpenInTipDoc, ul_title));
        return;
      }

      var winid = windowD.addWindow({
        windowsDiv: windowD,
        $parent: windowD.katELement,
        barmode: jqobj.attr('barmode') || 'textview',
        mode: 'formwindow',
        title: title.join('_'),//視窗綠底標題
        btnid: jqobj.attr('id'),
        formid: jqobj.attr('formid'),
        disabled: true,
        docsWindowsId: windowD.id.split('_')[0] + '_view'
      });

      var needClose = jqobj.data('closeWin');
      jqobj.removeData('closeWin');
      windowD.toggleWindow(winid, null, !needClose);
    },
    //第三方上傳文件-客戶作業-選擇檔案+
    chooseDocMpsBtn: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').find('.form-inline , .katTextAreaBorderBottom').attr('seq') || jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('tr').find('.form-inline , .katTextAreaBorderBottom').attr('key') || jqobj.parents('.katTableStyle').attr('dataKey');

      var sdata = self.service.getSaveData()[key][idx] || {};

      var names = ((sdata.fileNames || {}).text || '').split(',').filter(function (v) { return v; });//filter是為了排除為''的狀況

      var guids = ((sdata.fileNames || {}).value || '').split(',').filter(function (v) { return v; });//filter是為了排除為''的狀況

      var isnews = ((sdata.fileNames || {}).isnew || '').split(',').filter(function (v) { return v; });//filter是為了排除為''的狀況

      var files = jqobj[0].files;

      var error1 = [];
      var error2 = [];

      var nFiles = [];

      for (var i = 0; i < files.length; i++) {

        if (['application/pdf', 'image/jpeg'].indexOf(files[i].type) == -1) {
          error1.push(files[i].name);
          continue;
        }
        if (files[i].size / 1024 / 1024 > 5) {
          error2.push(files[i].name);
          continue;
        }
        nFiles.push(files[i]);
      }

      var caseSet = self.service.getFormSeqList()[idx];

      self.filesUpload(jqobj.parents('[kattype=katButton]').attr('funtype'), nFiles, caseSet, names, guids, isnews).then(function (o) {

        self.service.updateKeySaveDataByKeyIdx(key, idx, {
          fileNames: {
            text: o.names.join(','),
            value: o.guids.join(','),
            isnew: o.isnews.join(',')
          }
        });

        //有上傳或刪除檔案時把guid存在另外一個欄位 (for黃標判斷)
        var k = jqobj.parents('.flexSpaceBetween').eq(0).next().find('input').attr('dataKey');
        var fns = self.service.getSaveDataByKey(k) || '';
        if (fns) {
          o.guids = o.guids.concat(fns.split(','));
        }
        self.service.addKeySaveData(k, o.guids.join(','));

        self.service.exportAml();

        self.service.dataKeyToViewTemplate('exportAml');

        self.refresh();

        //錯誤訊息
        var error = [];
        //格式檢核
        if (error1.length > 0) {
          error.push($.format(katctbc.msg.filejpgpdf, error1.join('、')));
        }
        //檔案大小檢核
        if (error2.length > 0) {
          error.push($.format(katctbc.msg.file5mb, error2.join('、')));
        }
        if (error.length > 0) {
          $.alert(error.join('<br>'));
        }

      });

    },
    //第三方上傳文件-客戶作業-移除第三方文件上傳的文件種類
    rmThirdDocMpsBtn: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('.katTableStyle').attr('dataKey');
      var sdata = self.service.getSaveDataByKey(key);
      var docId = sdata[idx].docCategory.value || '';
      var serialNo = sdata[idx].serialNo || '';
      var formid = (self.service.getSysMenuByValue('1004', docId) || {}).flag02;
      //因僅單據模擬時的第三方上傳文件要產生第三方製單要點，故刪除第三方上傳文件時只有第一套才需要刪除其他資料
      if(formid && key == 'thirdPartyDocUpload_1') {
        var thirdDocId = 'kat' + formid.replaceAll('_', '') + serialNo;
        Object.keys(katJqobject["MpsDocsWindow"]).forEach(function (objid) {
          if (objid.substring(0, thirdDocId.length) === thirdDocId) {
            if (katJqobject["MpsDocsWindow"][objid]) {
              katJqobject["MpsDocsWindow"][objid].remove();
            }
            delete katJqobject["MpsDocsWindow"][objid];
          }
        });
        self.service.delKeySaveData(thirdDocId);
      }
      sdata.splice(idx, 1);
      self.service.updateKeySaveDataByKey(key, sdata);

      self.refresh();

      //更新與...有關
      self.service.thirdUploadToPoint();

      var status = self.service.getCaseData().status;
      //如果是模擬待審 第三方製單要點是頁籤
      if (status == 1) {
        //重長文件按鈕
        myEvent['buttonDataChange'].detail.pageId = 'thirdDocForm';
        document.dispatchEvent(myEvent['buttonDataChange']);
        //將pageId重置為初始值
        myEvent['buttonDataChange'].detail.pageId = '';
      } else {
        //重長mouseover小框框
        myEvent['docFormRefresh'].detail.formid = 'thirdDocContent';
        document.dispatchEvent(myEvent['docFormRefresh']);
      }

    },
    //第三方上傳文件-客戶作業-檔案清單
    fileOpenPdfViewer: function (e, self, jqobj) {
      var imgguid = jqobj.attr('guid');
      window.open((self.service.getFileDataByGuid(imgguid) || {}).url);
    },
    //第三方上傳文件-客戶作業-垃圾桶圖示
    delMpsBtn: function (e, self, jqobj) {
      var imgguid = jqobj.attr('guid');

      if (!imgguid) {
        return;
      }
      
      var key = jqobj.parents('tr').find('.form-inline , .katTextAreaBorderBottom').attr('key') || jqobj.parents('.katTableStyle').attr('dataKey');
      var idx = jqobj.parents('tr').prevAll().filter(function (i, e) {
        //第三方文件上傳的物件沒有key屬性
        if (key != 'tradeAndFinanceCheck_1' && key != 'tradeAndFinanceCheckAML_1') return true;
        return $(e).find('[key=' + key + ']').length > 0
      }).length;
      var sdata = self.service.getSaveData()[key][idx] || {};

      //刪除檔案 20210809先不用去刪db的檔案 讓送出預審的時候再去刪
      // var res = self.service.deleteFile(imgguid);

      // if(res.code != '200'){
      //   return;
      // }

      //用imgguid查找是第幾個檔案
      var guids = sdata.fileNames.value.split(',');
      var imgguididx = guids.indexOf(imgguid);
      guids.splice(imgguididx, 1);

      var names = sdata.fileNames.text.split(',');
      names.splice(imgguididx, 1);

      var news = sdata.fileNames.isnew.split(',');
      news.splice(imgguididx, 1);

      self.service.updateKeySaveDataByKeyIdx(key, idx, {
        fileNames: {
          text: names.join(','),
          value: guids.join(','),
          isnew: news.join(',')
        }
      });

      //有上傳或刪除檔案時把guid存在另外一個欄位 (for黃標判斷)
      var k = jqobj.parents('.flexSpaceBetween').eq(0).next().find('input').attr('dataKey');
      var fns = self.service.getSaveDataByKey(k);
      fns = fns.replace(imgguid, '');
      fns = fns.split(',').filter(function (e) {
        if (e) {
          return true;
        }
      });
      self.service.addKeySaveData(k, fns.join(','));

      if (key == 'tradeAndFinanceCheck_1' || key == 'tradeAndFinanceCheckAML_1') {
        self.service.exportAml();
        self.service.dataKeyToViewTemplate('exportAml');
      }

      self.refresh();
    },
    //第三方上傳文件-客戶作業-與其他文件共用
    shareWithOtherMpsRadio: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('.katTableStyle').attr('dataKey');
      var sdata = self.service.getSaveData()[key][idx] || {};
      var colKey = jqobj.attr('key');

      var check = (sdata[colKey] || {}).value || '';
      check = check == 1 ? '' : 1;

      var data = {};

      data[colKey] = {
        value: check,
        text: check == 1 ? 'O' : 'X',
      };

      self.service.updateKeySaveDataByKeyIdx(key, idx, data);

      self.refresh();
    },
    // 全選
    selectAllMpsBtn: function (e, self, jqobj) {
      jqobj.parents('.bg-white').find('.katCheckboxImport input').prop('checked', true);
    },
    // 匯入
    importMpsBtn: function (e, self, jqobj) {
      jqobj.parents('.bg-white').find('.katCheckboxImport input:checked').each(function (i, e) {

        var id = $(e).attr('value') || $(e).attr('id').split('_')[1];
        if (!id) {
          return;
        }

        var $ele = jqobj.parents('.box-half').next().find('[id=' + id + ']');
        var v = $(e).parents('.mcu-object').getMcuVal();
        $ele.setMcuVal(v);

        if (v.HEAD) {
          $ele.find('button,input').attr('disabled', false);
        }

        $ele.change();
      });
    },
    //匯入完成
    importCompleteMpsBtn: function (e, self, jqobj) {
      var $ele = jqobj.parents('.box-half').next();
      katctbc.addAllData.splice(katctbc.addAllData.indexOf($ele.attr('id')), 1);

      //幫關一下匯入視窗
      jqobj.parents('.box-half').find('[funname=closeMpsBtn]').katTrigger('click');
    },
    //預審結果-客戶作業-銀行建議-下拉選單
    bankSuggestChange: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('.katTableStyle').attr('dataKey');

      var v = jqobj.val();
      var t = jqobj.find('option[value=' + v + ']').text();

      self.service.updateKeySaveDataByKeyIdx(key, idx, {
        bankSuggest: {
          value: v,
          text: t
        }
      });


      if (v != '0') {
        jqobj.parents('td').next().find('input').val(t).katHide();
      } else {
        jqobj.parents('td').next().find('input').val('').katShow();
      }

    },
    //預審結果-客戶作業-銀行建議-輸入框
    bankSuggestInput: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('.katTableStyle').attr('dataKey');

      var t = jqobj.val();

      self.service.updateKeySaveDataByKeyIdx(key, idx, {
        bankSuggest: {
          value: '0',//空白
          text: t
        }
      });

    },
    //預審結果-其它瑕疵-選擇全部
    custAllOkNok: function (e, self, jqobj) {
      var value = jqobj.attr('value');

      var key = jqobj.parents('.katTableStyle').attr('dataKey');

      jqobj.parents('.katTableStyle').find('tbody tr').each(function (idx, e) {

        if ($(e).find('[kattype=katRadio]').attr('disabled') == 'disabled') {
          return;
        }

        self.service.updateKeySaveDataByKeyIdx(key, idx, {
          cutermerInstructions: {
            value: value,
            text: $(e).find('input[value=' + value + ']').next().text()
          },
          cutermerInstructionsText: {
            value: $(e).find('input[value=' + value + ']').next().text(),
            text: $(e).find('input[value=' + value + ']').next().text()
          }
        });

        $(e).find('[katType=katRadio]').setMcuVal(value);

      });

    },
    //預審結果-其它瑕疵-單一選擇
    cutermerInstructions: function (e, self, jqobj) {
      var idx = jqobj.parents('tr').prevAll().length;
      var key = jqobj.parents('.katTableStyle').attr('dataKey');
      var v = jqobj.attr('value');

      self.service.updateKeySaveDataByKeyIdx(key, idx, {
        cutermerInstructions: {
          value: v,
          text: jqobj.next().text()
        },
        cutermerInstructionsText: {
          value: jqobj.next().text(),
          text: jqobj.next().text()
        }
      });

      var flag = true;
      jqobj.parents('.katTableStyle').find('tbody tr').each(function (idx, e) {
        var $e = $(e);
        if ($e.css('display') == 'none') return;
        if ($(e).find('[katType=katRadio]').getMcuVal() != v) {
          flag = false;
        }
      });

      jqobj.parents('.katTableStyle').find('thead tr [katType=katRadio]').setMcuVal(flag ? v : '');

    },
    //預審結果-客戶作業-客戶回覆-輸入框
    custReplyInput: function (e, self, jqobj) {
      var key = jqobj.attr('key') ? jqobj.attr('key') : jqobj.closest('[key]').attr('key');
      var idx = jqobj.attr('seq') ? jqobj.attr('seq') : jqobj.closest('[seq]').attr('seq');
      idx = parseInt(idx || '0');

      var t = jqobj.getMcuVal();

      self.service.updateKeySaveDataByKeyIdx(key, idx, {
        custReply: {
          text: t,
          value: t
        }
      });

      self.service.exportAml();

      self.service.dataKeyToViewTemplate('exportAml');

    },
    //預審結果-客戶作業-送出預審回覆
    checkSubmitMpsBtn: function (e, self, jqobj) {
      var fs;

      var alertNotFinish1 = false;
      var alertNotFinish2 = false;


      //1.資料未完整填完
      //其他瑕疵未回覆
      var custOthDisc = self.service.getSaveDataByKey('otherDiscrepancies') || [];

      var has_suggest = [];//同意修改 不同意銀行建議
      var no_suggest = [];//已修改 不修改
      //檢查客戶指示是否有值
      custOthDisc.forEach(function (d) {
        if ((d.caseVer != katctbc.caseVer - 1)) {
          return;
        }

        if (!(d.cutermerInstructions || {}).value) {
          alertNotFinish2 = true;
        }

        //有銀行建議
        if (d.bankSuggest.value == '1') {
          has_suggest.push(d.cutermerInstructions.value);
        } else {
          no_suggest.push(d.cutermerInstructions.value);
        }

      });

      //貿融未回覆
      var custFinaCheck = self.service.getSaveDataByKey('tradeAndFinanceCheck_1') || [];
      var custFinaCheckAML = self.service.getSaveDataByKey('tradeAndFinanceCheckAML_1') || [];

      //檢查客戶回覆是否有值
      custFinaCheck.forEach(function (d) {
        if (!(d.custReply || {}).text) {
          alertNotFinish2 = true;
        }
      });
      custFinaCheckAML.forEach(function (d) {
        if (!(d.custReply || {}).text) {
          alertNotFinish2 = true;
        }
      })

      var hasCustChange = self.service.getVerCompareData(true).length != 0;
      var hasBnkChange = katctbc.caseNowVers[katctbc.caseVer - 1] != katctbc.caseNowVer;
      var nextStep = 1;//1:預審已完成;2:再次預審

      if (has_suggest.length > 0 || no_suggest.length > 0) {
        //有小瑕疵
        if (hasBnkChange) {
          //銀行有改單
          if (hasCustChange) {
            //客戶有改單據內容
            //所有瑕疵皆回覆「同意銀行修改」或「不修改，直接提示」
            alertNotFinish1 = has_suggest.indexOf('2') == -1 && no_suggest.indexOf('1') == -1;
            if (!alertNotFinish1) {
              nextStep = 2;
            }
          }
          else {
            //客戶未改單據內容
            //任一瑕疵選擇「不同意銀行建議，已更正」或 選擇「已修改」
            alertNotFinish1 = has_suggest.indexOf('2') != -1 || no_suggest.indexOf('1') != -1;
          }
        }
        else {
          //銀行未改單
          if (hasCustChange) {
            //客戶有改單據內容
            //全部勾選「不修改」(即沒有任一個勾選已修改)
            alertNotFinish1 = no_suggest.indexOf('1') == -1;
          }
          else {
            //客戶未改單據內容
            //任一瑕疵選擇「已修改」
            alertNotFinish1 = no_suggest.indexOf('1') != -1;
          }
        }
      }

      if (alertNotFinish1) {
        fs = katctbc.popup['preReviewNotFinish1'];
        $.alert(fs.text, fs.title, fs.ok)
        return;
      }

      if (alertNotFinish2) {
        //尚未完成瑕疵指示/貿融提問回覆
        fs = katctbc.popup['preReviewNotFinish2'];
        $.alert(fs.text, fs.title, fs.ok)
        return;
      }

      if (nextStep == 2) {
        fs = katctbc.popup['preReviewAgain'];
        $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {

          fs = katctbc.popup['preReviewAlert'];

          $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {

            //列印提交
            self.agreeSendMpsBtn(e, self, jqobj);

          });

        }, function () {
          //送出預審
          self.callSubmitCaseData('preReview');

        });
      }
      else {
        self.agreeSendMpsBtn(e, self, jqobj);
      }
    },
    //預審結果-客戶作業-同意預審結果
    agreeSendMpsBtn: function (e, self, jqobj) {

      var fs = self.formSettings['preReviewTerm'];
      var html = self.createForm(fs).prop('outerHTML');

      $.window(html, fs.title, fs.ok, function () {

        var $che = $('#' + fs.content[1][1].id);

        if ($che.getMcuVal() != '1') {
          $.alert(katctbc.msg.haveToAgree);
          return;
        }

        //資料處理中訊息
        myLoading(katctbc.msg['dataProcess']);

        //讓訊息轉一下
        setTimeout(function () {

          //列印提交
          self.printSubmit(self);

        }, 100);
      });

    },
    //儲存
    saveMpsBtn: function (e, self, jqobj) {
      self.callSaveCaseData();
    },
    //版本比對彈窗 列印
    verComparePrint: function (e, self, jqobj) {
      var $btns_div = jqobj.parents('.flexSpaceBetween').eq(0);

      $btns_div.katHide();

      self.printDownload($($btns_div.parent()[0].cloneNode(true)), 'P', true, function () {
        $btns_div.katShow();
      }, null, true);
    },
    //預審結果歷程查詢
    previewResultHistorySearch: function (e, self, jqobj) {
      var fs = self.formSettings['previewResultHistorySearch'];
      var $bigBox = self.createForm(fs);
      var detailOrg = self.formSettings['previewResultHistorySearchDetail'];
      for (var i = 2; i < katctbc.caseVer - 1; i += 2) {
        var idx = i / 2;
        var detail = copyJson(detailOrg);
        detail.content[0][0].text = $.format('第 {0} 次預審結果', idx);
        //銀行預審結果
        detail.content[2][0].text = self.service.getNotSaveDataByKey('casePrereviewHis')[idx - 1];
        if (detail.content[2][0].text == $.i18n.transtale('message.page.previewPassCheckResultForPrint')) {
          detail.content[2][0].src = 'right'
        }

        //重大瑕疵
        detail.content[5][0].value = self.service.discrepanciesDescHis(i);
        //其他瑕疵
        detail.content[7][0].curVer = i;
        //貿融檢核提問
        detail.content[9][0].curVer = i;

        $bigBox.append(self.createForm(detail));
      }

      var html = $bigBox.prop('outerHTML');

      $.window(html, fs.title, fs.ok, function () { }, fs.wi);
      $('.popupBody').find('[funname="fileOpenPdfViewer"]').on('click', function () {
        window.open((self.service.getFileDataByGuid($(this).attr('guid')) || {}).url);
      });
    },
    //針對貿融檢核提問textarea的enter作增高
    textareaEnter: function (obj) {
      Object.keys(obj).forEach(function (id) {
        if (id.indexOf('custReplyInput') > -1) {
          obj[id].on('keyup', function (e) {
            this.style.height = 'auto';
            var $this = $(this);
            var scrollHeight = $this.find('textarea')[0].scrollHeight;
            var max_height = scrollHeight;
            //目前預設textarea最低高度
            var minHeight = '48';
            if (minHeight < max_height) {
              $this.css('height', max_height + 'px');
            } else {
              $this.css('height', minHeight + 'px');
            }
          });
        }
      });
    },
    //押匯申請書Others欄位僅能輸入三行
    limitOthers: function (e, self, jqobj) {
      //判斷如果超過該欄位長度時要幫他換行
      this.textareaLenEnter(e,jqobj,39,71,59);
      //字數超過,跳出提醒訊息
      this.textLenAlert(e,jqobj,3,39,71,59);        
      //限制textarea行數
      this.limitTextara(jqobj,3);
    },
    //匯票DRAWEE_NAME欄位僅能輸入六行
    limitDraweeName: function (e, self, jqobj) {
      //判斷如果超過該欄位長度時要幫他換行
      this.textareaLenEnter(e,jqobj,40,73,60);
      //字數超過,跳出提醒訊息
      this.textLenAlert(e,jqobj,6,40,73,60);       
      //限制textarea行數
      this.limitTextara(jqobj,6);
    },      
    //判斷如果超過該欄位長度時要幫他換行
    textareaLenEnter: function (e,$ele,chinesLen,engLen,fullEngLen) {
      var type = e.type;
      chinesLen = chinesLen || 39;
      engLen = engLen || 71;
      fullEngLen = fullEngLen || 59;
      var str = $ele.getMcuVal() || '';
      var len = str.length;
      //假設有中文字
      var flag = false;
      flag = this.hasChinese(str);
      //假設有中文,input事件不觸發
      if(flag && type=='input'){
        return;
      }
      var limitLen = flag ? chinesLen : engLen;
      limitLen = this.hasCapital(str) ? fullEngLen : limitLen;
      if(len > limitLen){
        //因為本身如果有換行
        var enterArr = str.split('\n');
        var res = [];
        for(var i = 0; i<enterArr.length; i++) {
          var nowStr = enterArr[i];
          //該行超過字數,會被自動加上換行
          var selfLimit = this.hasChinese(nowStr) ? chinesLen : engLen;
          selfLimit = this.hasCapital(nowStr) ? fullEngLen : selfLimit;
          if(nowStr.length > selfLimit){
            nowStr = this.newline(nowStr,selfLimit);
          }
          res.push(nowStr);
        }
        $ele.setMcuVal(res.join('\n'));
      }
    },
    hasChinese: function (input) {
      var pattern = new RegExp("[\u4E00-\u9FA5]+");
      if (pattern.test(input)) {
        return true
      } else {
        return false
      }
    },   
    newline: function (str,n) {
      var len = str.length;
      var strTemp = '';
      
      if(len > n){
       strTemp = str.substring(0,n);
       str = str.substring(n,len);
       return strTemp+'\n'+this.newline(str,n);
      }else{
       return str;
      }
    },  
    //限制textarea行數
    limitTextara: function (jqobj,rowLen) {
      //預設2行
      rowLen = rowLen || 2;
      var val = jqobj.getMcuVal();
      var enterArr = val.split('\n') || [];
      if(enterArr.length > rowLen){
        enterArr.splice(rowLen);
        var newStr = enterArr.join('\n');
        jqobj.setMcuVal(newStr);
      }
    },
    //字數超過,跳出提醒訊息
    textLenAlert: function (e,jqobj,rowLen,chinesLen,engLen,fullEngLen) {
      var type = e.type;
      var val = jqobj.getMcuVal();
      var enterArr = val.split('\n') || [];
      var maxLen = 0;
      //假設有中文字
      var flag = false;
      flag = this.hasChinese(val);
      //假設有中文,input事件不觸發
      if(flag && type=='input'){
        return;
      }
      for(var i = 0; i<rowLen; i++) {
        var nowStr = enterArr[i] || '';
        //計算該行,字數限制
        var selfLimit = this.hasChinese(nowStr) ? chinesLen : engLen;
        selfLimit = this.hasCapital(nowStr) ? fullEngLen : selfLimit;
        maxLen = maxLen + selfLimit;
      }
      if(val.replaceAll('\n','').length > maxLen){
        $.alert($.format($.i18n.transtale('message.page.zhTw.textAreaLen'), maxLen));
      }
      else if(enterArr.length > rowLen){
        $.alert($.format($.i18n.transtale('message.page.zhTw.textAreaRowLen'), rowLen));
      }      
    },
    //是否有大寫英文
    hasCapital(str) {
      var result = str.match(/^.*[A-Z]+.*$/);
      if(result==null) return false;
      return true;
    },    
    //新增匯票時,id要重新命名,避免addevent失效
    renameYYY: function (self, ele) {
      if (self.btnid.indexOf('YYY') == -1) {
        return;
      }
      //EX:YYY2_1、YYY3_1、YYY4_1
      var btnid = self.btnid.split('_')[0];
      var btnWord = btnid.replace(/[0-9]/ig, "");
      var btnNum = btnid.replace(/[^0-9]/ig, "") || 1;
      if (ele.dataKey && btnWord == 'YYY' && parseInt(btnNum, 10) > 1) {
        ele.id = ele.dataKey + '_' + self.btnid;
      }
    },    
    //依input輸入長度，計算文字縮放比例
    calculateInputWidth: (function () {
      //獲取文字寬度
      var getTextWidth = function (text) {
        var sensor = $('<pre>' + text + '</pre>').css({ display: 'none' });
        $('body').append(sensor);
        var width = sensor.width();
        sensor.remove();
        return width;
      };

      return function ($label) {
        //依表格內input字數，計算文字大小
        var tdWidth = $label.width() - 10;
        // var tdWidth = 100;
        var $input = $label.find('[kattype=input]');
        var textWidth = getTextWidth($input.getMcuVal());
        var textScrollWidth = $input.get(0).scrollWidth;
        var baseWidth = textScrollWidth - 10 < textWidth ? textScrollWidth : textWidth;
        var scale = tdWidth / baseWidth;
        $input.css('zoom', scale > 1 ? 1 : scale);
        return scale;
      };
    })(),
  };
})());