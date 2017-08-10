var casper   = require('casper').create(require('./config/casper'));
var CONST    = require('./config/const');
var WXDOM    = require('./config/wxDom');
var qrcode   = require('./src/lib/qrcode');
var searchWx = require('./src/lib/searchWx');
var listen   = require('./src/lib/listen');
var hello    = require('./src/lib/hello');
var machine  = require('./src/lib/machine');

// welcome
casper.echo(require('./src/lib/logo').string);
console.log('正在加载网页...');
casper.start(CONST.URL);

//二维码与登录
casper.then(function () {
    qrcode.start(this);
});

// 等待加载聊天信息 & 搜索目标微信号

casper.then(function () {
    casper.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
        this.echo("加载最近聊天信息完毕！");
        searchWx(this, CONST.TARGET_NICK)
    }, function () {
        this.echo('加载聊天信息失败!');
        this.exit();
    }, 30 * 1000)
})

// 发送欢迎语
casper.then(function () {
    hello(this);
})

// 监听新消息
casper.then(function () {
    listen.start(this);
})

//处理新消息
casper.on('newMsg', function (msg, isTextMsg) {
    this.echo('触发新文本消息事件，新消息：\n  “' + msg + '”');
    machine.reply(msg, isTextMsg, this);
    this.wait(10, function () {
        this.echo('已回复');
    })
})

casper.on('exit', function () {
    this.echo('-----------------\n已退出程序！')
});

casper.on("page.error", function(msg, trace) {
     this.echo("Browser error: " + msg, "ERROR");
});

casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});