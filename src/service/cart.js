import axios from '../utils/axios'

// 添加购物车
export function addCart(params) {
  return axios.post('/shop-cart', params);
}

// 获取购物车信息
export function getCart(params) {
  return axios.get('/shop-cart', { params });
}