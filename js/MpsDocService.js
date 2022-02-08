'use strict';

//處理資料用
var MpsDocService = function () {
  /**
   * 提示文件 按鈕功能設定
   */
  this.docWindowElement = katctbc.elements.docWindowElement || {};
  /**
   * 設定顯示在畫面的格式資料
   */
  this.viewTemplate = katctbc.elements.viewTemplate || {};
  /**
   * API的url
   */
  this.apiUrl = katctbc.api || {};
  /**
   * 請求方法controller
   */
  this.ajaxController = new MpsAjax();
};

/**
 * 規則對應要驗證欄位
 */
var ruleAttachKey = {};

/**
 * 規則檢核點特殊設定
 */
var ruleAttachType = {};

function dataURLtoBlob(dataurl) {
  if (!dataurl) {
    return new Blob();
  }

  dataurl = toSBC(dataurl);

  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function toSBC(str) {
  var result = '';
  var len = str.length;
  for (var i = 0; i < len; i++) {
    var cCode = str.charCodeAt(i);
    //全形與半形相差（除空格外）：65248（十進位制）
    cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
    //處理空格
    cCode = (cCode == 0x03000) ? 0x0020 : cCode;
    result += String.fromCharCode(cCode);
  }
  return result;
}

function generateUUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  });
}

function copyJson(json) {
  try {
    return JSON.parse(JSON.stringify(json));
  } catch {
    return {};
  }
}

function myLoading(msg, klass) {
  // $.closeLoading()
  // $.loading(msg, klass);
}

MpsDocService.prototype = (function () {
  /**
   * 案件狀態是 待製單 已提交預審 待客戶指示
   */
  var status246_flag;
  /**
   * 可以做版本比對
   */
  var compare_flag;
  /**
   * 有前次提交
   */
  var preSubmit_flag;
  /**
   * 全部資料
   */
  var allInf = null;
  /**
   * 案件資料
   */
  var caseData = null;
  /**
   * 後台查的設定資料
   */
  var backSettingData = {};
  /**
   * 後台查的填寫資料
   */
  var backSaveData = {};

  /**
   * 不需儲存的資料
   */
  var notSaveData = {};
  /**
   * 此次編輯的填寫資料
   */
  var saveData = {};
  /**
   * 各版本對應guid
   *   INV:{
   *         max:xxx,
   *         first:ooo,
   *         all:[ooo,...,xxx]
   *       }
   * }
   */
  var verGuid = {};
  /**
   * 檔案資料
   */
  var fileData = {};
  /**
   * 信用狀swift data文字資料
   */
  var textData = {};
  /**
   * 表單設定資料
   */
  var katformData = {};
  /**
   * 提示文件+預審底稿+第三方製單要點(模擬單據預審) 按鈕
   */
  var formListObj = {};
  /**
   * case set inf key為 case_set_guid
   */
  var caseSetGuidKey = {};
  /**
   * 整套匯入用的
   */
  var addOldDataMap = {};
  /**
   * 資料轉換成畫面要使用的格式
   */
  var viewTemplateData = {};
  /**
   * 提示文件流水號
   */
  var seqList = [];
  /**
   * 連動欄位
   */
  var syncColumns = {};
  /**
   * 各單據有的欄位資料
   */
  var formColumns = {};
  /**
   * 單據對應的aigo資料
   */
  var formAigoData = {};
  /**
   * 欄位對應規則清單
   */
  var fieldRulesMap = {};
  /**
   * 申請書份數
   */
  var docAmount = [[], []];
  /**
   * benDocument組出來的資料
   */
  var docs = [];
  /**
   * 需要存前一版值的key(非存case set的資料)
   */
  var needPrev = ['prev', 'katMakerIssueCheck', 'katMakerIssueText', 'thirdPartyDocBtn', 'thirdPartyDocUpload', 'CHK', 'exportOP', 'amlOP', 'customerContact'];

  return {
    /**
     * 設定載入全部資料
     */
    setAllInf: function (data) {
      allInf = data;
    },
    /**
     * 取得載入全部資料
     */
    getAllInf: function () {
      return allInf;
    },
    /**
     * 設定案件資料
     */
    setCaseData: function (data) {
      caseData = data;
    },
    /**
     * 取得案件資料
     */
    getCaseData: function () {
      return caseData;
    },
    /**
     * 設定後台查的設定資料
     */
    setBackSettingData: function (data) {
      backSettingData = data;
    },
    /**
     * 取得後台查的設定資料
     */
    getBackSettingData: function () {
      return backSettingData;
    },
    /**
     * 取得後台查的設定資料(單筆)
     */
    getBackSettingDataByKey: function (key) {
      return backSettingData[key];
    },
    /**
     * 設定後台查的填寫資料(多筆)
     * @param {*} flag 是否清空
     */
    setBackSaveData: function (data, flag) {
      var dataStr = JSON.stringify(data);
      backSaveData = Object.assign(flag ? {} : backSaveData, JSON.parse(dataStr));
      this.setSaveData(JSON.parse(dataStr), flag);
    },
    /**
     * 設定特定key對應的後台設定資料
     * @param {*} key backSaveData key
     * @param {*} data 資料
     * @returns 
     */
    setBackSaveDataByKey: function (key, data) {
      backSaveData[key] = data;
    },
    /**
     * 取得後台查的填寫資料
     */
    getBackSaveData: function () {
      return backSaveData;
    },
    /**
     * 取得特定key對應的後台設定資料
     * @param {*} key backSaveData key 
     * @returns 
     */
    getBackSaveDataByKey: function (key) {
      return backSaveData[key];
    },
    /**
     * 設定此次編輯的填寫資料(多筆)
     * @param {*} flag 是否清空
     */
    setSaveData: function (data, flag) {
      saveData = Object.assign(flag ? {} : saveData, data);
    },
    /**
     * 取得此次編輯的填寫資料
     */
    getSaveData: function () {
      return saveData;
    },
    getSaveDataByKey: function (key) {
      return saveData[key];
    },
    setNotSaveDataByKey: function (key, data) {
      notSaveData[key] = data;
      this.dataKeyToViewTemplate(key);
    },
    getNotSaveData: function () {
      return notSaveData;
    },
    getNotSaveDataByKey: function (key) {
      return notSaveData[key];
    },
    /**
     * 設定版本對應資料guid
     * @param {*} key ex:INV10001 INV10003
     * @param {*} caseNowVer 版本號
     * @param {*} isMax 是否為最大版
     * @param {*} guid 資料guid
     */
    setVerGuidByKey: function (key, caseNowVer, isMax, guid) {
      verGuid[key] = verGuid[key] || {}

      //如果是最大版
      if (isMax) {
        verGuid[key].max = guid;
      }

      //如果為第0版
      if (caseNowVer == 0) {
        verGuid[key].first = guid;
      }

      verGuid[key].all = verGuid[key].all || [];
      verGuid[key].all[caseNowVer] = guid;
    },
    /**
     * 取得版本對應資料guid
     * @param {*} key ex:INV10001 INV10003
     */
    getVerGuidByKey: function (key) {

      //若直接取無值 則比對前幾碼相同的
      if (!verGuid[key]) {

        var result = {};

        var keys = Object.keys(verGuid);

        for (var i = 0; i < keys.length; i++) {

          if (keys[i].indexOf(key) == 0) {
            result = verGuid[keys[i]];
            break;
          }
        }

        return result;

      }
      return verGuid[key];
    },
    /**
     * 取得版本對應資料guid(最大版)
     * @param {*} key ex:INV10001 INV10003
     */
    getMaxVerGuidByKey: function (key) {
      return verGuid[key].isMax;
    },
    /**
     * 取得版本對應資料guid(第0版)
     * @param {*} key ex:INV10001 INV10003
     */
    getFirstVerGuidByKey: function (key) {
      return verGuid[key].first;
    },
    setTextDataByGuid: function (guid, text) {
      textData[guid] = text;
    },
    getTextDataByGuid: function (guid) {
      return textData[guid];
    },
    setFileDataByGuid: function (guid, file) {
      fileData[guid] = {
        blob: file,
        name: file.name,
        url: URL.createObjectURL(file)
      };
    },
    getFileDataByGuid: function (guid) {
      if (!fileData[guid]) { //若無圖檔去後台查

        //TODO
        var result = this.downloadFile(guid);

        var mimeTypePrev = '';
        switch(result.fileType){
          case 'pdf':
            mimeTypePrev = 'application/';
            break;
          case 'jpg':
            mimeTypePrev = 'image/';
            break;
          case 'jpeg':
            mimeTypePrev = 'image/';
            break;
        }

        var file_split = result.caseFile.split(';base64,');
        var file = 'data:' + mimeTypePrev + result.fileType + ';base64,' + (file_split[1] || file_split[0]);

        fileData[guid] = {
          blob: dataURLtoBlob(file),
          url: URL.createObjectURL(dataURLtoBlob(file))
        };
      }
      return fileData[guid];
    },
    /**
     * 檔案上傳
     * @param {*} funType 檔案分類(第三方or貿融...)
     * @param {*} guid 
     * @param {*} caseSet 套數
     * @param {*} file 檔案
     */
    uploadFile: function (funType, guid, caseSet, file) {

      var self = this;

      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {

          var res = self.sendRequest('uploadFile', {
            guid: guid,
            funType: funType,
            caseNo: caseData.caseNo,
            caseSet: caseSet || '1',
            caseFile: reader.result.split(';base64,')[1],
            fileType: file.type,
            fileName: file.name
          }) || {};

          if (res.code == '200') {
            self.setFileDataByGuid(guid, file);
          }

          resolve(res);
        };

      });

    },
    /**
     * 檔案下載
     * @param {*} guid 
     */
    downloadFile: function (guid) {
      var res = {};

      var result = this.sendRequest('downloadFile', {
        guid: guid,
      });

      if (result.code == '200') {
        res = result.lcFileListInf;
      }

      return res;
    },
    /**
     * 檔案刪除 (目前沒有用到)
     * @param {*} guid 
     */
    deleteFile: function (guid) {

      var result = this.sendRequest('deleteFile', {
        guid: guid,
      });

      return result || {};

    },
    /**
     * 轉換excel
     * @param {*} file 
     */
    convertExcel: function (fileEle) {

      return this.sendRequest('convertExcel', {}, {
        data: new FormData(fileEle),
        dataType: '',
        processData: false,
        contentType: false,
      }) || {};

    },
    setMpsformDataById: function (katformid, data) {
      katformData[katformid] = data;
    },
    getMpsformDataById: function (katformid) {
      return katformData[katformid];
    },
    /**
     * 更新有關聯的欄位的值(第三方文件上傳 判斷有無編輯用欄位)
     * @param {*} key 
     */
    updateAssociatedKey: function(key){
      
      if (!key) {
        return;
      }

      var idx = key.split('_')[1];

      //如果是第三方表格資料異動
      if ((key.indexOf('thirdPartyDocUpload_')) != -1) {
        //更新判斷按鈕變色的欄位
        this.addKeySaveData('checkUploadAll_' + idx, saveData[key].map(function (d) {

          //文件代號,放棄提示,與其他文件共用,恢復檔案上傳
          return [
            d.docCategory.value,
            ((d.hint || {}).value || ''),
            ((d.openUpload || {}).value || ''),
            ((d.shareWithOther || {}).value || '')
          ].join(',');//用有沒有hint屬性判斷是不是新增

        }).join(';'));

      }

      //只紀錄要做按鈕或前後都會有的頁籤欄位 不然會存一堆垃圾
      if (needPrev.indexOf(key.split('_')[0]) != -1){
        if (!saveData['prev']) {
          saveData['prev'] = {};
        }

        setTimeout(function () {
          var v = $('[dataKey=' + key + ']').getMcuVal();
          if (!saveData['prev'][key] && v) {
            saveData['prev'][key] = v;
          }
        }, -1);
        
      }

    },
    /**
     * 設定此次編輯的填寫資料
     * @param key 資料key
     * @param data 資料
     * @param flag 是否刪掉舊有資料
     */
    addKeySaveData: function (key, data) {
      katctbc.isSave = false;

      saveData[key] = data;
 
      this.updateAssociatedKey(key); 
      
      this.dataKeyToViewTemplate(key);
    },
    /**
     * 更新此次編輯的填寫資料
     */
    updateKeySaveDataByKey: function (key, data) {
      katctbc.isSave = false;

      if (!saveData[key]) {
        this.addKeySaveData(key, data);
        return;
      }
      Object.keys(data || {}).forEach(function (k) {
        saveData[key][k] = data[k];
      });

      this.updateAssociatedKey(key); 

      this.dataKeyToViewTemplate(key);
    },
    /**
     * 更新此次編輯的填寫資料
     */
    updateKeySaveDataByKeyIdx: function (key, idx, data) {
      katctbc.isSave = false;

      if (!saveData[key]) {
        this.addKeySaveData(key, [data]);
        return;
      }
      if (!saveData[key][idx]) {
        saveData[key][idx] = {};
      }
      Object.keys(data).forEach(function (k) {
        saveData[key][idx][k] = data[k];
      });

      this.updateAssociatedKey(key); 
      
      this.dataKeyToViewTemplate(key);
    },
    /**
     * 刪除此次編輯的填寫資料
     */
    delKeySaveData: function (key, idx) {
      if (idx) {
        delete saveData[key][idx];
      } else {
        delete saveData[key];
      }
    },
    /**
     * 刪除form元素的資料
     * @param {*} key 
     */
    delFormKeySaveData: function (key) {
      var self = this;

      Object.keys(self.getSaveDataByKey(key) || {}).forEach(function (k) {
        if (k == 'edit') {
          return;
        }
        self.delKeySaveData(k);

      });

      self.delKeySaveData(key);
    },
    getViewTemplateData: function () {
      return viewTemplateData;
    },
    dataToViewTemplate: function () {
      var self = this;

      var data = Object.assign(backSaveData, saveData);
      data = Object.assign(data, notSaveData);

      Object.keys(data).forEach(function (key) {
        self.dataKeyToViewTemplate(key);
      });
    },
    dataKeyToViewTemplate: function (key) {

      if (!key) {
        return;
      }

      var self = this;

      var sd = notSaveData[key] || saveData[key];//儲存資料
      var vkey = key.split('_')[0];
      var vt = self.viewTemplate[vkey] || [];//模板格式

      if (vt.length > 0) {//模板有設定格式

        var temp = [];

        (sd || []).forEach(function (s, i) {//將一筆一筆的資料套入模板設定
          var copyVt = vt.map(function (d) {
            return Object.assign({}, d);
          });

          copyVt.forEach(function (d) {//一個欄位為單位帶入資料
            switch (d.katType) {
              case 'katButtons':
                d.setting = self.setText(s[d.key] || {});
                break;
              case 'katFileHref':
                d.setting = self.setText(s[d.key] || {});
                break;
              case 'katLabelInput':
                d.value = (s[d.key] || {}).text || '';
                break;
              case 'katSelect':
                d.value = (s[d.key] || {}).value || '';
                break;
              default:
                if (d.hasOwnProperty('key')) {//若設定有key屬性 就在儲存資料抓取該key的text值
                  d.text = (s[d.key] || {}).text || s[d.key] || '';
                  d.value = (s[d.key] || {}).value || s[d.key] || '';
                }
            }

            if (d.id) {
              d.id = d.id + '_' + (key.split('_')[1] || '') + '_' + i;
            }
            if (d.for) {
              d.for = d.for + '_' + i;
            }
            //針對一些屬性做處理(by key)
            switch (vkey) {
              case 'ocLcno'://歷史單據
                // 要多塞一行文件清單
                switch (d.funname) {
                  case 'oldCasesDocName':
                    temp.push(copyVt.slice(0, 3));
                    copyVt = copyVt.slice(3);
                    break;
                }
                break;
              case 'ocParty'://歷史單據
                // 要多塞一行文件清單
                switch (d.funname) {
                  case 'oldCasesDocName':
                    temp.push(copyVt.slice(0, 3));
                    copyVt = copyVt.slice(3);
                    break;
                }
                break;
              case 'ocCustomer'://歷史單據
                // 要多塞一行文件清單
                switch (d.funname) {
                  case 'oldCasesDocName':
                    temp.push(copyVt.slice(0, 3));
                    copyVt = copyVt.slice(3);
                    break;
                }
                break;
              case 'thirdPartyDocUpload'://第三方檔案上傳
                //按鈕是否enable
                switch (d.funname) {
                  case 'chooseDocMpsBtn'://選擇檔案按鈕 與其他共用 製單作業 放棄提示 
                    d.disabled = !!(s.shareWithOther || {}).value || !s.canUpload || (!!(s.hint || {}).value);
                    break;
                  case 'shareWithOtherMpsRadio'://是否與其他共用radio
                    d.checked = !!(s[d.key] || {}).value;
                    var d_flag = {
                      hint: ((s.fileNames || {}).text || '').length > 0 || (!!(s.shareWithOther || {}).value),
                      shareWithOther: ((s.fileNames || {}).text || '').length > 0 || (!!(s.hint || {}).value)
                    };
                    d.disabled = d_flag[d.key];
                    break;
                  case 'openUploadMpsRadio'://恢復檔案上傳radio
                    d.checked = !!(s.openUpload || {}).value;
                    d.disabled = (s.hint || {}).value == 'X';
                    break;
                  case 'rmThirdDocMpsBtn'://刪除文件種類
                    d.disabled = !s.byCust;
                    if (d.disabled) {
                      d.funname = 'rmThirdDocMpsBtnDisa';
                    }
                    break;
                }
                switch (d.key) {
                  case 'docCategory':
                    //2022/1/6 判斷此行資料有無修改(第三方文件上傳) 2022/1/10加防呆
                    if ((saveData.prev || {})[key]){
                      var prevData = saveData.prev[key].filter(function (e) {
                        return e.serialNo == s.serialNo && e.docCategory.value == s.docCategory.value;
                      })[0];

                      var has_diff = !prevData;//代表這筆是新增
                      Object.keys(s).forEach(function (s_k) {

                        if (!has_diff) {
                          if (((prevData[s_k] || {}).value || '') != ((s[s_k] || {}).value || '')) {
                            has_diff = true;
                          }
                        }

                      });

                      s.docCategory.hasDiff = has_diff;
                      d.color = has_diff ? '#24A09A' : (prevData.docCategory.hasDiff ? '#3794D3' : '');
                    }
                    delete d.value;
                }
                break;
              case 'otherDiscrepancies'://預審結果 其他瑕疵
                switch (d.funname) {
                  case 'cutermerInstructions':
                    d.options = d['options' + (s.bankSuggest.value == '1' ? '1' : '2')];
                    d.value = (s.cutermerInstructions || {}).value;
                    d.id = 'cutermerInstructions_' + i;
                    d.name = 'cutermerInstructions_' + i;
                    d.disabled = (s.caseVer != katctbc.caseVer - 1);
                    break;
                }
                break;
              case 'exportAml'://預審結果 貿融
                switch (d.funname) {
                  case 'custReplyInput':
                    d.key = (s.qtype.value == 'O') ? 'tradeAndFinanceCheck_1' : 'tradeAndFinanceCheckAML_1';
                    d.seq = '' + s.seq;
                    d.disabled = (s.caseVer != katctbc.caseVer - 1);
                    break;
                  case 'chooseDocMpsBtn':
                    d.disabled = (s.caseVer != katctbc.caseVer - 1);
                    break;
                }
                break;
            }
          })
          temp.push(copyVt);
        })
        viewTemplateData[key] = temp;
      } else {

        viewTemplateData[key] = sd;

      }

    },
    setText: function (data) {
      var texts = (data.text || '').split(',');
      var values = (data.value || '').split(',');
      var katformids = (data.katformid || '').split(',');
      var isnews = (data.isnew || '').split(',');

      var result = [];

      texts.forEach(function (t, i) {
        result.push({
          text: t,
          value: values[i] || '123',
          katformid: katformids[i] || '',
          //如果案件版號相等 當次上傳客戶端/若差一版 當次上傳OP端/差超過一版 OP或客戶非當次上傳 
          color: isnews[i] == katctbc.caseVer || !isnews[i] ? '' : (isnews[i] == (katctbc.caseVer - 1) ? '#3794D3' : '#373a3c'),
        });
      })

      return result;
    },
    //取得表單設定資料
    getFormSet: function () {
      return katformData;
    },
    // 取得表單設定資料
    getFormSetByMpsformId: function (katformid) {
      return katformData[katformid];
    },
    /**
     * 設定按鈕設定資料
     * @param {*} pageId 頁籤畫面ID(頁籤ID + 'FORM')
     * @param {*} formList 該頁籤按鈕設定資料
     */
    setFormListByPageId: function (pageId, formList) {
      formListObj[pageId] = formList;
    },
    /**
     * 取得按鈕設定資料
     * @param {*} pageId 頁籤畫面ID(頁籤ID + 'FORM')
     */
    getFormListByPageId: function (pageId) {
      return formListObj[pageId] || [];
    },
    /**
     * 取得套數陣列
     */
    getFormSeqList: function () {
      return seqList;
    },
    /**
     * 取得設定連動的欄位和欄位值
     * @returns 連動的欄位和欄位值
     */
    getSyncColumns: function () {
      return syncColumns;
    },
    /**
     * 取得設定連動的欄位和欄位值
     * @returns 連動的欄位和欄位值
     */
    getSyncColumnsByCaseSet: function (caseSet) {
      return Object.assign(copyJson(syncColumns['sets'] || {}), syncColumns[caseSet] || {});
    },
    /**
     * 設定連動的欄位值
     * @param {*} key 欄位名稱
     * @param {*} value 欄位值
     * @param {*} caseSet 套數
     */
    setSyncColumnsByKey: function (key, value, caseSet) {
      syncColumns[caseSet] = syncColumns[caseSet] || {};
      syncColumns[caseSet][key] = value;
    },
    /**
     * 移除整套設定連動的欄位和欄位值
     */
    removeSyncColumnsByKey: function (caseSet) {
      if (syncColumns[caseSet]){
        delete syncColumns[caseSet];
      }
    },
    /**
     * 移除一筆form資料
     * @param {*} pageId 
     * @param {*} caseSetGuid 
     */
    removeOneForm: function (pageId, caseSetGuid) {
      formListObj[pageId].forEach(function (formList) {
        formList.forEach(function (form, idx) {
          if (form.caseSetGuid == caseSetGuid) {
            formList.splice(idx, 1);

          }
        });
      });

    },
    /**
     * 設定caseSetInf資料(單筆)
     * @param {*} key caseSetGuid
     * @param {*} data caseSetInf
     */
    setCaseSetGuidKey: function (key, data) {
      caseSetGuidKey[key] = data;
    },
    /**
     * 取得caseSetInf資料(單筆)
     * @param {*} key caseSetGuid
     */
    getCaseSetGuidKey: function (key) {
      return caseSetGuidKey[key] || {};
    },
    /**
     * 取得整套匯入對應資料
     * @param {*} key case guid
     * @returns 
     */
    getAddOldDataByKey: function (key) {
      return addOldDataMap[key];
    },
    getFieldRulesMap: function () {
      return fieldRulesMap;
    },
    /**
     * 取得欄位的標籤
     * @param {*} katformid 單據編號
     * @param {*} colName 欄位名稱
     * @returns 
     */
    getLabelByColName: function (katformid, colName) {

      var id = katformid;
      if (!formColumns[katformid]) {
        id = 'OTH';
      }

      if (!formColumns[id] || !formColumns[id][colName]) {
        return '';
      }

      return (formColumns[id][colName] || {}).label;
    },
    /**
     * 取得單據所有欄位資料
     */
    getFormColumnsByKey: function (key) {
      return formColumns[key];
    },
    /**
     * 取得單據所有欄位資料
     * @param {*} key 欄位名稱
     * @param {*} runType 執行時機
     * @param {*} ruleAttrs 規則類型(賦值 檢核 )
     */
    getRulesByKey: function (key, runType, ruleAttrs) {
      ruleAttrs = ruleAttrs || ['0', '1', '2'];
      return (fieldRulesMap[key] || []).filter(function (r) {
        return (r.runType == runType && ruleAttrs.indexOf(r.ruleAttr) != -1);
      });
    },
    /**
     * 設定aigo資料
     * @param {*} key 欄位名稱
     * @param {*} value 欄位值
     * @param {*} key2 欄位名稱
     */
    setAigoDataByKey: function (key, value, key2) {
      if (key2 !== undefined) {
        formAigoData[key] = formAigoData[key] || {}
        formAigoData[key][key2] = value
        return;
      }
      formAigoData[key] = value;
    },
    /**
     * 取得全部aigo資料
     * @returns 
     */
    getAllAigoData: function () {
      return formAigoData;
    },
    /**
     * 取得aigo裡的單據資料
     * @param {*} katformid 
     * @param {*} tag 
     * @returns 
     */
    getAigoData: function (key, tag) {
      return (formAigoData[key] || {})[tag] || formAigoData[tag];
    },
    /**
     * 取得申請書份數
     */
    getDocAmount: function () {
      return docAmount;
    },
    /**
     * 取得benDocument組出來的資料
     */
    getBenDocData: function () {
      return docs;
    },
    //各資料分類
    allInf: function (inf) {
      if (!inf) {
        return;
      }

      //案件是否停用 是否需要浮水印
      this.lcLcInf(inf.lcLcInf);

      //全部資料
      this.setAllInf(inf);

      //系統選單
      this.sysMenu(inf.sysMenu || {});

      //案件資料
      this.lcCaseInf(inf.lcCaseInf);

      //提示文件按鈕
      var caseNowVer = 0;
      //為不可編輯的模式
      if(['4', '5'].indexOf(caseData.status) != -1){
        
        //如果案件狀態是5(有儲存過才要抓prev的資料呈現)
        if (caseData.status == '5'){
          saveData = saveData['prev'];
        }

        inf.lcCaseSetInfList = inf.lcCaseSetInfList.filter(function (f) {

          if (f.isMax == 'Y') {
            caseNowVer = f.caseNowVer;
            return false;
          } else {
            return true;
          }

        }).map(function (f) {
          if (f.caseNowVer == caseNowVer - 1) {
            f.isMax = 'Y';
          }
          return f;
        });
      }
      
      this.lcCaseSetInfList(inf.lcCaseSetInfList);

      //其他判斷用 (會用到seqList 所以要在單據資料組完後執行)
      this.otherAttr();

      //要組prev資料
      if (caseData.status == '2' || caseData.status == '6') {

        var prev_saveData = copyJson(saveData);
        var filter_prev_saveData = {};

        Object.keys(prev_saveData).forEach(function (k) {
          if (needPrev.indexOf(k.split('_')[0]) == -1) {
            return;
          }
          filter_prev_saveData[k] = prev_saveData[k];
        });

        //2022/1/10 刪掉不需要的prev資料(前前前一版)
        if (filter_prev_saveData.prev && filter_prev_saveData.prev.prev && filter_prev_saveData.prev.prev.prev) {
          delete filter_prev_saveData.prev.prev.prev;
        }

        saveData['prev'] = filter_prev_saveData;
      }

      //前次提交文件
      this.oriDocument(inf.lcCaseSetInfList);

      //製單要件
      this.aigoReturnJson(inf.lcCaseInf.aigoReturnJson, inf.lcCaseInf.aigoSourceJson, inf.lcCaseInf.lcSwiftJson);

      //信用狀
      this.lcSwiftData(inf.lcSwiftData);

      //歷史單據
      this.historyCaseList(inf.historyCaseList);

      //銀行模擬文件+表單設定
      this.formSetInf(inf.mfFormSetInf);

      //規則
      this.mfFormSetInfRuleList(inf.mfFormSetInfRuleList);

      //案件改派歷程
      this.reAssignLcEventInfList(inf.reAssignLcEventInfList);

      //logo
      this.lcCustomerInf(inf.lcCustomerInf);

      //貿融檢核提問
      this.exportAml();

      //預審結果歷程資料
      this.otherDiscrepanciesHis();
      this.exportAmlHis();

      setTimeout(function () {
        katctbc.isSave = true;
      }, 500);

    },
    //浮水印 案件是否停用
    lcLcInf: function (lcLcInf) {

      //如果案件停用 導回查詢頁
      if (lcLcInf.isPause == 'Y') {
        this.backToQueryPage();
      }

      //是否需要浮水印
      katctbc.iswatermark = (lcLcInf.iswatermark == 'Y');

    },
    // 重查LC_LC_INF
    refreshLcLcInf: function () {
      var res = this.sendRequest('getLc', {
        lcno: caseData.lcno
      }, null, true) || {};

      if (res.code == '200') {
        this.lcLcInf(res.lcLcInf);
      }
    },
    sysMenu: function (sysMenu) {
      //特殊處理下拉選單
      sysMenu['1004_1'] = (sysMenu['1004'] || []).filter(function (e) {
        return (e.flag01 == '1' || !e.flag01);
      });

      //申請書與匯票
      sysMenu['1004_2'] = (sysMenu['1004'] || []).filter(function (e) {
        return e.flag01 == '2';
      });

      sysMenu['1016'] = (sysMenu['1016'] || []).map(function (e) {

        var aigoEqual = [];

        for (var i = 1; i <= 9; i++) {
          aigoEqual.push(e['flag0' + i]);
        }

        e.aigoEqual = aigoEqual;

        return e;
      });


      this.setBackSettingData(sysMenu);

    },
    lcCaseInf: function (lcCaseInf) {

      if (!lcCaseInf) {
        return;
      }

      this.setCaseData(lcCaseInf);
      var keyin = JSON.parse(lcCaseInf.caseKeyinJson || '{}');

      katctbc.isCaseAgain = lcCaseInf.caseAgain == 'Y' && lcCaseInf.status == '2';

      Object.keys(keyin).sort().forEach(function (k) {
        var data = keyin[k];

        //2022/1/4 新增 若為再次製單件 且 案件狀態為2 初始第三方文件上傳
        if (katctbc.isCaseAgain) {

          var k_split = k.split('_');

          switch (k_split[0]) {
            //製單要點
            case 'katMakerIssueText':
              data = undefined;
              break;
            //第三方文件上傳
            case 'thirdPartyDocBtn':
              data = undefined;
              break;
            case 'thirdPartyDocUpload':
              data = copyJson(data.map(function(d){
                d.hint = { text: 'X' };
                d.shareWithOther = { text: 'X' };
                delete d.fileNames;
                delete d.openUpload;
                delete d.docCategory.hasDiff;
                return d;
              }));
              break;
            case 'thirdPartyDocUploadFiles':
              data = '';
              break;
            case 'checkUploadAll':
              data = keyin['thirdPartyDocUpload'].map(function (d) {
                //文件代號,放棄提示,與其他文件共用,恢復檔案上傳
                return [
                  d.docCategory.value,
                  ((d.hint || {}).value || ''),
                  ((d.openUpload || {}).value || ''),
                  ((d.shareWithOther || {}).value || '')
                ].join(',');//用有沒有hint屬性判斷是不是新增
              }).join(';');
              break;
            //版本判斷
            case 'caseNowVers':
              data = [0];
              break;
            case 'caseVer':
              data = 0;
              break;
            case 'prev':
              data = undefined;
              break;
            //審單底稿
            case 'CHK':
              data = undefined;
              break;
            case 'customerContact':
              data = undefined;
              break;
            case 'exportOP':
              data = undefined;
              break;
            case 'amlOP':
              data = undefined;
              break;
          }
        }

        keyin[k] = data
      });

      this.setBackSaveData(keyin);

      notSaveData['lcNo'] = lcCaseInf['lcno'];
      notSaveData['caseNo'] = lcCaseInf['caseNo'];

      // amlop資料
      var aml_keyin = JSON.parse(lcCaseInf.amlopKeyinJson || '{}');

      notSaveData['amlStatus'] = aml_keyin['amlStatus'];
      saveData['tradeAndFinanceCheckAML_1'] = aml_keyin['tradeAndFinanceCheckAML_1'];
      saveData['amlOP_1'] = aml_keyin['amlOP_1'];

      //初始同步欄位
      syncColumns = saveData['syncColumns'] || {};

    },
    //整理載入lc case set inf(提示文件按鈕)
    lcCaseSetInfList: function (list) {
      list = copyJson(list);
      seqList = [];//清空

      if (!list) {
        return;
      }

      var self = this;

      //排序一下
      list = this.caseSetSort(list);

      var result = [];//提示文件
      var result2 = [];//押匯申請書與匯票
      var result3 = [];//銀行模擬文件

      list.forEach(function (e) {

        var katformid = e.docNo || 'OTH';//文件代號

        var katformname = e.docName || 'OTHER';//文件名稱
        var caseSet = parseInt(e.caseSet || '1');//套
        var serialNo = e.serialNo || '';//五碼流水號 00001
        var caseNowVer = e.caseNowVer;//單據版本
        var guid = e.guid || '';//caseSetGuid
        var isMax = !e.isMax || e.isMax == 'Y';//是否為最大版
        var key = katformid + caseSet + serialNo;

        e.allKeyinData = e.allKeyinData ? JSON.parse(e.allKeyinData) : '';

        self.setCaseSetGuidKey(guid, copyJson(e));

        self.setVerGuidByKey(key, caseNowVer, isMax, guid);

        if (caseNowVer == '0' && !self.getSysMenuByValue('1004_2', katformid)) {

          //銀行模擬文件
          result3.push({
            id: 'kat' + key,
            funname: 'imgviewPDF',
            katformid: katformid,
            katformname: katformname,
            guid: guid || 'xxx',//要取第0版資料 若無取預設的
            key: key
          });

        }

        var isAppOrDft = self.getSysMenuByValue('1004_2', katformid);

        //不是最大版  (案件若未經模擬待審會需要在待製單時去存第0阪的資料)
        if (!isMax && (caseNowVer != 0 || caseData.status != '2')) {
          return;
        }

        if (!isMax && isAppOrDft) {
          return;
        }

        //最大版 
        if (isMax) {

          //版本比對用來取現在最大版版號
          katctbc.caseNowVer = caseNowVer;

          //是否可做版本比對
          compare_flag = caseNowVer > 1;
          katctbc.compare_flag = compare_flag;

          if (!katctbc.compare_flag) {//此版為第一版 隱藏比較兩版差異按鈕
            self.docWindowElement.katform[0] = [self.docWindowElement.katform[0][0]];
            self.docWindowElement.dft[0] = [];
          }

        }

        self.setBackSaveDataByKey(guid, e.allKeyinData);

        //提示文件 將下面兩個判斷往上移(for電文無提示文件)
        if (seqList.indexOf(caseSet) == -1) {
          seqList.push(caseSet);
        }

        var idx = seqList.indexOf(caseSet);//套數-1
        if (!result[idx]) {
          result[idx] = [];
        }

        //押匯申請書與匯票
        if (isAppOrDft) {
          result2.push({
            id: e.id,
            text: katformname,
            funname: 'formButton',
            formid: katformid,
            barmode: 'close',
            caseSetGuid: guid,
            caseNowVer: caseNowVer,
            serialNo: serialNo,
            key: key,
            isCust: e.isCust,
            isMax: e.isMax
          });

          Object.keys(e.allKeyinData).forEach(function (k) {
            if (k == 'edit') {
              return;
            }
            viewTemplateData[k] = e.allKeyinData[k];
          });

          return;
        }

        result[idx].push({
          id: e.id,
          katformid: katformid,//文件代號
          katformname: katformname,//文件名稱
          title: katformname,
          text: katformid,
          caseSetGuid: guid,
          caseNowVer: caseNowVer,
          caseSet: caseSet,
          isCust: e.isCust,
          serialNo: serialNo,
          key: key,
          isMax: e.isMax
        });

      });

      //2022/1/7 如果case set inf完全沒資料要做的處理
      if(result.length == 0){
        result.push([]);
        katctbc.caseNowVer = (parseInt(caseData.status) - 1);
      }

      if (seqList.length == 0){
        seqList.push(1);
      }

      //提示文件單據按鈕
      this.setFormListByPageId('tipDocFormCopy', result);//儲存最初的按鈕狀況
      this.setFormListByPageId('tipDocForm', copyJson(result));

      //模擬待審會沒有資料
      if (result2.length == 0) {
        katctbc.addApplyForms = true;//儲存時會去新增

        var sys1004_2_APP = self.getSysMenuByValue('1004_2', 'APP') || {};

        var katformid = sys1004_2_APP.cdId;
        var caseSet = 1;
        var serialNo = '0001';
        var key = katformid + caseSet + serialNo;

        var array01 = [0, katctbc.caseNowVer];

        for (var i = 0; i < (katctbc.caseNowVer + 1); i++) {

          result2.push({
            id: katformid,
            text: sys1004_2_APP.cdNm,
            funname: 'formButton',
            formid: katformid,
            barmode: 'close',
            caseSetGuid: generateUUID(),
            caseNowVer: array01[i],
            serialNo: serialNo,
            key: key,
            isCust: 'N',
            isMax: array01[i] == katctbc.caseNowVer ? 'Y' : 'N'
          });

        }

      }

      //2021/07/30修改押匯申請書與匯票讀單據資料去長出來
      this.setFormListByPageId('applyDocFormCopy', [copyJson(result2)]);
      this.setFormListByPageId('applyDocForm', [result2]);

      var makerIssueCheck = self.getBackSaveDataByKey('katMakerIssueCheck');
      if (typeof (makerIssueCheck) == 'object') {
        //如果製單要件已勾選為第三方文件上傳的文件
        makerIssueCheck.filter(function (e) {
          return (e.value == 2);
        }).map(function (e) {
          self.disabledFormByDocSer('tipDocForm', e.id);
        });
      }

      this.verGuidSuppleFirst();

      //銀行模擬文件
      this.setNotSaveDataByKey('bankDocument', self.setDocName(result3));
    },
    //排序單據資料 先依serialNo排 再把相同單據排一起
    caseSetSort: function (list) {
      //先照順序排好
      list.sort(function (a, b) {
        if (parseInt(a.caseSet) < parseInt(b.caseSet)) {
          return -1;
        }

        if (parseInt(a.serialNo) < parseInt(b.serialNo)) {
          return -1;
        }

      });
      //再把同類的加再一起
      var temp = [];

      var len = list.length;
      for (var i = 0; i < len; i++) {
        var docNo = list[i].docNo || list[i].katformid;

        var del = [];
        //同樣的先加進去
        for (var j = 0; j < len; j++) {
          var docNo2 = list[j].docNo || list[j].katformid;
          if (docNo == docNo2) {
            temp.push(list[j]);
            del.push(j);
          }

        }
        //倒著刪
        for (var k = del.length - 1; k >= 0; k--) {
          list.splice(del[k], 1);
        }

        len = len - del.length;

        i--;
      }

      return temp;
    },
    verGuidSuppleFirst: function () {
      var self = this;

      Object.keys(verGuid).forEach(function (k) {
        //如果沒有第一版資料 要去查第一套有的
        if (!verGuid[k].first) {
          var f = (self.getVerGuidByKey(k.substr(0, 4)) || {}).first;
          verGuid[k].first = f;
          verGuid[k].all[0] = f;
        }
      });
    },
    //aigoReturnJson
    aigoReturnJson: (function () {

      return function (aigoReturnJson, aigoSourceJson, lcSwiftJson) {

        if (!aigoReturnJson) {
          return;
        }

        var self = this;
        var json = JSON.parse(aigoReturnJson);

        //第三方文件上傳
        var docUpload = [];

        //1.benDocument 提示文件 單據標題欄位值
        var ben = json.benDocument;

        var new_ben = self.aigoData(ben);

        var nonOwnerDocGuid = [];//裝製單要件

        new_ben.forEach(function (b, i) {
          //取出資料的key ex:[BL][INFO_46A]
          var aigoKey = Object.keys(b)[0];

          //解析key得到文件代號 ex:BL
          var docId = self.aigoKey(aigoKey);

          //資料
          var info = b[aigoKey];

          if (info.num) {
            var t_split = (info.tabNameOfDoc || docId || '').split('@%');
            var n_split = (info.num || '').split('@%');

            (info.serialNo || '').split('@%').forEach(function (no, i) {

              docs.push({
                katformid: docId,
                text: t_split[i] || t_split[0],
                value: n_split[i] || n_split[0],
                serialNo: no,
              });

            });
            
          }

          //是否有匯票
          var sys_1004_2 = self.getSysMenuByValue('1004_2', docId);

          if (sys_1004_2) {

            var applyDocForm = self.getFormListByPageId('applyDocForm')[0] || [];

            var dft_list = applyDocForm.filter(function (f) {
              return f.formid == docId;
            });

            if (dft_list.length == 0 && katctbc.addApplyForms) {
              var sys_1004_2_katformid = sys_1004_2.cdId;
              var sys_1004_2_caseSet = '1'
              var sys_1004_2_serialNo = '0002';
              var sys_1004_2_key = sys_1004_2_katformid + sys_1004_2_caseSet + sys_1004_2_serialNo;

              var array01 = [0, katctbc.caseNowVer];

              for (var i = 0; i < (katctbc.caseNowVer + 1); i++) {

                applyDocForm.push({
                  id: sys_1004_2_katformid,
                  text: sys_1004_2.cdNm,
                  funname: 'formButton',
                  formid: sys_1004_2_katformid,
                  barmode: 'close',
                  caseSetGuid: generateUUID(),
                  caseNowVer: array01[i],
                  serialNo: sys_1004_2_serialNo,
                  key: sys_1004_2_key,
                  isMax: array01[i] == katctbc.caseNowVer ? 'Y' : 'N',
                  isCust: 'N'
                });

              }
            }
          }

        });

        docs = self.setDocName(docs);

        //申請書份數
        docs.forEach(function (o, i) {
          var table_data = {
            docId: o.text,
            num: o.value
          };
          if (docAmount[0].length < 11) {
            docAmount[0].push(table_data)
          } else {
            docAmount[1].push(table_data)
          }
        });

        //2.thirdDocument 第三方文件上傳 第三方製單要點
        var third = json.thirdDocument.concat(json.customDocument);
        var new_third = self.aigoData(third);

        var third_count = 1;

        new_third.forEach(function (t) {

          //取出資料的key ex:[BL][INFO_46A]
          var aigoKey = Object.keys(t)[0];

          //沒有名稱就不用
          if (!t[aigoKey].Name) {
            return;
          }

          //解析key得到文件代號 ex:BL
          var docId = self.aigoKey(aigoKey);

          //資料
          var info = t[aigoKey];

          //去系統選單找出對應的與...相關資訊文件代號
          var formid = self.getSysMenuByValue('1004', docId).flag02;

          var split_map = {
            'DOC INFO': info['DOC INFO'].split('@%'),
            'DOC INFO Verb': info['DOC INFO Verb'].split('@%'),
            'tabNameOfDoc': info['tabNameOfDoc'].split('@%'),
            'num': info['num'].split('@%'),
          };

          //第三方文件上傳需上傳文件
          (info.serialNo || '').split('@%').forEach(function (no, i) {

            //申請書份數
            var table_data = {
              docId: split_map.tabNameOfDoc[i] || docId,
              num: split_map.num[i]|| 1
            };
            if (docAmount[0].length < 11) {
              docAmount[0].push(table_data)
            } else {
              docAmount[1].push(table_data)
            }

            no = no || self.suppleZero(third_count++, '000');

            var name_list = info.Name.split('@%');

            docUpload.push({
              docCategory: {
                value: docId,//文件種類代號
                text: name_list[i] || name_list[0],//文件種類文字
              },
              hint: { text: 'X' },//放棄提示
              shareWithOther: { text: 'X' },//與其他文件共用
              canUpload: true,
              serialNo: no,
            });

            if (!formid) {
              return;
            }

            var new_info = {};

            var _4647 = aigoKey.indexOf('46') != -1 ? '_FROM_46' : '_FROM_47';

            Object.keys(info).forEach(function (k) {

              var data = info[k];
              if(k.toUpperCase() == 'NAME'){
                data = self.getSysMenuByValue('1004', formid).cdNm.replace($.i18n.transtale('message.replace.otherDoc'), name_list[i] || name_list[0]);
              }

              if (Object.keys(split_map).indexOf(k) != -1) {
                data = (split_map[k][i] == undefined) ? split_map[k][0] : split_map[k][i];
              }

              var new_k = k.toUpperCase().replaceAll(' ', '_') + _4647;

              new_info[new_k] = data;

            });

            formAigoData[formid + no] = Object.assign((formAigoData[formid + no] || {}), new_info);

          });

        });

        //3.customDocument
        var custom = json.customDocument;

        var new_custom = self.aigoData(custom);

        new_custom.forEach(function (c) {
          //取出資料的key ex:[BL][INFO_46A]
          var aigoKey = Object.keys(c)[0];

          //空物件就不用
          if (!c[aigoKey] || Object.keys(c[aigoKey]).length == 0) {
            return;
          }

          //解析key得到文件代號 ex:BL
          var docId = self.aigoKey(aigoKey);

          //資料
          var info = c[aigoKey];

          if (!info.guid) {
            return;
          }

          nonOwnerDocGuid.push({
            docId: docId,
            info: info
          });

        });

        //製單要件
        var result = [];

        var makerIssueCheck = self.getBackSaveDataByKey('katMakerIssueCheck');

        if (typeof (makerIssueCheck) != 'object') {//如果第一次載入才要組資料

          if (nonOwnerDocGuid.length != 0) {

            nonOwnerDocGuid.forEach(function (d) {

              var docId = d.docId;

              var sys = self.getSysMenuByValue('1004', docId);

              if (!sys) {
                return;
              }

              var info = d.info;

              var name_list = info.Name.split('@%');

              info.serialNo.split('@%').forEach(function(no, i){
                result.push({
                  id: docId + (no || ''),
                  text: name_list[i] || name_list[0],
                  funname: 'issueCheckChange',
                });
              });
   
            });

            result = self.setDocName(result, true);

          }

          self.setSaveData({ 'katMakerIssueCheck': result });

        }

        //第三方文件上傳資料初始化
        if (!self.getSaveDataByKey('thirdPartyDocUpload')) {
          self.addKeySaveData('thirdPartyDocUpload', copyJson(docUpload));

          var len = seqList.length;

          for (var j = 0; j < len; j++) {
            self.addKeySaveData('thirdPartyDocUpload_' + seqList[j], copyJson(docUpload));
          }

        }

        // 第三方文件上傳轉換第三方製單要點
        self.thirdUploadToPoint();

        //單據填寫資料初始化

        var swift_json = JSON.parse(lcSwiftJson);

        Object.keys(swift_json).forEach(function (k) {

          formAigoData[k] = swift_json[k];

        });

        var source_json = JSON.parse(aigoSourceJson);

        Object.keys(source_json).forEach(function (k) {

          var new_k = k.replace('<', '');
          new_k = new_k.replace('_50>', '');
          new_k = new_k.replace('_59>', '');
          new_k = new_k.replace('>', '');

          formAigoData[new_k] = source_json[k];

        });

        Object.keys(json).forEach(function (k) {

          if (['benDocument', 'customDocument', 'thirdDocument'].indexOf(k) != -1) {
            return;
          }

          formAigoData[k] = json[k];

        });

        //2021/11/26 如果hasBankCopy值為1C 押匯申請書份數最後加上BANK COPY
        if (json.hasBankCopy == '1C') {
          if (docAmount[0].length < 11) {
            docAmount[0].push({
              docId: 'BANK COPY',
              num: '1C'
            });
          } else {
            docAmount[1].push({
              docId: 'BANK COPY',
              num: '1C'
            });
          }
        }
        
      };
    })(),
    /**
     * 第三方文件上傳轉換第三方製單要點
     */
    thirdUploadToPoint: function () {
      var self = this;

      var formList = [];

      //僅單據模擬時的第三方上傳文件要產生第三方製單要點，故固定抓第一套的第三方上傳文件
      var upload_list = self.getSaveDataByKey('thirdPartyDocUpload_1');
      upload_list.forEach(function (u) {

        if (!u.docCategory || u.inPoint === false) {
          return;
        }

        var docId = u.docCategory.value || '';

        var serialNo = u.serialNo || '';

        //去系統選單找出對應的與...相關資訊文件代號
        var formid = (self.getSysMenuByValue('1004', docId) || {}).flag02;

        if (!formid) {
          return;
        }

        //與...相關資訊文件資料
        var sysData = self.getSysMenuByValue('1004', formid);

        //模擬單據預審
        formList.push({
          id: 'kat' + formid.replaceAll('_', '') + serialNo,
          text: sysData.cdNm.replace($.i18n.transtale('message.replace.otherDoc'), u.docCategory.text),
          katformname: u.docCategory.text,
          funname: 'formButton',
          formid: formid,
          serialNo: serialNo
        });

      });

      //固定塞FEE
      var fee = 'FEE_INFO';
      var sysData = self.getSysMenuByValue('1004', fee);
      formList.push({
        id: 'kat' + fee.replace('_', ''),
        text: sysData.cdNm,
        funname: 'formButton',
        formid: fee,
      });

      //如果為模擬單據預審 長像是提示文件的按鈕
      if (caseData.status == '1') {
        self.setFormListByPageId('thirdDocForm', [formList]);
      } else {//一般案件是旁邊的mouseover小框

        //id要補_1才會跟模擬待審存的key對到
        formList = self.setDocName(formList.map(function (f) {
          f.id = f.id + '_1';
          return f;
        }));

        self.setNotSaveDataByKey('thirdDoc', formList);
      }

    },
    //解析aigo的key值 ex:[INV][INFO_47A]、[BL][INFO_46A]
    aigoKey: function (key) {
      key = key.replaceAll(/\[/g, '');
      key = key.replaceAll(/\]/g, ' ');

      return key.split(' ')[0];
    },
    // 整理aigo資料
    aigoData: (function () {
      var must_add_doc_id = ['BEN', 'MFD', 'OTH'];
      var must_add_doc_name = ['CERTIFICATE', 'STATEMENT', 'ATTESTATION', 'CONFIRMATION', 'DECLEARATION', 'LETTER'];
      return function (data) {
        var self = this;

        var new_data = [];

        for (var i = 0; i < data.length; i++) {
          var d = data[i];

          //取出資料的key ex:[BL][INFO_46A]
          var aigoKey = Object.keys(d)[0];

          //解析key得到文件代號 ex:BL
          var docId = self.aigoKey(aigoKey);

          //資料
          var info = d[aigoKey];

          var _4647 = aigoKey.indexOf('46') != -1 ? '_46' : '_47';

          var num = 0;

          //判斷info是不是陣列
          if (typeof (info) == 'object' && Object.keys(info)[0] == '0') {
            var obj = {};

            info.forEach(function (o, i) {

              Object.keys(o).forEach(function (k) {
                if (i > 0) {

                  obj[k] = (obj[k] || '') + (o.serialNo ? '@%' : ' OR ') + (o[k] || '');
            
                } else {
                  obj[k] = o[k];
                }

              });

              obj.num = num;

            });

            d[aigoKey] = obj;
            info = obj;
          }


          if (info.guid) {

            if (info.k) {
              num += parseInt(info.k);
            }

            if (info.m) {
              num += parseInt(info.m);
            }

            if (info.n) {
              num += parseInt(info.n);
            }

            if (!info.k && !info.m && !info.n) {
              num++;
            }

          }

          if (info.numberOfDoc) {
            num = info.numberOfDoc;
          }

          //20211120惠萍說 INS DFT 固定塞2/2;20211214玉芸姊說 只有DFT固定塞2/2(下次誰說要改叫他(她)自己改)
          if (docId == 'DFT') {
            num = '2/2';
          }

          info.num = num + '';

          new_data.push(d);

          //組一下aigo資料
          if (info.serialNo) {

            var split_map = {
              'Name': info['Name'].split('@%'),
              'DOC INFO': info['DOC INFO'].split('@%'),
              'DOC INFO Verb': info['DOC INFO Verb'].split('@%'),
            };

            info.serialNo.split('@%').forEach(function (serialNo, i) {
              
              var new_info = {};

              Object.keys(info).forEach(function (k) {

                var d = info[k] || '';


                if (Object.keys(split_map).indexOf(k) != -1){
                  d = (split_map[k][i] == undefined) ? split_map[k][0] : split_map[k][i];
                }

                var new_k = k.toUpperCase().replaceAll(' ', '_') + _4647;

                new_info[new_k] = d;

              });

              formAigoData[docId + serialNo] = Object.assign((formAigoData[docId + serialNo] || {}), new_info);
            });

          }

        }

        return new_data;

      };
    })(),
    // 判斷是否讓客戶自行選擇簽發機構 return 0客戶勾選 1受益人 2第三方
    aigoSignBy: (function () {

      var benbnf = ['BEN', 'BNF'];
      var oraccept = ['OR', 'ACCEPTABLE'];
      var has_value = ['MANUFACTURER', 'SHIPPER', 'PRODUCER', 'SELLER', 'EXPORTER', 'SUPPLIER'];

      return function (info) {

        var code = 1;

        var signBy = info['SIGN BY'];

        // SIGN BY有值
        if (signBy) {

          var flag = false;//有無BEN或BNF 預設無

          for (var i = 0; i < benbnf.length; i++) {

            if (signBy.indexOf(benbnf[i]) != -1) {

              flag = true;

              for (var j = 0; j < oraccept.length; j++) {
                //如NLP<DOC_SIGNBY>顯示為非空白,且包含BEN/BNF及OR/ACCEPTABLE或""/""字串時.請由客戶選擇文件簽發人
                if (signBy.indexOf(oraccept[i]) != -1) {
                  code = 0;//客戶選
                }
              }

            }

          }

          //沒有BEN BNF
          if (!flag) {
            code = 2;//第三方

            for (var i = 0; i < has_value.length; i++) {

              if (signBy.indexOf(has_value[i]) != -1) {
                code = 0;//客戶選
              }

            }

          }

        }

        return code;
      };
    })(),
    /**
     * BILL(S) OF LADING = B(/)L
     * CERTIFICATE OF ANALYSIS = ANALYSIS CERTIFICATE = COA
     * FORWARD(')(S) CARGO (RECEIPT)=FCR
     * FORWARD(')(S) CERTIFICATE OF RECEIPT=FCR
     * INSPECTION CERTIFICATE = CERTIFICATE FOR / OF INSPECTION = INSP CERT / CERTIFICATE
     * SHIP(MENT / PING) ADVICE = ADVICE OF SHIP(MENT / PING)
     * CERTIFICATE OF ORIGIN = C / O=CO.
     * INVOICE = COMMERCIAL / PROVISIONAL / PRELIMINARY / FINAL / GOVERNMENT UNIFORM / SICHID COXRCIAL / INTERIM FOOTWEAR INVOICE(但等號後方各”/”間不同名詞不能視為同一文件)
     * AWB = (HOUSE) AIR WAYBILL(S)
     * DECLARATION OF CONFORMITY = CE = DECLARACION DE CONFORMIDAD
     * INSURANCE(POLICY)(OR / AND)(CERTIFICATE) = CERTIFICATE / CERT OF INSURANCE = INSURANCE POLICY / CERTIFICATE(POLICY及CERTIFICATE可能位置互換)
     * DRAFT = BILL(S) OF EXCHANGE
     * MANUFACTURER(')S DECLARATION =DECLARATION OF/ISSUED BY/FROM MANUFACTURER
     * DETAILED(SIGNED) PACKING(LIST / MEMO) = PACKING(LIST / MEMO)
     * TEST / INSPECTION CERTIFICATE = TEST CERTIFICATE / INSPECTION CERTIFICATE
     * LOI=LETTER OF INDEMNITY
     * IPPC STATEMENT / DECLARATION=IPPC
     * <DOC_NAME>僅差在結尾之”S”
     * @param {*} a DOC NAME
     * @param {*} b DOC NAME
     * @returns 是否為同一文件
     */
    aigoNameEqual: function (a, b) {
      var result = (a == b);

      if (result) {
        return result;
      }

      var a_code = this.getAigoName(a);
      var b_code = this.getAigoName(b);

      //若a b對應的代碼相同
      if (a_code == b_code) {

        result = true;

        var sys = this.getSysMenuByValue(a_code) || {};

        //若有設定remark a b其中一個要為對應代碼本身
        if (sys.remark) {

          if (a != code && b != code) {
            result = false;
          }

        }

      }

      return result;
    },
    /**
     * 如果字尾最後是S 去掉S
     */
    removeS: function (str) {

      if (!str) {
        return str;
      }

      var len = str.length;

      if (str[len - 1].toUpperCase() == 'S') {
        str = str.substr(0, len - 1);
      }

      return str;
    },
    /**
     * 取得對應的系統選單代碼
     * @param {*} docName 文件名稱
     * @returns 對應的系統選單代碼
     */
    getAigoName: function (docName) {
      var result = docName;

      // 1.字串去"'"、"/"
      var name = docName.replaceAll("'", "");

      //2021/11/14 換行要換成空格
      name = docName.replaceAll('\n', ' ');

      // 2.將" FOR " => "_FOR "," OF " => "_OF "
      name = name.replaceAll(' FOR ', '_FOR ');
      name = name.replaceAll(' OF ', '_OF ');

      var sys1016 = this.getBackSettingDataByKey('1016');

      // 3.用" "分割字串
      var name_split = name.split(' ');

      for (var i = 0; i < sys1016.length; i++) {

        var sys = sys1016[i];

        if (name == sys.cdId || name == sys.cdNm) {
          result = sys.cdId;
          break;
        }

        var correct_count = 0;
        for (var j = 0; j < name_split.length; j++) {
          var w = name_split[j];

          //有一個字沒對到就整個不用比對
          if (sys.aigoEqual.indexOf(w) == -1) {
            break;
          }

          correct_count++;

        }

        //每個單字都有查到
        if (correct_count == name_split.length) {
          result = sys.cdId;
          break;
        }

      }

      return result;
    },
    /**
     *  @param {*} key 
     * 駝峰轉全大寫+"_"格式
     */
    camelToUpperCase: function (key) {
      var res = [];

      for (var i = 0; i < key.length; i++) {
        var w = key[i];

        if (w.toUpperCase() == w) {
          res.push('_');
        }

        res.push(w.toUpperCase());
      }

      return res.join('');
    },
    //整理載入lc swift data資料(信用狀)
    lcSwiftData: function (lcSwiftData) {
      if (!lcSwiftData) {
        return;
      }

      var self = this;
      var result = [];

      //信用狀 
      lcSwiftData.forEach(function (data) {
        result.push({
          id: data.guid,
          text: data.uploadFileName,
          funname: 'imgviewPDF',
        });

        self.setTextDataByGuid(data.guid, data.sSwift);
      });

      this.setNotSaveDataByKey('creditLetter', result);
    },
    //歷史單據
    historyCaseList: function (historyCaseList) {
      var self = this;

      historyCaseList.forEach(function (d) {

        d.lcCaseSetList = self.setDocName(d.lcCaseSetList, true);

        var caseSets = {
          value: [],
          text: [],
          katformid: []
        };

        var list = [];

        var formList = self.getFormListByPageId('tipDocForm');
        formList.forEach(function (forms) {

          forms.filter(function (f) { return f.isMax == 'Y'; }).forEach(function (form) {

            //如果提示文件該單據是不可編輯的 歷史單據不加這一筆
            if (form.disabled) {
              return;
            }

            var cs = d.lcCaseSetList.filter(function (d) {
              if (d.docNo == form.katformid && d.caseSet == form.caseSet) {
                return true;
              }
            })[0];

            if (!cs) {
              return;
            }

            //避掉重複存的狀況
            if (self.getCaseSetGuidKey(cs.guid).guid) {
              return;
            }

            //整套匯入要用的資料
            list.push({
              a_guid: cs.guid,
              b_guid: form.caseSetGuid
            })

            cs.caseGuid = d.guid;

            self.setCaseSetGuidKey(cs.guid, cs);

            caseSets.value.push(cs.guid + '__' + cs.id);
            caseSets.text.push((cs.text || cs.docName) + '_' + self.suppleZero((seqList.indexOf(parseInt(cs.caseSet)) + 1), '00'));//顯示名稱 單據名稱 + 套數
            caseSets.katformid.push(cs.docNo);
          });
        });

        //整套匯入要用的資料
        addOldDataMap[d.guid] = list;

        caseSets.value = caseSets.value.join(',')
        caseSets.text = caseSets.text.join(',')
        caseSets.katformid = caseSets.katformid.join(',')

        d.oldCasesDocs = caseSets;

        //同一信用狀 (信用狀O 交易對手O)
        notSaveData['ocLcno'] = notSaveData['ocLcno'] || [];
        if (d.lcno == caseData.lcno && d.counterParty == caseData.counterParty) {
          notSaveData['ocLcno'].push(d);
          return;
        }


        // 同交易對手 (信用狀X 交易對手O)
        notSaveData['ocParty'] = notSaveData['ocParty'] || [];
        if (d.lcno != caseData.lcno && d.counterParty == caseData.counterParty) {
          notSaveData['ocParty'].push(d);
          return;
        }

        // 同一客戶 (信用狀X 交易對手X)
        notSaveData['ocCustomer'] = notSaveData['ocCustomer'] || [];
        notSaveData['ocCustomer'].push(d);

      });

    },
    //整理載入form set inf資料(銀行模擬文件+表單設定)
    formSetInf: function (formsetinf) {
      if (!formsetinf) {
        return;
      }

      var self = this;

      var setInf = JSON.parse(formsetinf["setInf"]);
      var ruleList = formsetinf["validatorsCode"] || [];

      setInf.dataList.forEach(function (e) {
        var katformid = e.docId || e.subList[0].subformType;

        e.designData = e.subList[0].designData;
        e.ruleList = ruleList;

        formColumns[katformid] = {};

        //欄位標籤 TODO 要分單據
        $(e.designData + ' .mcu-object').each(function (i, e) {

          var colName = $(e).attr('data-field-name') || $(e).attr('id');

          var colModel = $(e).attr('data-col-model');

          if (colModel) {

            colModel = JSON.parse(colModel);
            colModel.forEach(function (c) {

              if (!c.field) {
                return;
              }

              formColumns[katformid][c.field] = {
                label: c.display,
              };

            });

          } else {

            var isSync = $(e).find('input,textarea').attr('data-is-sync');

            formColumns[katformid][colName] = {
              label: $(e).find('label').text().replace(':', ''),
              isSync: isSync == 'Y'
            };

          }

        });

        //表單設定資料
        self.setMpsformDataById(katformid, e);

      });

      //是否為公版
      katctbc.isAllAll = (formsetinf.counterParty == 'ALL' && formsetinf.custId == 'ALL')

    },
    //規則
    mfFormSetInfRuleList: function (str) {

      var r = JSON.parse(str);

      //規則整理
      this.transRule(r.ruleList);

      console.log(r);

    },
    //其他判斷用欄位初始
    otherAttr: function () {
      var self = this;

      //案件版號
      var caseVer = this.getSaveDataByKey('caseVer') || 0;

      //如果案件狀態是 待製單 已提交預審 待客戶指示 
      status246_flag = ['2', '4', '6'].indexOf(caseData.status) != -1;
      if (status246_flag) {

        //第三方文件判斷 caseVer + 1
        caseVer++;

        saveData['editedForm'] = [];

        //預審第三方文件上傳檢查
        for (var i = 0; i < seqList.length; i++) {//看提示文件有幾套

          var has_diff = this.verCompare('thirdPartyDocBtn_' + seqList[i]).diff.length > 0;
          //如果第三方文件上傳有值 將按鈕id加入editedForm
          if (has_diff) {
            saveData['editedForm'].push('thirdPartyDocBtn_' + seqList[i]);
          }

        }

        //存各版本的caseNowVer
        saveData['caseNowVers'] = saveData['caseNowVers'] || [0];

        saveData['caseNowVers'][caseVer] = katctbc.caseNowVer;
      }

      katctbc.caseNowVers = saveData['caseNowVers'] || [0];

      //是否有前次提交
      preSubmit_flag = katctbc.caseNowVers.length > 3;
      katctbc.preSubmit_flag = preSubmit_flag;

      //存全域
      katctbc.caseVer = caseVer;

      self.addKeySaveData('caseVer', katctbc.caseVer);

      //組設定檔的欄位資料(先有key而已)
      Object.keys(katctbc.elements.forms).forEach(function (key) {

        formColumns[key] = {};

        katctbc.elements.forms[key].content.forEach(function (c) {

          c.forEach(function (ele) {

            if (!ele.dataKey) {
              return;
            }

            formColumns[key][ele.dataKey + '_1'] = {
              // label: '' 先不要給label值
            }

          });

        });

      });

    },
    //前次提交(預審)文件
    oriDocument: function (list) {
      var self = this;
      //前次提交文件(或前次預審文件)
      if (preSubmit_flag) {//要取前前一版，前前一版不可為銀行模擬初版

        notSaveData['oriDocument'] = self.setDocName(list.filter(function (cs) {
          if (cs.caseNowVer == katctbc.caseNowVer - 2 && !self.getSysMenuByValue('1004_2', cs.docNo)) {
            return true;
          }
        })).sort(function (a, b) {
          if (parseInt(a.caseSet) < parseInt(b.caseSet)) {
            return -1;
          }
        }).map(function (cs) {
          return {
            id: cs.guid,
            text: (cs.text || cs.docName) + '_' + self.suppleZero(seqList[parseInt(cs.caseSet) - 1], '00'),
            funname: 'oriCasesDocName',
            katformid: cs.docNo,
            guid: cs.guid,
            key: cs.docNo + cs.caseSet + cs.serialNo
          };
        });

      }
    },
    //案件改派歷程
    reAssignLcEventInfList: function (list) {
      notSaveData['katMakerAssignLabel'] = list.map(function (l) { return l.eventDesc; }).join(',').replaceAll('null', '');
    },
    // logo
    lcCustomerInf: function (data) {

      if (!data) {
        return;
      }

      var logo = data.logo || '';

      // 存資料到notSaveData
      notSaveData['logo'] = logo;

    },
    otherDiscrepanciesHis: function () {
      var result = [];
      var oth = saveData['otherDiscrepancies'] || [];
      oth.forEach(function (d) {
        d = copyJson(d);
        if (d.caseVer == katctbc.caseVer - 1) return;
        result.push(d);
      });
      notSaveData['otherDiscrepanciesHis'] = result;
    },
    discrepanciesDescHis: function (curVer) {
      var result = [];
      var tmp = saveData['discrepanciesDesc_edition'] || [];
      var val = '';
      tmp.forEach(function (d) {
        d = copyJson(d);
        if (d.caseVer != curVer) return;
        val = d.text;
      });
      return val;
    },
    exportAmlHis: function () {
      var result = [];

      //出口 OP
      var exp = saveData['tradeAndFinanceCheck_1'] || [];
      //AML OP
      var aml = saveData['tradeAndFinanceCheckAML_1'] || [];

      exp.forEach(function (d) {
        d = copyJson(d);
        if (d.caseVer == katctbc.caseVer - 1) return;
        result.push(d);
      });

      aml.forEach(function (d) {
        d = copyJson(d);
        if (d.caseVer == katctbc.caseVer - 1) return;
        result.push(d);
      });

      notSaveData['exportAmlHis'] = result;
    },
    exportAml: function () {
      var result = [];

      //出口 OP
      var exp = saveData['tradeAndFinanceCheck_1'] || [];
      //AML OP
      var aml = saveData['tradeAndFinanceCheckAML_1'] || [];

      var seq = 1;

      exp.forEach(function (d) {
        d = copyJson(d);
        d.seq = parseInt(d.serialNum.value) - 1;
        d.serialNum = seq++;
        result.push(d);
      });

      aml.forEach(function (d) {
        d = copyJson(d);
        d.seq = parseInt(d.serialNum.value) - 1;
        d.serialNum = seq++;
        result.push(d);
      });

      notSaveData['exportAml'] = result;

    },
    //用case set guid 把同樣文件代號的文件按鈕都disabled
    disabledFormByDocSer: function (key, docSer) {
      var formList = formListObj[key];

      $('[funname=oldCasesDocName]').katShow();
      $('[funname=oriCasesDocName]').katShow();

      formList.forEach(function (list) {
        list.forEach(function (form) {
          if (form.katformid + form.serialNo == docSer) {
            form.disabled = true;

            var key = form.katformid + form.caseSet + form.serialNo;
            setTimeout(function () {
              //要把相關的歷史單據 前次提交文件 相關的選項隱藏
              $('[funname=oldCasesDocName][id*=' + form.id + ']').katHide();
              $('[funname=oriCasesDocName][key=' + key + ']').katHide();
            }, -1);
          }
        })
      });
    },
    /**
     * 篩選出符合條件的舊件
     * @param {*} query 查詢條件
     */
    queryOldCases: function (query) {
      var self = this;

      //過濾為空的查詢條件
      Object.keys(query).forEach(function (k) {
        if (!query[k]) {
          delete query[k];
        }
      });

      var count = 0;

      var res = {
        lc: [],
        party: [],
        customer: []
      };

      // 同信用狀
      var ocLcno = notSaveData['ocLcno'] || [];
      for (var i = 0; i < ocLcno.length; i++) {

        if (count == 3) {
          break;
        }

        if (self.matchOldCaseData(ocLcno[i], query)) {
          res.lc.push(i);
          count++;
        }

      }

      // if (query.lcno == caseData.lcno) {
      //   delete query.lcno;
      // }
      // 同交易對手
      var ocParty = notSaveData['ocParty'] || [];
      for (var i = 0; i < ocParty.length; i++) {

        if (count == 3) {
          break;
        }

        if (self.matchOldCaseData(ocParty[i], query)) {
          res.party.push(i);
          count++;
        }

      }

      // 同一客戶
      var ocCustomer = notSaveData['ocCustomer'] || [];
      for (var i = 0; i < ocCustomer.length; i++) {

        if (count == 3) {
          break;
        }

        if (self.matchOldCaseData(ocCustomer[i], query)) {
          res.customer.push(i);
          count++;
        }

      }

      return res;
    },
    /**
     * 比對單筆資料是否符合query條件
     * @param {*} data 
     * @param {*} query 
     * @returns 
     */
    matchOldCaseData: function (data, query) {
      var flag = true;

      Object.keys(query).forEach(function (k) {

        if (data[k] != query[k]) {
          flag = false;
        }

      });

      return flag;
    },
    /**
     * 取得該歷史案件全部case set的 allKeyinData
     */
    getOldCaseAllKeyin: function (caseGuid) {

      var self = this;

      var res = this.sendRequest('oldKeyin', {
        caseGuid: caseGuid
      }) || {};

      if (res.code == '200') {

        Object.keys(res.caseSetGuidMap).forEach(function (caseSetGuid) {
          var data = self.getCaseSetGuidKey(caseSetGuid);
          data.allKeyinData = JSON.parse(res.caseSetGuidMap[caseSetGuid] || '{}');
        });

      }

    },
    //製單要件 儲存
    saveMpsMaker: function (isCaseAgain) {
      var self = this;
      var flag = true;

      //第三方文件上傳
      var docUpload = self.getSaveDataByKey('thirdPartyDocUpload');

      //製單要件
      var maker = self.getSaveDataByKey('katMakerIssueCheck');

      //檢核checkbox是否都有值
      katJqobject['MpsBookmark']['makerDocumentForm_makerDocument'].find('[kattype=katCheckbox]').each(function (i, e) {
        if (!$(e).attr('value')) {
          flag = false;
        }

        var docSer = $(e).attr('id');//caseSetGuid
        var type = $(e).attr('value');//文件種類代號 1:表單 2第三方文件上傳

        //更新資料
        self.updateKeySaveDataByKeyIdx('katMakerIssueCheck', i, {
          id: docSer,
          text: $(e).children().prop('textContent'),
          funname: 'issueCheckChange',
          value: type
        }, (i == 0));

        //組第三方文件上傳資料
        var len = seqList.length;
        for (var j = 0; j < len; j++) {
          var obj = {
            docCategory: {
              value: docSer.substr(0, docSer.length - 5),//文件種類代號
              text: $(e).children().prop('textContent'),//文件種類文字
            },
            hint: { text: 'X' },//放棄提示
            shareWithOther: { text: 'X' },//與其他文件共用
            canUpload: (type == 2),
          };
          if (type == 1) {
            obj.fileNames = {};
          }
          self.getSaveDataByKey('thirdPartyDocUpload_' + seqList[j]).forEach(function (item) {
            if (item.docCategory.value + item.serialNo == docSer) {
              Object.keys(obj).forEach(function (k) {
                item[k] = obj[k];
              });
            }
          });
          self.dataKeyToViewTemplate('thirdPartyDocUpload_' + seqList[j]);
        }

      });

      return flag;

    },
    //儲存
    saveCaseData: function (barcode_map) {

      var no_barcode = !barcode_map;

      barcode_map = barcode_map || {};

      Object.keys(barcode_map).forEach(function (guid) {
        saveData[guid] = saveData[guid];
      });

      var self = this;
      //要存兩種表 case form
      var caseKeyin = {};//case json inf
      var casesetinf = {};// case set inf表單填寫資料
      var addUpdList = [];//新增或更新的case set
      var delList = [];//刪除的case set

      //存上一版有編輯的單據
      if (status246_flag) {
        var edited = [];
        $('.lastedited').each(function (i, e) {
          edited.push(e.id);
        });

        saveData['editedForm'] = edited;
      }

      //從saveData取出要存的 要過濾沒有修改(katform)
      Object.keys(saveData).forEach(function (key) {

        if (!key) {
          return;
        }

        //如果欄位在notSaveData裡就不要存
        if (Object.keys(notSaveData).indexOf(key) != -1) {
          return;
        }

        var $ele = $('[dataKey=' + key + ']');

        var katType = $ele.attr('katType') || $ele.attr('data-mcutype');

        //怎麼辦:'(
        saveData[key] = ['katLabelInput', 'katTextarea'].indexOf(katType) != -1 ? $ele.eq(0).getMcuVal() : $ele.eq(0).getMcuVal() || saveData[key];

        //無值不儲存
        if (!saveData[key] || saveData[key].edit == '') {
          return;
        }

        if ($ele.attr('katType') == 'katform' || key.length > 30) {//用長度判斷key是不是guid

          casesetinf[key] = saveData[key];

        } else {

          caseKeyin[key] = saveData[key];

        }
      });

      //同步欄位要儲存
      caseKeyin['syncColumns'] = syncColumns;

      var guidList = [];//用來裝現在有的case set guid
      var removeGuidList = [];//用來裝儲存完要移掉的case set guid

      //1.申請書與匯票 新增 0版 1版
      var applyforms = self.getFormListByPageId('applyDocForm')[0];

      if (katctbc.addApplyForms) {
        katctbc.addApplyForms = false;

        applyforms.forEach(function (d, idx) {

          addUpdList.push({
            caseSetGuid: null,
            caseNowVer: d.caseNowVer == undefined ? katctbc.caseNowVer : d.caseNowVer,
            caseSet: 1,
            docNo: d.formid,
            docName: d.text,
            allKeyinData: JSON.stringify(casesetinf[d.caseSetGuid]),
            xmlKeyinData: JSON.stringify(casesetinf[d.caseSetGuid]),
            serialNo: d.serialNo,
            isCust: d.isCust || 'Y',
            isMax: d.isMax || 'Y',
            barcode: d.barcode || (barcode_map[d.caseSetGuid] || {}).barcode,
            totalPage: d.totalPage || (barcode_map[d.caseSetGuid] || {}).totalPage,
          });

          removeGuidList.push(d.caseSetGuid || d.guid);

        });


      } else {

        //2.申請書與匯票 更新 刪除
        applyforms.forEach(function (f) {

          //新的一份表單按紐的case set guid
          if (f.caseSetGuid) {
            guidList.push(f.caseSetGuid);
          } else {
            removeGuidList.push(f.guid);
          }

          var key = f.caseSetGuid || f.guid;
          // casesetinf沒有值
          if (!casesetinf[key] && no_barcode) {
            return;
          }

          //排除沒有變動的表單
          var backinData = self.getBackSaveDataByKey(key);
          var allKeyin = casesetinf[key] || backinData;
          if (backinData && no_barcode) {//後台有資料 且 無條碼資料
            //資料無變動
            if ((backinData.edit || '') == allKeyin.edit) {
              return;
            }
          }

          //判斷是add update(有caseSetGuid為update 反之為add)
          addUpdList.push({
            caseSetGuid: f.caseSetGuid || null,
            caseNowVer: f.caseNowVer == undefined ? katctbc.caseNowVer : f.caseNowVer,
            caseSet: 1,
            docNo: f.formid,
            docName: f.text,
            allKeyinData: JSON.stringify(allKeyin),
            xmlKeyinData: JSON.stringify(allKeyin),
            serialNo: f.serialNo,
            isMax: f.isMax || 'Y',
            isCust: f.isCust,
            barcode: f.barcode || (barcode_map[f.caseSetGuid] || {}).barcode,
            totalPage: f.totalPage || (barcode_map[f.caseSetGuid] || {}).totalPage,
          });
        });

        var applyforms_copy = self.getFormListByPageId('applyDocFormCopy')[0];
        applyforms_copy.forEach(function (f) {

          //此筆case set guid不存在新的表單按鈕裡 判斷為delete allKeyinData設為'{}' 
          if (!f.caseSetGuid || guidList.indexOf(f.caseSetGuid) != -1) {
            return;
          }

          delList.push({
            caseSetGuid: f.caseSetGuid || '',
            caseNowVer: f.caseNowVer || '',
            caseSet: 1,
            docNo: f.formid,
            allKeyinData: '{}',
            xmlKeyinData: '{}',
          });

        });

      }

      // 3.提示文件 新增+更新
      var forms_copy = self.getFormListByPageId('tipDocFormCopy');
      var forms = self.getFormListByPageId('tipDocForm');

      //以現在畫面上的文件按鈕比對
      forms.forEach(function (form, formIdx) {
        //先照serialNo排序
        form.sort(function (a, b) {
          if (parseInt(a.serialNo || '99999') < parseInt(b.serialNo || '99999')) {
            return -1;
          }
        }).forEach(function (f, idx) {

          //新的一份表單按紐的case set guid
          if (f.caseSetGuid) {
            guidList.push(f.caseSetGuid);
          } else {
            removeGuidList.push(f.guid);
          }

          var key = f.caseSetGuid || f.guid;
          // 原本就存在 且 casesetinf沒有值
          if (!casesetinf[key] && f.caseSetGuid && no_barcode) {
            return;
          }

          //排除沒有變動的表單
          var allKeyin = casesetinf[key] || self.getBackSaveDataByKey(key);
          var backinData = self.getBackSaveDataByKey(key);
          if (backinData && no_barcode) {//後台有資料 且 無條碼資料
            //資料無變動 20210802排除套號不變判斷 for版本比對 要用套號去對是否是同套
            if ((backinData.edit || '') == allKeyin.edit) {// && (formIdx + 1) == f.caseSet) {
              return;
            }
          }

          //判斷是add update(有caseSetGuid為update 反之為add)
          addUpdList.push({
            caseSetGuid: f.caseSetGuid || null,
            caseNowVer: f.caseNowVer == undefined ? katctbc.caseNowVer : f.caseNowVer,
            caseSet: seqList[formIdx],
            docNo: f.katformid,
            docName: f.katformname,
            allKeyinData: JSON.stringify(allKeyin),
            xmlKeyinData: JSON.stringify(allKeyin),
            serialNo: f.serialNo || self.suppleZero(idx + 1, '00000'),
            isCust: f.isCust || 'Y',
            isMax: f.isMax || 'Y',
            barcode: f.barcode || (barcode_map[f.caseSetGuid] || {}).barcode,
            totalPage: f.disabled ? -1 : (f.totalPage || (barcode_map[f.caseSetGuid] || {}).totalPage),
          });
        });
      })

      var all = self.getAllInf();

      // 4.提示文件 刪除
      //以上一次儲存文件按鈕比對 找出要刪除的文件
      forms_copy.forEach(function (copy, formIdx) {
        copy.forEach(function (f, idx) {

          //此筆case set guid不存在新的表單按鈕裡 判斷為delete allKeyinData設為'{}' 
          if (!f.caseSetGuid || guidList.indexOf(f.caseSetGuid) != -1) {
            return;
          }

          delList.push({
            caseSetGuid: f.caseSetGuid || '',
            caseNowVer: f.caseNowVer || '',
            caseSet: seqList[formIdx],
            docNo: f.katformid,
            allKeyinData: '{}',
            xmlKeyinData: '{}',
          });
        });

      })

      var casesetinfList = [];
      //先丟刪除
      delList.forEach(function (e) {
        casesetinfList.push(e);
      });
      //再丟新增和更新的
      addUpdList.forEach(function (e) {
        casesetinfList.push(e);
      });

      //最終儲存資料
      var obj = {
        caseGuid: caseData.guid,
        lcno: caseData.lcno,
        caseNo: caseData.caseNo,
        currency: $('[formid=APP] [dataKey=CURRENCY_1]').getMcuVal() || caseData.currency,
        appAmount: $('[formid=APP] [dataKey=TOTAL_AMOUNT_1]').getMcuVal() || caseData.appAmount,
        applicant: $('[data-field-name=APP_NAME_ADD]').getMcuVal() || caseData.applicant,
        caseKeyinJson: caseKeyin,
        caseSetJsonInf: casesetinfList,
        amlopKeyinJson: {
          amlStatus: notSaveData['amlStatus'],
          amlOP_1: saveData['amlOP_1'],
          tradeAndFinanceCheckAML_1: saveData['tradeAndFinanceCheckAML_1']
        },
      };

      console.log(copyJson(obj));

      //呼叫儲存
      var result = self.sendRequest('mergeCase', {
        data: btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      });

      //儲存結束後要更新資料
      caseData.caseNo = result.caseNo || caseData.caseNo;
      caseData.status = self.getSysMenuByValue('1013', caseData.status).flag02;

      //1.更新單據文件顯示按鈕資料
      casesetinfList.forEach(function (e) {
        //先把這筆有異動的移除
        all.lcCaseSetInfList = all.lcCaseSetInfList.filter(function (f) { return f.guid != e.caseSetGuid; });

        if (!e.caseSetGuid) {
          //把新的guid更新到單據資料 更新畫面已開視窗的dataKey

          var $katform = $('[dataKey=' + removeGuidList[0] + ']');

          self.setBackSaveDataByKey(result.caseSetGuidList[0], $katform.getMcuVal());

          $katform.attr('dataKey', result.caseSetGuidList[0]);

          e.caseSetGuid = result.caseSetGuidList[0];

          //更新saveData
          saveData[e.caseSetGuid] = undefined;

          removeGuidList.splice(0, 1);
        }
        result.caseSetGuidList.splice(0, 1);

        //如果是刪除就不用加回去
        if (e.allKeyinData != '{}') {
          e.guid = e.caseSetGuid;//載入時 case set guid欄位名稱是guid
          all.lcCaseSetInfList.push(e);
        }

      });

      //2.更新所有後台查詢資料
      self.setBackSaveData(copyJson(self.getSaveData()));

      self.lcCaseSetInfList(all.lcCaseSetInfList);

      status246_flag = ['2', '4', '6'].indexOf(caseData.status) != -1;

      //重長文件按鈕
      document.dispatchEvent(myEvent['buttonDataChange']);

      katctbc.isSave = true;
      katctbc.isCaseAgain = false;//儲存過就當正常案件
    },
    //同步欄位同步(先不使用
    syncColumnsSave: function () {
      // 更新連動欄位
      Object.keys(syncColumns).forEach(function (col) {
        // 欄位名稱
        var fn_list = Object.keys(saveData[key]);

        if (fn_list.indexOf(col) != -1) {
          saveData[key][col] = syncColumns[col];
        }

      });
    },
    // 更新edit屬性(停用)
    updateEdit: function (data) {

      if (!data) {
        return '';
      }

      data.edit = Object.keys(data).map(function (k) {
        var re = data[k];
        if (typeof (re) == 'object') {
          re = JSON.stringify(re);
          re = re == '{}' ? '' : re;//如果是空物件回傳空值
        }
        return re;
      }).join('%');

      return data;
    },
    //送出預審
    submitCaseData: function (lcFileList, submitMode) {
      var self = this;

      //文件有無更動
      var isEdited = 'Y';

      //2021/12/10 討論除了列印提交固定升版
      // var edited = self.getVerCompareData(true);
      // var status1 = (caseData.status == 1);
      //如果有異動 或 案件為模擬待審
      // if ((edited.length > 0 && submitMode == 'preReview') || status1) {
      //   isEdited = 'Y';
      // }
      if (submitMode == 'print') {
        isEdited = 'N';
      }

      var result = self.sendRequest(submitMode, {
        caseNo: caseData.caseNo,
        caseGuid: caseData.guid,
        caseNowVer: allInf.lcCaseSetInfList.filter(function (e) { return e.isMax == 'Y'; })[0].caseNowVer,
        isEdited: isEdited,
        submitMode: submitMode.toLowerCase(),
        lcFileList: lcFileList,
      });

      //預審成功
      if (result.code == '200') {

        if (submitMode == 'preReview') {

          self.backToQueryPage();

        } else {//列印提交

          caseData.status = '7';
          //20211124 和玉芸姊討論列印提交不升版 先註解起來
          // katctbc.caseNowVer = katctbc.caseNowVer + (isEdited == 'Y' ? 1 : 0);
        }

      }
    },
    getSysMenuByValue: function (code, value) {
      return (backSettingData[code] || []).filter(function (d) {
        return d.cdId == value;
      })[0];
    },
    getDesignData: function (data) {
      return ((data || {}).subList || []).map(function (sub) {
        var ele = document.createElement('div');
        ele.className = 'tempCss';
        ele.style.width = sub.resolution + 'px';
        ele.style.height = sub.subformHeight + 'px';
        ele.innerHTML = sub.designData;
        return ele.outerHTML;
      }).join('');
    },
    /**
     * 要預設的+流水號+設定的+新增文件
     * 
     * @returns 要產生的全部按鈕資料
     */
    getBtnList: function (data, i, defaultButton) {
      var self = this;

      var datalist = [];

      var dBtn0 = (defaultButton[0] || []).map(function (e) { return Object.assign({}, e); });

      if (dBtn0.length > 1) {
        dBtn0[1].disabled = dBtn0[1].disabled || (i == 0);//第一套
        dBtn0[1].id = dBtn0[1].disabled ? 'delMpsBtnDisa' : 'delMpsBtn';
        dBtn0[1].funname = dBtn0[1].disabled ? '_' : dBtn0[1].funname;
      }

      datalist = datalist.concat(dBtn0);

      data = self.setDocName(data);

      datalist = datalist.concat(data);

      var dBtn1 = defaultButton[1] || [];

      datalist = datalist.concat(dBtn1);
      return this.docData(datalist, i);
    },
    //設定文件按鈕展示字
    setDocName: function (data, keepText) {
      var amount = {};//key為docNo 值為屬於該docNo的單據的陣列
      var self = this;

      data.forEach(function (d) {

        var key = (d.katformid || d.docNo || d.formid || d.id);

        var l = [key];
        if (d.caseSet) {
          l.push(d.caseSet);
        }

        key = l.join('_');

        amount[key] = amount[key] || [];
        amount[key].push(d);

        if (amount[key].length > 1) {
          var name = '';
          var id_count = 1;
          amount[key].forEach(function (e, i) {
            name = d.katformid || d.docNo || d.formid || d.id;
            if (!name) {
              return;
            }

            if (e.id) {
              var str = (e.id || '').split('_')[0].replace(name, '');
              id_count = (parseInt(str) || id_count) + 1;
            } else {
              e.id = name + (id_count || '');
            }

            var t = (self.getSysMenuByValue('1004', name) || {}).flag05 || name;

            var isODI = (name == 'OTHER_DOC_INFO');

            e.text = (keepText || isODI) ? e.text : (!i ? t : t + (i + 1));

            e.num = (i + 1);//20211230 多加一個屬性給同一文件多份計數

            if (name == 'OTH') {
              e.text = e.katformname || e.text;
            }

          });
        } else {
          d.id = d.id || key;

          var t = d.katformid || d.docNo || d.formid || d.id;

          var isODI = (t == 'OTHER_DOC_INFO');

          d.text = (keepText || isODI) ? d.text : (docs.filter(function (doc) {
            return d.serialNo && (doc.serialNo || '').split('@%').indexOf(d.serialNo) != -1;
          })[0] || {}).text || (self.getSysMenuByValue('1004', t) || {}).flag05 || (self.getSysMenuByValue('1004', t) || {}).cdNm || t;

          if (t == 'OTH') {
            d.text = d.katformname || d.text;
          }

        }

      })

      return data;
    },
    docData: function (datalist, i) {
      var self = this;
      var res = [];
      datalist.forEach(function (data) {

        var id = [(data.id || data.funname || '').split('_')[0], seqList[i]].join('_');

        if (data.katType == 'div') {
          res.push({
            id: id,
            katType: data.katType,
            text: '<span class="badge badge-num">' + self.suppleZero((i + 1), '00') + '</span>',
            className: 'katBadge',
          })
        } else {
          data.id = id;

          var diff = [];

          var isLastEdited = false;

          //如果caseNowVer為0不做以下判斷
          if (katctbc.caseNowVer) {

            diff = self.verCompare(data.key || data.id, (data.caseNowVer - 1), data.caseNowVer, true).diff;

            var lastEdited = self.getSaveDataByKey('editedForm') || '';//上次案件編輯的單據
            isLastEdited = compare_flag && lastEdited.indexOf(id) != -1;//是否為上一版編輯的單據

            //用版本比對檢查是否為上一版編輯過資料
            if (!isLastEdited && status246_flag && compare_flag && data.caseNowVer && katctbc.caseNowVers[katctbc.caseVer] != katctbc.caseNowVers[katctbc.caseVer - 1]) {
              var diff2 = self.verCompare(data.key || data.id, (katctbc.caseNowVer - 2), (katctbc.caseNowVer - 1), true).diff;
              isLastEdited = diff2.length > 0;
            }

          }

          res.push({
            katType: data.katType || 'katButton',
            id: id,
            text: data.text,
            funname: data.funname || 'docButton',
            className: data.className || (diff.length > 0 ? 'btn-doc edited' : (isLastEdited ? 'btn-doc lastedited' : 'btn-doc')),
            del: data.isCust == 'Y',
            katformid: data.katformid || '',
            formid: data.formid || '',
            barmode: data.barmode || '',
            disabled: data.disabled,
            title: data.title || '',
            guid: data.caseSetGuid || data.guid,
            serialNo: data.serialNo || '',
            funtype: data.funtype || '',
            key: data.key || '',
          });

        }
      })
      return res;
    },
    /**
     * 比對所有單據 
     * @returns 有差異的單據
     */
    getVerCompareData: function (isCompareNow) {
      var self = this;
      var result = [];

      var lists = copyJson(self.getFormListByPageId('tipDocForm'));

      //匯票也納入版本比對
      var apply_lists = self.getFormListByPageId('applyDocForm')[0];
      apply_lists = apply_lists.filter(function (f) {
        return ((f.formid == 'DFT') || isCompareNow);
      });
      lists[0] = lists[0].concat(apply_lists);

      var ver = katctbc.caseNowVer - (isCompareNow ? 0 : 1);

      lists.forEach(function (list) {
        list.forEach(function (f) {
          var key = f.key || f.katformid + f.caseSet + f.serialNo;

          var vc = self.verCompare(key, ver - 1, ver);

          if (vc.diff.length > 0 || !f.key) {
            result.push({
              key: key,
              caseSet: self.suppleZero(f.caseSet || 1, '00'),
              katformname: f.text,
              value: vc.diff.map(function (d) {
                if (['DOC_TABLE', 's340-mcu-111', 's347-mcu-116'].indexOf(d.key) != -1) {
                  return [
                    { text: katctbc.msg.tableChanged, colspan: '3' },
                  ];
                }
                return [
                  {
                    text: d.label
                  }, {
                    text: d.o
                  }, {
                    text: d.n
                  },];
              }),
              form: f,
              vc: vc
            });
          }

        });
      });

      self.setNotSaveDataByKey('katVerCompareData', result);

      return result;
    },
    /**
     *
     * @param {*} key ex:INV100001
     * @param {*} a 版號(舊)
     * @param {*} b 版號(新)
     * @param {*} isSave 是否比較已儲存資料
     * @returns result 差異清單
     */
    verCompare: function (key, a, b, isSave) {
      var result = { diff: [] };
      var self = this;

      if (!key) {
        return result;
      }

      var a_data;
      var b_data;
      if (isNaN(a) || isNaN(b)) {
        a_data = (saveData['prev'] || {})[key] || { edit: '' };
        b_data = self.getSaveDataByKey(key);

        if (!b_data) {
          return result;
        }
      } else {
        var guidobj = self.getVerGuidByKey(key);

        if (!guidobj.all) {
          return result;
        }

        //取得該單據的要比較的資料guid
        var a_guid = guidobj.all[a] || guidobj.first;
        var b_guid = guidobj.all[b];

        //guid存在result
        result.a_guid = a_guid;
        result.b_guid = b_guid;

        //取得資料
        a_data = (self.getCaseSetGuidKey(a_guid) || {}).allKeyinData || {};
        b_data = (self.getCaseSetGuidKey(b_guid) || {}).allKeyinData || {};

        //如果是最大版要去看畫面有沒有新編輯的值
        if (b_guid == guidobj.max && !isSave) {
          b_data = $('[kattype*=orm][dataKey=' + b_guid + ']').getMcuVal() || b_data;
        }
      }

      var a_edit = a_data.edit || '';
      var b_edit = b_data.edit || '';

      //先看edit欄位有沒有一樣
      if (a_edit != b_edit) {

        var katformid = self.getIdFormKey(key);

        Object.keys(b_data).forEach(function (k) {

          if (k == 'edit') {
            return;
          }

          var a_val = self.switchVal(a_data[k], (k == 'EXCEL_UPLOAD'));
          var b_val = self.switchVal(b_data[k], (k == 'EXCEL_UPLOAD'));

          if (a_val != b_val) {
            var l = self.getLabelByColName(katformid, k) || (k || '').replace('_1', '');
            
            if(l.indexOf('-mcu-') != -1) {//判斷為id
              l = $.i18n.transtale('message.page.regularWord');//固定字串
            }

            result.diff.push({
              key: k,
              label: l,
              o: a_data[k] || '',
              n: b_data[k] || ''
            });
          }
        });

      }

      return result;
    },
    /**
     * 檢查表格元素的值是否為空值
     * @param {*} v 
     */
    switchVal: function (v, isExcel) {

      v = v || '';

      if (v && isExcel) {
        return 'hasExcel';
      }

      if (typeof (v) == 'object') {

        var temp = [];

        Object.keys(v).forEach(function (k) {

          //表格排除不需版本比對的值
          if (['TOTAL', 'DEFAULT'].indexOf(k) != -1) {
            return;
          }

          if (k == 'HEAD') {

            var head_units = [];
            var $head = $(v[k]);

            $head.find('input').each(function (i, e) {
              head_units.push($(e).val());
            });

            temp.push(head_units);
            return;
          }

          temp.push(v[k]);

        });

        v = temp.map(function (t) {

          var str = [];

          Object.keys(t).sort().forEach(function (k) {
            str.push(t[k]);
          });

          return str.join(',');

        }).join('').replaceAll('\n', '').replaceAll('!@#', '').replaceAll('&nbsp;', '');

      } else {
        v = v.replaceAll('\n', '');
      }

      return v;

    },
    /**
     * 取得key對應的單據編號
     * @param {*} key 
     */
    getIdFormKey: function (key) {
      if (!key) {
        return;
      }

      return key.substr(0, 3);
    },
    bookmarkData: function (settings) {
      var self = this;
      var res = [];

      //檢查是否有位勾選的信用狀未註明簽發機構的單據
      var katMakerIssueCheck = saveData['katMakerIssueCheck'];
      var flag = !!katMakerIssueCheck;
      (katMakerIssueCheck || []).forEach(function (check) {
        if (!check.value) {
          flag = false;
        }
      });

      Object.keys(settings).forEach(function (t, i) {
        res.push({
          id: t,
          katType: 'katButton',
          text: settings[t].text,
          className: (i != 0 && !flag) ? 'tab-item disabled' : 'tab-item',
          funname: 'bookmarkButton',
        });
      })
      return res;
    },
    transRule: function (ruleList) {
      var self = this;

      // 新版 整理規則 runType多個會加入重複的規則
      ruleList.forEach(function (r) {

        //觸發欄位
        var attach = ruleAttachType[r.baseRuleId];

        //特定情況的觸發欄位
        /**
         * {
         *   '0': [1],
         *   '1': [1],
         *   '2': [1, 2, 3] 假設有ruleAttachType
         * }
         */
        ['0', '1', '2'].forEach(function (r_type) {

          if (!attach || !attach[r_type]) {
            attach = attach || {};
            attach[r_type] = ruleAttachKey[r.baseRuleId] || [];
          }

        });


        Object.keys(attach).forEach(function (r_type) {
          var a_col = attach[r_type];

          a_col.forEach(function (idx) {

            //如果沒有此觸發時機
            if (r.runType.split(',').indexOf(r_type) == -1) {
              return;
            }

            var r_copy = copyJson(r);

            r_copy.runType = r_type;

            var colName = r.fieldParamList[idx - 1].paramVal;

            fieldRulesMap[colName] = fieldRulesMap[colName] || [];
            fieldRulesMap[colName].push(r_copy);

          });

        });

      });

    },
    //刪除客戶承辦人
    delCaseOfficer: function () {

      this.sendRequest('delCaseOfficer', {
        caseGuid: caseData.guid
      });

      this.backToQueryPage();
    },
    suppleZero: function (str, addstr) {
      addstr = addstr ? addstr : '00'; // 預設時間留兩位
      var newStr = addstr + str;
      return newStr.substr(newStr.length - (addstr.length));
    },
    /**
     * 送出請求 並返回結果
     * @param {*} api 設定擋對應的api key值
     * @param {*} data 傳送資料
     * @param {*} params 請求參數(有預設)
     * @param {*} noShowMsg 是否show訊息
     * @returns 
     */
    sendRequest: function (api, data, params, noShowMsg) {
      return this.ajaxController.sendRequest(this.apiUrl[api], data, params, noShowMsg);
    },
    /**
     * 回到查詢頁
     */
    backToQueryPage: function () {
      window.location.href = this.apiUrl['queryPage'].url;
    },
  };
})();

//ajax請求
var MpsAjax = function () {
  /**
   * 設定顯示在畫面的格式資料
   */
  this.viewTemplate = katctbc.elements.viewTemplate || {};
};

MpsAjax.prototype = (function () {

  return {
    /**
     * 送出請求 並返回結果
     * @param {*} api 設定擋對應的api key值
     * @param {*} data 傳送資料
     * @param {*} params 請求參數(有預設)
     * @param {*} noShowMsg 是否show訊息
     * @returns
     */
    sendRequest: function (api, data, params, noShowMsg) {
      var res;

      var a = new Date().getTime();

      myLoading(api.wording);

      var p = {
        type: 'POST',
        url: api.url,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: "application/json",
        cache: false,
        async: false,//設定為同步方法
      };

      Object.keys(params || {}).forEach(function (k) {
        p[k] = params[k];
      });

      $.ajax(p).done(function (result) {

        var b = new Date().getTime();
        console.log('API ' + api.url + ' 費時' + (b - a) / 1000 + '秒')

        res = result;

        setTimeout(function () {

          if (noShowMsg) {
            return;
          }

          if (res.code != '200') {
            $.alert(api.error);
            return;
          }

          if (res.errMsg) {
            $.alert(res.errMsg);
            return;
          }

          if (api.ok) {
            $.alert(api.ok, null, null, 'ok');
            return;
          }

        }, $('#loading_window').length > 0 ? 1000 : -1);

        setTimeout(function () {
          // $.closeLoading();
        }, 1000);

      }).fail(function (e) {
        if (noShowMsg) {
          return;
        }

        $.alert(api.error);
      });

      console.log(api.url);
      console.log(data);
      console.log(copyJson(res));

      return res;
    },
  }
})();
