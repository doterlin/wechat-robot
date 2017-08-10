var WXDOM = require('../../config/wxDom');
var message = require('../utils/message');


var hello = function (casperIns) {
    var ts = casperIns;
    
    ts.waitForSelector(WXDOM.CHAT_INPUT, function () {
        ts.echo('已加载输入框...');
        message.send(ts, CONST.HELLO_WORLD);
        ts.echo('已发送欢迎语...');
    });
}

module.exports = hello;