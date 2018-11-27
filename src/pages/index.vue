<template>
  <div class="main">
    <header-nav></header-nav>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderNav from '@/components/header'
export default {
  name: 'home',
  components: {
    HeaderNav
  }
}
</script>
