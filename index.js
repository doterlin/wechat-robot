var casper = require('casper').create(require('./config/capser'));
var utils = require('utils');
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var message = require('/src/lib/message');


casper.start('https://wx.qq.com/');

var initData = {
    targetMessageElements: []
};

message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);

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

        // setTimeout(function(){
        //      ts.captureSelector('./static/img/ten_second.png', 'body');
        // }, 1000*10)
    }, function(){
        ts.echo('您在一分钟未登录，程序退出！', 'ERROR');
        ts.exit();
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
            ts.echo('搜索结果大于1个，点击进入第一个...', 'INFO');
            ts.click(WXDOM.SEARCH_RESULT_ONE);
            
        } else {
            ts.echo('搜索结果为零，请确认目标微信号昵称是否在您的联系人列表中...', 'ERROR');
            ts.exit();
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
        try{
            initData.targetMessageElements = ts.getElementsInfo(WXDOM.MSG);
        }catch(e){
            initData.targetMessageElements = [];
        }
        // console.log(initData.targetMessageElements.length);

        ts.echo('已加载输入框...');
        message.send(CONST.HELLO_WORLD + '\n 现在的时间是：'+new Date().toLocaleString());
        ts.echo('发送打招呼消息...');
        // ts.sendKeys(WXDOM.CHAT_INPUT, CONST.HELLO_WORLD + '\n 现在的时间是：'+new Date().toLocaleString());
        // ts.click(WXDOM.CHAT_SEND);

        // setTimeout(function(){
        //     ts.click(WXDOM.CHAT_SEND);
        // }, 100)

    });
    
    // 监听新消息
    function loopListenNewMassage(){
        ts.echo('执行监听新消息：loopListenNewMassage()...')
        ts.unwait();
        ts.waitFor(function checkMsgChange() {
            // ts.echo('开始监听新消息：checkMsgChange()...')
            return ts.evaluate(function (MSG_SELECTOR,targetMessageElements) {
                return document.querySelectorAll(MSG_SELECTOR).length - targetMessageElements.length >= 2;
            }, WXDOM.MSG, initData.targetMessageElements);
        }, function then() {
            initData.targetMessageElements = ts.evaluate(function ( MSG_SELECTOR ) {
                return document.querySelectorAll(MSG_SELECTOR)
            }, WXDOM.MSG);

            var len = initData.targetMessageElements.length;
            ts.echo('当前对方消息数量：' + len);
            ts.echo(utils.dump(initData.targetMessageElements));
            var newMsgContent = initData.targetMessageElements[len-1].innerHTML;

            ts.echo('监听到新消息，正在回复...');
            message.send('你发送的消息："' + newMsgContent + '"\n发送时间：' + new Date().toLocaleString());
            ts.captureSelector('./static/img/newMsgContent.png', 'html');
            ts.echo('已回复...');

            loopListenNewMassage();

        }, function timeout() { }, Number.POSITIVE_INFINITY);
    }

    loopListenNewMassage();

})


//loggin error
// casper.waitForSelector('.tweet-row', function () {
//     this.captureSelector('./static/img/login_err.png', 'html');
// });

casper.run(function () {
    this.echo('程序已退出.');
    this.exit();
});