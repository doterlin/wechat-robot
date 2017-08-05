var listen = {};

var initData = {
    targetMessageIds: [],
    lastMsgId: ''
};

listen.then = function (casperIns) {
    var ts = casperIns;
    ts.echo('-----------------------------\n监听到新消息，正在回复...');
    ts.echo('新消息id: ' + initData.lastMsgId);
    ts.captureSelector('./static/img/lastNewMsgContent.png', 'html');
    initData.targetMessageIds.push(initData.lastMsgId);

    ts.echo('当前对方消息数量：' + initData.targetMessageIds.length);

    var newMsgContent = ts.evaluate(function (MSG_SELECTOR, MSG_TEXT_SELECTOR) {
        //这里按元素选择器把消息分为两类，文本类和其他类
        var el_msg = document.querySelectorAll(MSG_SELECTOR);
        var el_msg_text = el_msg[el_msg.length - 1].querySelectorAll(MSG_TEXT_SELECTOR);
        var len = el_msg_text.length;
        if (len == 0) {
            return '';
        }
        return el_msg_text[len - 1].innerHTML;
    }, WXDOM.MSG, WXDOM.MSG_TEXT);

    if (newMsgContent) {
        ts.emit('newMsg', newMsgContent, true);
        // message.send('您发送的消息："' + newMsgContent + '"\n\r发送时间：' + new Date().toLocaleString());
    } else {
        ts.emit('newMsg', newMsgContent, false);
        // message.send('无法识别您发的消息。' + '\n\r发送时间：' + new Date().toLocaleString());
    }
}

listen.start = function (casperIns) {
    var ts = casperIns;
    // 监听新消息
    function loopListenNewMassage() {
        ts.echo('执行监听新消息：loopListenNewMassage()...')
        ts.unwait();
        ts.waitFor(function checkMsgChange() {
            var msgAttrValues = ts.getElementsAttribute(WXDOM.MSG, WXDOM.MSG_ID_ATTR);
            if (msgAttrValues.length == 0) {
                return false;
            }
            var lastMsgId = JSON.parse(msgAttrValues[msgAttrValues.length - 1]).msgId;
            if (initData.targetMessageIds.indexOf(lastMsgId) < 0) {
                initData.lastMsgId = lastMsgId;
                return true;
            }
            return false;

        }, function then() {
            listen.then(ts);
            this.wait(10, loopListenNewMassage);

        }, function timeout() { }, 1000 * 60 * 60 * 24 * 365);
    }

    loopListenNewMassage();
}

module.exports = listen;