'use strict';
window.katctbc = {
  locales: {},
  initdata: function (lang) {
    katctbc = katctbc.locales[lang];

  }
};

(function () {
  if (typeof window.CustomEvent === "function") return false; //If not IE

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/**
 * 自定義事件
 */
var myEvent = {
  'buttonDataChange': new CustomEvent('buttonDataChange',{
    detail: {
      pageId: ''
    }
  }),
  'docFormRefresh': new CustomEvent('docFormRefresh',{
    detail:{
      formid: ''
    }
  })
};

$(function () {
  katctbc.initdata('zh-tw');

  //20211108 匯票要有兩份在一個畫面上
  var dft_copy = copyJson(katctbc.elements.forms.DFT.content);
  dft_copy.forEach(function (eles) {
    eles.forEach(function (ele) {

      ele.disabled = true;
      
      if (ele.dataKey) {
        ele.dataKey += '_1';
      }
      if (ele.dataKey === 'DRAFT_AT_1') {
        ele.unit = 'sight of this SECOND Bill of Exchange (FIRST UNPAID)';
      }
    });
  });
  katctbc.elements.forms.DFT.content = katctbc.elements.forms.DFT.content.concat([[{ katType: 'divider'}]]);
  katctbc.elements.forms.DFT.content = katctbc.elements.forms.DFT.content.concat(dft_copy);

  var service = new MpsDocService();


  var lcno = '';
  var caseno = '';

  console.log('lcno = ' + lcno);
  console.log('caseno = ' + caseno);
  
  var result = service.sendRequest('queryCaseInfo',{
    lcno: lcno,
    caseNo: caseno
  });
  
  if(result && result.code == '200'){
    service.allInf(result);
  }

  if (false) {
    //判斷如果根本不是這個人可以編輯的案件就導頁
    $.dialog(result.errMsg, null, null, null, 'warning', function () {

      if (!result.isYourCase) {
        service.backToQueryPage();
      }

    }, false, true);
    return;
  }

  var katdoc = new MpsBookmark({
    $parent: $('#katctbc'),
    id: 'katBookmark',
  });

  katdoc.init();

  //判斷是否儲存flag
  katctbc.isSave = true;
  //未儲存不能離開
  $('#katctbc').prevAll().each(function (i, e) {
    $(e).find('a').each(function (ii, ee) {
      
      if($(ee).attr('href') == '#'){
        return;
      }

      $(ee).attr('onClick', 'return false');

      $(ee).click(function(){

        if ((katctbc.isSave || katctbc.overlayFlag) && !katctbc.isCaseAgain) {

          window.location.href = $(ee).attr('href');

        } else {

          var fs = katctbc.popup['notSave'];

          $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {
            window.location.href = $(ee).attr('href');
          });

        }

      });
      
    });
  });

});