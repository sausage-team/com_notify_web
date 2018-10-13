<template>
  <div class="page-select-info" v-show="popSelect">
    <div  class="content-right"  >
      <p>预警消息筛选</p>
      <div class="select-item" v-for="(item, index) in selectShow" :key = 'index'>
        <div class="item-box item-date-time" v-if="item.flag === 2">
          <div class="item-title">{{item.fieldDesc}}</div>
          <div class="item-date-box">
            <div class="item-date-title">开始</div>
            <!-- <el-date-picker
              class="date-con"
              v-model="item.dataValue[0]"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="12:00:00">
            </el-date-picker> -->
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期">
            </DatePicker>
          </div>
          <div class="item-date-box">
            <div class="item-date-title">结束</div>
            <DatePicker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择日期">
            </DatePicker>
          </div>
        </div>
        <div class="item-box" v-if="item.flag === 10">
          <div class="item-title">{{item.fieldDesc}}</div>
          <Input v-model="item.stringValue" class="item-input" placeholder="请输入内容"></Input>
        </div>
        <div class="item-box" v-if="item.flag === 110">
          <div class="item-title">{{item.fieldDesc}}</div>
          <el-select v-model="item.stringValue" placeholder="请选择"  class="item-select" @focus="getDictInfo(item.dicId)">
            <el-option
              v-for="item in dicList"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="item-box" v-if="item.flag === 111">
          <div class="item-title">{{item.fieldDesc}}</div>
          <el-select v-model="item.stringValue" placeholder="请选择" multiple class="item-select-mulitype" @focus="getDictInfo(item.dicId)">
            <el-option
              v-for="item in dicList"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="select-operate">
      <div class="select-operate-pack " @click="packUp">收起</div>
      <div class="select-operate-icon">
        <i></i>
      </div>
      <Button type="primary" class="select-operate-apply" @click="applyFilter">应用筛选</Button>
      <Button type="text" class="select-operate-origin" @click="clearAll">还原</Button>
    </div>
  </div>
</template>

<script>
import {getSelector} from '@/http/services/alarm_api'
import {getDictInfo} from '@/http/services/dic_api'

export default {
  name: 'AlarmSelectList',
  data () {
    return {
      input: '',
      dicList: [],
      value1: '',
      model1: '',
      model2: '',
      selectShow: [],
      queryFilter: {}
      // selectorInput: []
    }
  },
  props: {
    taskId: String,
    popSelect: Boolean
  },
  watch: {
    popSelect (val) {
      if (val === true) {
        this.getSelectorList()
      }
    }
  },
  mounted () {
    // this.$nextTick(function () {
    //   this.$on('childMethod', function () {
    //     setTimeout(() => {
    //       this.getSelectorList()
    //     }, 0)
    //   })
    // })
  },
  methods: {
    // 预警列表
    getSelectorList () {
      if (!this.taskId) {
        this.$message({
          type: 'info',
          message: '暂无数据'
        })
        return
      }
      getSelector({taskId: this.taskId}).then(res => {
        let temp = {
          flag: '', // 筛选器类型
          stringValue: '',
          dataValue: [],
          dicId: '',
          fieldName: '',
          fieldDesc: '',
          dataType: '',
          selectType: 0,
          operateSymbol: 0
        }
        this.selectShow = []
        res.data.data.forEach((item, index) => {
          temp = JSON.parse(JSON.stringify(temp))
          this.selectShow.push(temp)
          // if (item.dataType === 2 && item.inputType === 0) {
          //   this.selectShow[index].flag = 20 // 表示文本
          // } else if (item.dataType === 2 && item.inputType === 1 && item.selectType === 0) {
          //   this.selectShow[index].flag = 210 // 单选字典
          //   this.selectShow[index].dicId = item.dicId
          //   this.selectShow[index].selectType = item.selectType
          // } else if (item.dataType === 2 && item.inputType === 1 && item.selectType === 1) {
          //   this.selectShow[index].flag = 211 // 多选字典
          //   this.selectShow[index].dicId = item.dicId
          //   this.selectShow[index].selectType = item.selectType
          // } else if (item.dataType === 3) {
          //   this.selectShow[index].flag = 3 // 日期
          // }
          if (item.origin_type === 0 || item.origin_type === 1) {
            this.selectShow[index].flag = 10 // 表示数值或文本
          } else if (item.origin_type === 2) {
            this.selectShow[index].flag = 2 // 日期
          }
          this.selectShow[index].fieldName = item.id
          this.selectShow[index].fieldDesc = item.alias ? item.alias : item.name
          this.selectShow[index].dataType = item.origin_type
        })
        console.log(this.selectShow)
      }).catch(error => {
        console.log(error)
      })
    },
    // 字典详情
    getDictInfo (id) {
      getDictInfo({dicId: id}).then(res => {
        this.dicList = res.data.result
      }).catch(error => {
        console.log(error)
      })
    },
    // 应用筛选
    applyFilter () {
      // this.selectorInput = []
      this.queryFilter = {}
      this.selectShow.forEach((item) => {
        // let temp = {
        //   fieldName: '',
        //   fieldValue: '',
        //   dataType: null,
        //   selectType: null,
        //   operateSymbol: 0
        // }
        let filter = {}
        if (item.flag === 10 || item.flag === 110) {
          if (item.stringValue.length > 0) {
            // temp.fieldName = item.fieldName
            // temp.fieldValue = item.stringValue
            // temp.dataType = item.dataType
            // temp.selectType = item.selectType
            // temp.operateSymbol = item.operateSymbol
            // this.selectorInput.push(temp)
            filter[item.fieldName] = item.stringValue
          }
        } else if (item.flag === 111) {
          if (item.stringValue.length > 0) {
            // temp.fieldName = item.fieldName
            // temp.fieldValue = item.stringValue.join(',')
            // temp.dataType = item.dataType
            // temp.selectType = item.selectType
            // temp.operateSymbol = item.operateSymbol
            // this.selectorInput.push(temp)
            filter[item.fieldName] = item.stringValue.join(',')
          }
        } else {
          if (item.flag === 2 && item.dataValue.length > 0) {
            // temp.fieldName = item.fieldName
            // if (item.dataValue[0] === undefined) {
            //   item.dataValue[0] = -1
            // }
            // temp.fieldValue = item.dataValue.join(',')
            // temp.dataType = item.dataType
            // temp.selectType = item.selectType
            // temp.operateSymbol = item.operateSymbol
            // this.selectorInput.push(temp)
          }
        }
        this.queryFilter = filter
      })
      // this.$emit('applyFilter', this.selectorInput)
      this.$emit('applyFilter', this.queryFilter)
    },
    // 还原
    clearAll () {
      this.selectShow.forEach((item) => {
        item.stringValue = []
        item.dataValue = []
      })
    },
    // 收起筛选器
    packUp () {
      this.$emit('packUp', false)
    }
  }
}
</script>
