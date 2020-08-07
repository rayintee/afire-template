/*
 * @Author: Tim
 * @Date: 2020-07-29 14:33:26
 * @LastEditTime: 2020-08-07 16:55:49
 * @LastEditors: Please set LastEditors
 * @Description: store入口文件
 * @FilePath: /afire-template/template/src/store/index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import storage from "@/utils/storage";
import {
    UPHONE
} from "@/config/var.conf";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        defaultTitle: "",

        ///登录页面目录，如果有登录页面
        loginPage: "",

        //默认的主题色值，16进制色值
        defaultTheme: "",

        //当前系统的信息
        systemInfo: {}

    },

    mutations: {
        setDefaultTitle(state, title) {
            state.defaultTitle = title;
        },

        setLoginPage(state, url) {
            state.loginPage = url;
        },

        setDefaultTheme(state, theme) {
            state.defaultTheme = theme;
        },

        setSystemInfo(state, info = {}) {
            state.systemInfo = info;
        }
    },

    actions: {},

    //getters 模块
    getters: {
        //获取手机号码
        getUPhone(state) {
            return storage.get(UPHONE);
        }
    }
})

export default store;