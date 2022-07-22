import { getCart } from '../service/cart'

// Vuex 的异步请求能力，这里的方法在页面中执行 this.$store.dispatch(xxx) 来执行
export default {
  async updateCart(ctx) {
    const { data } = await getCart()
    ctx.commit('addCart', {
      count: data.length || 0
    })
  }
}