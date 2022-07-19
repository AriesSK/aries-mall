import axios from '../utils/axios'

// 获取首页需要的信息
export function getHome(params) {
  return axios.get('/index-infos')
}