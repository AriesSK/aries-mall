<template>
  <div class="setting-box">
    <s-header :title="'账号管理'"></s-header>
    <div class="input-item">
      <van-field v-model="nickName" label="昵称"/>
      <van-field v-model="introduceSign" label="个性签名"/>
      <van-field v-model="password" type="password" label="修改密码"/>
    </div>
    <van-button class="save-btn" color="#1baeae" type="primary" @click="save" block>保存</van-button>
    <van-button class="save-btn" color="#1baeae" type="primary" @click="logout" block>退出登录</van-button>
  </div>
</template>

<script>
  import sHeader from '@/components/SimpleHeader'
  import { getUserInfo, EditUserInfo, logout } from '@/service/user'
  import { setLocal } from '@/common/js/utils'
  import { Toast } from 'vant'
  export default {
    components: {
      sHeader
    },
    data() {
      return {
        nickName: '',
        introduceSign: '',
        password: ''
      }
    },
    async mounted() {
      const { data } = await getUserInfo()
      this.nickName = data.nickName
      this.introduceSign = data.introduceSign
    },
    methods: {
      async save() {
        const params = {
          introduceSign: this.introduceSign,
          nickNmae: this.nickName,
          passwordMd5: this.$md5(this.password)
        }
      }
    }
  }
</script>