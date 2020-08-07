import extend from 'extend';
import {
    QRCode,
    QRErrorCorrectLevel
} from './qrcode'
// import gbk from '../printer/gbk';

// support Chinese
function utf16to8(str) {
    //转换string
    str = String(str);

    var out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i)
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
        }
    }
    return out
}

/**
 * 绘制二维码图片
 * @param {*} options 
 */
function drawQrcode(options) {
    options = options || {}
    options = extend(true, {
        width: 256,
        height: 256,
        x: 0,
        y: 0,
        typeNumber: -1,
        correctLevel: QRErrorCorrectLevel.H,
        background: '#ffffff',
        foreground: '#000000',
        image: {
            imageResource: '',
            dx: 0,
            dy: 0,
            dWidth: 100,
            dHeight: 100
        }
    }, options)

    if (!options.canvasId && !options.ctx) {
        console.warn('please set canvasId or ctx!')
        return
    }

    //创建canvas
    createCanvas();

    function createCanvas() {
        // create the qrcode itself
        var qrcode = new QRCode(options.typeNumber, options.correctLevel)
        qrcode.addData(utf16to8(options.text))
        qrcode.make()

        // get canvas context
        var ctx
        if (options.ctx) {
            ctx = options.ctx
        } else {
            ctx = options._this ? uni.createCanvasContext && uni.createCanvasContext(options.canvasId, options._this) : uni.createCanvasContext && uni.createCanvasContext(options.canvasId)
        }

        // compute tileW/tileH based on options.width/options.height
        var tileW = options.width / qrcode.getModuleCount()
        var tileH = options.height / qrcode.getModuleCount()

        // draw in the canvas
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                var style = qrcode.isDark(row, col) ? options.foreground : options.background
                ctx.setFillStyle(style)
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
                var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW))
                ctx.fillRect(Math.round(col * tileW) + options.x, Math.round(row * tileH) + options.y, w, h)
            }
        }

        if (options.image.imageResource) {
            ctx.drawImage(options.image.imageResource, options.image.dx, options.image.dy, options.image.dWidth, options.image.dHeight)
        }

        ctx.draw(false, () => {
            console.log('----->>>draw over');

            options.callback && options.callback()
        }); //不保留上次的绘制结果

        //手动执行回调 
        // setTimeout(() => {
            
        // }, 1200);
    }
}

//4合1 
function convert4to1(res) {
    let arr = [];
    for (let i = 0; i < res.length; i++) {
        if (i % 4 == 0) {
            let rule = 0.29900 * res[i] + 0.58700 * res[i + 1] + 0.11400 * res[i + 2];
            if (rule > 200) {
                res[i] = 0;
            } else {
                res[i] = 1;
            }
            arr.push(res[i]);
        }
    }
    return arr;
}

//8合1
function convert8to1(arr) {
    let data = [];
    for (let k = 0; k < arr.length; k += 8) {
        let temp = arr[k] * 128 + arr[k + 1] * 64 + arr[k + 2] * 32 + arr[k + 3] * 16 + arr[k + 4] * 8 + arr[k + 5] * 4 +
            arr[k + 6] * 2 + arr[k + 7] * 1
        data.push(temp);
    }
    return data;
}

//图片宽度是240，那么拼接的指令就是[29, 118, 48, 0, 30, 0, 240, 0]
//图片宽度是160，那么拼接的指令就是[29, 118, 48, 0, 20, 0, 160, 0]
//补充一点，打印非二维码的图片，宽度一定要是24的倍数，不然打印也会出现乱码
function toArrayBuffer(res) {
    let arr = convert4to1(res.data);
    let data = convert8to1(arr);
    let cmds = [].concat([27, 97, 1], [29, 118, 48, 0, 20, 0, 160, 0], data, [27, 74, 3], [27, 64]);
    return new Uint8Array(cmds).buffer;
}

/**
 * 生成二维码入口
 * @param {*} qrCodeStr 
 * @param {*} canvas_width 默认240
 * @param {*} canvas_height 
 * 
 * 注意打印机二维码的像素图片最好伟24的倍数，否则容易出错
 */
const createQrcode = function (options = {}) {
    if (typeof options === 'undefined' || !options || !Object.keys(options).length) {
        throw 'create qrcode params cannot be empty!';
    }

    const {
        _this = null,
            canvasId = 'qrCodeCanvas',
            text = '',
            width = 240,
            height = 240,
            callback = () => {}
    } = options;

    //绘制二维码内容
    drawQrcode({
        canvasId: canvasId,
        _this,
        text: String(text),
        width: width,
        height: height,
        callback() {
            callback();
        }
    });
}

/**
 * 获取二维码内容
 * @param {*} options 
 */
const getQrcode = function (options = {}) {
    const {
        _this = null,
            canvasId = 'qrCodeCanvas',
            width = 240,
            height = 240,
            callback = () => {}
    } = options;

    let opt = {
        canvasId,
        x: 0,
        y: 0,
        width,
        height,
        success(res) {
            let arr = convert4to1(res.data);
            let data = convert8to1(arr);
            callback(data);
        }
    }

    //获取canvas的内容
    _this ? uni.canvasGetImageData(opt, _this) : uni.canvasGetImageData(opt);
}

export default {
    createQrcode,
    getQrcode
}