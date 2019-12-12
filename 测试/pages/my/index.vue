<template>
     <view class="">
     	<template v-if='devtools'>
     		<button @click="credit">获取用户的积分</button>
     		<button open-type="getUserInfo" @getuserinfo="getUserInfo"> 登录 </button>
     	</template>
     </view>

</template>

<script>
	export default {
		data() {
			return {
				devtools: '',
			}
		},
		computed: {
		
		},
		async onLoad() {
			this.devtools = uni.getSystemInfoSync().platform == "devtools";
			if (this.devtools) {
				// 验证小程序是否登录
				this.checkLogin(res => {
					console.log('is_login: ', res.is_login)
					if (!res.is_login) {
						this.fnLodin()
					}
				})
			}
		},
		methods: {
			// 点击登录
			async fnLodin() {
				var self = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						self.ajax.post(self.apiUrl.login, {
							code: loginRes.code
						}).then((res) => {
							console.log(res)
							wx.setStorage({
								key: 'token',
								data: res.token
							})
						});
					}
				})
			},
			//验证
			checkLogin: function(callback) {
				var token = uni.getStorageSync('token')
				if (!token) {
					// 从数据缓存中获取token      
					callback({
						is_login: false
					})
					return
				}
				this.ajax.get(this.apiUrl.checklogin, {
					token: token
				}).then((res) => {
					callback({
						is_login: res.is_login
					})
				});
			},
			//积分
			async credit() {
				var res = await this.ajax.get(this.apiUrl.credit, {
					token: uni.getStorageSync('token')
				});
				console.log(res)
			},
			//获取用户信息
			async getUserInfo(info) {
				var token = uni.getStorageSync('token');
				var {
					rawData,
					signature,
					encryptedData,
					iv,
					errMsg
				} = info.detail
				if (errMsg != 'getUserInfo:ok') return false;
				var data = await this.ajax.post(this.apiUrl.userinfo + '?token=' + token, {
					rawData,
					signature,
					encryptedData,
					iv
				})
				console.log(data)
			},
		}
	}
</script>

<style>

</style>

 