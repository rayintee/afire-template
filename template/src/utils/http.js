/**
 * @description 基于uni-app跨多终端方案封装
 * @author tim
 * @since 2020/04/01
 * 
 */
import utils from "./utils";
import modal from "./modal";

/* 定义相关的常量 */
const noop = () => {};
const defaultOptions = {
    method: "POST",
    header: {
        //设置header content-type
        "content-type": "application/x-www-form-urlencoded"
    },
    dataType: "json",
    responseType: "text",
    success: noop,
    fail: noop
};


/**
 * @description 核心请求封装
 * @param url: {String} 必传 api 请求接口
 * @param data: {Object} 参数对象
 * @param header: {Object} 头部封装参数
 * @return {*} Promise
 */
export default {
    fetch: function (options = {}) {
        const {
            url = "",
                data = {},
                header = {},
                showToast = true,
                showLoading = true,
                serialize = false,
        } = options;

        return new Promise((resolve, reject) => {
            if (!url) {
                showToast && modal.toast("接口url为必传参数");
                return reject();
            }
            //检查当前网络是否可用
            utils.checkNetWork().then(() => {
                //接口基本参数: body中,剔除值为null或空的字段
                options.data = utils.filterQueryParams(data);

                ///是否参数需要json序列化，单独处理
                if (serialize) {
                    //============= 字段单独处理、如无必要可有选择的取消该行代码 ==================
                    //外接一层：params： value
                    options.data = {
                        param: JSON.stringify(options.data)
                    }
                    //============= END =============
                }

                //获取头部header信息
                //移除关于头部token的封装，使得http代理插件与业务更加解偶
                options["header"] = header;

                //成功回调函数
                options["success"] = res => {
                    if (showLoading) modal.hideLoading();
                    let retData = res.data;

                    if (!retData) {
                        showToast && modal.toast("接口数据返回为空");
                        return reject();
                    }

                    //返回的数据默认为text，故需要转JSON Object
                    if (typeof retData === "string") {
                        try {
                            retData = JSON.parse(retData.substr(res.data.indexOf("{")));
                        } catch (err) {
                            console.error(err);
                            showToast && modal.toast("JSON格式异常");
                            return reject();
                        }
                    }

                    return resolve(retData);
                };

                //失败回调函数
                options["fail"] = error => {
                    if (showLoading) modal.hideLoading();
                    error = error || {};
                    let msg = error.errMsg || "http异常错误";
                    let code = error.errCode || "HTTP_REQUEST_ERR";
                    showToast && modal.toast(msg);
                    return reject({
                        code,
                        msg
                    });
                };

                // options["complete"] = () => {
                //     console.log("请求完成...")
                // };

                //数据请求发送
                if (showLoading) modal.showLoading();
                uni.request(utils.mergeDeep({}, defaultOptions, options));
            }, reject);
        });
    }
};