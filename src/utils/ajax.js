/** 
 * 在浏览器发ajax请求并接受回脚本程序
 * @casperIns casper实例
 * @url String  ajax地址
 * @type String  请求类型，'get'或者'post'
 * @pram Object  请求参数
 * @callback Function 回调
 */

var ajax = function(casperIns, url, type, param, callback){
    if(type != 'get' && type !='post' && type!='getJSON'){
        return console.log('type不合法！')
    }

    casperIns.echo('开始Ajax ' + type +'请求: ' + url);
    casperIns.echo('Ajax参数: ' + JSON.stringify(param));
    casperIns.evaluate(function(url, type, param) {
        $[type](url, param, function(data) {
             window.wr_ajax_respond= data; 
        })
    }, url, type, param);

    casperIns.waitFor(function checkRespond() {
        return casperIns.evaluate(function() {
            return window.wr_ajax_respond;
        })
    }, function() {
        var ajaxRespond = casperIns.evaluate(function() {
            var ajaxRespond = window.wr_ajax_respond;
            window.wr_ajax_respond = null;
            return ajaxRespond;
        });

        setTimeout(function() {
            console.log('ajax callback....')
            callback && callback(ajaxRespond);
        }, 10);

    }, function() {
        casperIns.echo('请求超时...');
    }, 10000)
}

ajax.get = function(casperIns, url, param, callback){
    ajax(casperIns, url, 'get', param, callback);
}

ajax.getJSON = function(casperIns, url, param, callback){
    ajax(casperIns, url, 'getJSON', param, callback);
}

ajax.post = function(casperIns, url, param, callback){
    ajax(casperIns, url, 'post', param, callback);
}

module.exports = ajax;