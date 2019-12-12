<template>
	<view>
		<view class="wrap">
			<scroll-view scroll-y class="chat" :scroll-top="scrollTop" @scroll="scroll">
				<view class="list">
					<view class="chat-news" v-for="(item,index) in list" :key="index">
						<!-- 根据角色判断 -->
						<template v-if="item.role === 'me'">
							<view class="news-lf">
								<text class="new-txt">{{item.content}}</text>
								<image class="new-img" src="/static/me.jpg"></image>
							</view>
						</template>
						<!-- 对方的消息显示在左侧 -->
						<template v-else>
							<view>
								<image class="new-img" src="/static/avatar.png"></image>
								<text class="new-txt new-text">{{item.content}}</text>
							</view>
						</template>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 聊天输入 -->
		<view class="message" :style="devtools?'':'bottom:48px'">
			<form>
				<input type="text" cursor-spacing="20" placeholder="请输入聊天内容..." @input="bindChange"></input>
				<button type="primary" @click="send" formType="reset" size="small" button-hover="blue">发送</button>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				list: [],
				limit: 0,
				lockReconnect: false,
				count: 0,
				massage: '',
				devtools: uni.getSystemInfoSync().platform == "devtools",
			}
		},
		// 监听页面加载
		onLoad: function() {
			this.linkSocket()
		},
		methods: {
			//建立websocket连接
			linkSocket() {
				var that = this
				uni.connectSocket({
					// 本地服务器地址
					url: 'ws://localhost:3000',
					success() {
						that.initEventHandle()
					}
				})
			},
			//绑定事件
			initEventHandle() {
				var that = this
				uni.onSocketOpen(() => {
					console.log('WebSocket连接打开')
					this.message = ''
					uni.sendSocketMessage({
						data: this.message,
					})
				})
				uni.onSocketError((res) => {
					console.log('WebSocket连接打开失败')
					that.reconnect()
				})
				uni.onSocketClose((res) => {
					console.log('WebSocket 已关闭！')
					that.reconnect()
				})
				uni.onSocketMessage(msg => {
					var data = JSON.parse(msg.data)
					data.id = this.id++
					data.role = 'server'
					var list = this.list
					list.push(data)
					this.list = list
					this.rollingBottom()
				})
			},
			//重新连接
			reconnect() {
				var that = this;
				if (that.lockReconnect) return;
				that.lockReconnect = true;
				clearTimeout(that.timer)
				// console.log(that.limit)
				if (that.limit < 10) { //连接10次后不再重新连接
					that.timer = setTimeout(() => {
						that.linkSocket();
						that.lockReconnect = false;
						console.log("次数:", that.limit)
					}, 5000); //每隔5秒连接一次
					that.limit = that.limit + 1
				}
			},
			send: function() {
				// 判断发送内容是否为空
				if (this.message) {
					wx.sendSocketMessage({
						data: this.message,
					})
					// 我自己的消息
					// console.log(this.list)
					var list = this.list
					list.push({
						id: this.count++,
						content: this.message,
						role: 'me'
					})
					this.list = list;
					this.message = '';
					this.rollingBottom()
				} else {
					// 弹出提示框
					uni.showToast({
						title: '消息不能为空哦~',
						icon: 'none',
						duration: 2000
					})
				}
			},
			scroll: function(e) {
				console.log(e.detail.scrollTo)
			},
			// 监听input值的改变
			bindChange(res) {
				this.message = res.detail.value
			},
			// 页面卸载，关闭连接
			onUnload() {
				wx.onSocketClose();
				wx.showToast({
					title: '连接已断开~',
					icon: 'none',
					duration: 2000
				})
			},
			// 聊天内容始终显示在最低端
			rollingBottom(e) {
				uni.createSelectorQuery().selectAll('.list').boundingClientRect(rects => {
					rects.forEach(rect => {
						this.scrollTop = rect.bottom;
					})
				}).exec()
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f7f7f7;
		height: 100%;
	}

	.chat {
		padding: 5rpx 10rpx;
		font-size: 14px;
		line-height: 80rpx;
		word-break: break-all;
		margin-bottom: 100rpx;
		box-sizing: border-box;
	}

	.wrap {
		height: 100%;
		width: 100%;
		display: flex;
		border-top: 0px;
		box-sizing: border-box;
	}

	/* 聊天 */

	.chat-news {
		width: 100%;
		overflow: hidden;
	}

	.news-lf {
		float: right;
		padding-right: 20rpx;
	}

	.chat-news::after {
		display: block;
		height: 0;
		clear: both;
		content: '';
	}

	.new-rl {
		float: left;
		padding-left: 20rpx;
	}

	.new-img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		vertical-align: middle;
		margin-right: 10rpx;
	}

	.new-txt {
		max-width: 300rpx;
		display: inline-block;
		border-radius: 6rpx;
		line-height: 60rpx;
		background-color: #95d4ff;
		padding: 5rpx 20rpx;
		margin: 0 10rpx;
		margin-left: 50rpx;
	}

	.new-text {
		margin-left: 0;
		background: lightgreen;
	}

	/* 信息输入区域 */

	.message {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 102rpx;
		padding: 10rpx;
		background-color: #fff;
		border-top: 2rpx solid #eee;
		box-sizing: border-box;
		z-index: 3;
	}

	.message input {
		float: left;
		width: 76%;
		height: 100%;
		line-height: 80rpx;
		padding: 0 10rpx;
		font-size: 35rpx;
		color: #666;
	}

	.message button {
		float: right;
		font-size: 35rpx;
	}
</style>
