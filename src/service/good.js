import axios from '../utils/axios'

// 获取分类接口
export function getCategory() {
  return axios.get('/categories')
}

// 搜索商品接口
export function search(params) {
  return axios.get('/search', { params })
}