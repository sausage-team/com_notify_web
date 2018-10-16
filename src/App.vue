<template>
  <div class="main">
    <router-view />
    <mq-util />
  </div>
</template>
<script>
import mqUtil from '@/components/plugins/mqtt.vue'
import Push from 'push.js'

export default {
  name: 'App',
  created () {
    if (!this.$cookies.get('token')) {
      Push.create('权限获取，可以忽略', {
        body: '',
        timeout: 500
      })
      this.$router.push('/login')
    }
  },
  components: {
    mqUtil
  }
}

</script>
