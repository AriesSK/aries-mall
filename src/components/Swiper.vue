<template>
<!-- 设置自动轮播时间 指示器颜色 -->
  <van-swipe class="my-swipe" :autoplay="5000" indicator-color="#1baeae">
    <van-swipe-item v-for="(item, index) in list" :key="index">
        <img :src="item.carouselUrl" @click="goTo(item.redirectUrl)">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: null
      }
    },
    methods: {
      goTo(url) {
        // 在新窗口打开 url
        window.open(url)
      }
    }
  }
</script>

<style lang="less" scoped>
  .my-swipe {
    .van-swipe-item {
      img {
        width: 100%;
        height: 100%;
      }
    } 
  } 
</style>