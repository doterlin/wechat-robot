var WXDOM = require('../../config/wxDom');
var message = require('./message');

message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);

var hello = function (casperIns) {
    var ts = casperIns;
    ts.waitForSelector(WXDOM.CHAT_INPUT, function () {
        ts.echo('已加载输入框...');
        message.send(CONST.HELLO_WORLD);
        ts.echo('已发送欢迎语...');
    });
}

module.exports = hello;