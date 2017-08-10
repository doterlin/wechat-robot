var ajax = require('../../utils/ajax');
var message = require('../../utils/message');

module.exports = function(msgContent, casperIns, regex) {
    var phone = msgContent;
    var resource = 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + msgContent;

    ajax.get(casperIns, resource, {}, function(res){
        var res = JSON.parse(res.replace('\n',''));
        var str = '【' + phone + ' 手机信息】\n\r\n\r';
        if (res.carrier) {
            str += res.carrier? ('运营商：' + res.carrier + '\n\r') : '';
            str += res.areaVid? ('areaVid' + res.areaVid + '\n\r') : '';
            str += res.ispVid? ('ispVid' + res.ispVid + '\n\r') : '';
        } else {
            message.send(casperIns, '未查找到相关手机信息。请确认该手机号存在。')
        }
    });
}
