// 修改 state 需要触发的方法，能够接收两个参数，第一个是 state 包含所有状态值，第二个是 payload 载荷，是外部通过 store.commit 方法触发 mutations 时额外带入的值
export default {
  // 通过 ctx.commit('addCart', { xxx }) 调用 addCart 方法，合并全局状态的数据
  addCart(state, payload) {
    // 修改 state，将其中的购物车数量设置为载荷中的数量
    state.cartCount = payload.count
  }
}