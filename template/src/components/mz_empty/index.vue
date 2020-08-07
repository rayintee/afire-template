<!--
 * @Author: your name
 * @Date: 2020-07-23 14:24:29
 * @LastEditTime: 2020-07-23 14:24:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mzi-water-oos/src/components/mz_empty/index.vue
-->
<template>
    <view class="flex-col empty-container y-start">
        <image :style="'width: ' + imgWidth + 'rpx;height: ' + imgHeight + 'rpx;'" :src="emptyImg" />
        <view class="empty-msg-wrap">
            <text class="empty-msg">{{emptyMsg}}</text>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            emptyImg: String,
            emptyMsg: {
                type: String,
                default: '暂无数据~'
            },
            imgWidth: Number,
            imgHeight: Number
        }
    }
</script>

<style lang="scss" scoped>
    .empty-container {
        height: 100%;
        width: 100%;
        justify-content: flex-start;
        align-items: center;
        padding-top: 30%;
        box-sizing: border-box;
        overflow: hidden;
    }

    .empty-msg-wrap {
        font-size: 26upx;
        color: #A0A5AF;
        padding-top: 24upx;
    }

    .empty-msg {
        display: inline-block;
    }

    // .flex-col {
    //     display: -webkit-box;
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    // }
</style>