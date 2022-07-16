<template>
  <div class="home">
    <div>你好</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style lang="less" scoped>
  .home {
    div {
      background: greenyellow;
      width: 75px;
      height: 75px;
      font-size: 18PX;
    }
  }
</style>