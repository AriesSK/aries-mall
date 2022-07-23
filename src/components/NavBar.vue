<!-- 下部导航栏作为项目中出现频率极高的内容 应当抽离成公共的组件以便复用 -->
<template>
  <div class="nav-bar">
    <ul class="nav-list">
      <!-- 默认首页有 active 状态 -->
      <router-link tag="li" class="nav-list-item active" to="home">
        <!-- 通过在线链接引入 iconfont 的图标 -->
        <i class="nbicon nblvsefenkaicankaoxianban-1"></i>
        <span>首页</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="category">
        <i class="nbicon nbfenlei"></i>
        <span>分类</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="cart">
        <!-- info 属性是用来设置图标右上角红点的显示内容，这里显示购物车中的商品数量 -->
        <van-icon name="shopping-cart-o" :info="!count ? '' : count"/>
        <span>购物车</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="user">
        <i class="nbicon nblvsefenkaicankaoxianban-"></i>
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
  import { getLocal } from '@/common/js/utils'
  // export 导出一个模块，在其它地方通过 import 导入
  export default {
    mounted() {
      const token = getLocal('token')
      if (token) {
        this.$store.dispatch('updateCart')
      }
    },
    data() {
      return {}
    },
    computed: {
      // 监听 cartCount 的变化实时变更购物车数量
      count() {
        return this.$store.state.cartCount
      }
    }
  }
</script>

<!-- scoped 使 css 样式只能用于当前的组件 -->
<style lang="less" scoped>
  // @import 导入外部文件，无后缀默认 .less，若 .css 则原样输出
  @import '../common/style/mixin';
  .nav-bar {
    // 固定位置
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 5px 0;
    z-index: 1000;
    // background 可以设置图片、背景图拉伸、背景图大小、背景图相对位置、背景颜色等，background-color 只能设置背景颜色
    background: #fff;
    // 并没有真正使用 3d 效果，但获得了 GPU 的硬件加速
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    .nav-list {
      width: 100%;
      // flex 布局，均匀排列子元素
      .fj();
      // row 行，column 列
      flex-direction: row;
      padding: 0;
      .nav-list-item {
        display: flex;
        // 实现不同内容的子元素平分空间
        flex: 1;
        flex-direction: column;
        // 水平居中
        text-align: center;
        color: #666;
        // & 是父级的引用，指向父元素自身，这里指 nav-list-item，当 router-link 标签被选中时会自动给标签添加一个 router-link-active 的 class，因此可以设置样式
        &.router-link-active {
          // active 的元素设置为主题色
          color: @primary;
        }
        // 标签 <i> 用来插入 icon
        i {
          text-align: center;
          font-size: 22px;
        }
        span {
          font-size: 12px;
        }
        .van-icon-shopping-cart-o {
          margin: 0 auto;
          margin-bottom: 2px;
        }
      }
    }
  }
</style>