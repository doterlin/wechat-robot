var message = require('../lib/message');
var weather = require('./fuzzy/weather');

module.exports = {
    //天气
    '/天气/': weather,

    //百科
    '/百科/': function() {
        //'http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=API&bk_length=600';
        // {
        //     "id": 16068,
        //     "subLemmaId": 5889234,
        //     "newLemmaId": 10154,
        //     "key": "API",
        //     "desc": "应用程序编程接口",
        //     "title": "api",
        //     "abstract": "API（Application Programming Interface,应用程序编程接口）是一些预先定义的函数，目的是提供应用程序与开发人员基于某软件或硬件得以访问一组例程的能力，而又无需访问源码，或理解内部工作机制的细节。"
        // }
    },

    //手机查询
    '/^1[34578]\d{9}$/': function() {
        //https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=15717501945
        // __GetZoneResult_ = {
        //     mts: '1510363',
        //     province: '海南',
        //     catName: '中国移动',
        //     telString: '15103637664',
        //     areaVid: '30520',
        //     ispVid: '3236139',
        //     carrier: '海南移动'
        // }
    },

    '/火车票/': function(msgContent, casperIns) {
        message.send(casperIns, '此指令正在开发...');
    },

    '/彩票/': function(msgContent, casperIns) {
        message.send(casperIns, '此指令正在开发...');
    }
}



function formatWeather(weather) {
    // console.log(JSON.stringify(weather));
    // var weather = typeof(weather) == 'Object'? weather: JSON.parse(weather);
    weather = weather.data;
    var str = '';
    for (var i in weather.forecast[0]) {
        if (i == 'data') {
            str += weather.forecast[0][i] + "\n\r";
        } else {
            str += weather.forecast[0][i] + '  '
        }
    }

    str += '\n\r';

    for (var i in weather.forecast[1]) {
        if (i == 'data') {
            str += weather.forecast[1][i] + "\n\r";
        } else {
            str += weather.forecast[1][i] + '  '
        }
    }

    if (weather.ganmao) {
        str += '\n\r\n\r[玫瑰]' + weather.ganmao + '[玫瑰]';
    }
    return str;
}