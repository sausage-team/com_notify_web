<template lang='html'>
  <div class="filter-option">
    <span>日期筛选</span>
    <el-date-picker
      v-model="filterTime"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <span>类型筛选</span>
    <el-select v-model="filterSign" :placeholder="typeOptions.label">
      <el-option
        v-for="item in typeOptions.data"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
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
  }
}

</script>
<style lang='scss'>
@import "@/assets/sass/_color.scss";
.filter-option {
  > span {
      margin-right: 4px;
      color: rgba($label-title-color, 0.34);
  }
  .el-input__inner {
      padding-left: 0;
      padding-right: 0;
      color: rgba($label-title-color, 0.72);
      background-color: $main-bg-color;
  }
  .el-date-editor {
      margin-right: 24px;
      &.el-input {
          width: 97px;
      }
      .el-input__prefix,
      .el-input__suffix {
          display: none;
      }
  }
  .el-select {
      .el-input__inner {
          width: 117px;
      }
      .el-input__suffix {
          right: 0;
          top: 3px;
      }
  }
}
</style>
