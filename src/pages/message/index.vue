<template lang='html'>
  <div class="message-list">
    <div class="cards-option">
      <div class="filter-wrap">
        <time-type-filter :typeOptions="typeOptions"></time-type-filter>
      </div>
      <div class="sign-option">
        <button class="btn no-bg">全部标记为已读</button>
        <button class="btn">全部签收</button>
      </div>
    </div>
    <div class="cards-content-wrap">
      <div class="cards-content">
        <div class="card" v-for="(item, index) in 10" :key="index" @click="showDetail()">
          <div class="card-header">
            <div class="name-type">
              <span class="name">任务名称任务名称{{item}}</span>
              <span class="tag">涉黄</span>
            </div>
            <p class="time">2018-10-11 17:00:05</p>
          </div>
          <div class="content">您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息。</div>
          <div class="card-footer right">
            <card-footer></card-footer>
          </div>
        </div>
      </div>
    </div>
    <card-detail v-model="detailVisible"></card-detail>
  </div>
</template>

<script>
import CardDetail from '@/pages/message/CardDetail'
import CardFooter from '@/pages/message/CardFooter'
import TimeTypeFilter from '@/pages/message/TimeTypeFilter'
export default {
  name: 'MessageList',
  components: {
    CardDetail,
    CardFooter,
    TimeTypeFilter
  },
  data () {
    return {
      typeOptions: {
        label: '签收类型',
        data: [{
          value: 'all',
          label: '全部'
        }, {
          value: 'sign',
          label: '已签收'
        }, {
          value: 'unsign',
          label: '未签收'
        }]
      },
      detailVisible: false
    }
  },
  methods: {
    showDetail () {
      this.detailVisible = true
    }
  },
  created () {}
}

</script>
<style lang='scss'></style>
