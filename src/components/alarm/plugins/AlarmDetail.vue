<template>
  <Drawer class="alarm-detail-drawer" v-model="popDetail">
    <div class="detail-main">
      <div class="content-right-detail" >
        <div class="detail-title">
          <div class="title-bar"></div>
          <div class="title-con">{{taskName}}详情信息</div>
          <div class="close-icon">
            <i></i>
          </div>
          <div class="close-title" @click="closeDetail">关闭</div>
        </div>
        <div class="row-detail" v-for="(item, index) in alarmDetail.data_list" :key = 'index'>
          <div class="row-item" v-if="item.display_type === 1">
            <div class="row-title">
              <span :title="item.name">{{item.name}}</span>
            </div>
            <div class="row-con">
              <span :title="item.value">{{item.value}}</span>
            </div>
          </div>
          <div class="row-item" v-if="item.display_type === 2">
            <div class="row-title">
              <span :title="item.name">{{item.name}}</span>
            </div>
            <div class="row-con">
              <div class="row-url" :title="item.value" >
                <a :href="item.value" target="_blank" >{{item.linkType === 0 ? item.value : item.showText}}</a>
              </div>
            </div>
          </div>
          <div class="row-item" v-if="item.type === 3">
            <div class="row-title">
              <span :title="item.name">{{item.name}}</span>
            </div>
            <div class="row-con">
              <img :src="item.value" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="select-operate">
        <Button type="primary" class="select-operate-apply" @click="signIn" :disabled="alarmDetail.ack === 1 || alarmDetail.ack === 2" >签收</Button>
        <Button type="text" class="select-operate-origin" @click="feedback" :disabled="alarmDetail.ack === 1" >反馈</Button>
      </div>
    </div>
  </Drawer>
</template>
<script>
import service from '@/http/services'
export default {
  name: 'AlarmDetail',
  data () {
    return {
      alarmDetail: {
        data_list: []
      }
    }
  },
  props: {
    msgId: String,
    taskName: String,
    popDetail: Boolean
  },
  created () {
    if (this.taskId) {
      this.getAlarmDetail()
    }
  },
  watch: {
    popDetail () {
      if (this.popDetail) {
        if (this.msgId) {
          this.getAlarmDetail()
        }
      }
    }
  },
  methods: {
    // 关闭详情页
    closeDetail () {
      this.$emit('closeDetail')
    },
    // 查询详细信息
    getAlarmDetail () {
      service.alarmService.getMsgDetail({
        msgId: this.msgId
      }).then(res => {
        if (res.status === 0) {
          this.alarmDetail = res.data
        }
      })
    },
    // 反馈弹窗
    feedback () {
      this.$emit('feedback', this.msgId)
    },
    // 签收
    signIn () {
      this.$confirm('确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.alarmService.ackMsg({
          id: this.msgId,
          ack: 2
        }).then(res => {
          if (res.status === 0) {
            this.$emit('refresh')
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消签收'
        })
      })
    }
  }

}
</script>
