<!--
 * @Author: Tim
 * @Date: 2020-07-20 17:15:44
 * @LastEditTime: 2020-07-27 17:00:45
 * @LastEditors: Please set LastEditors
 * @Description: modal弹窗自定义
 * @FilePath: /mzi-water-oos/src/components/mz_modal/index.vue
-->
<template>
    <view class="">
        <view :class="['tx-modal-wrap', opened ? 'opened' : '']">
            <view class="tx-modal-mask anim-fadeIn"></view>
            <view class="tx-modal-cotent">

                <view :class="['tx-modal-content-inner', opened? 'animated fadeInUp':'', isBig ? 'is-big' : '']"
                    :style="top > 0 ? 'top:' + top + 'rpx' : ''">
                    <view class="tx-modal-content-inner-body">
                        <slot>
                            <!-- to-do something -->
                        </slot>
                    </view>
                    <view class="flex-row tx-modal-btn-row">
                        <view class="flex-1 tx-modal-btn line-right" v-if="isConfirm" @tap.stop="onCancel">
                            <text class="text" :style="'color: ' + btnCancelColor">{{btnCancelTxt || '取消'}}</text>
                        </view>
                        <view class="flex-1 tx-modal-btn" @tap.stop="onSure">
                            <text class="text txt-high-light"
                                :style="getBtnConfirmColor">{{btnConfirmTxt || '确定'}}</text>
                        </view>
                    </view>
                </view>

            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "TxModal",

        props: {
            isConfirm: Boolean,
            isBig: Boolean,
            top: Number, ///指定顶部的高度
            btnConfirmTxt: {
                type: String,
                default: "确定"
            },
            btnConfirmColor: {
                type: String,
                default: "#3A95E8"
            },
            btnCancelTxt: {
                type: String,
                default: "取消"
            },
            btnCancelColor: {
                type: String,
                default: "#2A2A2A"
            }
        },

        data() {
            return {
                opened: false, //是否打开
                modalAnimationData: {}
            }
        },

        created() {

        },

        methods: {
            getBtnConfirmColor() {
                return 'color: ' + this.btnConfirmColor;
            },

            show: function () {
                if (this.opened) return;
                this.opened = true;
            },

            hide: function () {
                if (!this.opened) return;
                this.opened = false;
            },

            onSure: function (e) {
                this.hide();
                this.$emit("onSure");
            },

            onCancel: function (e) {
                this.hide();
                this.$emit("onCancel");
            }
        }


    }
</script>

<style lang="scss" scoped>
    .opened {
        display: block !important;
    }

    .tx-modal-wrap {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 90000;
        display: none;
        /* 这里防止当用户长按屏幕，出现的黑色背景色块，以及 iPhone 横平时字体的缩放问题 */
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

        .tx-modal-mask {
            background: rgba(0, 0, 0, 0.60);
            width: 100%;
            height: 100%;
        }

        .tx-modal-cotent {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 9001;

            .tx-modal-content-inner {
                width: 600upx;
                position: absolute;
                left: 75upx;
                top: 40%;
                // margin: 50% auto 0;
                background: #FFFFFF;
                border-radius: 14upx;
                overflow: hidden;
                transform: scale3d(.8, .8, 0);
                opacity: 0.2;

                .tx-modal-content-inner-body {
                    padding: 70upx 30upx 50upx;
                    position: relative;
                }

                &.is-big {
                    top: 30%;

                    .tx-modal-content-inner-body {
                        padding: 40upx 30upx 40upx;
                    }
                }

                .tx-modal-btn-row {
                    border-top: 1px solid #D9D9D9;
                    height: 109upx;
                    box-sizing: border-box;
                }

                .line-right {
                    border-right: 1px solid #D9D9D9;
                }

                .tx-modal-btn {
                    height: 100%;
                    font-size: 32upx;
                    color: #2A2A2A;
                    text-align: center;

                    &:active {
                        background: #f8f8f8;
                    }

                    &::after {
                        content: "";
                        width: 0;
                        height: 100%;
                        display: inline-block;
                        vertical-align: middle;
                    }

                    // text.txt-high-light {
                    //     color: #3A95E8 !important;
                    // }

                    .text {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>