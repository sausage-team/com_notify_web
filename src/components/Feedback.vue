<template>
  <Modal class="pop-modal" v-model="showModel">
    <div class="pop-bg">
      <div class="pop-window" >
        <div class="pop-title">
          <span>反馈</span>
          <i class="close-btn" @click="closeModel"></i>
        </div>
        <div class="feed-type" v-if="msgData && msgData.dic_type_id">
          <span>反馈类型</span>
          <el-select v-model="filterType">
            <el-option
              v-for="item in filterTypeList"
              :key="item.id"
              :label="item.content"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="pop-input">
          <textarea v-model="feedback"  placeholder="请输入反馈内容"  maxlength="500" :class="feedback.length > 500 ? 'out-length-border' : ''"></textarea>
        </div>
        <div class="limit" :class="feedback.length > 500 ? 'out-length-color' : ''">最多支持500字输入</div>
        <div class="btn-box">
          <el-button type="text" class="cancel" @click="closeModel">取消</el-button>
          <el-button type="text" @click="sendFeedback" :disabled="feedback.length > 500">确定</el-button>
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
      feedback: '',
      showModel: false,
      filterTypeList: [],
      filterType: ''
    }
  },
  props: {
    value: Boolean,
    msgId: String,
    tskId: String,
    msgData: Object
  },
  methods: {
    // 发送反馈信息
    sendFeedback () {
      if (!this.feedback) {
        this.$Message.error('反馈内容不能为空')
        return null
      }
      if (this.msgData && this.msgData.dic_type_id && !this.filterType) {
        this.$Message.error('反馈类型不能为空')
        return null
      }
      this.alarmService.ackMsg({
        id: this.msgId,
        dic_content_id: this.filterType || undefined,
        ack: 1,
        ack_content: this.feedback
      }).then(res => {
        if (res.status === 0) {
          this.$emit('feedbackSuccess', this.msgId)
          this.feedback = ''
          this.$Message.success('反馈成功')
          this.showModel = false
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    // 关闭弹窗
    closeModel () {
      this.showModel = false
    }
  },
  watch: {
    value () {
      this.showModel = this.value
      if (this.value) {
        this.messageService.getDicTypeList({
          task_id: this.tskId
        }).then(res => {
          if (res.status === 0) {
            this.filterTypeList = res.data
          }
        })
      }
    },
    showModel () {
      if (!this.showModel) {
        this.filterType = ''
        this.$emit('input', this.showModel)
      }
    }
  }
}
</script>
