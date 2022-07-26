<template>
<div class="product-list-wrap">
  <div class="product-list-content">
    <!-- 顶部搜索框 -->
    <header class="category-header wrap">
      <i class="nbicon nbfanhui" @click="goBack"></i>
      <div class="header-search">
        <i class="nbicon nbSearch"></i>
        <!-- 将 input 中的输入值通过 v-model 绑定至 keyword 变量 -->
        <input type="text" class="search-title" v-model="keyword"/>
      </div>
      <span class="search-btn" @click="getSearch">搜索</span>
    </header>
    <!-- TabBar 标签切换 -->
    <van-tabs typeof="card" color="#1baeae" @click="changeTab">
      <van-tab title="推荐" name=""></van-tab>
      <van-tab title="新品" name="new"></van-tab>
      <van-tab title="价格" name="price"></van-tab>
    </van-tabs>
  </div>
  <!-- 商品展示 滚动加载 -->
  <!-- 该组件监听页面下拉事件，下拉则说明需要重新加载，触发 onRefresh 方法，v-model 值表示是否处在加载状态中 -->
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="product-list-refresh">
    <!-- 在滚动条与底部距离小于 offset 时会触发 load 事件，通过 onLoad 方法加载新一页的数据 -->
    <!-- v-model 值表示是否处在加载状态，在加载状态*不触发* load 事件，组件滚动到底部会触发 load 事件并将 loading 设为 true -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" @offset="300">
      <div class="product-item" v-for="(item, index) in productList" :key="index" @click="productDetail(item)">
        <img :src="item.goodsCoverImg"/>
        <div class="product-info">
          <!-- p 块，span 行内，显示文字 -->
          <p class="name">{{ item.goodsName }}</p>
          <p class="subtitle">{{ item.goodsIntro }}</p>
          <span class="price">￥ {{ item.sellingPrice }}</span>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</div>
</template>

<script>
  import { search } from '../service/good'

  export default {
    name: 'productList',
    data() {
      return {
        // 初始的 keyword 通过路由传参中获取，或者为空，之后从输入框中获取
        keyword: this.$route.query.keyword || '',
        // 判断是否需要清空当前的列表重新请求数据
        refreshing: false,
        // 是否处在加载状态中，为 true 会显示"加载中..."
        loading: false,
        // 判断列表是否已加载完
        finished: false,
        productList: [],
        totalPage: 0,
        page: 1,
        orderBy: ''
      }
    },
    mounted() {
      // 缓存该组件
      this.$store.commit('includedComponents', ['productList'])
    },
    methods: {
      async init() {
        // const { a } = this.b 是 es6 的解构语法，等同于 const a = this.b.a
        // 通过路由传参获取商品分类号 categoryId 的值，是从 Category 页面传过来的，使用 query 传参
        const { categoryId, from } = this.$route.query
        // 两者均为空，不进行搜索
        if (!categoryId && !this.keyword) {
          this.finished = true
          this.loading = false
          return
        }
        // 根据 categoryId 或 keyword 搜索商品列表
        // 获取 data 和 data.list，const { list } = data
        const { data, data: { list } } = await search({
          // 设置请求参数，参数名: 参数值
          pageNumber: this.page,
          goodCategoryId: categoryId,
          keyword: this.keyword,
          orderBy: this.orderBy
        })
        // 将不同页的数据拼接
        this.productList = this.productList.concat(list)
        for (const i of this.productList) {
          if (i.goodsCoverImg.charAt(0) == "/") {
            i.goodsCoverImg = "http://backend-api-01.newbee.ltd" + i.goodsCoverImg
          }
        }
        this.totalPage = data.totalPage
        // 因为前面触发 load 事件后 loading 被设为了 true，此状态下无法再触发 load 事件，因此需要恢复设置
        this.loading = false
        // 当前页数超过总页数，说明已加载完
        if (this.page >= data.totalPage) this.finished = true
      },
      goBack() {
        this.$router.go(-1)
      },
      productDetail(item) {
        this.$router.push({ path: `product/${item.goodsId}` })
      },
      getSearch() {
        this.onRefresh()
      },
      // 用于加载数据
      onLoad() {
        // refreshing 为 false 是继续加载，加载下一页的数据直到全加载完
        if (!this.refreshing && this.page < this.totalPage) {
          this.page += 1
        }
        // refreshing 为 true 是刷新页面，需要清空原列表
        if (this.refreshing) {
          this.productList = []
          this.refreshing = false // 重置刷新标识
        }
        this.init()
      },
      // 该方法用于刷新页面，清空列表，重新请求
      onRefresh() {
        this.refreshing = true  // 设置需要重新加载
        this.finished = false // 重置加载完成标识
        this.loading = true // 设置不触发 load 事件
        this.page = 1 // 重新请求第一页
        this.onLoad()
      },
      // 切换标签时更改排序方式，并清空当前的商品列表，重新请求新的列表
      changeTab(name, title) {
        this.orderBy = name // 通过 tabbar 标签名排序
        this.onRefresh()
      }
    },
    // 三种导航守卫： beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave，其中 this 在 第一个守卫中无法获取，因为组件实例还未被创建
    // 三个参数：to 跳转到的页面，from 从哪个页面跳转过来，next 下一步（若参数为 false 则停留在本页面）
    beforeRouteLeave(to, from, next) {
      // 如果跳转商品详情页面，则保持缓存直接跳转，保证从详情页返回时商品列表存在
      // 如果跳转别的页面，则清空缓存，让组件被销毁，保证再次进入时是初始状态
      if (to.name == 'product') {
        next()
      } else {
        this.$store.commit('includedComponents', [])
        next()
      }
    },
    // 下面两个生命周期函数只有在被 keep-alive 包裹时才会被调用
    // 在 keep-alive 组件激活时调用，如果需要获取新数据则在该生命周期函数中获取，承担原先 created 的任务
    activated() {
      // console.log('activated')
    },
    // 在 keep-alive 组件停用时调用
    deactivated() {
      // console.log('deactivated')
    }
    /**
     * 实现从商品详情返回 productList 时商品列表缓存
     * 从其他页面进入 productList，执行 created、mounted 等钩子函数，执行 mounted 时将该组件加入 keep-alive 中实现缓存
     * 在离开该组件时，如果进入商品详情，则维持缓存；若进入其他组件，则清空缓存
     * 从商品详情返回 productList，因为被 keep-alive 包裹，不执行 created、mounted 等钩子函数
     * 再从其他界面进入 productList，重复上述过程
     */ 
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    .category-header {
      .fj();
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-left {
        font-size: 25px;
        font-weight: bold;
      }
      .header-search {
        display: flex;
        width: 76%;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #f7f7f7;
        .borderRadius(20px);
        .nbSearch {
          padding: 0 5px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666; // 字颜色
          background: #f7f7f7; // 输入框颜色设置和背景相同
        }
      }
      .icon-More {
        font-size: 20px;
      }
      .search-btn {
        height: 28px;
        margin: 8px 0;
        line-height: 28px;
        padding: 0 5px;
        color: #fff;
        background: @primary;
        .borderRadius(5px);
        margin-top: 10px;
      }
    }
  }
  .product-list-refresh {
    margin-top: 78px;
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
        width: 56%;
        height: 120px;
        padding: 5px;
        text-align: left;
        .boxSizing();
        p {
          margin: 0
        }
        .name {
          width: 100%;
          max-height: 40px;
          line-height: 20px;
          font-size: 15px;
          color: #333;
          overflow: hidden;
          // text-overflow 属性指定当文本溢出包含它的元素时，应该如何显示
          // clip 剪切文本，ellipsis 使用省略号代表被剪切文本，string 使用给定字符串代表被剪切文本
          text-overflow: ellipsis;
          // white-space 属性指定元素内的空白怎样处理，nowrap 规定文本不换行，直到遇见 <br>
          white-space: nowrap;
        }
        .subtitle {
          width: 100%;
          max-height: 20px;
          padding: 10px 0;
          line-height: 25px;
          font-size: 13px;
          color: #999;
          overflow: hidden;
        }
        .price {
          color: @primary;
          font-size: 16px;
        }
      }
    }
  }
</style>