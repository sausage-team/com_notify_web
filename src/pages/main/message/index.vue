<template lang='html'>
  <div class="message-list">
    <div class="cards-option">
      <div class="filter-wrap">
        <time-type-filter :typeOptions="typeOptions" @changeSearch="changeSearch"></time-type-filter>
      </div>
      <div class="sign-option">
        <el-button class="no-bg" @click="readAll()">全部标记为已读</el-button>
        <el-button type="primary" @click="signAll()">全部签收</el-button>
      </div>
    </div>
    <div class="cards-content-wrap">
      <Scroll class="scroll-box" height="100%" :on-reach-bottom="handleReachBottom">
        <div class="cards-content">
          <no-card class="card-box"
            v-for="(item, index) in messageData"
            :key="index"
            :msg-data="item"
            @showDetail="showDetail">
            <div class="card-footer" slot="footer">
              <div class="op-box">
                <el-tag v-show="item.read_status !== 1">未读</el-tag>
                <el-tag v-show="item.read_status === 1" type="info">已读</el-tag>
              </div>
              <div class="btn-box">
                <el-button class="no-bg"
                  @click="showFeedback(item, $event)">反馈</el-button>
                <el-button class="btn" type="primary" :disabled="item.ack === 2" @click="showSign(item, $event)">{{(item.ack === 2) ? ('已签收') : ('签收')}}</el-button>
              </div>
            </div>
          </no-card>
        </div>
      </Scroll>
    </div>
    <msg-detail v-model="detailVisible"
      :msgData="msgData"
      @showFeedback="showFeedback"
      @readItem="readItem"
      :tsk-id="tskId"
      :msg-item="messageItem"
      @showSign="showSign"
    />
    <feedback v-model="feedbackVisible"
      :msgId="msgId"
      :tsk-id="tskId"
      :msg-data="messageItem"
      @feedbackSuccess="feedbackSuccess" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      typeOptions: {
        label: '任务名称',
        data: this.CONSTANT.taskList
      },
      detailVisible: false,
      feedbackVisible: false,
      searchData: {
        page_size: 36,
        page_no: 1
      },
      messageData: [],
      tmpNotice: [],
      total: 0,
      msgId: '',
      tskId: '',
      msgData: {},
      messageItem: {},
      tmpTimeOut: null,
      tmpTimeOut1: null
    }
  },
  methods: {
    resetSearch () {
      this.messageData = []
      this.searchData = {
        page_size: 36,
        page_no: 1
      }
      this.search()
    },
    showDetail (msg) {
      this.tskId = msg.task_id
      this.messageItem = msg
      this.messageService.getMessageDetail({
        msg_id: msg.id
      }).then(res => {
        if (res.status === 0) {
          this.msgData = res.data
          this.msgData.read_status = msg.read_status
          this.detailVisible = true
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '网络错误，请稍后再试'
        })
      })
    },
    showFeedback (item, e) {
      this.feedbackVisible = !this.feedbackVisible
      this.msgId = item.id
      this.tskId = item.task_id
      this.messageItem = item
      if (e) {
        e.stopPropagation()
      }
    },
    feedbackSuccess (msgId) {
      this.messageData.forEach(item => {
        if (item.id === msgId) {
          item.ack = 1
        }
      })
      this.detailVisible = false
      this.messageData = []
      this.search()
    },
    readItem (msgId) {
      this.messageData.forEach(item => {
        if (item.id === msgId) {
          item.read_status = 1
        }
      })
    },
    showSign (item, event) {
      if (event) {
        event.stopPropagation()
      }
      if (item.ack !== 2) {
        this.$confirm('确定签收?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.alarmService.ackMsg({
            id: item.id || item.msg_id || '',
            ack: 2
          }).then(res => {
            if (res.status === 0) {
              this.detailVisible = false
              // this.msgData.ack = 2
              console.log(this.messageData, item)
              this.messageData.forEach(n => {
                if (n.id === item.msg_id || n.id === item.id) {
                  n.ack = 2
                }
              })
              this.$Message.success('签收成功')
            } else {
              this.$Message.error(res.msg)
            }
          })
        })
      }
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
      this.messageData = []
      this.searchData = {
        ...this.searchData,
        start: res.date ? res.date[0] : '',
        end: res.date ? res.date[1] : '',
        task_type: res.type || '',
        task_name: res.task_name,
        feedback_status: res.feedback_status,
        ack_status: res.ack_status,
        page_no: 1
      }
      this.search()
    },
    readAll () {
      this.messageService.readAll({}).then(res => {
        if (res.status === 0) {
          this.searchData.page_no = 1
          this.messageData = []
          this.search()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    signAll () {
      this.messageService.signAll({}).then(res => {
        if (res.status === 0) {
          this.searchData.page_no = 1
          this.messageData = []
          this.search()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    socketEvent (messageString, self) {
      let message = JSON.parse(messageString)
      self.tmpNotice.push(message)
      self.notification(message.title)
      if (localStorage.getItem('userSoundStatus')) {
        if (parseInt(localStorage.getItem('userSoundStatus')) === 1) {
          if (self.soundTimeout) {
            clearTimeout(self.soundTimeout)
            if (self.times >= 6) {
              setTimeout(() => {
                self.times = 1
              }, 10000)
              return
            }
          }
          self.soundTimeout = setTimeout(() => {
            document.getElementById('tipAudio').play()
            self.resetSearch()
            self.times++
          }, 1000)
        }
      }
      if (!self.tmpTimeOut) {
        self.tmpTimeOut = setTimeout(() => {
          if (self.tmpNotice.length >= 10) {
            if (!self.tmpTimeOut1) {
              self.tmpTimeOut1 = setTimeout(() => {
                self.tmpNotice = []
                clearTimeout(self.tmpTimeOut)
                self.resetSearch()
              }, 2000)
            }
          } else {
            clearTimeout(self.tmpTimeOut)
            self.resetSearch()
          }
        }, 1000)
      }
    }
  },
  created () {
    const self = this
    this.dicService.getDicConData({
      type_id: 'dic_t_task_type'
    }).then(res => {
      if (res.status === 0) {
        this.typeOptions.data = res.data.list.map(item => {
          return {
            label: item.content,
            value: item.id
          }
        })
      }
    })
    this.search()
    setTimeout(() => {
      if (!this.$cookies.get('notify_data')) {
        if (this.$store.state.client) {
          this.$store.dispatch('closeSub')
        }
      } else {
        this.$store.dispatch('taskMqtt', (message) => {
          this.socketEvent(message, self)
        })
      }
    })
  }
}

</script>
<style lang='scss'></style>
