<template>
	<view>

		<view class="tab">
			<template v-for='(item,index) in arr.cataData'>
				<view :key='index' :class='tab == index?"tab-item active":"tab-item"' @click="changeItem(index)">{{item.value}}</view>
			</template>

		</view>
		<view class='con'>
			<swiper :current='item' @change='changeTab'>
				<swiper-item v-for='item in 5' :key='item'>
					<view class="header" v-show="!hideHeader">
						<view>{{refreshTime}}</view>
						<view>下拉刷新中…</view>
					</view>
					<scroll-view @scroll='fnScroll' @touchmove='touchmove' scroll-y lower-threshold='200' class="red" @scrolltolower='fnScrolltolower()'
					 @scrolltoupper='fnScrolltoupper()'>
					 <waterfall-flow :list="recommendTpl" :loading="loading" @click="choose"></waterfall-flow>
						<!-- <p v-for='(item,index) in recommendTpl'>{{item.title}}</p> -->
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex' //引入vuex
	// 瀑布流组件
	import WaterfallFlow from '../../components/nairenk-waterfall-flow/nairenk-waterfall-flow.vue';
	export default {
		data() {
			return {
				item: 0,
				tab: 0,
				scrollTop: 9,
				hideHeader: true,
				refreshTime: '', // 刷新的时间 
				loading: true
			}
		},
		components: {
			WaterfallFlow
		},
		computed: {
			...mapState({
				arr: state => state.Menu.arr
			}),
			recommendTpl() {
				return this.$store.state.Menu.list;
			},
		},
		async onLoad() {
			var that = this;
			var date = new Date();
			that.refreshTime = date.toLocaleTimeString()
			this.fnNewList();
			this.userDetails()
		},
		methods: {
			// 选中
			choose(item) {
				// item 返回选中 JSON 对象
				console.log(item)
			},
			// 触底
			fnScrolltolower() {
				var self = this;
				self.loading = true;
				self.shudonglower();
				self.fnNewList();
			},
			fnScroll(e) {
				console.log(e.detail.scrollTop)
				this.scrollTop = e.detail.scrollTop
			},
			//手动刷新
			touchmove: function(e) {
				// console.log(this.scrollTop)
				if (this.scrollTop < 10) {
					let sx = e.touches[0].pageX;
					let sy = e.touches[0].pageY;
					if (sy < 200) {
						this.fnScrolltoupper()
					}
				}

			},
			fnScrolltoupper(e) {
				wx.showNavigationBarLoading()
				var self = this;
				var date = new Date();
				self.refreshTime = date.toLocaleTimeString(),
					self.hideHeader = false
					self.shudonRefresh(self.item);
					self.$nextTick(function() {
						self.fnNewList();
					})
				setTimeout(function() {
					console.log('下拉刷新');
					wx.hideNavigationBarLoading() //完成停止加载
					self.hideHeader = true
				}, 1000)

			},
			changeItem(index) {
				this.item = index;
				this.shudongAction(index)
				this.fnNewList();
			},
			changeTab(e) {
				this.tab = e.detail.current;
				this.shudongAction(e.detail.current)
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
			async userDetails() {
				// var res = await this.ajax.get(this.apiUrl.userDetails, {
				// 	id: '5d9c9273865a9844a301a0a5'
				// });
				// console.log(res)
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
