import axios from '../utils/axios' // 引入二次封装的 axios

// 获取用户信息接口
export function getUserInfo() {
    return axios.get('/user/info')
}

// 登录接口
// axios.js 配置了 post 请求发送 json 参数，请求 json 参数时 params 不需要加 {}
export function login(params) {
    return axios.post('user/login', params)
}

// 注销接口
export function logout() {
    return axios.post('/user/logout')
}

// 注册接口
export function register(params) {
    return axios.post('user/register', params)
}