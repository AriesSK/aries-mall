<template>
  <div id="app">
    <transition :name="transitionName">
      <!-- keep-alive 包裹动态组件时会缓存不活动的组件实例，而不是销毁 -->
      <!-- created 函数调用时将需要缓存的 VNode 保存在 this.cache 中，在 render (页面渲染)时，如果 VNode 的 name 符合缓存条件，就从 this.cache 中取出之前缓存的 VNode 实例进行渲染 -->
      <!-- 可以通过 include 和 exclude 属性记录组件名来控制哪些组件被缓存，属性值是字符串或正则表达式 -->
      <keep-alive :include="includedComponents">
        <router-view class="router-view"/>
      </keep-alive>
    </transition>
    <!-- 这里的标签名是下面 components 中的名字，也是 import 的名字，可以直接使用(每个单词首字母大小写需和声明的一致)，或使用 - 分隔单词(可将大写改小写，反之不行) -->
    <nav-bar v-if="isShowNav"></nav-bar>
  </div>
</template>

<script>
  // @ 代表 src
  import navBar from '@/components/NavBar'
  export default {
    data() {
      // 组件是可复用的实例，不使用 return 包裹的数据在项目全局可见，容易造成数据污染
      // 使用 return 包裹后的数据变量只在当前组件生效，不影响别的组件
      return {
        transitionName: 'slide-left',
        // 因为不是所有的页面都需要导航栏，因此设置 isShowNav 控制导航栏是否显示
        isShowNav: true,
        ShowMenuList: ['/', '/home', '/category', '/cart', '/user']
      }
    },
    components: {
      navBar
    },
    watch: {
      $route(to, from) {
        // 在监听路由变化的时候判断该页面是否需要导航栏，includes 判断数组中是否包含某元素
        this.isShowNav = this.ShowMenuList.includes(to.path) ? true : false
        if (to.meta.index > from.meta.index) { // 主级页面 到 次级页面 左滑
          this.transitionName = 'slide-left'
        } else if (to.meta.index < from.meta.index) { // 次级页面 到 主级页面 右滑
          this.transitionName = 'slide-right'
        } else { // 同级无过渡动画
          this.transitionName = ''
        }
      }
    },
    // 实时监控和更新需要被缓存的组件名列表
    computed: {
      includedComponents() {
        return this.$store.state.includedComponents // 将需要被缓存的组件名列表存在全局状态 state 中
      }
    }
  }
</script>

<style lang="less">
  @import './common/style/mixin';

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #nav {
    // position 的五种属性：static、absolute、relative、fixed、inherit
    // static 默认值，屋顶为，元素正常处于文档流
    // absolute 绝对定位，相对于最近的一个非 static 定位的祖先元素定位，使用 left、top、right、bottom 设定位置
    // relative 相对定位，相对于元素本身正常的位置定位
    // fixed 绝对定位，相对于浏览器窗口定位
    // inherit 继承父元素的 position 属性
    // 绝对定位的元素具备行内块的特点，不设置宽高则由内容撑开
    position: absolute;
    top: 0;
    left: 50%;
    // 元素的上下层堆叠关系，大的显示在上面，可为负数，默认 0
    z-index: 1000;
  }

  .router-view{
      width: 100%;
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: 0 auto;
      // 滚动回弹效果
      -webkit-overflow-scrolling: touch;
  }

  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active{
      height: 100%;
      // 提前通知浏览器元素将要做什么动画，让浏览器提前准备合适的优化设置
      will-change: transform;
      transition: all 500ms;
      position: absolute;
      // 定义当元素不面向屏幕时是不可见的
      backface-visibility: hidden;
  }

  // 两属性组合形成淡入淡出的效果
  .slide-right-enter{
      // 不透明度
      opacity: 0;
      // translate3d(x,y,z) 实现 3d 移动
      transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active{
      opacity: 0;
      transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter{
      opacity: 0;
      transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active{
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
  }
</style>
