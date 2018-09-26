<template>
  <div class="page-select-info" v-show="popSelect">
    <div  class="content-right"  >
      <p>预警消息筛选</p>
      <div class="select-item" v-for="(item, index) in selectShow" :key = 'index'>
        <div class="item-box item-date-time" v-if="item.flag === 3">
          <div class="item-title">{{item.fieldDesc}}</div>
          <div class="item-date-box">
            <div class="item-date-title">开始</div>
            <el-date-picker
              class="date-con"
              v-model="item.dataValue[0]"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="12:00:00">
            </el-date-picker>
          </div>
          <div class="item-date-box">
            <div class="item-date-title">结束</div>
            <el-date-picker
              class="date-con"
              v-model="item.dataValue[1]"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-MM-dd hh:mm:ss"
              default-time="12:00:00">
            </el-date-picker>
          </div>
        </div>
        <div class="item-box" v-if="item.flag === 20">
          <div class="item-title">{{item.fieldDesc}}</div>
          <Input v-model="item.stringValue" class="item-input" placeholder="请输入内容"></Input>
        </div>
        <div class="item-box" v-if="item.flag === 210">
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
        <div class="item-box" v-if="item.flag === 211">
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
import {getSelectorList} from '@/http/services/alarm_api'
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
      selectorInput: []
    }
  },
  props: {
    taskId: Number,
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
      console.log(this.taskId)
      getSelectorList({taskId: this.taskId}).then(res => {
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
        res.data.result.forEach((item, index) => {
          temp = JSON.parse(JSON.stringify(temp))
          this.selectShow.push(temp)
          if (item.dataType === 2 && item.inputType === 0) {
            this.selectShow[index].flag = 20 // 表示文本
          } else if (item.dataType === 2 && item.inputType === 1 && item.selectType === 0) {
            this.selectShow[index].flag = 210 // 单选字典
            this.selectShow[index].dicId = item.dicId
            this.selectShow[index].selectType = item.selectType
          } else if (item.dataType === 2 && item.inputType === 1 && item.selectType === 1) {
            this.selectShow[index].flag = 211 // 多选字典
            this.selectShow[index].dicId = item.dicId
            this.selectShow[index].selectType = item.selectType
          } else if (item.dataType === 3) {
            this.selectShow[index].flag = 3 // 日期
          }
          this.selectShow[index].fieldName = item.fieldName
          this.selectShow[index].fieldDesc = item.fieldDesc
          this.selectShow[index].dataType = item.dataType
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
      this.selectorInput = []
      this.selectShow.forEach((item) => {
        let temp = {
          fieldName: '',
          fieldValue: '',
          dataType: null,
          selectType: null,
          operateSymbol: 0
        }
        if (item.flag === 20 || item.flag === 210) {
          if (item.stringValue.length > 0) {
            temp.fieldName = item.fieldName
            temp.fieldValue = item.stringValue
            temp.dataType = item.dataType
            temp.selectType = item.selectType
            temp.operateSymbol = item.operateSymbol
            this.selectorInput.push(temp)
          }
        } else if (item.flag === 211) {
          if (item.stringValue.length > 0) {
            temp.fieldName = item.fieldName
            temp.fieldValue = item.stringValue.join(',')
            temp.dataType = item.dataType
            temp.selectType = item.selectType
            temp.operateSymbol = item.operateSymbol
            this.selectorInput.push(temp)
          }
        } else {
          if (item.flag === 3 && item.dataValue.length > 0) {
            temp.fieldName = item.fieldName
            if (item.dataValue[0] === undefined) {
              item.dataValue[0] = -1
            }
            temp.fieldValue = item.dataValue.join(',')
            temp.dataType = item.dataType
            temp.selectType = item.selectType
            temp.operateSymbol = item.operateSymbol
            this.selectorInput.push(temp)
          }
        }
      })
      this.$emit('applyFilter', this.selectorInput)
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
