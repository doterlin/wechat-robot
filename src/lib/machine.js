var WXDOM = require('../../config/wxDom');
var message = require('./message');
message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);

var machine = {};

machine.reply = function(msg, isTextMsg){
    //非文字类消息
    if(!isTextMsg) return dealUnknownMsg();

    //是否是指令
    if(isDiretive(msg)) return;
    
    
    dealByMachine(msg);
}

//判断是否是指令
function isDiretive(msg){
    return false;
}

function dealUnknownMsg(){
    message.send('无法识别您发的消息。' + '\n\r发送时间：' + new Date().toLocaleString());
}

function dealByMachine(msg){
    message.send('您发送的消息："' + msg + '"\n\r发送时间：' + new Date().toLocaleString());
}