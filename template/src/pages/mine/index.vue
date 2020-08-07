<!--
 * @Author: tim
 * @Date: 2020-07-30 19:59:43
 * @LastEditTime: 2020-08-07 16:53:00
 * @LastEditors: Please set LastEditors
 * @Description: 我的个人中心页面
 * @FilePath: /mzi-water-oos/src/pages/mine/index.vue
-->
<template>
    <mz-layout theme="black" title="我的">
        <view class="page-container">
            我的 ...
        </view>
    </mz-layout>
</template>

<script>
    const TAG = 'mine.vue';
    export default {
        name: 'MinePage',

        data() {
            return {}
        },

        created() {
            console.logger(TAG, 'created() --->', 'start create mine page...');
        },

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

</style>