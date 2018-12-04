<template lang='html'>
  <Modal v-model="showDetail" class="msg-detail-model">
    <p slot="header">
      <span>详情信息</span>
    </p>
    <div class="detail-content">
      <ul>
        <li>
          <label>消息类型</label>
          <span>涉黄预警</span>
        </li>
        <li>
          <label>推送时间</label>
          <span>2018-10-11 17:00:05</span>
        </li>
        <li>
          <label>消息内容</label>
          <span>您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息。</span>
        </li>
        <li>
          <label>其他信息</label>
          <span>涉黄预警</span>
        </li>
      </ul>
    </div>
    <div slot="footer" class="right">
      <button class="btn no-bg" @click="showFeedback($event)">反馈</button>
      <button class="btn" @click="showSign($event)">签收</button>
      <feedback v-model="feedbackVisible"></feedback>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      showDetail: false,
      feedbackVisible: false
    }
  },
  watch: {
    value () {
      this.showDetail = this.value
    },
    showDetail () {
      if (!this.showDetail) {
        this.$emit('input', this.showDetail)
      }
    },
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
