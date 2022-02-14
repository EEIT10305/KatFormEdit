'use strict';

var kat = {};

/**
 * 提示文件 + 預審底稿區
 */
var MpsDocs = function (o) {
  /**
   * 處理資料用
   */
  this.service = new MpsDocService();
  /**
   * 按鈕預設資料(複製 刪除 新增文件 ......)
   */
  this.defaultButton = o.defaultButton;
  /**
   * 畫面的id(tipDocForm:提示文件,previewDocumentForm:預審底稿)
   */
  this.pageId = o.pageId;
  /**
   * 文件編輯區域物件(內容是很多小視窗)
   */
  this.windowsDiv = o.windowsDiv;
  /**
   * 視窗寬度
   */
  this.box = o.box || 'box';

  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'MpsDocs';
}

MpsDocs.prototype = Object.create(MpsElement.prototype);

MpsDocs.prototype.constructor = MpsDocs;

MpsDocs.prototype = Object.assign(MpsDocs.prototype, (function () {

  return {
    initElementHTML: function () {
      var res = [];
      var self = this;

      var $div1 = self.createMpsElement({
        katType: 'div',
        id: self.id + '_buttons',
        className: 'katDocsButtonsDiv',
        height: '10vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      });
      res.push($div1);

      var $div2 = self.createMpsElement({
        katType: 'div',
        id: self.id + '_windows',
        height: '70vh',
        className: 'katDocsWindowsDiv',
        overflow: 'auto',
      });
      res.push($div2);

      return res.map(function (ele) { return ele.prop("outerHTML"); }).join('');
    },
    step3: function () {
      var katDocsButtons = new MpsDocsButtons({
        $parent: katJqobject['MpsDocs'][this.id + '_buttons'],
        id: this.id + '_docButtons',
        defaultButton: this.defaultButton,
        pageId: this.pageId,
      });

      var $div2 = katJqobject['MpsDocs'][this.id + '_windows'];

      this.windowsDiv[this.pageId] = new MpsDocsWindows({
        $parent: $div2,
        id: this.id + '_docsWindows',
        setInf: this.setInf,
        box: this.box,
        docsButtons: katDocsButtons
      });

      this.windowsDiv[this.pageId].init();

      katDocsButtons.docsWindows = this.windowsDiv[this.pageId];
      katDocsButtons.init();

      //如果是提示文件
      if (this.pageId == 'tipDocForm') {

        setTimeout(function () {
          $div2.height('70%');
        }, -1);

      }

    },
    addEvent: function () {
    },
  };
})());

/**
 * 提示文件 + 預審底稿區
 */
var MpsDocsButtons = function (o) {
  /**
   * 處理資料用
   */
  this.service = new MpsDocService();
  /**
   * 按鈕預設資料(複製 刪除 新增文件 ......)
   */
  this.defaultButton = o.defaultButton;
  /**
   * 畫面的id(tipDocForm:提示文件,previewDocumentForm:預審底稿)
   */
  this.pageId = o.pageId;
  /**
   * 文件按鈕
   */
  this.katformList = null;
  /**
   * 文件編輯區域物件(內容是很多小視窗)
   */
  this.docsWindows = null;
  /**
   * 用來紀錄id流水號
   */
  this.seqList = null;

  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'MpsDocsButtons';

  this.attrMap.className = ' flexLeft';
}

MpsDocsButtons.prototype = Object.create(MpsElement.prototype);

MpsDocsButtons.prototype.constructor = MpsDocsButtons;

MpsDocsButtons.prototype = Object.assign(MpsDocsButtons.prototype, (function () {

  return {
    step1: function () {
      this.katformList = this.service.getFormListByPageId(this.pageId);
      this.seqList = this.service.getFormSeqList();
    },
    initElementHTML: function () {
      var res = [];
      var self = this;

      // 展開按鈕
      var $div1 = self.createMpsElement({
        katType: 'div',
        width: '30px',
        padding: '35px 35px 0px 10px'
      });

      if (self.katformList.length > 1) {
        self.defaultButton[2].forEach(function (dbtn) {
          $div1.append(self.createMpsElement(dbtn));
        });
      }

      res.push($div1);

      // 文件按鈕
      var $div2 = self.createMpsElement({
        katType: 'div',
      });
      for (var i = 0; i < self.katformList.length; i++) {

        var max_doc_list = self.katformList[i].filter(function (f) { return f.isMax != 'N'; });

        var btnList = self.service.getBtnList(max_doc_list, i, self.defaultButton);
        $div2.append(self.createBar(btnList, 'flexLeft docButtons'));

      }
      res.push($div2);

      return res.map(function (ele) { return ele.prop("outerHTML"); }).join('');
    },
    step3: function () {
      var self = this;

      katJqobject['MpsDocs'][self.$parent.parent().attr('id')].find('.' + self.docsWindows.box).each(function (i, e) {

        var btnid = $(e).attr('btnid');
        if (btnid) {

          var $btn = katJqobject[self.katType][btnid];
          if ($btn) {
            // 更新所有視窗標題
            self.docsWindows.changeGreenTitle($(e).attr('id'), $btn.find('.btnText').text() + (self.pageId == 'tipDocForm' ? '_' + $btn.parent().find('.katBadge').text() : ''));

            //disabled單據視窗要關起來
            if ($btn.attr('disabled')) {
              self.docsWindows.hideWindow(btnid + '_katform_window');
              return;
            }
            //將顯示的視窗的按鈕都變成active
            if ($(e).css('display') != 'none') {
              $btn.addMpsClass('active');
            }

          }
        }

      });
    },
    addEvent: function () {
      var self = this;

      //避免事件重覆綁定造成一直呼叫refresh
      if(self.$parent.data('eventPageId')) {
        if(self.$parent.data('eventPageId').indexOf(self.pageId) == -1) {
          self.$parent.data('eventPageId').push(self.pageId);
        }
      }
      else {
        self.$parent.data('eventPageId', []);
        self.$parent.data('eventPageId').push(self.pageId);
        $(document).on('buttonDataChange', function (e) {
          if(!self.$parent.data('eventPageId')) return;
          var needRefresh = self.$parent.data('eventPageId').some(function(pageId){
            return (!e.detail.pageId || e.detail.pageId == pageId);
          });
          if (needRefresh) {
            self.refresh();
          }
        });
      }
    },
    activeBtn: function (jqobj) {
      // 按鈕變色
      if (jqobj.hasClass('active')) {
        jqobj.removeMpsClass('active');
        return;
      }
      jqobj.addMpsClass('active');
    },
    docButton: function (e, self, jqobj) {
      // 按鈕變色
      var needClose = jqobj.data('closeWin');
      jqobj.removeData('closeWin');
      if(needClose) {
        jqobj.removeMpsClass('active');
      }
      else {
        jqobj.addMpsClass('active');
      }

      var katformid = jqobj.attr('katformid');
      var caseSet = jqobj.attr('id').split('_')[1];
      var serialNo = jqobj.attr('serialNo');

      var params = {
        windowsDiv: self.docsWindows,//放置視窗的大框
        $parent: self.docsWindows.katELement,
        mode: 'katform',//視窗畫面模式
        title: jqobj.find('.btnText').prop('innerText') + '_' + jqobj.siblings('.katBadge')[0].textContent,//視窗綠底標題
        btnid: jqobj.attr('id'),//按鈕id
        katformid: katformid,//文件代號
        caseSet: caseSet,//文件套數
        guid: jqobj.attr('guid'),//caseSetGuid
        serialNo: serialNo,//單據排序用流水編號
      };

      //如果有上一次提交要做版本比對(藍字綠字)
      if (katctbc.compare_flag && serialNo) {
        var key = katformid + caseSet + serialNo

        //與前前一版比 字要變藍
        params.diff = {};
        self.service.verCompare(key, (katctbc.caseNowVer - 2), (katctbc.caseNowVer - 1)).diff.forEach(function (vc) {
          params.diff[vc.key] = {
            o: vc.o,
            n: vc.n
          };
        });

        var guidobj = self.service.getVerGuidByKey(key);

        if (guidobj && guidobj.all){
          var prevIdx = guidobj.all.length - 2;
          var prevGuid = guidobj.all[prevIdx];

          //與前一版資料 (for變綠)
          params.prevData = self.service.getCaseSetGuidKey(prevGuid).allKeyinData;
        }
      }

      self.docsWindows.addWindows(params, !needClose);
    },
    formButton: function (e, self, jqobj) {
      // 按鈕變色
      var needClose = jqobj.data('closeWin');
      jqobj.removeData('closeWin');
      if(needClose) {
        jqobj.removeMpsClass('active');
      }
      else {
        jqobj.addMpsClass('active');
      }

      var title = [jqobj.find('.btnText').prop('innerText')];//視窗綠底標題
      if (jqobj.siblings('.katBadge').length > 0) {
        title.push(jqobj.siblings('.katBadge')[0].textContent);//視窗綠底標題
      }

      var formid = jqobj.attr('formid');

      var params = {
        windowsDiv: self.docsWindows,
        $parent: self.docsWindows.katELement,
        barmode: formid == 'YYY' ? 'dft' : (jqobj.attr('barmode') || 'textview'),
        mode: 'formwindow',
        title: title.join('_'),//視窗綠底標題
        btnid: jqobj.attr('id'),
        formid: formid,
        guid: jqobj.attr('guid'),
        serialNo: jqobj.attr('serialNo') || '',//單據排序用流水編號
      };

      if (katctbc.compare_flag && formid == 'YYY') {
        var key = jqobj.attr('key')

        //與前前一版比 字要變藍
        params.diff = {};
        self.service.verCompare(key, (katctbc.caseNowVer - 2), (katctbc.caseNowVer - 1)).diff.forEach(function (vc) {
          params.diff[vc.key] = {
            o: vc.o,
            n: vc.n
          };
        });

        var guidobj = self.service.getVerGuidByKey(key);

        if (guidobj && guidobj.all){
          var prevIdx = guidobj.all.length - 2;
          var prevGuid = guidobj.all[prevIdx];

          //與前一版資料 (for變綠)
          params.prevData = self.service.getCaseSetGuidKey(prevGuid).allKeyinData;
        }
        
      }

      var winid = self.docsWindows.addWindow(params);

      self.docsWindows.toggleWindow(winid, null, !needClose);

    },
    //刪除新增的文件
    delFormButton: function (e, self, jqobj) {
      e.stopPropagation();
      var id = jqobj.parents('[katType=katButton]').attr('id');

      var idx = self.getCaseSetIdx(id);//套數idx
      var flist = self.katformList[idx];

      var delidx = flist.length - 1;//預設刪最後一筆

      flist.forEach(function (e, i) {//然後去對id
        if (e.id == id && e.isMax == 'Y') {
          delidx = i;
        }
      });

      flist.splice(delidx, 1);

      self.refresh();

      //隱藏刪掉的視窗
      self.docsWindows.hideWindow(id + (self.pageId == 'tipDocForm' ? '_katform' : '') + '_window', true);

    },
    getCaseSet: function (id) {//1,2,3
      var idSplit = id.split('_');
      return parseInt(idSplit[1]);
    },
    getCaseSetIdx: function (id) {//0,1,2
      return this.seqList.indexOf(this.getCaseSet(id));
    },
    //複製
    copyMpsBtn: function (e, self, jqobj) {
      $.dialog(katctbc.msg.copyMpsBtn, '', null, null, 'warning', function () {
        self.copyMpsBtnOk(e, self, jqobj);
      });
    },
    copyMpsBtnOk: function (e, self, jqobj) {

      var caseSet = self.getCaseSet(jqobj.attr('id'));//資料caseSet

      var idx = self.getCaseSetIdx(jqobj.attr('id'));//資料idx

      var nCaseSet = (self.seqList[self.seqList.length - 1] + 1);//取seqList最後一個數字加一

      //第三方文件上傳
      var dkey = 'thirdPartyDocUpload_' + caseSet;
      var nKey = 'thirdPartyDocUpload_' + nCaseSet;
      console.log('新增key ' + nKey);
      var temp = [];
      (self.service.getSaveData()[dkey] || self.service.getBackSaveData()[dkey] || []).forEach(function (data) {
        var copy_data = copyJson(data);
        copy_data.byCust = true;
        copy_data.inPoint = false;
        copy_data.hint = { text: 'X' };
        delete copy_data.fileNames;

        temp.push(copy_data);
      });

      self.service.addKeySaveData(nKey, temp);

      //單據文件
      self.katformList.push(self.katformList[idx].filter(function(e){
        return e.isMax == 'Y';
      }).map(function (e) {

        //複製資料
        var $ele = $('[dataKey=' + (e.caseSetGuid || e.guid) + ']');
        var value = $ele.getMcuVal() || self.service.getBackSaveDataByKey(e.caseSetGuid) || {};

        var guid = generateUUID();
        self.service.addKeySaveData(guid, JSON.parse(JSON.stringify(value)));

        //case set guid 要設為空
        var obj = Object.assign({}, e);
        obj.caseSetGuid = '';
        obj.caseSet = nCaseSet;
        obj.guid = guid;
        obj.isCust = 'Y';

        return obj;
      }));

      self.seqList.push(nCaseSet);

      self.refresh();

      //幫開啟所有新增的單據
      self.openWindows('tipDocForm', nCaseSet);
    },
    //刪除
    delMpsBtn: function (e, self, jqobj) {

      var idx = self.getCaseSetIdx(jqobj.attr('id'));//套數idx

      var caseSet;

      //刪除saveData資料(第三方文件上傳)
      jqobj.nextAll('[funname=formButton]').each(function (i, e) {

        var id = $(e).attr('id');
        self.service.delFormKeySaveData(id);

        caseSet = id.split('_')[1];
        
        //第三方文件上傳的表格
        self.service.delKeySaveData('thirdPartyDocUpload_' + id.split('_')[1]);
      });

      // 移除該筆資料
      self.katformList.splice(idx, 1);
      self.seqList.splice(idx, 1);

      //2022/1/11 移除該套同步欄位
      self.service.removeSyncColumnsByKey(caseSet);

      // 關閉所有相關視窗
      jqobj.nextAll('.btn-doc').each(function (i, e) {
        var id = $(e).attr('id');
        $('[btnid=' + id + ']').each(function (i2, e2) {
          self.docsWindows.hideWindow($(e2).attr('id'), true);
        });
      });

      // 重畫畫面
      self.refresh();

      // 更新所有視窗標題
      katJqobject['MpsDocs'][self.$parent.parent().attr('id')].find('.' + self.box).each(function (i, e) {
        var btnid = $(e).attr('btnid');
        if (btnid) {
          var $btn = katJqobject[self.katType][btnid];
          if ($btn) {
            self.docsWindows.changeGreenTitle($(e).attr('id'), $btn.find('.btnText').text() + '_' + $btn.parent().find('.katBadge').text());
          }
        }
      });

    },
    //展開/收合
    toggleDocMpsBtn: function (e, self, jqobj) {
      //收合/展開按鈕
      jqobj.parent().children().each(function (i, e) {
        $(e).katToggle();
      });
      //文件按鈕
      katJqobject[self.katType]['tipDocForm_katDocs_div_docButtons'].find('.docButtons').each(function (i, e) {
        if (i == 0) {
          return;
        }
        $(e).katToggle();
      })
    },
    //新增文件
    addDocMpsBtn: function (e, self, jqobj) {

      var fs = self.formSettings['addDocMpsBtn'];
      var html = self.createForm(fs).prop('outerHTML');

      $.window(html, fs.title, fs.ok, null, fs.wi);
      setTimeout(function () {

        var $sle = $('#' + fs.content[1][0].id);//下拉選單

        var $save = $('#' + fs.content[1][1].id);//用來存下拉選單選的值

        var $inp = $('#' + fs.content[4][0].id);//輸入框

        var $ok = $('#' + fs.content[6][0].id);//確定按鈕

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

            var data = self.service.getSysMenuByValue('1004', v);
            $save.attr('funname', (data.flag01 == '1') ? '' : 'formButton');
            $save.attr('barmode', (data.flag01 == '1') ? '' : 'katform');
          });

          $sle.change();

          //2022/1/10 新增 新增文件的必填判斷
          $ok.katShow();

          $ok.click(function(){
            
            if(!$sle.val()){
              $.alert($.i18n.transtale('message.page.chooseFileType'));
              return;
            }

            if ($sle.val() == 'OTH' && !$inp.val()){
              $.alert($.i18n.transtale('message.page.zhTw.doc2'));
              return;
            }
            self.addDocMpsBtnOk(self, jqobj);

            $('#windowCloseBtn').katTrigger('click');
          });

        }, -1);

      }, -1);
    },
    addDocMpsBtnOk: function (self, jqobj) {
      var fs = self.formSettings['addDocMpsBtn'];

      var idx = self.getCaseSetIdx(jqobj.attr('id'));//套數idx

      var $save = $('#' + fs.content[1][1].id);
      var $inp = $('#' + fs.content[4][0].id);

      var katformid = $save.attr('katformid') || 'OTH';
      var katformname = $save.val() || $inp.val();
      var funname = $save.attr('funname') || '';
      var barmode = $save.attr('barmode') || '';

      var params = {
        katformid: katformid,
        katformname: katformname,
        funname: funname,
        barmode: barmode
      };

      self.addDoc(self, idx, params);

    },
    //新增文件
    addDoc: function (self, idx, params, copyCaseSetGuid) {

      // 2份INVOICE => 頁籤名: INV 1、INV 2 ， INV 2內容copy自INV 1; 
      // 3份PKG，頁簽名: PKG 1、PKG 2、PKG 3， PKG 2內容copy自PKG 1， PKG 3可選要copy自PKG 1或PKG 2

      var flist = self.katformList[idx];

      var fid = params.katformid || params.formid || '';
      var fname = params.katformname || '';

      var is_max_list = flist.filter(function (e) {
        return e.isMax == 'Y';
      });

      var max_serialNo = 0;
      //算現在serialNo編到幾號了
      is_max_list.forEach(function (e) {
        var no = parseInt(e.serialNo || '0');
        if (no > max_serialNo) {
          max_serialNo = no;
        }
      });

      var sn = is_max_list.filter(function (e) {
        return e.katformid == fid || e.formid == fid;
      });

      //2022/1/7 如果電文無提示文件防呆
      var temp_obj = flist[0] || {
        caseSet: 1,
        serialNo: '00001'
      };

      var fd = Object.assign(params, self.service.getMpsformDataById(fid) || {});
      fd.id = '';
      fd.isCust = 'Y';//新增的文件可刪除
      fd.caseSet = temp_obj.caseSet;
      fd.isMax = 'Y';
      fd.guid = generateUUID();
      fd.title = fd.katformname;
      fd.serialNo = self.service.suppleZero(max_serialNo + 1, temp_obj.serialNo.length == 5 ? '00000' : '0000');

      if (fid != 'OTH'){
        if (sn.length > 1 && !copyCaseSetGuid) {

          var fs = self.formSettings['addDocMpsBtnThreeDocs'];

          var che = fs.content[1][0];

          che.options = [];
          for (var i = 0; i < sn.length; i++) {
            che.options.push({
              value: sn[i].caseSetGuid || sn[i].guid,
              text: fname.substr(0, 3) + ' ' + (i + 1)
            });
          }

          setTimeout(function () {
            var html = self.createForm(fs).prop('outerHTML');

            $.window(html, fs.title, null, function () {
              self.addDocMpsBtnThreeDocsOk(self, fd.guid, che.id);
            }, null, true);

            setTimeout(function () {
              var $che = $('#' + che.id);

              $che.on('click', 'input', function (e) {
                $che.find('input').prop('checked', false);

                var v = $(this).attr('value');
                $che.find('input[value=' + v + ']').prop('checked', true);

                $che.attr('value', v);
              });
            }, -1);

          }, -1);

        } else {
          self.addDocCopyData(fd.guid, copyCaseSetGuid || (sn[0] ? (sn[0].caseSetGuid || sn[0].guid) : ''));

          setTimeout(function () {
            $.alert(katctbc.msg.pleaseAddApp);
          }, -1);

        }
      } else {

        setTimeout(function () {
          $.alert(katctbc.msg.pleaseAddApp);
        }, -1);
        
      }

      flist.push(fd);

      self.katformList[idx] = self.service.caseSetSort(flist);

      self.refresh();

      if (sn.length <= 1 || fid == 'OTH') {
        $('[guid=' + fd.guid + ']').katTrigger('click');
      }

      //將文件名稱代到AigoData
      self.service.setAigoDataByKey(params.katformid + fd.serialNo, params.katformname, 'NAME_46');
    },
    addDocMpsBtnThreeDocsOk: function (self, key, id) {
      var guid = $('#' + id).attr('value');
      self.addDocCopyData(key, guid);
      $('[guid=' + key + ']').katTrigger('click');

      setTimeout(function () {
        $.alert(katctbc.msg.pleaseAddApp);
      }, -1);
      
    },
    //新增匯票
    addYYYMpsBtn: function (e, self, jqobj) {
      self.addDoc(self, 0, {
        formid: 'YYY',
        katformname: 'YYY',
        funname: 'formButton'
      });
    },
    //新增文件-複製資料
    addDocCopyData: function (guid, old_guid) {
      var self = this;

      var data;

      if (old_guid) {
        data = $('[dataKey=' + old_guid + ']').getMcuVal() || self.service.getBackSaveDataByKey(old_guid) || self.service.getSaveDataByKey(old_guid);
      }

      data = data || { edit: '' };

      self.service.addKeySaveData(guid, JSON.parse(JSON.stringify(data)));
    },
  };
})());

/**
 * 提示文件小視窗陳列區
 */
var MpsDocsWindows = function (o) {
  /**
   * 所有的視窗資料(類型 資料)
   */
  this.windowDataObj = {};
  /**
   * 視窗設定資料
   */
  this.winSettings = o.winSettings || katctbc.elements.docWindowElement;
  /**
   * 視窗寬度class
   */
  this.box = o.box;
  /**
   * 按鈕群物件
   */
  this.docsButtons = o.docsButtons;

  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'MpsDocsWindows';

  this.attrMap.className = o.className || 'v-arrangement';
}
MpsDocsWindows.prototype = Object.create(MpsElement.prototype);

MpsDocsWindows.prototype.constructor = MpsDocsWindows;

MpsDocsWindows.prototype = Object.assign(MpsDocsWindows.prototype, (function () {
  return {
    addEvent: function () {
      var self = this;

      this.katELement.on('mouseover', '.box-functionbtn', function (e) {
        var $this = $(this).parent().parent();
        $this.draggable('enable');
      });

      this.katELement.on('mouseleave', '.box-functionbtn', function (e) {
        var $this = $(this).parent().parent();
        $this.draggable('disable');
      });

      this.katELement.on('mousedown', '.box-functionbtn', function (e) {
        var $this = $(this).parent().parent();

        $this.css('position', 'relative');
        $this.css('top', $this.attr('top'));
        $this.css('left', $this.attr('left'));
      });

      this.katELement.on('mouseup', '.box-functionbtn', function (e) {
        var $this = $(this).parent().parent();

        $this.draggable('disable');

        $this.attr('top', this.offsetHeight);
        $this.attr('left', this.offsetLeft);
      });

    },
    addWindow: function (windowData) {

      if (!windowData.id) {
        var ids = [windowData.btnid];

        if (windowData.docsWindowsId) {
          ids.push(windowData.docsWindowsId);
        }

        ids.push('window');
        windowData.id = ids.join('_');
      }

      if (!(katJqobject['MpsDocsWindow'] || {})[windowData.id]) {
        var obj = this.initWindow(windowData);
        obj.katELement.katHide();// 初始的時候先藏起來
      }

      return windowData.id;
    },
    addWindows: function (windowData, keepOpen) {
      // 一次加三個 不同模式的
      var self = this;

      var winid = windowData.btnid + '_' + windowData.mode + '_window';
      if (!self.windowDataObj[winid]) {
        // 三種模式的框都先長出來
        windowData.katType = 'MpsDocsWindow';
        Object.keys(self.winSettings).slice(0, 4).forEach(function (mode) {//取前四個
          var windowTemp = Object.assign({}, windowData);
          windowTemp.barmode = mode;
          windowTemp.mode = (mode == 'imgview') ? 'view' : mode;
          windowTemp.id = windowTemp.btnid + '_' + mode + '_window';
          windowTemp.btnid = (mode == 'katform') ? windowTemp.btnid : '';
          windowTemp.diff = (mode == 'katform') ? windowTemp.diff : {};//20211220決定原始提交文件不顯示差異

          var obj = self.initWindow(windowTemp);
          obj.katELement.katHide();// 初始的時候全部先藏起來
        });
      }else{
        self.windowDataObj[winid].guid = windowData.guid;
      }

      //如果有銀行模擬才要開匯入視窗
      var first = self.service.getVerGuidByKey(windowData.katformid + windowData.caseSet + windowData.serialNo).first;
      if ((katctbc.addAllData || []).indexOf(winid) != -1 && first) {
        self.toggleWindow(winid, winid.replace('katform', 'close'), keepOpen);
      }

      self.toggleWindow(winid, winid, keepOpen);

    },
    initWindow: function (windowData) {
      windowData.className = this.box;
      var obj = new MpsDocsWindow(windowData);
      this.windowDataObj[obj.id] = obj;
      obj.init();

      obj.katELement.draggable({ stack: '.' + this.box, containment: "#" + this.id });

      return obj;
    },
    showWindow: function (id) {
      katJqobject['MpsDocsWindow'][id].katShow();
      $('#' + katJqobject['MpsDocsWindow'][id].attr('btnid')).addMpsClass('active');
      katJqobject['MpsDocsWindow'][id].css('background', '');
      katJqobject['MpsDocsWindow'][id].css('zIndex', 1000);

      katJqobject['MpsDocsWindow'][id].children().each(function (i, e) {
        $(e).katShow();
      });

      this.windowDataObj[id].loadView();
    },
    hideWindow: function (id, removePage) {
      var win = katJqobject['MpsDocsWindow'][id];
      if (!win) {
        return;
      }

      var flag = true;
      win.nextAll().each(function (i, e) {
        if (parseInt($(e).css('top')) + parseInt($(e).css('left'))) {
          flag = false;
        }
      });

      if (flag) {
        win.katHide();
      } else {
        win.css('background', 'none');
        win.css('zIndex', 0);

        win.children().each(function (i, e) {
          $(e).katHide();
        });
      }

      if(removePage){
        delete this.windowDataObj[id];
        win.remove();
        katJqobject['MpsDocsWindow'][id.replace('katform', 'view')].remove()
        katJqobject['MpsDocsWindow'][id.replace('katform', 'close')].remove()
      }

      var btn = katJqobject['MpsDocsButtons'][win.attr('btnid')];
      if (btn) {
        btn.removeMpsClass('active');
      }

    },
    toggleWindow: function (id, id2, keepOpen) {
      id2 = id2 || id;
      if (keepOpen == false) {
        this.hideWindow(id2);
      } else {
        this.showWindow(id2);
        var $vArrangement = this.$parent.find('.v-arrangement');
        if($vArrangement.length == 1) {
          $vArrangement.prepend($vArrangement.find('#' + id2).css({'top':'', 'left':''}));
          if(id2.indexOf('_katform_') != -1) {
            $vArrangement.prepend($vArrangement.find('#' + id2.replace('_katform_', '_close_')).css({'top':'', 'left':''}));
            $vArrangement.prepend($vArrangement.find('#' + id2.replace('_katform_', '_view_')).css({'top':'', 'left':''}));
            $vArrangement.prepend($vArrangement.find('#' + id2.replace('_katform_', '_imgview_')).css({'top':'', 'left':''}));
          }
        }
        //針對textarea顯示時,要去重新帶入高度
        this.changeTextareaHeight(id2);
      }
    },
    changeTextareaHeight: function (id) {
      katJqobject['MpsDocsWindow'][id].children().each(function (i, e) {
        var textarea = $(e).find('textarea');
        textarea.each(function (i, t) {
          //2022/1/13 改成去觸發input事件(算高度是寫在input事件裡)
          $(t).katTrigger('input');
        });
      });
    },
    changeWindowsHeight: function () {//測試完確定不用再刪掉
      var slen = $('.katDocWindow').filter(function (i, e) { return $(e).is(':visible') }).length;
      this.katELement.css('height', (window.outerHeight * 0.85 + 5) * Math.ceil(slen / 2) + 'px');
    },
    setWindowSetting: function (id, setMap) {
      var self = this;

      Object.keys(setMap).forEach(function (e) {

        self.windowDataObj[id][e] = setMap[e];
        katJqobject['MpsDocsWindow'][id].attr(e, setMap[e]);

      });
    },
    changeGreenTitle: function (id, newTitle) {
      katJqobject['MpsDocsWindow'][id].find('.box-title').text(newTitle);
    },
    verticalArrangMpsBtn: function () {
      var selector = '.' + this.box;
      this.katELement.find(selector).each(function (i, e) {
        var $e = $(e);
        $e.css('position', '');
        $e.css('top', '');
        $e.css('left', '');

        if (!$(e).children().is(':visible')) {
          $e.katHide();
        }
      });

    },
  };
})());

/**
 * 視窗元素
 */
var MpsDocsWindow = function (o) {
  /**
   * 文件編輯區域物件(內容是很多小視窗)
   */
  this.windowsDiv = o.windowsDiv;
  /**
   * 文件區塊的標題
   */
  this.title = o.title || '';
  /**
   * 資料
   */
  this.setInf = o.setInf;
  /**
   * 按鈕模式設定資料
   */
  this.settings = o.settings || katctbc.elements.docWindowElement;
  /**
   * 按鈕模式
   */
  this.barmode = o.barmode;
  /**
   * 模式
   */
  this.mode = o.mode;
  /**
   * 對應的form設定key
   */
  this.formid = o.formid;
  /**
   * katform 文件代號
   */
  this.katformid = o.katformid;
  /**
   * 對應按鈕id
   */
  this.btnid = o.btnid;
  /**
   * 套
   */
  this.caseSet = o.caseSet;
  /**
   * 對應按鈕caseSetGuid
   */
  this.guid = o.guid;
  /**
   * 單據排序用流水編號
   */
  this.serialNo = o.serialNo;
  /**
   * 欄位是否disabled
   */
  this.disabled = o.disabled;
  /**
   * 有異動欄位
   */
  this.diff = o.diff;
  /**
   * 前一版資料(for綠字判斷)
   */
  this.prevData = o.prevData;
  /**
   * katforms
   */
  this.katforms = [];

  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'MpsDocsWindow';
  /**
   * 單據排序用流水編號
   */
  this.attrMap.className = o.className || 'katDocWindow';
  /**
   * 對應上方按紐
   */
  this.attrMap.btnid = o.btnid || '';

  this.attrMap.serialNo = o.serialNo || '';
  /**
   * 對應的katformid
   */
  this.attrMap.katformid = o.katformid;
}
MpsDocsWindow.prototype = Object.create(MpsElement.prototype);

MpsDocsWindow.prototype.constructor = MpsDocsWindow;

MpsDocsWindow.prototype = Object.assign(MpsDocsWindow.prototype, (function () {
  return {
    initElementHTML: function () {
      var res = [];

      var $div = this.createMpsElement({ katType: 'div', });
      // 按鈕區
      var $div_b = this.createMpsElement({ katType: 'div', className: 'box-functionbtn d-flex bg-dark px-2 py-2' });
      $div_b.append(this.createBar(this.settings[this.barmode || this.mode][0], 'd-flex align-self-center mr-auto'));
      $div_b.append(this.createBar(this.settings[this.barmode || this.mode][1], 'flexRight'));

      $div.append($div_b);

      res.push($div);

      // 標題區
      res.push(this.createMpsElement({
        katType: 'div',
        text: this.title,
        className: 'box-title'
      }));

      // 文件區
      var viewSet = {
        katType: 'div',
        id: this.id + '_pdfViewMpsDiv',
        className: 'bg-white flex-grow-1',
      };
      if (this.guid && !this.disabled && ['katform', 'formwindow'].indexOf(this.mode) != -1) {
        //for儲存
        this.service.addKeySaveData(this.guid, Object.assign(this.service.getBackSaveDataByKey(this.guid) || {}, this.service.getSaveDataByKey(this.guid)));
      }
      res.push(this.createMpsElement(viewSet));

      return res.map(function (ele) { return ele.prop("outerHTML"); }).join('');
    },
    loadView: (function () {
      var designheight = 0;
      return function () {
        var self = this;
        var $pdfView = $('#' + this.id + '_pdfViewMpsDiv');

        if ($pdfView.html()) {
          return;
        }

        return new Promise(function (resolve) {

          setTimeout(function () {

            var $parentBookmark = self.katELement.parents('.katBookmarkPage');
            var parent_visible = $parentBookmark.is(':visible');

            if (!parent_visible) {
              $parentBookmark.katShow();
            }

            var ele_visible = self.katELement.is(':visible');

            if (!ele_visible) {
              self.katELement.katShow()
            }

            if (designheight == 0 || self.mode != 'formwindow') {
              // 設定文件區的高度
              // 視窗區的高度 - 黑底按鈕bar高度 -綠底標提高度
              var eq1h = self.katELement.children()[0].offsetHeight;
              var eq2h = self.katELement.children()[1].offsetHeight;
              designheight = (0.8 * window.outerHeight - eq1h - eq2h - 27);
            }

            self.katELement.css('height', (0.8 * window.outerHeight) - 27);
            $pdfView.css('height', designheight);

            if (!ele_visible) {
              self.katELement.katHide()
            }

            if (!parent_visible) {
              $parentBookmark.katHide();
            }

          }, -1);

          switch (self.mode) {
            case 'view'://歷史單據檢視模式

              myLoading(katctbc.msg.page);

              var set = self.service.getFormSetByMpsformId(self.katformid);

              var param_form = {
                katType: 'katDocForm',
                id: $pdfView.attr('id') + '_form',
                formid: self.katformid,
                caseSet: 1,
                dataKey: self.guid,
                btnid: 'xxx',
                notSync: true
              };

              var param_katform = {
                katType: 'katform',
                id: $pdfView.attr('id') + '_form',
                caseSet: self.caseSet,
                set: set,
                self: self,
                dataKey: self.guid,
                notSync: true,
                idPrintMode: true,
              };

              var katform = self.createMpsElement(self.katformid == 'YYY' ? param_form : param_katform);

              $pdfView.append(katform);

              var canvas = self.createMpsElement({
                katType: 'div',
                id: $pdfView.attr('id') + '_canvas',
                height: '1000px',
              });

              $pdfView.append(canvas);

              var diff = {};

              Object.keys(self.diff || {}).forEach(function (e) {
                var o = self.diff[e].o;
                diff[e] = o != null ? o : self.diff[e];
              });

              var diffType = self.title.split('_').indexOf('A') != -1 ? 'A' : 'B';

              setTimeout(function () {
                self.getPdf(katform, canvas, diff, diffType).then(function (url_list) {
                  
                  var $div = self.createMpsElement({ katType: 'div' });
                  
                  url_list.forEach(function(url){
                    
                    var view = self.createMpsElement({
                      katType: 'img',
                      src: url,
                      width: '100%'
                    });

                    $div.append(view);
                  });

                  $pdfView.append($div);

                  katform.remove();
                  canvas.remove();

                  resolve();
                  // $.closeLoading();
                });
              }, -1);

              break;
            case 'close'://匯入銀行模擬模式

              //提示文字+全選匯入按鈕區塊
              var f = self.createMpsElement({
                katType: 'katDocForm',
                id: $pdfView.attr('id') + '_columnImport',
                formid: 'columnImport',
                height: '70px'
              });

              $pdfView.append(f);

              //用來裝Mpsform物件區塊
              var close = self.createMpsElement({
                katType: 'div',
                paddingLeft: '30px',
                height: designheight - 70 + 'px'
              });

              var closeset = self.service.getFormSetByMpsformId(self.katformid);

              var m = self.createMpsElement({
                katType: 'katform',
                id: $pdfView.attr('id') + '_form',
                set: closeset,
                self: self,
                dataKey: self.service.getVerGuidByKey(self.katformid + '1').first || 'xxx',//self.guid
                notSync: true
              });

              close.append(m);

              $pdfView.append(close);

              setTimeout(function () {

                m.find('.mcu-object').each(function (i, e) {

                  if (e.tagName == 'TABLE') {
                    return;
                  }

                  if (['LClabel', 'LClogo', 'hr', 'LCheaderLine'].indexOf($(e).attr('data-mcutype')) != -1) {
                    return;
                  }

                  $(e).disableMcu();

                  var colName = $(e).attr('data-field-name') || $(e).attr('id');

                  var flag = self.service.getSysMenuByValue('1015', colName);

                  //如果有值為非匯入資料 且要帶入新的資料
                  if (flag) {
                    $(e).find('label').css('color', '#3794D3');//變藍
                  } else {
                    $(e).find('label').css('color', '#24A09A');//變綠

                    $(e).append(self.createMpsElement({
                      katType: 'katCheckbox',
                      options: [{ value: $(e).attr('id') }],
                      className: 'katCheckboxImport'
                    }));
                  }

                  //把同步欄位設定關掉
                  $(e).find('input,textarea').attr('data-is-sync', 'N');
                  
                  resolve();

                });

              }, -1)

              break;
            case 'katform'://單據編輯模式
              var set = self.service.getFormSetByMpsformId(self.katformid);
              var katform = self.createMpsElement({
                katType: 'katform',
                id: $pdfView.attr('id') + '_form',
                katformid: self.katformid,
                caseSet: self.caseSet,
                serialNo: self.serialNo,
                set: set,
                self: self,
                dataKey: self.guid,
                notSync: self.disabled
              });
              $pdfView.html(katform);

              setTimeout(function () {
            
                katform.find('.mcu-object').each(function (i, e) {
                  
                  if (e.tagName == 'TABLE'){
                    return;
                  }

                  var $ele = $(e);

                  if (['LClabel', 'LClogo', 'hr', 'LCheaderLine'].indexOf($ele.attr('data-mcutype')) != -1) {
                    return;
                  }

                  var colName = $ele.attr('data-field-name') || $ele.attr('id');

                  var flag = false;

                  //綁定focus在主欄位上
                  self.clickAnotherField($ele, self, colName);                  

                  //綁定連動規則
                  self.changeMainField($ele, self, colName);

                  //綁change事件
                  $ele.change(function (e) {
                    var v = $ele.getMcuVal();
                    $ele.setMcuVal(v);

                    self.changeEventFunction($(this), self, colName, flag);
                    flag = true;
                  });

                  $ele.katTrigger('change');

                  //是否把所有欄位都disabled
                  if (self.disabled) {
                    $ele.disableMcu();
                    //把同步欄位設定關掉
                    $ele.find('input,textarea').attr('data-is-sync', 'N');
                  }

                  resolve();
                });

              }, -1)

              break;
            case 'textview'://信用狀文字檢視模式
              var text = self.service.getTextDataByGuid(self.btnid);

              var textview = self.createMpsElement({
                katType: 'div',
                text: '<p>' + text.split('\n').join('</p><p>') + '</p>',
                width: '100%'
              });

              $pdfView.html(textview);

              resolve();

              break;
            case 'formwindow'://非單據編輯模式
              $pdfView.html(self.createMpsElement({
                katType: 'katDocForm',
                id: $pdfView.attr('id') + '_form',
                formid: self.formid,
                btnid: self.btnid,
                serialNo: self.serialNo,
                dataKey: self.guid || self.btnid
              }));

              setTimeout(function () {
                //是否把所有欄位都disabled
                if (self.disabled) {

                  $pdfView.find('input,textarea').each(function (i, e) {
                    $(e).attr('disabled', true);
                  });

                }

                //版本比對藍字 綠字 + 連動

                var d1 = Object.keys(self.diff || {});

                var cols = d1;

                if (['XXX', 'YYY'].indexOf(self.formid) != -1) {
                  cols = $pdfView.children().attr('columns').split(',');
                }

                cols.forEach(function (colName) {
                  var $ele = self.katELement.find('[dataKey=' + colName + ']');

                  var flag = false;

                  //綁change事件
                  $ele.change(function (e) {
                    self.changeEventFunction($(this), self, colName, flag);
                    flag = true;
                  });

                  $ele.katTrigger('change');

                  resolve();
                });

              }, -1)

              break;

          }
        });

      }
    })(),
    changeEventFunction: function ($this, self, colName, flag) {
      var v = $this.getMcuVal();

      if (self.prevData && $this.parents('[kattype=katDocForm]').attr('formid') != 'XXX') {//因為押匯申請書沒有答應要做版本比對

        var pv = self.prevData[colName] || '';//變綠
        var diff = (self.diff[colName] || {}).o || '';//變藍

        //表格處理
        var colModal = $this.attr('data-col-model');

        if (colModal) {

          var col_field_list = JSON.parse(colModal).map(function (c) { return c.field; });

          Object.keys(v).forEach(function (k) {
            if (['DEFAULT', 'HEAD'].indexOf(k) != -1) {
              return;
            }
            var pv_data = pv[k] || [];
            var diff_data = diff[k] || [];
            var v_data = v[k] || [];

            for (var i = 0; i < v_data.length; i++) {

              var $td = $this.find('tbody tr').eq(i).find('.firstArea').eq(col_field_list.indexOf(k) - 1).parent();

              // 這一欄是被刪除的
              if ($td.length == 0){
                continue;
              }

              //如果這列框框已經是綠的
              if ($td.parent().css('border') == '2px solid rgb(36, 160, 154)') {
                break;
              }
              var pv_data_v_split = self.service.switchVal(pv_data[i] + '').split('!@#');
              var diff_data_v_split = self.service.switchVal(diff_data[i] + '').split('!@#');
              var v_data_v_split = self.service.switchVal(v_data[i] + '').split('!@#');

              for (var j = 0 ; j < v_data_v_split.length ; j++){
                var pv_data_v = pv_data_v_split[j];
                var diff_data_v = diff_data_v_split[j];
                var v_data_v = v_data_v_split[j];

                var blue_flag = (self.diff[colName] && diff_data_v != v_data_v);//字變藍flag
                var green_flag = pv_data_v != v_data_v;//字變綠flag

                if (!green_flag && blue_flag) {
                  $td.append('<div class="tooltip-sdrm" ><label class="tooltiptext-sdrm" >' + pv_data_v + '</label></div>');
                }

                self.changeLabelAndBorder($td, green_flag, blue_flag, j);

                if (green_flag || blue_flag){
                  break;
                }
              }

              
            }

          });

        } else {

          var blue_flag = !!self.diff[colName];//字變藍flag
          var green_flag = self.service.switchVal(v) != self.service.switchVal(pv);//字變綠flag

          if (!green_flag && blue_flag) {
            if ($this.find('.tooltiptext-sdrm').length == 0) {
              $this.find('label').append('<label class="tooltiptext-sdrm" >' + diff + '</label>');
            }
          }

          self.changeLabelAndBorder($this, green_flag, blue_flag);
        }


      }

      //綁事件時不用跑欄位同步邏輯
      if (flag) {
        self.syncColumn($this, (colName || '').replaceAll('_1', ''));

        self.changeValidate($this);
      }
    },
    //改變單據欄位的樣式
    changeLabelAndBorder: function ($ele, isModify, isLastModify, i) {

      if (!$ele[0]) {
        return;
      }

      var $label = $ele.find('label');
      var $input = $ele[0].tagName == 'TD' ? $ele : $ele.find('input,textarea').eq(i || 0);

      if (isModify) {
        $input.css('border', '2px solid #24A09A');

        $label.eq(0).css('color', '#24A09A');//字變綠
        $label.removeMpsClass('tooltip-sdrm');//字變綠
        $ele.find('.tooltiptext-sdrm').katHide();//字變綠
      } else {
        $input.css('border', isLastModify ? '2px solid #3794D3' : '');

        $label.eq(0).css('color', isLastModify ? '#3794D3' : '');//字變藍
        $label.addMpsClass('tooltip-sdrm');
        $ele.find('.tooltiptext-sdrm').css('display', '');
      }

    },
    //欄位連動
    syncColumn: function ($this, colName) {
      var self = this;

      //非連動欄位
      if (!($this.attr('data-is-sync') == 'Y' || $this.find('input,textarea').attr('data-is-sync') == 'Y')) {
        return;
      }

      if(!colName){
        return;
      }

      //不為跨套欄位
      var not1019 = !self.service.getSysMenuByValue('1019', colName);

      var v = $this.getMcuVal();

      var caseSet = self.caseSet || '1';

      //更新連動欄位資料
      self.service.setSyncColumnsByKey(colName, v, not1019 ? caseSet : 'sets');

      //更新其他有此欄位的已開畫面的欄位值
      $('body').find('[id=' + colName + '],[data-field-name=' + colName + '],[dataKey*=' + colName + '_1]').each(function (i, e) {

        var e_btnid = $(e).parents('.box-full,.box-half').attr('btnid') || '';
        var e_caseSet = e_btnid.split('_')[1] || '1';

        //非同套 且 不為跨套欄位
        if (caseSet != e_caseSet && not1019) {
          return;
        }

        //目標欄位is sync不為Y
        if (!($(e).attr('data-is-sync') == 'Y' || $(e).find('input,textarea').attr('data-is-sync') == 'Y')) {
          return;
        }

        var ele_colName = $(e).attr('data-field-name') || $(e).attr('dataKey') || $(e).attr('id');

        $(e).setMcuVal(v);
        self.changeEventFunction($(e), self, ele_colName, false);
      });

      //未開畫面要加guid到saveData
      $('.edited').each(function (i, e) {
        var $e = $(e);
        if ($('[btnid=' + $e.attr('id') + ']').length == 0) {
          var guid = $e.attr('guid');
          self.service.addKeySaveData(guid, copyJson(self.service.getBackSaveDataByKey(guid)));
        }
      });

    },
    //欄位值變更時事件
    changeValidate: function ($field) {
      var self = this;

      var runType = 2;//離開焦點

      var colName = $field.attr('data-field-name') || ($field.attr('datakey') || '').replace('_1', '') || $field.attr('id');

      var rules = self.service.getRulesByKey(colName, runType);

      if (!rules.length) {
        return;
      }

      self.validator.validate({
        colName: colName,
        $mcu: $field
      }, rules, runType);
    },
    //別名欄位,要能focus在主欄位上
    clickAnotherField: function ($ele, self, colName) {
      var copyArr = ['INVOICE_NO_2','PORT_OF_DISCHARGE_2','INVOICE_DATE_2'];
      if(copyArr.indexOf(colName) > -1){
        var anotherName = colName.split('_2').length > 0 ? colName.split('_2')[0] : colName;
        $ele.click(function(e){
          var $form = self.katELement.eq(0);
          var $anotherField = $form.find('[data-field-name =' + anotherName + ']').find('input,textarea');
          $anotherField[0].focus();
        });
      }
    },    
    //INV1帶入IN2要能跨表單
    changeMainField: function ($ele, self, colName) {
      var copyArr = [{'field1':'INVOICE_NO','field2':'INVOICE_NO_2'},{'field1':'PORT_OF_DISCHARGE','field2':'PORT_OF_DISCHARGE_2'},{'field1':'INVOICE_DATE','field2':'INVOICE_DATE_2'}];
      var map = copyArr.find(function(e){
        return e['field1'] == colName;
      });
      if(!!map){
        var field1 = map['field1'];
        var field2 = map['field2'];
        $ele.change(function(e){
          var $form = self.katELement.eq(0);
          var $field = $form.find('[data-field-name =' + field1 + ']');
          self.syncColumn($field, (field2 || '').replaceAll('_1', ''));
        });
      }
    },
    closeMpsBtn: function (e, self, jqobj) {
      var idSplit = (jqobj.attr('id') || '').split('_');

      var win = jqobj.parents('.' + self.attrMap.className);

      if (['view', 'close', 'imgview'].indexOf(idSplit[3]) != -1) {
        self.windowsDiv.hideWindow(win.attr('id'));
      } else {
        $('#' + win.attr('btnid')).data('closeWin', true).katTrigger('click');
      }

    },
    //複製單一文件
    copyOneBtn: function (e, self, jqobj) {
      var $window = jqobj.parents('.' + self.attrMap.className);

      var idx = self.windowsDiv.docsButtons.getCaseSetIdx($window.attr('btnid'));//套數idx
      
      var guid = $window.find('[katType=katform]').attr('dataKey');

      var katformList = self.service.getFormListByPageId('tipDocForm');
      var flist = katformList[idx];

      var flist = flist.filter(function (f) {
        return (f.caseSetGuid == guid || f.guid == guid);
      })[0];

      var params = {
        katformid: flist.katformid,
        katformname: flist.katformname,
      };

      self.windowsDiv.docsButtons.addDoc(self.windowsDiv.docsButtons, idx, params, guid);
    },
    //版本比對
    verCompareBtn: function (e, self, jqobj) {
      var $w = jqobj.parents('.' + self.attrMap.className);

      //版本比對 key(katformid caseSet serialNo) caseNowVer max_caseNowVer
      var d = $w.attr('btnid').split('_');

      var katformid = $w.attr('katformid') || d[0].replaceAll(/[0-9]/g, '');
      var caseSet = d[1];
      var serialNo = $w.attr('serialNo');

      var key = katformid + caseSet + serialNo;

      var vc = self.service.verCompare(key, katctbc.caseNowVer - 2, katctbc.caseNowVer - 1);

      if (!vc || !vc.a_guid || !vc.b_guid) {
        $.alert(katctbc.msg.cannotCompare);
        return;
      }

      self.printVerCompare([{
        id: key,
        katformid: katformid,
        title: $w.children().eq(1).text(),//綠標顯示
        a_guid: vc.a_guid,
        b_guid: vc.b_guid,
        diff: vc.diff
      }], 'V');

    },
    leftMpsBtn: function (e, self, jqobj) {
      self.leftRightBtn(e, self, jqobj, -90);
    },
    rightMpsBtn: function (e, self, jqobj) {
      self.leftRightBtn(e, self, jqobj, 90);
    },
    leftRightBtn: function (e, self, jqobj, d) {
      var img = jqobj.parents('.' + self.attrMap.className).children().eq(2).find('img');

      var deg = parseInt(img.attr('deg') || '0') + d;
      img.attr('deg', deg);

      img.css('position', '');
      img.css('height', img.parents('.bg-white')[0].offsetHeight);//為了防止scroll產生的位移
      img.css('width', img.parents('.bg-white')[0].offsetWidth);

      img[0].style.transform = 'rotate(' + deg + 'deg)';

      img.css('height', '');//為了防止scroll產生的位移 轉完後清空


      if ((Math.abs(deg) / 90) % 2 == 1) {

        img.css('width', img.parents('.bg-white')[0].offsetHeight - 5);
        img.css('position', 'relative');
        img.css('top', - img.parents('.bg-white')[0].offsetHeight / 4);
        img.css('left', img.parents('.bg-white')[0].offsetWidth / 4);
        img.parent().css('overflow-y', 'hidden');

      } else {

        img.parent().css('overflow', 'auto');

      }
    },
    //放大
    zoominMpsBtn: function (e, self, jqobj) {
      var img = jqobj.parents('.' + self.attrMap.className).children().eq(2).find('img');

      if (img.css('position') == 'relative') {
        var t = parseInt(img.css('top').replace('px', ''));
        var l = parseInt(img.css('left').replace('px', ''));

        img.css('top', t * 1.1);
        img.css('left', l * 1.1);
      }

      img.parent().css('overflow', 'auto');
      img.css('width', img.width() * 1.1);
    },
    //縮小
    zoomoutMpsBtn: function (e, self, jqobj) {
      var img = jqobj.parents('.' + self.attrMap.className).children().eq(2).find('img');

      if (img.width() < 100) {//先訂100
        return;
      }

      if (img.css('position') == 'relative') {
        var t = parseInt(img.css('top').replace('px', ''));
        var l = parseInt(img.css('left').replace('px', ''));

        img.css('top', t / 1.1);
        img.css('left', l / 1.1);
      }

      img.parent().css('overflow', 'auto');
      img.css('width', img.width() / 1.1);

    },
    //下載單一文件
    downloadMpsBtn: function (e, self, jqobj) {
      var $win = jqobj.parents('.' + self.attrMap.className);

      var isLc = $win.find('[katType=katform]').length == 0;

      var page = $win.children().eq(2);
      self.printDownload(self.cloneNode(page), 'D', null, null, null, isLc);
    },
    //列印單一文件
    printOneMpsBtn: function (e, self, jqobj) {
      var $win = jqobj.parents('.' + self.attrMap.className);

      var isLc = $win.find('[katType=katform]').length == 0;

      var page = $win.children().eq(2);
      self.printDownload(self.cloneNode(page), 'P', null, null, null, isLc);
    },
    //將舊資料匯入案件
    addOldDataMpsBtn: function (e, self, jqobj) {
      var fs = katctbc.popup['confirmImport'];

      $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {
        self.addOldDataMpsBtnOk(self, jqobj);
      });
    },
    addOldDataMpsBtnOk: function (self, jqobj) {
      var win = jqobj.parents('.' + self.attrMap.className);

      self.windowsDiv.hideWindow(win.attr('id'));

      //整套匯入

      //用點下去按鈕去回查該歷史案件所有單據
      var data = self.service.getCaseSetGuidKey(win.attr('guid'));
      //該歷史案件下的單據
      var list = self.service.getAddOldDataByKey(data.caseGuid);

      list.forEach(function (d) {
        var oldKeyin = self.service.getCaseSetGuidKey(d.a_guid).allKeyinData || {};

        // 要過濾掉不要匯入的欄位
        Object.keys(oldKeyin).forEach(function (k) {
          var flag = self.service.getSysMenuByValue('1015', k);

          if (flag) {
            delete oldKeyin[k];
          }

        });

        //判斷畫面上有無該單據視窗
        var katform = $('[dataKey=' + d.b_guid + ']');

        var data = self.service.getCaseSetGuidKey(d.b_guid).allKeyinData;

        if (katform.length > 0) {

          data = katform.getMcuVal();

          var id = katform.parents('.box-half').attr('id');
          
          self.windowsDiv.showWindow(id);

          katctbc.addAllData.push(id);
          
          self.windowsDiv.showWindow(id.replace('katform', 'close'));

        }

        Object.keys(data).forEach(function (k) {
          var flag = self.service.getSysMenuByValue('1015', k);

          if (flag) {
            oldKeyin[k] = data[k];
          }

        });

        katform.setMcuVal(oldKeyin);

        self.service.addKeySaveData(d.b_guid, oldKeyin);

      });

    },
  };
})());