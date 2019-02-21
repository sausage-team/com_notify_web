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
                <el-button class="btn" type="primary" :disabled="item.ack === 2" @click="showSign(item.id, $event)">{{(item.ack === 2) ? ('已签收') : ('签收')}}</el-button>
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
      @showSign="showSign"
    />
    <feedback v-model="feedbackVisible"
      :msgId="msgId"
      :tsk-id="tskId"
      @feedbackSuccess="feedbackSuccess" />
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
      tmpNotice: [],
      total: 0,
      msgId: '',
      tskId: '',
      msgData: {},
      tmpTimeOut: null,
      tmpTimeOut1: null
    }
  },
  methods: {
    showDetail (msg) {
      this.tskId = msg.task_id
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
    },
    readItem (msgId) {
      this.messageData.forEach(item => {
        if (item.id === msgId) {
          item.read_status = 1
        }
      })
    },
    showSign (msgId, event) {
      if (event) {
        event.stopPropagation()
      }
      this.$confirm('确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.alarmService.ackMsg({
          id: msgId,
          ack: 2
        }).then(res => {
          if (res.status === 0) {
            this.detailVisible = false
            this.messageData.forEach(item => {
              if (item.id === msgId) {
                item.ack = 2
              }
            })
            this.$Message.success('签收成功')
          } else {
            this.$Message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$Message.error('网络错误，请稍后再试')
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
      this.messageData = []
      this.searchData = {
        ...this.searchData,
        start: res.date ? res.date[0] : '',
        end: res.date ? res.date[1] : '',
        task_type: res.type || '',
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
    socketEvent (messageString) {
      let message = JSON.parse(messageString)
      this.tmpNotice.push(message)
      this.notification(message.title)
      if (localStorage.getItem('userSoundStatus')) {
        if (parseInt(localStorage.getItem('userSoundStatus')) === 1) {
          if (this.soundTimeout) {
            clearTimeout(this.soundTimeout)
            if (this.times >= 6) {
              setTimeout(() => {
                this.times = 1
              }, 10000)
              return
            }
          }
          this.soundTimeout = setTimeout(() => {
            document.getElementById('tipAudio').play()
            this.search()
            this.times++
          }, 1000)
        }
      }
      if (!this.tmpTimeOut) {
        this.tmpTimeOut = setTimeout(() => {
          if (this.tmpNotice.length >= 10) {
            if (!this.tmpTimeOut1) {
              this.tmpTimeOut1 = setTimeout(() => {
                this.tmpNotice = []
                clearTimeout(this.tmpTimeOut)
                this.init()
              }, 2000)
            }
          } else {
            clearTimeout(this.tmpTimeOut)
            this.init()
          }
        }, 1000)
      }
    }
  },
  created () {
    this.search()
    setTimeout(() => {
      if (!this.$cookies.get('token')) {
        if (this.$store.state.client) {
          this.$store.dispatch('closeSub')
        }
      } else {
        this.$store.dispatch('taskMqtt', (message) => {
          this.socketEvent(message)
        })
      }
    })
  }
}

</script>
<style lang='scss'></style>
