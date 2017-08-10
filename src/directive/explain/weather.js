var ajax = require('../../utils/ajax');
var message = require('../../utils/message');

var formatWeather = function(local, weather) {
    var weather = weather.data;
    var str = '【' + local +'天气】\n\r\n\r';
    for (var i in weather.forecast[0]) {
        if (i == 'date') {
            str += '【' + weather.forecast[0][i] + "】\n\r";
        } else {
            str += weather.forecast[0][i] + '  '
        }
    }

    str += '\n\r';

    for (var i in weather.forecast[1]) {
        if (i == 'date') {
            str += '【' + weather.forecast[1][i] + "】\n\r";
        } else {
            str += weather.forecast[1][i] + '  '
        }
    }

    if (weather.ganmao) {
        str += '\n\r\n\r[玫瑰]' + weather.ganmao + '[玫瑰]';
    }
    return str;
}

var weather = function(msgContent, casperIns, regex) {
    var local = msgContent.replace(/ |天气/, '');
    var resource = 'http://wthrcdn.etouch.cn/weather_mini?city=' + encodeURIComponent(local);

    ajax.get(casperIns, resource, {}, function(res){
        var weather = JSON.parse(res);
        if (weather.status == 1000) {
            message.send(casperIns, formatWeather(local, weather));
        } else {
            message.send(casperIns, '未查找到相关天气信息。请尝试输入格式如"广州天气"。')
        }
    });
   
}

module.exports = weather;