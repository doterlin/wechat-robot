/*处理二维码和登录*/
var execFile = require("child_process").execFile;
var WXDOM = require('../../config/wxDom');
var qrcode = {};

//登录是否成功处理
function isLogin(casperIns) {
    var ts = casperIns;
    ts.waitForSelector(WXDOM.LOGIN_BODY, function () {
        ts.captureSelector('./static/img/login_success.png', 'html');
        ts.echo('登录成功！');
    }, function () {
        ts.echo('您在一分钟未登录或者二维码加载失败，程序退出！', 'ERROR');
        ts.exit();
    }, 60 * 1000);
}


//开始生成和处理二维码
qrcode.start = function (casperIns) {
    var ts = casperIns;
    var qrUrl = ts.getElementAttribute(WXDOM.QR_CODE, 'src');

    ts.echo('正在加载二维码...');
    ts.waitForResource(qrUrl, function () {
        ts.captureSelector('./static/img/qr.jpg', '.login_box', {
            format: 'jpg',
            quality: 100
        });
        ts.echo('已保存二维码，路径："static/img/qr.jpg".\n正在使用默认软件打开二维码，请用手机微信扫一扫确认登录 (若没有请手动打开)');
        execFile("node", ["./src/lib/open.js"], null);

        isLogin(ts);
    }, function () { }, 120 * 1000);
}

module.exports = qrcode;