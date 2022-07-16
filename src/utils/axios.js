import axios from 'axios'
import { Toast } from 'vant'

// 本次项目的请求地址，开发环境和生产环境用一套
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? '//47.99.134.126:28019/api/v1' : '//47.99.134.126:28019/api/v1'
// 跨域请求时是否携带 cookie，本项目无跨域请求
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 通过 token 判断用户登录状态
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
// post 请求发送 json 形式的数据包
axios.defaults.headers.post['Content-Type'] = 'application/json'
// interceptors 拦截器，每个请求都会经过这个拦截器，返回的数据可以通过拦截处理后返回
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.resultCode != 200) {
    if (res.data.message) Toast.fail(res.data.message)
    if (res.data.resultCode == 416) {
      // 返回 416 代表没有登录状态，路由跳转到 /login 页面
      // 这里的 window.vRouter 是在 main.js 里面设置好的 window.vRouter = router
      window.vRouter.push({ path: '/login' })
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios