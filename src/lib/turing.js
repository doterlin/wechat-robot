var CONST = require('../../config/const');
var message = require('./message');
var ajax = require('../utils/ajax');

var turing = function (casperIns, msg) {
    var param = {
        "key": CONST.TURING_APIKEY,
        "info": msg,
        "userid": CONST.TARGET_NICK
    }

    console.log('turing....')

    //在页面使用ajax请求
    casperIns.evaluate(function(resource, param) {
        $.get(resource, param, function(data) { window.to_casper_turing = data; })
    }, CONST.TURING_URL, param );

    casperIns.waitFor(function check() {
        return casperIns.evaluate(function() {
            return window.to_casper_turing
        })
    }, function() {
        var res = casperIns.evaluate(function() {
            var turing = window.to_casper_turing;
            window.to_casper_turing = null;
            return turing;
        });

        console.log('turing res:' + JSON.stringify(res))
        var errorCode = [40001,40002,40004,40007], replyMsg = '';

        if(errorCode.indexOf(res.code) >= 0){
            return message.send(casperIns, '我出错啦，暂时不能回答您。');
        }

        replyMsg += res.text || '';
        if(res.url){
            replyMsg += '\n\r' + res.url;
        }

        if(res.list){
            replyMsg += '\n\r\n\r';
            res.list.forEach(function(item){
                replyMsg += !item.source? '' : ('【' + item.source + '】');
                replyMsg += (item.article || '');
                replyMsg += !item.name? '' : ('【' + item.name + '】');
                replyMsg += !item.info? '' :  ('\n\r' + item.info);
                replyMsg += !item.detailUrl? '' : ('\n\r' + item.detailUrl);
                replyMsg += '\n\r\n\r';
            })
        }
        
        message.send(casperIns, replyMsg);

    }, function() {
        console.log('请求天气超时...')
    }, 10000)

}


module.exports = turing;

