<!--
 * @Author: Tim
 * @Date: 2020-07-20 11:18:41
 * @LastEditTime: 2020-07-20 17:08:55
 * @LastEditors: Please set LastEditors
 * @Description: radio组件
 * @FilePath: /mzi-water-oos/src/components/mz_radio/index.vue
--> 
<template>
    <view class="wg-radio-group">
        <view :class="['wg-radio-circle', disabled ? 'radio-disabled' : '']">
            <text :class="['wg-radio-dot', checked ? 'active' : '']"></text>
        </view>
        <text class="radio-label">{{label}}</text>
    </view>
</template>

<script>
    export default {
        name: 'MzRadio',

        props: {
            checked: {
                type: Boolean,
                default: false
            },
            label: String,
            disabled: Boolean
        },

    }
</script>

<style lang="scss" scoped>
    .wg-radio-group {
        display: -webkit-box;
        display: flex;
        align-items: center;
    }

    .wg-radio-circle {
        position: relative;
        width: 30upx;
        height: 30upx;
        background: #ffffff;
        border: 1px solid $mzi-default-theme;
        border-radius: 50%;
        text-align: center;
        display: -webkit-box;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: hidden;
        // padding: 8upx;
    }

    .wg-radio-dot {
        display: inline-block;
        width: 16upx;
        height: 16upx;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-54%, -54%, 0);
        // margin: auto;
    }

    .wg-radio-dot.active {
        background: $mzi-default-theme;
    }

    .radio-label {
        font-size: 28upx;
        color: #2A2A2A;
        line-height: 28upx;
        display: inline-block;
        padding: 0 15upx;
    }

    .radio-disabled {
        background: #F9F9F9;
    }

    .radio-disabled .wg-radio-dot.active {
        opacity: 0.6;
    }
</style>