import axios from '../utils/axios'

// 获取分类接口
export function getCategory() {
  return axios.get('/categories')
}