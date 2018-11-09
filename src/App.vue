<template>
  <div class="main">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    if (!this.$cookies.get('token')) {
      if (this.$store.state.client) {
        this.$store.dispatch('closeSub')
      }
      this.$router.push('/login')
    }
  }
}

</script>
