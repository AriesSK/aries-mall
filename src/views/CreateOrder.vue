<template>
  <div class="create-order">
    <s-header :title="'生成订单'"></s-header>
    <div class="address-wrap">
      <div class="name" @click="goTo">
        <span>{{ address.userName }} </span>
        <span>{{ address.userPhone }}</span>
      </div>
      <div class="address">
        {{ address.provinceName }} {{ address.cityName }} {{ address.regionName }} {{ address.detailAddress }}
      </div>
      <van-icon class="arrow" name="arrow"/>
    </div>
    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img"><img :src="item.goodsCoverImg"/></div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goodsName }}</span>
            <span>x{{ item.goodsCount }}</span>
          </div>
          <div class="good-btn">
            <div class="price">¥{{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <!-- 计算属性 total 未定义在 data 中，定义在 computed 中也可以直接获取 -->
        <span>¥{{ total }}</span>
      </div>
      <van-button @click="createOrder" class="pay-btn" color="#1baeae" type="primary" block>生成订单</van-button>
    </div>
    <!-- closeable 是否显示关闭图标，close-on-click-overlay 是否在点击遮罩层后关闭，v-model 控制当前组件是否显示，position 弹出位置，close 事件关闭弹出层触发 -->
    <!-- close-on-click-overlay 需要 v-bind 传参，因为传的是 boolean 类型的参数，如果不使用 v-bind 会被当做字符串传递，使用则会被当作 js 表达式处理 -->
    <van-popup closeable :close-on-click-overlay="false" v-model="showPay" position="bottom" :style="{ height: '30%'}" @close="close">
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button :style="{ marginBottom: '10px' }" color="#1989fa" block @click="payOrder(1)">支付宝支付</van-button>
        <van-button color="#4fc08d" block @click="payOrder(2)">微信支付</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import sHeader from '@/components/SimpleHeader'
  import { getCart, getByCartItemIds } from '../service/cart'
  import { getAddressDetail, getDefaultAddress } from '../service/address'
  import { setLocal, getLocal } from '@/common/js/utils'
  import { Toast } from 'vant'
import { createOrder, payOrder } from '@/service/order'
  export default {
    components: {
      sHeader
    },
    data() {
      return {
        cartList: [],
        address: {},
        showPay: false,
        orderNo: '',
        cartItemIds: []
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        Toast.loading({ message: '加载中...', forbidClick: true})
        // 路由传参
        const { addressId, cartItemIds } = this.$route.query
        // 将 JSON 字符串转换为 JavaScript 对象或值
        // 有路由传值获取路由传值，没有则获取本地存储的值（某些操作可能导致浏览器地址参数丢失）
        const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(getLocal('cartItemIds'))
        setLocal('cartItemIds', JSON.stringify(_cartItemIds))
        // cartItemIds 是数组，使用 join 连接成字符串
        // 这里将返回对象中的属性 data 的值赋给了新的变量 list
        const { data: list } = await getByCartItemIds({ cartItemIds: _cartItemIds.join(',')})
        // 有 addressId 优先获取(从地址栏页面选完地址后返回)，没有则获取默认地址(直接进入确认订单页面)，若默认地址也没有则说明还未设置地址，跳转至地址管理
        const { data: address } = addressId ? await getAddressDetail(addressId) : await getDefaultAddress()
        if (!address) {
          this.$router.push({ path: 'address' })
          return
        }
        // 获取购物车中商品信息和用户地址信息用于订单详情的展示
        this.cartList = list
        this.address = address
        for (const i of this.cartList) {
          if (i.goodsCoverImg.charAt(0) == "/") {
            i.goodsCoverImg = "http://backend-api-01.newbee.ltd" + i.goodsCoverImg
          }
        }
        Toast.clear()
      },
      goTo() {
        this.$router.push({ path: `address?cartItemIds=${JSON.stringify(this.cartItemIds)}` })
      },
      // 清除本地的购物车商品 id
      deleteLocal() {
        setLocal('carItemIds', '')
      },
      async createOrder() {
        const params = {
          addressId: this.address.addressId,
          cartItemIds: this.cartList.map(item => item.cartItemId)
        }
        const { data, resultCode } = await createOrder(params)
        // 成功创建订单后清空本地购物车商品 id，获取订单号，显示支付弹窗
        this.deleteLocal()
        this.orderNo = data
        this.showPay = true
      },
      close() {
        // 取消支付跳转至我的订单页面
        this.$router.push({ path: 'order' })
      },
      async payOrder(type) {
        // 根据支付方式支付订单，随后跳转至我的订单页面
        Toast.loading
        await payOrder({ orderNo: this.orderNo, payType: type })
        this.$router.push({ path: 'order' })
      }
    },
    computed: {
      total: function() {
        let sum = 0;
        this.cartList.forEach(item => {
          sum += item.goodsCount * item.sellingPrice
        })
        return sum
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .create-order {
    background: #f9f9f9;
    .address-wrap {
      margin-bottom: 20px;
      background: #fff;
      position: relative;
      margin-top: 44px;
      font-size: 14px;
      padding: 15px;
      color: #222333;
      .name,.address {
        margin: 10px 0;
      }
      .arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
      }
      &::before {
        // 通过设置 right 和 left 设置宽度，设置 bottom 设置其在父元素中的底部位置，故这里用 before 和 after 是等效的
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
        // 重复线性渐变函数，参数有渐变的角度方向 angle 和 颜色位置 color-stop
        // 这里设置的是"红(20%)-透明(5%)-蓝(20%)-透明(5%)"的重复
        // 设置两次是考虑到老版本兼容性问题
        background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 20%, transparent 25%, #1989fa 25%, #1989fa 45%, transparent 45%, transparent 50%);
        background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 20%, transparent 25%, #1989fa 25%, #1989fa 45%, transparent 45%, transparent 50%);
        background-size: 80px; //设置渐变中每一段的宽度和高度，只给一个值则是宽度，高度 auto
        content: ''; // 必须要设置 content 的内容，为空则用 ''
      }
    }
    .good {
      margin-bottom: 120px;
    }
    .good-item {
      padding: 10px;
      background: #fff;
      display: flex;
      .good-img {
        img {
          .wh(100px, 100px);
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
    .pay-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      padding: 10px 0;
      padding-bottom: 50px;
      border-top: 1px solid #e9e9e9;
      >div {
        .fj();
        padding: 0 5%;
        margin: 10px 0;
        font-size: 14px;
        span:nth-child(2) {
          color: red;
          font-size: 18px;
        }
      }
      .pay-btn {
        position: fixed;
        bottom: 7px;
        right: 0;
        left: 0;
        width: 90%;
        margin: 0 auto;
      }
    }
  }
</style>

