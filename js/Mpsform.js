'use strict';

// 文件區塊物件
var Mpsform = function (o) {
  /**
   * 處理資料
   */
  this.service = new MpsDocService();
  /**
   * 單據編號
   */
  this.katformid = o.katformid;
  /**
   * 套數
   */
  this.caseSet = o.caseSet;
  /**
   * 流水編號
   */
  this.serialNo = o.serialNo;
  /**
   * 資料key值
   */
  this.dataKey = o.dataKey;
  /**
   * 欄位值
   */
  this.keyinData = null;
  /**
   * 是否存第0版
   */
  this.save0 = false;
  /**
   * 是否為列印模式
   */
  this.idPrintMode = o.idPrintMode;
  /**
   * 呼叫來源: 'eapp'-要保書 'illu'-建議書
   * 
   * @type {String}
   */
  this.type = o.type;

  /**
   * 客製化的該頁操作物件
   */
  this.app = o.app;

  /**
   * 設計畫面內容
   * 
   * @type {Array}
   */
  this.dataList = o.dataList;

  /**
   * 設計資料渲染到畫面前
   * 
   * @type {function}
   */
  this.beforeRender = o.beforeRender || function () { };

  /**
   * 設計資料渲染到畫面後
   * 
   * @type {function}
   */
  this.afterRender = o.afterRender || function () { };

  MpsElement.call(this, o);
  /**
   * 物件類型
   */
  this.katType = 'Mpsform';
};

Mpsform.prototype = Object.create(MpsElement.prototype);

Mpsform.prototype.constructor = Mpsform;

Mpsform.prototype = Object.assign(Mpsform.prototype, (function () {

  return {
    step1: function () {
      var self = this;

      self.dataList[0] = self.dataList[0] || self.service.getFormSetByMpsformId('OTH');

      //查詢是否有已儲存的資料
      var value = $('[dataKey=' + this.dataKey + ']').getMcuVal() || {};
      if (!value.edit) {
        //儲存的資料 <= 畫面編輯的資料 
        var data = Object.assign(copyJson(this.service.getCaseSetGuidKey(this.dataKey).allKeyinData || { edit: '' }), this.service.getSaveDataByKey(this.dataKey))
        this.keyinData = data;
      } else {
        this.keyinData = value;
      }

      //是否儲存0版
      this.save0 = !(this.keyinData && this.keyinData.edit);

      if (this.save0) {

        //欄位初始值
        //過濾規則(無規則 直接帶入 有規則執行規則) => 規則資料來源 (查系統選單) tag 或 各單據的
        Object.keys(this.service.getFormColumnsByKey(this.katformid) || this.service.getFormColumnsByKey('OTH')  || {}).forEach(function (col) {

          //只要載入時的規則
          var runType = 1;

          var rules = self.service.getRulesByKey(col, runType, ['0']);

          self.validator.validate({
            colName: col
          }, rules, runType);

        });

        this.keyinData = self.service.updateEdit(self.validator.columnVal);

      }

      self.validator.columnVal = self.keyinData;
      
      this.beforeRender();

    },
    initElementHTML: function () {
      var $html = $(this.service.getDesignData(this.dataList[0]));
      var res = [];
      var temp = [];

      $html.find('div.mcu-object,label.mcu-object').each(function (i, e) {
        temp.push({
          top: $(e).css('top').replace('px', ''),
          html: $(e).prop('outerHTML')
        })
      });

      temp.sort(function (a, b) {
        if (parseInt(a.top) < parseInt(b.top)) {
          return -1;
        }
      });

      var top = '';
      temp.forEach(function (d, i) {
        if (top != '' && d.top != top) {
          res.push('</div><div class= "tempCss" style="width:' + $html.width() + 'px;z-index:' + (temp.length - i) + ';">');
        }
        top = d.top;
        res.push(d.html);
      });

      var self = this;
      setTimeout(function () {

        self.katELement.height($html.height());

      }, -1);

      return '<div class="tempCss" style="width:' + $html.width() + 'px;z-index:' + (temp.length) + ';">' + res.join('') + '<div>';
    },
    step3: function () {

      var self = this;

      //初始化logo
      this.katELement.find('[data-mcutype=LClogo]').each(function (i, e) {
        self.initLogo($(e));
      });

      //初始化日期
      this.katELement.find('[data-mcutype=LCdate]').each(function (i, e) {
        self.initDate($(e));
      });

      //初始化表格元素
      this.katELement.find('[data-mcutype=LCdisplayGrid]').each(function (i, e) {
        self.initTable($(e));
      });

      //初始化excel元素
      this.$parent.find('[data-mcutype=LCuploadExcel]').each(function (i, e) {
        self.initExcel($(e));
      });

      this.afterRender();

      var sync = self.service.getSyncColumnsByCaseSet(self.caseSet) || {};
      //初始塞值
      this.katELement.find('.mcu-object').each(function () {
        var $ele = $(this);

        //欄位名稱
        var colName = $ele.attr('data-field-name') || $ele.attr('id') || '';

        //欄位值 第一次時是電文值 之後是儲存的值
        var v = self.keyinData[colName] || '';

        //是否有同步值
        var hasSyncVal = false;

        //連動的欄位
        if (!self.notSync) {

          var isSync = $ele.find('input,textarea').attr('data-is-sync') == 'Y';
          if (isSync && sync[colName]) {
            hasSyncVal = true
            v = sync[colName];
          }

        }
        
        if(self.idPrintMode){

          $ele.find('tr').each(function (i, e) {
            if (!$(e).is(':visible')) { $(e).remove(); }
          })
          
        }

        //預設值類型 1:電文值往後累加/2:電文值永不覆蓋/3:電文值可覆蓋
        if (self.save0 && !hasSyncVal){//如果第一次初始且這個欄位沒有同步值
          
          //如果是label元素 要先給原先輸入的值
          if (['LClabel', 'LClabelMulti'].indexOf($ele.attr('data-mcutype')) != -1) {
            v = v || $ele.html();
          }

          var defaultValType = $ele.find('input,textarea').attr('data-default-val-type') || '';

          var defaultVal = $ele.find('input,textarea').attr('data-default-val') || '';

          switch (defaultValType){
            case '1'://電文值往後累加
              v = defaultVal + v;
            break;
            case '2'://電文值永不覆蓋
              v = defaultVal;
              break;
            case '3'://電文值可覆蓋
              v = v || defaultVal;
              break;
            default: 
              if (defaultVal){
                v = defaultVal;
              }
          }

          if ($ele.attr('data-mcutype') == 'LCdisplayGrid') {

            if (!v) {

              v = v || { DEFAULT: {} };


              var colModel = $ele.attr('data-col-model');

              if (colModel) {

                colModel = JSON.parse(colModel);
                colModel.forEach(function (c) {

                  if (!c.field) {
                    return;
                  }

                  var d = self.keyinData[c.field] || '';

                  if (!d) {
                    //只要載入時的規則
                    var runType = 1;

                    var rules = self.service.getRulesByKey(c.defaultfield, runType, ['0']);

                    self.validator.validate({
                      colName: c.defaultfield
                    }, rules, runType);

                    d = self.keyinData[c.defaultfield];
                  }

                  v[c.field] = [d];

                  if (d && c.defaultfield) {
                    v.DEFAULT[c.field] = d;
                  }

                });

              }
            }

          }

        }
        
        $ele.setMcuVal(v);

      });

      if (self.save0) {
        // 要存第0版
        var first_guid = self.service.getVerGuidByKey(self.katformid + self.caseSet + self.serialNo).first;

        if (first_guid){
          self.service.addKeySaveData(first_guid, self.$parent.getMcuVal());
        }

      }

      Object.keys(this.service.getFormColumnsByKey(this.katformid) || this.service.getFormColumnsByKey('OTH') || {}).forEach(function (col) {

        //只要載入時的規則
        var runType = 1;

        var rules = self.service.getRulesByKey(col, runType, ['2']);

        if(rules.length == 0){
          return;
        }
        
        self.validator.validate({
          colName: col
        }, rules, runType);

      });

      setTimeout(function () {

        self.overlay();

      }, -1);

    },
    addEvent: function () {
      var self = this;

      //日期format
      this.katELement.on('focusout', '[data-mcutype=LCdate]', function () {
        $(this).setMcuVal(dateFormat($(this).getMcuVal()));
      });
      

      //只能輸入整數數值 I
      this.katELement.on('keyup', '[data-format-limit=I]', function(){
        self.testRegExp($(this).val(), /[^0-9]/g, $(this));
      });

      //只能輸入英數字 E
      this.katELement.on('keyup', '[data-format-limit=E]', function(){
        self.testRegExp($(this).val(), /[^\a-\z\A-\Z0-9]/g, $(this));
      });

      this.katELement.on('focusout', '[data-format-limit=E]', function(){
        self.testRegExp($(this).val(), /[^\a-\z\A-\Z0-9]/g, $(this));
      });

      //可輸入小數數值 D
      this.katELement.on('keyup', '[data-format-limit=D]', function(){
        self.testRegExp($(this).val(), /[^\d\.]/g, $(this));
      });

      //使用千分位(,)分隔 M
      this.katELement.on('keyup', '[data-format-limit=M]', function(){
        self.testRegExp($(this).val(), /[^\d\.]/g, $(this));
      });

      this.katELement.on('focusout', '[data-format-limit=M]', function(){
        $(this).val(numberWithCommas($(this).val()));
      });

      //全形提示訊息
      this.katELement.on('input', 'input,textarea', function (event) {
        //用戶點擊的
        if(event.originalEvent) {
          self.checkFullStr($(this));
        }
      });      

      //textarea
      //輸入時
      this.$parent.on('input', 'textarea', function () {
        this.style.height = 'auto';

        var $this = $(this);
        $this.attr("rows", 1);

        var scrollHeight = this.scrollHeight;

        var max_height = scrollHeight;

        var $mcu = $this.parents('[data-mcutype=LCdisplayGrid],[data-mcutype=LCtextbox]');
        var mcu_type = $mcu.attr('data-mcutype');

        var add_h = 0;
        switch (mcu_type){
          case 'LCdisplayGrid':

            function getMaxHeight($ele, className){
              var h = 0;
              var h1 = 0;
              var h2 = 0;

              $ele.parents('tr').find('textarea.firstArea').each(function (ii, ee) {
                $(ee).css('height', 'auto');
                var $secondArea = $(ee).next('.secondArea');
                var haveSecondArea = $secondArea.length > 0;
  
                if(!haveSecondArea){
                  if (h < ee.scrollHeight) {
                    h = ee.scrollHeight;
                  }
                }else{

                  if (h1 < ee.scrollHeight) {
                    h1 = ee.scrollHeight;
                  }
                  
                  $secondArea.css('height', 'auto');
                  var secH = $secondArea.get(0).scrollHeight;
                  if (h2 < secH) {
                    h2 = secH;
                  }
                }
  
              });
              return {h, h1, h2};
            }

            function setTextareaHeight($ele, heightMap){

              $ele.parents('tr').find('textarea.firstArea').each(function (ii, ee) {
                var $secondArea = $(ee).next('.secondArea');
                var haveSecondArea = $secondArea.length > 0;
                if(!haveSecondArea){
                  var haveSecondArea = $(ee).next().length > 0;
                  $(ee).css('height', heightMap.h + 5 + 'px');
                }else{
                  $(ee).css('height', heightMap.h1 + 'px');
                  $secondArea.css('height', heightMap.h2 + 'px');
                }
              });

            }

            var heightMap = getMaxHeight($this);
            heightMap = calculateHeight(heightMap.h, heightMap.h1, heightMap.h2);
            setTextareaHeight($this, heightMap);

            add_h = $this.parents('tbody').height();
            break;
          default:

            if ($mcu.height() < max_height + 2){
              add_h = max_height - $mcu.height();
              $this.css('height', max_height + 2 + 'px');
            } else {
              $this.css('height', ($mcu.height() - 2));
            }

        }
        
        var $tempCss = $this.parents('.tempCss');
        $tempCss.css('height', add_h);

      });

    },
    // 初始化logo
    initLogo: function($i){
      var logo_str = this.service.getNotSaveDataByKey('logo');

      if (logo_str){
        $i.find('.LOGOimg').html('<img width="100%" height="100%" src="data:;base64,' + logo_str + '">');
      }

    },
    // 初始化日期
    initDate: function ($d) {
      $d.find('input').attr('type', 'text');

      $d.find('input').datetimepicker({
        format: 'yyyymmdd',
        startView: 2,
        minView: 2,
        minuteStep: 10,
        autoclose: true,
        orientation: 'bottom-left',
        container: 'html',//讓datetimepicker可以將視窗對到正確位置
        forceParse: false // 手動輸入日期不強制轉成日期格式
      });
    },
    // 初始化表格元素
    initTable: function ($t) {
      //清空
      $t.find('tbody').html('');

      //+Add
      $t.on('click', 'thead .grid', function () {

        var v = $t.getMcuVal();

        Object.keys(v).forEach(function(k){
          if(['DEFAULT', 'HEAD'].indexOf(k) != - 1){
            return;
          }
          v[k].push('');

        });

        $t.setMcuVal(v);

        $t.katTrigger('change');

      });

      //-Del
      $t.on('click', 'tbody .grid', function () {
        var $table = $(this).parents('[data-mcutype=LCdisplayGrid]');

        $(this).parents('tr').find('textarea').remove();

        //要變更tfoot
        $table.setMcuVal($table.getMcuVal());

        $table.katTrigger('change');
      });

      //表格刪除單位
      $t.on('click', '.border-radius', function () {
        var $table = $(this).parents('[data-mcutype=LCdisplayGrid]');

        // input元素的高度
        var $tempCss = $(this).parents('.tempCss');
        var input_h = $table.find('input').height();
        $tempCss.css('height', ($tempCss.height() + input_h) + 'px');

        //移除所有input
        $table.find('input').remove();
        //刪除按鈕也移除
        $(this).remove();

        $table.find('.katformTextArea').katTrigger('focusout');

        var $ths = $table.find('thead tr').eq(0).find('th[rowspan!=2]');

        $ths.css('height', '45px');
        $ths.css('verticalAlign', 'bottom');
      });
    },
    // 初始化excel元素
    initExcel: (function(){

      //移除舊的上傳input 加入新的
      var removeFileFromInput = function ($parent, $input){
        $input.katShow();//防止複製隱藏的

        var $clone_input = $input[0].outerHTML;

        $input.remove();

        $parent.find('form').append($clone_input);
      };

      return function ($e) {

        var self = this;

        $e.on('change', '.form-control', function () {

          var $this = $(this);

          var form = $this.parents('form')[0];

          var file = form[0].files[0];

          if (['application/vnd.ms-excel'].indexOf(file.type) == -1) {
            removeFileFromInput($e, $this);
            $.alert(katctbc.msg.filexls);
            return;
          }

          var fn = file.name;

          var f_html = [
            '<div class="excelTable" >',
            '<img class="excelX" src="images/icon-Btnsm-Cross.svg" style="margin:0px 5px 0px 10px;cursor:pointer;">',
            '<span>' + fn + '</span>',
          ];

          $this.append(f_html.join(''));

          var res = self.service.convertExcel(form);

          if (res.code == '200') {

            f_html.push(res.html + '</div>');

            $e.setMcuVal(f_html.join(''));

          }

          //離開焦點
          var runType = 2;

          var col = $e.attr('data-field-name');

          var rules = self.service.getRulesByKey(col, runType);

          self.validator.validate({
            colName: col
          }, rules, runType);

        });

        $e.on('click', '.excelX', function () {
          var $input = $e.find('input');

          //移除舊的input 加入新的
          removeFileFromInput($e, $input);
          
          $e.setMcuVal('');

          //離開焦點
          var runType = 2;

          var col = $e.attr('data-field-name');

          var rules = self.service.getRulesByKey(col, runType);

          self.validator.validate({
            colName: col
          }, rules, runType);
        });

      }
    })(),
    testRegExp: function(v, reg, $ele){
      
      if (new RegExp(reg).test(v)) {
        v = v.replace(reg, '');
        $ele.val(v);
      }

    },
    /**
     * 取得textarea物件之文字長度
     * @param {jQueryObject} $ele textarea的jQuery物件
    */
    getTextObjWidth: function($ele){ 
      var sensor = $('<pre>'+ $ele.val() +'</pre>').css({display: 'none'}); 
      sensor.css('font-size', $ele.css('font-size'));
      $ele.after(sensor); 
      var width = sensor.width();
      sensor.remove(); 
      return width;
    },
  };
})());

var setTempCssHeight = function($ele){

  var $tempCss = $ele.parents('.tempCss');

  switch ($ele.attr('data-mcutype')){
    case 'LCdisplayGrid':
      var add_h = $ele.find('tbody').height();
      $tempCss.css('height', add_h);
      $tempCss.next().css('height', $ele.find('table').next().next().height() || 0);
      break;
  }

}