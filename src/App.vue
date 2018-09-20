<template>
  <div class=main>
    <router-view/>
  </div>
</template>
<script>
import VueCookies from 'vue-cookies'
export default {
  name: 'App',
  created () {
    if((!VueCookies.get('userSoundStatus') || VueCookies.get('userSoundStatus') != 1) && this.$route.name !== 'login') {
      this.$router.push('/login')
    }
  }
}
</script>
