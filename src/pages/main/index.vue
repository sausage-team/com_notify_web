<template>
  <div class="main">
    <header-nav></header-nav>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  created () {
    this.defaultRoute()
  },
  methods: {
    defaultRoute () {
      if (this.$route.path === '/') {
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
