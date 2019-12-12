import ajax from '@/utils/ajax.js';
import api from '@/utils/parm.js'
const MENU_STATE = {
    cataData: [{ key: 'all', value: "全部" },
    { key: 'good', value: "精华" },
    { key: 'share', value: "分享" },
    { key: 'ask', value: "问答" },
    { key: 'job', value: "招聘" },
    // { key: 'dev', value: "客户端测试" },
	],
    currentCata: { key: 'all', value: "全部" },
	page:1,
	limit:20,
}
/* 
  投资者关系vux 
 */

const state = {
	arr:MENU_STATE,
	list:[],
	status:0
};
const actions = {
	async SetLit(context,state) {
		var url=api.userlist
		// 'https://cnodejs.org/api/v1/topics'
		const result = await ajax.get(url,{page:MENU_STATE.page,limit:MENU_STATE.limit,tab:MENU_STATE.currentCata.key,});
		context.commit('SetLit', result.list)
		
	},
	shudongAction(context,state) {  //点击状态
		if(context.state.status!=state){  //结果相同时不出发接口
			context.state.status=state
			MENU_STATE.currentCata=MENU_STATE.cataData[state];
			MENU_STATE.page=1;
			context.dispatch('SetLit') //在这里触发
		}
	},
	shudonRefresh(context,state){
		MENU_STATE.page=1;
		context.dispatch('SetLit') //在这里触发
	},
	async shudonglower(context,state){
		++MENU_STATE.page;
		await context.dispatch('SetLit')
	}
};
const mutations = {
	async SetLit(state, param) {
		if(MENU_STATE.page==1){
			 state.list = param.data;
		}else{
			 state.list = state.list.concat(param.data);
		}
	},
};
const getters = { //计算属性
	
}
export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
