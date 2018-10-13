<template>
  <div class=main>
    <router-view/>
    <mqtt-util />
  </div>
</template>
<script>
// import VueCookies from 'vue-cookies'
import mqttUtil from '@/components/plugins/mqtt.vue'
export default {
  name: 'App',
  created () {
    // if ((!VueCookies.get('userSoundStatus') || VueCookies.get('userSoundStatus') !== 1) && this.$route.name !== 'login') {
    //  this.$router.push('/login')
    // }
  },
  components: {
    mqttUtil
  }
}

</script>
