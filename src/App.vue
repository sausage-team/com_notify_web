<template>
  <div class="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    this.userService.getBackUrl({
      type: 'xx-center'
    }).then(res => {
      this.$store.dispatch('setUrl', res.data)
      if (!this.$cookies.get('notify_data')) {
        if (this.$store.state.client) {
          this.$store.dispatch('closeSub')
        }
        this.$store.dispatch('getLogin')
      } else {
        this.defaultRoute()
      }
    })
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
