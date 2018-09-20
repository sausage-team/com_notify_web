<template>
  <div class="pop-bg task-pop" v-show="linkPop">
    <div class="w370 h232  pdl24 pdt8  bg-color-white box-shadow-box pop-window ">
      <div class="h32 lh32 mgb18 fs14  clearfix pop-title">
        <div class="fl fw ">设置链接</div>
        <div class="fr  mgr26 pointer" @click="cancelLinkPop">
          <img class="w12 h12" src="@/assets/imgs/close.png" alt="">
        </div>
      </div>
      <div class="h26 lh26 fs12 pdl8 mgb16 clearfix">
        <el-radio v-model="linkType" label="0" class="h24 lh24 pdt6 pdr8 fl fs12">直接显示链接地址</el-radio>
      </div>
      <div class="h26 lh26 fs12 pdl8 mgb16 clearfix">
        <el-radio v-model="linkType" label="1" class="h24 lh24 pdt6 pdr8 fl fs12">使用统一名称显示</el-radio>
        <div class="fl w182 h26 pop-input"><input class="w182 h26 " type="text" v-model="showText1"></div>
      </div>
      <div class="h26 lh26 fs12 pdl8 mgb26 clearfix">
        <el-radio v-model="linkType" label="2" class="h24 lh24 pdt6 pdr8 fl fs12">使用其他字段作为名称显示</el-radio>
        <div class="fl w134 h26 pop-input ">
          <el-select v-model="showText2" class="w134 h26" placeholder="请选择">
            <el-option
              v-for="item in fieldOption"
              :key="item.fieldName"
              :label="item.fieldDesc"
              :value="item.fieldName">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class=" clearfix">
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw bg-color-182B4D btn pointer" @click="cancelLinkPop">取消</div>
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw btn pointer" @click="saveLinkSetting">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskLinkPop',
  data () {
    return {
      linkType: '0', // 设置链接
      showText1: '', // 设置链接
      showText2: '' // 设置链接
    }
  },
  props: {
    linkPop: Boolean,
    linkOption: Object,
    linkIndex: Number,
    fieldOption: Array,
    detail: String
  },
  watch: {
    linkPop (val) {
      if (val === true && this.linkOption.type === 1) {
        this.linkType = this.linkOption.linkType + ''
        if (this.linkOption.linkType === 1) {
          this.showText1 = this.linkOption.showText
        } else if (this.linkOption.linkType === 2) {
          this.showText2 = this.linkOption.showText
        }
      }
    },
    linkType (val) {
      if (this.linkType == '1') {
        this.showText2 = ''
      }else if (this.linkType == '2') {
        this.showText1 = ''
      }else {
        this.showText1 = this.showText2 = ''
      }
    },
    showText1 (val) {
      if (this.linkType !== '1') {
        this.showText1 = ''
      }
    },
    showText2 (val) {
      if (this.linkType !== '2') {
        this.showText2 = ''
      }
    }
  },
  methods: {
    // 保存链接设置
    saveLinkSetting () {
      this.$emit('saveLinkSetting', this.linkIndex, this.linkType, this.showText1, this.showText2, this.detail)
      this.linkType = '0'
      this.showText1 = ''
      this.showText2 = ''
    },
    // 取消弹窗
    cancelLinkPop () {
      this.$emit('cancelLinkPop')
      this.linkType = '0'
      this.showText1 = ''
      this.showText2 = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .pop-bg{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(189, 190, 191, 0.5);
    z-index: 10;
    .pop-window{
      z-index: 6;
      border-radius: 8px;
      position: absolute;
      top: 176px;
      left: 50%;
      transform: translateX(-50%);
      .pop-title{
        div:first-child{
          color: rgba(5, 16, 33, 0.72);
        }
      }
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
  }
  .ivu-input-wrapper{
    width: 306px;
    height: 93px;
  }
</style>
