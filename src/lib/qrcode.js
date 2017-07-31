var qrcode = {};

qrcode.start = function(casperIns) {
    //截图并打开图片

    casperIns.captureSelector('./static/img/qr.jpg', '.login_box', {
        format: 'jpg',
        quality: 100
    });
    casperIns.echo('以保存二维码："static/img/qr.jpg".\n请按上面的路径打开二维码并在一分钟内在手机上确认登录...');
}

module.exports = qrcode;