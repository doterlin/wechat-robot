var opn = require('opn');
console.log('打开二维码...')
// Opens the image in the default image viewer 
opn('static/img/qr.jpg').then(() => {
    console.log('关闭二维码!')
});