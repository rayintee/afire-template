/*
 * @Author: Tim
 * @Date: 2020-07-16 15:30:40
 * @LastEditTime: 2020-08-10 14:09:33
 * @LastEditors: Please set LastEditors
 * @Description: 项目工程入口文件
 * @FilePath: /mzi-water-oos/src/main.js
 */
import Vue from 'vue';
import App from './App';
import store from '@/store';
import config from './settings';

///获取当前系统的一部分信息
const systemInfo = uni.getSystemInfoSync();
console.log(systemInfo)

Vue.config.productionTip = false;
Vue.prototype.$store = store;

//扩展获取服务器资源的路径
Vue.prototype.getRemoteAssets = assets => {
  if (assets && (assets.indexOf('.png') > -1 || assets.indexOf('.jpeg') > -1 || assets.indexOf('.jpg') > -1))
    return `${config.staticDomain}` + assets;
  else return "";
}

///扩展自动返回的接口
Vue.prototype.goBack = () => {
  uni.navigateBack();
}

//判断是否正是环境还是测试环境
Vue.prototype.$api_env = config.apiEnv === 0 ? 'test' : 'prod';

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