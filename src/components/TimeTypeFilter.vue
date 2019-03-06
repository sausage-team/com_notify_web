<template>
  <div class="no-filter">
    <div class="filter-option">
      <span>日期筛选</span>
      <el-date-picker
        v-model="filterTime"
        type="datetimerange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeFilter">
      </el-date-picker>
      <span>{{typeOptions.label}}</span>
      <el-select
        v-model="filterSign"
        :placeholder="typeOptions.label"
        clearable
        @change="changeFilter">
        <el-option
          v-for="item in typeOptions.data"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
      filterSign: '',
      filterStatus1: '',
      filterstatus2: ''
    }
  },
  methods: {
    changeFilter () {
      const res = {}
      if (this.filterTime && this.filterTime.length > 0) {
        res.date = [this.filterTime[0].getTime(), this.filterTime[1].getTime()]
      }
      res.type = this.filterSign
      res.feedback_status = this.filterStatus1
      res.ack_status = this.filterstatus2
      this.$emit('changeSearch', res)
    }
  }
}

</script>
