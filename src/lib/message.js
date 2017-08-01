var message = {}, _capser = '', _chatInput, _chatSend;

message.init = function(capser, chatInput, chatSend){
    _capser = casper;
    _chatInput = chatInput; 
    _chatSend = chatSend; 
}

message.send = function(msg){
    try {
        _capser.sendKeys(_chatInput, msg);
        _capser.click(_chatSend);
    } catch (error) {
        _capser.echo('Module message: 发送消息失败-' + error.message, 'ERROR')
    }
}

module.exports = message;