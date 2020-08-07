/**
 * @default 事件监听器，类似app中事件通知触发机制
 * @author Tim
 * @api api说明[note: app级别监听器]
 *
 * ==============================================
 * const app = getApp();
 *
 * //监听并执行页面注册事件[首次注册]
 * addListener(eventName, callback);
 * e.g
 *    在onShow生命周期函数中监听该事件
 *    app.addListener('eventA', () => {...})
 *
 * //销毁页面级别注册事件[与register配套使用]
 * destroyEvent();
 * e.g
 *    在onUnload生命周期函数中监听该事件
 *    app.destroyEvent(); //销毁当前页面注册监听的[全部事件]
 *
 * //触发页面级别事件
 * emitEvent(eventName, data);
 * e.g
 *    任意位置，想要触发的事件的地方
 *    app.emitEvent('eventA', {param:object}/'param':string)
 * ==============================================
 *
 */

export default {
  __globalEventListener__: {}, //初始化全局的事件监听对象

  /**
   * @description 注册事件&&处理事件
   *
   * @param {*} eventName
   * @param {*} callback
   *
   * e.g app.addListener('ea', () => {
   *  ....
   * })
   *
   * note: 由page.onShow生命周期函数触发
   * 获取当前页面实例 --- ios上存在获取不准: 主要获取上一个界面的实例对象
   * 不要通过getCurrentPages()获取实例对象
   * 通过当前页面this.route获取路径实例参数
   */
  addListener(eventName, callback) {
    if (typeof eventName != "string" || typeof callback != "function") return;

    /**
     * NOTE: getCurrentPages()函数也能拿到当前的环境变量context，
     * 但是会存在回调时候不准的问题，路由队列在onShow调用时候存在异步问题，
     * 故不能在onShow里面注册函数，需要在onLoad中实现注册事件监听
     *
     */
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1]; //获取当前页面实例
    const route = currentPage.route; //获取当前页面路由

    let pageEvents = this.__globalEventListener__[route] || {};
    //初始化
    //如果发现当前事件集合中没有该事件名，则为初次注册该事件
    if (!pageEvents[eventName]) {
      //注册当前页面对象
      pageEvents[eventName] = {
        flag: false
      };

      this.__globalEventListener__[route] = pageEvents;
      console.log(`${route}页面成功注册事件[${eventName}]`);
    }

    //当前页面已经注册该事件名
    //获取当前生命周期中onShow函数
    let _onShow;
    if (typeof currentPage.onShow === "function") {
      _onShow = currentPage.onShow;
    }

    //获取当前生命周期中onUnload函数
    let _onUnload;
    if (typeof currentPage.onUnload === "function") {
      _onUnload = currentPage.onUnload;
    }

    //复写onShow函数
    const that = this;
    let event = pageEvents[eventName];
    currentPage.onShow = function() {
      _onShow && _onShow();
      if (event.flag) {
        //当前事件处于激活状态 && 执行事件 && 并仅执行一次
        event["flag"] = false;
        that.__globalEventListener__[route][eventName] = event;
        typeof callback === "function" && callback(event.data || {});
      }
    };

    //复写onUnload函数
    currentPage.onUnload = function() {
      that.destroyEvent(route);
      _onUnload && _onUnload();
    };
  },

  /**
   * @description 提交事件: 全局出发操作
   * @param {*} eventName
   * @param {*} data
   *
   * NOTE: 此方法为触发事件，并传递一个参数，
   * 监听的页面需要提前初始化才能捕获该事件
   */
  emitEvent(eventName, data = {}) {
    if (!eventName) return;

    for (var r in this.__globalEventListener__) {
      let pageEvents = this.__globalEventListener__[r]; //获取页面事件对象
      let event = pageEvents[eventName]; //获取对应页面当前事件对象
      if (event) {
        //赋值
        event["flag"] = true;
        event["data"] = data;
        this.__globalEventListener__[r][eventName] = event;
      }
    }
  },

  /**
   * @description 销毁事件注册机制
   *
   * 此处改为自动获取页面实例，
   * getCurrentPages() 获取页面堆栈实例
   */
  destroyEvent(route) {
    if (!route) {
      //获取当前页面实例
      let pages = getCurrentPages();
      let curPage = pages[pages.length - 1];
      route = curPage.route;
    }

    let pageEvents = this.__globalEventListener__[route];
    if (!pageEvents) return; //事件为空: 当前页面未注册任何事件

    this.__globalEventListener__[route] = {}; //清空当前页面注册事件
    console.log(`${route}页面成功销毁事件`);
  }
};
