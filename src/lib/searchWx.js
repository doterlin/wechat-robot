/*搜索目标微信*/
var WXDOM = require('../../config/wxDom');

var searchWx = function (casperIns, wxNick) {
    var ts = casperIns;

    ts.waitForSelector(WXDOM.SEARCH_INPUT, function () {
        ts.echo('好友搜索框已加载！');
        ts.sendKeys(WXDOM.SEARCH_INPUT, CONST.TARGET_NICK);
        ts.captureSelector('./static/img/SEARCH_INPUT.png', 'html');
    }, function () {
        ts.echo('好友搜索框加载超时！')
    }, 30 * 1000);

    // ts.waitForSelector(WXDOM.SEARCH_RESULT, function(){

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
        ts.captureSelector('./static/img/SEARCH_RESULT_0.png', 'html');
        ts.echo('搜索结果为零，请确认目标微信号昵称是否在您的联系人列表中', 'ERROR');
        ts.exit();
    }, 30 * 1000)

    // })
};

module.exports = searchWx;