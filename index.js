var casper = require('casper').create(require('./config/capser'));
var utils = require('utils');
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var message = require('/src/lib/message');

// step1
casper.start('https://wx.qq.com/');

var initData = {
    targetMessageElementsLength: 0
};

message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);

console.log('正在加载网页...')
// var _echo = casper.echo;
// console.log(_echo)
// casper.echo = function(msg){
//     _echo('\n' + msg);
// }


// step2
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

// step3
casper.then(function () {
    this.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
        this.echo("加载最近聊天信息完毕！");
    })
})

// step4
// 搜索目标微信号
casper.then(function () {
    var ts = this;

    ts.waitForSelector(WXDOM.SEARCH_INPUT, function () {
        ts.echo('好友搜索框已加载！');
        ts.sendKeys(WXDOM.SEARCH_INPUT, CONST.TARGET_NICK);
        // ts.captureSelector('./static/img/SEARCH_INPUT.png', 'html');
    });

    ts.waitForSelector(WXDOM.SEARCH_RESULT, function(){
        
        ts.waitForSelector(WXDOM.SEARCH_RESULT_ONE, function(){
            ts.echo('已加载搜索结果：./static/img/SEARCH_RESULT.png');
            ts.click(WXDOM.SEARCH_RESULT_ONE+':first-child');
            ts.captureSelector('./static/img/SEARCH_RESULT.png', 'html');
        }, function(){
            ts.echo('搜索结果为零，请确认目标微信号昵称是否在您的联系人列表中...', 'ERROR');
            ts.captureSelector('./static/img/SEARCH_RESULT.png', 'html');
            ts.exit();
        }, 10*1000)

        // this.wait(4000, function(){

        //     ts.echo('已加载搜索结果：./static/img/SEARCH_RESULT.png');
        //     ts.captureSelector('./static/img/SEARCH_RESULT.png', 'html');
            
        //     if (ts.exists(WXDOM.SEARCH_RESULT_ONE)) {
        //         ts.echo('搜索结果大于1个，点击进入第一个...', 'INFO');
        //         ts.click(WXDOM.SEARCH_RESULT_ONE);
                
        //     } else {
        //         ts.echo('搜索结果为零，请确认目标微信号昵称是否在您的联系人列表中...', 'ERROR');
        //         // ts.exit();
        //     }

        //     setTimeout(function () {
        //         ts.captureSelector('./static/img/CLICK_SEARCH_RESULT.png', 'html');
        //     }, 4000)
        // })
    })
});

// step5
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
        message.send(CONST.HELLO_WORLD + '\n\r现在的时间是：'+new Date().toLocaleString());
        ts.echo('已发送欢迎语...');
        // ts.sendKeys(WXDOM.CHAT_INPUT, CONST.HELLO_WORLD + '\n 现在的时间是：'+new Date().toLocaleString());
        // ts.click(WXDOM.CHAT_SEND);

        // setTimeout(function(){
        //     ts.click(WXDOM.CHAT_SEND);
        // }, 100)

    });

})

// step6
casper.then(function(){
    var ts = this;
     // 监听新消息
    function loopListenNewMassage(){
        ts.echo('执行监听新消息：loopListenNewMassage()...')
        ts.unwait();
        ts.waitFor(function checkMsgChange() {
            // ts.echo('开始监听新消息：checkMsgChange()...')
            return ts.evaluate(function (MSG_SELECTOR,targetMessageElementsLength) {
                return document.querySelectorAll(MSG_SELECTOR).length - targetMessageElementsLength >= 1;
            }, WXDOM.MSG, initData.targetMessageElementsLength);
        }, function then() {
            initData.targetMessageElementsLength = ts.evaluate(function ( MSG_SELECTOR ) {
                return document.querySelectorAll(MSG_SELECTOR).length
            }, WXDOM.MSG);

            // var len = initData.targetMessageElements.length;
            ts.echo('当前对方消息数量：' + initData.targetMessageElementsLength);
            
            var newMsgContent = ts.evaluate(function ( MSG_SELECTOR ) {
                var el = document.querySelectorAll(MSG_SELECTOR);
                var len = el.length;
                return el[len-1].innerHTML;
            }, WXDOM.MSG);

            ts.echo('监听到新消息，正在回复...');
            message.send('您发送的消息："' + newMsgContent + '"\n\r发送时间：' + new Date().toLocaleString());
            ts.captureSelector('./static/img/newMsgContent.png', 'html');
            ts.echo('已回复...');

            // ts.bypass(6);
            this.wait(10, function () {
                loopListenNewMassage();
            })

        }, function timeout() { }, Number.POSITIVE_INFINITY);
    }

    loopListenNewMassage();
})


//loggin error
// casper.waitForSelector('.tweet-row', function () {
//     this.captureSelector('./static/img/login_err.png', 'html');
// });

casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});