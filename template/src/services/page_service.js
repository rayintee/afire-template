/**
 * @Descripttion: 分页请求封装
 * @version: 1.0.0
 * @Author: Tim
 * @Date: 2020-07-16 17:37:58
 */

import http from "@/utils/http";
import Services from "./service";
import modal from "@/utils/modal";

const TAG = 'page_service.js';
export default class PageService extends Services {
    constructor(retListName = "list") {
        super();

        //默认的显示loading
        this.showLoading = false;
        this.context = null;

        this.limit = 8; //默认为8条记录
        this.start = 0; //默认的从0开始
        this.retListName = retListName; //默认接口返回list参数名
        this.list = []; //默认列表数据对象

        this.loading = false; //是否请求中
        this.completed = false; //是否分页完成
        this.refreshing = false; //是否在下拉刷新
    }

    /**
     * 重置page query对象
     * @param {*} opt 
     */
    resetPageQuery(opt = {}) {
        this.limit = opt.limit || 8;

        ///重置为0
        this.start = opt.start || 0;

        ///参数重置
        this.params = {};

        this.loading = false;

        this.completed = false;

        this.list = [];
    }

    /**
     * 分页请求方法
     */
    async req() {
        try {
            ///校验权限相关的部分
            let flag = this.beforeReq();

            if (!flag) {
                console.errer(TAG, '权限拦截未通过~');
                throw '权限拦截未通过~';
            }

            let res = await http.fetch({
                url: this.domain + this.url,
                data: {
                    ...this.params,
                    start: this.start,
                    limit: this.limit
                },
                header: this.header,
                serialize: this.serialize
            });

            ///下拉刷新状态值需要变更
            if (this.refreshing) this.refreshing = false;

            console.log(TAG, '接收到分页数据集～', res);

            ///业务请求数据是否成功
            let is_success = this.afterReq(res);

            ///业务请求失败
            if (!is_success) {
                if (this.showToast) modal.toast(res.msg || "");
                throw "接口请求失败";
            }

            let data = (res || {}).data || {};

            let list = data[`${this.retListName}`] || [];

            // 判断是否完成分页
            let completed = false;
            if (list.length < this.limit) completed = true;

            ///赋值
            this.list = this.list.concat(list);
            this.loading = false;
            this.completed = completed;

            return res;
        } catch (err) {
            console.errer(TAG, 'req() ->', err.msg || err || '分页请求失败~');
            if (this.start > this.limit) this.start -= this.limit;
            ///下拉刷新状态值需要变更
            if (this.refreshing) this.refreshing = false;
            this.loading = false;
            return null;
        }
    }

    /**
     * 滚动到底部分页
     */
    onBottom() {
        //判断是否可以继续分页请求
        if (this.completed || this.loading) {
            return;
        }

        //分页参数
        this.start += this.limit;
        this.loading = true;

        setTimeout(() => {
            this.req(); //请求数据
        }, 400);
    }

    /**
     * 下拉刷新操作
     */
    onRefresh() {
        if (this.refreshing) return;

        console.logger(TAG, '下拉刷新操作来啦～～～～～～');
        //下拉刷新标识
        this.start = 0;
        this.refreshing = true;
        this.loading = true;
        this.completed = false;

        this.list = [];
        this.req();
    }
}