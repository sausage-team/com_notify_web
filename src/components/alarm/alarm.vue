<template>
  <div class="alarm-main">
    <header-nav @getTask="getTask" ref="clearMsg"></header-nav>
    <div class="content">
      <div class="content-left" :class="[popSelect ? 'short' : '']">
        <div class="content-left-header">
          <span>结果预警量:</span>
          <span>{{alarmTotalBySelector}}</span>
          <span>总预警数量:</span>
          <span>{{alarmSumTotal}}</span>
          <span>占比:</span>
          <span>{{alarmRate}}</span>
        </div>
        <div class="content-left-table pdb48 clearfix">
          <div class="content-left-table-inner">
            <Table border stripe :columns="columns1" :data="tableData" :height="tableHeight" :loading="loading" class="test"  v-if="testTabel"></Table>
            <Table border stripe :columns="columns2" :data="tableData" :height="tableHeight" v-else></Table>
          </div>
        </div>
        <div class="content-left-footer" :class="[popSelect ? 'content-left-footer-open' : 'content-left-footer-pack']">
          <div class="content-left-footer-inner mgt8">
            <Pagination :total="pageTotle" show-sizer :current="pageNo" :page-size="pageSize"  @on-change="changeList" @on-page-size-change="changeListSize"></Pagination>
          </div>
        </div>
      </div>
      <alarm-select-button v-show="!popSelect" :popButton="popButton" @selectPop="selectPop"></alarm-select-button>
      <alarm-select-list :taskId="taskId" :popSelect="popSelect"  @applyFilter="getDataList" @packUp="packUp" ></alarm-select-list>
      <alarm-detail :taskId="taskId" :taskName="taskName" :popDetail="popDetail" ref="showDetail" @feedback="feedback" @signIn="signIn"  @closeDetail="closeDetail" ></alarm-detail>
      <alarm-feedback-pop :popFeed="popFeed" @showFeedback="showFeedback" @sendFeedback="sendFeedback"></alarm-feedback-pop>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/components/plugins/HeaderNav'
import Pagination from '@/components//plugins/Pagination'
import AlarmSelectButton from './plugins/AlarmSelectButton'
import AlarmSelectList from './plugins/AlarmSelectList'
import AlarmDetail from './plugins/AlarmDetail'
import AlarmFeedbackPop from './plugins/AlarmFeedbackPop'
import {getTitleList, getDataList, getAlarmFeedback} from '@/http/services/alarm_api'
import {setReadMsg} from '@/http/services/task_api'

export default {
  name: 'AlarmList',
  components: {
    HeaderNav,
    Pagination,
    AlarmSelectButton,
    AlarmSelectList,
    AlarmDetail,
    AlarmFeedbackPop
  },
  data () {
    return {
      loading: true,
      taskId: null,
      taskName: '',
      msgCount: '',
      columns1: [], // 表格列
      columns2: [], // 表格列
      testTabel: true, // 表格列
      columnsType: [], // 表格列类型
      tableData: [], // 表格内容
      tableWidth: null, // 表格内容
      tableHeight: null, // 表格内容
      tableHeightOrg: null, // 表格内容
      pageTotle: null, // 总条数
      pageNo: 1, // 显示当前页
      pageSize: 20, // 每页显示条数
      popSelect: false,
      popDetail: false,
      popButton: true,
      alramId: '', // 预警任务ID
      alarmTotalBySelector: 0, // 结果预警量
      alarmSumTotal: 0, // 总预警量
      alarmRate: 0, // 占比
      popFeed: false,
      onerror:  `this.src="${require('../../assets/imgs/default-img.png')}"`
    }
  },
  mounted () {
    this.tableWidth = document.getElementsByClassName('content-left-header')[0].clientWidth
    this.$nextTick(() => {
      this.tableHeight = document.getElementsByClassName('content-left-table-inner')[0].clientHeight
    })
  },
  beforeUpdate () {
    if(!this.taskId){
      this.loading = false
    }
  },
  updated () {
  },
  watch: {
  },
  methods: {
    // 分页查询
    changeList (pageNo) {
      this.pageNo = pageNo
      this.getDataList()
    },
    // 分页总数改变查询
    changeListSize (pageSize) {
      this.pageSize = pageSize
      this.getDataList()
    },
    // 选择预警任务
    getTask (taskId, taskName, msgCount) {
      this.taskId = +taskId
      this.taskName = taskName
      this.msgCount = msgCount
      this.popSelect = false
      this.popDetail = false
      this.$nextTick(() => {
        this.tableWidth = document.getElementsByClassName('content-left-header')[0].clientWidth
      })
      // this.$refs.updateSelector.$emit('childMethod')
      this.getTitleList()
    },
    // 查询预警信息表头
    getTitleList () {
      getTitleList({taskId: +this.taskId}).then(res => {
        this.columns1 = []
        this.columns2 = []
        this.columnsType = []
        res.data.result.forEach((item) => {
          let temp = {}
          switch (item.type) {
            case 0:
              temp = {
                title: '',
                key: ''
              }
              break
            case 1:
              temp = {
                title: '',
                key: '',
                render: (h, params) => {
                  return h('div', [
                    h('a', {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.redirectPage(params.row[params.column.key + 'Url'])
                        }
                      }
                    }, params.row[params.column.key])
                  ])
                }
              }
              break
            case 2:
              temp = {
                title: '',
                key: '',
                render: (h, params) => {
                  return h('div', [
                    h('img', {
                      attrs: {
                        src: params.row[params.column.key + 'Src'],
                        onerror: this.onerror
                      },
                      style: {
                        maxHeight: '48px',
                        maxWidth: '300px'
                      }
                    }, params.row[params.column.key])
                  ])
                }
              }
              break
          }
          temp.title = item.fieldDesc
          temp.key = item.fieldName
          this.columns1.push(temp)
          this.columnsType.push(item.type)
        })
        let tempStatus = {
          title: '反馈状态',
          key: 'alarmStatus',
          width: 73,
          fixed: 'right'
        }
        let tempDetail = {
          title: '详情',
          key: 'detail',
          width: 96,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#2979FF',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                },
                on: {
                  click: () => {
                    this.showDetail(params.row.alarmId)
                  }
                }
              }, '详情')
            ])
          }
        }
        this.columns1.push(tempStatus)
        this.columns1.push(tempDetail)
        this.getDataList()
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询数据列表
    getDataList (selectorInput) {
      let params = {
        taskId: +this.taskId,
        selectorInput: selectorInput,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      getDataList(params).then(res => {
        this.tableData = []
        this.pageTotle = res.data.result.iTotalRecords
        res.data.result.aaData.forEach((item) => {
          let tempObj = {}
          item.values.forEach((detail, index) => {
            if (this.columnsType[index] === 1) {
              tempObj[item.fieldName[index] + 'Url'] = detail[1]
            } else if (this.columnsType[index] === 2) {
              tempObj[item.fieldName[index] + 'Src'] = detail[1]
            }
            tempObj[item.fieldName[index]] = detail[0]
          })
          tempObj['alarmStatus'] = this.filterStatus(0, item.alarmStatus)
          tempObj['alarmId'] = item.alarmId
          this.tableData.push(tempObj)
        })
        if (this.tableData.length === 0) {
          this.columns1 = this.columns1.slice(0, -2)
        }
        this.alarmTotalBySelector = res.data.result.otherData.alarmTotalBySelector
        this.alarmSumTotal = res.data.result.otherData.alarmSumTotal
        this.alarmRate = res.data.result.otherData.alarmRate
        if (this.msgCount > 0) {
          this.setReadMsg()
        }
        this.resetTable()
      }).catch(error => {
        console.log(error)
      })
    },
    // 重加载table
    resetTable () {
      this.testTabel = true
      setTimeout(() => {
        this.testTabel = false
        if (this.tableData.length !== 0) {
          let tdWidthArray = document.getElementsByClassName('ivu-table-row')[0].children
          let thWidthArray = document.getElementsByTagName('thead')[0].children[0].children
          let clientW = []
          let clientHW = []
          let clientSW = []
          let columnsType = this.columnsType
          Object.keys(tdWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientW.push(tdWidthArray[item].offsetWidth - 1)
            } else if (columnsType[index] === 2) {
              clientW.push(tdWidthArray[item].offsetWidth)
            } else {
              clientW.push(tdWidthArray[item].offsetWidth)
            }
          })
          Object.keys(thWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientHW.push(thWidthArray[item].offsetWidth - 1)
            } else if (columnsType[index] === 2) {
              clientHW.push(thWidthArray[item].offsetWidth)
            } else {
              clientHW.push(thWidthArray[item].offsetWidth)
            }
          })
          clientW.forEach((item, index) => {
            if (item > clientHW[index]) {
              clientSW.push(item)
            } else {
              clientSW.push(clientHW[index])
            }
          })
          this.columns2 = this.columns1
          clientSW.forEach((item, index) => {
            this.columns2[index].width = item
          })
        }

      }, 100)
    },
    // 消息已读接口
    setReadMsg () {
      setReadMsg({taskId: this.taskId}).then(res => {
        this.$refs.clearMsg.clearMsg(this.taskId)
      }).catch(error => {
        console.log(error)
      })
    },
    // 表格页面跳转
    redirectPage (url) {
      window.open(url)
    },
    // 展开筛选器
    selectPop () {
      this.popSelect = true
      this.tableWidth -= 200
    },
    // 收起筛选器
    packUp () {
      this.popSelect = false
      this.tableWidth += 200
    },
    // 展示详情页
    showDetail (alarmId) {
      this.alarmId = alarmId
      this.popDetail = true
      this.$refs.showDetail.$emit('showDetail', alarmId)
    },
    // 收起详情
    closeDetail () {
      this.popDetail = false
    },
    // 反馈信息弹窗
    feedback () {
      this.popFeed = true
    },
    // 取消反馈
    showFeedback () {
      this.popFeed = false
    },
    // 提交反馈
    sendFeedback (feedback) {
      let params = {
        taskId: +this.taskId,
        alarmId: this.alarmId,
        feedbackInfo: feedback
      }
      getAlarmFeedback(params).then(res => {
        this.popFeed = false
        this.$refs.showDetail.$emit('showDetail', this.alarmId)
        this.getTitleList({taskId: +this.taskId})
      }).catch(error => {
        console.log(error)
      })
    },
    // 已签收
    signIn () {
      this.popDetail = false
      this.getTitleList({taskId: +this.taskId})
    }
  }
}
</script>
