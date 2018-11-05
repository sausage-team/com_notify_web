<template>
  <div class="main">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    this.notification('')
    if (!this.$cookies.get('token')) {
      this.$store.dispatch('closeSub')
      this.$router.push('/login')
    }
  }
}

</script>
