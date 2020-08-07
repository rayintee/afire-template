/*
 * @Author: Tim
 * @Date: 2020-07-16 15:30:40
 * @LastEditTime: 2020-08-07 17:54:17
 * @LastEditors: Please set LastEditors
 * @Description: 基础业务Http代理封装
 * @FilePath: /mzi-water-oos/src/services/base_service.js
 */
import http from "@/utils/http";
import modal from "@/utils/modal";
import Services from "./service";

const TAG = 'base_service.js';
export default class BaseService extends Services {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    /**
     * 通用fetch函数:支持回调
     * @param {*} options
     */
    async req() {
        try {

            let flag = this.beforeReq();

            if (!flag) {
                throw "权限拦截异常, 检测到未登录~";
            }

            //判断本地是否有skey
            let res = await http.fetch({
                url: this.domain + this.url,
                data: this.params,
                header: this.header,
                showToast: this.showToast,
                showLoading: this.showLoading,
                serialize: this.serialize
            });

            ///处理业务接口返回的是否成功
            let is_success = this.afterReq(res);

            if (!is_success) {
                if (this.showToast) modal.toast(res.msg || "");
            } else {
                if (this.successToast) modal.toast(res.msg || "");
            }

            return res;
        } catch (err) {
            console.errer(TAG, err.msg || err || '请求接口失败~');
            return null;
        }
    }
}