<template>
  <div class="content-right-show" v-show="popButton" @click="showSelect">
    <div class="con-right-btn">
      <i class="arrow-left"></i>
      <div @click="showSelect">展开筛选器</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmSelectButton',
  data () {
    return {
    }
  },
  props: {
    popButton: Boolean
  },
  methods: {
    showSelect () {
      this.$emit('selectPop', true)
    }
  }
}
</script>
