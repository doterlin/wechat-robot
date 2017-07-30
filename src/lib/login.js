var login = {};

login.start = function(casperIns) {
    //截图并打开图片
    console.log('截图并打开图片')
    casperIns.captureSelector('./static/img/qr.jpg', '.login_box', {
        format: 'jpg',
        quality: 100
    });
}

module.exports = login;