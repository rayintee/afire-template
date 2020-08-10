/*
 * @Author: your name
 * @Date: 2020-08-10 11:44:37
 * @LastEditTime: 2020-08-10 14:08:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /afire-template/template/src/utils/logger.js
 */
export default class Logger {

    constructor(TAG = null) {
        this.TAG = `[${TAG || 'logger.js'}]`;
    }

    ///输出普通的日志
    log() {
        console.log(this.TAG, ...arguments);
    }

    ///警告输出日志
    warn() {
        console.warn(this.TAG, ...arguments);
    }

    ///输出错误日志
    error() {
        console.error(this.TAG, ...arguments);
    }
}