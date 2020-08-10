<!--
 * @Author: Tim
 * @Date: 2020-07-17 10:55:44
 * @LastEditTime: 2020-07-21 11:13:45
 * @LastEditors: Please set LastEditors
 * @Description: 页面自定义头部容器
 * @FilePath: /mzi-water-oos/src/components/page_container/index.vue
-->
<template>
    <view class="page-container">
        <view class="page-layout-hd-bg" v-if="theme != 'white'">
            <image class="page-layout-bg-img" src="/static/layout-hd-bg.png" />
        </view>
        <view class="flex-col page-container-wrap">
            <view class="page-container-status-bar" :style="getNavHeight"></view>
            <view class="flex-row page-container-hd">
                <view class="flex-row page-container-hd-inner">
                    <view class="flex-row page-back-arrow-area" v-if="hasHistoryPage" @tap="goBack">
                        <image class="page-back-arrow" :src="getArrowIcon" />
                    </view>
                    <view class="page-container-hd-title txt-overflow"
                        :class="theme != 'white' ? 'theme-white' : 'theme-black'">
                        <text>{{getTitle}}</text>
                    </view>
                </view>
            </view>
            <view class="flex-1 page-container-bd">
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
    const TAG = "mz-layout.vue";

    export default {
        name: "LayoutPage",

        props: {
            theme: {
                type: String,

                /* 默认的轻主题色，也即为白色 */
                default: 'white'
            },

            title: {
                type: String,

                /* 默认的为空，会从全局store里面配置的默认的title获取 */
                default: ""
            }
        },

        data() {
            return {
                hasHistoryPage: false,
                whiteBackArrow: '/static/icon-arrow-back-white.png',
                blackBackArrow: '/static/icon-arrow-back-black.png'
            }
        },

        computed: {
            getTitle() {
                return this.title || this.$store.state.defaultTitle;
            },

            getArrowIcon() {
                return this.theme != 'white' ? this.whiteBackArrow : this.blackBackArrow;
            },

            getNavHeight() {
                ///默认的单位px -->> 此处刚好为状态栏的高度
                let statusBarHeight = this.$store.state.systemInfo.statusBarHeight;
                return `height: ${statusBarHeight}px;`
            }
        },

        created() {
            // console.log(this.$store.state.defaultTitle)
            let pageList = getCurrentPages();

            if (pageList.length > 1) {
                console.logger(TAG, '此为小程序页面堆栈中第' + pageList.length + '个页面');
                this.hasHistoryPage = true;
            }
        },

        methods: {
            goBack(e) {
                ///返回上一级
                uni.navigateBack();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-container-wrap {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        overflow: hidden;
        box-sizing: border-box;
    }

    .page-container-hd {
        position: relative;
        width: 100%;
        align-items: flex-end;
    }

    .page-container-bd {
        width: 100%;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
    }

    .page-container-hd-inner {
        width: 100%;
        height: 86upx;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        justify-content: center;
        /* 兼容小程序头部右侧原生自带更多炫富按钮 */
        padding-right: 32upx;

        .page-back-arrow-area {
            height: 86upx;
            width: 80upx;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            padding-left: 20upx;
            z-index: 99;

            .page-back-arrow {
                width: 50upx;
                height: 50upx;
            }
        }
    }

    .page-container-hd-title {
        font-size: 36upx;
        text-align: center;
        max-width: 80%;

        &.theme-white {
            color: #FFFFFF;
        }

        &.theme-black {
            color: #14121E;
        }
    }

    .page-layout-hd-bg {
        position: relative;
        width: 100%;

        .page-layout-bg-img {
            width: 750upx;
            height: 569upx;
        }
    }
</style>