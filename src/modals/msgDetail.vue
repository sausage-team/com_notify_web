<template lang='html'>
  <Modal v-model="showModel" class="msg-detail-model">
    <p slot="header">
      <span>详情信息</span>
    </p>
    <div class="detail-content">
      <ul>
        <li v-for="(item, index) in msgData.data_list" :key="index">
          <label>{{item.name}}</label>
          <span v-if="item.display_type === 1">{{item.value}}</span>
          <span v-if="item.display_type === 2">
            <a :href="item.value" target="_blank">{{item.value}}</a>
          </span>
          <span v-if="item.display_type === 3">
            <img :src="item.value" style="height: 100px" />
          </span>
        </li>
      </ul>
      <div class="seq"></div>
      <div class="filter-type-con">
        <span>反馈信息</span>
        <div class="filter-ul">
          <div class="filter-item" v-for="(item, index) in msgData.feedback_list" :key="index">
            <div class="item-box">
              <span class="first-item">
                <span>反馈人</span>
                <span>{{item.feedback_user}}</span>
              </span>
              <span>
                <span>反馈类型</span>
                <span>{{item.dic_content}}</span>
              </span>
              <span>{{util.momentDate(item.update_time, 'date_time')}}</span>
            </div>
            <div class="item-box item-box1">
              <span>
                <span>反馈信息</span>
                <span>{{item.content}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="btn-right">
      <div class="btn-box">
        <el-button class="no-bg"
          @click="showFeedback()">反馈
        </el-button>
        <el-button type="primary" :disabled="msgData.ack === 2"
          @click="showSign()">{{(msgData.ack === 2) ? ('已签收') : ('签收')}}
        </el-button>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    msgData: Object,
    tskId: String
  },
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    showFeedback () {
      this.$emit('showFeedback', {
        ...this.msgData,
        id: this.msgData.msg_id,
        task_id: this.tskId
      })
    },
    showSign () {
      this.$emit('showSign', this.msgData.msg_id)
    },
    readItem () {
      if (this.msgData.read_status !== 1) {
        this.messageService.readItem({
          msg_id: this.msgData.msg_id
        }).then(res => {
          if (res.status === 0) {
            this.$emit('readItem', this.msgData.msg_id)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '网络错误，请稍后再试'
          })
        })
      }
    }
  },
  watch: {
    value () {
      this.showModel = this.value
    },
    showModel () {
      if (!this.showModel) {
        this.readItem()
        this.$emit('input', this.showModel)
      }
    }
  }
}
</script>
