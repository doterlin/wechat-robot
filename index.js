var casper = require('casper').create({
    waitTimeout: 60 * 1000
});
var login = require('./src/lib/login');
var utils = require('utils');

casper.start('https://wx.qq.com/');

//login
casper.then(function() {
    var ts = this;
    var qrUrl = ts.getElementAttribute('.qrcode .img', 'src');
    console.log(qrUrl)
    casper.waitForResource(qrUrl, function() {
        this.echo('Qrcode has been loaded. url: ' + qrUrl);
        login.start(ts);
    });
});


//loggin success
casper.waitForSelector('body.loaded', function() {
    this.captureSelector('./static/img/login_success.png', 'html');
    console.log('登陆成功！')
});


// loggin success
// casper.waitForSelector('body.loaded', function() {
//     this.captureSelector('./static/img/login_success.png', 'html');
//     console.log('登陆成功！')
// });


//loggin error
casper.waitForSelector('.tweet-row', function() {
    this.captureSelector('./static/img/login_err.png', 'html');
});


// casper.thenOpen('http://phantomjs.org', function() {
//     this.echo('Second Page: ' + this.getTitle());
// });

casper.run();