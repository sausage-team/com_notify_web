<template>
  <div class="app">
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
    } else {
      this.defaultRoute()
    }
  },
  methods: {
    defaultRoute () {
      if (this.$route.matched.length === 0) {
        this.$router.push('/messages')
      }
    }
  },
  watch: {
    '$route' () {
      this.defaultRoute()
    }
  }
}

</script>
