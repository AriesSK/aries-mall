<!-- 
  v-bind 只能将 vue 中的数据同步到页面中，v-model 还可以将页面的数据赋给 vue 中的属性，但 v-model 只能绑定有 value 属性的元素
  记录一下 v-bind 的用法，在双引号中的内容，有单引号的表示值，无单引号的表示变量：
  1. 动态绑定属性，比如 <img :src="imgURL">，其中 imgURL 在 data 中声明，并且是直接使用，而不是 mustache 语法 <img :src="{{imgRUL}}">
  2. 向组件传递 props，比如 <swiper :list="swiperList"></swiper>，用于动态传参，双引号中的内容会被当做 js 表达式而不是字符串处理
  3. 动态绑定 class
    3.1 对象语法，class 后面跟的是一个对象，<div :class="类名: boolean"></div>，当 boolean 值为 true 时，改类就会被添加
    3.2 数组语法，class 后面跟的是一个数组，<div :class="[active, line]"></div>
  4. 动态绑定 style，<div :style="{属性名: 属性值}"></div>
  下面的代码中有用到这些用法，具体可看注释
 -->
<template>
  <div class="home">
    <!-- 用法 3.1 -->
    <header class="home-header wrap" :class="{ 'active': headerScroll }">
      <!-- tag 表示将 router-link 渲染成什么标签 -->
      <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
      <div class="header-search">
        <span class="app-name">白羊商城</span>
        <i class="iconfont icon-search"></i>
        <router-link tag="span" class="search-title" to="./product-list">青衿之志，白首方坚</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin">登录</router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o"/>
      </router-link>
    </header>
    <!-- 外部传入轮播图 url 的列表 -->
    <!-- 用法 2 -->
    <swiper :list="swiperList"></swiper>
    <!-- v-for 中使用 key 能够提升渲染的效率，比如在修改列表数据时，根据 key 判断是否需要重新渲染 -->
    <div class="category-list">
      <!-- 用法 1 -->
      <div v-for="item in categoryList" :key="item.categoryId">
        <img :src="item.imgUrl">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">新品上线</header>
      <div class="good-box">
        <div class="good-item" v-for="item in newGoodses" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="item.goodsCoverImg"/>
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <div class="good-box">
        <div class="good-item" v-for="item in hots" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="item.goodsCoverImg">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 用法 4，这里 paddingBottom 没单引号，是个变量 -->
    <div class="good" :style="{ paddingBottom: '100px' }">
      <header class="good-header">最新推荐</header>
      <div class="good-box">
        <div class="good-item" v-for="item in recommends" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="item.goodsCoverImg">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/common/js/utils'
  import swiper from '@/components/Swiper'
  import { getHome } from '@/service/home'
  import { Toast } from 'vant'
  export default {
    // 设置一个全局 id
    name: 'Home',
    data() {
      return {
        categoryList: [
          {
            name: '新蜂超市',
            imgUrl: '//s.weituibao.com/1583585285461/cs.png',
            categoryId: 100001
          }, {
            name: '新蜂服饰',
            imgUrl: '//s.weituibao.com/1583585285468/fs.png',
            categoryId: 100003
          }, {
            name: '全球购',
            imgUrl: '//s.weituibao.com/1583585285470/qq.png',
            categoryId: 100002
          }, {
            name: '新蜂生鲜',
            imgUrl: '//s.weituibao.com/1583585285472/sx.png',
            categoryId: 100004
          }, {
            name: '新蜂到家',
            imgUrl: '//s.weituibao.com/1583585285467/dj.png',
            categoryId: 100005
          }, {
            name: '充值缴费',
            imgUrl: '//s.weituibao.com/1583585285465/cz.png',
            categoryId: 100006
          }, {
            name: '9.9元拼',
            imgUrl: '//s.weituibao.com/1583585285469/pt.png',
            categoryId: 100007
          }, {
            name: '领劵',
            imgUrl: '//s.weituibao.com/1583585285468/juan.png',
            categoryId: 100008
          }, {
            name: '省钱',
            imgUrl: '//s.weituibao.com/1583585285471/sq.png',
            categoryId: 100009
          }, {
            name: '全部',
            imgUrl: '//s.weituibao.com/1583585285470/qb.png',
            categoryId: 100010
          }
        ],
        isLogin: false,
        swiperList: [],
        hots: [],
        newGoodses: [],
        recommends: [],
        headerScroll: false
      }
    },
    components: {
      swiper
    },
    async mounted() {
      // 监听 scroll 滚动事件
      window.addEventListener('scroll', this.pageScroll)
      // 通过获取 token 判断是否已登录
      const token = getLocal('token')
      if (token) {
        this.isLogin = true
      }
      Toast.loading({
        message: '加载中...',
        // 禁用背景点击
        forbidClick: true
      })
      const { data } = await getHome()
      // 获取轮播图 url 列表
      this.swiperList = data.carousels
      // 获取新品列表
      this.newGoodses = data.newGoodses
      // 获取热门列表
      this.hots = data.hotGoodses
      // 获取推荐列表
      this.recommends = data.recommendGoodses
      // 处理其中几张网址不同的图
      for (const i of this.recommends) {
        if (i.goodsCoverImg.charAt(0) == "/") {
          i.goodsCoverImg = "http://backend-api-01.newbee.ltd" + i.goodsCoverImg
        }
      }
      // 在数据获取完后将 Toast 弹窗关闭
      Toast.clear()
    }, 
    methods: {
      pageScroll() {
        // 获取文档基于窗口左上角垂直方向滚动的像素
        // 三种用法等价，但考虑到兼容性问题，获取到任意一种均可
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // 如果文档基于窗口左上角已经垂直方向滚动了超过 100 像素，则调整搜索框背景为主题色，避免遇到白色背景时出现重叠
        this.headerScroll = scrollTop > 100 ? true : false
      },
      goToDetail(item) {
        this.$router.push({ path: `product/${item.goodsId}` })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .home {
    .home-header {
      position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      .nbmenu2 {
        color: @primary;
      }
      // 等同于 home-header.active 交集选择器，当轮播图滚动到可视区域外时，改变搜索框背景和图标颜色
      &.active {
        background: @primary;
        .nbmenu2 {
          color: #fff;
        }
        .login {
          color: #fff;
        }
      }
      .header-search {
        display: flex;
        .wh(74%, 20px);
        line-height: 20px;
        margin:10px 0;
        padding: 5px 0;
        color: #232326;
        background: rgba(255, 255, 255, .7);
        border-radius: 20px;
        .app-name {
          padding: 0 10px;
          color: @primary;
          font-size: 20px;
          font-weight: bold;
          border-right: 1px solid #666;
        }
        .icon-search {
          padding: 0 10px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
          line-height: 21px;
        }
      }
      .login {
        color: @primary;
        line-height: 52px;
        // van-icon 是组件，manager-o 是 name，其选择器如下
        .van-icon-manager-o {
          font-size: 20px;
          // 设置行内元素的基线，比如 -3px 就是将该元素的基线上移 3px，呈现的效果是元素下移 3px
          vertical-align: -3px;
        }
      }
    }
    .category-list {
      display: flex;
      // 默认 1，在子元素宽度和大于父元素时对子元素进行收缩，0 表示子元素不缩小
      // 若两个子元素的 flex-shrink 分别为 1、2，则超出的宽度按 1：2 比例分配给两个子元素，值越大缩小的越多
      flex-shrink: 0;
      // 使 flex 容器在必要时拆行，放不下换下一行
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 13px;
      div {
        display: flex;
        // row 水平布局，column 垂直布局，注意设置的是子元素的布局方向
        flex-direction: column;
        width: 20%;
        text-align: center;
        img {
          .wh(40px, 40px);
          margin: 13px auto 8px auto;
        }
      }
    }
    .good {
      .good-header {
        background: #f9f9f9;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: @primary;
        font-size: 16px;
        font-weight: 500;
      }
      .good-box {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .good-item {
          box-sizing: border-box;
          width: 50%;
          border-bottom: 1PX solid #e9e9e9;
          padding: 10px 0;
          img {
            // 显示为块级元素
            display: block;
            width: 120px;
            margin: 0 auto;
          }
          .good-desc {
            text-align: center;
            font-size: 14px;
            padding: 10px 0;
            .title {
              color: #222333;
            }
            .price {
              color: @primary;
            }
          }
          // 伪类，表示奇数的子节点
          &:nth-child(2n + 1) {
            border-right: 1PX solid #e9e9e9;
          }
        }
      }
    }
  }
</style>