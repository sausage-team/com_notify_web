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
    </div>
    <div slot="footer" class="right">
      <div class="btn-box">
        <el-button class="no-bg"
          :disabled="msgData.ack === 1"
          @click="showFeedback()">
            {{(msgData.ack === 1) ? ('已反馈') : ('反馈')}}
        </el-button>
        <el-button type="primary" :disabled="msgData.ack > 0"
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
    msgData: Object
  },
  data () {
    return {
      showModel: false
    }
  },
  methods: {
    showFeedback () {
      this.$emit('showFeedback', this.msgData.msg_id)
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
