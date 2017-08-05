try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}
// var spooky = require('spooky').create(require('./config/capser'));
var CONST = require('./config/const');
var WXDOM = require('./config/wxDom');
var qrcode = require('./src/lib/qrcode');
var searchWx = require('./src/lib/searchWx');
var listen = require('./src/lib/listen');
var machine = require('./src/lib/machine');


var spooky = new Spooky({
        child: {
            transport: 'http',
            command: "casperjs.cmd", 
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        // step1
        console.log(require('./src/lib/logo').string);

        spooky.start('https://wx.qq.com/');


        //二维码与登录
        spooky.then(function () {
            console.log('正在加载网页...');
            qrcode.start(this);
        });

        // 等待加载聊天信息
        spooky.then(function () {
            this.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
                this.echo("加载最近聊天信息完毕！");
            })
        })

        // 搜索目标微信号
        spooky.then(function () {
            searchWx(this, CONST.TARGET_NICK)
        });

        // 发送欢迎语
        spooky.then(function () {
            hello(this);
        })

        // 监听新消息
        spooky.then(function () {
            listen.start(this);
        })

        //处理新消息
        spooky.on('newMsg', function (msg, isTextMsg) {
            this.echo('触发新文本消息事件，新消息：\n' + msg);
            machine.reply(msg, isTextMsg, this);
        })

        spooky.on('exit', function () {
            this.echo('-----------------\n已退出程序！')
        })

        spooky.run(function () {
            this.echo('执行完毕，程序退出.');
            this.exit();
        });
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

/*
// Uncomment this block to see all of the things spooky h
as to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/

spooky.on('hello', function (greeting) {
    console.log(greeting);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});


// // step1
// spooky.echo(require('/src/lib/logo').string);
// console.log('正在加载网页...');

// spooky.start('https://wx.qq.com/');


// //二维码与登录
// spooky.then(function () {
//     qrcode.start(this);
// });

// // 等待加载聊天信息
// spooky.then(function () {
//     this.waitWhileVisible(WXDOM.LOGIN_LOADING, function () {
//         this.echo("加载最近聊天信息完毕！");
//     })
// })

// // 搜索目标微信号
// spooky.then(function () {
//     searchWx(this, CONST.TARGET_NICK)
// });

// // 发送欢迎语
// spooky.then(function () {
//     hello(this);
// })

// // 监听新消息
// spooky.then(function(){
//     listen.start(this);
// })

// //处理新消息
// spooky.on('newMsg', function(msg, isTextMsg){
//     this.echo('触发新文本消息事件，新消息：\n' + msg);
//     machine.reply(msg, isTextMsg, this);
// })

// spooky.on('exit', function(){
//     this.echo('-----------------\n已退出程序！' )
// })

// spooky.run(function () {
//     this.echo('执行完毕，程序退出.');
//     this.exit();
// });