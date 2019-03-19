<template lang='html'>
  <Modal v-model="showModel" class="msg-detail-model">
    <p slot="header">
      <span>详情信息</span>
    </p>
    <div class="detail-content">
      <ul>
        <li v-for="(item, index) in msgData.data_list" :key="index">
          <label :title="item.name">{{item.name}}</label>
          <span v-if="item.display_type === 1">{{item.value}}</span>
          <span v-if="item.display_type === 2">
            <a :href="item.value" target="_blank">{{item.value}}</a>
          </span>
          <span v-if="item.display_type === 3">
            <img :src="item.value" style="height: 100px" />
          </span>
        </li>
        <li v-if="msgData.ack === 2">
          <label title="签收机构">签收机构</label>
          <span>{{msgData.ack_department}}</span>
        </li>
        <li v-if="msgData.ack === 2">
          <label title="签收人">签收人</label>
          <span>{{msgData.ack_user_name}}</span>
        </li>
        <li v-if="msgData.ack === 2">
          <label title="签收时间">签收时间</label>
          <span>{{util.momentDate(msgData.ack_time, 'date_time')}}</span>
        </li>
      </ul>
      <div class="seq" v-show="msgData.feedback_list && msgData.feedback_list.length > 0"></div>
      <div class="filter-type-con" v-show="msgData.feedback_list && msgData.feedback_list.length > 0">
        <span>反馈信息</span>
        <div class="filter-ul">
          <div class="filter-item" v-for="(item, index) in msgData.feedback_list" :key="index">
            <div class="item-box">
              <span class="first-item">
                <span>反馈人</span>
                <span>{{item.feedback_user}}</span>
              </span>
              <span>{{util.momentDate(item.update_time, 'date_time')}}</span>
            </div>
            <div class="item-box item-box1">
              <span>
                <span>反馈机构</span>
                <span>{{item.feedback_department}}</span>
              </span>
            </div>
            <div class="item-box item-box1">
              <span>
                <span>反馈类型</span>
                <span>{{item.dic_content}}</span>
              </span>
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
    tskId: String,
    msgItem: Object
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
        task_id: this.tskId,
        dic_type_id: this.msgItem.dic_type_id || undefined
      })
    },
    showSign () {
      this.$emit('showSign', this.msgData)
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
