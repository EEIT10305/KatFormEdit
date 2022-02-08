'use strict';

/**
 * 字串轉成運算數字和符號的陣列
 * @param {*} s 字串
 * @returns
 */
var genNumMarkList = (function(){
  var res = [];

  // var m = ['+', '-', '*', '/'];
  var m = ['+', '*', '/'];
  
  var fun = function (s, idx, res) {

    if (idx >= m.length) {
      res.push(s);
      return;
    }

    if (s.indexOf(m[idx]) == -1){
      fun(s, idx + 1, res);
      return;
    }

    var arr = s.split(m[idx]);

    for (var i = 0; i < arr.length; i++) {
      
      if(i != 0){
        res.push(m[idx]);
      }

      if (new RegExp(/^[0-9]*$/).test(arr[i])) {
        res.push(arr[i]);
        // if (i < arr.length - 1) {
        //   res.push(m[idx]);
        // }

      } else {
        fun(arr[i], idx + 1, res);
      }

    }

  }

  return function (s){

    res = [];

    fun(s, 0, res);

    return res;
  };

})();

/**
 * 運算數字和符號的陣列
 * @param {*} l 數字符號的陣列 
 * @returns 
 */
function calNum(l){
  var n = 0;

  for (var i = 0; i < l.length; i++) {

    var m = l[i];

    switch (m) {
      case '+':
        n += parseFloat(l[++i]);
        break;
      case '-':
        n -= parseFloat(l[++i]);
        break;
      case '*':
        n *= parseFloat(l[++i]);
        break;
      case '/':
        n /= parseFloat(l[++i]);
        break;
      default:
        n += parseFloat(m);
    }
  }

  return n;
}

var calFormula = (function(){
  var res = [];

  var fun = function (str) {
    var idx = str.indexOf('(');
    
    if (idx == -1) {

      var l = genNumMarkList(str).filter(function (s) {
        return s;
      });

      if (l.length >= 3) {
        res.push(calNum(l));
      } else {
        res.push(str);
      }

      return;
    }
    var str0 = str.substr(0, idx);

    str = str.substr(idx + 1);

    var idx2 = str.lastIndexOf(')');

    fun(str.substr(0, idx2));

    res.push(str0[str0.length - 1]);
    
    res.push(str0.substr(0, str0.length - 1));

    res.push(str.substr(idx2 + 1));

  };

  return function (fm){
    res = [];

    fun(fm);

    return res.join('').replaceAll('-', '+-');;
  };

})();

/**
 * 判斷字串內是否包含運算符號(+ - / *)
 * @param {*} str 要判斷的字串
 * @returns 
 */
 function containsOperations(str){
  return RegExp(/[+-/*]/g).test(str);
}

/**
 * 計算表格area高度
 * @param {*} h 只有一個area時的最大高度 
 * @param {*} h1 第一個area的最大高度 
 * @param {*} h2 第二個area的最大高度 
 * @returns 
 */
 function calculateHeight(h, h1, h2){
  var result = {h, h1, h2};

  if(h1 > h2) {
    result.h2 = h1;
  } else {
    result.h1 = h2;
  }

  if(result.h1 + result.h2 > h) {
    result.h = result.h1 + result.h2;
  }else{
    result.h1 = h / 2;
    result.h2 = h / 2;
  }

  return result;
}

(function ($) {
  $.fn.getMcuVal = function () {
    var katType = this.attr('katType') || this.attr('data-mcutype');

    var result;

    switch (katType) {
      case 'label':
        return this.text();
      case 'katLabelInput':
        return this.find('input').val();
      case 'katTextarea':
        return this.find('textarea').val();
      case 'katSelect':
        return this.find('select').val();
      case 'katTreeCheckboxs':
        result = [];
        this.find('[katType=katCheckbox]').each(function (i, e) {
          result.push($(e).getMcuVal());
        });
        return result;
      case 'katCheckbox':
        result = [];
        this.find(':checkbox:checked,:radio:checked').each(function (i, ele) {
          result[i] = ele.value;
        });
        return result.join(',');
      case 'katRadio':
        return this.find(':checked').attr('value');
      case 'katDocForm':
        result = {};
        var $this = this;
        result.edit = '';
        (this.attr('columns') || '').split(',').forEach(function (key) {
          if (!key) {
            return;
          }
          var v = $this.find('[dataKey=' + key + ']').getMcuVal();
          if (v) {
            if (typeof (v) == 'object' && !v.edit) {
              return;
            }
            result[key] = v;
          }
        });
        result.edit = Object.keys(result).map(function (k) {
          var re = result[k];
          if (typeof (result[k]) == 'object') {
            re = JSON.stringify(result[k]);
            re = re == '{}' ? '' : re;//如果是空物件回傳空值
          }
          return re;
        }).join('%');
        return result;
      case 'katform':
        result = {};

        this.find('.mcu-object').each(function (i, e) {
          var v = $(e).getMcuVal();
          if (v) {
            result[$(e).attr('data-field-name') || $(e).attr('id')] = v;
          }
        });

        result.edit = Object.keys(result).map(function (k) {
          var re = result[k];
          if (typeof (result[k]) == 'object') {
            re = JSON.stringify(result[k]);
            re = re == '{}' ? '' : re;//如果是空物件回傳空值
          }
          return re;
        }).join('%');

        return result;
      case 'LClabel':
        return this.html();
      case 'LCtextbox':
        return this.find('input,textarea').val();
      case 'LCdate':
        return this.find('input').val();
      case 'LCcheckgroup':
        result = [];
        this.find('input:checked').each(function (i, e) {
          result.push($(e).attr('value'));
        });
        return result.join(',');
      case 'LCdisplayGrid':
        result = {DEFAULT: {}};

        var trs = $(this).find('tbody tr');

        var colModal = JSON.parse($(this).attr('data-col-model'));
        var count = colModal.length - 1;

        var list = [];
        trs.each(function (i, tr) {
          var flag = true;
          
          $(tr).find('textarea.firstArea').each(function (ii, t) {
            flag = false;

            list[ii] = list[ii] || [];
            var tdVal = t.value;

            var haveSecondArea = TransCase.needDivision(colModal[ii + 1].transcase);
            if(haveSecondArea){
              var secondAreaVal = $(t).next().val();
              tdVal = `${tdVal}!@#${secondAreaVal}`;
            }

            list[ii].push(tdVal);
          });

          if (flag) {
            for (var i = 0; i < colModal.length ; i++){
              list[i] = list[i] || [];
              list[i].push('&nbsp;');
            }
          }

        });


        for (var i = 1; i <= count; i++) {
          result[colModal[i].field] = list[i - 1] || [];
        }

        var idx = 0;
        $(this).find('tfoot td').each(function(i,e){
          
          var df = $(e).attr('defaultVal') || '';

          if (df){
            result.DEFAULT[colModal[i + idx - 1].field] = df
          }

          var cs = parseInt($(e).attr('colspan')) || 0;
          if (cs){
            idx += cs;
          }

        });

        //for表頭 單位
        $(this).find('thead input').each(function (i, e) {
          $(e).attr('value', e.value);
        });
        result.HEAD = $(this).find('thead').html();

        return result;
      case 'LCuploadExcel':
        return this.find('.excelTable').prop('outerHTML');
      default:
        return this.val();
    }
  };

  $.fn.setMcuVal = function (v) {
    var katType = this.attr('katType') || this.attr('data-mcutype');

    switch (katType) {
      case 'label':
        return this.text(v);
      case 'katLabelInput':
        this.find('input').val(v);
        break;
      case 'katTextarea':
        this.find('textarea').val(v);

        var t = this.find('textarea');

        setTimeout(function () {
          var h = t[0].offsetHeight;

          var s_h = t[0].scrollHeight;

          if (s_h > h) {

            t.height(s_h);

          }

        }, -1);

        break;
      case 'katSelect':
        this.find('select').val(v).change();
        break;
      case 'katTreeCheckboxs':
        this.find('[katType=katCheckbox]').each(function (i, e) {
          $(e).setMcuVal(v[i]);
        });
        break;
      case 'katCheckbox':
        this.attr('value', v)
        this.find(':checkbox,:radio').prop('checked', false);
        var value = v.split(',');
        value.forEach(function (vv) {
          this.find($.format(':checkbox[value="{0}"],:radio[value="{0}"]', vv)).prop('checked', true);
        }, this);
        break;
      case 'katRadio':
        this.find(':checked').prop('checked', false);
        if (v) {
          this.find('[value=' + v + ']').prop('checked', true);
        }
        break;
      case 'katform':
        this.find('.mcu-object').each(function (i, e) {

          var col_v = v[$(e).attr('data-field-name')] || v[$(e).attr('id')];

          if (!col_v) {
            return;
          }

          $(e).setMcuVal(col_v);
        });
        break;
      case 'LClabel':
        this.html(v);
        break;
      case 'LCtextbox':
        this.find('input,textarea').val(v);

        var $this = this;
        var t = $this.find('textarea');

        if (t.length > 0) {
          setTimeout(function () {

            t.katTrigger('input');

          }, -1);
        }

        break;
      case 'LCdate':
        this.find('input[type=text]').val(v);
        break;
      case 'LCcheckgroup':
        var vl = v.split(',');
        this.find('input').each(function (i, e) {
          $(e).attr('checked', vl.indexOf($(e).attr('value')) != -1);
        });
        break;
      case 'LCdisplayGrid':

        if (!v) {
          v = {};
        }

        var fieldTotal = {};

        var formulaMap = {};

        var secondAreaData = {};

        var colModal = JSON.parse($(this).attr('data-col-model'));
        var count = colModal.length - 1;

        for (var i = 1; i <= count; i++) {

          //公式map
          formulaMap[colModal[i].field] = colModal[i].formulaTotal;

        }

        var colnames = Object.keys(v).filter(function (colname) {
          return ['TOTAL', 'HEAD', 'DEFAULT'].indexOf(colname) == -1;
        });

        colnames.forEach(function (cn) {

          var t = {};
          var group = [];

          v[cn].forEach(function (n, i) {

            var valList =  (n || '').split('!@#');
            secondAreaData[cn] = secondAreaData[cn] || [];
            secondAreaData[cn].push(valList[1] || '');
            v[cn][i] = valList[0];

            var formula = formulaMap[cn];

            //沒有公式
            if (!formula) {
              return;
            }

            // 是否設定公式
            if (formula) {
              var f_split = formula.split(';');

              colnames.forEach(function (colname) {

                var num = (v[colname][i] || '0').replaceAll(',', '');
                f_split[0] = f_split[0].replaceAll('[' + colname + ']', num);

              });

              var str = calFormula(f_split[0]);
              var list = genNumMarkList(str);

              //有設group

              if (f_split[1]) {

                //給後面組tfoot那行用
                group = (f_split[1] || '').split('+');

                colnames.forEach(function (colname) {

                  var num = (v[colname][i] || '').replaceAll(',', '');
                  f_split[1] = f_split[1].replaceAll('[' + colname + ']', num);

                });

              }

              f_split[1] = f_split[1] || '';

              t[f_split[1]] = t[f_split[1]] || 0;

              var calculationResult = calNum(list) || parseFloat(v[cn][i].replaceAll(',', '')) || 0;

              var formatLimit = colModal.find(function (e) {
                return e.field == cn;
              })?.formatLimit || 'N';

              calculationResult = (formatLimit == 'M' ? Math.round(calculationResult * 100) / 100 : calculationResult);

              t[f_split[1]] += calculationResult;
              
              var calculationResultStr = String(calculationResult || '');

              calculationResultStr = calculationResultStr || v[cn][i];
              
              v[cn][i] = formatLimit == 'M' ? numberWithCommas(calculationResultStr) : calculationResultStr;
            }

          });

          var group_keys = Object.keys(t);

          if (group_keys.length > 0) {

            group_keys.forEach(function (g_key, idx) {

              if (t[g_key] == undefined) {
                return;
              }

              fieldTotal[cn] = fieldTotal[cn] || '';
              fieldTotal[cn] += (((idx == 0) ? '' : '<br>') + t[g_key]);

              g_key.split('+').forEach(function (g, i) {

                if (!g) {
                  return;
                }

                var g_col_name = group[i];

                if (!g_col_name) {
                  return;
                }

                g_col_name = g_col_name.replaceAll('[', '');
                g_col_name = g_col_name.replaceAll(']', '');

                fieldTotal[g_col_name] = fieldTotal[g_col_name] || '';
                fieldTotal[g_col_name] += (((idx == 0) ? '' : '<br>') + g);
              });

            });;
          }

        });

        //for表頭 單位
        if (v.HEAD) {
          $(this).find('thead').html(v.HEAD);
        }

        var values = [];

        var tfoot = ['<tr>', '<td></td>', '<td>TOTAL</td>'];
        var tftd = 0;//colModal.length - colspan = tftd

        var sayTotal = ['<div style="font-size: 12px;float: left;margin: 0px 10px 0px 55px;">SAY TOTAL</div>',
          '<div style="width:600px;font-size: 12px;float: left;">'];
        var unit_inputs = $(this).find('thead input');
        
        for (var i = 1; i <= count; i++) {
          var isMoney = (colModal[i].formatLimit == 'M');//有設千分位才是金額

          //把資料格式轉成組tbody用的
          (v[colModal[i].field] || []).forEach(function (t, j) {
            values[j] = values[j] || [];
            values[j].push(t);
          });

          //組tfoot
          if (colModal[i].formula || tftd > 0) {

            var defaultVal = (v.DEFAULT || {})[colModal[i].field] || '';

            var total_val = fieldTotal[colModal[i].field] || parseFloat(defaultVal.replaceAll(',', ''));

            total_val = Math.round(total_val*10000)/10000 || '';

            total_val = isMoney ? numberWithCommas(total_val) : total_val;

            //SAY TOTAL
            if (total_val && TransCase.needTransCase(colModal[i].transcase)) {

              var unit = unit_inputs.eq(i - 1).val();

              //如果有設轉大寫 單位才有預設
              var unit_word = isMoney ? getDollar(unit) || unit : unit;

              sayTotal.push(unit_word + ' ');
              sayTotal.push(numberToWords(total_val, !isMoney));

              //如果沒有設千分位 單位在後面
              if (!isMoney) {
                //把舊的單位刪掉
                sayTotal.splice(sayTotal.length - 2, 1);
                //再加回去
                sayTotal.push(' ' + unit_word);
              }
              sayTotal.push(' ONLY<br>');

              total_val = (isMoney ? (unit || getCurrCode()) : '') + ' ' + total_val;

            }

            if (i == 1) {
              tfoot[2] = '<td defaultVal="' + defaultVal + '" >TOTAL ' + total_val + '</td>';
              continue;
            }

            tftd++;
            tfoot.push('<td defaultVal="' + defaultVal + '" >' + total_val + '</td>')
          }
 
        }
        tfoot.push('</tr>')

        var html = [];

        values.forEach(function (vv) {
          html.push('<tr>');

          html.push('<td><button class="btn grid" style="">-</button></td>');
          vv.forEach(function () {
            html.push('<td>');
            html.push('<textarea class="katformTextArea firstArea" style="width:100%"></textarea>');
            html.push('</td>');
          });
          html.push('</tr>');

        })

        $(this).find('tbody').html(html.join(''));
        $(this).find('tfoot').html(tfoot.join(''));

        $(this).find('tbody tr').each(function (i, tr) {
          var h = 0;
          var h1 = 0;
          var h2 = 0;

          if (values[i][0] == '&nbsp;') {
            $(tr).find('textarea').remove();
            $(tr).katHide();
            return;
          }

          $(tr).find('textarea.firstArea').each(function (ii, ta) {
            $(ta).attr('rows', 1);
            $(ta).attr('data-format-limit', colModal[ii + 1].formatLimit ?? 'N');

            var formulaTotal = colModal[ii + 1].formulaTotal;
            //若公式設定之欄位其一為空值，則欄位enable
            if(containsOperations(formulaTotal)){
              var enable = colnames.some(function(fieldName){
                if(formulaTotal.indexOf(fieldName) == -1) return false;
                return v[fieldName][i] == '';
              });
              $(ta).attr('disabled', !enable);
            }

            var firstVal = values[i][ii];
            
            if(TransCase.needDivision(colModal[ii + 1].transcase)){
              $(ta).attr('data-format-limit', 'D');
              var secondVal = secondAreaData[colModal[ii + 1].field][i];
              var text = '<textarea class="katformTextArea secondArea" rows="1" style="width:100%"></textarea>';
              var $area = $(text);
              $area.val(secondVal);
              $(ta).after($area);

              if (h1 < ta.scrollHeight) {
                ta.style.height = 'auto';
                h1 = ta.scrollHeight;
              }

              var ta2 = $area.get(0);
              if (h2 < ta2.scrollHeight) {
                ta2.style.height = 'auto';
                h2 = ta2.scrollHeight;
              }
            }
            
            $(ta).val(firstVal);

            var vNoComma = (firstVal || '').replaceAll(',', '');

            if (vNoComma && colModal[ii + 1].formatLimit == 'M') {
              $(ta).css('text-align', 'right');
            }

            if (h < ta.scrollHeight) {
              ta.style.height = 'auto';
              h = ta.scrollHeight;
            }
          });

          var heightMap = calculateHeight(h, h1, h2);

          if (h != 0) {
            $(tr).find('textarea.firstArea').each(function (ii, ta) {
              var haveSecond = TransCase.needDivision(colModal[ii + 1].transcase);
              $(ta).css('height', haveSecond ? heightMap.h1 : heightMap.h + 5 + 'px');
            });
          }

          if (h2 != 0) {
            $(tr).find('textarea.secondArea').each(function (ii, ta) {
              $(ta).css('height', heightMap.h2 + 'px');
            });
          }
        });

        //加placeholder
        $(this).find('.secondArea').each(function(i, e){
          //(文字描述)
          $(e).attr('placeholder', $.i18n.transtale('message.placeholder.onlyWord'));
          //(數字計算)
          $(e).prev().attr('placeholder', $.i18n.transtale('message.placeholder.onlyNum'));
        });

        $(this).find('tfoot td').eq(1).attr('colspan', colModal.length - tftd - 1);
        $(this).find('tfoot td').eq(1).css('textAlign', 'left');

        //SAY TOTAL
        $(this).find('div').remove();

        if (sayTotal.length == 2){
          sayTotal = [];
        }
        $(this).append(sayTotal.join(''));

        setTempCssHeight($(this));

        break;
      case 'LCuploadExcel':

        this.width('calc(100% - ' + this.css('left') + ' - 4px)');

        this.find('.excelTable').remove();

        this.append(v);

        var $t = this.find('table');

        var $tempCss = this.parents('.tempCss');
        var h = 0;

        if ($t.length) {

          h = $t.height();

          this.find('form input').katHide();

          $t.width('100%');
          
        }

        $tempCss.height(h);

        setTimeout(function () {
          var $tempCss_parent = $tempCss.parent();
          $tempCss_parent.height($tempCss_parent.height() + h);
        }, -1);

        break;
      default:
        this.val(v);
    }
  };

  $.fn.disableMcu = function () {
    var katType = this.attr('katType') || this.attr('data-mcutype');

    switch (katType) {
      case 'katLabelInput':
        this.find('input').attr('disabled', true);
        break;
      case 'katCheckbox':
        this.find('input').attr('disabled', true);
        break;
      case 'katform':
        this.find('.mcu-object').each(function (i, e) {
          $(e).disableMcu();
        })
        break;
      case 'LCtextbox':
        this.find('input,textarea').attr('disabled', true);
        break;
      case 'LCdate':
        this.find('input').attr('disabled', true);
        break;
      case 'LCcheckgroup':
        this.find('input').attr('disabled', true);
        break;
      case 'LCdisplayGrid':
        this.find('button,input,textarea').attr('disabled', true);
        break;
      case 'LCuploadExcel':
        this.find('input').attr('disabled', true);
        break;
      default:
        this.attr('disabled', true);
    };
  };

  $.fn.addMpsClass = function (className) {
    this.addClass(className);
  }

  $.fn.removeMpsClass = function (className) {
    this.removeClass(className);
  }

  $.fn.katShow = function () {
    this.show();
  }

  $.fn.katHide = function () {
    this.hide();
  }

  $.fn.katToggle = function (flag) {
    if (flag == undefined) {
      this.toggle();
    } else {
      this.toggle(flag);
    }
  }

  $.fn.katTrigger = function (eventName) {
    this.trigger(eventName);
  }

})($);

$.alert = function () {

}

class TransCase {
  static Type1 = '1';
  static Type2 = '2';
  static Type3 = '3';
  static Type4 = '4';

  static needTransCase(type){
    return [this.Type2, this.Type4].indexOf(type) > -1;
  }

  static needDivision(type){
    return [this.Type3, this.Type4].indexOf(type) > -1;
  }
}