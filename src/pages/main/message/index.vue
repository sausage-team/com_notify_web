<template lang='html'>
  <div class="message-list">
    <div class="cards-option">
      <div class="filter-wrap">
        <time-type-filter :typeOptions="typeOptions" @changeSearch="changeSearch"></time-type-filter>
      </div>
      <div class="sign-option">
        <el-button class="btn">全部标记为已读</el-button>
        <el-button  class="btn" type="primary">全部签收</el-button>
      </div>
    </div>
    <div class="cards-content-wrap">
      <Scroll class="scroll-box" height="100%" :on-reach-bottom="handleReachBottom">
        <div class="cards-content">
          <no-card class="card-box"
            v-for="(item, index) in messageData"
            :key="index"
            :msg-data="item"
            @click="showDetail($event, item)">
            <div class="card-footer" slot="footer">
              <div class="op-box">
                <el-tag v-show="item.read_status !== 1">未读</el-tag>
                <el-tag v-show="item.read_status === 1" type="info">已读</el-tag>
              </div>
              <div class="btn-box">
                <el-button class="btn" :disabled="item.ack === 1 " @click="showFeedback($event)">{{(item.ack === 1) ? ('已反馈') : ('反馈')}}</el-button>
                <el-button class="btn" type="primary" :disabled="item.ack > 0" @click="showSign($event)">{{(item.ack === 2) ? ('已签收') : ('签收')}}</el-button>
              </div>
            </div>
          </no-card>
          <no-card v-if="messageData && messageData.length % 3 === 2" class="hide-op" />
        </div>
      </Scroll>
    </div>
    <msg-detail v-model="detailVisible" />
    <feedback v-model="feedbackVisible" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      typeOptions: {
        label: '任务类型',
        data: this.CONSTANT.taskList
      },
      detailVisible: false,
      feedbackVisible: false,
      searchData: {
        page_size: 36,
        page_no: 1
      },
      messageData: [],
      total: 0
    }
  },
  methods: {
    showDetail () {
      this.detailVisible = true
    },
    showFeedback () {
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
    },
    handleReachBottom () {
      if (this.messageData.length < this.total) {
        this.searchData.page_no++
        this.search()
      } else {
        this.$Message.info('已经到底了')
      }
    },
    search () {
      this.messageService.getMessageData(this.searchData).then(res => {
        if (res.status === 0) {
          this.messageData = [...this.messageData, ...res.data.list]
          this.total = res.data.total
        }
      })
    },
    changeSearch (res) {
      console.log(res)
      this.messageData = []
      this.searchData = {
        ...this.searchData,
        start: res.date ? res.date[0] : '',
        end: res.date ? res.date[1] : '',
        task_type: res.type || '',
        page_no: 1
      }
      this.search()
    }
  },
  created () {
    this.search()
  }
}

</script>
<style lang='scss'></style>
