/**
 * @description 关于输入框监听输入和清除操作
 * @author Tim 
 * @since 2020/04/02
 * 
 * @note 用法说明:要是集成到当前vue页面上下环境中
 */
export default {
    methods: {
        /**
         * 清理输入框
         */
        clearInput(event) {
            let data = event.currentTarget.dataset || {};
            let clearObj = data.clearObj || "";

            if (clearObj) {
                this[clearObj] = "";
            }
        },

        /**
         * 输入框监听
         */
        onInput(event) {
            let target = event.currentTarget.dataset || {};
            let id = target.id || "";
            let val = event.detail.value;

            if (id) {
                this[id] = val;
            }
        }
    }
}