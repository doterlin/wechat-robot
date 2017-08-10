var ajax = require('../../utils/ajax');
var message = require('../../utils/message');

module.exports = function(msgContent, casperIns, regex) {
    var phone = msgContent;
    var resource = 'http://whois.pconline.com.cn/ip.jsp?ip=' + msgContent;

    ajax.get(casperIns, resource, {}, function(res){
        var res = JSON.parse(res.replace('\n',''));
        var str = '【ip信息】\n\r';
        message.send(casperIns, res);
    });
}
