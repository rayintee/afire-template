/*
 * @Author: Tim
 * @Date: 2020-07-16 15:30:40
 * @LastEditTime: 2020-08-10 11:40:32
 * @LastEditors: Please set LastEditors
 * @Description: 项目入口文件
 * @FilePath: /mzi-water-oos/src/settings.js
 */
/**
 * @description 工程基础设置信息，根据实际项目配置
 * @author Tim 
 * @since 2020/04/02
 */

export default {
    ///接口环境：如 0 -- 测试、1 -- 线上
    apiEnv: "",

    ///登录url
    loginUrl: "",

    ///系统默认的标题
    defaultTitle: "afire-template",

    ///默认的主题色
    ///note：需要同步到uni.scss里面，js中为全局js使用，uni.scss为scss中使用
    defaultTheme: "#0076FE",

    ///存放静态资源域名的地方
    staticDomain: ''
}