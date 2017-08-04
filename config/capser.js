module.exports =  {
    pageSettings: {
        loadImages: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.14 Safari/537.36',
    },
    // logLevel: "info",
    viewportSize: {width: 1300, height: 900},
    verbose: true,
    timeout: Number.POSITIVE_INFINITY,
    waitTimeout: Number.POSITIVE_INFINITY,
    onWaitTimeout: function(){
        console.log( 'waitFor*方法超时...' )
    },
    onTimeout: function(){
        console.log( '脚本执行超时...' )
    },
}
