// action 和 mutation 类似，但 action 是通过提交 mutation 来修改 action 的，而不是直接修改，并且 action 有异步能力，调用 action 通过执行 this.$store.dispatch()
import { getCart } from '../service/cart'

// Vuex 的异步请求能力，请求异步数据后触发状态更新
export default {
  async updateCart(ctx) {
    const { data } = await getCart()
    // 这里 commit 有两个参数，第一个是调用的 mutation 的名字，第二个是载荷，这里提交了一个对象，里面存着购物车数量
    ctx.commit('addCart', {
      count: data.length || 0
    })
  }
}