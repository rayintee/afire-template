/*
 * @Author: Tim
 * @Date: 2020-07-22 11:09:27
 * @LastEditTime: 2020-07-22 11:13:26
 * @LastEditors: Please set LastEditors
 * @Description: 倒计时60s计步器 && 支持修改
 * @FilePath: /mzi-water-oos/src/mixins/count.js
 */

export default {
    data() {
        return {
            /*倒计时标志 */
            isWaitting: false,
            timer: null, //定时器
            countTime: 60 //默认的60、如果需要修改倒计时，即覆盖定义此countTime
        }
    },

    methods: {
        /**
         * 开始倒计时
         */
        startTask: function () {
            if (!this.timer) {
                this.countTime = 59; //优先设置
                this.timer = setInterval(() => {
                    let countTime = this.countTime;
                    if (countTime <= 0) {
                        this.stopTask();
                        return;
                    }

                    countTime--;
                    this.countTime = countTime;
                }, 1000);
            }
        },

        /**
         * 终止倒计时
         */
        stopTask: function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
                this.isWaitting = false;
                this.countTime = 60;
            }
        }
    },

    /**
     * 生命周期设定
     * 
     * 注意： 如果页面中定义了onUnload 方法，会被覆盖，此时需要手动引入如下的方法
     * 销毁倒计时器
     */
    onUnload: function () {
        this.stopTask();
    },

    onHide: function () {
        this.stopTask();
    }
}