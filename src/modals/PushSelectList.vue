<template>
  <Drawer class="page-select-drawer" v-model="popSelect">
    <div class="page-select-info">
      <div class="content-header">
        <span>预警消息筛选</span>
        <i @click="packUp"></i>
      </div>
      <div  class="content-right"  >
        <div class="select-item" v-show="filterSchema && filterSchema.length > 0" v-for="(item, index) in filterSchema" :key = 'index'>
          <div class="item-box item-date-time" v-if="item.origin_type === 2">
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
          <div class="item-box" v-if="item.origin_type === 0">
            <div class="item-title">{{item.alias || item.name}}</div>
            <div class="input-box" v-if="item.origin_type === 0">
              <Input class="item-input" v-model="queryFilter[item.id].min_value" placeholder="请输入最小值"></Input>
              <Input class="item-input" v-model="queryFilter[item.id].max_value" placeholder="请输入最大值"></Input>
            </div>
          </div>
          <div class="item-box" v-if="item.origin_type === 1">
            <div class="item-title">{{item.alias || item.name}}</div>
            <Input :maxlength="16" v-if="item.origin_type !== 0" v-model="queryFilter[item.id]" :ref="item.id" class="item-input" placeholder="请输入内容"></Input>
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
      if (val) {
        this.getSelectorList()
      } else {
        this.packUp()
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
      this.alarmService.getSelector({taskId: this.taskId}).then(res => {
        if (res.status === 0) {
          this.filterSchema = res.data
          this.filterSchema.forEach(item => {
            if (item.origin_type === 2) {
              this.queryFilter[item.id] = []
            } else if (item.origin_type === 0) {
              this.queryFilter[item.id] = {
                max_value: '',
                min_value: ''
              }
            } else {
              this.queryFilter[item.id] = ''
            }
          })
        }
      })
    },
    // 字典详情
    getDictInfo (id) {
      this.dicService.getDictInfo({dicId: id}).then(res => {
        this.dicList = res.data.result
      }).catch(error => {
        console.log(error)
      })
    },
    // 应用筛选
    applyFilter () {
      const value = {}
      this.filterSchema.forEach(item => {
        console.log(item)
        if (item.origin_type === 2) {
          if (this.queryFilter[item.id] && this.queryFilter[item.id].length > 0) {
            value[item.id] = [
              ((this.queryFilter[item.id][0]) ? (new Date(this.queryFilter[item.id][0]).getTime()) : (null)),
              ((this.queryFilter[item.id][1]) ? (new Date(this.queryFilter[item.id][1]).getTime()) : (null))
            ]
          } else {
            value[item.id] = []
          }
        } else if (item.origin_type === 0) {
          value[item.id] = {
            max_value: this.queryFilter[item.id].max_value ? (Number(this.queryFilter[item.id].max_value) || null) : (null),
            min_value: this.queryFilter[item.id].min_value ? (Number(this.queryFilter[item.id].min_value) || null) : (null)
          }
        } else {
          value[item.id] = this.queryFilter[item.id]
        }
      })
      this.$emit('applyFilter', {
        schema: this.filterSchema,
        value: value
      })
    },
    // 还原
    clearAll () {
      this.filterSchema.forEach(item => {
        this.$refs[item.id][0].handleClear()
        if (item.display_type === 2) {
          this.queryFilter[item.id] = []
        } else {
          if (item.origin_type === 0) {
            this.queryFilter[item.id] = {
              max_value: '',
              min_value: ''
            }
          } else {
            this.queryFilter[item.id] = ''
          }
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
