<template>
  <div class="task-main">
    <header-nav ref="refreshTitle"></header-nav>
    <div class="content">
      <div class="content-inner"  :style="{width: tableWidth}">
        <div class="task-header">
          <div class="task-select-box">
            <div class="select-title">任务管理</div>
            <el-select v-model="taskTypeId" class="task-select" @change="changeList" placeholder="请选择">
              <el-option
                v-for="i in options"
                :key="i.id"
                :label="i.name"
                :value="i.id">
              </el-option>
            </el-select>
          </div>  
          <Button class="add-btn"  @click="popShow=true">新增任务</Button>
        </div>
        <div class="content-inner-table">
          <div class="content-inner-table-inner">
            <Table border stripe :columns="columns1" :data="tableData" :height="tableHeight" :loading="loading" class="test" v-if="testTabel"></Table>
            <Table border stripe :columns="columns2" :data="tableData" :height="tableHeight" v-else></Table>
          </div>
        </div>
        <div class="content-inner-footer">
          <div class="content-left-footer-inner">
            <Pagination :total="pageTotle" show-sizer :current="pageNo" :page-size="pageSize"  @on-change="changeList" @on-page-size-change="changeListSize"></Pagination>
          </div>
        </div>
        <Modal class="task-list-detail-modal" v-model="showDetail" title="任务详情">
          <div class="detail-item">
            <span class="item-title">任务名称</span>
            <p class="item-con" v-text="detailData.detailName"></p>
          </div>
          <div class="detail-item">
            <span class="item-title">任务分类</span>
            <p class="item-con" v-text="detailData.detailType"></p>
          </div>
          <div class="detail-item">
            <span class="item-title">任务描述</span>
            <p class="item-con" v-text="detailData.detailDes"></p>
          </div>
          <div slot="footer"></div>
        </Modal>
        <Modal class="add-task-modal" v-model="popShow" title="新建任务">
          <div class="add-task-item">
            <div class="item-title">任务名称</div>
            <div class="item-con">
              <input class="item-text" v-model="taskName" type="text">
            </div>
          </div>
          <div class="add-task-item">
            <div class="item-title">任务分类</div>
            <div class="item-con">
              <el-select v-model="taskTypeId2" class="item-select" placeholder="请选择">
                <el-option
                  v-for="i in options2"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id">
                </el-option>
              </el-select>
              </div>
          </div>
          <div class="add-task-item">
            <div class="item-area">
              <Input class="area-con" :maxlength="500" type="textarea" :rows="4" v-model="taskDescribe" placeholder="请输入任务描述"></Input>
            </div>
          </div>
          <div class="area-tip h26 lh26 fs12 pdl8">
            <div class="h24 lh24 pdr38 fw fr color-051021 op-34">最多支持500字输入</div>
          </div>
          <div class="footer-btn clearfix">
            <Button type=text class="btn-cancle" @click="popShow=false">取消</Button>
            <Button type="primary" class="btn-sure" @click="addTask">确定</Button>
          </div>
          <div slot="footer"></div>
        </Modal>
      </div>
    </div>
    
    <div class="pop-bg" v-show="">
      <div class="w500 h335  pdl24 pdb12 bg-color-white box-shadow-box pop-window" >
        <div class="h48 lh48 fs14 mgb10 clearfix pop-title">
          <div class="fl fw">新建任务</div>
          <div class="fr mgr26" @click="popShow=false">
            <img class="w12 h12" src="@/assets/imgs/close.png" alt="">
          </div>
        </div>
        
      </div>
    </div>
  </div>

</template>

<script>
import HeaderNav from '../plugins/HeaderNav'
import Pagination from '../plugins/Pagination'
import {getTaskList, changeTaskStatus, checkTaskByName, getTaskTypekList, getTaskDetail} from '@/http/services/task_api'

export default {
  name: 'TaskList',
  components: {
    HeaderNav,
    Pagination
  },
  data () {
    return {
      loading: true,
      columns1: [
        {
          title: '任务名称',
          key: 'taskName',
          width: 100
        },
        {
          title: '开始预警时间',
          key: 'startDate',
          width: 160
        },
        {
          title: '结束预警时间',
          key: 'endDate',
          width: 160
        },
        {
          title: '创建用户',
          key: 'createUserName',
          width: 100
        },
        {
          title: '数据表',
          key: 'workTblDesc'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 155,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                style: {
                  color: '#2979FF',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                },
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                style: {
                  color: '#2979FF',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                },
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.row)
                  }
                }
              }, '删除'),
              h('Button', {
                style: {
                  color: '#2979FF',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                },
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.details(params.row)
                  }
                }
              }, '详情')
            ])
          }
        },
        {
          title: '是否开启',
          key: 'status',
          fixed: 'right',
          width: 155,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  type: 'primary',
                  value: params.row.status === 1 // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': (value) => { // 触发事件是on-change,用双引号括起来，
                    // 参数value是回调值，并没有使用到
                    this.switch(params.index) // params.index是拿到table的行序列，可以取到对应的表格值
                  }
                }
              }, '已反馈')
            ])
          }
        }
      ],
      columns2: [], // 表格列
      testTabel: true, // 表格列
      tableData: [],
      tableWidth: null,
      tableHeight: null,
      tableHeightOrg: null,
      pageTotle: null, // 总条数
      pageNo: 1, // 显示当前页
      pageSize: 20, // 每页显示条数
      popShow: false,
      taskName: '', // 任务名称
      taskDescribe: '',//任务描述
      taskTypeId: -1, //任务类别ID，默认全部
      taskTypeId2: 0, //新建时类型默认其他
      options: [],
      options2: [],
      showDetail: false,
      detailData: {
        detailDes: '',
        detailName: '',
        detailType: ''
      }
    }
  },
  created () {
    this.getTaskTypekList();
    this.getTaskList();
  },
  mounted () {
    this.tableWidth = document.getElementsByClassName('content')[0].clientWidth * 0.7;
    this.$nextTick(() => {
      this.tableHeight = document.getElementsByClassName('content-inner-table-inner')[0].clientHeight;
    })
  },
  methods: {
    // 分页查询
    changeList (pageNo) {
      this.pageNo = pageNo;
      this.getTaskList();
    },
    // 分页总数改变查询
    changeListSize (pageSize) {
      this.pageSize = pageSize;
      this.getTaskList();
    },
    // 查询表格数据
    getTaskList () {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        taskTypeId: this.taskTypeId
      }
      getTaskList(params).then(res => {
        this.tableData = res.data.result.aaData
        this.tableData.forEach((i) => {
          if(i.taskName.length > 9){
            i.taskName = i.taskName.substring(0, 9) + "..."
          }  
        })
        this.pageTotle = res.data.result.iTotalRecords // 总条数
        this.pageNo = res.data.result.iDisplayStart // 显示当前页
        this.pageSize = res.data.result.iDisplayLength // 每页显示条数
        this.resetTable()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 查询任务类型列表
    getTaskTypekList () {
      getTaskTypekList().then(res => {
        this.options = res.data.result;
        res.data.result.forEach(value => {
          if(value.id != -1) {
            this.options2.push(value);
          }
        })
      }).catch(error => {
        console.log(error);
      })
    },
    // 重加载table
    resetTable () {
      this.testTabel = true
      setTimeout(() => {
        if (this.tableData.length !== 0) {
          let tdWidthArray = document.getElementsByClassName('ivu-table-row')[0].children;
          let thWidthArray = document.getElementsByTagName('thead')[0].children[0].children;
          let clientW = [];
          let clientHW = [];
          let clientSW = [];
          Object.keys(tdWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientW.push(tdWidthArray[item].offsetWidth - 1);
            } else {
              clientW.push(tdWidthArray[item].offsetWidth);
            }
          })
          Object.keys(thWidthArray).forEach((item, index) => {
            if (index === 0) {
              clientHW.push(thWidthArray[item].offsetWidth - 1);
            } else {
              clientHW.push(thWidthArray[item].offsetWidth);
            }
          })
          clientW.forEach((item, index) => {
            if (item > clientHW[index]) {
              clientSW.push(item)
            } else {
              clientSW.push(clientHW[index])
            }
          })
          this.columns2 = this.columns1
          clientSW.forEach((item, index) => {
            this.columns2[index].width = item
          })
        }
        this.testTabel = false
      }, 100)
    },
    // 新增任务
    addTask () {
      if (this.taskName === '') {
        this.$Message.info('任务名称不能为空')
      } else {
        // 名称重复校验
        checkTaskByName({taskName: this.taskName}).then(res => {
          if (res.data.code === 0) {
            this.$router.push(`/add_task?taskName=${this.taskName}&taskTypeId=${this.taskTypeId2}&taskDescribe=${this.taskDescribe}`)
          }
        }).catch(error => {
          this.$Message.error(error)
        })
      }
    },
    // 编辑任务
    edit (para) {
      this.$router.push(`/add_task?taskId=${para.row.taskId}`)
    },
    // 删除任务
    remove (row) {
      this.changeTaskStatus(row, -1)
      this.$refs.refreshTitle.getTaskTitleList()
    },
    //查看详情
    details (row) {
      getTaskDetail({taskId: row.taskId}).then(res => {
        if (res.data.code === 0)
        {
          this.showDetail = true;
          this.detailData.detailName = res.data.result.taskName
          this.detailData.detailType = res.data.result.taskType
          this.detailData.detailDes = res.data.result.taskDescribe
        }
      }).catch(error => {
        this.$Message.error(error);
      });
    },
    // 通过开关状态判断值然后传值进行更新
    switch (index) {
      // 打开是true,已经处理1
      this.changeTaskStatus(this.tableData[index], this.tableData[index].status)
    },
    // 改变状态-删除、开启、关闭
    changeTaskStatus (row, status) {
      let params = {
        taskId: row.taskId,
        status: status === 1 ? 0 : status === 0 ? 1 : -1
      }
      changeTaskStatus(params).then((res) => {
        if (res.data.code === 0) {
          if (status === -1) {
            this.$Message.info('删除成功')
          } else {
            this.$Message.info('更新成功')
          }
          this.$refs.refreshTitle.getTaskTitleList()
        }
        this.getTaskList()
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

