var WXDOM = require('../../config/wxDom');
var message = require('../utils/message');
var turing = require('./turing');
var exactDirective = require('../directive/exact');
var fuzzyDirective = require('../directive/fuzzy');

var machine = {};

machine.reply = function(msg, isTextMsg, casperIns){
    console.log('正在处理消息... ');

    //非文字类消息
    if(!isTextMsg) return dealUnknownMsg(casperIns);

    //是否是指令
    if(isDiretive(msg, casperIns)) return;
    
    //非指令消息交给第三方机器人
    return dealByMachine(casperIns, msg);
}

//判断是否是指令
function isDiretive(msg, casperIns){
    for(var diretive in exactDirective){
        if(diretive == msg){
            casperIns.echo('接受到精确匹配指令 ' + diretive + ' ，正在处理...');
            exactDirective[diretive](msg, casperIns);
            return true;
        }
    }

    for(var regex in fuzzyDirective){
        if(eval(regex).test(msg)){
            casperIns.echo('接受到模糊匹配指令 ' + regex + ' ，正在处理...')
            fuzzyDirective[regex](msg, casperIns, regex);
            return true;
        }
    }

    return false;
}

function dealUnknownMsg(casperIns){
    message.send(casperIns, '无法识别您发的消息。' + '\n\r发送时间：' + new Date().toLocaleString());
}

function dealByMachine(casperIns, msg){
    turing(casperIns, msg)
}

module.exports = machine;