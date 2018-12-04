<template>
  <Modal class="pop-modal" v-model="value">
    <div class="pop-bg">
      <div class="pop-window" >
        <div class="pop-title">
          <span>反馈</span>
          <i class="close-btn" @click="showFeedback"></i>
        </div>
        <div class="pop-input">
          <textarea v-model="feedback"  placeholder="请输入反馈内容"  maxlength="500" :class="feedback.length > 500 ? 'out-length-border' : ''"></textarea>
        </div>
        <div class="limit" :class="feedback.length > 500 ? 'out-length-color' : ''">最多支持500字输入</div>
        <div class="btn-box">
          <Button type="text" class="btn" @click="showFeedback">取消</Button>
          <Button type="text" class="btn" @click="sendFeedback" :disabled="feedback.length > 500">确定</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'AlarmFeedbackPop',
  data () {
    return {
      feedback: ''
    }
  },
  props: {
    value: Boolean,
    msgId: String
  },
  methods: {
    // 隐藏反馈信息
    showFeedback () {
      this.$emit('showFeedback')
      this.feedback = ''
    },
    // 发送反馈信息
    sendFeedback () {
      if (!this.feedback) {
        this.$Message.error('反馈内容不能为空')
        return null
      }
      this.alarmService.ackMsg({
        id: this.msgId,
        ack: 1,
        ack_content: this.feedback
      }).then(res => {
        this.$emit('showFeedback')
        this.$emit('refresh')
        this.feedback = ''
      })
    }
  }
}
</script>
