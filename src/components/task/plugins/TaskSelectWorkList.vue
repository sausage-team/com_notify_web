<template>
  <div class="step-wrapper" v-show="stepCurrent == 0">
    <div class="step step-1" >
      <div class="step1-left">
        <div class="left-title">
          <div class="title-con">选择数据表</div>
        </div>
        <ul class="left-con">
          <li :title="item.workTblDesc" :class="[index === workListIndex ? 'li-select' : '']"  v-for="(item, index) in workList" :key = 'index' @click="getWorkPreview(item.workTblName, item.workTblDesc, index, true)">{{item.workTblDesc}}</li>
        </ul>
      </div>
      <div class="step1-right">
        <div class="step-right-inner">
          <div class="step-right-table"  :class="[showCdtList ? 'step-right-table-unopen' : 'step-right-table-open']">
            <div class="step-right-title">
              <div class="title1">数据预览</div>
              <div class="title2">
                <i @click="getWorkPreview()"></i> 
              </div>
              <div class="title3">显示最新 {{lastRecords}} 条数据，共 {{totalRecords}} 条数据 </div>
              <div class="title4"></div>
              <div class="title5">最近更新时间：{{lastUpdateDate}}</div>
            </div>
            <div class="step-right-con">
              <div class="scroll-inner">
                <Table border stripe :columns="columns1" :data="tableData" :height="tableHeight" :loading="loading" class="test"  v-if="testTabel"></Table>
                <Table border stripe :columns="columns2" :data="tableData" :height="tableHeight" v-else></Table>
              </div>
            </div>
          </div>
          <div class="step-right-search">
            <div class="step-right-footer">
              <div class="foot-title">条件筛选</div>
              <div class="title-btn" @click="showCdtList = !showCdtList">
                <i class="down" v-if="showCdtList"></i>
                <i class="up" v-else></i>
              </div>
            </div>
            <div class="foot-con" v-show="showCdtList">
              <div class="foot-body">
                <div class="foot-b-title">
                  <div class="foot-b-t-title">满足下列</div>
                  <div class="foot-b-select">
                    <el-select v-model="filterType" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <ul class="step-ul">
                  <li v-for="(item, index) in selectList" :key = 'index'>
                    <div class="item1">
                      <el-select v-model="item.columns.fieldName" placeholder="请选择" @change="changeCondition(item.columns.fieldName, index)">
                        <el-option
                          v-for="i in item.fieldOption"
                          :key="i.fieldName"
                          :label="i.fieldDesc"
                          :value="i.fieldName">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="item2">
                      <el-select v-model="item.columns.operateSymbol" placeholder="请选择">
                        <el-option
                          v-for="i in item.operateSymbolOpt"
                          :key="i.value"
                          :label="i.label"
                          :value="i.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="item3" v-if="item.columns.fieldType == 3 && item.columns.operateSymbol == 0">
                      <el-date-picker
                        v-model="item.fieldTypeDate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </div>
                    <div class="item4"
                         v-else-if="
                       item.columns.fieldType == 3 && (item.columns.operateSymbol == 1 || item.columns.operateSymbol == 2) ||
                       item.columns.fieldType == 2 && (item.columns.operateSymbol == 4 || item.columns.operateSymbol == 5)">
                    </div>
                    <div class="item5" v-else>
                      <input v-model="item.columns.fieldValue" placeholder="请输入内容" class="input-reset">
                    </div>
                    <div class="item6" @click="addSelectList" v-show="index == 0">
                      <i></i>
                    </div>
                    <div class="item7" @click="minSelectList(index)" v-show="index != 0">
                      <i></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Button  type="primary"class="next-btn" @click="nextStep">下一步</Button>
  </div>
</template>

<script>
import {getWorkList, getWorkPreview, saveWorkList, updateWorkList, showCondition} from '@/http/services/task_api'

export default {
  name: 'TaskSelectWorkList',
  data () {
    return {
      loading: true,
      taskName: this.$route.query.taskName, // 任务名称
      taskTypeId: this.$route.query.taskTypeId, // 任务类型ID
      taskDescribe: this.$route.query.taskDescribe, // 任务描述
      newTaskId: null, // 任务名称
      workList: [],
      workListIndex: 0,
      workTblName: '', // 工作表名称
      workTblDesc: '', // 工作表名称
      lastRecords: '',
      totalRecords: '',
      lastUpdateDate: '',
      columns1: [], // 工作表预览
      columns2: [], // 表格列
      testTabel: true, // 表格列
      tableWidth: null,
      tableHeight: null,
      tableHeightOrg: null,
      tableData: [], // 工作表预览
      fieldOption: [], // 任务字段
      fieldString: [], // 工作表表头字段文本格式
      tempColumn: [], // 临时筛选条件
      options: [{ // 筛选条件
        value: 0,
        label: '全部条件'
      }, {
        value: 1,
        label: '任意条件'
      }],
      showCdtList: true, // 筛选条件显示隐藏
      filterType: 0, // 筛选条件
      selectList: [{ // 筛选条件
        fieldOption: [],
        operateSymbolOpt: [],
        fieldTypeDate: [],
        columns: {
          fieldDesc: '',
          fieldType: '',
          fieldValue: '',
          operateSymbol: ''
        }
      }],
      operateSymbolString: [{
        value: 0,
        label: '等于'
      }, {
        value: 1,
        label: '不等于'
      }, {
        value: 2,
        label: '包含'
      }, {
        value: 3,
        label: '不包含'
      }, {
        value: 4,
        label: '为空'
      }, {
        value: 5,
        label: '不为空'
      }],
      operateSymbolDate: [{
        value: 0,
        label: '选择日期范围'
      }, {
        value: 1,
        label: '为空'
      }, {
        value: 2,
        label: '不为空'
      }]
    }
  },
  props: {
    stepCurrent: Number,
    taskId: Number
  },
  watch: {
    stepCurrent (val) {
      if (val === 0) {
        if (this.taskName) {
          this.getWorkList()
        } else {
          this.showCondition()
        }
      }
    },
    showCdtList (val) {
      this.updateTableHeight()
    }
  },
  created () {
    if (this.taskName) {
      this.getWorkList()
    } else {
      this.showCondition()
    }
  },
  mounted () {
    this.updateTableHeight()
  },
  methods: {
    // 下一步
    nextStep () {
      if (this.taskId) {
        this.updateWorkList()
      } else {
        this.saveWorkList()
      }
    },
    // 查询工作表
    showCondition () {
      showCondition({taskId: this.taskId}).then(res => {
        this.filterType = res.data.result.alarmCondition.filterType
        this.tempColumn = res.data.result.alarmCondition.columns

        this.getWorkList(res.data.result.workTalName)
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询数据表列表
    getWorkList (workTblName) {
      getWorkList('').then(res => {
        this.workList = res.data.result
        if (workTblName) {
          this.workTblName = workTblName
          this.workList.forEach((item, index) => {
            if (item.workTblName === this.workTblName) {
              this.workTblDesc = item.workTblDesc
              this.getWorkPreview(this.workTblName, this.workTblDesc, index)
            }
          })
        } else {
          this.workTblName = this.workList[0].workTblName
          this.workTblDesc = this.workList[0].workTblDesc
          this.getWorkPreview(this.workTblName, this.workTblDesc, 0)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询数据表预览
    getWorkPreview (workTblName, workTblDesc, index, isSelect) {
      if(isSelect && !this.taskName){
        this.$message({
          type: 'info',
          message: '编辑时不允许修改数据表'
        })
        return
      }
      this.workTblName = workTblName ? workTblName : this.workTblName
      this.workTblDesc = workTblDesc ? workTblDesc : this.workTblDesc
      this.workListIndex = index !== undefined ? index : this.workListIndex
      let params = {
        workTblName: this.workTblName
      }
      getWorkPreview(params).then(res => {
        this.lastRecords = res.data.result.lastRecords
        this.totalRecords = res.data.result.totalRecords
        this.lastUpdateDate = res.data.result.lastUpdateDate
        this.columns1 = []
        this.fieldString = []
        this.fieldOption = []
        this.tableData = []
        // tableHeader数据
        res.data.result.colmuns.forEach((item) => {
          let temp = {
            title: '',
            key: '',
            minWidth: 100
          }
          let tempOption = {
            fieldName: '', // key
            fieldDesc: '', // title
            dataType: 0, // 字段类型
            type: 0, //  // 链接
            linkType: 0, // 链接
            showText: '', // 链接
            inputType: 0, // 字典
            dicId: '', // 字典
            selectType: '', // 字典
            showType: '' // 字典
          }
          temp.key = item.column
          temp.title = item.alias
          this.columns1.push(temp)
          // 字段处理
          tempOption.fieldName = item.column
          tempOption.fieldDesc = item.alias
          tempOption.dataType = item.type === 'string' ? 2 : item.type === 'date' ? 3 : 1
          this.fieldOption.push(tempOption)
          if (item.type === 'string') {
            this.fieldString.push(tempOption)
          }
        })
        // 筛选条件
        this.selectList[0].fieldOption = this.fieldOption
        res.data.result.datas.forEach((item) => {
          let tempObj = {}
          item.forEach((i, index) => {
            tempObj[this.columns1[index].key] = i
          })
          this.tableData.push(tempObj)
        })
        // 编辑任务-筛选条件显示
        if (this.tempColumn === undefined) {
          this.tempColumn = []
        }
        this.tempColumn.forEach((item, index) => {
          if (index !== 0) {
            this.addSelectList()
          }
          this.changeCondition(item.fieldName, index)
          this.selectList[index].columns = item
          this.selectList[index].fieldTypeDate = item.fieldValue ? item.fieldValue.split(',') : []
        })
        this.resetTable()
      }).catch(error => {
        console.log(error)
      })
    },
    // 重加载table
    resetTable () {
      this.testTabel = true
      setTimeout(() => {
        if (this.tableData.length !== 0) {
          let tdWidthArray = document.getElementsByClassName('ivu-table-row')[0].children
          let thWidthArray = document.getElementsByTagName('thead')[0].children[0].children
          let clientW = []
          let clientHW = []
          let clientSW = []
          Object.keys(tdWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientW.push(tdWidthArray[item].offsetWidth - 1)
            } else {
              clientW.push(tdWidthArray[item].offsetWidth)
            }
          })
          Object.keys(thWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientHW.push(thWidthArray[item].offsetWidth - 1)
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
        this.testTabel = false
      }, 100)
    },
    // 计算表格高度
    updateTableHeight () {
      this.$nextTick(() => {
        this.tableHeight = document.getElementsByClassName('scroll-inner')[0].clientHeight
      })
    },
    // 选择条件
    changeCondition (fieldName, index) {
      this.fieldOption.forEach((item) => {
        if (item.fieldName === fieldName) {
          switch (item.dataType) {
            case 2: // string
              this.selectList[index].columns.fieldType = 2
              this.selectList[index].operateSymbolOpt = this.operateSymbolString
              break
            case 3: // date
              this.selectList[index].columns.fieldType = 3
              this.selectList[index].operateSymbolOpt = this.operateSymbolDate
              break
          }
        }
      })
      this.selectList[index].fieldTypeDate = []
      this.selectList[index].columns.operateSymbol = 0
      this.selectList[index].columns.fieldValue = ''
    },
    // 新增筛选条件
    addSelectList () {
      this.selectList.push({
        fieldOption: JSON.parse(JSON.stringify(this.fieldOption)),
        operateSymbolOpt: [],
        fieldTypeDate: [],
        columns: {
          fieldName: '',
          fieldType: '',
          fieldValue: '',
          operateSymbol: ''
        }
      })
    },
    // 减少筛选条件
    minSelectList (index) {
      this.selectList.splice(index, 1)
    },
    // 保存工作表
    saveWorkList () {
      let params = {
        taskName: this.taskName,
        taskTypeId: this.taskTypeId,
        taskDescribe: this.taskDescribe,
        workTblName: this.workTblName,
        workTblDesc: this.workTblDesc,
        alarmCondition: {
          columns: [],
          filterType: this.filterType
        }
      }
      params = this.handleData(params)
      saveWorkList(params).then(res => {
        this.newTaskId = res.data.result.taskId
        this.saveWorkListSucc()
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存编辑工作表
    updateWorkList () {
      let params = {
        taskId: this.taskId,
        workTblDesc: this.workTblDesc,
        alarmCondition: {
          columns: [],
          filterType: this.filterType
        }
      }
      params = this.handleData(params)
      updateWorkList(params).then(res => {
        this.newTaskId = res.data.result.taskId
        this.saveWorkListSucc()
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存工作表
    saveWorkListSucc () {
      this.selectList = [{
        fieldOption: JSON.parse(JSON.stringify(this.fieldOption)),
        operateSymbolOpt: [],
        fieldTypeDate: [],
        columns: {
          fieldName: '',
          fieldType: '',
          fieldValue: '',
          operateSymbol: ''
        }
      }]
      this.$emit('saveWorkListSucc', 1, this.newTaskId, this.fieldOption, this.fieldString)
    },
    // 处理筛选条件
    handleData (params) {
      this.selectList.forEach((item) => {
        if (item.columns.fieldName === undefined && item.columns.fieldType === '' && item.columns.operateSymbol === '') {
          params.alarmCondition.columns = []
        } else {
          if (item.fieldTypeDate.length !== 0) {
            item.columns.fieldValue = item.fieldTypeDate.join(',')
          }
          params.alarmCondition.columns.push(item.columns)
        }
      })
      return params
    }
  }
}
</script>

