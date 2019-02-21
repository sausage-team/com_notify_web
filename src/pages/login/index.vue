<template>
  <div class="page login-page">
    <div class="login-header">
      <div class="login-logo"></div>
      <div class="login-logo-title">海致数据推送中心</div>
    </div>
    <div class="login-body">
      <div class="login-body-content">
        <Form ref="loginForm" :model="loginForm" :rules="loginRules">
          <FormItem prop="domain">
            <Input type="text" v-model="loginForm.domain" placeholder="请输入企业域">
                <Icon type="ios-home-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
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
export default {
  data () {
    return {
      loginForm: {
        domain: '',
        user: '',
        password: ''
      },
      loginRules: {
        user: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        domain: [
          { required: false }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      errorMsg: ''
    }
  },
  created () {
  },
  methods: {
    signIn (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.userService.signIn({
            domain: this.loginForm.domain,
            username: this.loginForm.user,
            password: this.loginForm.password,
            ack_type: 'xxzx'
          }).then(res => {
            if (process.env.NODE_ENV === 'development') {
              if (res.status === 0) {
                if (this.$store.state.client) {
                  this.$store.dispatch('closeSub')
                }
                this.$router.push('messages')
              } else {
                if (this.data) {
                  this.errorMsg = this.data.msg
                }
              }
            } else {
              if (res) {
                if (this.$store.state.client) {
                  this.$store.dispatch('closeSub')
                }
                this.$router.push('messages')
              } else {
                if (this.data) {
                  this.errorMsg = this.data.msg
                }
              }
            }
          })
        }
      })
    }
  }
}
</script>
