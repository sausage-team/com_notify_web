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
        <div class="row-item" v-if="item.type === 0">
          <div class="row-title">
            <span :title="item.fieldDesc">{{item.fieldDesc}}</span>
          </div>
          <div class="row-con">
            <span :title="item.value">{{item.value}}</span>
          </div>
        </div>
        <div class="row-item" v-if="item.type === 1">
          <div class="row-title">
            <span:title="item.fieldDesc">{{item.fieldDesc}}</span>
          </div>
          <div class="row-con">
            <div class="row-url" :title="item.value" >
              <a :href="item.value" target="_blank" >{{item.linkType === 0 ? item.value : item.showText}}</a>
            </div>
          </div>
        </div>
        <div class="row-item" v-if="item.type === 2">
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
      <Button type="primary" class="select-operate-apply" @click="signIn" :disabled="alarmStatus != 0 && alarmStatus != 1" >签收</Button>
      <Button type="text" class="select-operate-origin" @click="feedback" :disabled="alarmStatus === 3" >反馈</Button>
    </div>
  </div>
</template>

<script>
import {getAlarmDetail, getAlarmSign} from '@/http/services/alarm_api'
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
    taskId: Number,
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
        taskId: this.taskId,
        alarmId: this.alarmId
      }
      getAlarmDetail(params).then(res => {
        let temp = {
          fieldDesc: '',
          fieldName: '',
          linkType: '',
          showText: '',
          type: '',
          value: ''
        }
        this.alarmDetail = []
        res.data.result.alarmDataDetailList.forEach((item, index) => {
          temp = JSON.parse(JSON.stringify(temp))
          this.alarmDetail.push(temp)
          this.alarmDetail[index].type = item.type
          this.alarmDetail[index].linkType = item.linkType
          this.alarmDetail[index].fieldName = item.fieldName
          this.alarmDetail[index].fieldDesc = item.fieldDesc
          this.alarmDetail[index].value = item.value
          this.alarmDetail[index].showText = item.showText
        })
        this.alarmStatus = res.data.result.alarmStatus
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
        taskId: this.taskId,
        alarmId: this.alarmId
      }
      this.$confirm('确定签收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAlarmSign(params).then(res => {
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
