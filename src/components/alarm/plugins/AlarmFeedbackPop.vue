<template>
  <div class="pop-bg" v-show="popFeed">
    <div class="w370 h237  pdl24 pdt14 box-center bg-color-white box-shadow pop-window" >
      <div class="h42 lh42 fs14 clearfix pop-title">
        <div class="fl fw h20 lh20">反馈</div>
        <div class="fr h20 lh20 mgr26 pointer" @click="showFeedback">
          <img src="../../../assets/imgs/close.png" class="w12 h12" alt="">
        </div>
      </div>
      <div class="h93 fs12 pdl8 mgb4 clearfix pop-input">
        <textarea v-model="feedback"  placeholder="请输入反馈内容"  :class="feedback.length > 500 ? 'out-length-border' : ''"></textarea>
      </div>
      <div class="tar w306 h20 lh20 mgb24 limit" :class="feedback.length > 500 ? 'out-length-color' : ''">最多支持500字输入</div>
      <div class=" clearfix">
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw bg-color-182B4D btn pointer" @click="showFeedback">取消</div>
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw btn pointer" @click="sendFeedback" v-if="feedback.length <= 500">确定</div>
        <div class="w60 h32 lh32 fs14 tac fr mgr8 color-2979FF fw btn pointer out-length-btn" v-else>确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmFeedbackPop',
  data () {
    return {
      feedback: '' // 占比
    }
  },
  props: {
    popFeed: Boolean
  },
  methods: {
    // 隐藏反馈信息
    showFeedback () {
      this.$emit('showFeedback')
      this.feedback = ''
    },
    // 发送反馈信息
    sendFeedback () {
      this.$emit('sendFeedback', this.feedback)
      this.feedback = ''
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
  }
  .pop-window{
    z-index: 6;
    border-radius: 8px;
    .pop-input{
      textarea{
        width: 306px;
        height: 93px;
        resize: none;
        outline: none;
        overflow: auto;
        border: 1px solid rgba(41, 121, 255, 0.5);
      }
      .out-length-border{
        border: 1px solid rgba(255, 0, 0, 0.5);
      }
    }
    .limit{
      color: rgba(5, 16, 33, 0.28);
    }
    .out-length-color{
      color: red;
    }
    .out-length-btn{
      opacity: 0.28;
    }
    .btn{
      border-radius: 4px;
    }
  }
  .box-shadow{
    box-shadow: 0 0 8px rgba(16, 48, 102, 0.03);
  }
  .box-shadow:hover{
    box-shadow: 0 8px 16px rgba(16, 48, 102, 0.08);
  }
  .ivu-input-wrapper{
    width: 306px;
    height: 93px;
  }
</style>
