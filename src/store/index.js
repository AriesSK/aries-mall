import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

// 初始化 store，之后在全局 this 中可以调用 $store 属性
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {}
})
