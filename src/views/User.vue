<template>
  <div class="user-box">
    <s-header :title="'我的'"></s-header>
    <div class="user-info">
      <div class="info">
        <img src="//s.weituibao.com/1583583975067/user-graduate%20(1).png"/>
        <div class="user-desc">
          <span>昵称：{{ user.nickName }}</span>
          <span>登录名：{{ user.loginName }}</span>
          <span class="name">个性签名：{{ user.introduceSign }}</span>
        </div>
      </div>
    </div>
    <ul class="user-list">
      <li @click="goTo('order')">
        <span>我的订单</span>
        <van-icon name="arrow"/>
      </li>
      <li @click="goTo('setting')">
        <span>账号管理</span>
        <van-icon name="arrow"/>
      </li>
      <li @click="goTo('address?from=mine')">
        <span>地址管理</span>
        <van-icon name="arrow"/>
      </li>
      <li @click="goTo('about')">
        <span>关于我们</span>
        <van-icon name="arrow"/>
      </li>
    </ul>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
  import navBar from '@/components/NavBar'
  import sHeader from '@/components/SimpleHeader'
  import { getUserInfo } from '@/service/user'
  export default {
    name: 'User',
    components: {
      navBar,
      sHeader
    },
    data() {
      return {
        user: {}
      }
    },
    // 完成挂载后获取用户信息
    async mounted() {
      const { data } = await getUserInfo()
      this.user = data
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      goTo(r) {
        this.$router.push({ path: r})
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .user-box {
    .user-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .user-name {
        font-size: 14px;
      }
    }
    .user-info {
      width: 94%;
      margin: 10px;
      height: 115px;
      // linear-gradient 线性渐变，参数：渐变方向 起始颜色 终点颜色，其中渐变方向 90deg 表示从左到右，270deg 从右到左，0deg 表示从下到上，180deg 从上到下(默认)
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
          .wh(60px, 60px);
          border-radius: 50%;
          margin-top: 4px;
        }
        .user-desc {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          line-height: 20px;
          font-size: 14px;
          color: #fff;
          span {
            color: #fff;
            font-size: 14px;
            padding: 2px 0;
          }
        }
        .account-setting {
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 13px;
          color: #fff;
          .van-icon-setting-o {
            font-size: 16px;
            vertical-align: -3px;
            margin-right: 4px;
          }
        }
      }
    }
    .user-list {
      padding: 0 20px;
      margin-top: 20px;
      li {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e9e9e9;
        .fj();
        font-size: 14px;
        .van-icon-arrow {
          margin-top: 13px;
        }
      }
    }
  }
</style>