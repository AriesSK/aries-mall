<template>
  <div class="login">
    <img class="logo" src="//s.weituibao.com/1582958061265/mlogo.png">
    <div v-if="type == 'login'" class="login-body login">
      <!-- 使用 vant 的表单组件 设置 v-on 监听提交事件 -->
      <van-form @submit="onSubmit">
        <!-- rules 里面写具体的规则，可以直接写也可以绑定后写在 data 中，require: true 表示必填 -->
        <van-field v-model="username" name="username" label="手机号" placeholder="手机号" :rules="[{ require: true, message: '请填写手机号' }]"/>
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码" :rules="[{ require: true, message: '请填写密码' }]"/>
        <div class="verify">
          <!-- v-bind 后面的 value 作为一个值时需要单引号，否则会被当成变量处理 -->
          <Verify ref="loginVerifyRef" @error="error" :showButton="false" @success="success" :width="'100%'" :fontSize="'16px'" :type="2"></Verify>
        </div>
        <div style="margin: 16px;">
        <div class="link-register" @click="toggle('register')">立即注册</div>
          <!-- 设置圆形按钮、块级元素、信息按钮，native-type 可以设置原生 button 标签的 type 属性，submit 则点击会提交表单，button 则是普通按钮 -->
          <van-button round block type="info" color="#1baeae" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field v-model="username1" name="username1" label="手机号" placeholder="手机号" :rules="[{ require: true, message: '请填写手机号' }]"/>
        <van-field v-model="password1" type="password" name="password1" label="密码" placeholder="密码" :rules="[{ require: true, message: '请填写密码' }]"/>
        <div class="verify">
          <Verify ref="loginVerifyRef" @error="error" :showButton="false" @success="success" :width="'100%'" :fontSize="'16px'" :type="2"></Verify>
        </div>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle('login')">已有登录账号</div>
          <van-button round block type="info" color="#1baeae" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// 登录和注册接口
import { login, register } from '../service/user'
// 本地存储函数
import { setLocal, getLocal } from '@/common/js/utils'
import { Toast } from 'vant'
import Verify from 'vue2-verify'
export default {
  data() {
    return {
      username: '',
      password: '',
      username1: '',
      password1: '',
      type: 'login', // 通过 v-if 判断显示登录还是注册
      verify: false // 判断验证码输入是否正确
    }
  },
  components: {
    Verify // 注册验证码组件
  },
  methods: {
    // 判断验证码是否正确
    dealTriVer() {
      this.$refs.loginVerifyRef.$refs.instance.checkCode()
    },
    // 切换登录和注册
    toggle(v) {
      this.verify = false
      this.type = v;
    },
    async onSubmit(values) {
      // 每次提交前都要执行一次，获得 verify 的值
      this.dealTriVer()
      if (!this.verify) {
        Toast.fail('请正确填写验证码！')
        return
      }
      if (this.type == 'login') {
        // 发送 json 形式的数据包，返回数据同样是 json 形式，json 形式属性是字符串，属性值是字符串、数、布尔值或 json
        const { data, resultCode } = await login({
          "loginName": values.username,
          "passwordMd5": this.$md5(values.password)
        })
        // 成功登录把 token 存在本地并跳转至主页，登录失败的处理在 axios.js 中通过拦截器统一处理
        setLocal('token', data)
        window.location.href = '/'
      } else {
        const { data } = await register({
          "loginName": values.username1,
          "password": values.password1
        })
        Toast.success('注册成功')
        this.type = 'login'
      }
    },
    // 验证码匹配成功与失败的回调函数
    success(obj) {
      this.verify = true
    },
    error(obj) {
      this.verify = false
    }
  }
}
</script>

<style lang="less">
  .login {
    .logo {
      width: 120px;
      height: 120px;
      display: block;
      // 三个值 上 左右 下
      margin: 80px auto 0px;
    }
    .login-body {
      padding: 0 20px;
    }
    .login {
      .link-register {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .register {
      .link-login {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .verify {
      >div {
        width: 100%;
      }
      display: flex;
      justify-content: center;
      .cerify-code-panel {
        margin-top: 16px;
      }
      .verify-code {
        width: 40% !important;
        float: left !important;
      }
      .verify-code-area {
        float: left !important;
        width: 54% !important;
        margin-left: 14px !important;
        .verify-input-code {
          width: 90px;
          height: 38px !important;
          border: 1px solid #e9e9e9;
          padding-left: 10px;
          font-size: 16px;
        }
        .verify-change-area {
          line-height: 44px;
        }
      }
    }
  }
</style>