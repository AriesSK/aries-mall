import axios from '../utils/axios'
/**
 * get 请求只从数据库获取数据，不改变，就像数据库 select 操作
 * put 请求向数据库发送数据并改变内容，但不改变数据种类，就像数据库的 update 操作
 * post 请求向数据库发送数据并改变内容和种类，就像数据库的 insert 操作
 * delete 请求删除数据库数据，就像数据库的 delete 操作
 */

// 添加购物车
export function addCart(params) {
  return axios.post('/shop-cart', params)
}

// 获取购物车信息
export function getCart(params) {
  return axios.get('/shop-cart', { params })
}

// 删除购物车商品
export function deleteCartItem(id) {
  return axios.delete(`/shop-cart/${id}`)
}

// 修改购物车商品数量
export function modifyCart(params) {
  return axios.put('/shop-cart', params)
}

export function getByCartItemIds(params) {
  return axios.get('/shop-cart/settle', { params })
}
