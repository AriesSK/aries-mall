// state 用来存储全局状态，类似组件中的 data 属性，只不过是面向整个应用的，通过 this.$store.state 获取
export default {
  // 购物车数量，初始为 0
  cartCount: 0,
  // 需要缓存的组件名列表，初始为空
  includedComponents: []
}