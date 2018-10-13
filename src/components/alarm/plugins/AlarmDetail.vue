<template>
  <div class="detail-main" v-show="popDetail">
    <div class="content-right-detail" >
      <div class="detial-title">
        <div class="title-bar"></div>
        <div class="title-con">{{taskName}}详情信息</div>
        <div class="close-icon">
          <i></i>
        </div>
        <div class="close-title" @click="closeDetail">关闭</div>
      </div>
      <div class="row-detail" v-for="(item, index) in alarmDetail" :key = 'index'>
        <div class="row-item" v-if="item.type === 1">
          <div class="row-title">
            <span :title="item.fieldDesc">{{item.fieldDesc}}</span>
          </div>
          <div class="row-con">
            <span :title="item.value">{{item.value}}</span>
          </div>
        </div>
        <div class="row-item" v-if="item.type === 2">
          <div class="row-title">
            <span :title="item.fieldDesc">{{item.fieldDesc}}</span>
          </div>
          <div class="row-con">
            <div class="row-url" :title="item.value" >
              <a :href="item.value" target="_blank" >{{item.linkType === 0 ? item.value : item.showText}}</a>
            </div>
          </div>
        </div>
        <div class="row-item" v-if="item.type === 3">
          <div class="row-title">
            <span :title="item.fieldDesc">{{item.fieldDesc}}</span>
          </div>
          <div class="row-con">
            <img :src="item.value" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="select-operate">
      <Button type="primary" class="select-operate-apply" @click="signIn" :disabled="alarmStatus === 1 || alarmStatus === 2" >签收</Button>
      <Button type="text" class="select-operate-origin" @click="feedback" :disabled="alarmStatus === 1" >反馈</Button>
    </div>
  </div>
</template>

<script>
import {getMsgDetail, ackMsg} from '@/http/services/alarm_api'
export default {
  name: 'AlarmDetail',
  data () {
    return {
      alarmId: '',
      alarmStatus: null,
      alarmDetail: []
    }
  },
  props: {
    taskId: String,
    taskName: String,
    popDetail: Boolean
  },
  created () {
    this.$nextTick(function () {
      this.$on('showDetail', function (alarmId) {
        this.alarmId = alarmId
        this.getAlarmDetail()
      })
    })
  },
  methods: {
    // 关闭详情页
    closeDetail () {
      this.$emit('closeDetail')
    },
    // 查询详细信息
    getAlarmDetail () {
      let params = {
        msgId: this.alarmId
      }
      getMsgDetail(params).then(res => {
        let temp = {
          fieldDesc: '',
          fieldName: '',
          linkType: '',
          showText: '',
          type: '',
          value: ''
        }
        this.alarmDetail = []
        res.data.data.data_list.forEach((item, index) => {
          temp = JSON.parse(JSON.stringify(temp))
          this.alarmDetail.push(temp)
          this.alarmDetail[index].type = item.display_type
          this.alarmDetail[index].linkType = item.link_type
          this.alarmDetail[index].fieldName = item.name
          this.alarmDetail[index].fieldDesc = item.name
          this.alarmDetail[index].value = item.value
          this.alarmDetail[index].showText = item.show_text
        })
        this.alarmStatus = res.data.data.ack
      }).catch(error => {
        console.log(error)
      })
    },
    // 反馈弹窗
    feedback () {
      this.$emit('feedback')
    },
    // 签收
    signIn () {
      let params = {
        id: this.alarmId,
        ack: 2
      }
      this.$confirm('确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ackMsg(params).then(res => {
          this.$emit('signIn')
        }).catch(error => {
          console.log(error)
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
