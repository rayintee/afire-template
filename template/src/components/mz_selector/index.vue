<!--
 * @Author: Tim
 * @Date: 2020-07-24 11:40:16
 * @LastEditTime: 2020-08-07 16:58:46
 * @LastEditors: Please set LastEditors
 * @Description: 选择器：下拉选择器
 * @FilePath: /mzi-water-oos/src/components/mz_selector/index.vue
-->
<template>
    <!-- @modalClosed="onModalClosed" -->
    <mz-drawer ref="modalWrapper">
        <view class="picker-header">
            <text class="picker-header-cancel" @tap.stop="closedDirect">取消</text>
            <text class="picker-header-sure" @tap="closeBox">确定</text>
        </view>

        <!-- 小区列表 -->
        <picker-view class="picker-view-wrap" :value="[pickId]" indicator-class="picker-view-checked"
            @change="onPickerChange" v-if="openned">
            <picker-view-column>
                <view class="area-item-row" v-for="(item, index) in itemData" :key="index">
                    <!--
                        默认的如果不传label标志字段名，则取item自身
                     -->
                    <text class="area-txt">{{itemLabel ? item[itemLabel] : item}}</text>
                </view>
            </picker-view-column>
        </picker-view>
    </mz-drawer>
</template>

<script>
    import mzDrawer from "@/components/mz_drawer/index";

    const TAG = "tpl_viewer_list.vue";
    export default {
        props: {
            itemData: {
                type: Array,
                default: []
            },

            pickId: {
                type: Number,
                default: 0
            },

            itemLabel: String
        },

        data() {
            return {
                changeId: 0,
                openned: false
            }
        },

        components: {
            'mz-drawer': mzDrawer
        },

        methods: {
            show() {
                console.log(1111)
                if (this.itemData.length == 0) {
                    console.logger(TAG, 'show() --->', 'itemData为空')
                    return;
                }

                this.openned = true;

                this.$nextTick(() => {
                    if (this.$refs.modalWrapper) this.$refs.modalWrapper.open();
                })
            },

            /**
             * 确定按钮
             */
            closeBox() {
                const that = this;
                this.$refs.modalWrapper.close(() => {
                    that.openned = false;
                    let item = that.itemData[that.changeId];

                    //重新请求
                    that.$emit('onPickChange', {
                        item,
                        index: that.changeId
                    });
                });
            },

            onPickerChange(e) {
                let index = e.detail.value[0];
                this.changeId = index;
            },

            closedDirect() {
                this.$refs.modalWrapper.close(() => {
                    this.openned = false;
                });
            },

            // 关闭遮罩层
            onModalClosed(e) {
                this.$refs.modalWrapper.close(() => {
                    this.openned = false;
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    /* modal框 */
    .picker-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 90upx;
        box-sizing: border-box;
        text-align: right;
    }

    .picker-header-sure,
    .picker-header-cancel {
        height: 100%;
        display: inline-block;
        padding: 0 35upx;
        font-size: 32upx;
        color: $mzi-default-theme;
        line-height: 90upx;
    }

    .picker-view-wrap {
        height: 480upx;
    }

    .area-item-row {
        line-height: 80upx;
        font-size: 32upx;
        text-align: center;
    }

    .area-txt {
        font-size: 32upx;
    }

    .picker-view-checked {
        height: 80upx;
    }

    .picker-header-cancel {
        color: grey;
    }
</style>