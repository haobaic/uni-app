<template>
	<view>
		<view class="tab">
			<template v-for='(item,index) in arr.cataData'>
				<view :key='index' :class='index == tab?"tab-item active":"tab-item"' @click="changeItem(index)">{{item.value}}</view>
			</template>

		</view>
		<view class='con'>
			 <waterfall-flow :list="recommendTpl" :loading="loading" @click="choose"></waterfall-flow>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex' //引入vuex
	// 瀑布流组件
	import WaterfallFlow from '../../components/nairenk-waterfall-flow/nairenk-waterfall-flow.vue';
	export default {
		data() {
			return {
				tab: 0,
				loading: true
			}
		},
		components: {
			WaterfallFlow
		},
		computed: {
			arr(){
				return this.$store.state.Menu.arr;
			},	
			recommendTpl() {
				return this.$store.state.Menu.list;
			},
		},
		// 触底
		onReachBottom() {
			var self = this;
			self.loading = true;
			self.shudonglower();
			self.fnNewList();
		},
		//下拉刷新
		 onPullDownRefresh() {
		        var self = this;
				uni.showNavigationBarLoading();
				self.shudonRefresh(self.item);
				self.$nextTick(function() {
					self.fnNewList();
				})
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
					uni.hideNavigationBarLoading();
		        }, 1000);
		    },
		async onLoad() {
			this.fnNewList();
			this.userDetails()
		},
		methods: {
			//导航点击
			changeItem(index) {
				this.tab = index;
				this.shudongAction(index)
				this.fnNewList();
			},
			//获取列表
			async fnNewList() {
				if (this.$store.state.Menu.list == '') {
					await this.MenuList()
				}
				var self = this;
				setTimeout(function() {
					self.recommendTpl
					self.loading = false;
				}, 1000)
			},
			...mapActions({
				MenuList: 'Menu/SetLit',
				shudongAction: 'Menu/shudongAction',
				shudonglower: 'Menu/shudonglower',
				shudonRefresh: 'Menu/shudonRefresh',
			}),
			// 点击详情
			choose(item) {
				// item 返回选中 JSON 对象
				console.log(item.id)
			},
			async userDetails() {
				var res = await this.ajax.get(this.apiUrl.userDetails, {
					id: '5d9c9273865a9844a301a0a5'
				});
				console.log(res)
			},
		}
	}
</script>

<style>
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
     .header{
		 width: 380rpx;
		 height: 50rpx;
		 display: flex;
		 align-items: center;
		 flex: 1;
		 margin: 0 auto;
	 }
	 .header view{
		 margin-right: 10rpx;
	 }
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}


	.tab {
		display: flex;
	}

	.tab-item {
		flex: 1;
		font-size: 10pt;
		text-align: center;
		line-height: 72rpx;
		border-bottom: 6rpx solid #eee;
	}

	.con {
		flex: 1;
		width: 750rpx;
		height: 100%;
	}

	.con>swiper {
		height: 100%;
		flex-direction: column;
	}

	.tab-item.active {
		color: #252525;

		border-bottom-color: #252525
	}

	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.red {
		width: 100%;
		height: 1200rpx;
	}
</style>
