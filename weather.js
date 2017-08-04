var casper = require('casper').create(require('./config/capser'));
casper.echo(require('/src/lib/logo').string);
console.log('正在加载网页...')
casper.start('http://wthrcdn.etouch.cn/weather_mini?city=%E9%9D%92%E5%B2%9B');

casper.then(function () {
    var resource = 'http://wthrcdn.etouch.cn/weather_mini?city=%E9%9D%92%E5%B2%9B';
    var data = this.evaluate(function (resource) {
        $.get(resource, function (data) {
            window.global_weather = data;
        })
    }, resource);
    this.waitFor(function checkWeather() {
        return this.evaluate(function () {
            return window.global_weather
        })
    }, function () {
        var weather = this.evaluate(function () {
            return window.global_weather
        })
        console.log(weather)
    }, function () {
        console.log('天气请求超时...')
    }, 10000)
})

casper.run(function () {
    this.echo('执行完毕，程序退出.');
    this.exit();
});