'use strict';

var katJqobject = {};
var katEventobject = {};

/**
 * Object.assign() polyfill for IE11
 * @see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign>
 */
if (typeof Object.assign != "function") {
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) {
      "use strict";
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

//母物件
var MpsElement = function (o) {
  /**
  * 設計畫面要放置的div元素
  * @type {jQueryObject}
  */
  this.$parent = o.$parent;
  /**
   * 物件id
   */
  this.id = o.id;
  /**
   * 物件類型
   */
  this.katType = 'MpsElement';
  /**
   * 物件屬性 
   */
  this.attrMap = o.attrMap || {};
  this.attrMap.id = o.id || '';
  this.attrMap.className = o.className || '';
  /**
   * 物件jquery
   */
  this.katELement = null;
  /**
   * 處理資料用
   */
  this.service = new MpsDocService();
  /**
   * form設定資料 katctbc.elements.forms
   */
  this.formSettings = o.formSettings || katctbc.elements.forms;
  /**
   * 規則物件
   */
  this.validator = new mappKeyinValidators(
    {
      doc: this,
      docId: o.katformid || o.formid,
      serialNo: o.serialNo
    });
  /**
   * 強制重帶資料
   */
  this.forceAigoData = !!o.forceAigoData;
  /**
   * 是否關掉連動
   */
  this.notSync = (!!o.notSync || katctbc.overlayFlag);
};

var debugid = ''
MpsElement.prototype = (function () {
  //私有方法定義區
  return {
    init: function () {
      var a = new Date().getTime();

      if (['MpsDocsWindow'].indexOf(this.katType) != -1) {
        myLoading(katctbc.msg.page);
      }

      this.step1();
      this.step2();
      this.step3();
      //綁事件
      this.addEvents();

      var b = new Date().getTime();

      if (['MpsDocsWindow'].indexOf(this.katType) != -1) {
        setTimeout(function () {
          // $.closeLoading();
        }, 500);
        console.log('組 ' + this.katType + ' 畫面費時' + (b - a) / 1000 + '秒')
      }

    },
    step1: function () { },
    /**
     * 塞畫面 初始化各query物件
     */
    step2: function () {
      //塞畫面
      this.katELement = this.initElement();
      if (this.$parent) {
        this.$parent.append(this.katELement);
        this.katELement = this.$parent.children().last();
      }

      this.step2_2();

      if (katctbc.overlayFlag) {
        this.katELement.find('.overlayFlag:not(.overlay)').katHide()
      }
    },
    step2_2: function () {
      //取物件
      var self = this;

      katJqobject[self.katType] = katJqobject[self.katType] || {};

      var katTypeObj = katJqobject[self.katType];

      var obj = katTypeObj[self.formid] || katTypeObj;

      Object.keys(obj).forEach(function (id) {
        if (!id || obj[id]) {
          return;
        }
        obj[id] = $('#' + id);

        katEventobject[self.katType] = katEventobject[self.katType] || {};
        katEventobject[self.katType][id] = {};

      });
    },
    //加遮罩
    overlay: function () {

      var h = this.$parent.children().height() || 0;

      var eles = this.$parent.find('.tempCss');
      eles.each(function (i, e) {
        h += $(e).height();
      });

      if (h < this.$parent.height()) {
        h = this.$parent.height();
      }

      this.katELement.append(this.createMpsElement({
        katType: 'div',
        className: 'overlay overlayFlag',
        height: h + 'px',
        display: katctbc.overlayFlag ? 'block' : 'none'
      }));

      this.katELement.css('position', 'relative');

      if (katctbc.overlayFlag) {
        this.showOverlay(this.katELement);
      }

    },
    showOverlay: function ($ele) {
      var $inputs = $ele.find('.form-control');

      $inputs.css('position', 'relative');
      $inputs.css('z-index', '-1');
      $inputs.css('background', 'rgba(0, 0, 0, 0)');

      //表格元素外層的tempCss如果不設0 表格會沒被遮罩遮住
      $ele.find('table').parents('.tempCss').css('z-index', '0');

      //表格head單位 z-index需設定為0，防止被遮罩蓋住
      $ele.find('[data-mcutype=LCdisplayGrid] > table > thead').each(function (i, e) {
        $(e).find('.form-control').css('z-index', '0');
      });

      //擋掉按label可編輯的情境
      $ele.find('label').attr('for', '');
      
    },
    step3: function () { },
    refresh: function () {
      this.$parent.html('');
      this.init();
    },
    addEvents: function () {
      var self = this;

      katJqobject[self.katType] = katJqobject[self.katType] || {};

      var katTypeObj = katJqobject[self.katType];

      var obj = katTypeObj[self.formid] || katTypeObj;

      //綁一些基礎事件
      Object.keys(obj).forEach(function (id) {
        var $ele = obj[id];

        if ($ele && $ele.attr('funname')) {
          //事件預設為click
          ($ele.attr('funevent') || 'click').split('_').forEach(function (en) {
            if (self.__proto__[$ele.attr('funname')] == null) {
              return;
            }

            if (katEventobject[self.katType] && katEventobject[self.katType][id] && katEventobject[self.katType][id][en]) {
              return;
            } else {
              katEventobject[self.katType] = katEventobject[self.katType] || {};
              katEventobject[self.katType][id] = katEventobject[self.katType][id] || {};
            }

            katEventobject[self.katType][id][en] = self.__proto__[$ele.attr('funname')];
            //如果事件名稱為onload則立即執行
            if (en == 'onload') {
              self.__proto__[$ele.attr('funname')](null, self, $ele);
              return;
            }

            if ($ele.attr('id') == debugid) {
              console.trace(debugid);
            }

            $ele.on(en, function (e) {
              self.__proto__[$ele.attr('funname')](e, self, $(this));
            });
          });
        }

        //select2元素初始化
        if ($ele.prop('tagName') == 'SELECT') {
          $ele.data('placeholder', $ele.attr('placeholder')).select2({
            allowClear: true,
            minimumResultsForSearch: -1,
          });

          $ele.find('option').eq(0).remove();

          //初始化觸發事件
          $ele.katTrigger('change');
        } else if ($ele.parent().parent().attr('katType') == 'katDate') {//日期元素初始化

          $ele.datetimepicker({
            format: 'yyyymmdd',
            // language: '$.i18n.datetimepickerLocale',
            startView: 2,
            minView: 2,
            minuteStep: 10,
            autoclose: true,
            orientation: 'bottom-left',
            container: 'html',//讓datetimepicker可以將視窗對到正確位置
            forceParse: false // 手動輸入日期不強制轉成日期格式
          }).on('show', function () {
            $(this).parents('.katBlockDiv').attr('show', true);
          }).on('hide', function () {
            $(this).parents('.katBlockDiv').attr('show', false);
          });

        }

        self.addFullStrEvent($ele);
      });
      this.addEvent();
    },
    addEvent: function () { },
    initElement: function () {
      var $div = this.createMpsElement(Object.assign({ katType: 'div' }, this.attrMap));
      $div.html(this.initElementHTML());
      return $div;
    },
    initElementHTML: function () {
      return '';
    },
    /**
     * 創建元素
     * @param {*object} attrMap 元素設定資料
     */
    createMpsElement: function (attrMap) {
      var $ele = null;
      var self = this;
      var flag = true;
      switch (attrMap.katType) {
        case 'katDocs':
          setTimeout(function () {//等畫面長完 再init(init 主要是存jquery物件)
            var katTipDocs = new MpsDocs({
              $parent: katJqobject[self.katType][attrMap.id],
              defaultButton: attrMap.defaultButton,
              pageId: attrMap.id.split('_')[0],
              id: attrMap.id + '_div',
              windowsDiv: self.windowsDiv,
              box: attrMap.box
            });
            katTipDocs.init();
          }, -1);
          $ele = self.createMpsElement({ katType: 'div', id: attrMap.id });
          flag = false;
          break;
        case 'katDocForm'://表單元素
          setTimeout(function () {//等畫面長完 再init(init 主要是存jquery物件)
            var katDocForm = new MpsDocForm({
              $parent: katJqobject[self.katType][attrMap.id] || $('#' + attrMap.id),
              formid: attrMap.formid,
              btnid: attrMap.btnid,
              windowsDiv: self.windowsDiv,
              dataKey: attrMap.dataKey,
              serialNo: attrMap.serialNo,
              notSync: attrMap.notSync
            });
            katDocForm.init();
          }, -1);
          $ele = self.createMpsElement({ katType: 'div', id: attrMap.id });
          break;
        case 'katform':
          setTimeout(function () {//等畫面長完 再init(init 主要是存jquery物件)
            var katform = new Mpsform({
              $parent: katJqobject[self.katType][attrMap.id] || $('#' + attrMap.id),
              katformid: attrMap.katformid,
              caseSet: attrMap.caseSet,
              serialNo: attrMap.serialNo,
              dataKey: attrMap.dataKey,
              dataList: [attrMap.set],
              beforeRender: function () {
                console.log('before redner');
              },
              afterRender: function () {
                console.log('after redner');
              },
              notSync: attrMap.notSync,
              idPrintMode: attrMap.idPrintMode
            });
            katform.init();

          }, -1);
          $ele = self.createMpsElement({ katType: 'div', id: attrMap.id });
          break;
        case 'greenHead'://綠底表頭
          $ele = self.createMpsElement({ katType: 'div', className: 'box-title' });
          break;
        case 'katUl'://list長相
          $ele = self.createMpsElement({ katType: 'div' });
          var isFilled = (attrMap.className == 'katUlGreen');
          $ele.append(self.createMpsElement({ katType: 'figure', className: isFilled ? 'cirlce cirlce-lv4' : 'cirlce cirlce-lv5' }));
          $ele.append(self.createMpsElement({ katType: 'span', text: attrMap.text }));
          delete attrMap.text;
          break;
        case 'katUls':
          $ele = self.createMpsElement({ katType: 'div' });
          $ele.append(self.createMpsElement({ katType: 'katUl', text: attrMap.text, className: 'katUlGreen' }));
          (attrMap.value || []).forEach(function (d) {
            $ele.append(self.createMpsElement({
              id: d.id,
              katType: 'katUl',
              text: d.text,
              funname: d.funname,
              className: 'katUlWhiteGreen',
              imgguid: d.imgguid,
              mode: d.mode,
              katformid: d.katformid,
              formid: d.formid,
              guid: d.guid,
              key: d.key,
              disabled: d.disabled,
              serialNo: d.serialNo
            }));
          });
          delete attrMap.text;
          break;
        case 'divider'://分隔線
          $ele = self.createMpsElement({ katType: 'div', className: 'katDivider' });
          break;
        case 'katDate'://日期
          $ele = self.createMpsElement({
            katType: 'div',
            width: attrMap.width,
            margin: attrMap.margin,
            display: 'flex',
          });

          delete attrMap.margin;
          attrMap.width = '100%';
          attrMap.katType = 'katLabelInput';
          attrMap.margin = '0px';
          $ele.append(self.createMpsElement(attrMap));

          if (attrMap.hasIcon) {
            $ele.append(self.createMpsElement({
              katType: 'img',
              src: 'calendar',
              className: 'katCalendarSvg',
            }));
          }

          attrMap = { katType: 'katDate' };

          break;
        case 'katTextarea':
          $ele = self.createMpsElement({
            katType: 'div',
            className: attrMap.className || 'katTextArea'
          });

          if(attrMap.label){
            var $label = self.createMpsElement({
              katType: 'label',
              text: attrMap.label,
              width: attrMap.labelWidth
            });
            $ele.append($label);
          }          

          var $textarea = self.createMpsElement({
            katType: 'textarea',
            value: attrMap.value,
            textAlign: attrMap.textAlign,
            disabled: attrMap.disabled,
            height: attrMap.areaHeight,
            id: attrMap.id,
            funevent: attrMap.funevent,
            funname: attrMap.funname,
          });

          $ele.append($textarea);

          delete attrMap.textAlign;
          delete attrMap.id;
          delete attrMap.funevent;
          delete attrMap.funname;
          break;
        case 'katTable':
          var formCaseVer = self.$parent.attr('caseVer') || '';
          $ele = self.createMpsElement({
            katType: 'table',
            className: (attrMap.className || 'katTableStyle'),
            caseVer: formCaseVer,
            skipGetVal: !!attrMap.skipGetVal//此欄位不可用getMcyVal方法取值
          });
          
          if(attrMap.cssSerial == true) {
            $ele.addClass('katTableCssSerial');
          }
          var $trh = self.createMpsElement({ katType: 'tr' });
          attrMap.thead.forEach(function (h) {
            var $td = self.createMpsElement({
              katType: 'td',
              width: h.width || '',
              colspan: h.colspan || '',
              rowspan: h.rowspan || '',
              borderRight: h.borderRight || '',
              bg: h.bg || '',
            });

            delete h.width;
            delete h.colspan;
            delete h.rowspan;
            delete h.borderRight;
            delete h.background;

            h.katType = h.katType || 'label';
            $td.append(self.createMpsElement(h));
            $trh.append($td);
          });
          var $thead = self.createMpsElement({ katType: 'thead' });
          $thead.append($trh);
          $ele.append($thead);

          var $tbody = self.createMpsElement({ katType: 'tbody' });
          (attrMap.tbody || attrMap.value || []).forEach(function (data) {
            var $tr = self.createMpsElement({ katType: 'tr' });
            if(attrMap.cssSerial == true) {
              var $td = self.createMpsElement({ katType: 'td' });
              $tr.append($td);
            }
            data.forEach(function (d) {
              if(d.katType == 'none') {
                if(d.key == 'caseVer') {
                  var dCaseVer = parseInt(d.text);
                  if((attrMap.showHis == false && dCaseVer != katctbc.caseVer - 1)
                    || (attrMap.showCur == false && dCaseVer != attrMap.curVer)) {
                	  $tr.css('display', 'none');
                  }
                }
                return;
              }
              var $td = self.createMpsElement({
                katType: 'td',
                width: d.width || '',
                colspan: d.colspan || '',
                rowspan: d.rowspan || '',
                borderRight: d.borderRight || '',
                background: d.background || '',
              });

              delete d.colspan;
              delete d.rowspan;
              delete d.borderRight;
              delete d.background;

              d.katType = d.katType || 'label';
              d.width = d.katType == 'katSelect' ? '100%' : '';
              $td.append(self.createMpsElement(d));
              $tr.append($td);
            });
            $tbody.append($tr);
          });
          $ele.append($tbody);
          break;
        case 'katSelect':
          $ele = self.createMpsElement({ katType: 'div', className: 'form-inline' });

          var sl_guid = generateUUID();
          var ss_guid = generateUUID();

          var lmap = {
            katType: 'label',
            text: attrMap.label,
            justifyContent: 'left',
            guid: sl_guid
          };

          var mr = 0;
          if (attrMap.labelWidth) {
            lmap.width = attrMap.labelWidth;
          } else if (attrMap.label) {
            mr = 10;
            lmap.marginRight = mr + 'px';
          }

          $ele.append(self.createMpsElement(lmap));

          var $div = self.createMpsElement({ katType: 'div' });
          var copyAttrMap = Object.assign({}, attrMap);
          copyAttrMap.katType = 'select';
          copyAttrMap.guid = ss_guid;
          copyAttrMap.disabled = attrMap.disabled;
          var $select = self.createMpsElement(copyAttrMap);

          $select.append(self.createMpsElement({
            katType: 'option',
            value: '',
            text: ''
          }));

          self.service.getBackSettingDataByKey(attrMap.sysMenu).forEach(function (d) {
            $select.append(self.createMpsElement({
              katType: 'option',
              value: d.cdId,
              text: d.cdNm
            }));
          });
          $div.append($select);

          $ele.append($div);

          delete attrMap.id;
          delete attrMap.funname;
          delete attrMap.funevent;

          setTimeout(function () {
            var $sl = $('[guid=' + sl_guid + ']')
            var $ss = $('[guid=' + ss_guid + ']');

            $sl.width($sl.width() + mr + 'px');
            $ss.width(($sl.parent().width() - $sl.width() - mr - 2) + 'px');

            $sl.removeAttr('guid');
            $ss.removeAttr('guid');
          }, -1);
          break;
        case 'katFileHref':
          $ele = self.createMpsElement({ katType: 'div' });
          attrMap.setting.forEach(function (t, i) {
            var $div = self.createMpsElement({ katType: 'div' });
            $div.append(self.createMpsElement({
              katType: 'label',
              id: t.value + '_' + i,
              text: t.text,
              funname: attrMap.funname,
              guid: t.value,
              katformid: t.katformid || '',
              color: t.color || '',
            }));
            $ele.append($div);
          });
          delete attrMap.funname;
          delete attrMap.text;
          break;
        case 'katInputs':
          var newAttrMap = { katType: 'div' };
          $ele = self.createMpsElement(newAttrMap);
          attrMap.text.split(',').forEach(function (t, i) {
            var $div = self.createMpsElement({ katType: 'div' });
            $div.append(self.createMpsElement({
              katType: 'input',
              type: attrMap.type,
              id: attrMap.id + '_' + i,
              text: t,
              funname: attrMap.funname,
              checked: attrMap.checked.split(',')[i],
              disabled: attrMap.disabled.split(',')[i],
            }));
            $ele.append($div);
          });
          attrMap = newAttrMap;
          break;
        case 'katButtons':
          $ele = self.createMpsElement({ katType: 'div' });
          attrMap.setting.forEach(function (t) {
            var $div = self.createMpsElement({ katType: 'div' });
            $div.append(self.createMpsElement({
              katType: 'katButton',
              id: t.value + '_' + attrMap.funname,
              text: attrMap.title,
              funname: attrMap.funname,
              className: attrMap.className,
              guid: t.value,
              src: attrMap.src,
              disabled: attrMap.disabled
            }));
            $ele.append($div);
          });
          delete attrMap.id;
          delete attrMap.funname;
          delete attrMap.text;
          delete attrMap.title;
          delete attrMap.className;
          delete attrMap.disabled;
          break;
        case 'katButton':
          switch ((attrMap.className || '').split(' ')[0]) {
            case 'tab-item'://頁籤
              $ele = self.createMpsElement({ katType: 'div', className: 'tab-item' });
              $ele.append(self.createMpsElement({ katType: 'a', className: 'tab-text' }));
              break;
            case 'btn-doc'://提示文件的文件按鈕
              $ele = self.createMpsElement({ katType: 'div', className: 'btn-doc tooltip-sdrm' });
              var $child = self.createMpsElement({ katType: 'div', className: 'doc-inner' });
              $child.append(self.createMpsElement({ katType: 'div', className: 'btnText' }));

              $ele.append($child);

              if (attrMap.title) {
                //mouseover小字
                $ele.append(self.createMpsElement({
                  katType: 'span',
                  text: attrMap.title,
                  className: 'tooltiptext-sdrm',
                  padding: '8px',
                }));

                delete attrMap.title;
              }

              if (attrMap.del) {
                $ele.append(self.createMpsElement({
                  katType: 'span',
                  id: attrMap.id + 'del',
                  text: 'X',
                  funname: 'delFormButton',
                  width: '14px',
                  height: '21px',
                  className: 'overlayFlag',
                  color: 'indianred'
                }));
              }

              break;
            case 'tooltip-sdrm'://有圖片的按鈕

              var className = attrMap.className;

              if (['closeMpsBtn', 'leftButtons', 'downloadMpsBtn', 'printOneMpsBtn'].indexOf(attrMap.funname) == -1) {
                className = className + ' overlayFlag';
              }

              $ele = self.createMpsElement({ katType: 'a', className: className });
              $ele.append(self.createMpsElement({ katType: 'span', text: attrMap.text, className: 'tooltiptext-sdrm', }));
              if (katctbc.images[attrMap.funname]){
                $ele.append(self.createMpsElement({ katType: 'img', src: attrMap.funname, width: '20px' }));
              }     
              break;
            case 'katImgBtn':
              $ele = self.createMpsElement({
                katType: 'img',
                width: '20',
              });
              break;
            case 'katFileButton':
              $ele = self.createMpsElement({
                katType: 'div'
              });

              var classNames = attrMap.className.split(' ');

              classNames[1] = classNames[1] || 'btn-sm-add';

              classNames.push('btn-light');
              classNames.push('overlayFlag');

              var $btn = self.createMpsElement({
                katType: 'button',
                className: classNames.join(' '),
                disabled: attrMap.disabled
              });
              $btn.append(self.createMpsElement({
                katType: 'label',
                for: attrMap.disabled ? '' : attrMap.id + '_file',
                display: 'inline'
              }));
              $ele.append($btn);
              $ele.append(self.createMpsElement({
                katType: 'input',
                type: 'file',
                display: 'none',
                id: attrMap.id + '_file',
                className: attrMap.className,
                funname: attrMap.funname,
                funevent: 'change',
                multiple: 'multiple',
                accept: '.jpg,.pdf'
              }));
              delete attrMap.className;
              delete attrMap.funname;
              delete attrMap.disabled;
              break;
            default:
              $ele = $(document.createElement(attrMap.katType));
          }
          break;
        case 'katTreeCheckboxs':
          $ele = self.createMpsElement({
            katType: 'div',
            className: 'katTreeCheckboxs'
          });

          attrMap.options.forEach(function (option, idx) {

            var $opt = self.createMpsElement({ katType: 'div' });

            $opt.append(self.createMpsElement({
              katType: 'img',
              src: 'triDown',
              width: '15',
              position: 'absolute',
              left: '90px',
              cursor: 'pointer'
            }));

            $opt.append(self.createMpsElement({
              katType: 'katCheckbox',
              options: [{ value: (idx + 1), text: attrMap.firstLayerLabel[idx] }],
            }));


            var os = [];
            option.forEach(function (o) {
              os.push({ value: o.id, text: o.text });
            })
            $opt.append(self.createMpsElement({
              katType: 'katCheckbox',
              options: os,
            }));

            $ele.append($opt);
          });
          break;
        case 'katCheckboxs':
          $ele = self.createMpsElement({ katType: 'div' });
          (attrMap.value || []).forEach(function (d) {
            $ele.append(self.createMpsElement({
              id: d.id,
              katType: 'katCheckbox',
              label: d.text,
              options: attrMap.options,
              funname: d.funname,
              value: d.value
            }));
          });
          break;
        case 'katCheckbox':
          $ele = self.createMpsElement({ katType: 'div' });

          if (attrMap.label) {
            $ele.append(self.createMpsElement({
              katType: 'label',
              text: attrMap.label,
              width: attrMap.labelWidth || '',
            }));
          }

          var disabled = attrMap.disabled;
          attrMap.options.forEach(function (o) {

            var $div = self.createMpsElement({ katType: 'div' });

            var $input = self.createMpsElement({
              katType: 'input',
              id: attrMap.id + '_' + o.value,
              value: o.value,
              type: 'checkbox',
              funname: attrMap.funname,
              checked: o.value == attrMap.value,
              disabled: disabled || false,
              name: o.name || '',
            });

            var $label = self.createMpsElement({
              katType: 'label',
              text: o.text,
              for: o.name || '',
            });

            $div.append($input);
            $div.append($label);

            $ele.append($div);
          });

          delete attrMap.funname;
          break;
        case 'katRadio':
          $ele = self.createMpsElement({ katType: 'div' });

          if (attrMap.label) {
            $ele.append(self.createMpsElement({
              katType: 'label',
              text: attrMap.label,
              width: attrMap.labelWidth || '',
            }));
          }

          var $radioGroup = self.createMpsElement({ katType: 'div' });

          attrMap.options.forEach(function (o) {

            var $input = self.createMpsElement({
              katType: 'input',
              id: attrMap.id + '_' + o.value,
              value: o.value,
              type: 'radio',
              funname: attrMap.funname,
              checked: o.value == attrMap.value,
              name: attrMap.name,
              disabled: !!attrMap.disabled
            });

            var $label = self.createMpsElement({
              katType: 'label',
              text: o.text,
            });

            $radioGroup.append($input);
            $radioGroup.append($label);
          });

          $ele.append($radioGroup);

          delete attrMap.funname;
          delete attrMap.text;
          break;
        case 'katLabels':
          $ele = self.createMpsElement({ katType: 'div' });

          var v = attrMap.value;
          if (v && typeof (v) == 'string') {
            v = v.split(',');
          }

          (v || []).forEach(function (d, i) {
            var $div = self.createMpsElement({ katType: 'div' });

            if (attrMap.idxFlag) {
              $div.append(self.createMpsElement({
                katType: 'label',
                text: (i + 1) + '.',
                margin: '0px 20px 0px 40px'
              }));
            }

            $div.append(self.createMpsElement({
              katType: 'label',
              text: d,
            }));
            $ele.append($div);
          });
          break;
        case 'katLabelInput':
          $ele = self.createMpsElement({ katType: 'div', className: 'form-inline' });

          var l_guid = generateUUID();
          var i_guid = generateUUID();
          var u_guid = generateUUID();

          var labelMap = {
            katType: 'label',
            text: attrMap.label || '',
            fontSize: attrMap.labelFontSize || '',
            justifyContent: 'left',
            guid: l_guid
          };

          var marginRight = 0;
          if (attrMap.labelWidth) {
            labelMap.width = attrMap.labelWidth;
          } else if (attrMap.label) {
            marginRight = 10;
            labelMap.marginRight = marginRight + 'px';
          }

          $ele.append(self.createMpsElement(labelMap));

          $ele.append(self.createMpsElement({
            katType: 'input',
            id: attrMap.id,
            text: attrMap.text || '',
            type: 'text',
            value: attrMap.value || '',
            className: attrMap.className || 'katInputBorderBottom',
            funevent: attrMap.funevent,
            funname: attrMap.funname,
            disabled: attrMap.disabled,
            placeholder: attrMap.placeholder,
            autocomplete: 'off',
            guid: i_guid,
            textAlign: attrMap.textAlign,
            maxlength: attrMap.maxlength
          }));

          delete attrMap.id;
          delete attrMap.funevent;
          delete attrMap.funname;
          delete attrMap.className;
          delete attrMap.textAlign;
          delete attrMap.maxlength;

          $ele.append(self.createMpsElement({
            katType: 'label',
            text: attrMap.unit || '',
            'font-size': attrMap.labelFontSize || '',
            guid: u_guid
          }));

          setTimeout(function () {
            var $l = $('[guid=' + l_guid + ']')
            var $i = $('[guid=' + i_guid + ']');
            var $u = $('[guid=' + u_guid + ']');

            $l.width($l.width() + marginRight + 'px');
            $i.width('calc(100% - ' + ($l.width() + $u.width() + marginRight) + 'px' + ')');
            $u.width($u.width() + 'px');

            $l.removeAttr('guid');
            $i.removeAttr('guid');
            $u.removeAttr('guid');
          }, -1);
          break;
        case 'katVerCompares':
          $ele = self.createMpsElement({
            katType: 'div',
            id: 'katVerCompares',
            className: attrMap.className || 'katVerCompares'
          });

          //因為載太久了所以加loading彈窗
          myLoading(katctbc.msg.page);

          attrMap.value.forEach(function (d) {
            $ele.append(self.createMpsElement({
              katType: 'div',
              id: d.id,
              className: 'katVerCompare'
            }))
          });

          self.createMpsVerCompares($ele, attrMap.value || [], 0);
          break;
        case 'katVerCompare':
          var rs = attrMap.rs;
          setTimeout(function () {//等畫面長完 再init(init 主要是存jquery物件)
            var $parent = katJqobject[self.katType][attrMap.id] || $('#' + attrMap.id);

            var o_diff = {};//A版資料
            var n_diff = {};//B版資料
            attrMap.diff.forEach(function (d) {

              var o = copyJson(d.o), 
                  n = copyJson(d.n);
             
              if (d.key == 'DOC_TABLE') {
                Object.keys(o).forEach(function (col) {

                  if (['TOTAL', 'HEAD', 'DEFAULT'].indexOf(col) != -1) {
                    return;
                  }

                  o[col] = o[col].filter(function (v, i) {

                    return d.n[col][i] != '&nbsp;';

                  });

                  n[col] = n[col].filter(function (v, i) {

                    return d.o[col][i] != '&nbsp;';

                  });

                });
              }

              o_diff[d.key] = o;
              n_diff[d.key] = n;

            });

            var w1 = new MpsDocsWindow({
              $parent: $parent,
              barmode: 'print',//按鈕組合
              mode: attrMap.mode || 'view',//畫面呈現
              katformid: attrMap.katformid,
              title: [attrMap.title, 'A'].join('_'),
              id: [attrMap.id, 1, 'window'].join('_'),
              className: 'box-half',
              box: 'box-half',
              guid: attrMap.a_guid,
              diff: n_diff
            });
            w1.init();

            var w2 = new MpsDocsWindow({
              $parent: $parent,
              barmode: 'print',//按鈕組合
              mode: attrMap.mode || 'view',//畫面呈現
              katformid: attrMap.katformid,
              title: [attrMap.title, 'B'].join('_'),
              id: [attrMap.id, 2, 'window'].join('_'),
              className: 'box-half',
              box: 'box-half',
              guid: attrMap.b_guid,
              diff: o_diff
            });
            w2.init();

            w1.loadView().then(function () {
              w2.loadView().then(function () {
                rs();
              });
            });

          }, -1);

          delete attrMap.rs;

          $ele = self.createMpsElement({ katType: 'div' });
          break;
        case 'katVerCompareDatas':
          $ele = self.createMpsElement({
            katType: 'div',
            className: attrMap.className || 'katVerCompareDatas'
          });

          (attrMap.value || []).forEach(function (v) {

            $ele.append(self.createMpsElement({
              katType: 'katVerCompareData',
              value: v.value,
              wordings: attrMap.wordings,
              caseSet: v.caseSet,
              katformname: v.katformname,
              key: v.key,
              thead: attrMap.thead.map(function (h) { return Object.assign({}, h); })
            }));

          });

          break;
        case 'katVerCompareData':
          $ele = self.createMpsElement({
            katType: 'div',
            className: attrMap.className || 'katVerCompareData',
            key: attrMap.key
          });

          $ele.append(self.createMpsElement({
            katType: 'katUl',
            text: attrMap.wordings[0] + attrMap.caseSet,
            className: 'katUlThinWhite'
          }));

          $ele.append(self.createMpsElement({
            katType: 'label',
            text: attrMap.wordings[1] + attrMap.katformname,
            marginLeft: '35px'
          }));

          $ele.append(self.createMpsElement({
            katType: 'katTable',
            thead: attrMap.thead,
            value: attrMap.value
          }));

          break;
        case 'katHint':
          $ele = self.createMpsElement({ katType: 'div' });

          $ele.append(self.createMpsElement({
            katType: 'label',
            text: attrMap.label,
            fontWeight: 'bold'
          }));

          var $d = self.createMpsElement({
            katType: 'div',
            background: '#e9ecef',
            minHeight: '40px'
          });

          var $img = self.createMpsElement({
            katType: 'img',
            src: attrMap.src || '',
            width: '25px',
            margin: '0px 10px',
            marginBottom: '5px'
          });

          var $text = self.createMpsElement({
            katType: 'label',
            text: attrMap.text,
            fontWeight: 'bold',
            marginTop: '10px'
          });

          $d.append($img);

          $d.append($text);

          $ele.append($d);

          break;
        default:
          $ele = $(document.createElement(attrMap.katType));
      }
      if (!flag) {
        return $ele;
      }
      Object.keys(attrMap || {}).sort().forEach(function (k) {

        if (!attrMap[k]) {
          return;
        }

        switch (k) {
          case 'katType':
            $ele.attr(k, attrMap[k]);
            break;
          case 'id':
            $ele.attr(k, attrMap[k]);
            //有id的話要存jq物件
            if (self.katType == 'MpsDocForm') {

              katJqobject[self.katType] = katJqobject[self.katType] || {};

              katJqobject[self.katType][self.formid] = katJqobject[self.katType][self.formid] || {};

              katJqobject[self.katType][self.formid][attrMap.dataKey || attrMap.id] = null;

            } else {

              katJqobject[self.katType] = katJqobject[self.katType] || {};

              katJqobject[self.katType][attrMap.id] = null;

            }

            break;
          case 'src':
            var key = attrMap[k].split('_')[0];
            $ele.attr(k, katctbc.images[key] ? katctbc.images[key] : key);
            break;
          case 'className':
            $ele.addMpsClass(attrMap[k]);
            break;
          case 'funname':
            $ele.attr(k, attrMap[k]);
            $ele.css('cursor', !attrMap.disabled ? 'pointer' : '');
            break;
          case 'funevent':
            $ele.attr(k, attrMap[k]);
            break;
          case 'text':
            var $temp = $ele;
            while ($temp.children().length > 0) {
              $temp = $temp.children();
            }
            $temp.html(attrMap[k]);
            break;
          case 'type':
            $ele.attr(k, attrMap[k]);
            break;
          case 'placeholder':
            $ele.attr(k, attrMap[k]);
            break;
          case 'width':
            if ($ele[0].tagName == 'IMG') {
              $ele.attr(k, attrMap[k]);
            } else {
              $ele.css(k, attrMap[k]);
            }
            break;
          case 'title':
            $ele.attr(k, attrMap[k]);
            break;
          case 'guid':
            $ele.attr(k, attrMap[k]);
            break;
          case 'imgguid':
            $ele.attr(k, attrMap[k]);
            break;
          case 'formid':
            $ele.attr(k, attrMap[k]);
            break;
          case 'katformid':
            $ele.attr(k, attrMap[k]);
            break;
          case 'barmode':
            $ele.attr(k, attrMap[k]);
            break;
          case 'for':
            $ele.attr(k, attrMap[k]);
            break;
          case 'value':
            if (typeof (attrMap[k]) != 'object') {
              $ele.setMcuVal(attrMap[k]);
            }
            break;
          case 'multiple':
            $ele.attr(k, attrMap[k]);
            break;
          case 'checked':
            $ele.attr(k, !!attrMap[k]);
            break;
          case 'disabled':
            $ele.attr(k, !!attrMap[k]);
            break;
          case 'filename':
            $ele.attr(k, attrMap[k]);
            break;
          case 'accept':
            $ele.attr(k, attrMap[k]);
            break;
          case 'colspan':
            $ele.attr(k, attrMap[k]);
            break;
          case 'rowspan':
            $ele.attr(k, attrMap[k]);
            break;
          case 'dataKey':
            $ele.attr(k, attrMap[k]);
            break;
          case 'btnid':
            $ele.attr(k, attrMap[k]);
            break;
          case 'key':
            $ele.attr(k, attrMap[k]);
            break;
          case 'bg':
            $ele.attr(k, attrMap[k]);
            break;
          case 'name':
            $ele.attr(k, attrMap[k]);
            break;
          case 'serialNo':
            $ele.attr(k, attrMap[k]);
            break;
          case 'autocomplete':
            $ele.attr(k, attrMap[k]);
            break;
          case 'caseVer':
            $ele.attr(k, attrMap[k]);
            break;
          case 'funtype':
            $ele.attr(k, attrMap[k]);
            break;
          case 'skipGetVal':
            $ele.attr(k, attrMap[k]);
            break;
          case 'seq':
            $ele.attr(k, attrMap[k]);
            break;
          case 'dataIsSync':
            $ele.attr('data-is-sync', attrMap[k]);
            break;
          case 'maxlength':
            $ele.attr(k, attrMap[k]);
            break;
          default:
            $ele.css(k, attrMap[k]);
        }
      });
      return $ele;
    },
    createMpsVerCompares: function ($ele, verCompares, idx) {
      var self = this;

      self.createMpsVerCompare($ele, verCompares, idx).then(function () {

        if (idx < verCompares.length - 1) {
          self.createMpsVerCompares($ele, verCompares, idx + 1);
        } else {
          // $.closeLoading();
        }

      });

    },
    createMpsVerCompare: function ($ele, verCompares, idx) {
      var self = this;

      return new Promise(function (resolve) {

        var vc = verCompares[idx];

        if (!vc) {
          return;
        }

        self.createMpsElement({
          katType: 'katVerCompare',
          id: vc.id,
          katformid: vc.katformid,
          title: vc.title,
          a_guid: vc.a_guid,
          b_guid: vc.b_guid,
          diff: vc.diff,
          rs: resolve
        });

      });
    },
    /**
     * 
     * @param {*} formData
     * @returns 
     */
    createForm: function (formData) {
      var self = this;

      //存放此form畫面中所有dataKey
      var columns = [];

      //創建一個div
      formData.katType = 'div';

      //排除創建div不必要的屬性
      var content = formData.content || [];
      delete formData.content;

      var $ele = self.createMpsElement(formData);

      //要把content加回去 不然彈窗會有問題
      formData.content = content;

      //模板資料
      var data = self.service.getViewTemplateData() || {};

      //同步欄位
      var sync = self.service.getSyncColumnsByCaseSet('1') || {};

      //再讀取content屬性的值 去組form畫面
      content.forEach(function (c) {
        var $c = self.createMpsElement({ katType: 'div', className: 'flexSpaceBetween' });
        c.forEach(function (ele) {
          if (ele.funname || ele.formid) {
            ele.id = (ele.id || formData.id) + '_' + (ele.funname || ele.formid);
          }
          if (ele.dataKey) {

            // 初始化時存屬性
            setTimeout(function () {
              //押匯申請書和匯票
              if (formData.className == 'katHTMLForm') {
                return;
              }

              self.service.addKeySaveData(ele.dataKey, self.service.getSaveDataByKey(ele.dataKey));

            }, -1);

            var col = ele.dataKey.replaceAll('_1', '');
            //判斷沒跑過規則
            if (data[ele.dataKey] == undefined || self.forceAigoData) {

              var rules = self.service.getRulesByKey(col, 1);//只要載入時的規則

              self.validator.validate({
                colName: col
              }, rules, 1);

              ele.value = self.validator.columnVal[col];

            } else {

              ele.value = data[ele.dataKey];

            }

            if (!self.notSync) {
              //是否為同步欄位 有同步欄位用同步欄位的值
              var isSync = (ele.dataIsSync == 'Y');
              if (isSync && sync[col]) {
                ele.value = sync[col];
              }
            }

            columns.push(ele.dataKey);

            if (ele.katType == 'katTable') {
              ele.thead.forEach(function (e) {

                if (e.dataKey) {
                  e.value = data[e.dataKey];
                  columns.push(e.dataKey);
                }

              });
              (ele.tbody || []).forEach(function (tr) {

                tr.forEach(function (e) {

                  if (e.dataKey) {
                    e.value = data[e.dataKey];
                    columns.push(e.dataKey);
                  }

                });

              });
            }

          }
          $c.append(self.createMpsElement(JSON.parse(JSON.stringify(ele))));
        })
        $ele.append($c);
      });

      //每個form元素都要存key
      if (formData.btnid) {
        self.service.updateKeySaveDataByKey(formData.btnid);
      }
      self.$parent.attr('columns', columns.join(','));
      return $ele;
    },

    /**
     * 建立可點擊物件
     * @param {*array} clickInfo
     * @param {*string} className
     * @return jquery 物件
     */
    createBar: function (clickInfo, className) {
      var self = this;
      var $clickableBar = self.createMpsElement({ katType: 'div', className: className });
      clickInfo.forEach(function (info) {
        var copyInfo = Object.assign({}, info);
        copyInfo.id = copyInfo.id || (copyInfo.funname + '_' + self.id);
        $clickableBar.append(self.createMpsElement(copyInfo));
      });
      return $clickableBar;
    },
    cloneNode: function ($ele) {
      var $new_node = $($ele[0].cloneNode(true));

      var old_selects = $ele.find('select');
      var new_selects = $new_node.find('select');

      for (var i = 0; i < old_selects.length; i++) {
        var v = old_selects.eq(i).val();
        new_selects.eq(i).find('option[value=' + v + ']').attr('selected', true);
      }

      return $new_node;

    },
    getTool: function (canvasId) {
      return pdfTool.init(canvasId, '/sdrsw/webjars/pdfjs-dist/2.8.335/legacy/build/pdf.worker.js');
    },
    getLogoPosition($ele, selector) {

      var logo = this.service.getNotSaveDataByKey('logo') || '';

      var imageOption = null;
      var imageObject = $ele.find(selector || "[data-mcutype='LClogo']").get(0);
      if (imageObject) {
        imageOption = {
          y: parseInt(imageObject.style.top),
          x: parseInt(imageObject.style.left),
          src: logo,
        }
      }
      return imageOption;
    },
    /**
     * 下載列印產生barcode
     * @param {*} $html 要列印或下載的畫面
     * @param {*} code 列印:P 下載:D 產生barcode:B
     * @param {*} copyNode 是否要另外將畫面複製一個出來
     * @param {*} callback callback function
     * @param {*} barcodeInfo 條碼資訊
     */
    printDownload: function ($html, code, copyNode, callback, barcodeInfo, isLc) {
      var self = this;

      //產條碼不用去查要不要浮水印
      if(code != 'B'){
        // 重查LC_LC_INF
        self.service.refreshLcLcInf();
      }
      
      var status7 = self.service.getCaseData().status == '7';

      //是否需要浮水印
      var waterMark = barcodeInfo && katctbc.iswatermark && !status7;

      //是否需要條碼(案件狀態為待正本送達)
      var barcode = status7;

      var imageOption = self.getLogoPosition($html);

      var tool = self.getTool();

      var array = [];

      $html.each(function (i, e) {
        array.push($(e));
      });

      $('body').append('<div id="printDiv" style="width:100%"></div>')

      var $div = $('#printDiv');

      $html.each(function (i, e) {
        e.style.width = '100%';
        $div.append(copyNode ? e.cloneNode(true) : e);
      });

      setTimeout(function () {
        if (code == 'P') {

          //(網頁物件,callback function,客戶圖片,是否需要套印浮水印,是否需要列印條碼,條碼資訊)
          tool.parseHtmlToPdfValuePrint(array, function () {

            self.pdbCallBack($div);

          }, imageOption, waterMark, barcode, barcodeInfo, isLc, katctbc.isAllAll);

        } else if (code == 'D') {

          //(網頁物件,callback function,客戶圖片,檔案名稱,是否需要套印浮水印,是否需要列印條碼,條碼資訊)
          tool.parseHtmlToPdfValueDownload(array, function () {

            self.pdbCallBack($div);

          }, imageOption, '', waterMark, barcode, barcodeInfo, false, isLc, katctbc.isAllAll);

        } else if (code == 'B') {

          tool.getBarcode(array, function (barcode_result) {

            console.log(barcodeInfo);

            console.log(barcode_result);

            self.pdbCallBack($div);

            if (callback) {
              callback(barcode_result);
            }

          }, imageOption, false, true, barcodeInfo, katctbc.isAllAll);
        }

      }, -1);

    },
    getPdf: function ($html, $canvas, diff, diffType) {
      var self = this;

      return new Promise(function (resolve) {

        var imageOption = self.getLogoPosition($html);

        var tool = self.getTool($canvas.attr('id'));

        tool.parseHtmlToPdfByValueWithCompareOlderVersion(
          [$html],
          function () {

            self.imgCallBack($canvas, resolve);

          },
          imageOption,
          diff || { INVOICE_NO: '28825252' },
          diffType, katctbc.isAllAll);

      });
    },
    imgCallBack: function ($canvas, resolve) {

      var canvas_list = $canvas.find('canvas');

      setTimeout(function () {
        var url_list = [];
       
        for (var i = 0 ; i < canvas_list.length ; i++){
          var canvas = canvas_list.eq(i)[0];
          var dataURL = canvas.toDataURL();
          url_list.push(URL.createObjectURL(dataURLtoBlob(dataURL || '')))
        }

        resolve(url_list);
        
      }, -1);

    },
    pdbCallBack: function ($div) {

      if ($div) {
        $div.remove();
      }

      // $.closeLoading();
    },
    //儲存
    callSaveCaseData: function () {
      this.service.saveCaseData();
    },
    //送出預審
    callSubmitCaseData: function (submitMode) {
      var self = this;

      var seqList = self.service.getFormSeqList();

      var warn = [];
      //幣別檢核
      if (self.validateCurrency()) {
        warn.push(katctbc.msg.currencyInconsistency);
      }
      //金額檢核
      if (self.validateAmount()) {
        warn.push(katctbc.msg.amountTooLarge);
      }

      var err = [];

      var lcFileList = [];

      // op上傳的檔案們
      // op 上傳信用狀
      var op_lc = self.service.getNotSaveDataByKey('OP_UP_LC') || [];
      // op 上傳檔案
      var op_doc = self.service.getNotSaveDataByKey('OP_UP_DOC') || [];

      if (op_lc.length == 0 && op_doc.length == 0) {
        lcFileList = lcFileList.concat(self.service.getSaveDataByKey('lcFileList') || []);
      } else {

        op_lc.forEach(function (lc) {
          lcFileList.push(lc.guid);
        });

        op_doc.forEach(function (doc) {
          lcFileList.push(doc.guid);
        });

        self.service.addKeySaveData('lcFileList', lcFileList);
      }

      var shareCheck = {};
      var share_error = [];
      //預審第三方文件上傳檢查
      for (var i = 0; i < seqList.length; i++) {//看提示文件有幾套

        //第三方文件上傳檔案上傳完整檢核
        var thirdPartyDocUpload = self.service.getSaveDataByKey('thirdPartyDocUpload_' + seqList[i]);
        thirdPartyDocUpload.forEach(function (s) {
          //是否有未放棄提示同時無上傳的單據
          if (!((s.shareWithOther || {}).value || !s.canUpload || !!(s.hint || {}).value) && !(s.fileNames || {}).text) {
            err.push(s.docCategory.text + '_' + self.service.suppleZero(i + 1, '00'));
          }

          //與其他文件共用檢核
          var share_check_key = s.docCategory.value + s.serialNo;
          shareCheck[share_check_key] = shareCheck[share_check_key] || 0;
          
          if ((s.shareWithOther || {}).value){
            shareCheck[share_check_key]++;

            if (shareCheck[share_check_key] == seqList.length){
              share_error.push(s.docCategory.text);
            }
          }

        });

        if (err.length > 0) {
          continue;
        }

        //傳目前有存的第三方上傳文件guid
        var guids = self.service.getSaveDataByKey('thirdPartyDocUploadFiles_' + seqList[i]) || '';
        guids.split(',').forEach(function (g) {

          if (!g) {
            return;
          }

          lcFileList.push(g);
        });

      }

      //預審作業檔案
      var cafc = $('[dataKey=cafcCheck]').val() || self.service.getSaveDataByKey('cafcCheck') || '';
      cafc.split(',').forEach(function (g) {

        if (!g) {
          return;
        }

        lcFileList.push(g);
      });

      if (err.length > 0) {

        setTimeout(function () {
          var fs = katctbc.popup['sendAlert'];
          $.alert($.format(fs.text, err.join('、')), fs.title, fs.ok,);
        }, -1);

        return;
      }

      //與其他文件共用檢核
      if (share_error.length > 0) {

        setTimeout(function () {
          var fs = katctbc.popup['sendAlert2'];
          $.alert($.format(fs.text, share_error.join('、')), fs.title, fs.ok,);
        }, -1);

        return;
      }

      return new Promise(function (resolve) {

        //幣別金額提示訊息
        if (warn.length > 0) {

          warn.push(katctbc.msg.sureToSend);

          $.dialog(warn.join('<br>'), '', $.i18n.transtale('message.page.yes'), $.i18n.transtale('message.page.no'), 'warning', function () {
            self.callSaveAndSubmit(submitMode, lcFileList, resolve);
          }, null, false, false);

        }else{

          self.callSaveAndSubmit(submitMode, lcFileList, resolve);

        }

      });

    },
    //幣別檢核
    validateCurrency: function() {
      var self = this;

      //押匯申請書 幣別 先取畫面的值
      var app_currency = $('[formid=XXX]').find('[dataKey=CURRENCY_1]').getMcuVal();//押匯申請書

      //是否有匯票 有: 取得所有匯票之幣別,無: 取得 INV(多筆)幣別
      var dft_currency = [];

      var sys1017 = self.service.getBackSettingDataByKey('1017');

      //檢查是否所有幣別皆相同(需對應選單1017)
      var getCurrencyId = function(currency) {
        return sys1017.find(function(e) {
          return e.cdId == currency;
        })?.flag01 || '';
      };

      var applyDocForm = self.service.getFormListByPageId('applyDocForm')[0];
      applyDocForm.forEach(function (f) {

        var caseSetGuid = f.caseSetGuid || f.guid;
        var back_data = self.service.getBackSaveDataByKey(caseSetGuid) || {};

        if (f.formid == 'YYY' && f.isMax == 'Y') {
          var d_a = $('[dataKey="' + caseSetGuid + '"]').find('[dataKey=CURRENCY_1]').getMcuVal();
          d_a = d_a || back_data['CURRENCY_1'];
          dft_currency.push(d_a);
        }

        //押匯申請書 無畫面的值 取DB
        if (f.formid == 'XXX' && f.isMax == 'Y') {
          if (!app_currency) {
            app_currency = back_data['CURRENCY_1'];
          }
        }
      });
      
      //無匯票
      if (dft_currency.length == 0) {
        var tipDocForms = self.service.getFormListByPageId('tipDocForm');
        //TODO 過濾出INV取 DOC_TABLE ITEM_AMOUNT
        tipDocForms.forEach(function (forms) {

          forms.forEach(function (f) {

            if (f.katformid == 'INV' && f.isMax == 'Y') {

              var caseSetGuid = f.caseSetGuid || f.guid;
              var back_data = self.service.getBackSaveDataByKey(caseSetGuid) || {};

              var doc_table = $('[dataKey="' + caseSetGuid + '"]').find('[data-mcutype=LCdisplayGrid]').getMcuVal();

              doc_table = doc_table || back_data['DOC_TABLE'] || {};

              var $head = $(doc_table.HEAD);

              var index = $head.find('[data-field-name=ITEM_AMOUNT]').index() - 1;

              var currency = $head.find('input').eq(index).val() || '';

              //INV有輸才要比
              if (currency){
                dft_currency.push(currency);
              }
            }

          });

        });

      }

      var baseCurrency = getCurrencyId(app_currency);

      var check = dft_currency.every(function (currency) {
        return getCurrencyId(currency) == baseCurrency;
      });

      return !check;
    },
    //金額檢核
    validateAmount: function () {
      var self = this;

      //押匯申請書 金額 先取畫面的值
      var app_amuount = $('[formid=XXX]').find('[dataKey=TOTAL_AMOUNT_1]').getMcuVal();//押匯申請書

      //是否有匯票 有: 加總匯票,無: 加總所有ITEM_AMOUNT
      var dft_amount = [];

      var applyDocForm = self.service.getFormListByPageId('applyDocForm')[0];
      applyDocForm.forEach(function (f) {

        var caseSetGuid = f.caseSetGuid || f.guid;
        var back_data = self.service.getBackSaveDataByKey(caseSetGuid) || {};

        if (f.formid == 'YYY' && f.isMax == 'Y') {
          var d_a = $('[dataKey="' + caseSetGuid + '"]').find('[dataKey=TOTAL_AMOUNT_1]').getMcuVal();
          d_a = d_a || back_data['TOTAL_AMOUNT_1'];
          dft_amount.push(d_a);
        }

        //押匯申請書 無畫面的值 取DB
        if (f.formid == 'XXX' && f.isMax == 'Y') {
          if (!app_amuount) {
            app_amuount = back_data['TOTAL_AMOUNT_1'];
          }
        }
      });

      //無匯票
      if (dft_amount.length == 0) {
        var tipDocForms = self.service.getFormListByPageId('tipDocForm');
        //TODO 過濾出INV取 DOC_TABLE ITEM_AMOUNT
        tipDocForms.forEach(function (forms) {

          forms.forEach(function (f) {

            if (f.katformid == 'INV' && f.isMax == 'Y') {

              var caseSetGuid = f.caseSetGuid || f.guid;
              var back_data = self.service.getBackSaveDataByKey(caseSetGuid) || {};

              var doc_table = $('[dataKey="' + caseSetGuid + '"]').find('[data-field-name=DOC_TABLE]').getMcuVal();

              doc_table = doc_table || back_data['DOC_TABLE'] || {};

              dft_amount = dft_amount.concat(doc_table['ITEM_AMOUNT'] || []);
            }
            
          });

        });

      }

      var total_amount = 0;
      dft_amount.forEach(function (a) {
        total_amount += parseFloat(a.replaceAll(',', ''));
      });

      app_amuount = parseFloat(app_amuount.replaceAll(',', ''));

      return (total_amount != app_amuount);

    },
    //全形字體要跳提示訊息
    checkFullStr: function ($ele) {
      var str = $ele.getMcuVal() || '';
      var len = str.length;
      var flag = false;
      var res = [];
      for (var i = 0; i < len; i++) {
        var cCode = str.charCodeAt(i);
        //全形英文或標點符號、全形空白
        if(cCode >= 0xFF01 && cCode <= 0xFF5E || (cCode == 0x03000)) {
          flag = true;
          res.push('');
        } else{
          res.push(str[i]);
        }
      }
      if(flag) {
        $ele.setMcuVal(res.join(''));
        //EX:有比對的情境,所以帶完值後要去trigger
        $ele.katTrigger('change');
        var fs = katctbc.popup['fullStr'];
        $.alert(fs.text, fs.title);
      }
    },
    //增加全形檢核的focusout的event
    addFullStrEvent: function ($ele) {
      var self = this;
      var katType =  $ele.attr('katType') || '';
      if(katType == 'katDocForm'){
        $ele.find('input,textarea').each(function(){
          $(this).on('input', function (event){
            //用戶點擊的
            if(event.originalEvent){
              self.checkFullStr($(this));
            }
          });
        });
      }
    },         
    // 呼叫儲存送審
    callSaveAndSubmit: function (submitMode, lcFileList, resolve){
      var self = this;

      // 如果有異動才要再重產一次條碼
      var has_diff = self.service.getVerCompareData(true).length > 0;

      //列印提交 未經過預審案或資料有修改
      if (submitMode == 'print' && (katctbc.caseVer == 1 || has_diff)) {

        // 要組barcode資料
        var print_list = [];

        var print_temp = self.getPrintList();

        print_temp.forEach(function (list) {
          print_list = print_list.concat(list);
        });

        self.printDownloadOkBtn(print_list, 'B', function (info) {
          var barcode_map = {};

          info.forEach(function (f) {

            barcode_map[f.caseSetGuid] = {
              barcode: f.barcode,
              totalPage: f.totalPage
            };

          });

          //儲存
          self.service.saveCaseData(barcode_map);
          //送出預審
          self.service.submitCaseData(lcFileList, submitMode);

          resolve();

        });

      } else {

        //amlop狀態回復成未處理
        if (submitMode == 'preReview'){
          self.service.setNotSaveDataByKey('amlStatus', '1');
        }

        //儲存
        self.service.saveCaseData();
        //送出預審
        self.service.submitCaseData(lcFileList, submitMode);

        resolve();

      }
    },
    // 下載(會出彈窗)
    callDownloadCaseSet: function () {
      this.printDownloadWindow('D');
    },
    // 列印(會出彈窗)
    callPrintCaseSet: function () {
      this.printDownloadWindow('P');
    },
    // 下載列印彈窗
    printDownloadWindow: function (code) {
      var self = this;

      var fs = self.formSettings['printDownloadMpsBtn'];

      var temp = self.getPrintList();

      fs.content[2][0].options = temp;

      var html = self.createForm(fs).prop('outerHTML');

      $.window(html, fs['title' + code], fs['ok' + code], function () {
        var v = $('#' + fs.content[2][0].id).getMcuVal();

        v = v.join('');

        var info = [];

        for (var i = 0; i < temp.length; i++) {

          var t = temp[i];

          for (var j = 0; j < t.length; j++) {

            var f = t[j];

            if (v.indexOf(f.id) != -1) {
              info.push(f);
            }

          }

        }
        var status = self.service.getCaseData().status;
        if (status != '7' && code == 'P') {

          var p = katctbc.popup['printMpsBtn'];

          setTimeout(function () {

            $.dialog(p.text, p.title, p.ok, p.nok, null,
              function () {
                self.printDownloadOkBtn(info, code);
              },
              function () {
                var fs = katctbc.popup['preReviewAlert'];

                $.dialog(fs.text, fs.title, fs.ok, fs.nok, null, function () {

                  //先讓彈窗關閉
                  setTimeout(function(){
                    //列印提交
                    self.printSubmit(self);
                  }, -1);
                  

                });
                
              }, ['2', '3', '6'].indexOf(status) == -1);

          }, -1);

          return;
        }

        self.printDownloadOkBtn(info, code);

      }, '90%');

      setTimeout(function () {
        var $all = $('#' + fs.content[0][0].id).find('input');//全選

        var $options = $('#' + fs.content[2][0].id).find('input');//選項

        var $imgs = $('#' + fs.content[2][0].id).find('img');//小三角

        //點擊全選
        $all.click(function () {
          if (!$(this).prop('checked')) {
            $options.each(function (i, e) {
              $(e).prop('checked', false);
            });
            return;
          }

          $options.each(function (i, e) {
            $(e).prop('checked', true);
          });

        });

        //點選項
        $options.click(function () {
          var $this = $(this);
          var idx = $this.parents('[katType=katCheckbox]').prevAll('[katType=katCheckbox]').length;

          if (idx % 2 == 0) {//點第一層
            if (!$this.prop('checked')) {//取消選取
              //取消全選選取
              $all.prop('checked', false);
              $this.parents('[katType=katCheckbox]').next().find('input').each(function (i, e) {
                $(e).prop('checked', false);
              });
              return;
            }
            //第二層要全選
            $this.parents('[katType=katCheckbox]').next().find('input').each(function (i, e) {
              $(e).prop('checked', true);
            });
          } else {//點第二層
            if (!$this.prop('checked')) {//取消選取
              //取消全選選取
              $all.prop('checked', false);

              //取消第一層選取
              $this.parents('[katType=katCheckbox]').prev().find('input').prop('checked', false);
            }
          }
        });

        //點三角形
        $imgs.click(function () {
          $(this).next().next().katToggle();
        });
      }, -1);
    },
    /**
     * 產生可列印的單據清單
     * @returns 可列印的清單
     */
    getPrintList: function () {
      var self = this;

      var result = [];

      ['applyDocForm', 'tipDocForm'].forEach(function (key) {

        var lists = self.service.getFormListByPageId(key);

        lists.forEach(function (list, i) {

          result[i] = result[i] || [];

          list.filter(function (f) {

            return f.isMax == 'Y';

          }).forEach(function (form) {

            if (!form.disabled) {
              result[i].push(form);
            }

          });

        });

      });

      return result;
    },
    // 下載列印彈窗ok按鈕
    printDownloadOkBtn: function (info, code, callback) {
      var self = this;

      myLoading(katctbc.msg['printDownload' + code]);

      var printDownload1 = $('#printDownload');

      if (printDownload1.length == 0) {
        $('body').append('<div id="printDownload" style="display:flex;"></div>');
        printDownload1 = $('#printDownload');
      }

      var caseNo = self.service.getCaseData().caseNo;
      var status = self.service.getCaseData().status;

      info = info.map(function (f) {

        var btn_word = (self.service.getSysMenuByValue('1004', f.katformid || f.formid) || {}).flag05 || f.katformid || f.formid;
        
        var has_diff = self.service.getVerCompareData(true).length > 0;;

        var docNo = f.katformid || f.formid;
        var caseSet = f.caseSet || 1;
        var serialNo = f.serialNo;

        // 2021/12/10等需求確認再刪掉
        //如果已經列印提交 列印時要判斷單據有無異動 有的話要長一版去產條碼
        // if (status == '7'){
        //   var key = docNo + caseSet + serialNo;
        //   has_diff = self.service.verCompare(key, katctbc.caseNowVer - 1, katctbc.caseNowVer).diff.length > 0;
        // }
 
        return {
          caseNo: caseNo,
          docNo: docNo,
          caseNowVer: (katctbc.caseNowVer + ((katctbc.caseVer == 1 || has_diff) ? 0 : -1)),
          caseSet: caseSet,
          btnid: f.id,
          caseSetGuid: f.caseSetGuid,
          num: f.num || 1,
          serialNo: serialNo,
        };

      });

      info.forEach(function (f) {

        var btnid = f.btnid;

        var $btn = katJqobject['MpsDocsButtons'][btnid];

        if (!$btn) {
          return;
        }

        var obj = null;

        if ($btn.attr('katformid')) {

          obj = new Mpsform({
            $parent: printDownload1,
            id: btnid + '_printDownload1',
            katformid: $btn.attr('katformid'),
            caseSet: btnid.split('_')[1],
            dataKey: $btn.attr('guid'),
            dataList: [self.service.getFormSetByMpsformId($btn.attr('katformid'))],
            serialNo: f.serialNo,
            idPrintMode: true,
          });

        } else if ($btn.attr('formid')) {

          var guid = $btn.attr('guid');

          obj = new MpsDocForm({
            $parent: printDownload1,
            id: btnid + '_printDownload',
            formid: $btn.attr('formid'),
            btnid: btnid,
            dataKey: guid,
            serialNo: f.serialNo
          });
        }

        obj.init();

      });

      var newCallBack = function (barcode_result) {

        if (callback) {
          callback(info);
        }

      };

      self.printDownload(printDownload1.children(), code, false, newCallBack, info);

    },
    // 列印版本比對(單一單據或多份)
    printVerCompare: function (data, code) {
      var self = this;

      var fs = katctbc.elements.forms['printVerCompare'];

      fs.content[1][0].value = data;

      var html = self.createForm(fs).prop('outerHTML');

      $.window(html, fs['title' + code], null, null, '1640px');

      setTimeout(function () {
        // 點擊後，可選擇將單據列印於同一張或是分別列印於不同張；或是列印單一文件版本比對報表。
        $('#printAllMpsBtn').click(function (e) {
          //選擇列印模式彈窗
          fs = self.formSettings['printVerCompareAsk'];

          html = self.createForm(fs).prop('outerHTML');

          var che = fs.content[1][0];

          $.window2(html, fs.title, fs.ok, function () {
            var $che = $('#' + che.id);
            var v = $che.attr('value');
            switch (v) {
              case '1'://單據列印於同一張
                pdfTool.printComapre($('#katVerCompares').find('.bg-white').toArray().map(function (ele) { return $(ele).find('img').toArray() }), '0');
                break;
              case '2'://單據分別列印於不同張
                pdfTool.printComapre($('#katVerCompares').find('.bg-white').toArray().map(function (ele) { return $(ele).find('img').toArray() }), '1');
                //self.printDownload($('#katVerCompares').find('.bg-white'), 'P', true);
                break;
              case '3'://列印版本比對報表
                $('#verCompare').katTrigger('mouseover');
                $('#verCompare').katTrigger('mouseleave');

                $('#vcc_verCompareContent .katVerCompareData').katHide();

                $('#katVerCompares').find('.katVerCompare').each(function (i, e) {

                  var key = $(e).attr('id');
                  $('#vcc_verCompareContent').find('.katVerCompareData[key=' + key + ']').katShow();

                });

                $('#print_vc_verComparePrint').katTrigger('click');

                break;
            }
          }, '800px');

          //單選
          var $che = $('#' + che.id);

          $che.on('click', 'input', function (e) {
            $che.find('input').prop('checked', false);

            var v = $(this).attr('value');
            $che.find('input[value=' + v + ']').prop('checked', true);

            $che.attr('value', v);
          });
        });
      }, -1);
    },
    //列印提交
    printSubmit: function (self) {
      self.callSubmitCaseData('print').then(function () {

        //畫面要反灰 元素加遮罩
        if (self.service.getCaseData().status == '7') {

          katctbc.overlayFlag = true;

          $('.overlayFlag').katToggle();

          $('.overlayFlag').each(function (i, e) {

            self.showOverlay($(e).parent());

          });

          //顯示列印提交文件按鈕 隱藏列印按鈕
          $('#printMpsBtn').katHide();
          katJqobject['MpsBookmark']['preReviewPrintMpsBtn'].katShow();

          if (katctbc.caseVer > 1) {
            self.refresh();
          }

          var isFirstPrintSubmit = !self.service.getCaseData().submitPrintDate;

          var fs = katctbc.popup['preReviewFinish'];

          //因為儲存和列印提交彈窗看不到
          setTimeout(function () {
            
            //20211209 發現列印提交會關掉已儲存flag;
            katctbc.isSave = true;

            $.dialog(fs[isFirstPrintSubmit ? 'text' : 'text2'], fs.title, fs.ok, fs.nok, 'right', function () {

              setTimeout(function () {
                //開列印彈窗
                self.callPrintCaseSet();
              }, -1);

            });

          }, 100);

        }

      });

    },
    // 上傳信用狀+OP上傳文件
    uploadFileMpsBtn: function (e, self, jqobj) {

      var files = jqobj[0].files;

      var funType = jqobj.parents('[kattype=katButton]').attr('funtype');

      var data = self.service.getNotSaveDataByKey(funType) || [];

      self.filesUpload(funType, files, 1, [], [], []).then(function (o) {
        o.names.forEach(function (name, i) {
          data.push({
            id: o.guids[i],
            text: name,
            funname: 'fileOpenPdfViewer',
            guid: o.guids[i],
          });
        });

        self.service.setNotSaveDataByKey(funType, data);

        myEvent['docFormRefresh'].detail.formid = funType
        document.dispatchEvent(myEvent['docFormRefresh']);
      });

    },
    filesUpload: function (funType, files, caseSet, names, guids, isnews) {
      var self = this;

      return new Promise(function (resolve) {
        for (var i = 0; i < files.length; i++) {

          var guid = generateUUID().replaceAll('-', '').toUpperCase();//檔案上傳的guid要符合後台的guid規定

          var file = files[i];

          var fidx = i;

          self.service.uploadFile(funType, guid, caseSet, file).then(function (res) {
            //如果上傳失敗
            if (res.code != '200') {
              return;
            }

            names.push(file.name);

            guids.push(guid);

            isnews.push(katctbc.caseVer);

            if (fidx == files.length - 1) {
              resolve({
                names: names,
                guids: guids,
                isnews: isnews,
              });
            }
          });

        }
      });
    },
    // 用來更新現在產生的畫面會讀到的值(匯票)
    nowFormDataToViewTemplate: function (guid) {
      var self = this;

      var $ele = $('[dataKey=' + guid + ']');

      var data = $ele.getMcuVal() || {};
      data = data.edit ? data : (self.service.getBackSaveDataByKey(guid) || self.service.getSaveDataByKey(guid)) || self.service.getCaseSetGuidKey(guid).allKeyinData;

      if(!data){
        self.forceAigoData = true;
        return;
      }
      
      var columns = Object.keys(this.service.getFormColumnsByKey($ele.attr('formid')) || {});
      columns = columns.concat(Object.keys(data));
      columns.forEach(function (k) {
        if (k == 'edit') {
          return;
        }

        self.service.setNotSaveDataByKey(k, data[k]);
      });

    },
    //打開該套所有頁籤
    openWindows: function (page_id, caseSet) {
      var forms = this.service.getFormListByPageId(page_id);

      if (!forms || !forms[caseSet - 1]) {
        return;
      }

      for (var i = forms[caseSet - 1].length - 1; i >= 0; i--) {
        var e = forms[caseSet - 1][i];

        if (e.disabled || e.isMax != 'Y') {
          continue;
        }
        $('#' + e.id).katTrigger('click');

      }
    },
    closeWindows: function (page_id, caseSet) {
      var forms = this.service.getFormListByPageId(page_id);

      if (!forms || !forms[caseSet - 1]) {
        return;
      }

      for (var i = forms[caseSet - 1].length - 1; i >= 0; i--) {
        var e = forms[caseSet - 1][i];
        if (e.disabled || e.isMax != 'Y' || e.notAutoClose) {
          continue;
        }
        $('#' + e.id).data('closeWin', true).katTrigger('click');
      }
    }
  };
})();