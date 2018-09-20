<template>
  <div class="page login-page">
    <div class="login-header">
      <div class="login-logo"></div>
      <div class="login-logo-title">海致数据推送中心</div>
    </div>
    <div class="login-body">
      <div class="login-body-content">
        <Form ref="loginForm" :model="loginForm" :rules="loginRules">
          <FormItem prop="user" required>
            <Input type="text" v-model="loginForm.user" placeholder="请输入用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password" required :error="errorMsg">
            <Input type="password" v-model="loginForm.password" placeholder="请输入密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button class="login-btn" type="primary" @click="signIn('loginForm')">登录</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { signIn } from '@/http/services/user_api'
import { startSub } from '@/utils/mqtt'
import VueCookies from 'vue-cookies'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        user: '',
        password: ''
      },
      loginRules: {
        user: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      errorMsg: ''
    }
  },
  methods: {
    getCookie (cname) {
      let arr
      let reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return arr[2]
      else return null
    },
    signIn (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = {
            userName: this.loginForm.user,
            password: this.loginForm.password
          }
          signIn(params).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              startSub()
              VueCookies.set('token', res.data.result.userToken)
              VueCookies.set('userSoundStatus', res.data.result.userSoundStatus)
              VueCookies.set('userSoundURL', res.data.result.userSoundURL)
              VueCookies.set('username', res.data.result.userName)
              this.$router.push('/alarm')
            } else {
              if (this.data) {
                this.errorMsg = this.data.reason
              }
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    }
  }
}
</script>
