var message = require('../utils/message');

module.exports = {
    '关闭': function (msgContent, casperIns) {
        message.send(casperIns, '[玫瑰]感谢您的使用[玫瑰]\n\r([闪电]需要开启请在控制台启动程序[闪电])');
        casperIns.echo('微信发出关闭口令，程序退出。')
        return casperIns.exit();
    },

    '报时': function (msgContent, casperIns) {
        message.send(casperIns, '服务器的时间是：' + new Date().toLocaleString());
    }
}