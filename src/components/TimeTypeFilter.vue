<template>
  <div class="no-filter">
    <div class="filter-option">
      <div class="filter-box">
        <span>{{typeOptions.label}}</span>
        <el-input
          placeholder="请输入内容"
          @clear="changeFilter"
          @keyup.native="changeSearch"
          clearable
          v-model="task_name">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <span>反馈</span>
          <el-select
            v-model="filterStatus1"
            placeholder="请选择反馈状态"
            clearable
            @change="changeFilter">
            <el-option
              v-for="item in CONSTANT.feedTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>签收</span>
          <el-select
            v-model="filterstatus2"
            clearable
            placeholder="请选择签收状态"
            @change="changeFilter">
            <el-option
              v-for="item in CONSTANT.ackTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="filter-box">
        <span>日期筛选</span>
        <el-date-picker
          v-model="filterTime"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeFilter">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeOptions: Object
  },
  data () {
    return {
      filterTime: '',
      task_name: '',
      filterStatus1: '',
      filterstatus2: ''
    }
  },
  methods: {
    changeSearch (e) {
      if (e.keyCode === 13) {
        this.changeFilter()
      }
    },
    changeFilter () {
      const res = {}
      if (this.filterTime && this.filterTime.length > 0) {
        res.date = [this.filterTime[0].getTime(), this.filterTime[1].getTime()]
      }
      res.task_name = this.task_name
      res.feedback_status = this.filterStatus1
      res.ack_status = this.filterstatus2
      this.$emit('changeSearch', res)
    }
  }
}

</script>
