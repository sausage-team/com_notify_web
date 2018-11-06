<template>
  <Drawer class="page-select-drawer" v-model="popSelect">
    <div class="page-select-info">
      <div class="content-header">
        <span>预警消息筛选</span>
        <i @click="packUp"></i>
      </div>
      <div  class="content-right"  >
        <div class="select-item" v-show="filterSchema && filterSchema.length > 0" v-for="(item, index) in filterSchema" :key = 'index'>
          <div class="item-box item-date-time" v-if="item.display_type === 2">
            <div class="item-title">{{item.alias || item.name}}</div>
            <div class="item-date-box">
              <DatePicker
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                transfer
                :ref="item.id"
                v-model="queryFilter[item.id]"
                placeholder="选择开始日期和结束日期">
              </DatePicker>
            </div>
          </div>
          <div class="item-box" v-if="item.display_type === 1">
            <div class="item-title">{{item.alias || item.name}}</div>
            <Input :maxlength="16" v-model="queryFilter[item.id]" :ref="item.id" class="item-input" placeholder="请输入内容"></Input>
          </div>
          <div class="item-box" v-if="item.flag === 110">
            <div class="item-title">{{item.alias || item.name}}</div>
            <el-select v-model="queryFilter[item.id]" placeholder="请选择"  class="item-select" @focus="getDictInfo(item.dicId)">
              <el-option
                v-for="item in dicList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="item-box" v-if="item.display_type === 111">
            <div class="item-title">{{item.alias || item.name}}</div>
            <el-select v-model="queryFilter[item.id]" placeholder="请选择" multiple class="item-select-mulitype" @focus="getDictInfo(item.dicId)">
              <el-option
                v-for="item in dicList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="select-empty" v-show="!filterSchema || filterSchema.length === 0">
          <span>暂无筛选条件</span>
        </div>
      </div>
      <div class="select-operate">
        <Button type="primary" class="select-operate-apply" @click="applyFilter">应用筛选</Button>
        <Button type="text" class="select-operate-origin" @click="clearAll">重置</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import {getDictInfo} from '@/http/services/dic_api'
import service from '@/http/services'

export default {
  name: 'AlarmSelectList',
  data () {
    return {
      dicList: [],
      selectShow: [],
      filterSchema: []
    }
  },
  props: {
    taskId: String,
    popSelect: Boolean,
    queryFilter: Object,
    schema: Array
  },
  watch: {
    popSelect (val) {
      if (val === true) {
        this.getSelectorList()
      }
    }
  },
  mounted () {
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
      service.alarmService.getSelector({taskId: this.taskId}).then(res => {
        if (res.status === 0) {
          this.filterSchema = res.data
          this.filterSchema.forEach(item => {
            if (!this.queryFilter[item.id]) {
              if (item.type === 2) {
                this.queryFilter[item.id] = []
              } else {
                this.queryFilter[item.id] = ''
              }
            }
          })
        }
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
      this.$emit('applyFilter', {
        schema: this.filterSchema,
        value: this.queryFilter
      })
    },
    // 还原
    clearAll () {
      this.filterSchema.forEach(item => {
        this.$refs[item.id][0].handleClear()
        if (item.display_type === 2) {
          this.queryFilter[item.id] = []
        } else {
          this.queryFilter[item.id] = ''
        }
        this.$forceUpdate()
      })
    },
    // 收起筛选器
    packUp () {
      this.$emit('packUp', false)
    }
  }
}
</script>
