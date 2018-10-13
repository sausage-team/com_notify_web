<template>
  <div class="header">
     <div class="header-left">
      <div class="header-left-img"></div>
      <div class="header-left-title">
        <div class="title-item1">{{title}}</div>
        <div class="title-item2">{{subTitle}}</div>
      </div>
    </div>
    <div class="header-center" :class="(navWidth <= distant || hideMenu) ? ('long') : ('')">
      <div class="header-center-inner" v-show="!hideMenu">
        <div class="layer-left" v-show="left < 0"></div>
        <div class="layer-right" v-show="left > distant - navWidth"></div>
        <ul class="header-nav" :style="{ left: left + 'px', width: this.navWidth +'px'}" >
          <li class="inner-title" :class="[index === workListIndex ? 'li-select' : '']" v-for="(item, index) in workList"
              :key = 'index' @click="getTask(item.id, item.msgCount)">
            <span>{{item.name}}</span>
            <span class="count" v-show="item.msgCount > 0" :ref="`msg_count_${item.id}`">
              {{(item.msgCount >= 100)?('...'):(item.msgCount)}}
            </span>
            <!--<span class="count" v-if="item.msgCount > 0 && item.msgCount < 100">{{item.msgCount}}</span>-->
            <span class="count" v-show="item.msgCount >= 100">…</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="header-right" :class="((navWidth <= distant) || hideMenu) ? ('short') : ('')">
      <div class="header-right-button" :class="(left === 0 || left <= distant - navWidth - 30) ? 'only-one' : ''" v-show="navWidth > distant && !hideMenu">
        <div class="header-right-button-left" v-show="left > 0" @click="goLeft">
          <i class="arrow-left"></i>
        </div>
        <div class="header-right-button-right" v-show="left >= distant - navWidth - 30"  @click="goRight">
          <i class="arrow-right"></i>
        </div>
      </div>
      <div class="header-right-setting" >
        <div class="bor-seq" v-show="navWidth > distant && !hideMenu"></div>
        <div class="audio-on" v-show="volstatus == 1" @click="setVolswitch(0)"></div>
        <div class="audio-off" v-show="volstatus != 1" @click="setVolswitch(1)"></div>
        <div class="setting-icon" @click="popShow = !popShow" v-clickoutside="closePopShow"></div>
        <audio id='tipAudio'>
          <source src="../../assets/medias/notify.mp3" type="audio/mpeg">
          您的浏览器不支持 audio 元素。
        </audio>
      </div>
      <div class="setting">
        <ul class="setting-content" v-show="popShow">
          <li class="setting-line">
            <div class="user">
              <i class="user-icon"></i>
            </div>
            <div class="title">{{username}}</div>
          </li>
          <!-- <li>重点人员管理</li> -->
          <!-- <li @click="goSetting" v-show="username.includes('admin')">预警任务管理</li> -->
          <!-- <li>用户中心</li> -->
          <!-- <li>个人管理</li> -->
          <!-- <li class="setting-line" v-show="username.includes('admin')"></li> -->
          <li class="setting-out" @click="signOut">退出</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {signOut, updateSoundStatus} from '@/http/services/user_api'
import {getMsgTaskList} from '@/http/services/alarm_api'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import VueCookies from 'vue-cookies'
export default {
  name: 'HeaderNav',
  data () {
    return {
      hideMenu: false,
      popShow: false,
      title: '海致数据推送中心',
      subTitle: 'Intellgence PushCenter',
      username: VueCookies.get('username'),
      volstatus: localStorage.getItem('userSoundStatus'),
      // userSoundURL: VueCookies.get('userSoundURL'),
      workList: [],
      workListIndex: null,
      taskId: '',
      taskName: '',
      msgCount: 0,
      left: 0,
      navWidth: 2000,
      distant: '',
      flag: false
    }
  },
  created () {
    this.socketEvent()
    this.getTaskList()
    if (this.$route.name === 'task' || this.$route.name === 'AddTask') {
      this.hideMenu = true
    }

    setTimeout(() => {

    })
  },
  methods: {

    // 设置
    goSetting () {
      this.$router.push({ path: '/task' })
      this.popShow = false
    },
    // 登出
    signOut () {
      signOut('')
        .then(res => {
          this.$router.push('/login')
          this.popShow = false
          this.$emit('closeSub')
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 查询任务列表
    getTaskList () {
      getMsgTaskList().then(res => {
        this.workList = res.data.data
        this.workList.forEach((i) => {
          if (i.name.length > 9) {
            i.name = i.name.substring(0, 9) + '...'
          }
          if (!i.msgCount) {
            i.msgCount = 0
          }
        })

        this.taskId = this.workList[0].id
        this.taskName = this.workList[0].name
        this.msgCount = this.workList[0].msgCount
        this.workListIndex = 0
        if (this.$route.path === '/alarm') {
          this.getTask(this.taskId, this.msgCount)
        }
        // 导航条宽度
        this.navWidth = this.workList.length * 144
        // 每次移动距离
        if (document.getElementsByClassName('header-center-inner')[0]) {
          this.distant = document.getElementsByClassName('header-center-inner')[0].clientWidth
        } else {
          this.distant = 0
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 查询预警列表
    getTask (taskId, msgCount) {
      // this.workListIndex = index || 0
      this.$router.push('/alarm')
      this.$emit('getTask', taskId, msgCount)
    },
    // 设置声音开关
    setVolswitch (index) {
      updateSoundStatus({userSoundStatus: index}).then(res => {
        this.volstatus = index
        localStorage.setItem('userSoundStatus', index)
      }).catch(error => {
        console.log(error)
      })
    },
    // 清除socket消息提示
    clearMsg (taskId) {
      this.workList.forEach((item, index) => {
        if (item.id === taskId) {
          this.workList[index].msgCount = 0
          this.$refs[`msg_count_${item.id}`][0].innerHTML = 0
          this.$refs[`msg_count_${item.id}`][0].style.display = 'none'
        }
      })
    },
    // 向右移动
    goRight () {
      if (this.navWidth < this.distant) return
      this.left -= this.distant
      if (this.left < this.distant - this.navWidth) {
        this.left = this.distant - this.navWidth - 30
      }
    },
    // 向左移动
    goLeft () {
      this.left += this.distant
      if (this.left > 0) {
        this.left = 0
      }
    },
    // 获取cookie
    getCookie: function (cname) {
      let arr
      let reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return arr[2]
      else return null
    },
    // socket监听
    socketEvent () {
      this.$eventHub.$on('messagePush', (messageString) => {
        let message = JSON.parse(messageString)
        if (localStorage.getItem('userSoundStatus')) {
          if (parseInt(localStorage.getItem('userSoundStatus')) === 1) {
            if (this.soundTimeout) {
              clearTimeout(this.soundTimeout)
              if (this.times >= 6) {
                setTimeout(() => {
                  this.times = 1
                }, 10000)
                return
              }
            }
            this.soundTimeout = setTimeout(() => {
              document.getElementById('tipAudio').play()
              this.times++
            }, 1000)
          }
        }
        this.workList.forEach((item) => {
          if (message.task_id && item.id === message.task_id) {
            item.msgCount++
            if (item.msgCount > 0) {
              this.$refs[`msg_count_${item.id}`][0].style.display = 'inline-block'
              if (item.msgCount >= 100) {
                this.$refs[`msg_count_${item.id}`][0].innerHTML = '...'
              } else {
                this.$refs[`msg_count_${item.id}`][0].innerHTML = item.msgCount
              }
            } else {
              this.$refs[`msg_count_${item.id}`][0].style.display = 'none'
            }
          }
        })
      })
    },
    closePopShow () {
      this.popShow = false
    }
  },
  directives: { Clickoutside }
}
</script>
