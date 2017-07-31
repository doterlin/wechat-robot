var casper = require('casper').create(require('./config/capser'));
var CONST = require('./config/const')
var WXDOM = require('./config/wxDom')
var qrcode = require('./src/lib/qrcode');
var utils = require('utils');

casper.start('https://wx.qq.com/');

console.log('正在加载网页...')
// var _echo = casper.echo;
// console.log(_echo)
// casper.echo = function(msg){
//     _echo('\n' + msg);
// }

//登录
casper.then(function () {
    var ts = this;
    var qrUrl = ts.getElementAttribute(WXDOM.QR_CODE, 'src');

    ts.echo('正在加载二维码...'  );
    // 获取二维码
    ts.waitForResource(qrUrl, function () {
        ts.echo('二维码已保存. url: ' + qrUrl);
        qrcode.start(ts);
    });

    //登录成功
    ts.waitForSelector(WXDOM.LOGIN_BODY, function () {
        ts.captureSelector('./static/img/login_success.png', 'html');
        ts.echo('登录成功！');

        setTimeout(function(){
             ts.captureSelector('./static/img/ten_second.png', 'body');
        }, 1000*10)
    });
    
});

casper.then(function () {
    this.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
        this.echo("加载最近聊天信息完毕！");
    })
})

// 搜索目标微信号
casper.then(function () {
    var ts = this;

    ts.waitForSelector(WXDOM.SEARCH_INPUT, function () {
        ts.echo('好友搜索框已加载！');
        ts.sendKeys(WXDOM.SEARCH_INPUT, CONST.TARGET_NICK);
        // ts.captureSelector('./static/img/SEARCH_INPUT.png', 'html');
    });

    ts.waitForSelector(WXDOM.SEARCH_RESULT, function(){
        ts.echo('已加载搜索结果：./static/img/SEARCH_RESULT.png');
        ts.captureSelector('./static/img/SEARCH_RESULT.png', 'html');
        
        if (ts.exists(WXDOM.SEARCH_RESULT_ONE)) {
            ts.echo('搜索结果大于1个，点击进入第一个', 'INFO');
            ts.click(WXDOM.SEARCH_RESULT_ONE);
        } else {
            ts.echo('搜索结果为零...', 'ERROR');
        }

        setTimeout(function () {
            ts.captureSelector('./static/img/CLICK_SEARCH_RESULT.png', 'html');
        }, 300)
    })
});

// 操作输入框
casper.then(function () {
    var ts = this;
    ts.waitForSelector(WXDOM.CHAT_INPUT, function(){
        ts.echo('已加载输入框...');
        ts.sendKeys(WXDOM.CHAT_INPUT, CONST.HELLO_WORLD + '\n 现在的时间是：'+new Date().toLocaleString());
        ts.echo('发送打招呼消息...');
        ts.click(WXDOM.CHAT_SEND);

        // setTimeout(function(){
        //     ts.echo('发送打招呼消息...');
        //     ts.click(WXDOM.CHAT_SEND);
        // }, 100)

        // setInterval(function(){
        //     ts.echo('正在播报时间...');
        //     ts.sendKeys(WXDOM.CHAT_INPUT, '正在为您播报时间：' + new Date().toLocaleString());
        //     ts.click(WXDOM.CHAT_SEND);
        // }, 1000)
    })
})


//loggin error
// casper.waitForSelector('.tweet-row', function () {
//     this.captureSelector('./static/img/login_err.png', 'html');
// });

casper.run();