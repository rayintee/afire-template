<template>
    <view class="modal-wrapper">
        <view :class="[openned ? 'modal-mask openned' : 'modal-mask']" :animation="maskAnim" @tap.stop="close"></view>
        <view class="modal-container" :animation="modalAnim">
            <slot></slot>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'MzDrawer',

        data() {
            return {
                openned: false,
                maskAnim: null,
                modalAnim: null
            }
        },

        methods: {
            /**
             * 关闭city picker
             * @param {*} cb
             */
            close(cb) {
                let that = this;
                //300ms完成缩放动画
                let animation = uni.createAnimation({
                    transformOrigin: "50% 50%",
                    duration: 200,
                    timeFunction: "linear"
                });

                //下移动画
                animation.translateY(700).step();
                this.modalAnim = animation.export();

                setTimeout(() => {
                    //显示阴影
                    let maskAnimation = uni.createAnimation();
                    maskAnimation.opacity(0).step({
                        duration: 80
                    });

                    that.maskAnim = maskAnimation.export();
                }, 200);

                setTimeout(() => {
                    //设置数据
                    that.openned = false;

                    that.$emit("modalClosed");

                    typeof cb === 'function' && cb();
                }, 280);
            },

            /**
             * @default 打开modal
             * @param {*} callback
             */
            open() {
                //初始化数据
                this.openned = true;

                //显示阴影
                let maskAnimation = uni.createAnimation();
                maskAnimation.opacity(1).step({
                    duration: 100
                });
                this.maskAnim = maskAnimation.export();

                // 延迟30ms
                const that = this;
                setTimeout(() => {
                    //300ms完成缩放动画
                    let animation = uni.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 300,
                        timeFunction: "ease-in-out"
                    });

                    //上移动画
                    animation.translateY(0).step();

                    that.modalAnim = animation.export();
                }, 130);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: none;
        opacity: 0;
        width: 100%;
        z-index: 8000;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.5);
    }

    .modal-container-cover {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }

    .openned {
        display: block !important;
    }

    /* picker container */

    .modal-container {
        height: 570upx;
        background: #fff;
        box-sizing: border-box;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 8001;
        transform: translateY(570upx);
        -webkit-transform: translateY(570upx);
    }
</style>