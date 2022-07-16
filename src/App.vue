<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <transition :name="transitionName">
      <router-view class="router-view" />
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        transitionName: 'slide-left'
      }
    },
    watch: {
      $route(to, from) {
        if (to.meta.index > from.meta.index) { // 主级页面 到 次级页面 左滑
          this.transitionName = 'slide-left'
        } else if (to.meta.index < from.meta.index) { // 次级页面 到 主级页面 右滑
          this.transitionName = 'slide-right'
        } else { // 同级无过渡动画
          this.transitionName = ''
        }
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
  text-align: center;
  color: #2c3e50;
}

#nav {
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
