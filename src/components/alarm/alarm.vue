/* eslint-disable */
<template>
  <div class="alarm-main">
    <header-nav />
    <div class="content">
      <div class="content-left">
        <div class="con-left-body">
          <Menu class="left-menu" theme="light" :active-name.sync="chooseId">
            <MenuItem  v-for="item in workList" :key="item.id" :name="item.id" @click.native="chooseTag($event, item)">
              <div class="item-con">
                <span class="msg-con">{{item.name}}</span>
                <span class="msg-tip" :ref="`msg_${item.id}`" v-show="item.msg_count > 0">{{(item.msg_count > 99) ? ('...') : (item.msg_count)}}</span>
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div class="content-right">
        <div class="content-left-header">
          <div class="count-box">
            <span>结果预警量:</span>
            <span>{{alarmTotalBySelector}}</span>
            <span>总预警数量:</span>
            <span>{{alarmSumTotal}}</span>
            <span>占比:</span>
            <span>{{(alarmRate > 0)?(alarmRate+'%'):(alarmRate)}}</span>
          </div>
          <div class="filter-btn">
            <Poptip trigger="hover" v-if="filterSchema.length > 0" placement="bottom" word-wrap>
              <span>筛选条件</span>
              <div slot="content">
                <ul>
                  <li v-for="(item, index) in filterSchema" :key="index">
                    <span>{{item.alias || item.name}}</span>
                    <span>{{queryFilter[item.id]}}</span>
                  </li>
                </ul>
              </div>
            </Poptip>
            <Button type="primary" @click="filterModal = true">高级筛选</Button>
          </div>
        </div>
        <div class="content-left-table">
          <div class="content-left-table-inner">
            <el-table
              width="100%"
              height="100%"
              :data="msg_list">
              <el-table-column min-width="170" v-for="(item, index) in schema" :key="index" :label="item.alias || item.name">
                <template slot-scope="scope">
                  <div v-if="item.display_type === 2">
                    <a @click="redirectPage(scope.row.detail[item.id])">{{(!item.linkType || item.linkType === 0) ? item.value : item.showText}}</a>
                  </div>
                  <div v-else-if="item.display_type === 3">
                    <img style="max-width:100px;max-height:100px;" :src="`${scope.row.detail[item.id]}`" />
                  </div>
                  <span v-else>{{scope.row.detail[item.id]}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="120" label="推送通道" prop="channel_name"></el-table-column>
              <el-table-column fixed="right" width="80" label="反馈状态">
                <template slot-scope="scope">
                  <div v-if="scope.row.ack === 0">{{'已发送'}}</div>
                  <div v-else-if="scope.row.ack === 1">{{'已反馈'}}</div>
                  <div v-else-if="scope.row.ack === 2">{{'已签收'}}</div>
                  <div v-else>{{''}}</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="80" label="详情">
                <template slot-scope="scope">
                  <div class="em" @click="showDetail(scope.row)">详情</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="content-left-footer">
          <div class="content-left-footer-inner">
            <Page :total="pageParam.total"
              :current.sync="pageParam.pageNo"
              :page-size="pageParam.count"
              :page-size-opts="[10, 20, 30, 40, 50]"
              @on-page-size-change="changeListSize"
              @on-change="changeList"
              placement="top"
              show-elevator
              show-sizer
              transfer
              show-total></Page>
          </div>
        </div>
      </div>
      <alarm-detail
        :msgId="detailData.id"
        :taskName="detailData.name"
        :popDetail="popDetail"
        @feedback="feedback"
        @refresh="refresh"
        @closeDetail="closeDetail" />
      <alarm-feedback-pop
        :msgId="detailData.id"
        :popFeed="popFeed"
        @showFeedback="showFeedback"
        @refresh="refresh" />
      <alarm-select-list
        :query-filter="queryFilter"
        :schema="schema"
        :task-id="this.chooseId"
        @applyFilter="applyFilter"
        @packUp="filterModal = false"
        :pop-select="filterModal"/>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/plugins/HeaderNav'
import AlarmSelectList from './plugins/AlarmSelectList'
import AlarmDetail from './plugins/AlarmDetail'
import AlarmFeedbackPop from './plugins/AlarmFeedbackPop'
import service from '@/http/services'

export default {
  name: 'AlarmList',
  components: {
    HeaderNav,
    AlarmSelectList,
    AlarmDetail,
    AlarmFeedbackPop
  },
  data () {
    return {
      loading: true,
      taskId: '',
      taskName: '',
      msg_count: '',
      filterModal: false,
      workList: [],
      schema: [],
      msg_list: [],
      filterSchema: [],
      popDetail: false,
      detailData: {
        id: '',
        name: ''
      },
      popFeed: false,
      chooseItem: {},
      chooseId: '',
      pageParam: {
        pageNo: 1,
        offset: 0,
        count: 20,
        total: 0
      },
      tmpNotice: [],
      tmpTimeOut: null,
      queryFilter: {},
      alarmTotalBySelector: 0, // 结果预警量
      alarmSumTotal: 0, // 总预警量
      alarmRate: 0 // 占比
    }
  },
  created () {
    this.init()
  },
  watch: {
    '$route' () {
      this.init()
    }
  },
  methods: {
    init () {
      this.detailData = {
        id: '',
        name: ''
      }
      this.filterSchema = []
      this.queryFilter = {}
      this.popDetail = false
      this.schema = []
      this.msg_list = []
      this.getTaskList().then(() => {
        if (this.workList.length > 0) {
          if (this.$route.query && this.$route.query.id) {
            let id = this.$route.query.id
            let check = false
            this.workList.forEach(item => {
              if (item.id === id) {
                this.chooseItem = item
                check = true
              }
            })
            if (!check) {
              this.chooseItem = this.workList[0]
              this.chooseId = this.chooseItem.id
            } else {
              this.chooseId = this.chooseItem.id
            }
          } else {
            if (this.workList.length > 0) {
              this.$router.push(`/alarm?id=${this.workList[0].id}`)
            }
          }
        } else {
          this.chooseItem = {}
          this.chooseId = ''
        }
        if (this.chooseId) {
          this.getTask()
        }
      })
      if (!this.$cookies.get('token')) {
        this.$store.dispatch('closeSub')
      } else {
        this.$store.dispatch('taskMqtt', (message) => {
          this.socketEvent(message)
        })
      }
    },
    getTaskList () {
      return new Promise((resolve, reject) => {
        service.alarmService.getMsgTaskList().then(res => {
          if (res.status === 0) {
            res.data.forEach(item => {
              if (!item.msg_count) {
                item.msg_count = 0
              }
            })
            this.workList = res.data || []
            resolve()
          }
        })
      })
    },
    // 分页查询
    changeList () {
      this.getDataList()
    },
    // 分页总数改变查询
    changeListSize (size) {
      this.pageParam.count = size
      this.getDataList()
    },
    // 选择预警任务
    getTask () {
      this.getDataList()
      this.getPushStatistics()
    },
    chooseTag (e, item) {
      e.stopPropagation()
      service.alarmService.readAll({
        task_id: item.id
      }).then(res => {
        if (res.status === 0) {
          // this.init()
          this.$router.push(`/alarm?id=${item.id}`)
        }
      })
    },
    socketEvent (messageString) {
      let message = JSON.parse(messageString)
      this.tmpNotice.push(message)
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
            this.times++
          }, 1000)
        }
      }
      if (!this.tmpTimeOut) {
        this.tmpTimeOut = setTimeout(() => {
          if (this.tmpNotice.length >= 6) {
            clearTimeout(this.tmpTimeOut)
            this.tmpTimeOut = setTimeout(() => {
              this.tmpNotice = []
              clearTimeout(this.tmpNotice)
              this.init()
            }, 3000)
          } else {
            clearTimeout(this.tmpTimeOut)
            this.init()
          }
        }, 1000)
      }

      // this.notification(message.title)
      // let check = false
      // this.workList.forEach(item => {
      //   if (message.task_id && item.id === message.task_id) {
      //     item.msg_count++
      //     check = true
      //   }
      //   if (this.$route.query.id === message.task_id) {
      //     this.getTask()
      //   }
      // })
      // if (!check) {
      //   service.alarmService.getMsgListTry({
      //     task_id: message.task_id
      //   }).then(res => {
      //     if (res.status === 0) {
      //       if (!res.data.msg_count) {
      //         res.data.msg_count = 1
      //       }
      //       this.workList.splice(0, 1, res.data)
      //     }
      //   })
      // }
    },
    // 查询预警信息
    getDataList () {
      this.pageParam.offset = (this.pageParam.pageNo - 1) * this.pageParam.count
      let params = {
        task_id: this.chooseId,
        filter: this.queryFilter || {},
        offset: this.pageParam.offset,
        count: this.pageParam.count
      }
      service.alarmService.getMsgDataList(params).then(res => {
        if (res.status === 0) {
          this.msg_list = res.data.msg_list
          this.schema = res.data.schema
          this.pageParam.total = res.data.total
        }
      })
    },
    getPushStatistics () {
      service.alarmService.getPushStat({
        taskId: this.chooseId
      }).then(res => {
        if (res.status === 0) {
          this.alarmTotalBySelector = res.data.pushed
          this.alarmSumTotal = res.data.total
          this.alarmRate = res.data.rate
        }
      })
    },
    // 消息已读接口
    setReadMsg () {
      service.alarmService.readAll({
        task_id: this.chooseItem.id
      }).then(res => {
        if (res.status) {
          this.workList.forEach((item, index) => {
            if (this.chooseItem.id === item.id) {
              item.msg_count = 0
              const temp = JSON.parse(JSON.stringify((item)))
              this.workList.splice(index, 1, temp)
            }
          })
        }
      })
    },
    // 表格页面跳转
    redirectPage (url) {
      window.open(url)
    },
    // 展示详情页
    showDetail (item) {
      this.detailData.name = this.chooseItem.name
      this.detailData.id = item.id
      this.popDetail = true
    },
    closeDetail () {
      this.popDetail = false
    },
    // // 反馈信息弹窗
    feedback (id) {
      this.detailData.id = id
      this.popFeed = true
    },
    // // 取消反馈
    showFeedback () {
      this.popFeed = false
    },
    applyFilter (filter) {
      this.filterModal = false
      this.pageParam = {
        pageNo: 1,
        offset: 0,
        count: 20,
        total: 0
      }
      this.filterSchema = filter.schema
      this.getDataList()
    },
    // 已签收
    refresh () {
      this.popDetail = false
      this.getDataList()
    }
  }
}
</script>
/* eslint-enable */
