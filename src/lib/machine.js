var WXDOM = require('../../config/wxDom');
var message = require('./message');
var appDirective = require('../directive/app');
var fuzzyDirective = require('../directive/fuzzy');

var machine = {};

machine.reply = function(msg, isTextMsg, casperIns){
    message.init(casper, WXDOM.CHAT_INPUT, WXDOM.CHAT_SEND);

    //非文字类消息
    if(!isTextMsg) return dealUnknownMsg();

    //是否是指令
    if(isDiretive(msg)) return;
    
    dealByMachine(msg);
}

//判断是否是指令
function isDiretive(msg, casperIns){
    for(var diretive in appDirective){
        if(diretive == msg){
            appDirective[diretive](msg, message, casperIns);
            return true;
        }
    }

    for(var diretive in fuzzyDirective){
        if(eval(diretive).test(msg)){
            fuzzyDirective[diretive](msg, message, casperIns);
            return true;
        }
    }

    return false;
}

function dealUnknownMsg(){
    message.send('无法识别您发的消息。' + '\n\r发送时间：' + new Date().toLocaleString());
}

function dealByMachine(msg){
    message.send('您发送的消息："' + msg + '"\n\r发送时间：' + new Date().toLocaleString());
}