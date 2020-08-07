<template>
	<view>
		<view class="test">
			<!-- <view>日期选择 - 示例</view>
			{{date}}
			<button type="primary" @click="onShowDatePicker('date')">选择日期</button>
			{{time}}
			<button type="primary" @click="onShowDatePicker('time')">选择时间</button> -->
			<input class="inp" v-model="datetime" @click="onShowDatePicker('datetime')" disabled="false"></input>
			<!-- <button type="primary" @click="onShowDatePicker('datetime')">选择日期时间</button> -->
			<!-- {{range[0]}} - {{range[1]}}
			<button type="primary" @click="onShowDatePicker('range')">选择日期范围</button>
			{{rangetime[0]}} - {{rangetime[1]}}
			<button type="primary" @click="onShowDatePicker('rangetime')">选择日期时间范围</button> -->
		</view>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'入住'" :end-text="'离店'"
		 :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>
<script>
	import MxDatePicker from "@/components/mz_datepicker/datepicker.vue";
	export default {
		props:[
			"timetype"
		],
		components: {
			MxDatePicker
		},
		data() {
			return {
				showPicker: false,
				date: '2019-01-01',
				time: '15:00:12',
				datetime: '',
				range: ['2019-01-01', '2019-01-06'],
				rangetime: ['2020-07-22 16:33:00', '2020-07-22 16:44:00'],
				type: 'rangetime',
				value: ''
			}
		},
		methods: {
			onShowDatePicker(type) { //显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
				console.log(this.timetype)
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					//选择的值
					console.log('value => ' + e.value);
					if(this.timetype==1){
						this.$emit("setS",e.value)
					}else{
						this.$emit("setT",e.value)
					}
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			}
		},
		
	}
</script>
<style scoped lang="scss">
	.inp {
		text-align: left;
		font-family: PingFangSC-Regular;
		font-size: 30rpx;
		height: 60rpx;
		padding-left: 20rpx;
	}

	.test {
		text-align: center;
		padding: 10px 0;
	}

	button {
		margin: 20upx;
		font-size: 28upx;
	}
</style>
