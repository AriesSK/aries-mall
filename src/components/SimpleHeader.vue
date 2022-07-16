<template>
  <header class="simple-header">
    <i class="nbicon nbfanhui" @click="goBack"></i>
    <div class="simple-header-title">{{ title }}</div>
    <i class="nbicon nbmore"></i>
  </header>
</template>

<script>
  export default {
    // 外部传入 title 属性，可以定义类型和默认值
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    methods: {
      // 点击事件，路由返回上一页
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .simple-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    // 设置宽高，并且设置行高和高一致，使文字垂直居中
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    // 将 border 和 padding 包含在 宽和高内
    .boxSizing();
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .simple-header-title {
      font-size: 14px;
    }
  }
</style>