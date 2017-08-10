var casper = require('casper').create(require('./config/casper'));
var weather = require('./src/directive/explain/weather');
var weather = require('./src/directive/explain/baike');

// step1
console.log('正在加载网页...');

casper.start('https://wx.qq.com/');

//二维码与登录
casper.then(function () {
    baike('广州', this)
});

casper.run();