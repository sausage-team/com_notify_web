<template>
  <div class="step-wrapper push-rule-page" v-show="stepCurrent == 2">
    <div class="step step-3 push-rule-main" >
      <div class="push-content">
        <div class="content-left">
          <div class="left-up">设置此任务面向的用户组</div>
          <div class="push-content-class left-down">
            <div class="filter">
              <input type="text" placeholder="输入关键字进行过滤" v-model="filterText" class="input-reset" style="width: 88%">
            </div>
            <div class="user-wrapper down-select" >

              <el-tree
                class="filter-tree"
                :data="treeData"
                show-checkbox
                node-key="group_id"
                :check-strictly="true"
                :default-checked-keys="checkedKeys"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
                ref="tree">
              </el-tree>
            </div>
            <!-- <div class="h32 lh32 bg-color-white pdr10">
              <div class="fr">
                <span class="pdr4">只看已选</span>
                <el-switch
                  v-model="treeValue">
                </el-switch>
              </div>
            </div> -->
          </div>
        </div>
        <div class="content-mid">
          <div class="mid-up">当下列条件满足时发送消息</div>
          <div class="mid-down scroll-container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="定向推送" class="pane-1" name='1'>
                <div class=" scroll-inner">
                  <ul class="step-3-ul">
                    <li v-for="(item, index) in selectList" :key = 'index'>
                      <div class="choose">
                        <el-select v-model="item.columns.fieldName" placeholder="请选择" @change="changeCondition2(item.columns.fieldName, index)">
                          <el-option
                            v-for="i in item.fieldString"
                            :key="i.fieldName"
                            :label="i.fieldDesc"
                            :value="i.fieldName">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="worth">等于</div>
                      <el-dropdown trigger="click">
                        <div class="input-con">
                          <input type="text" placeholder="请输入内容" v-model="item.groupString"  @focus="showTree(index)" class="input-reset">
                        </div>
                        <el-dropdown-menu slot="dropdown">
                          <div class="fliter">
                            <el-input
                              placeholder="输入关键字进行过滤"
                              v-model="filterText2">
                            </el-input>
                          </div>
                          <div class="tree-wrapper" style="overflow: auto">
                            <el-tree
                              class="filter-tree"
                              :data="treeData"
                              show-checkbox
                              node-key="group_id"
                              :check-strictly='true'
                              :default-checked-keys="item.groupArray"
                              :props="defaultProps"
                              :filter-node-method="filterNode"
                              :expand-on-click-node="false"
                              @check-change="handleCheckChange2"
                              ref="tree2">
                              <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                  <img class="custom-tree-node-icon" src="@/assets/imgs/account-group.svg" alt="" @click="showPerson(node.data)">
                                </span>
                              </span>
                            </el-tree>
                          </div>
                          <!-- <div class="pa w160 h30 lh30 pdl16 bg-color-white btn-wrapper">
                            <div class="pa tree-btn clearfix w84">
                              <div class="w30 h16 lh16 fs14 tac fr pointer fw btn" @click="cancelTree(index)">取消</div>
                              <div class="w30 h16 lh16 fs14 tac fr pointer fw btn mgr24 color-2979FF " @click="saveTree(index)">确定</div>
                            </div>
                          </div> -->
                        </el-dropdown-menu>
                      </el-dropdown>
                      <div class="addSelect" @click="addSelectList" v-show="index == 0">
                        <i></i>
                      </div>
                      <div class="minSelect" @click="minSelectList(index)" v-show="index != 0">
                        <i></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
              <el-tab-pane label="精准推送" class="pane-2" name='2'>
                <div class="filter3">
                  <input type="text" placeholder="输入关键字进行过滤" v-model="filterText3" class="input-reset" style="padding-right: 145px;">
                </div>
                <div class="user-wrapper" style="overflow: auto">
                  <el-tree
                    class="filter-tree"
                    :data="treeData"
                    show-checkbox
                    node-key="group_id"
                    :check-strictly="true"
                    :default-checked-keys="checkedKeys3"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    @check-change="handleCheckChange2"
                    ref="tree3">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span>
                        <img class="custom-tree-node-icon" src="@/assets/imgs/account-group.svg" alt="" @click="showPerson(node.data)">
                      </span>
                    </span>
                  </el-tree>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="content-right">
          <div class="right-up">当下列条件满足时发送消息</div>
          <div class="right-down push-content-class">
            <div class="user-choose">用户标签选择</div>
            <div class="user-label">
              <ul class="step-3-ul">
                <li v-for="(item, index) in userlabel.result" :key = 'index'>
                  <div v-text="item.name"></div>
                  <Select v-model="dataModel[index]" :label-in-value='true' @on-change="userlabelChange($event, item)" multiple style="width:220px">
                    <Option v-for="i in item.childs" :value="i.id" :key="i.id">{{i.name}}</Option>
                  </Select>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div class="set-info" >
      <div class="info-up">预警消息设置</div>
      <div class="info-down scroll-container">
        <el-tabs v-model="activeName2" class="message-modal-page">
          <el-tab-pane label="默认" class="pane-0" name="0">
            <div>您有一条预警消息，请注意查收！</div>
          </el-tab-pane>
          <el-tab-pane label="自定义" class="pane-1" style="width: 95%" name="1">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              :maxlength="200"
              placeholder="请输入内容"
              v-model="textUser1">

            </el-input>
            <div class="pane-inp">
              <div class="pane-text">最多支持200字输入</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="消息模板" class="pane-2" style="width: 95%" name="2">
            <at :members="members">
              <!-- <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                resize="none"
                v-model="textarea2">
              </el-input> -->
              <div class="textarea-editor" :maxlength="200" @onkeyup="editorChange" contenteditable='true' ref='textUser2'></div>
            </at>
            <div class="pane-inp">
              <div class="pane-text">输入空格后再输入'@'触发模版选择，最多支持200字输入</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="push-ways" >
      <div class="ways-header">推送方式</div>
      <ul class="checked-list">
        <li>
          <el-checkbox v-model="pushWeb" disabled></el-checkbox>
          <div class="image web">
            <i></i>
          </div>
          <div class="words">Web端</div>
        </li>
        <li>
          <el-checkbox v-model="pushMobile"></el-checkbox>
          <div class="image phone">
            <i></i>
          </div>
          <div class="words">手机App</div>
        </li>
        <li>
          <el-checkbox v-model="pushSms"></el-checkbox>
          <div class="image message">
            <i></i>
          </div>
          <div class="words">手机短信</div>
        </li>
      </ul>
    </div>
    <div class="push-time" >
      <div class="time-header">推送时间设置</div>
      <div class="time-body scroll-container">
        <div class="time-tab">
          <el-date-picker
            v-model="date1"
            type="datetime"
            placeholder="选择开始日期时间"
            align="right"
            @change="changeDate"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
          至
          <el-date-picker
            v-model="date2"
            type="datetime"
            placeholder="选择结束日期时间"
            align="right"
            @change="changeDate"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="timestamp"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span v-text="dateTip" class="op-42 pdl20"></span>
        </div>
      </div>
    </div>
    <div class="push-rule-footer">
      <div class="footer-left" @click="backStep(-1)">上一步</div>
      <div class="footer-right" @click="savePushRule">完成{{this.taskName ? '创建' : '编辑'}}</div>
    </div>
    <Modal
      v-model="showPersonList"
      class="push-rule-page-user"
      :mask-closable="false"
      @on-ok="pushPersonList"
      title="人员列表">
      <div class="h310 w500 pdl10 border-b-1-grey bg-color-white  user-wrapper">
        <el-transfer
          filterable
          :filter-method="filterUser"
          :label-in-value='true'
          filter-placeholder="请输入人员名称"
          :titles="['未选用户', '已选用户']"
          v-model="checkedKeys2"
          :props="defaultProps2"
          @change="changePersonList"
          :data="treeData2">
        </el-transfer>
      </div>
    </Modal>
  </div>
</template>

<script>
import {addPushTargetRule, savePushRule, selectPushRule, getWorkList, showCondition, getWorkPreview} from '@/http/services/task_api'
import {getGroupList, getGroupUsers, getUserPortraits} from '@/http/services/user_api'
import At from 'vue-at'

export default {
  name: 'TaskSetPushRule',
  components: {At},
  watch: {
    stepCurrent (val) {
      this.selectList[0].fieldString = this.fieldString
      getUserPortraits().then(res => {
        this.userlabel = res.data
        res.data.result.forEach((item, index) => {
          this.dataModel.push('model' + item.id)
        })
      })
      this.showCondition()
      if (val === 2) {
        if (this.taskName) {
          this.getGroupList()
        } else {
          this.selectPushRule()
        }
      }
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    filterText2 (val) {
      this.$refs.tree2[0].filter(val)
    },
    filterText3 (val) {
      this.$refs.tree3.filter(val)
    },
    filterText4 (val) {
      this.$refs.tree4.filter(val)
    }
  },
  computed: {
  },
  data () {
    return {
      userlabel: {},
      workList: {},
      dataModel: [], // 动态生成用户标签绑定modal
      workTblName: '',
      textUser1: '',
      textUser2: '',
      taskName: this.$route.query.taskName, // 任务名称
      dateTip: '', // 推送时间提示
      treeData: [],
      treeData2: [],
      showPersonList: false, // 人员列表弹窗
      checkedUser: [], // 已选用户
      defaultProps: {
        children: 'sub',
        label: 'group_name'
      },
      defaultProps2: {
        key: 'user_id',
        label: 'name'
      },
      members: [],
      menberMap: {},
      html: '',
      activeName: '1',
      activeName2: '0',
      viewGroups: {groupList: [], userList: []},
      pushTargets: [],
      filterText: '',
      filterText2: '',
      filterText3: '',
      treeValue: '',
      checkedKeys: [],
      checkedKeys2: [],
      checkedKeys3: [],
      userListTmp: [],
      popTree: null,
      indexTree: 0,
      textarea: '',
      textarea2: '',
      portrait: [], // 用户标签
      portraitList: {}, // 用户标签仓库
      sendMessage: {
        type: 0,
        messageContent: '',
        messageBody: [{type: 0, key: '', value: ''}]
      }, // 推送消息设置
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      date1: null,
      date2: null,
      selectList: [{ // 筛选条件
        fieldString: [],
        columns: {
          fieldDesc: '',
          fieldName: '',
          fieldType: '',
          fieldValue: {
            groupList: [],
            userList: []
          }
        },
        groupArray: [],
        groupString: ''
      }],
      pushWeb: true, // 推送方式
      pushMobile: false, // 推送方式
      pushSms: false // 推送方式
    }
  },
  props: {
    stepCurrent: Number,
    taskId: String,
    fieldString: Array // 临时筛选条件
  },
  created () {
  },
  methods: {
    // 上一步
    backStep (flag) {
      this.$confirm('离开当前页面将不保存本次配置，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectList = [{
          fieldString: [],
          columns: {
            fieldDesc: '',
            fieldName: '',
            fieldType: '',
            fieldValue: {
              groupList: [],
              userList: []
            }
          },
          groupArray: [],
          groupString: ''
        }]
        this.$emit('queryTaskFields', 1, this.taskId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editorChange (value) {
      console.log(value)
    },
    handleClick () {
      this.$refs.tree2.forEach(item => {
        item.setCheckedNodes([])
      })
      this.$refs.tree3.setCheckedNodes([])
      this.checkedKeys3 = []
      this.pushTargets = []
      this.selectList = [{
        fieldString: JSON.parse(JSON.stringify(this.fieldString)),
        columns: {
          fieldDesc: '',
          fieldName: '',
          fieldType: '',
          fieldValue: {
            groupList: [],
            userList: []
          }
        },
        groupArray: [],
        groupString: ''
      }]
    },
    // 改变日期时动作
    changeDate () {
      if (this.date1 && this.date2) {
        if (this.date2 > this.date1) {
          this.dateTip = `推送时间范围为${this.timestampToTime(this.date1)}至 ${this.timestampToTime(this.date2)}`
        } else {
          this.dateTip = '结束时间必须大于开始时间'
        }
      } else if (this.date1 && !this.date2) {
        this.dateTip = `推送时间范围为${this.timestampToTime(this.date1)}之后`
      } else if (!this.date1 && this.date2) {
        this.dateTip = `推送时间范围为${this.timestampToTime(this.date2)}之前`
      } else {
        this.dateTip = ''
      }
    },
    // 时间戳转化为格式化时间
    timestampToTime (timestamp) {
      let date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h = (date.getHours() + 1 < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m = (date.getMinutes() + 1 < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      let s = (date.getSeconds() + 1 < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    },
    // 模版消息@弹出模版
    // showModal (value) {
    //   // if(value.includes('@'))
    //   // {
    //     this.textarea2 = value.replace(/\@/g,'')
    //   // }
    // },
    // 查询推送规则
    selectPushRule () {
      selectPushRule({taskId: this.taskId}).then(res => {
        this.viewGroups.groupList = res.data.result.viewGroups.groupList ? res.data.result.viewGroups.groupList : []
        this.activeName = res.data.result.pushType.toString()
        this.activeName2 = res.data.result.sendMessage.type.toString()
        this.pushTargets = res.data.result.pushTargets ? res.data.result.pushTargets : []
        this.pushWeb = true
        this.date1 = res.data.result.startDate ? res.data.result.startDate : null
        this.date2 = res.data.result.endDate ? res.data.result.endDate : null
        this.pushMobile = !!res.data.result.pushMobile
        this.pushSms = !!res.data.result.pushSms
        this.viewGroups.groupList.forEach((item) => {
          this.checkedKeys.push(item.groupId)
        })
        this.changeDate()
        this.getGroupList()
        res.data.result.portrait.forEach((item, index) => {
          let modalArr = []
          item.childs.forEach((i) => {
            modalArr.push(i.id)
          })
          this.dataModel[index] = modalArr
        })
        if (this.activeName2 === 1) {
          this.textUser1 = res.data.result.sendMessage.messageBody[0].value
        } else if (this.activeName2 === 2) {
          this.$refs.textUser2.innerText = res.data.result.sendMessage.messageContent
        }
        this.pushTargets.forEach((item, index) => {
          if (this.activeName === 1) {
            let temp = []
            if (index !== 0) {
              this.addSelectList()
            }
            this.selectList[index].columns = item
            item.fieldValue.groupList.forEach((i) => {
              this.selectList[index].groupArray.push(i.groupId)
              temp.push(i.groupName)
            })
            item.fieldValue.userList.forEach((i) => {
              this.userListTmp.push(i)
            })
            this.selectList[index].groupString = temp.join('; ')
          } else {
            this.selectList[index].columns = item
            item.fieldValue.groupList.forEach((item) => {
              this.checkedKeys3.push(item.groupId)
              this.selectList[index].groupArray.push(item.groupId)
            })
            item.fieldValue.userList.forEach((i) => {
              this.userListTmp.push(i)
            })
          }
        })
        this.userListTmp.forEach((item) => {
          this.checkedKeys2.push(item.userId)
        })
      }).catch(error => {
        console.log(error)
        this.getGroupList()
      })
    },
    // 改变用户标签
    userlabelChange (value, item) {
      let userArr = []
      value.forEach((i) => {
        let userTmp = {id: '', pid: '', name: ''}
        userTmp.name = i.label
        userTmp.id = i.value
        userTmp.pid = item.id
        userArr.push(userTmp)
      })
      this.portraitList[item.name] = {id: item.id, childs: userArr}
    },
    // 新增筛选条件
    addSelectList () {
      this.selectList.push({
        fieldString: JSON.parse(JSON.stringify(this.fieldString)),
        columns: {
          fieldDesc: '',
          fieldName: '',
          fieldType: '',
          fieldValue: {
            groupList: [],
            userList: []
          }
        },
        groupArray: []
      })
    },
    // 减少筛选条件
    minSelectList (index) {
      this.selectList.splice(index, 1)
    },
    // 查询用户组
    getGroupList () {
      getGroupList().then(res => {
        this.treeData = res.data.result
        this.stepCurrent = 2
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询用户组成员
    getGroupUsers (groupId) {
      getGroupUsers({groupId: groupId}).then(res => {
        this.treeData2 = res.data.result
        this.showPersonList = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询工作表
    showCondition () {
      showCondition({taskId: this.taskId}).then(res => {
        this.getWorkList(res.data.result.workTalName)
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询数据表列表
    getWorkList (workTblName) {
      getWorkList('').then(res => {
        this.workList = res.data.result
        if (workTblName) {
          this.workTblName = workTblName
          this.workList.forEach((item, index) => {
            if (item.workTblName === this.workTblName) {
              this.workTblDesc = item.workTblDesc
              this.getWorkPreview(this.workTblName, this.workTblDesc, index)
            }
          })
        } else {
          this.workTblName = this.workList[0].workTblName
          this.workTblDesc = this.workList[0].workTblDesc
          this.getWorkPreview(this.workTblName, this.workTblDesc, 0)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询数据表预览
    getWorkPreview (workTblName, workTblDesc, index) {
      this.workTblName = workTblName || this.workTblName
      this.workTblDesc = workTblDesc || this.workTblDesc
      this.workListIndex = index !== undefined ? index : this.workListIndex
      let params = {
        workTblName: this.workTblName
      }
      getWorkPreview(params).then(res => {
        this.members = []
        res.data.result.colmuns.forEach((i) => {
          this.members.push(i.alias)
          this.menberMap[i.alias] = i.column
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 用户组搜索
    filterNode (value, data) {
      if (!value) return true
      return data.group_name.indexOf(value) !== -1
    },
    // 用户搜索
    filterUser (query, item) {
      return item.name.indexOf(query) > -1
    },
    // 用户组选中
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      let tempObj = {
        groupId: '',
        groupName: ''
      }
      if (checked) {
        tempObj.groupId = data.group_id
        tempObj.groupName = data.group_name
        this.viewGroups.groupList.push(tempObj)
      } else {
        this.viewGroups.groupList.forEach((item, index) => {
          if (item.groupId === data.group_id) {
            this.viewGroups.groupList.splice(index, 1)
          }
        })
      }
      console.log(this.viewGroups)
    },
    // 用户变化时
    changePersonList (data) {
      this.checkedUser = data
    },
    // push用户
    pushPersonList () {
      let tempList = []
      let sl = this.selectList[this.indexTree]
      this.checkedUser.forEach((item, index) => {
        this.treeData2.forEach((i, k) => {
          if (item === i.user_id) {
            tempList.push(i)
          }
        })
      })
      tempList.forEach((i) => {
        let tempObj = {userId: '', userName: ''}
        tempObj.userId = i.user_id
        tempObj.userName = i.name
        sl.columns.fieldValue.userList.push(tempObj)
        // this.checkedKeys2(tempObj)
      })
    },
    // 选择满足条件
    changeCondition2 (flag, index) {
      console.log(this.fieldString)
      this.fieldString.forEach((item) => {
        if (item.fieldName === flag) {
          if (item.dataType === 2) {
            this.selectList[index].columns.fieldType = 2
          } else if (item.dataType === 3) {
            this.selectList[index].columns.fieldType = 3
          }
          this.selectList[index].columns.fieldName = item.fieldName
          this.selectList[index].columns.fieldDesc = item.fieldDesc
        }
      })
    },
    // 显示推送树
    showTree (index) {
      this.popTree = index
      this.indexTree = index
    },
    // 显示用户组人员
    showPerson (data) {
      this.getGroupUsers(data.group_id)
    },
    // 用户组满足条件选中
    handleCheckChange2 (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
      let tempObj = {
        groupId: '',
        groupName: ''
      }
      let sl = this.selectList[this.indexTree]
      if (checked) {
        tempObj.groupId = data.group_id
        tempObj.groupName = data.group_name
        sl.columns.fieldValue.groupList.push(tempObj)
        sl.groupArray.push(tempObj.groupName)
      } else {
        sl.columns.fieldValue.groupList.forEach((item, index) => {
          if (item.groupId === data.group_id) {
            sl.columns.fieldValue.groupList.splice(index, 1)
            sl.groupArray.splice(index, 1)
          }
        })
      }
      sl.groupString = sl.groupArray.join('; ')
    },
    // 保存树
    saveTree (index) {
      this.indexTree = index
      this.popTree = null
      this.pushTargets = []
      this.selectList.forEach((item) => {
        this.pushTargets.push(item.columns)
      })
    },
    cancelTree () {
      this.popTree = null
    },
    // 保存推送规则
    savePushRule () {
      this.pushTargets = []
      let rulesCount = 0
      this.selectList.forEach((item) => {
        this.pushTargets.push(item.columns)
        rulesCount += item.columns.fieldValue.groupList.length
        rulesCount += item.columns.fieldValue.userList.length
      })
      for (let index in this.portraitList) {
        this.portrait.push({'name': index,
          'id': this.portraitList[index].id,
          'childs': this.portraitList[index].childs})
      }
      if (this.viewGroups.groupList.length === 0) {
        this.$message({
          type: 'info',
          message: '面向用户组为必选项'
        })
        return
      } else if (rulesCount === 0) {
        this.$message({
          type: 'info',
          message: '推送对象为必选项'
        })
        return
      } else if (this.date1 == null && this.date2 == null) {
        this.$message({
          type: 'info',
          message: '推送时间为必选项'
        })
        return
      } else if (this.date1 && this.date2) {
        if (this.date2 < this.date1) {
          this.$message({
            type: 'info',
            message: '结束时间必须大于开始时间'
          })
          return
        }
      }
      if (this.activeName2 !== 0) {
        if (this.activeName2 === 1) {
          this.sendMessage = {
            type: 1,
            messageContent: '',
            messageBody: [{type: 0, key: '', value: this.textUser1}]
          }
        } else if (this.activeName2 === 2) {
          let msgArr = this.$refs.textUser2.innerText.split('@')
          this.sendMessage = {
            type: 2,
            messageContent: this.$refs.textUser2.innerText,
            messageBody: []
          }
          msgArr.forEach((item, index) => {
            if (item !== '' && index === 0) {
              this.sendMessage.messageBody.push({type: 0, key: '', value: item.trim()})
            } else if (item !== '') {
              let markNum = item.indexOf(' ')
              this.sendMessage.messageBody.push({type: 1, key: this.menberMap[item.substring(0, markNum)], value: item.substring(0, markNum)})
              if (item.substring(markNum) !== '' && item.substring(markNum) !== ' ') {
                this.sendMessage.messageBody.push({type: 0, key: '', value: item.substring(markNum).trim()})
              }
            }
          })
          // this.sendMessage =  {
          //   type: 3,
          //   key: '',
          //   messageBody: [{key: '', value: }]
          // }
        }
      }
      let params = {
        taskId: this.taskId,
        viewGroups: this.viewGroups,
        pushTargets: this.pushTargets,
        pushWeb: 1,
        pushType: this.activeName,
        pushMobile: +this.pushMobile,
        pushSms: +this.pushSms,
        portrait: this.portrait,
        sendMessage: this.sendMessage,
        startDate: this.date1,
        endDate: this.date2
      }
      if (this.taskName) {
        addPushTargetRule(params).then(res => {
          this.$router.push('/taskList')
        }).catch(error => {
          console.log(error)
        })
      } else {
        savePushRule(params).then(res => {
          this.$router.push('/taskList')
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>
