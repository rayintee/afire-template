<!--
 * @Author: tim
 * @Date: 2020-07-28 20:17:30
 * @LastEditTime: 2020-08-09 16:19:56
 * @LastEditors: Please set LastEditors
 * @Description: 日期选择器
 * @FilePath: /mzi-water-oos/src/components/mz_date_picker/index.vue
-->
<template>
    <view class="_picker-date-wrapper" :class="openned ? 'openned' : ''" :animation="maskAnim">
        <view class="_picker-date-mask" @tap="close"></view>
        <view class="_picker-date-container" :animation="pickerAnim">
            <view class="_picker-date-header">
                <text class="_picker-data-all" v-if="allType" @tap="onChoiceAll">所有</text>
                <text class="_picker-date-close-btn" @tap="onSureTap">确定</text>
            </view>
            <view class="_picker-date-body">
                <view class="_picker-date-month">
                    <text class="_picker-arrow arrow-right" data-handler="pre" @tap="onDateChange"></text>
                    <view class="_picker-picked-month-txt">{{getHMonthInfo}}</view>
                    <text class="_picker-arrow arrow-left" data-handler="next" @tap="onDateChange"></text>
                </view>
                <view class="_picker-date-calendar">
                    <view class="_picker-week-row">
                        <view class="_picker-week-grid" v-for="(item, idx) in week" :key="item">{{item}}</view>
                    </view>
                    <view class="_picker-date-row">
                        <swiper class="_picker-swiper-container" circular="true" :current="swiperIndex"
                            @change="onSwiperChange">
                            <swiper-item class="_picker-date-grid">
                                <!-- :for-item="x" -->
                                <view v-for="(x, index) in calendar.first" :key="index" class="date-grid fc"
                                    :class="[x.month != month ? 'notCurrent' : x.date == today ? 'today' : '', x.date == beSelectDate ? 'choice' : '']"
                                    :data-month="x.month" :data-day="x.day" :data-date="x.date" @tap="onDayTap">
                                    <view class="date-grid-child choid-grid-child fc "
                                        :class="x.date >= today ? '':  !isFuture ? '' : 'notCurrent'">
                                        {{convertStr(x)}}</view>
                                </view>
                            </swiper-item>
                            <swiper-item class="_picker-date-grid">
                                <!--  wx:for-item="x" -->
                                <view v-for="(x, index) in calendar.second" :key="index" class="date-grid fc"
                                    :class="[x.month == month ? '' : 'notCurrent', x.date == today ? 'today' : '', x.date == beSelectDate ? 'choice' : '']"
                                    :data-month="x.month" :data-day="x.day" :data-date="x.date" @tap="onDayTap">
                                    <view class="date-grid-child choid-grid-child fc "
                                        :class="x.date >= today ? '':  !isFuture ? '' : 'notCurrent'">
                                        {{convertStr(x)}}</view>
                                    <!-- x.date == today ? '今天' : x.day -->
                                </view>
                            </swiper-item>
                            <swiper-item class="_picker-date-grid">
                                <view v-for="(x, index) in calendar.third" :key="index"
                                    :class="['date-grid fc ', x.month == month ? '' : 'notCurrent', x.date == today ? 'today' : '', x.date == beSelectDate ? 'choice' : '']"
                                    :data-month="x.month" :data-day="x.day" :data-date="x.date" @tap="onDayTap">
                                    <view class="date-grid-child choid-grid-child fc"
                                        :class="x.date >= today ? '':  !isFuture ? '' : 'notCurrent'">
                                        {{convertStr(x)}}</view>
                                    <!-- x.date == today ? '今天' : x.day -->
                                </view>
                            </swiper-item>
                            <swiper-item class="_picker-date-grid">
                                <view v-for="(x, index) in calendar.fourth" :key="index"
                                    :class="['date-grid fc', x.month == month ? '' : 'notCurrent', x.date == today ? 'today' : '', x.date == beSelectDate ? 'choice' : '']"
                                    :data-month="x.month" :data-day="x.day" :data-date="x.date" @tap="onDayTap">
                                    <view class="date-grid-child choid-grid-child fc"
                                        :class="x.date >= today ? '':  !isFuture ? '' : 'notCurrent'">
                                        {{convertStr(x)}}</view>
                                    <!-- x.date == today ? '今天' : x.day -->
                                </view>
                            </swiper-item>
                        </swiper>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'mz_date_picker',

        props: {
            isFuture: Boolean,
            week: {
                type: Array,
                default: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            },
            type: {
                type: String,
                default: "D" // ALL、M、D
            },
            allType: Boolean,
            monthArr: {
                type: Array,
                default: [{
                        k: "01",
                        l: "一月"
                    },
                    {
                        k: "02",
                        l: "二月"
                    },
                    {
                        k: "03",
                        l: "三月"
                    },
                    {
                        k: "04",
                        l: "四月"
                    },
                    {
                        k: "05",
                        l: "五月"
                    },
                    {
                        k: "06",
                        l: "六月"
                    },
                    {
                        k: "07",
                        l: "七月"
                    },
                    {
                        k: "08",
                        l: "八月"
                    },
                    {
                        k: "09",
                        l: "九月"
                    },
                    {
                        k: "10",
                        l: "十月"
                    },
                    {
                        k: "11",
                        l: "十一月"
                    },
                    {
                        k: "12",
                        l: "十二月"
                    },
                ]
            }
        },

        data() {
            return {
                swiperIndex: 1,
                swiperCopyIndex: 1,
                calendar: {
                    first: [],
                    second: [],
                    third: [],
                    fourth: []
                },
                day: "",
                year: "",
                month: "",
                date: "",
                swiperMap: ["first", "second", "third", "fourth"],
                today: "",
                thisMonth: "",
                beSelectDate: '',

                //动画相关的参数
                openned: false,
                maskAnim: null,
                pickerAnim: null,
            }
        },

        created() {
            this.checkedType = this.type;

            const date = new Date();

            //获取日期时间
            const year = date.getFullYear();
            const month = this.formatMonth(date.getMonth() + 1);
            const day = this.formatDay(date.getDate());
            const today = `${year}-${month}-${day}`;
            const thisMonth = `${year}${month}`;

            //自动生成当前临近2个月日历数据
            let calendar = this.generateThreeMonths(year, month);
            this.calendar = calendar;
            console.log(this.calendar)
            this.month = month;
            this.year = year;
            this.day = day;
            this.today = today;
            this.thisMonth = thisMonth;
            this.beSelectDate = today;
            this.date = `${year}-${month}`;
        },

        computed: {
            ///动态计算
            getHMonthInfo() {
                return this.year + '年 ' + this.month + '月'
            },

            convertStr(x) {
                return x.date == this.today ? '今天' : x.day;
            }
        },

        methods: {
            /**
             * 选则全部时间
             */
            onChoiceAll: function () {
                const that = this;
                this.beSelectDate = '';

                this.closeAnim(() => {
                    //最终选择的事件
                    that.$emit("onDayClick", {
                        date: ''
                    });
                });
            },

            /**
             * 打开弹窗
             * @param {*} value
             */
            open: function (value) {
                try {
                    //如果value为空就默认为当前时间
                    const date = !value ? new Date() : new Date(value);

                    //初始化日期控件
                    const year = date.getFullYear();
                    const month = this.formatMonth(date.getMonth() + 1);
                    const day = this.formatDay(date.getDate());

                    //是否有值
                    const flag = this.allType && !value;

                    this.day = day;
                    this.beSelectDate = flag ? '' : `${year}-${month}-${day}`;
                    this.changeDate(year, month);

                    //初始化数据
                    this.openned = true;

                    this.openAnim();
                } catch (err) {
                    console.error(err);
                }
            },

            /**
             * 关闭按钮
             */
            close: function () {
                this.closeAnim();
            },

            /**
             * 确定按钮点击事件
             * @param {*} event
             */
            onSureTap: function (event) {
                let date = `${this.beSelectDate}`;

                const that = this;
                this.closeAnim(() => {
                    //最终选择的事件
                    that.$emit("onDatePicked", {
                        date
                    });
                });
            },

            /**
             * 打开弹窗动画
             */
            openAnim: function (cb) {
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
                        timeFunction: "ease-in"
                    });

                    //上移动画
                    animation.translateY(0).step();

                    that.pickerAnim = animation.export();

                    typeof cb == "function" && cb();
                }, 130);
            },

            /**
             * 关闭弹窗动画
             */
            closeAnim: function (cb) {
                const that = this;
                //300ms完成缩放动画
                let animation = uni.createAnimation({
                    transformOrigin: "50% 50%",
                    duration: 280,
                    timeFunction: "ease-in"
                });

                //下移动画
                animation.translateY(632).step();

                this.pickerAnim = animation.export();

                setTimeout(() => {
                    //显示阴影
                    let maskAnimation = uni.createAnimation();
                    maskAnimation.opacity(0).step({
                        duration: 80
                    });

                    that.maskAnim = maskAnimation.export();
                }, 280);

                setTimeout(() => {
                    //设置数据
                    that.openned = false;

                    typeof cb == "function" && cb();
                }, 360);
            },

            /**
             * 切换date
             * @param {*} e
             */
            onDateChange: function (e) {
                let handler = e.currentTarget.dataset.handler;
                let {
                    year,
                    month
                } = this;
                let time = this.countMonth(year, month);

                if (handler == "pre") {
                    this.changeDate(time.lastMonth.year, time.lastMonth.month);
                } else {
                    this.changeDate(time.nextMonth.year, time.nextMonth.month);
                }
            },

            /**
             * 监听swiper滑动
             * @param {*} e
             */
            onSwiperChange: function (e) {
                const lastIndex = this.swiperCopyIndex;
                const currentIndex = e.detail.current;
                let flag = false;
                let {
                    year,
                    month,
                    day,
                    today,
                    date,
                    calendar,
                    swiperMap
                } = this;
                let change = swiperMap[(lastIndex + 2) % 4];
                let time = this.countMonth(year, month);
                let key = "lastMonth";

                if (lastIndex > currentIndex) {
                    lastIndex == 3 && currentIndex == 0 ? (flag = true) : null;
                } else {
                    lastIndex == 0 && currentIndex == 3 ? null : (flag = true);
                }
                if (flag) {
                    key = "nextMonth";
                }

                year = time[key].year;
                month = time[key].month;
                date = `${year}-${month}`;
                day = "";
                if (today.indexOf(date) !== -1) {
                    day = today.slice(-2);
                }

                time = this.countMonth(year, month);
                calendar[change] = null;
                calendar[change] = this.generateAllDays(time[key].year, time[key].month);

                ///数据同步赋值
                this.swiperCopyIndex = currentIndex;
                this.year = year;
                this.month = month;
                this.date = date;
                this.day = day;
                this.calendar = calendar;
            },

            /**
             * 点击具体的日期
             * @param {*} e
             */
            onDayTap: function (e) {
                let date = e.currentTarget.dataset.date;
                let {
                    month,
                    year
                } = this;
                let time = this.countMonth(year, month);
                let tapMon = e.currentTarget.dataset.month;
                let day = e.currentTarget.dataset.day;

                ///新增只能勾选未来日期的业务功能，含今天
                if (this.isFuture) {
                    const cdate = date.replace(/-/g, "");
                    const tdate = this.today.replace(/-/g, "");
                    console.log(cdate, tdate);
                    if (cdate < tdate) return;
                }

                if (tapMon == time.lastMonth.month) {
                    this.changeDate(time.lastMonth.year, time.lastMonth.month);
                } else if (tapMon == time.nextMonth.month) {
                    this.changeDate(time.nextMonth.year, time.nextMonth.month);
                } else {
                    this.day = day;
                }
                // if (date > this.data.today) return false;
                let beSelectDate = e.currentTarget.dataset.date;
                this.beSelectDate = beSelectDate;
                this.showCaldenlar = false;

                //触发事件
                console.log('beselectDate:', beSelectDate);

                this.$emit("onDateClicked", {
                    date: beSelectDate
                });
            },

            /**
             * 直接改变日期
             * @param {*} year
             * @param {*} month
             */
            changeDate(year, month) {
                let {
                    day,
                    today
                } = this;
                let calendar = this.generateThreeMonths(year, month);
                let date = `${year}-${month}`;

                date.indexOf(today) == -1 ? (day = "01") : (day = today.slice(-2));
                this.calendar = calendar;
                this.day = day;
                this.date = date;
                this.month = month;
                this.year = year;
            },

            /**
             * 生成临近2个月份数据
             * @param {*} year
             * @param {*} month
             */
            generateThreeMonths(year, month) {
                let {
                    swiperCopyIndex,
                    swiperMap,
                    calendar
                } = this;
                let thisKey = swiperMap[swiperCopyIndex]; //当前索引
                let lastKey =
                    swiperMap[swiperCopyIndex - 1 == -1 ? 3 : swiperCopyIndex - 1]; //最终索引
                let nextKey =
                    swiperMap[swiperCopyIndex + 1 == 4 ? 0 : swiperCopyIndex + 1]; // 下一个索引

                let time = this.countMonth(year, month);
                //复写上一个月
                delete calendar[lastKey];
                calendar[lastKey] = this.generateAllDays(
                    time.lastMonth.year,
                    time.lastMonth.month
                );

                //复写当前月份
                delete calendar[thisKey];
                calendar[thisKey] = this.generateAllDays(
                    time.thisMonth.year,
                    time.thisMonth.month
                );

                //复写下一个月
                delete calendar[nextKey];
                calendar[nextKey] = this.generateAllDays(
                    time.nextMonth.year,
                    time.nextMonth.month
                );

                return calendar;
            },

            /**
             * 临近2个月数据处理
             * @param {*} year
             * @param {*} month
             */
            countMonth: function (year, month) {
                // 上个月
                let lastMonth = {
                    month: this.formatMonth(parseInt(month) - 1)
                };
                lastMonth.year =
                    parseInt(month) == 1 && parseInt(lastMonth.month) == 12 ?
                    `${parseInt(year) - 1}` :
                    year + "";
                lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month);

                //当前月
                let thisMonth = {
                    year,
                    month,
                    num: this.getNumOfDays(year, month)
                };

                // 下个月
                let nextMonth = {
                    month: this.formatMonth(parseInt(month) + 1)
                };
                nextMonth.year =
                    parseInt(month) == 12 && parseInt(nextMonth.month) == 1 ?
                    `${parseInt(year) + 1}` :
                    year + "";
                nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month);

                return {
                    lastMonth,
                    thisMonth,
                    nextMonth
                };
            },

            /**
             * 生成一个月的日历
             * @param {*} year
             * @param {*} month
             */
            generateAllDays: function (year, month) {
                let lastMonth = this.lastMonthDays(year, month);
                let thisMonth = this.currentMonthDays(year, month);
                let nextMonth = this.nextMonthDays(year, month);
                let days = [].concat(lastMonth, thisMonth, nextMonth);
                return days;
            },

            /**
             * 获取本月天数
             * @param {*} year
             * @param {*} month
             * @param {*} day
             */
            getNumOfDays: function (year, month, day = 0) {
                return new Date(year, month, day).getDate();
            },

            /**
             * 获取上个月天数
             * @param {*} year
             * @param {*} month
             */
            lastMonthDays: function (year, month) {
                const lastMonth = this.formatMonth(parseInt(month) - 1);
                const lastMonthYear =
                    parseInt(month) == 1 && parseInt(lastMonth) == 12 ?
                    `${parseInt(year) - 1}` :
                    year;
                const lastNum = this.getNumOfDays(lastMonthYear, lastMonth); //上月天数
                let startWeek = this.getWeekOfDate(year, month - 1, 1); //本月1号是周几
                let days = [];

                if (startWeek == 7) {
                    return days;
                }
                const startDay = lastNum - startWeek;

                return this.generateDays(lastMonthYear, lastMonth, lastNum, {
                    startNum: startDay,
                    notCurrent: true
                });
            },

            /**
             * 当前月天数详情
             * @param {*} year
             * @param {*} month
             */
            currentMonthDays: function (year, month) {
                const numOfDays = this.getNumOfDays(year, month);
                return this.generateDays(year, month, numOfDays);
            },

            /**
             * 下个月天数详情
             * @param {*} year
             * @param {*} month
             */
            nextMonthDays(year, month) {
                const nextMonth = this.formatMonth(parseInt(month) + 1);
                const nextMonthYear =
                    parseInt(month) == 12 && parseInt(nextMonth) == 1 ?
                    `${parseInt(year) + 1}` :
                    year;
                const nextNum = this.getNumOfDays(nextMonthYear, nextMonth); //下月天数
                let endWeek = this.getWeekOfDate(year, month), //本月最后一天是周几
                    days = [],
                    daysNum = 0;
                if (endWeek == 6) {
                    return days;
                } else if (endWeek == 7) {
                    daysNum = 6;
                } else {
                    daysNum = 6 - endWeek;
                }

                return this.generateDays(nextMonthYear, nextMonth, daysNum, {
                    startNum: 1,
                    notCurrent: true
                });
            },

            /**
             *
             * 获取指定月第n天是周几		|
             * 9月第1天： 2017, 08, 1 |
             * 9月第31天：2017, 09, 0
             * @param {any} year
             * @param {any} month
             * @param {number} [day=0] 0为最后一天，1为第一天
             * @returns number 周 1-7,
             */
            getWeekOfDate: function (year, month, day = 0) {
                let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
                dateOfMonth == 7 ? (dateOfMonth = 0) : "";
                return dateOfMonth;
            },

            /**
             * 生成日详情
             * @param {*} year
             * @param {*} month
             * @param {*} daysNum
             * @param {*} option
             */
            generateDays: function (
                year,
                month,
                daysNum,
                option = {
                    startNum: 1,
                    notCurrent: false
                }
            ) {
                const weekMap = ["一", "二", "三", "四", "五", "六", "日"];
                let days = [];
                for (let i = option.startNum; i <= daysNum; i++) {
                    let week = weekMap[new Date(year, month - 1, i).getUTCDay()];
                    let day = this.formatDay(i);
                    days.push({
                        date: `${year}-${month}-${day}`,
                        event: false,
                        day,
                        week,
                        month,
                        year
                    });
                }
                return days;
            },

            /**
             * 格式化月份
             * @param {*} month
             */
            formatMonth: function (month) {
                let monthStr = "";
                if (month > 12 || month < 1) {
                    monthStr = Math.abs(month - 12) + "";
                } else {
                    monthStr = month + "";
                }
                monthStr = `${monthStr.length > 1 ? "" : "0"}${monthStr}`;
                return monthStr;
            },

            /**
             * 格式化天数
             * @param {*} day
             */
            formatDay: function (day) {
                return `${(day + "").length > 1 ? "" : "0"}${day}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    ._picker-date-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 9990;
        display: none;
        opacity: 0;
        transition: .2s ease-in-out;
    }

    ._picker-date-mask {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.6);
    }

    .openned {
        display: block !important;
    }

    ._picker-date-container {
        height: 632rpx;
        background: #fff;
        box-shadow: 0 -1px 9rpx 0 rgba(0, 0, 0, 0.5);
        box-sizing: border-box;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        transform: translateY(632rpx);
        -webkit-transform: translateY(632rpx);
    }

    ._picker-date-header {
        height: 68rpx;
        box-sizing: border-box;
        letter-spacing: 0;
        position: relative;
    }

    ._picker-date-close-btn {
        display: inline-block;
        height: 68rpx;
        font-size: 28rpx;
        color: #3A95E8;
        line-height: 68rpx;
        vertical-align: middle;
        padding: 0 30rpx;
        position: absolute;
        right: 0;
        top: 0;
    }

    ._picker-data-all {
        display: inline-block;
        height: 68rpx;
        font-size: 28rpx;
        color: #3A95E8;
        line-height: 68rpx;
        vertical-align: middle;
        padding: 0 30rpx;
    }

    ._picker-date-close-btn:active {
        background: #f6f6f6;
    }

    ._picker-date-type-wrapper {
        height: 100%;
        display: -webkit-box;
        display: flex;
        align-items: center;
        padding: 0 30rpx;
    }

    ._picker-date-switch {
        height: 40rpx;
        display: inline-block;
        line-height: 40rpx;
        text-align: center;
        width: 70rpx;
        border: 1px solid #d7d7d7;
        border-radius: 11rpx;
    }

    .switch-default:first-child {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .switch-default:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    ._picker-date-switch.active {
        color: #fff;
        background: #3A95E8;
        border: 1px solid #3A95E8;
    }

    /* body css */

    ._picker-date-body {
        position: absolute;
        top: 68rpx;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }

    .type-by-month {
        z-index: 10000;
        background: #fff;
    }

    ._picker-date-month {
        height: 80rpx;
        display: -webkit-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 30rpx;
    }

    ._picker-arrow {
        width: 80rpx;
        display: inline-block;
        height: 100%;
        position: relative;
        text-align: center;
    }

    ._picker-arrow::before {
        content: "";
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .arrow-right::after,
    .arrow-left::after {
        content: "\003C";
        display: inline-block;
        vertical-align: middle;
        font-size: 32rpx;
        color: #3A95E8;
    }

    .arrow-left::after {
        content: "\003E";
    }

    ._picker-picked-month-txt {
        display: inline-block;
        width: 200rpx;
        line-height: 80rpx;
        height: 100%;
        text-align: center;
        vertical-align: middle;
        font-size: 32rpx;
    }

    ._picker-date-calendar {
        position: absolute;
        top: 80rpx;
        left: 0;
        right: 0;
        bottom: 0;
    }

    ._picker-week-row,
    ._picker-date-grid,
    .row-type-by-month {
        display: -webkit-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    ._picker-week-grid {
        flex: 1;
        height: 40rpx;
        color: #949494;
        font-size: 26rpx;
        text-align: center;
        line-height: 40rpx;
        background: #fafafa;
    }

    ._picker-date-row {
        position: absolute;
        top: 46rpx;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .row-type-by-month {
        top: 25rpx;
    }

    ._picker-swiper-container {
        height: 100%;
        width: 100%;
    }

    ._picker-date-grid,
    .row-type-by-month {
        flex-wrap: wrap;
        align-content: flex-start;
    }

    .fc {
        display: -webkit-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .date-grid,
    .month-grid {
        width: 107.14rpx;
        height: 72rpx;
        text-align: center;
        font-size: 26rpx;
        color: #2a2a2a;
    }

    .month-grid {
        width: 187.5rpx;
        height: 130rpx;
        font-size: 28rpx;
    }

    .today {
        color: #3A95E8;
    }

    .date-grid .date-grid-child {
        height: 72rpx;
        width: 72rpx;
    }

    /* .month-grid view {
    height: 100rpx;
    width: 100rpx;
} */

    .choice .choid-grid-child {
        border-radius: 50%;
        background: #3A95E8;
        background-position: center;
        color: #fff;
    }

    .notCurrent {
        color: silver;
    }
</style>