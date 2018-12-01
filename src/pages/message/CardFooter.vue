<template lang='html'>
  <div>
    <button class="btn no-bg" @click="showFeedback($event)">反馈</button>
    <button class="btn" @click="showSign($event)">签收</button>
    <feedback v-model="feedbackVisible"></feedback>
  </div>
</template>

<script>
import Feedback from '@/pages/message/Feedback'
export default {
  components: {
    Feedback
  },
  data () {
    return {
      feedbackVisible: false
    }
  },
  methods: {
    showFeedback (event) {
      event.stopPropagation()
      this.feedbackVisible = true
    },
    showSign (event) {
      event.stopPropagation()
      this.$confirm('确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '签收成功!'
        // })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消签收'
        // })
      })
    }
  }
}

</script>
<style lang='scss'>
</style>
