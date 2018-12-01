<template lang='html'>
  <div>
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
        <card-footer></card-footer>
      </div>
    </Modal>
  </div>
</template>

<script>
import CardFooter from '@/pages/message/CardFooter'
export default {
  components: {
    CardFooter
  },
  props: {
    value: Boolean
  },
  data () {
    return {
      showDetail: false
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
    }
  }
}

</script>
<style lang='scss'>
@import "@/assets/sass/card-detail.scss";
</style>
