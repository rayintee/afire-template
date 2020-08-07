<!--
 * @Author: your name
 * @Date: 2020-07-30 19:59:31
 * @LastEditTime: 2020-08-07 16:48:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /mzi-water-oos/src/pages/home/index.vue
-->
<template>
    <mz-layout title="首页">

        <!-- 首页模块渲染 -->
        <view class="page-container">
            首页
        </view>

    </mz-layout>
</template>

<script>
    const TAG = "home.vue";
    export default {
        name: 'HomePage',


        data() {
            return {

            }
        },

        created() {},

        /**
         * @description 页面生命周期监听 -- 监听下拉刷新
         */
        onPullDownRefresh() {
            console.logger(TAG, 'onPullDownRefresh()', 'refresh');
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1200);
        },

        methods: {}
    }
</script>

<style lang="scss" scoped>
    .page-container {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>