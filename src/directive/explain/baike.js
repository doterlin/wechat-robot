var ajax = require('../../utils/ajax');
var message = require('../../utils/message');

module.exports = function(msgContent, casperIns, regex) {
    var key = msgContent.replace(/ |百科/g, '');
    if(!key){
        return message.send(casperIns, '请输入要查找的内容。');
    }
    casperIns.echo('正在查找百科：' + key);
    var resource = 'http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_length=600&bk_key=' + encodeURIComponent(key);
    resource += "&callback=?";  //此接口需跨域处理
    
    ajax.getJSON(casperIns, resource, {}, function(res){
        var str = res.title? ('【'+res.title+'】\n\r') : '';
        str += res.desc? ('描述：'+res.desc+'\n\r') : '';
        str += res.abstract || '';
        console.log(JSON.stringify(str));
        message.send(casperIns, str);
    });
}
