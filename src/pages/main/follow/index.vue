<template>
  <div class="follow-list">
    <div class="filter-wrap">
      <time-type-filter :typeOptions="typeOptions" @changeSearch="changeSearch"></time-type-filter>
    </div>
    <div class="follow-content">
      <div class="wt-right-wm" id="wt_con">
        <watermark dom-key="wt_con" tscl="table"></watermark>
      </div>
      <el-table
        :data="followData"
        stripe
        height="calc(100% - 48px)">
        <el-table-column
          label="任务类型"
          width="100">
          <template slot-scope="scope">
            <span>{{CONSTANT.taskType[scope.row.task_type]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="task_name"
          label="任务名称"
          width="140">
        </el-table-column>
        <el-table-column
          label="推送时间"
          width="200">
          <template slot-scope="scope">
            <span>{{util.momentDate(scope.row.create_time, 'date_time')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="推送内容">
        </el-table-column>
        <el-table-column
          label="操作"
          width="96">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="searchData.page_size"
          @current-change="search">
        </el-pagination>
      </div>
    </div>
    <msg-detail v-model="detailVisible"
      :msgData="msgData"
      @showFeedback="showFeedback"
      :is-follow="true"
      @showSign="showSign"
      @readItem="readItem" />
      <feedback v-model="feedbackVisible"
        :msgId="msgId"
        @feedbackSuccess="feedbackSuccess" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      detailVisible: false,
      feedbackVisible: false,
      typeOptions: {
        label: '关注类型',
        data: this.CONSTANT.taskList
      },
      followData: [],
      total: 0,
      searchData: {
        page_size: 20,
        page_no: 1
      },
      msgData: {},
      msgId: ''
    }
  },
  methods: {
    showDetail (item) {
      this.messageService.getMessageDetail({
        msg_id: item.id
      }).then(res => {
        if (res.status === 0) {
          this.msgData = res.data
          this.msgData.read_status = item.read_status
          this.detailVisible = true
        } else {
          this.$message({
            type: 'error',
            message: '网络错误，请稍后再试'
          })
        }
      })
    },
    showFeedback (msgId) {
      this.feedbackVisible = !this.feedbackVisible
      this.msgId = msgId
    },
    feedbackSuccess (msgId) {
      this.feedbackVisible = !this.feedbackVisible
      this.detailVisible = false
      this.followData.forEach(item => {
        if (item.id === msgId) {
          item.ack = 1
        }
      })
    },
    showSign (msgId) {
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
            this.$Message.success('签收成功')
          } else {
            this.$Message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$Message.error('网络错误，请稍后再试')
      })
    },
    readItem (msgId) {
      this.followData.forEach(item => {
        if (item.id === msgId) {
          item.read_status = 1
        }
      })
    },
    search (page) {
      this.searchData = {
        ...this.searchData,
        page_no: page || 1
      }
      this.followService.getFollowData(this.searchData).then(res => {
        if (res.status === 0) {
          this.followData = res.data.list
          this.total = res.data.total
        }
      })
    },
    changeSearch (res) {
      this.searchData = {
        ...this.searchData,
        start: res.date ? res.date[0] : '',
        end: res.date ? res.date[1] : '',
        task_type: res.type || ''
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
