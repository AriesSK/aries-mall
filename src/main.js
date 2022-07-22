import Vue from 'vue'
import md5 from 'js-md5'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Form, Field, Toast, Icon, Swipe, SwipeItem, SwipeCell, PullRefresh, List, Tab, Tabs, GoodsAction, GoodsActionIcon, GoodsActionButton } from 'vant'
import 'lib-flexible/flexible'

// 表单 输入框 轻提示 按钮 图标 轮播 轮播卡片 活动单元格 下拉刷新 列表 标签 标签组 商品组件 商品图标 商品按钮
Vue.use(Form).use(Field).use(Toast).use(Button).use(Icon).use(Swipe).use(SwipeItem).use(SwipeCell).use(PullRefresh).use(List).use(Tab).use(Tabs).use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  // h 是 createElement 函数的简写，用于构建虚拟 DOM
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$md5 = md5
// 注册 router
window.vRouter = router