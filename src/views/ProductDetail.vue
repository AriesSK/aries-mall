<template>
  <div class="product-detail">
    <s-header :title="'商品详情'"></s-header>
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1baeae">
          <van-swipe-item v-for="(item, index) in detail.goodsCarouselList" :key="index">
            <img :src="item"/>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ detail.goodsName }}
        </div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <span>¥{{ detail.sellingPrice }}</span>
        </div>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <!-- 通过 v-html 标签能够渲染带有 html 标签内容的值，因为详情页是富文本编辑的 -->
        <div class="product-content" v-html="detail.goodsDetailContent"></div>
      </div>
    </div>
    <!-- Vant 的电商专用组件 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服"/>
      <van-goods-action-icon icon="cart-o" :info="!count ? '' : count" @click="goTo()" text="购物车"/>
      <van-goods-action-button type="warning" @click="addCart" text="加入购物车"/>
      <van-goods-action-button type="danger" @click="goToCart" text="立即购买"/>
    </van-goods-action>
  </div>
</template>

<script>
  import { getDetail } from "@/service/good"
  import { addCart } from "@/service/cart"
  import sHeader from '@/components/SimpleHeader'
  import { Toast } from "vant"
  export default {
    data() {
      return {
        detail: {
          goodsCarouselList: []
        }
      }
    },
    components: {
      sHeader
    },
    async mounted() {
      // 路由传参获取商品 id，通过 params 获取需要在 router 中配置 :id
      const { id } = this.$route.params
      const { data } = await getDetail(id)
      this.detail = data
      for (let i in this.detail.goodsCarouselList) {
        if (this.detail.goodsCarouselList[i].charAt(0) == "/") {
          this.detail.goodsCarouselList[i] = "http://backend-api-01.newbee.ltd" + this.detail.goodsCarouselList[i]
        }
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      goTo() {
        this.$router.push({ path: '/cart' })
      },
      // 添加购物车和立即购买均调用接口使后台的购物车商品数加一并记录商品 id，然后需要修改全局状态中的购物车数量
      // 修改状态过程：通过 dispatch 调用 action，action 通过 commit 提交 mutation，mutation 直接修改 state
      async addCart() {
        // 添加购物车
        const { data, resultCode } = await addCart({
          "goodsCount": 1,
          "goodsId": this.detail.goodsId
        })
        if (resultCode == 200 ) Toast.success('添加成功')
        // 调用 action，参数是 action 的名字
        this.$store.dispatch('updateCart')
      },
      async goToCart() {
        // 立即购买，添加并前往购物车页面
        const { data, resultCode } = await addCart({
          "goodsCount": 1,
          "goodsId": this.detail.goodsId
        })
        this.$store.dispatch('updateCart')
        this.$router.push({ path: '/cart' })
      }
    },
    /**
     * computed 是 vue 的计算属性，根据依赖关系进行缓存的计算，只有在相关依赖发生改变时才会进行更新
     * 响应式依赖(缓存)：computed 中的每一个计算属性都会被缓存起来，只要计算属性依赖的属性发生变化，计算属性就会重新执行，视图也会更新，比如计算属性 c = a + b，a 或 b 的变化均会使 c 重新计算
     * 可以使用 computed 来计算受多个属性影响的属性
     * 也可以用来监听 Vuex 中的状态，实现实时的全局更新
     */
    computed: {
      count() {
        // 默认使用 getter 属性
        return this.$store.state.cartCount
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-detail {
    .detail-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .product-name {
        font-size: 14px;
      }
    }
    .detail-content {
      margin-top: 44px;
      .detail-swipe-wrap {
        .my-swipe {
          .van-swipe-item {
            img {
              width: 100%;
            }
          }
        }
      }
      .product-info {
        padding: 0 10px;
        .product-title {
          font-size: 18px;
          text-align: left;
          color: #333;
        }
        .product-desc {
          font-size: 14px;
          text-align: left;
          color: #999;
          padding: 5px 0;
        }
        .product-price {
          .fj();
          span:nth-child(1) {
            color: #f63515;
            font-size: 22px;
          }
          span:nth-child(2) {
            color: #999;
            font-size: 16px;
          }
        }
      }
      .product-intro {
        width: 100%;
        ul {
          .fj();
          width: 100%;
          margin: 10px 0;
          li {
            flex: 1;
            padding: 5px 0;
            text-align: center;
            font-size: 15px;
            border-right: 1px solid #999;
            box-sizing: border-box;
            &:last-child {
              // 前几个后面设置分隔线，最后一个不用
              border-right: none;
            }
          }
        }
        .product-content {
          padding: 0 20px;
          img {
            width: 100%;
          }
        }
      }
    }
    // 该按钮通过 -- 设置每种 type 的样式
    .van-goods-action-button--warning {
      // 为按钮设置渐变色
      background: linear-gradient(to right,#6bd8d8, @primary)
    }
    .van-goods-action-button--danger {
      background: linear-gradient(to right, #0dc3c3, #098888)
    }
  }
</style>