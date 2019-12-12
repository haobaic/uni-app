import Vue from 'vue'
import Vuex from 'vuex';
import Menu from './menu.js'
Vue.use(Vuex)

const state = {};
const mutations = {};
const actions = {}
const getters = {}
const store = new Vuex.Store({
	state: state,
	mutations: mutations,
	actions: actions,
	getters: getters,
	modules: {
		Menu
	}
})
export default store;
