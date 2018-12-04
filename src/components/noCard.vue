<template>
  <div class="no-card">
    <slot name="header">
      <div class="card-header">
        <div class="card-title">
          <span class="title-box">{{msgData.task_name}}</span>
          <span class="title-tag">{{CONSTANT.taskType[msgData.task_type]}}</span>
        </div>
        <div class="card-time">
          <span class="time-box">{{util.momentDate(msgData.create_time, 'date_time')}}</span>
        </div>
      </div>
    </slot>
    <slot name="body">
      <span class="card-con">
        {{msgData.title}}
      </span>
    </slot>
    <slot name="footer"></slot>
  </div>
</template>
<script>
export default {
  props: {
    msgData: Object
  }
}
</script>
