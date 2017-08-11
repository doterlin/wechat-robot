# 指令和AI
在这之前你可能需要两个方法：

**message.send()**
```
//路径：src/utils/message.js
//回复消息的方法message.send
//使用如：
var message = require('/src/utils/message');
...
casper.then(function(){
   message.send(this, '你好');
})
```

**ajax() / ajax.get()  / ajax.post() / ajax.getJSON()**
```
//路径：src/utils/ajax.js
//在聊天器调ajax的方法
//使用如：
var  ajax= require('/src/utils/ajax');
...
casper.then(function(){
   ajax(this, "http://example.com/getInfo", 'get', {uid: 123}, function(res){
        console.log(JSON.stringify(res));
    });
  
   //或者
   ajax.get(this, "http://example.com/getInfo", {uid: 123}, function(res){
        console.log(JSON.stringify(res));
    });

   //jsonp
   ajax.getJSON(this, "http://example.com/getInfo?calback=?", {uid: 123}, function(res){
        console.log(JSON.stringify(res));
   });
})
```
你可以根据需要按以下方面扩充机器人的功能：
##### 编写指令
```
//你可以写一些指令而不是交给AI处理
//指令分为精确匹配指令和模糊匹配指令

//-------------------------------------------------------------------
//精确匹配
//精确指令在`/src/directive/exact.js`下编写。
//key是指令名称，值是一个方法，接受参数msgContent(用户发送的消息)和casperIns(casper实例)，如：
//当对方发送'关闭'指令时程序提示并退出。
module.exports = {
    '关闭': function (msgContent, casperIns) {
        message.send(casperIns, '[玫瑰]感谢您的使用[玫瑰]\n\r([闪电]需要开启请在控制台启动程序[闪电])');
        casperIns.echo('微信发出关闭口令，程序退出。')
        return casperIns.exit();
    }
}

//-------------------------------------------------------------------
//模糊匹配
//模糊匹配指令在`/src/directive/fuzzy.js`下编写。
//接收参数前两个同精确指令，第三个是当前的正则表达式；
//指令可单独防在src/directive/explain下方便维护，如weather.js：
//匹配'地名 + 天气'，调用天气api
var weather = require('./explain/weather');
module.exports = {
    '/天气/g': weather 
}
//weather.js实现如下：
var ajax = require('../../utils/ajax');
var message = require('../../utils/message');

var formatWeather = function(local, weather) {
    //此方法对返回的json格式化，详情请查看源码
}

var weather = function(msgContent, casperIns, regex) {
    var local = msgContent.replace(/ |天气/, '');
    var resource = 'http://wthrcdn.etouch.cn/weather_mini?city=' + encodeURIComponent(local);

    ajax.get(casperIns, resource, {}, function(res){
        var weather = JSON.parse(res);
        if (weather.status == 1000) {
            message.send(casperIns, formatWeather(local, weather));
        } else {
            message.send(casperIns, '未查找到相关天气信息。请尝试输入格式如"广州天气"。')
        }
    });
   
}
module.exports = weather;
//-------------------------------------------------------------------
```

##### 完善AI
这个我目前也没研究。

##### 调试
调试代码时可将`capserjs`配置选像中的`logLevel`字段设为`info`将会显示更多`phantomjs`log，更多配置请移步[casperjs](http://casperjs.org/)文档。
```
//路径：config/casper.js
module.exports =  {
    clientScripts:  [
        'static/js/jquery.js'
    ],
    pageSettings: {
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.14 Safari/537.36',
    },
    logLevel: "info", //here
    viewportSize: {width: 1300, height: 900},
    verbose: true,
    waitTimeout: 1000 * 60 * 60 * 24 * 365,
    onWaitTimeout: function(){
        console.log( 'waitFor*方法超时...' )
    }
}

```
另外，在执行各个步骤时会把浏览器截图保存到`/static/img`，方便查看浏览器渲染情况。比如每获取到一条新消息时会截图并覆盖为`lastNewMsgContent.png`。
