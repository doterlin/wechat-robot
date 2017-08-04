/*处理二维码和登录*/
var WXDOM = require('../../config/wxDom');
var qrcode = {};


//获取二维码
qrcode.get = function (casperIns) {
    var ts = casperIns;
    var qrUrl = ts.getElementAttribute(WXDOM.QR_CODE, 'src');

    ts.echo('正在加载二维码...');
    ts.waitForResource(qrUrl, function () {
        ts.captureSelector('./static/img/qr.jpg', '.login_box', {
            format: 'jpg',
            quality: 100
        });
        ts.echo('以保存二维码："static/img/qr.jpg".\n请按上面的路径打开二维码并在一分钟内在手机上确认登录...');
    });

}

//登录是否成功处理
qrcode.isLogin = function (casperIns) {
    var ts = casperIns;
    ts.waitForSelector(WXDOM.LOGIN_BODY, function () {
        ts.captureSelector('./static/img/login_success.png', 'html');
        ts.echo('登录成功！');
    }, function () {
        ts.echo('您在一分钟未登录，程序退出！', 'ERROR');
        ts.exit();
    }, 60 * 1000);
}

//开始生成和处理二维码
qrcode.start = function (casperIns) {
    qrcode.get(casperIns);
    qrcode.isLogin(casperIns);
}

module.exports = qrcode;