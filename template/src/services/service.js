/**
 * @description 通用权限拦截操作, services父类
 */

import storage from "@/utils/storage";
import {
    SKEY,
    TOKEN,
    NEED_SIGN,
    SIGN_KEY_KEY,
    UPHONE
} from "@/config/var.conf";
import {
    domain
} from "@/config/api.conf"
import modal from "@/utils/modal";
import store from "@/store";

const TAG = 'service.js';

export default class Services {
    constructor() {
        //to-do something
        this.domain = domain;
        this.url = null;

        this.header = {}; // 头部可能携带的参数
        this.params = {}; //业务参数

        //默认的显示toast
        this.showToast = true;
        //默认的请求成功不显示toast
        this.submitToast = false;

        //默认的显示loading
        this.showLoading = true;

        //默认不需要签名加密
        this.needSign = false;

        //默认的需要权限验证
        this.auth = true;

        //登录页面标识
        this.isLoginPage = false;

        ///接口参数序列化:整合到一个params下面 && json string
        this.serialize = true;
    }

    sign() {
        //判断是否需要签名加密使用
        this.header[NEED_SIGN] = this.needSign ? '1' : '0';

        //携带签名加密串
        if (this.needSign) {
            this.header[SIGN_KEY_KEY] = ""; //签名加密串--后期补充
        }
    }

    /**
     * 拦截请求前的函数
     */
    beforeReq() {
        if (this.auth) {
            // 获取skey
            const skey = storage.get(SKEY);

            ///本地skey为空
            if (!skey) {
                uni.reLaunch({
                    url: store.state.loginPage
                });
                modal.toast("请登录!");
                return false;
            }

            // 优先判断是否登录
            this.header[TOKEN] = skey;
        }

        //新增时间戳
        let time = new Date().getTime();
        console.logger(TAG, 'beforeReq()', '通用参数时间戳time:', time);
        this.params.timeStamp = time;

        //签名加密
        this.sign();

        return true;
    }

    /**
     * 拦截通用处理后的函数
     * @param {*} res 
     */
    afterReq(res) {
        let code = res.code || "";
        let data = res.data || {};

        if (code == '0' || code === 0) {
            // 最新token
            if (data.token) {
                storage.set(SKEY, data.token);
            }

            return true;
        }

        //登录失效
        let msg = ((res || {}).msg || '');
        var msgRegx = /账户不存在/;
        var _msgRegx = /账号不存在/;

        if (code == "-1" || msgRegx.test(msg) || _msgRegx.test(msg)) {
            storage.clear(SKEY);
            storage.clear(UPHONE);

            //登录失效跳转
            if (!this.isLoginPage) uni.reLaunch({
                url: store.state.loginPage
            });

            modal.toast(res.msg || "请登录!");
        }

        return false;
    }
}