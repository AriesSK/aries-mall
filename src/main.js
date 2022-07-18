import Vue from 'vue'
import md5 from 'js-md5'
import App from './App.vue'
import router from './router'
import store from './store'
import {Button, Form, Field, Toast, Icon} from 'vant'
import 'lib-flexible/flexible'

// 表单 输入框 轻提示 按钮 图标
Vue.use(Form).use(Field).use(Toast).use(Button).use(Icon)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$md5 = md5;
