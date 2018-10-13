<template>
  <div class="task-field-main" v-show="stepCurrent == 1">
    <div class="task-field-body" >
      <!-- 选择数据表 -->
      <div class="field-list">
        <div class="field-list-header">
          <span>选择数据表</span>
          <!--<span class="fr pdr17">搜索</span>-->
        </div>
        <div class="field-list-content step-left-content">
          <div class="content-head"><span>字段名称</span><span>字段类型</span></div>
          <draggable class="list-group" element="ul" v-model="fieldOption" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
            <transition-group type="transition" :name="'flip-list'">
              <li v-for="(item, index) in fieldOption" :key = 'index'>
                <span class="text-ellipsis ">{{item.fieldDesc}}</span>
                <div class="img-box text" v-if="item.dataType === 2">
                  <i></i>
                </div>
                <div class="img-box date" v-if="item.dataType === 3">
                  <i></i>
                </div>
                <span>{{item.dataType === 2 ? '文本' : '日期'}}</span>
              </li>
            </transition-group>
          </draggable>
        </div>
        <div class="field-list-footer-hidd" v-show="selectButton">
          <div class="footer-hidd" @click="addField(1)">预警列表</div>
          <div class="footer-hidd" @click="addField(2)">筛选器</div>
          <div class="footer-hidd" @click="addField(3)">详情页面</div>
        </div>
        <div class="add-btn field-list-footer" @click="selectAllButton">
          全部加入至 >>
        </div>
      </div>
      <!-- 预警列表 -->
      <div class="field-select">
        <div class="select-header">
          <span>预警列表</span>
          <!--<span class="fr pdr17">搜索</span>-->
        </div>
        <div class="select-content">
          <draggable element="span" v-model="alarmFields" :options="putOptions" :move="onMove"  @start="isDragging=true" @end="isDragging=false">
            <transition-group name="no" class="list-group" tag="ul">
              <li v-for="(item, index) in alarmFields "  :key = 'index' @mousemove="alarmHover = index" @mouseout="alarmHover = ''">
                <div class="detail-1">
                  <i></i>
                </div>
                <div class="detail-2 text-ellipsis">{{item.fieldDesc}}</div>
                <div class="detail-7" v-show="popSetting == index" v-clickoutside="closePopShow">
                  <div class="detail-7-1" @click="saveSetting(1, index,'Ptask')">默认</div>
                  <div class="detail-7-1" @click="showLinkSetting(index, item, 'Ptask')">作为链接</div>
                  <div class="detail-7-1" @click="saveSetting(3, index,'Ptask')">作为图片</div>
                </div>
                <div class="detail-6" @click="deleteField(alarmFields, index)" >
                  <div class="bg-trash detail-6-1" v-show="alarmHover === index"></div>
                </div>
                <div class="detail-5" @click="showPopSetting('Ptask',index)" v-show="item.type === 2">
                  <div class="bg-pic detail-5-1" ></div>
                </div>
                <div class="detail-4" @click="showPopSetting('Ptask',index)" v-show="item.type === 1">
                  <div class="bg-linked detail-4-1" ></div>
                </div>
                <div class="detail-3" @click="showPopSetting('Ptask',index)"  v-show="item.type === 0 ">
                  <div class="bg-default detail-3-1" v-show="alarmHover === index"></div>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div v-show="alarmFields === null || alarmFields.length == 0">请从数据表字段拖拽添加</div>
        </div>
        <div class="select-footer">
          <span @click="showClearFieldPop(1)">全部清空</span>
        </div>
      </div>
      <!-- 筛选器 -->
      <div class="field-select">
        <div class="select-header">
          <span>筛选器</span>
          <!--<span class="fr pdr17">搜索</span>-->
        </div>
        <div class="select-content">
          <draggable element="span" v-model="selectorFields " :options="putOptions" :move="onMove"  @start="isDragging=true" @end="isDragging=false" >
            <transition-group name="no" class="list-group list-height" tag="ul">
              <li v-for="(item, index) in selectorFields " :key = 'index' @mousemove="selectHover = index" @mouseout="selectHover = ''" >
                <div class="detail-1">
                  <i></i>
                </div>
                <div class="detail-2 text-ellipsis">{{item.fieldDesc}}</div>
                <!--<div class="fr pdl12 pdr12 " @click="showPopSelect(index)" v-show="item.type === 4">文本</div>-->
                <!--<div class="fr pdl12 pdr12 " @click="showPopSelect(index)" v-show="item.type === 5">字典</div>-->
                <div class="detail-7" v-show="popSelect == index" v-clickoutside="closePopShow">
                  <div class="detail-7-1" @click="saveSetting(4, index)">文本输入框</div>
                  <div class="detail-7-1" @click="showDicSetting(index, item)" v-show="item.dataType != 3">固定字典</div>
                </div>
                <div class="detail-6" @click="deleteField(selectorFields, index)" >
                  <div class="bg-trash detail-6-1" v-show="selectHover === index"></div>
                </div>
                <div class="detail-5" v-show="item.dataType === 3"></div>
                <div class="detail-4" @click="showPopSelect(index)"  v-show="item.inputType === 1 && item.dataType !== 3">
                  <div class="bg-dict detail-4-1" ></div>
                </div>
                <div class="detail-3" @click="showPopSelect(index)"  v-show="item.inputType === 0 && item.dataType !== 3">
                  <div class="bg-default detail-3-1" v-show="selectHover === index"></div>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div v-show="selectorFields === null|| selectorFields.length == 0">请从数据表字段拖拽添加</div>
        </div>
        <div class="select-footer">
          <span @click="showClearFieldPop(2)">全部清空</span>
        </div>
      </div>
      <!-- 详情页面 -->
      <div class="field-select">
        <div class="select-header">
          <span>详情页面</span>
          <!--<span class="fr pdr17">搜索</span>-->
        </div>
        <div class="select-content">
          <draggable element="span" v-model="alarmDetailFields " :options="putOptions" :move="onMove"   @start="isDragging=true" @end="isDragging=false">
            <transition-group name="no" class="list-group list-height" tag="ul">
              <li v-for="(item, index) in alarmDetailFields " :key = 'index'  @mousemove="detailHover = index" @mouseout="detailHover = ''" >
                <div class="detail-1">
                  <i></i>
                </div>
                <div class="detail-2 text-ellipsis">{{item.fieldDesc}}</div>
                <div class="detail-7" v-show="detailSetting == index" v-clickoutside="closePopShow">
                  <div class="detail-7-1" @click="saveSetting(1, index, 'detail')">默认</div>
                  <div class="detail-7-1" @click="showLinkSetting(index, item, 'detail')">作为链接</div>
                  <div class="detail-7-1" @click="saveSetting(3, index, 'detail')">作为图片</div>
                </div>
                <div class="detail-6" @click="deleteField(alarmDetailFields, index)" >
                  <div class="bg-trash detail-6-1" v-show="detailHover === index"></div>
                </div>
                <div class="detail-5"  v-show="item.type === 2"  @click="showPopSetting('detail',index)">
                  <div class="bg-pic detail-5-1" ></div>
                </div>
                <div class="detail-4"  v-show="item.type === 1"  @click="showPopSetting('detail',index)">
                  <div class="bg-linked detail-4-1" ></div>
                </div>
                <div class="detail-3" v-show="item.type === 0" @click="showPopSetting('detail',index)">
                  <div class="bg-default detail-3-1" v-show="detailHover === index"></div>
                </div>
              </li>
            </transition-group>
          </draggable>
          <div class="bg-text " v-show="alarmDetailFields === null || alarmDetailFields.length == 0">请从数据表字段拖拽添加</div>
        </div>
        <div class="select-footer">
          <span @click="showClearFieldPop(3)">全部清空</span>
        </div>
      </div>
    </div>
    <div class="task-field-footer">
      <div @click="backStep(-1)">上一步</div>
      <div @click="nextStep(1)">下一步</div>
    </div>
    <task-field-clear-pop :clearFieldPop="clearFieldPop" :clearFlag="clearFlag" @clearAllField="clearAllField" @cancelFieldPop="cancelFieldPop"></task-field-clear-pop>
    <task-link-pop :linkPop="linkPop" :linkIndex="linkIndex" :linkType="linkType" :showText1="showText1" :showText2="showText2" :linkOption="linkOption" :fieldOption="fieldOption" :detail="details"  @saveLinkSetting="saveLinkSetting" @cancelLinkPop="cancelLinkPop"></task-link-pop>
    <task-dict-pop :dictPop="dictPop" :dicIndex="dicIndex" :dictOption="dictOption" @saveDictSetting="saveDictSetting" @cancelDictPop="cancelDictPop"></task-dict-pop>
  </div>
</template>

<script>
import TaskFieldClearPop from './TaskFieldClearPop'
import TaskLinkPop from './TaskLinkPop'
import TaskDictPop from './TaskDictPop'
import draggable from 'vuedraggable'
import {saveTaskFields, queryTaskFields} from '@/http/services/task_api'
import Clickoutside from 'element-ui/src/utils/clickoutside'

export default {
  name: 'TaskSetTaskField',
  components: {
    TaskFieldClearPop,
    TaskLinkPop,
    TaskDictPop,
    draggable
  },
  watch: {
    // 拖拽
    isDragging (newValue) {
      // console.log(newValue, 'newValue')
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.alarmFields.forEach((item, index) => {
          for (let i = index + 1; i < this.alarmFields.length; i++) {
            if (item.fieldName === this.alarmFields[i].fieldName) {
              this.alarmFields.splice(i, 1)
            }
          }
        })
        this.selectorFields.forEach((item, index) => {
          for (let i = index + 1; i < this.selectorFields.length; i++) {
            if (item.fieldName === this.selectorFields[i].fieldName) {
              this.selectorFields.splice(i, 1)
            }
          }
        })
        this.alarmDetailFields.forEach((item, index) => {
          for (let i = index + 1; i < this.alarmDetailFields.length; i++) {
            if (item.fieldName === this.alarmDetailFields[i].fieldName) {
              this.alarmDetailFields.splice(i, 1)
            }
          }
        })
        this.delayedDragging = false
      })
    },
    stepCurrent (val) {
      if (val === 1) {
        this.queryTaskFields()
      }
    }
  },
  computed: {
    // 拖拽
    dragOptions () {
      return {
        animation: 0,
        group: {name: 'description', pull: 'clone', put: false},
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    putOptions () {
      return {
        animation: 0,
        group: {name: 'description', pull: false, put: true},
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  data () {
    return {
      editable: true, // 拖拽
      isDragging: false, // 拖拽
      delayedDragging: false, // 拖拽
      popFlag: true, // 上一步弹窗
      taskName: this.$route.query.taskName, // 任务名称
      alarmFields: [], // 任务字段
      alarmFieldsCopy: [], // 任务字段
      selectorFields: [], // 任务字段
      selectorFieldsCopy: [], // 任务字段
      alarmDetailFields: [], // 任务字段
      alarmDetailFieldsCopy: [], // 任务字段
      details: '',
      alarmHover: false, // 显示隐藏更多按钮
      selectHover: false, // 显示隐藏更多按钮
      detailHover: false, // 显示隐藏更多按钮
      selectButton: false, // 添加全部字段弹窗
      popSetting: null, // 字段设置弹窗
      detailSetting: null,
      popSelect: null, // 字段设置弹窗
      clearFieldPop: false, // 清空字段
      clearFlag: null,
      linkPop: false, // 设置链接
      linkIndex: null,
      linkOption: null, // 链接弹框信息
      dictPop: false,
      dictOption: null, // 字典弹框信息
      dicIndex: null, // 设置字典
      showText: '',
      showText1: '',
      showText2: '',
      linkType: ''
    }
  },
  props: {
    stepCurrent: Number,
    taskId: String,
    fieldOption: Array,
    columns1: Array, // 工作表预览
    columns1String: Array // 临时筛选条件
  },
  created () {

  },
  methods: {
    // 全部加入弹窗
    selectAllButton () {
      this.selectButton = !this.selectButton
    },
    // 关闭弹窗
    closePopShow () {
      this.popSetting = null
      this.popSelect = null
      this.detailSetting = null
    },
    // 删除字段
    deleteField (fields, index) {
      fields.splice(index, 1)
    },
    // 拖拽
    onMove ({relatedContext, draggedContext}) {
      // const relatedElement = relatedContext.element
      // const draggedElement = draggedContext.element
      return true
    },
    // 下一步
    nextStep () {
      this.popFlag = false
      this.saveTaskFields()
    },
    // 上一步
    backStep () {
      if (this.popFlag || !this.alarmFieldsCopy.equals(this.alarmFields) || !this.selectorFieldsCopy.equals(this.selectorFields) || !this.alarmDetailFieldsCopy.equals(this.alarmDetailFields)) {
        this.$confirm('离开当前页面将不保存本次配置，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('queryWorkList', 0, this.taskId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$emit('queryWorkList', 0, this.taskId)
      }
    },
    // 查询任务字段
    queryTaskFields () {
      queryTaskFields({taskId: this.taskId}).then(res => {
        // this.alarmFields = res.data.result.alarmFields
        // this.selectorFields = res.data.result.selectorFields
        // this.alarmDetailFields = res.data.result.alarmDetailFields
        this.alarmFields = res.data.result.titleField ? res.data.result.titleField : []
        this.selectorFields = res.data.result.selectField ? res.data.result.selectField : []
        this.alarmDetailFields = res.data.result.detailInfo ? res.data.result.detailInfo : []
        this.alarmFieldsCopy = JSON.parse(JSON.stringify(this.alarmFields))
        this.selectorFieldsCopy = JSON.parse(JSON.stringify(this.selectorFields))
        this.alarmDetailFieldsCopy = JSON.parse(JSON.stringify(this.alarmDetailFields))
      }).catch(error => {
        console.log(error)
      })
    },
    // 全部添加字段
    addField (flag) {
      switch (flag) {
        case 1:
          this.alarmFields = this.coppyArray(this.fieldOption)
          break
        case 2:
          this.selectorFields = this.coppyArray(this.fieldOption)
          break
        case 3:
          this.alarmDetailFields = this.coppyArray(this.fieldOption)
          break
      }
    },
    // 清空字段
    clearField (flag) {
      switch (flag) {
        case 1:
          this.alarmFields = []
          break
        case 2:
          this.selectorFields = []
          break
        case 3:
          this.alarmDetailFields = []
          break
      }
    },
    // 字段选择弹窗
    showPopSetting (type, index) {
      if (type === 'Ptask') {
        this.popSetting = index
        this.details = 'Ptask'
      } else {
        this.detailSetting = index
        this.details = 'detail'
      }
    },
    // 字段选择弹窗
    showPopSelect (index) {
      this.popSelect = index
    },
    // 显示字段弹窗
    showClearFieldPop (flag) {
      this.clearFieldPop = true
      this.clearFlag = flag
    },
    // 取消字段弹窗
    cancelFieldPop () {
      this.clearFieldPop = false
    },
    // 清空全部字段
    clearAllField () {
      this.clearFieldPop = false
      this.clearField(this.clearFlag)
    },
    // 显示链接弹窗
    showLinkSetting (index, item, type) {
      this.popSetting = null
      this.linkPop = true
      this.linkOption = item
      this.linkIndex = index
      this.details = type
      if (item.linkType === '0') {
        this.linkType = '0'
        this.showText = ''
      } else if (item.linkType === '1') {
        this.linkType = '1'
        this.showText1 = item.showText
      } else if (item.linkType === '2') {
        this.linkType = '2'
        this.showText2 = item.showText
      }
    },
    // 取消链接弹窗
    cancelLinkPop () {
      this.linkPop = false
    },
    // 保存链接弹窗设置
    saveLinkSetting (index, linkType, showText1, showText2, type) {
      this.popSetting = null
      this.linkPop = false
      let fieldOpt = type === 'Ptask' ? this.alarmFields : this.alarmDetailFields
      fieldOpt[index].type = 1
      fieldOpt[index].linkType = linkType
      if (linkType === '0') {
        fieldOpt[index].showText = ''
      } else if (linkType === '1') {
        fieldOpt[index].showText = showText1
      } else if (linkType === '2') {
        fieldOpt[index].showText = showText2
      }
    },
    // 显示字典弹窗
    showDicSetting (index, item) {
      this.popSelect = null
      this.dictOption = item
      this.dictPop = true
      this.dicIndex = index
    },
    // 取消字典弹窗
    cancelDictPop () {
      this.dictPop = false
    },
    // 保存字典弹窗设置
    saveDictSetting (index, dicId, selectType, showType) {
      this.popSelect = null
      this.dictPop = false
      this.selectorFields[index].inputType = 1
      this.selectorFields[index].dicId = dicId
      this.selectorFields[index].selectType = selectType
      this.selectorFields[index].showType = showType
    },
    // 字段保存弹窗设置
    saveSetting (flag, index, type) {
      let fieldOpt
      if (type === 'Ptask') {
        fieldOpt = this.alarmFields
      } else {
        fieldOpt = this.alarmDetailFields
      }
      this.popSetting = null
      this.detailSetting = null
      this.popSelect = null
      switch (flag) {
        case 1:
          fieldOpt[index].type = 0
          break
        case 3:
          fieldOpt[index].type = 2
          break
        case 4:
          this.selectorFields[index].inputType = 0
          break
      }
    },
    // 保存任务字段
    saveTaskFields (flag) {
      let params = {
        taskId: this.taskId,
        alarmFields: [],
        selectorFields: [],
        alarmDetailFields: []
      }
      if (this.alarmFields) {
        this.alarmFields.forEach((item) => {
          let alarmFields = {
            fieldDesc: '',
            fieldName: '',
            type: 0,
            linkType: 0,
            showText: ''
          }
          Object.keys(alarmFields).forEach((name) => {
            alarmFields[name] = item[name]
          })
          params.alarmFields.push(alarmFields)
        })
      }
      if (this.selectorFields) {
        this.selectorFields.forEach((item) => {
          let selectorFields = {
            fieldDesc: '',
            fieldName: '',
            dataType: 0,
            dicId: '',
            inputType: 0,
            selectType: '',
            showType: ''
          }
          Object.keys(selectorFields).forEach((name) => {
            selectorFields[name] = item[name]
          })
          params.selectorFields.push(selectorFields)
        })
      }
      if (this.alarmDetailFields) {
        this.alarmDetailFields.forEach((item) => {
          let alarmDetailFields = {
            fieldDesc: '',
            fieldName: '',
            type: 0,
            linkType: 0,
            showText: ''
          }
          Object.keys(alarmDetailFields).forEach((name) => {
            alarmDetailFields[name] = item[name]
          })
          params.alarmDetailFields.push(alarmDetailFields)
        })
      }
      saveTaskFields(params).then(res => {
        this.taskId = res.data.result.taskId
        this.alarmFields = []
        this.selectorFields = []
        this.alarmDetailFields = []
        this.$emit('saveTaskFieldSucc', 2, this.taskId)
      }).catch(error => {
        console.log(error)
      })
    },
    // copy一个对象,改变对象的this指向
    coppyArray (arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    }
  },
  directives: { Clickoutside }
}
</script>
