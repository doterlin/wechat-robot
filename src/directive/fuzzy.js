var weather = require('./explain/weather');
var baike   = require('./explain/baike');
var mPhone  = require('./explain/mPhone');
var ip      = require('./explain/ip');

module.exports = {
    //天气
    '/天气/g': weather,

    //百科
    '/百科/g': baike,

    //手机查询
    '/^1[34578]\d{9}$/g': mPhone,

    //ip地址
    '/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g': ip,

    '/彩票/': function (msgContent, casperIns) {
       //'此指令正在开发...'
    }
}