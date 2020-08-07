/**
 * @description 常用的lib工具函数方法封装
 * @author Tim
 * @since 2020/04/01
 * 
 */
import ptype from "./ptype";
import modal from "./modal";

const TAG = "utils.js";

/**
 * @description 解析url中的二维码参数
 * @param {String} url 二位对应的地址参数
 * @param {String} pname 需要解析的参数名字
 */
const parseUrlParams = (url, pname) => {
    if (typeof url === "undefined" || !url) {
        return null;
    }
    url = decodeURIComponent(url); //解码
    let reg = new RegExp(pname + "=([^&#@]*)(&|$|#|@)"); // 正则表达式匹配
    var r = url.match(reg);
    if (r != null) {
        return r[1];
    } else {
        return null;
    }
};

/**
 * @description 深度合并: 合并相同key并完全复制key
 * @param to
 * @param origins {多个参数}
 * @return {*}
 *
 * e.g.
 */
const mergeDeep = (to, ...origins) => {
    origins.forEach(from => {
        if (!ptype.isObject(from)) {
            return;
        }
        for (const key in from) {
            const value = from[key];
            if (ptype.isObject(value)) {
                if (to[key] === undefined) {
                    to[key] = {};
                }
                mergeDeep(to[key], value);
            } else {
                to[key] = value;
            }
        }
    });

    return to;
};

/**
 * @description 过滤没有值的request参数
 * 受content-type:"application/x-www-form-urlencoded"类型影响
 * null undefined 会被序列号为String类型的字符串
 *
 * @param {*} params
 */
const filterQueryParams = function (params = {}) {
    params = params;
    let result = {};
    Object.keys(params).forEach((v, i, arr) => {
        if (v && params[v] !== undefined && params[v] !== null) {
            result[v] = params[v];
        }
    });

    return result;
};

/**
 * @description 浮点数相乘
 * @param  {...any} args
 *
 * e.g numMul(4.5, 4.6, 6)...
 */
const numMul = (...args) => {
    if (!args || !args.length) return 0;
    let num = 1; //运算结果
    let m = 0; //幂指数
    args.map(v => {
        v = v.toString(); //转换字符串
        let vdot = v.split(".")[1];
        vdot && (m += vdot.length); //获取小数位数
        num *= Number(v.replace(".", ""));
    });

    return num / Math.pow(10, m);
};

/**
 * @description 多个浮点型小数相加/减（传负数即可）
 * @param  {...any} args
 *
 * e.g numCount('1.2', 2)、numCount('1.2', '-0.5');
 */
const numCount = (...args) => {
    if (!args || !args.length) return 0;
    if (args.length === 1) return Number(args);
    let num = 0; //运算结果
    let lArr = []; //小数点长度集合
    let m = 0; //10的幂指数值
    args.map(v => {
        v = v.toString(); //转换字符串
        let vdot = v.split(".")[1];
        lArr.push(vdot ? vdot.length : 0);
    });
    m = Math.pow(10, Math.max(...lArr));
    args.map(v => {
        v = Number(v);
        num += v * m;
    });

    return num / m;
};

/**
 * 去掉两边空格
 * @param {*} str string字符串值
 * @param {*} all bool 是否全部空格
 */
const strTrim = (str, all = false) => {
    if (!str) return "";
    if (all) {
        return str.replace(/\s+/g, "");
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 防止暴力点击事件
 */
const stopForceClick = (e, context, t = 2000) => {
    let timeStamp = e.timeStamp;
    return new Promise((resolve, reject) => {
        if (timeStamp - context.timeStamp < t) {
            modal.toast("操作过于频繁, 请稍后再试~");
            return reject();
        }

        //已经点击
        context.timeStamp = timeStamp;

        resolve();
    });
};

/**
 * @description 检测网络状态方案
 * @return {*} Promise
 */
const checkNetWork = function () {
    return new Promise((resolve, reject) => {
        uni.getNetworkType({
            success: function (res) {
                // 返回网络类型, 有效值：
                // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
                let networkType = res.networkType;
                if (networkType === "none") {
                    console.warn("current network is none.");
                    reject({
                        code: "NETWORK_ERR",
                        msg: "当前网络不可用"
                    });
                    return;
                }
                resolve();
            },
            fail: function (err) {
                console.error(err);
                reject();
            }
        });
    });
};

/**
 * 通用页面跳转方法
 * @param {*} e 
 */
const onJump = e => {
    if (!e) return;
    let url;
    if (typeof e === "string") url = e;
    else {
        url = ((e.currentTarget || {}).dataset || {}).url || e.url;

        let params = ((e.currentTarget || {}).dataset || {}).params || e.params || {};
        if (Object.keys(params).length > 0) {
            let pArr = [];
            for (let p in params) {
                pArr.push(`${p}=${params[p]}`);
            }

            url += `?${pArr.join('&')}`;
        }
    }

    console.logger(TAG, 'onJump()', url);

    //在起始页面跳转到目标页面
    uni.navigateTo({
        url
    });
};

/**
 * 扫描二维码
 */
const scanQrCode = function () {
    return new Promise((resolve, reject) => {
        try {
            // 允许从相机和相册扫码
            uni.scanCode({
                scanType: ['qrCode'],
                success: function (res) {
                    console.logger(TAG, 'scanQrCode()', '条码类型：' + res.scanType);

                    if (res.scanType != 'QR_CODE') {
                        modal.toast('请扫描正确的二维码');
                        return reject();
                    }

                    console.logger(TAG, 'scanQrCode()', '条码内容：' + res.result);
                    if (!res.result) {
                        modal.toast('扫描的二维码内容为空~');
                        return reject();
                    }
                    resolve(res.result)
                }
            });
        } catch (err) {
            reject(err);
        }
    })
}

/**
 * 获取位置信息
 */
const getLocationInfo = function () {
    return new Promise((resolve, reject) => {
        try {
            uni.getLocation({
                type: 'gcj02', //'wgs84',
                success(res) {
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    const speed = res.speed;
                    const accuracy = res.accuracy;
                    const altitude = res.altitude;
                    let ret = {
                        lat: latitude,
                        lng: longitude,
                        speed,
                        accuracy,
                        altitude
                    }
                    resolve(ret);
                },
                fail(err) {
                    console.logger(TAG, 'getLocationInfo() --->', err);
                    reject();
                }
            });
        } catch (err) {
            console.errer(TAG, 'getLocationInfo() --->', err);
            reject();
        }
    });
}

/**
 * 扫描条形码
 */
const scanBarCode = function () {
    return new Promise((resolve, reject) => {
        try {
            // 允许从相机和相册扫码
            uni.scanCode({
                // scanType: ['barCode'],
                success(res) {
                    console.logger(TAG, 'scanBarCode()', '条码类型：' + res.scanType);

                    if (res.scanType === 'QR_CODE') {
                        modal.toast('请扫描条形码~');
                        return reject();
                    }

                    console.logger(TAG, 'scanBarCode()', '条码内容：' + res.result);
                    if (!res.result) {
                        modal.toast('扫描的条形码内容为空~');
                        return reject();
                    }

                    resolve(res.result);
                },

                fail(err) {
                    console.errer(TAG, 'scanBarCode()', err);
                }
            });
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * 图片picker
 * @param {*} count 
 * @param {*} onlyCompressed 
 */
const chooseImage = (count = 1, onlyCompressed = false) => {
    //默认最多一次只能传9张
    if (count > 9) count = 9;
    return new Promise((resolve, reject) => {
        uni.chooseImage({
            count,
            sizeType: onlyCompressed ? ['original'] : ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths);
                resolve(tempFilePaths);
            },
            fail(err) {
                reject(err);
            }
        })
    });
};

const checkCanUseBle = function () {
    return new Promise((resolve, reject) => {
        if (!uni.openBluetoothAdapter) {
            modal.alert({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return reject();
        }
        resolve();
    })
}

// 替换中间4位
const phoneHide = function (phone) {
    if (!phone) return "";

    // 替换中间4位
    var reg = /^(\d{3})\d{4}(\d{4})$/;
    return phone.replace(reg, "$1****$2");
}

/**
 * 正则表达式:
 * 密码至少含有数字、字母、特殊字符任意2种组合
 * @param {*} str
 */
const validateCheck = (str) => {
    let hasNumReg = /\d+/; //至少含有1或多个数字
    let hasCharReg = /[a-zA-Z]+/; //至少含有1或者多个字母
    let charTmp = str.match(hasCharReg);
    let numTmp = str.match(hasNumReg);
    if (
        (charTmp && charTmp[0].length == str.length) ||
        (numTmp && numTmp[0].length == str.length) ||
        (!charTmp && !numTmp)
    ) {
        modal.toast("输入的密码至少含有数字、字母、特殊字符任意2种组合");
        return false;
    }

    return true;
};

export default {
    stopForceClick,
    parseUrlParams,
    mergeDeep,
    strTrim,
    numCount,
    numMul,
    filterQueryParams,
    checkNetWork,
    onJump,
    scanQrCode,
    scanBarCode,
    chooseImage,
    checkCanUseBle,
    phoneHide,
    validateCheck,
    getLocationInfo
}