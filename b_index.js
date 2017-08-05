var casper = require('casper').create(require('./config/capser'));
var utils = require('utils');
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var message = require('/src/lib/message');

// step1
console.log('正在加载网页...')
casper.echo(require('/src/lib/logo').string);
casper.start('https://wx.qq.com/');

var initData = {
    targetMessageElementsLength: 0,
    targetMessageIds:[],
    lastMsgId: '',
};

message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);


// step2
//登录
casper.then(function () {
    var ts = this;
    qrcode.start(ts);
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

casper.on('newMsg', function(msg){
    this.echo('触发新文本消息事件，新消息：\n' + msg)
})
casper.on('exit', function(){
    this.echo('-----------------\n已退出程序！' )
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
            // try {
                var msgAttrValues = ts.getElementsAttribute(WXDOM.MSG, WXDOM.MSG_ID_ATTR);
                if(msgAttrValues.length==0){
                    return false;
                }
                var lastMsgId = JSON.parse(msgAttrValues[msgAttrValues.length-1]).msgId;
                if(initData.targetMessageIds.indexOf(lastMsgId)<0){
                    initData.lastMsgId = lastMsgId;
                    return true;
                }
                return false;
            // } catch (error) {
                // return false;
            // }

        }, function then() {
            ts.echo('-----------------------------\n监听到新消息，正在回复...');
            ts.echo('新消息id: '+initData.lastMsgId);
            ts.captureSelector('./static/img/lastNewMsgContent.png', 'html');
            initData.targetMessageIds.push(initData.lastMsgId);
            
            ts.echo('当前对方消息数量：' + initData.targetMessageIds.length);

            var newMsgContent = ts.evaluate(function ( MSG_SELECTOR, MSG_TEXT_SELECTOR) {
                //这里按元素选择器把消息分为两类，文本类和其他类
                var el_msg = document.querySelectorAll(MSG_SELECTOR);
                var el_msg_text = el_msg[el_msg.length-1].querySelectorAll(MSG_TEXT_SELECTOR);
                var len = el_msg_text.length;
                if(len == 0){
                    return '';
                }
                return el_msg_text[len-1].innerHTML;
            }, WXDOM.MSG, WXDOM.MSG_TEXT);

            if(newMsgContent){
                if(newMsgContent=="关闭小强"){
                    message.send('[玫瑰]感谢您的使用[玫瑰]\n\r([闪电]需要开启请在控制台启动程序[闪电])');
                    ts.echo('微信发出关闭口令，程序退出。')
                    this.captureSelector('exit.jpg','html');
                    return ts.exit();
                }
                ts.emit('newMsg', newMsgContent);
                message.send('您发送的消息："' + newMsgContent + '"\n\r发送时间：' + new Date().toLocaleString());
            }else{
                message.send('无法识别您发的消息。"'  + '"\n\r发送时间：' + new Date().toLocaleString());
            }
            ts.echo('-----------------------------\n已回复...');

            loopListenNewMassage();

        }, function timeout() { }, Number.POSITIVE_INFINITY);
    }

    loopListenNewMassage();
})


// casper.thenBypass(6);

casper.run(function () {
    this.captureSelector('exit.jpg','html');
    this.echo('执行完毕，程序退出.');
    this.exit();
});