#!/usr/bin/env node
var opn = require('opn');

// Opens the image in the default image viewer 
opn('static/img/qr.jpg').then(() => {
    console.log('关闭二维码!')
});