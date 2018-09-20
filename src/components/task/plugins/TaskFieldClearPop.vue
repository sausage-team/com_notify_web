<template>
  <div class="w370 h152  pdl24 pdt14 box-center bg-color-white box-shadow-box pop-window" v-show="clearFieldPop">
    <div class="h48 lh48 fs14 clearfix pop-title">
      <span class="fl fw h20 lh20">清空字段</span>
      <span class="fr h20 lh20 mgr26 pointer" @click="cancelFieldPop">X</span>
    </div>
    <div class="h20 lh20 fs12 pdl8 mgb30 clearfix">
      <div class="w296 h20 lh20 fl fs12">是否清空{{title}}全部字段？</div>
    </div>
    <div class=" clearfix">
      <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw bg-color-182B4D btn pointer" @click="cancelFieldPop">取消</div>
      <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw btn pointer" @click="clearAllField">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskFieldClearPop',
  data () {
    return {
      title: ''
    }
  },
  props: {
    clearFieldPop: Boolean,
    clearFlag: Number
  },
  watch: {
    clearFlag (val) {
      switch (val) {
        case 1:
          this.title = '预警列表'
          break
        case 2:
          this.title = '筛选器'
          break
        case 3:
          this.title = '详情页面'
          break
      }
    }
  },
  methods: {
    // 清空全部字段
    clearAllField () {
      this.$emit('clearAllField')
    },
    // 取消弹窗
    cancelFieldPop () {
      this.$emit('cancelFieldPop')
    }
  }
}
</script>

<style lang="scss" scoped>
  .pop-window{
    z-index: 6;
    border-radius: 8px;
    .pop-input{
      input{
        outline: none;
        border: none;
        border-bottom: 1px solid rgba(41, 121, 255, 0.5);}
    }
    .btn{
      border-radius: 4px;
    }
  }
  .ivu-input-wrapper{
    width: 306px;
    height: 93px;
  }
</style>
