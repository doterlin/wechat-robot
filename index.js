var casper = require('casper').create(require('./config/capser'));
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var searchWx = require('/src/lib/searchWx');
var listen = require('/src/lib/listen');
var machine = require('/src/lib/machine');

// step1
casper.echo(require('/src/lib/logo').string);
console.log('正在加载网页...');

casper.start('https://wx.qq.com/');


//二维码与登录
casper.then(function () {
    qrcode.start(this);
});

// 等待加载聊天信息
casper.then(function () {
    this.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
        this.echo("加载最近聊天信息完毕！");
    })
})

// 搜索目标微信号
casper.then(function () {
    searchWx(this, CONST.TARGET_NICK)
});

// 发送欢迎语
casper.then(function () {
    hello(this);
})

// 监听新消息
casper.then(function(){
    listen.start(this);
})

//处理新消息
casper.on('newMsg', function(msg, isTextMsg){
    this.echo('触发新文本消息事件，新消息：\n' + msg);
    machine.reply(msg, isTextMsg, this);
})

casper.on('exit', function(){
    this.echo('-----------------\n已退出程序！' )
})

casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});