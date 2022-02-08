'use strict';

/**
 * 表單驗證規則
 */
var mappKeyinValidators = function (o) {
  /**
   * 處理資料
   */
  this.service = new MpsDocService();
  /**
   * 頁面單據物件
   */
  this.doc = o.doc;
  /**
   * 單據代碼
   */
  this.docId = o.docId || '';
  /**
   * 流水編號
   */
  this.serialNo = o.serialNo || '';
  /**
   * 儲存欄位值
   */
  this.columnVal = {};
};

/**
 * 執行規則
 * @param {jquery object} field 欲驗證欄位物件
 * @param {Array} rules 該欄位綁定規則清單
 * @param {String} eventType 欄位觸發型態 0:換頁,1:卡片顯示時,2:欄位值變更時
 * @param {Object} eventData 觸發時其他資料
 */
mappKeyinValidators.prototype.validate = function (field, rules, eventType, eventData) {

  var self = this;

  //查tag 沒有的話直接傳欄位名稱
  var colName = field.colName;

  var aigo_data = this.getAigo(colName);

  var eventData = Object.assign(eventData || {}, {
    eventType: eventType,
  });

  field.aigo = aigo_data || '';

  if (rules.length == 0 && field.aigo) {
    self.setColumnVal(field.$mcu, field.aigo, field.colName);
    return;
  }

  rules.forEach(function (rule) {

    //規則引擎
    var rule_id = rule.baseRuleId;

    //參數轉換
    var rule_params = self.fillandCheckParameters(field, rule);

    //規則執行
    self[rule_id](field, rule_params.data, eventData);

  });

}

/**
 * 取得aigo的資料
 */
mappKeyinValidators.prototype.getAigo = function (colName) {

  var sys = this.service.getSysMenuByValue('1010', colName) || {};

  var tag_name = sys.cdNm || colName;

  return this.service.getAigoData(this.docId + this.serialNo, tag_name);

}

/**
 * 檢查規則參數如為欄位檢查是否在畫面上並取得欄位值
 * @param {Object} rule -欄位設定規則
 * @param {Number} len -規則參數個數
 */
mappKeyinValidators.prototype.fillandCheckParameters = (function () {

  var params = [];
  var result = true;

  return function (field, rule) {

    var self = this;

    var $doc = self.doc.katELement;

    result = true;

    params = rule.fieldParamList.map(function (f) {

      var pType = f.paramType;

      var pVal = f.paramVal;

      var obj = {
        paramType: pType,
        colName: pVal,
        field: field,
        $mcu: $doc ? $doc.find('[data-field-name=' + pVal + '],[dataKey=' + pVal + '_1]') : null,
      };

      obj.value = self.getColumnVal(obj.$mcu, pVal) || (pType == '1' ? null : pVal);

      if (pType == '1') {

        //欄位標籤
        var colLabel = self.service.getLabelByColName(self.docId, pVal);
        obj.colLabel = colLabel;

      }

      //查對應的aigo欄位名稱 取得aigo資料
      var sys = self.service.getSysMenuByValue('1010', pVal) || {};
      var tag_name = sys.cdNm || pVal;
      var aigo_data = self.service.getAigoData(self.docId + self.serialNo, tag_name);

      obj['aigo'] = aigo_data || '';

      return obj;

    });

    return {
      data: params,
      success: result
    };

  };
})();

/**
 * 設定值
 */
mappKeyinValidators.prototype.setColumnVal = function ($ele, v, colName) {

  if ($ele && $ele.length > 0) {
    $ele.setMcuVal(v);
  } else {
    this.columnVal[colName] = v;
  }

}

/**
 * 取得值
 */
mappKeyinValidators.prototype.getColumnVal = function ($ele, colName) {

  if ($ele) {
    return $ele.getMcuVal();
  } else {
    return this.columnVal[colName];
  }

}

/**
 * 觸發
 */
mappKeyinValidators.prototype.triggerColumn = function ($ele, eventName) {

  if ($ele) {
    $ele.katTrigger(eventName);
  } 

}

/**
 * 日期format
 * @param {*} str 
 */
function dateFormat(str, delimiter) {
  
  if(!str){
    return '';
  }

  delimiter = delimiter || '';
  str = str.replaceAll('/', '');
  var val = str.substr(0, 4) + delimiter + suppleZero(str.substr(4, 2)) + delimiter + suppleZero(str.substr(6));

  return val;
}

function suppleZero(str, addstr) {
  addstr = addstr ? addstr : '00'; // 預設時間留兩位
  var newStr = addstr + str;
  return newStr.substr(newStr.length - (addstr.length));
}

/**
 * 數字轉數字格式
 * @param {*} x 
 * @returns 
 */
var numberWithCommas = function (x) {

  var new_x = ('' + x).replace(',', '');

  if (new_x && !new RegExp(/[^\d\.]/g).test(new_x)) {

    var new_x_split = new_x.split('.');

    new_x_split[0] = parseFloat(new_x_split[0]).toLocaleString('en-US');

    return numSuppleDecimal(new_x_split.join('.'));
  }

  return x;
}

/**
 * 數字補小數位數
 * @param {*} num 
 */
var numSuppleDecimal = function (num) {
  num = num + '';

  //取案件幣別
  var service = new MpsDocService();
  var curr = service.getAigoData('', 'currCode');
  var sys1017 = service.getSysMenuByValue('1017', curr) || { flag02: '' };

  var num_split = num.split('.');

  if (sys1017.flag02 == 'Y') {
    num = num_split[0];
  } else {
    num_split[1] = ((num_split[1] || '') + '00').substr(0, 2);
    num = num_split.join('.');
  }

  return num;
};

/**
 * 取幣別轉大寫
 * @returns 幣別
 */
var getDollar = function(code){
  
  var service = new MpsDocService();
  var sys1017 = service.getSysMenuByValue('1017', code || getCurrCode()) || { flag01: '' };

  return sys1017.flag01;
};

/**
 * 取案件幣別
 * @returns 幣別
 */
var getCurrCode = function(){
  //取案件幣別
  var service = new MpsDocService();
  return service.getAigoData('', 'currCode');
}

// 之後當成範例
/**
 * 測試
 * @param {katObject} field 觸發的那個欄位物件
 * @param {Object} params 規則參數
 * @param {Object} eventData
 */
mappKeyinValidators.prototype.TEST = function (field, params, eventData) {
  //取值
  //給值
  var aigo = params[0].aigo;
  this.setColumnVal(field.$mcu, dateFormat('20' + aigo), field.colName);

  //錯誤訊息
  return new ResultObject();

};

ruleAttachKey['TEST'] = [1];

/**
 * 驗證結果
 */
var ResultObject = function () {
  /**
   * 驗證是否成功
   */
  this.success = true;
  /**
   * 錯誤訊息
   */
  this.msg = '';

  /**
   * 是否允許上傳文件
   */
  this.avalible = true;
};
/**
 * 驗證錯誤並且錯誤訊息
 * @param {String} msg -錯誤訊息
 */
ResultObject.prototype.setFailure = function (msg, avalible) {
  this.success = false;
  this.msg = msg || '';
  this.avalible = avalible || true;
  return this;
};

/**
 * 驗證成功出現提示訊息
 */
ResultObject.prototype.setMsg = function (msg) {
  this.success = true;
  this.msg = msg || '';
  this.avalible = false;
  return this;
};

var numberToWords = (function () {

  var th = ['', 'thousand', 'million', 'billion', 'trillion'];
  var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  var toWords = function (s) {

    //字串處理
    s = s.replace(/[\, ]/g, '');

    if (s != parseFloat(s)) return '';
    var x = s.indexOf('.');
    if (x == -1)
      x = s.length;
    if (x > 15)
      return '';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      } else if (n[i] != 0) { // 0235
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 == 0) str += 'hundred ';
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk)
          str += th[(x - i - 1) / 3] + ' ';
        sk = 0;
      }
    }

    return str.replace(/\s+/g, ' ').toUpperCase();
  };

  return function (n, isP) {
    var str = numSuppleDecimal(n);

    var str_split = str.split('.');

    //如果非金額 小數位後一個數字一個數字翻譯
    if(isP){
      var array = [];
      var str_split1 = str_split[1] || '';
      
      for (var i = 0; i < str_split1.length ; i++){
        if (i == 1 && str_split1[i]== '0'){
          continue;
        }
        array.push(toWords(str_split1[i]));
      }

      str_split[1] = array.join(' ').trim();
    }

    return str_split.map(function (s) {
      return toWords(s) || s;
    }).filter(function(s){
      return s && s != '00';
    }).join(isP ? 'POINT ' : 'AND CENTS ');//CENTS後面要有空格

  };

})();