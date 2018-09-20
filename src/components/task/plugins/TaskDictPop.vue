<template>
  <div class="pop-bg" v-show="dictPop">
    <div class="w370 h232  pdl24 pdt8 bg-color-white box-shadow-box pop-window task-pop" >
      <div class="h32 lh32 mgb16 fs14  clearfix pop-title">
        <div class="fl fw">设置固定字典</div>
        <div class="fr mgr26 pointer" @click="cancelDictPop">
          <img class="w12 h12" src="@/assets/imgs/close.png" alt="">
        </div>
      </div>
      <div class="h26 lh26 fs12 pdl8 mgb16 clearfix">
        <div class="h20 lh20 pdt4 pdr8 fl fw pop-row">请选择字段库</div>
        <div class="fl w226 h26 pop-input ">
          <!--<input class="w226 h26 " type="text">-->
          <el-select v-model="dicId" class="w226 h26" placeholder="请选择">
            <el-option
              v-for="item in dictList"
              :key="item.dicKey"
              :label="item.dicValue"
              :value="item.dicKey">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="h20 lh20 fs12 pdl8 mgb16 clearfix">
        <div class="h20 lh20 pdt2 pdr8 fl fw pop-row">筛选选择方式</div>
        <el-radio v-model="selectType" label="0" class="h20 lh20 pdt5 pdr8 fl fs12">单选</el-radio>
        <el-radio v-model="selectType" label="1" class="h20 lh20 pdt5 pdr8 fl fs12">多选</el-radio>
      </div>
      <div class="h20 lh20 fs12 pdl8 mgb30 clearfix">
        <div class="h20 lh20 pdt2 pdr8 fl fw pop-row">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;显示方式</div>
        <el-radio v-model="showType" label="0" class="h20 lh20 pdt5 pdr8 fl fs12">列表</el-radio>
        <el-radio v-model="showType" label="1" class="h20 lh20 pdt5 pdr8 fl fs12">选块</el-radio>
      </div>
      <div class=" clearfix">
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw bg-color-182B4D btn pointer" @click="cancelDictPop">取消</div>
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw btn pointer" @click="saveDictSetting">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDictList} from '@/http/services/dic_api'
export default {
  name: 'taskDictPop',
  data () {
    return {
      dicId: '', // 选中字典id
      selectType: '0',
      showType: '0',
      dictList: [] // 字典列表
    }
  },
  props: {
    dictPop: Boolean,
    dictOption: Object,
    dicIndex: Number
  },
  watch: {
    dictPop (val) {
      if (val === true && this.dictOption.inputType === 1) {
        this.dicId = this.dictOption.dicId + ''
        this.selectType = this.dictOption.selectType + ''
        this.showType = this.dictOption.showType + ''
      }
    }
  },
  created () {
    this.getDictList()
  },
  methods: {
    // 字典列表
    getDictList () {
      getDictList().then(res => {
        this.dictList = res.data.result
      }).catch(error => {
        console.log(error)
      })
    },
    // 保存链接设置
    saveDictSetting () {
      this.$emit('saveDictSetting', this.dicIndex, this.dicId, this.selectType, this.showType)
      this.dicId = ''
      this.selectType = '0'
      this.showType = '0'
    },
    // 取消弹窗
    cancelDictPop () {
      this.$emit('cancelDictPop')
      this.dicId = ''
      this.selectType = '0'
      this.showType = '0'
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
      .pop-row{
        color: rgba(5, 16, 33, 0.34);
      }
      .pop-input{
        input{
          outline: none;
          border: none;
          border-bottom: 1px solid rgba(41, 121, 255, 0.5);
        }
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
