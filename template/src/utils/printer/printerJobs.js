import commands from './commands';
import gbk from './gbk';

export default class PrinterJobs {
    constructor(needGS) {
        let arr = !needGS ? [commands.HARDWARE.HW_INIT] : [commands.GS, commands.HARDWARE.HW_INIT];
        this._queue = Array.from(arr);
        this._enqueue = function (cmd) {
            this._queue.push.apply(this._queue, cmd);
        }
    }

    /**
     * 增加打印内容
     * @param  {string} content  文字内容
     */
    text(content) {
        if (content) {
            let uint8Array = gbk.encode(content);
            let encoded = Array.from(uint8Array);
            this._enqueue(encoded);
        }
        return this;
    }

    /**
     * 打印文字
     * @param  {string} content  文字内容
     */
    print(content) {
        this.text(content);
        this._enqueue(commands.LF);
        return this;
    }

    //图片宽度是240，那么拼接的指令就是[29, 118, 48, 0, 30, 0, 240, 0]
    //图片宽度是160，那么拼接的指令就是[29, 118, 48, 0, 20, 0, 160, 0]
    //补充一点，打印非二维码的图片，宽度一定要是24的倍数，不然打印也会出现乱码
    /**
     * 打印二维码
     * @param {*} content 
     */
    printQrcode(content) {

        if (content) {

            // [27, 97, 1] 居中对齐
            //[29, 118, 48, 0] 标准的图片大小尺寸
            //[30, 0, 240, 0]

            //[27, 74, 3] //clear data and print

            //[27, 64] Clear data in buffer and reset modes

            const cmds = [].concat([27, 97, 1], [29, 118, 48, 0, 20, 0, 160, 0], content, [27, 74, 3], [27, 64]);

            this._enqueue(cmds);
            this._enqueue(commands.LF);
        }

        return this;
    }



    /**
     * 打印文字并换行
     * @param  {string}  content  文字内容
     */
    println(content = '') {
        return this.print(content + commands.EOL);
    };

    /**
     * 设置对齐方式
     * @param {string} align 对齐方式 LT/CT/RT
     */
    setAlign(align) {
        this._enqueue(commands.TEXT_FORMAT['TXT_ALIGN_' + align.toUpperCase()]);
        return this;
    }

    /**
     * 设置字体
     * @param  {string} family A/B/C
     */
    setFont(family) {
        this._enqueue(commands.TEXT_FORMAT['TXT_FONT_' + family.toUpperCase()]);
        return this;
    };

    /**
     * 设定字体尺寸
     * @param  {number} width 字体宽度 1~2
     * @param  {number} height 字体高度 1~2
     */
    setSize(width, height) {
        if (2 >= width && 2 >= height) {
            this._enqueue(commands.TEXT_FORMAT.TXT_NORMAL);
            if (2 === width && 2 === height) {
                this._enqueue(commands.TEXT_FORMAT.TXT_4SQUARE);
            } else if (1 === width && 2 === height) {
                this._enqueue(commands.TEXT_FORMAT.TXT_2HEIGHT);
            } else if (2 === width && 1 === height) {
                this._enqueue(commands.TEXT_FORMAT.TXT_2WIDTH);
            }
        }
        return this;
    }

    /**
     * 设定字体是否加粗
     * @param  {boolean} bold
     */
    setBold(bold) {
        if (typeof bold !== 'boolean') {
            bold = true;
        }
        this._enqueue(bold ? commands.TEXT_FORMAT.TXT_BOLD_ON : commands.TEXT_FORMAT.TXT_BOLD_OFF);
        return this;
    }

    /**
     * 设定是否开启下划线
     * @param  {boolean} underline
     */
    setUnderline(underline) {
        if (typeof underline !== 'boolean') {
            underline = true;
        }
        this._enqueue(underline ? commands.TEXT_FORMAT.TXT_UNDERL_ON : commands.TEXT_FORMAT.TXT_UNDERL_OFF);
        return this;
    }

    /**
     * 设置行间距为 n 点行,默认值行间距是 30 点
     * @param {number} n 0≤n≤255
     */
    setLineSpacing(n) {
        if (n === undefined || n === null) {
            this._enqueue(commands.LINE_SPACING.LS_DEFAULT);
        } else {
            this._enqueue(commands.LINE_SPACING.LS_SET);
            this._enqueue([n]);
        }
        return this;
    }

    /**
     * 打印空行
     * @param {number} n
     */
    lineFeed(n = 1) {
        return this.print(new Array(n).fill(commands.EOL).join(''));
    }

    /**
     *  设置字体颜色，需要打印机支持
     *  @param  {number} color - 0 默认颜色黑色 1 红色
     */
    setColor(color) {
        this._enqueue(commands.COLOR[color === 1 ? 1 : 0]);
        return this;
    }

    /**
     * https://support.loyverse.com/hardware/printers/use-the-beeper-in-a-escpos-printers
     * 蜂鸣警报，需要打印机支持
     * @param  {number} n    蜂鸣次数,1-9
     * @param  {number} t 蜂鸣长短,1-9
     */
    beep(n, t) {
        this._enqueue(commands.BEEP);
        this._enqueue([n, t]);
        return this;
    }

    /**
     * 清空任务
     */
    clear() {
        this._queue = Array.from(commands.HARDWARE.HW_INIT);
        return this;
    }

    reset() {
        this._queue = Array.from([commands.HARDWARE.HW_RESET, commands.HARDWARE.HW_INIT]);
        return this;
    }

    /**
     * 返回ArrayBuffer
     */
    buffer() {
        return new Uint8Array(this._queue).buffer;
    }
}