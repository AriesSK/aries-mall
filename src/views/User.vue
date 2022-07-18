<template>
  <div class="user-box">
    <s-header :title="'我的'"></s-header>
    <div class="user-info">
      <div class="info">
        <img src="//s.weituibao.com/1583583975067/user-graduate%20(1).png"/>
        <div class="user-desc">
          <span>昵称：AriesSK</span>
          <span>登录名：15869111871</span>
          <span class="name">个性签名：Stay Hungry, Stay Foolish!</span>
        </div>
      </div>
    </div>
    <ul class="user-list">
      <li>
        <span>我的订单</span>
        <van-icon name="arrow"/>
      </li>
      <li>
        <span>账号管理</span>
        <van-icon name="arrow"/>
      </li>
      <li>
        <span>地址管理</span>
        <van-icon name="arrow"/>
      </li>
      <li>
        <span>关于我们</span>
        <van-icon name="arrow"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import sHeader from '@/components/SimpleHeader'
  export default {
    name: 'User',
    components: {
      sHeader
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .user-box {
    .user-info {
      width: 94%;
      margin: 10px;
      height: 115px;
      // linear-gradient 线性渐变，参数：渐变方向 起始颜色 重点颜色，其中渐变方向 90deg 表示从左到右，270deg 从右到左，0deg 表示从下到上，180deg 从上到下(默认)
      background: linear-gradient(90deg, @primary, #51c7c7);
      // 阴影效果，参数：x坐标值 y坐标值 模糊程度 颜色
      box-shadow: 0 2px 5px #269090;
      // 圆角半径
      border-radius: 6px;
      margin-top: 50px;
      .info {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 25px 20px;
        .boxSizing();
        img {
          
        }
      }
    }
  }
</style>