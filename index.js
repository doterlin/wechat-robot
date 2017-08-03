var casper = require('casper').create(require('./config/capser'));
var utils = require('utils');
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var message = require('/src/lib/message');

// step1
console.log('正在加载网页...')
casper.start('https://wx.qq.com/');

var initData = {
    targetMessageElementsLength: 0
};

message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);



// step2
//登录
casper.then(function () {
    var ts = this;
    var qrUrl = ts.getElementAttribute(WXDOM.QR_CODE, 'src');

    ts.echo('正在加载二维码...'  );
    // 获取二维码
    ts.waitForResource(qrUrl, function () {
        // ts.echo('二维码已保存. url: ' + qrUrl);
        qrcode.start(ts);
    });

    //登录成功
    ts.waitForSelector(WXDOM.LOGIN_BODY, function () {
        ts.captureSelector('./static/img/login_success.png', 'html');
        ts.echo('登录成功！');

    }, function(){
        ts.echo('您在一分钟未登录，程序退出！', 'ERROR');
        ts.exit();
    }, 60*1000);
    
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
        ts.captureSelector('./static/img/SEARCH_INPUT.png', 'html');
    });

    ts.waitForSelector(WXDOM.SEARCH_RESULT, function(){
        
        ts.waitForSelector(WXDOM.SEARCH_RESULT_FRIEND, function () {
            ts.waitForText(CONST.TARGET_NICK, function () {
                ts.echo('已加载搜索结果：./static/img/SEARCH_RESULT.png');
                ts.click(WXDOM.SEARCH_RESULT_ONE);
                ts.captureSelector('./static/img/SEARCH_RESULT.png', 'html');
            }), function () {
                ts.echo('搜索结果未出现匹配的好友..请检查目标微信号昵称是否好友', 'ERROR');
                ts.exit();
            }, 10 * 1000;
        }, function () {
            ts.echo('搜索结果为零，请确认目标微信号昵称是否在您的联系人列表中', 'ERROR');
            ts.exit();
        })

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
        message.send(CONST.HELLO_WORLD);
        ts.echo('已发送欢迎语...');

    });

})

// step6
casper.then(function(step){
    var ts = this;
    // console.log(step);
     // 监听新消息
    function loopListenNewMassage(){
        ts.echo('执行监听新消息：loopListenNewMassage()...')
        ts.unwait();
        ts.waitFor(function checkMsgChange() {
            // todo: 大约在出现14条消息后监听失效
            // 失效原因为使用了滚动条插件，DOM中认定选择器对应的元素并非真实的消息条数
            // 解决方案一：监听到一条或者发送一条都从DOM中删除
            // 解决方案二：换一种监听方式，比如尝试监听ajax请求：
            //  casper.on('page.resource.received', function(responseData) {
            //     this.echo(responseData.url);
            //  });
//             id: the number of the requested resource
// url: the url of the resource
// time: a Date object
// headers: the list of headers (list of objects {name:’‘, value:’‘})
// bodySize: the size of the received content (may increase during multiple call of the callback)
// contentType: the content type of the resource
// contentCharset: the charset used for the content of the resource (slimerjs only).
// redirectURL: if the request has been redirected, this is the redirected url
// stage: “start”, “end” or “” for intermediate chunk of data
// status: the HTTP response code (200..)
// statusText: the HTTP response text for the status (“Ok”...)
// referrer: the referer url (slimerjs only)
// body: the content, it may change during multiple call for the same request (slimerjs only).
// httpVersion.major: the major part of the HTTP protocol version (slimerjs only).
// httpVersion.minor: the minor part of the HTTP protocol version (slimerjs only).


            return ts.evaluate(function (MSG_SELECTOR, MSG_RESPOND_NUM, targetMessageElementsLength) {
                if(document.querySelectorAll(MSG_SELECTOR).length==0 && targetMessageElementsLength > 0){
                    return true;
                }
                return document.querySelectorAll(MSG_SELECTOR).length - targetMessageElementsLength >= MSG_RESPOND_NUM;
            }, WXDOM.MSG, CONST.MSG_RESPOND_NUM, initData.targetMessageElementsLength );
        }, function then() {
            ts.echo('监听到新消息，正在回复...');
            ts.captureSelector('./static/img/lastNewMsgContent.png', 'html');
            initData.targetMessageElementsLength = ts.evaluate(function ( MSG_SELECTOR ) {
                return document.querySelectorAll(MSG_SELECTOR).length
            }, WXDOM.MSG);
            ts.echo('当前对方消息数量：' + initData.targetMessageElementsLength);

            // var len = initData.targetMessageElements.length;
            
            var newMsgContent = ts.evaluate(function ( MSG_TEXT_SELECTOR ) {
                //这里按元素选择器把消息分为两类，文本类和其他类
                var el = document.querySelectorAll(MSG_TEXT_SELECTOR);
                var len = el.length;
                if(len == 0){
                    return false;
                }
                return el[len-1].innerHTML;
            }, WXDOM.MSG_TEXT);

            if(newMsgContent){
                if(newMsgContent=="关闭小强"){
                    message.send('[玫瑰]感谢您的使用[玫瑰]\n\r([闪电]需要开启请在控制台启动程序[闪电])');
                    ts.echo('微信发出关闭口令，程序退出。')
                    ts.exit()
                }
                message.send('您发送的消息："' + newMsgContent + '"\n\r发送时间：' + new Date().toLocaleString());
            }else{
                message.send('无法识别您发的消息。"'  + '"\n\r发送时间：' + new Date().toLocaleString());
            }
            ts.echo('已回复...');

            // // ts.bypass(6);
            // this.wait(10, function () {
                loopListenNewMassage();
                // ts.bypass(6);
            // })

        }, function timeout() { }, Number.POSITIVE_INFINITY);
    }

    loopListenNewMassage();
})


// casper.thenBypass(6);

casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});