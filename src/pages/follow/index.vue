<template lang='html'>
  <div class="follow-list">
    <div class="filter-wrap">
      <time-type-filter :typeOptions="typeOptions"></time-type-filter>
    </div>
    <div class="follow-content">
      <el-table
        :data="followsData"
        stripe
        height="calc(100% - 48px)">
        <el-table-column
          prop="type"
          label="任务类型"
          width="160">
        </el-table-column>
        <el-table-column
          prop="name"
          label="任务名称"
          width="240">
        </el-table-column>
        <el-table-column
          prop="time"
          label="推送时间"
          width="184">
        </el-table-column>
        <el-table-column
          prop="content"
          label="推送内容"
          width="600">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="96">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="5000">
        </el-pagination>
      </div>
    </div>
    <card-detail v-model="detailVisible"></card-detail>
  </div>
</template>

<script>
import TimeTypeFilter from '@/components/TimeTypeFilter'
import CardDetail from '@/components/CardDetail'
export default {
  components: {
    TimeTypeFilter,
    CardDetail
  },
  data () {
    return {
      detailVisible: false,
      typeOptions: {
        label: '关注类型',
        data: [
          {
            value: 'all',
            label: '全部'
          },
          {
            value: 'yellowish',
            label: '涉黄预警'
          },
          {
            value: 'fear',
            label: '涉恐预警'
          }
        ]
      },
      followsData: []
    }
  },
  methods: {
    showDetail (item) {
      this.detailVisible = true
    }
  },
  created () {
    for (var i = 0; i < 11; i++) {
      let item = {}
      item.type = '涉黄'
      item.name = '这是一个任务名称'
      item.time = '2018-10-11 17:00:05'
      item.content = '您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息，您有一条新消息'
      this.followsData.push(item)
    }
  }
}

</script>
<style lang='scss'></style>
