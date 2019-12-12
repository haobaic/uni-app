import Vue from 'vue'
import App from './App'
import ajax from './utils/ajax.js' 
import apiUrl from './utils/parm.js'
Vue.prototype.ajax = ajax;
Vue.prototype.apiUrl = apiUrl
Vue.config.productionTip = false
import store from './store'
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
