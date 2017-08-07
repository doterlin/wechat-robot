/** 
 * 在浏览器发ajax请求并接受回脚本程序
 * @capserIns casper实例
 * @url String  ajax地址
 * @type String  请求类型，'get'或者'post'
 * @pram Object  请求参数
 * @callback Function 回调
 */

var ajax = function(capserIns, url, type, param, callback){
    console.log('!!!!!!!!!!!!ajax....');
    if(type != 'get' || type !='post'){
        return console.log('type不合法！')
    }
    var timestamp = 'resData';

    console.log('timestamp:' + timestamp);
    casperIns.evaluate(function(resource, type, param, timestamp) {
        $[type](resource, param, function(data) {
             window.wr_ajax_respond={};
             window.wr_ajax_respond[timestamp] = data; })
    }, url, type, param, timestamp);

    casperIns.waitFor(function checkRespond() {
        return casperIns.evaluate(function(timestamp) {
            return window.wr_ajax_respond[timestamp]
        },timestamp)
    }, function() {
        console.log('ajax then....')
        var ajaxRespond = casperIns.evaluate(function(timestamp) {
            var ajaxRespond = window.wr_ajax_respond[timestamp];
            window.wr_ajax_respond[timestamp] = null;
            return ajaxRespond;
        }, timestamp);

        setTimeout(function() {
            console.log('ajax callback....')
            callback && callback(ajaxRespond);
        }, 10);

    }, function() {
        capserIns.echo('请求超时...');
    }, 10000)
}

// ajax.get = function(capserIns, url, param, callback){
//     ajax(capserIns, url, 'get', param, callback);
// }

// ajax.post = function(capserIns, url, param, callback){
//     ajax(capserIns, url, 'post', param, callback);
// }

module.exports = ajax;