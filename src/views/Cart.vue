<template>
  <div class="cart-box">
    <s-header :title="'购物车'"></s-header>
    <div class="cart-body">
      <!-- 多选框变化时触发 change 事件调用 groupChange 函数，其参数是 result，包括所有选中的复选框的 name -->
      <van-checkbox-group @change="groupChange" v-model="result" ref="checkboxGroup">
        <!-- right-width 指定右侧滑动区域宽度，这里 v-bind 的用法是向组件传递 props -->
        <van-swipe-cell :right-width="50" v-for="(item, index) in list" :key="index">
          <div class="good-item">
            <van-checkbox :name="item.cartItemId"/>
            <div class="good-img"><img :src="item.goodsCoverImg" /></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
              </div>
              <div class="good-btn">
                <div class="price">¥{{ item.sellingPrice }}</div>
                <!-- 只允许输入整数，设置最小值 1，name 可以在 change 事件的回调参数 detail 中获得 -->
                <!-- 同时通过 async-change 异步修改数据，点击修改后并不直接修改 stepper 的值，而是通过 change 事件触发 item.goodCount 的修改从而改变 value  -->
                <van-stepper integer :min="1" :value="item.goodsCount" :name="item.cartItemId" async-change @change="onChange"/>
              </div>
            </div>
          </div>
          <!-- slot="right" 设置删除按钮隐藏在右侧，左滑时出现 -->
          <van-button slot="right" square icon="delete" type="danger" class="delete-button" @click="deleteGood(item.cartItemId)"/>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <!-- price 单位是分 -->
    <van-submit-bar v-if="list.length > 0" class="submit-all" :price="total * 100" button-text="结算" @submit="onSubmit">
      <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!list.length">
      <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'vant'
  import sHeader from '@/components/SimpleHeader'
  import { getCart, deleteCartItem, modifyCart } from '@/service/cart'
  export default {
    name: 'Cart',
    components: {
      sHeader
    },
    data() {
      return {
        list: [],
        result: [], //购物车中被选中的商品的 id 数组
        checkAll: true
      }
    },
    mounted() {
      this.init()
    },
    // 监听计算总价 total，当选中商品改变时，实时修改
    computed: {
      total: function() {
        let sum = 0
        // 通过过滤器在 list 中获取被选中的商品列表
        let _list = this.list.filter(item => this.result.includes(item.cartItemId))
        _list.forEach(item => {
          sum += item.goodsCount * item.sellingPrice
        })
        return sum
      }
    },
    methods: {
      async init() {
        // 禁止在加载时点击
        Toast.loading({ message: '加载中...', forbidClick: true })
        const { data } = await getCart({ pageNumber: 1 })
        this.list = data
        for (const i of this.list) {
          if (i.goodsCoverImg.charAt(0) == "/") {
            i.goodsCoverImg = "http://backend-api-01.newbee.ltd" + i.goodsCoverImg
          }
        } 
        // 刚进入购物车时应当选中全部商品
        this.result = data.map(item => item.cartItemId)
        Toast.clear()
      },
      async deleteGood(id) {
        const { data } = await deleteCartItem(id)
        // 删除后全局更新购物车数量，并重新获取购物车数据
        this.$store.dispatch('updateCart')
        this.init()
      },
      // value 和 detail 是 change 事件的回调参数，前者是当前组件改变后的值，后者是额外信息，包含 name 字段
      async onChange(value, detail) {
        // 因为数量能够输入，因此可能出现并未修改商品数量但触发了 change 事件的情况，因此先判断是否修改了数量，未修改则直接返回，避免后续操作
        if (this.list.filter(item => item.cartItemId == detail.name)[0].goodsCount == value) return
        Toast.loading({ message: '修改中...', forbidClick: true })
        const params = {
          cartItemId: detail.name,
          goodsCount: value
        }
        const { data } = await modifyCart(params)
        // 因为是异步的，所以调用接口成功修改数据库数据后，要将改变后的值赋给 goodsCount，才能通过 v-bind 同步到页面中
        this.list.forEach(item => {
          if (item.cartItemId == detail.name) {
            item.goodsCount = value
          }
        })
        Toast.clear()
      },
      groupChange(result) {
        // 判断是否全选，设置标识
        if (result.length == this.list.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
        // 选中商品的列表赋值
        this.result = result
      },
      async onSubmit() {
        // 提交选中商品，进入订单页面，注意在本页面不能删除这些商品，要等订单完成后才能删除
        const params = JSON.stringify(this.result)
        this.$router.push({ path: `create-order?cartItemIds=${params}` })
      },
      allCheck() {
        // 如果未全选，checkAll 是 false，全选显示未选中状态，点击后 checkAll 变为 true，应当将所有商品放入 result
        // 如果已是全选，checkAll 是 true，全选显示选中状态，点击后 checkAll 变为 false，应当将 result 清空
        // 点击同时还会触发 checkboxGroup 的 change 事件，更新 checkAll 的状态
        if (this.checkAll) {
          this.result = this.list.map(item => item.cartItemId)
        } else {
          this.result = []
        }
      },
      goTo() {
        this.$router.push({ path: '/home' })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .cart-box {
    .cart-body {
      margin: 60px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          .fj();
          flex-direction: column;
          flex: 1;
          padding: 20px;
          .good-title {
            .fj();
          }
          .good-btn {
            .fj();
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .submit-all {
      margin-bottom: 50px;
      .van-checkbox {
        margin-left: 10px;
      }
      // 合计文字样式
      .van-submit-bar__text {
        margin-right: 10px;
      }
      // 提交按钮样式
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
  }
</style>
<!-- 不加 scoped 的 style 才能修改 checkbox 的主题色 -->
<style lang="less">
  @import '../common/style/mixin';
  // 前面表示多选框中被选中的样式，后面表示选中后的图标样式
	.van-checkbox__icon--checked .van-icon {
    background-color: @primary;
    border-color: @primary;
  }
</style>