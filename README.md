![](http://upload-images.jianshu.io/upload_images/3169607-74099cb906bf59f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://github.com/doterlin/wechat-robot)
[![MIT](https://img.shields.io/npm/l/express.svg)](https://github.com/doterlin/wechat-robot/blob/master/LICENSE)
[![copyRight](https://img.shields.io/badge/power%20by-doterlin-orange.svg)](https://github.com/doterlin)


>基于`phantomjs`和web端微信开发的聊天机器人。使用的微信账号（即充当机器人的账号）为个人账号，可自定义指令。
# 效果
可以指定一个微信账号：

![撩妹](http://upload-images.jianshu.io/upload_images/3169607-2068f9382b4f9f29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

自定义指令不会交给AI处理：

![自定义指令](http://upload-images.jianshu.io/upload_images/3169607-a92574f783093df2.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

独乐乐不如众乐乐，可以指定到群聊上：

![微信群](http://upload-images.jianshu.io/upload_images/3169607-7c929617f3b2a790.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


在后台程序查看log：

![命令行输出](http://upload-images.jianshu.io/upload_images/3169607-c80a66d579e79279.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



# 使用场景
> + 微信智能回复，监控，统计等
> + 便捷查询
> + 娱(liao)乐(mei)


# 如何使用
### 1.安装环境
下载[源码](https://github.com/doterlin/wechat-robot):
```
git clone https://github.com/doterlin/wechat-robot.git
```

安装以下环境：

1.[node.js](https://nodejs.org/)

2.[phantomjs](http://phantomjs.org/)

3.[casperjs](http://casperjs.org/)


### 2.配置
找到并配置好`/config/const.js`
```
//机器人名字
var ROBOT_NAME = "小强";

module.exports = {
    //微信web版地址
    'URL'          : 'https://wx.qq.com/',

    //机器人名字
    'ROBOT_NAME'   : ROBOT_NAME,
    
    //图灵机器人apiKey和api地址
    //AI部分使用的是第三方机器人图灵（http://www.tuling123.com/）
    //这里只是示例，请大家自行到图灵官网注册并替换掉apikey免费版限5000次调用/天。有条件的同学可以付费支持下好产品
    'TURING_APIKEY': '99fecec3424d416898b91b0998e2b26a',
    'TURING_URL'   : 'http://www.tuling123.com/openapi/api',

    //锁定的微信号备注，注意是备注；如果是群聊则填群聊名称即可。
    //填写的名称请预先在手机微信上搜索确认搜索结果是否出现在第一个
    'TARGET_NICK'  : '二十投小分队',

    //启动时打招呼消息
    'HELLO_WORLD'  : '[闪电]' + ROBOT_NAME + '[闪电]已启动...',

}
```


### 3.运行和登录微信
**安装依赖和运行命令：**
```
npm install
```
```
capserjs index.js
```
*如果提示`python找不到`之类的话请安装一下[python](https://www.python.org/)并保证其能运行在全局*

**扫码登录微信**
运行后看到如下提示时则扫一下弹出来的二维码：
```
正在加载二维码...
已保存二维码，路径："static/img/qr.jpg".
正在使用默认软件打开二维码，请用手机微信扫一扫确认登录 (若没有请手动打开)
```
请在`一分钟内`使用手机扫码并确认登录。出现`登录成功`和`发送欢迎语`提示后即可。这样就完成了使用步骤。下面的章节是介绍如何去扩展功能。

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


> **二次开发若方便请`Fork`贡献给本[Github](https://github.com/doterlin/wechat-robot)，共同完善项目！**


# 版本预告
下一版本更新但不限于以下内容：
> 1.支持绑定多个微信帐号  
> 2.UI化控制台（`node.js web`同步命令log及部分操作）  
> 3.支持图片识别和回复（如斗图）  
> 4.更多实用指令  

# MIT License

Copyright (c) 2017 doterlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.