
let devtools=uni.getSystemInfoSync().platform=="devtools"
let  apiUrl= devtools?'http://127.0.0.1:3001':'/api';
const extConfig = uni.getExtConfigSync ? uni.getExtConfigSync() : {}
const appId = extConfig.appId || 'NlvadLeW607cmnYrZIPOS9yM';

export default {
  appId: appId,
  base:apiUrl,
  //登陆
  login: apiUrl + '/login/login',
  //验证登陆
  checklogin: apiUrl + '/login/checklogin',
  //获取积分
  credit: apiUrl + '/login/credit',
  //获取用户信息
  userinfo: apiUrl + '/login/userinfo',
  //获取列表
  userlist: apiUrl + '/list',
  //详情
  userDetails: apiUrl + '/details'
}