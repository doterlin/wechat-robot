/*发送消息模块*/
var WXDOM = require('../../config/wxDom');

var message = {};

message.send = function(casperIns, msg){
    if (!casperIns.visible(WXDOM.CHAT_INPUT) || !casperIns.visible(WXDOM.CHAT_INPUT)) {
        casperIns.captureSelector('./static/img/sendMessageError.png', 'html');
        return casperIns.echo("Module message:输入框或者发送按钮未加载！");
    } 
    try {
        casperIns.sendKeys(WXDOM.CHAT_INPUT, msg);
        casperIns.click(WXDOM.CHAT_SEND);
    } catch (error) {
        console.log('Module message: 发送消息失败-' + error.message, 'ERROR')
    }
}

module.exports = message;