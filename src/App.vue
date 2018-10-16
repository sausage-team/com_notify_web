<template>
  <div class="main">
    <router-view />
    <mq-util />
  </div>
</template>
<script>
import mqUtil from '@/components/plugins/mqtt.vue'

export default {
  name: 'App',
  created () {
    if (!this.$cookies.get('token')) {
      this.$router.push('/login')
    }
  },
  components: {
    mqUtil
  }
}

</script>
