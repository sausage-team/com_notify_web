<template lang='html'>
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
        @change="changeFilter">
        <el-option
          v-for="item in typeOptions.data"
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
      filterSign: ''
    }
  },
  methods: {
    changeFilter () {
      const res = {}
      if (this.filterTime && this.filterTime.length > 0) {
        res.date = [this.filterTime[0].getTime(), this.filterTime[1].getTime()]
      }
      res.type = this.filterSign
      this.$emit('changeSearch', res)
    }
  }
}

</script>
