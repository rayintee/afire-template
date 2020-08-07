/*
 * @Author: Tim
 * @Date: 2020-07-16 15:30:40
 * @LastEditTime: 2020-07-24 15:53:04
 * @LastEditors: Please set LastEditors
 * @Description: 项目工程入口文件
 * @FilePath: /mzi-water-oos/src/main.js
 */
import Vue from 'vue';
import App from './App';
import store from '@/store';
import config from './settings';
import env from "./env";
import MzLayout from "@/components/mz_layout/index";
import MzScroller from "@/components/mz_scroller/index";
import MzRadio from "@/components/mz_radio/index";
import MzModal from "@/components/mz_modal/index";
// import MzDatePcik from "@/components/mz_datepicker/index"
// ///获取当前系统的一部分信息
const systemInfo = uni.getSystemInfoSync();
console.log(systemInfo)

//增强行日志打印
console.logger = function () {

  if (!arguments || arguments.length < 2) {
    throw "console.logger is an enhanced function, which first param must be a TAG!";
  }

  let TAG = `[${arguments[0]}]: `;
  arguments[0] = TAG;
  console.log(...arguments);
};

console.infer = function () {
  if (!arguments || arguments.length < 2) {
    throw "console.infoer is an enhanced function, which first param must be a TAG!";
  }

  let TAG = `[${arguments[0]}]: `;
  arguments[0] = TAG;

  console.info(...arguments);
};

console.warner = function () {
  if (!arguments || arguments.length < 2) {
    throw "console.warner is an enhanced function, which first param must be a TAG!";
  }

  let TAG = `[${arguments[0]}]: `;
  arguments[0] = TAG;

  console.warn(...arguments);
}

console.errer = function () {
  if (!arguments || arguments.length < 2) {
    throw "console.warner is an enhanced function, which first param must be a TAG!";
  }

  let TAG = `[${arguments[0]}]: `;
  arguments[0] = TAG;

  console.error(...arguments);
}

Vue.config.productionTip = false;
Vue.prototype.$store = store;

//扩展获取服务器资源的路径
Vue.prototype.getServerAssets = assets => {
  if (assets && (assets.indexOf('.png') > -1 || assets.indexOf('.jpeg') > -1 || assets.indexOf('.jpg') > -1))
    return `${config.staticDomain}` + assets;
  else return "";
}

///扩展自动返回的接口
Vue.prototype.goBack = () => {
  uni.navigateBack();
}

//判断是否正是环境还是测试环境
Vue.prototype.$api_env = env === 0 ? 'test' : 'prod';

///注册全局组件
Vue.component('mz-layout', MzLayout);
Vue.component('mz-scroller', MzScroller);
Vue.component('mz-radio', MzRadio);
Vue.component('mz-modal', MzModal);
// Vue.component('mz-date', MzDatePcik);

App.mpType = 'app';
const app = new Vue({
  store,

  mounted() {
    // 加载默认的配置文件
    store.commit("setDefaultTitle", config.defaultTitle);
    store.commit("setLoginPage", config.loginUrl);
    store.commit("setDefaultTheme", config.defaultTheme);
    store.commit("setSystemInfo", systemInfo);
  },

  ...App
});

app.$mount();