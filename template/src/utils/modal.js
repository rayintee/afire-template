/**
 * @description 封装交互逻辑提示，如：alert、confirm、toast等
 * @author Tim
 * note: sdk version >= 1.9.0
 */
import ptype from "./ptype";
import utils from "./utils";
import store from "@/store";

const noop = () => {}; // 空函数
const defaultModalOptions = {
    // 默认modal配置
    title: "温馨提示",
    showCancel: true,
    confirmText: "确定",
    confirmColor: store.state.defaultTheme,
    cancelText: "取消",
    cancelColor: "#000000",
    success: noop,
    fail: err => {
        console.error("调用showModal发生异常:" + JSON.stringify(err));
    },
    complete: noop
};

/**
 * @description alert弹窗封装
 * @param options {String/Object}参数
 *
 *  {具体参看showModal api接口参数}
 * @return {*} Promise
 */
const alert = function (options = {
    content: ""
}) {
    return new Promise((resolve, reject) => {
        if (ptype.isString(options)) options = {
            content: options
        };

        //不显示cancel按钮
        options["showCancel"] = false;
        //成功回调函数
        options["success"] = () => {
            resolve();
        };
        //深度拷贝
        options = utils.mergeDeep({}, defaultModalOptions, options);

        uni.showModal(options);
    });
};

/**
 * @description confirm弹窗封装
 * @param options {String/Object} 参数
 *
 * {具体的参考showModal接口}
 * @return {*} Promise
 */
const confirm = function (options = {
    content: "确认执行此操作?"
}) {
    return new Promise((resolve, reject) => {
        let content = content || "";

        //配置对象
        if (ptype.isString(options)) {
            //标题
            options = {
                content: options
            };
        }

        // 成功的回调函数
        options["success"] = res => {
            if (res.confirm) {
                resolve();
                return;
            }
            reject();
        };

        //深度继承
        options = utils.mergeDeep({}, defaultModalOptions, options);

        uni.showModal(options);
    });
};

/**
 * @description toast 弹窗
 * note: icon为空的时候需要对应的sdk版本高于1.9.0以上才会支持
 * @param {*} options {string/object}
 */
const toast = function (options = {
    title: ""
}) {
    if (ptype.isString(options)) {
        options = {
            title: options
        };
    }

    if(!options.icon) options["icon"] = "none";
    options["duration"] = 3000; //默认的3s

    uni.showToast(options);
};

/**
 * 加载loading
 * @param {*} title 
 * @param {*} mask
 */
const showLoading = function (title = '加载中', mask = false) {
    uni.showLoading({
        title,
        mask
    });
};

/**
 * 关闭loading
 */
const hideLoading = function () {
    uni.hideLoading();
};

export default {
    alert,
    confirm,
    toast,
    showLoading,
    hideLoading
};