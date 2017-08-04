//微信web版需用的各个选择器，方便更新
var testByMe = false,
massageClass = testByMe? '.me': '.you',
MSG_ID_ATTR  = 'data-cm';

module.exports = {
    //登录
    'QR_CODE'             : '.qrcode .img',
    'LOGIN_BODY'          : 'body.loaded',
    'LOGIN_LOADING'       : '.chat_list .chat_list .ico_loading',

    //搜索指定微信
    'SEARCH_INPUT'        : '.frm_search',
    'SEARCH_RESULT'       : '.recommendation',
    'SEARCH_RESULT_ONE'   : '.recommendation .contact_item',
    'SEARCH_RESULT_FRIEND': '.recommendation .nickname',

    //输入框
    'CHAT_NO_SELECT'      : '.chat_bd .web_wechat_nomes_icon',
    'CHAT_INPUT'          : '#editArea',
    'CHAT_SEND'           : '.btn.btn_send',

    //消息相关
    'MSG_ID_ATTR'         : MSG_ID_ATTR,
    'MSG'                 : '.chat_bd ' + massageClass + ' [' + MSG_ID_ATTR + ']:not(.avatar)',
    'MSG_TEXT'            : '.chat_bd ' + massageClass + ' [' + MSG_ID_ATTR + ']:not(.avatar) .js_message_plain',
    'MSG_IMG'             : '.chat_bd ' + massageClass + ' [' + MSG_ID_ATTR + ']:not(.avatar) img'
}