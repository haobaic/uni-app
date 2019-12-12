import apiUrl from '@/utils/parm.js'
var base=apiUrl.base

export default {
  baseOptions(params, method = 'GET') {
    const { url, data } = params
    let contentType = method == 'GET'?'application/x-www-form-urlencoded':'application/json'
    contentType = params.contentType || contentType;
	const userData = {
		userSession: uni.getStorageSync('token')||'',
		appId:apiUrl.appId,
		accesstoken: 'eaabd34b-0617-4150-86d6-83e59cf8415b'
	}
	const newdata = Object.assign({}, userData, data);
    return new Promise((resolve, reject) => {
      uni.request({
        url: url, 
        data: newdata,
        method,
        header: { 
			'Content-type': contentType
			// 'Content-Type': 'application/x-www-form-urlencoded'
			},
        success: (res) => {
          resolve(res.data)
        },
        fail(e) {
          reject(e)
        }
      });
    })
  },
 //get方法
  get(url, data = '') {
    const option = { url, data }
    return this.baseOptions(option)
  },
  //post方法
  post(url, data, contentType) {
    const params = {url, data, contentType}
    return this.baseOptions(params, 'POST')
  },
  //获取url
  getHost() {
    return base
  }
}