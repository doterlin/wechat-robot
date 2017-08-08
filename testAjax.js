var casper = require('casper').create(require('./config/casper'));
var weather = require('./src/directive/explain/weather');

// step1
console.log('正在加载网页...');

casper.start('https://wx.qq.com/');

//二维码与登录
casper.then(function () {
    weather('广州天气', this)
});

casper.run();