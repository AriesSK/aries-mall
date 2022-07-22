import axios from '../utils/axios'

// 获取分类接口
export function getCategory() {
  return axios.get('/categories')
}

// 搜索商品接口 
export function search(params) {
  // 请求键值对参数而不是 json 参数时，params 需要加 {}
  return axios.get('/search', { params })
}

// 获取商品详情
export function getDetail(id) {
  return axios.get(`/goods/detail/${id}`)
}