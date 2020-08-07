<template>
    <view class="scroll-view-wrap">
        <scroll-view class="scroll-view custom-class" :scroll-y="scrollY" :scroll-with-animation="scrollWithAnimation"
            :lower-threshold="lowerThresHold" :enable-back-to-top="enableBackToTop" :scroll-into-view="scrollIntoView"
            @scroll="scroll" @scrolltolower="scrollToLower">
            <view class="refresh-content refresh-container" @touchstart="touchstart" @touchmove="touchmove"
                @touchend="touchend" :animation="animationData">
                <view class="refresh-load" :style="'top: -' + loader.height +'px;'">
                    <view class="refresh-load__content">
                        <view :class="['refresh-pull-arrow', className]" />
                        <view class="refresh-load__text">
                            <view class="refresh-load__text__">{{text}}</view>
                            <view class="refresh-load__text__">更新于：{{time}}</view>
                        </view>
                    </view>
                </view>

                <!-- 插槽 && list内容 -->
                <slot />

                <!-- 加载更多 -->
                <mz-loadmore v-if="paged" :line-bg="loadingBg" :loading="loading" :completed="completed" />
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import MzLoadmore from "../mz_loadmore/index"
    export default {
        components: {
            'mz-loadmore': MzLoadmore
        },

        props: {
            //是否需要分页, 默认的需要分页
            paged: {
                type: Boolean,
                default: true
            },

            // 集成loading模块
            loading: Boolean,
            completed: Boolean,
            loadingBg: {
                type: String,
                default: '#f8f8f8'
            },

            lowerThresHold: {
                type: Number,
                default: 60
            },
            scrollWithAnimation: {
                type: Boolean,
                default: true
            },
            enableBackToTop: {
                type: Boolean,
                default: false
            },
            scrollIntoView: {
                type: String,
                default: ""
            }
        },

        data() {
            return {
                scrollY: true,
                touchYDelta: "",
                isLoading: false,
                loadWrapH: "",
                winfactor: 0.2,
                translateVal: "",
                isMoved: false,
                firstTouchY: "",
                initialScroll: "",
                friction: 2.5,
                scrollTop: 0,
                triggerDistance: 100,
                className: "",
                animationData: {},
                animation: {},
                system: "",
                brand: "",
                loader: {
                    height: 500
                },
                time: "",
                text: "下拉可以刷新"
            }
        },

        methods: {
            scroll(e) {
                //修复滑动后回顶部不能再次刷新的
                let scrollTop = e.detail.scrollTop;
                this.scrollTop = scrollTop <= 1 ? 0 : scrollTop;
                this.$emit("scroll", e.detail.scrollTop);
            },

            scrollToLower() {
                this.$emit("lower");
            },

            touchstart(ev) {
                let isLoading = this.isLoading;
                let scrollTop = this.scrollTop;

                if (isLoading) {
                    return;
                }

                const touchobj = ev.touches[0];
                this.isMoved = false;
                // this.sDuration = "0ms";
                this.touchYDelta = "";
                this.firstTouchY = parseInt(touchobj.clientY);
                this.initialScroll = scrollTop;
            },

            touchmove(ev) {
                let isLoading = this.isLoading;

                if (isLoading) {
                    return;
                }

                let touchobj = ev.touches[0];
                let touchY = parseInt(touchobj.clientY);
                let touchYDelta = touchY - this.firstTouchY;

                if (
                    this.initialScroll > 0 ||
                    this.scrollTop > 0 ||
                    (this.scrollTop == 0 && touchYDelta < 0)
                ) {
                    this.firstTouchY = touchY;
                    return;
                }

                /* eslint-enable */
                const yDelta =
                    this.brand === "devtools" ?
                    touchYDelta ** 0.85 :
                    this.system === "ios" ?
                    touchYDelta ** 0.5 :
                    touchYDelta ** 0.85;
                // let translateVal = yDelta
                this.animation.translate3d(0, yDelta, 0).step();
                let obj =
                    touchYDelta >= this.triggerDistance ? {
                        className: "refresh-pull-up",
                        text: '松开可以刷新'
                    } : {
                        className: "refresh-pull-down",
                        text: '下拉可以刷新'
                    };

                this.touchYDelta = touchYDelta;
                this.animationData = this.animation.export();
                this.className = obj.className;
                this.text = obj.text;
                this.isMoved = true;
            },

            touchend(ev) {
                if (this.isLoading || !this.isMoved) {
                    this.isMoved = false;
                    return;
                }

                // 根据下拉高度判断是否加载
                if (this.touchYDelta >= this.triggerDistance) {
                    this.isLoading = true;
                    this.scrollY = false;
                    this.animation.translate3d(0, this.loader.height, 0).step();
                    this.animationData = this.animation.export();
                    this.className = "refreshing";
                    this.text = "正在刷新...";
                    this.$emit("refresh", "success");
                } else {
                    this.animation.translate3d(0, 0, 0).step({
                        duration: 300
                    });
                    this.animationData = this.animation.export();
                    // this.triggerEvent('refresh', 'error');
                }

                this.isMoved = false;
            },

            reset() {
                this.isLoading = false;
                this.scrollY = true;
                this.className = "refresh-pull-up";
                this.text = "下拉可以刷新";

                this.$nextTick(() => {
                    this.animation.translate3d(0, 0, 0).step({
                        duration: 300
                    });

                    const time = this.getTime();
                    this.animationData = this.animation.export();
                    this.className = "refresh-pull-down";
                    this.time = time;
                });

            },

            throttle(fn, delay) {
                let allowSample = true;
                return function (e) {
                    if (allowSample) {
                        allowSample = false;
                        setTimeout(function () {
                            allowSample = true;
                        }, delay);
                        fn(e);
                    }
                };
            },

            getTime() {
                const date = new Date();
                const year = date.getFullYear();
                let m = this.getFriendlyTime(
                    date.getMonth() + 1
                );
                let d = this.getFriendlyTime(date.getDate());
                let h = this.getFriendlyTime(
                    date.getHours()
                );
                let mm = this.getFriendlyTime(date.getMinutes());
                let ss = this.getFriendlyTime(
                    date.getSeconds()
                );
                return `${year}-${m}-${d} ${h}:${mm}:${ss}`;
            },

            getFriendlyTime(time) {
                return time < 10 ? "0" + time : time;
            }

        },

        mounted() {
            let animation = uni.createAnimation({
                duration: 0,
                timingFunction: "linear"
            });
            let system = "android";
            const systemInfo = uni.getSystemInfoSync();
            if (/iPhone/.test(systemInfo.model)) {
                system = "ios";
            }
            const time = this.getTime();
            this.time = time;
            this.system = system;
            this.animation = animation;
            this.brand = systemInfo.brand;
            this.animationData = animation.export();
            uni.createSelectorQuery()
                .in(this)
                .selectAll(".refresh-load")
                .boundingClientRect(res => {
                    if (res && res.length) {
                        this.loader = res[0];
                    }
                })
                .exec();
        }
    }
</script>

<style lang="scss" scoped>
    .scroll-view-wrap {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        box-sizing: border-box;
    }

    .scroll-view {
        position: relative;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .scroll-view .new-block {
        width: 100%;
        height: 100px;
        background-color: #333;
    }

    .scroll-view .new-block:nth-child(even) {
        background-color: #fff;
    }

    .scroll-view .refresh-loader {
        width: 100%;
        height: 100%;
    }

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg) scale(1);
            transform: rotate(0deg) scale(1);
        }

        50% {
            -webkit-transform: rotate(180deg) scale(1);
            transform: rotate(180deg) scale(1);
        }

        100% {
            -webkit-transform: rotate(360deg) scale(1);
            transform: rotate(360deg) scale(1);
        }
    }

    @-webkit-keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg) scale(1);
            transform: rotate(0deg) scale(1);
        }

        50% {
            -webkit-transform: rotate(180deg) scale(1);
            transform: rotate(180deg) scale(1);
        }

        100% {
            -webkit-transform: rotate(360deg) scale(1);
            transform: rotate(360deg) scale(1);
        }
    }

    .scroll-view .refresh-content {
        position: relative;
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        min-height: 100%;
    }

    .scroll-view .refresh-load {
        /* background-color: #f5f5f5; */
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 12px 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .scroll-view .refresh-load .refresh-load__content {
        width: 260px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .scroll-view .refresh-load .refresh-load__content .refresh-load__text .refresh-load__text__ {
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .refresh-load__text {
        color: #A0A5AF;
    }

    .scroll-view .refresh-pull-arrow {
        width: 24px;
        height: 24px;
        visibility: visible;
        margin-right: 20px;
        background: no-repeat center;
        background-image: url('data:image/svg+xml;charset=utf-8,<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M99.225 3.528c8.34 0 15.104 6.763 15.104 15.105 0 8.34-6.766 15.105-15.105 15.105-8.342 0-15.105-6.763-15.105-15.105S90.883 3.528 99.225 3.528zM76.567 48.843h45.315c4.17 0 7.552 3.38 7.552 7.552v5.035c0 4.172-3.382 7.552-7.552 7.552H76.567c-4.172 0-7.553-3.38-7.553-7.552v-5.035c0-4.172 3.38-7.552 7.553-7.552zm-10.07 35.245h65.455c4.17 0 7.552 3.38 7.552 7.552v5.035c0 4.172-3.382 7.552-7.552 7.552H66.497c-4.172 0-7.553-3.38-7.553-7.552V91.64c0-4.172 3.38-7.552 7.553-7.552zm8.044 87.596c-20.397-23.16-45.805-52.352-45.805-52.352h140.98s-25.146 28.735-45.4 51.884c-33.454 38.234-18.118 36.4-49.774.468z" fill="#707070" class="transform-group"/></svg>');
        background-size: cover;
        z-index: 10;
        -webkit-transform: rotate(0deg) translate3d(0, 0, 0);
        transform: rotate(0deg) translate3d(0, 0, 0);
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
    }

    .scroll-view .refresh-pull-down {
        -webkit-transform: rotate(0deg) translate3d(0, 0, 0);
        transform: rotate(0deg) translate3d(0, 0, 0);
    }

    .scroll-view .refresh-pull-up {
        -webkit-transform: rotate(180deg) translate3d(0, 0, 0);
        transform: rotate(180deg) translate3d(0, 0, 0);
    }

    .scroll-view .refreshing {
        width: 24px;
        height: 24px;
        background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=');
        -webkit-animation: rotate 1s 0s linear infinite;
        animation: rotate 1s 0s linear infinite;
    }

    .scroll-view .loading-load {
        width: 100%;
        position: relative;
        padding: 12px 0;
    }
</style>