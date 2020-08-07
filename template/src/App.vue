<script>
	const TAG = 'App.vue';

	export default {
		onLaunch: function () {
			console.logger(TAG, 'onLaunch()', 'App Launch')
		},
		onShow: function () {
			console.logger(TAG, 'onShow()', 'App Show')
		},
		onHide: function () {
			console.logger(TAG, 'onHide()', 'App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/styles/app.scss";
</style>