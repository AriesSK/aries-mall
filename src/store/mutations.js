export default {
  // 通过 ctx.commit('addCart', { xxx }) 调用 addCart 方法，合并全局状态的数据
  addCart(state, payload) {
    state.cartCount = payload.count
  }
}