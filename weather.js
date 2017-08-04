var casper = require('casper').create(require('./config/capser'));
casper.echo(require('/src/lib/logo').string);
console.log('正在加载网页...')
casper.start('http://wthrcdn.etouch.cn/weather_mini?city=%E9%9D%92%E5%B2%9B');

casper.then(function(){
    this.evaluate(function(){
        $.get('http://wthrcdn.etouch.cn/weather_mini?city=%E9%9D%92%E5%B2%9B', function(data){
            alert(data);
        })
    });
    this.waitForAlert(function(response) {
        this.echo("Alert received: " + response.data);
    });
})
casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});