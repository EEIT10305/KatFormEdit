// 多國語言區 ------------------------------------------------------				
// 初始化 i18n plugin
$.i18n.properties({
    path: './i18n/', // 這裡表示訪問路徑
    name: 'messages', //檔名開頭
    language: 'en_US', // 檔名語言，例如en_US
    mode: 'both' // 預設值
});

// 初始化 i18n translate 函式
$.i18n.transtale = function (msgKey) {
    try {
        return $.i18n.prop(msgKey);
    } catch (e) {
        return msgKey;
    }
}

