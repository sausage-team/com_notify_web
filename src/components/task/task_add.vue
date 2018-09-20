<template>
  <div class="add-task-page">
    <header-nav></header-nav>
    <div class="content">
      <div class="content-inner">
        <div class="content-title">
          <div class="title-con">{{this.taskName ? '新增' : '编辑'}}任务</div>
        </div>
        <div class="content-step">
          <div class="step-con">
            <Steps :current="stepCurrent" size="small">
              <Step title="选择工作表"></Step>
              <Step title="设置任务字段"></Step>
              <Step title="设置推送规则"></Step>
            </Steps>
          </div>
        </div>
        <task-select-work-list
          :stepCurrent="stepCurrent"
          :taskId="taskId"
          @saveWorkListSucc="saveWorkListSucc">
        </task-select-work-list>
        <task-set-task-field
          :stepCurrent="stepCurrent"
          :taskId="taskId"
          :fieldOption="fieldOption"
          @queryWorkList="queryWorkList"
          @saveTaskFieldSucc="saveTaskFieldSucc">
        </task-set-task-field>
        <task-set-push-rule
          :stepCurrent="stepCurrent"
          :taskId="taskId"
          :fieldString="fieldString"
          @queryTaskFields="queryTaskFields">
        </task-set-push-rule>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from '../plugins/HeaderNav'
import TaskSelectWorkList from './plugins/TaskSelectWorkList'
import TaskSetTaskField from './plugins/TaskSetTaskField'
import TaskSetPushRule from './plugins/TaskSetPushRule'

export default {
  name: 'AddTask',
  components: {
    HeaderNav,
    TaskSelectWorkList,
    TaskSetTaskField,
    TaskSetPushRule
  },
  watch: {
  },
  computed: {
  },
  data () {
    return {
      stepCurrent: 0,
      taskName: this.$route.query.taskName, // 任务名称
      taskId: +this.$route.query.taskId,
      fieldString: [], // 工作表表头字段文本格式
      fieldOption: [] // 任务字段
    }
  },
  created () {

  },
  methods: {
    // 保存工作表
    saveWorkListSucc (flag, taskId, fieldOption, fieldString) {
      this.stepCurrent = flag
      this.taskId = taskId
      this.fieldOption = fieldOption
      this.fieldString = fieldString
    },
    // 查询工作表
    queryWorkList (flag, taskId) {
      this.stepCurrent = flag
      this.taskId = taskId
    },
    // 保存关键字
    saveTaskFieldSucc (flag, taskId) {
      this.stepCurrent = flag
      this.taskId = taskId
    },
    // 查询关键字
    queryTaskFields (flag, taskId) {
      this.stepCurrent = flag
      this.taskId = taskId
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  
</style>
