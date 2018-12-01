<template lang='html'>
  <div>
    <Modal v-model="showFeedback" class="msg-detail-model">
      <p slot="header">
        <span>反馈信息</span>
      </p>
      <div class="detail-content">
        <textarea placeholder="请输入反馈内容" maxlength="500" v-model="feedbackContent"></textarea>
      </div>
      <div slot="footer" class="right">
        <button class="btn no-bg" @click="commitFeedback($event)">提交</button>
        <button class="btn" @click="cancelFeedback($event)">取消</button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      showFeedback: false,
      feedbackContent: ''
    }
  },
  methods: {
    commitFeedback () {
      this.showFeedback = false
    },
    cancelFeedback () {
      this.showFeedback = false
    }
  },
  watch: {
    value () {
      this.showFeedback = this.value
    },
    showFeedback () {
      if (!this.showFeedback) {
        this.$emit('input', this.showFeedback)
      }
    }
  }
}

</script>
<style lang='scss' scoped>
@import "@/assets/sass/card-detail.scss";
textarea {
  width: 100%;
  height: 93px;
  resize: none;
  outline: none;
  overflow: auto;
  padding: 10px;
  border: 1px solid rgba(41, 121, 255, 0.5);
}
</style>
