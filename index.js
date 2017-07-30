var casper = require('casper').create();
var login = require('./src/lib/login');
var utils = require('utils');

casper.start('https://wx.qq.com/');

casper.then(function() {
    var ts = this;
    var qrUrl = ts.getElementAttribute('.qrcode .img', 'src');
    console.log(qrUrl)
    casper.waitForResource(qrUrl, function() {
        this.echo('Qrcode has been loaded. url: ' + qrUrl);
        login.start(ts);
    });
});

// casper.thenOpen('http://phantomjs.org', function() {
//     this.echo('Second Page: ' + this.getTitle());
// });

casper.run();