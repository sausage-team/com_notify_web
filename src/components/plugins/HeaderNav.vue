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
          <li class="inner-title" :class="[index === workListIndex ? 'li-select' : '']" v-for="(item, index) in workList" :key = 'index' @click="getTask(item.taskId, item.taskName, item.msgCount, index)">
            {{item.taskName}}
            <span class="count" v-if="item.msgCount > 0 && item.msgCount < 100">{{item.msgCount}}</span>
            <span class="count" v-if="item.msgCount >= 100">…</span>
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
          <source src="http://101.236.19.193/bell/72596.mp3" type="audio/mpeg">
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
          <!--<li class="h32 lh32 pdl16 pdr8 pointer">重点人员管理</li>-->
          <li @click="goSetting" v-show="username.includes('admin')">预警任务管理</li>
          <!--<li class="h32 lh32 pdl16 pdr8 pointer">用户中心</li>-->
          <!--<li class="h32 lh32 pdl16 pdr8 pointer">个人管理</li>-->
          <li class="setting-line" v-show="username.includes('admin')"></li>
          <li class="setting-out" @click="signOut">退出</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { signOut, updateSoundStatus } from '@/http/services/user_api'
import { getTaskTitleList } from '@/http/services/task_api'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import '@/lib/mqttws31'
import { startSub, closeSub } from "@/utils/mqtt"
export default {
  name: 'HeaderNav',
  data () {
    return {
      hideMenu: false,
      popShow: false,
      title: '海致数据推送中心',
      subTitle: 'Intellgence PushCenter',
      username: localStorage.getItem('username'),
      volstatus: localStorage.getItem('userSoundStatus'),
      userSoundURL: localStorage.getItem('userSoundURL'),
      workList: [],
      workListIndex: null,
      taskId: '',
      taskName: '',
      msgCount: null,
      left: 0,
      navWidth: 2000,
      distant: '',
      flag: false,
      client: new Paho.MQTT.Client(
        '101.236.53.175',
        8083,
        'web_' + this.getCookie('userId')
      ),
      topic: '/web/groupid/' + this.getCookie('userId')
    }
  },
  created () {
    this.socketEvent()
    this.getTaskTitleList()
    if(this.$route.name === 'task' || this.$route.name === 'AddTask') {
      this.hideMenu = true;
    }
    // startSub()
    // this.client.connect({
    //   userName: 'web',
    //   password: this.getCookie('userToken'),
    //   keepAliveInterval: 10,
    //   onSuccess: this.onConnect,
    //   onFailure: this.errorFailure
    // }) // 连接服务器并注册连接成功处理事件
    // this.client.onConnectionLost = this.onConnectionLost
    // this.client.onMessageArrived = this.onMessageArrived // 注册消息接收处理事件
    // this.client.disconnect();
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
          closeSub()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 查询任务列表
    getTaskTitleList () {
      getTaskTitleList('')
        .then(res => {
          this.workList = res.data.result
          this.workList.forEach((i) => {
            if(i.taskName.length > 9){
              i.taskName = i.taskName.substring(0, 9) + "..."
            }
          })
          this.taskId = this.workList[0].taskId
          this.taskName = this.workList[0].taskName
          this.msgCount = this.workList[0].msgCount
          this.workListIndex = 0
          if (this.$route.path === '/alarm') {
            this.getTask(this.taskId, this.taskName, this.msgCount)
          }
          // 导航条宽度
          this.navWidth = this.workList.length * 144
          // 每次移动距离
          this.distant = document.getElementsByClassName('header-center-inner')[0].clientWidth
        })
        .catch(error => {
          console.log(error)
        })


    },
    // 查询预警列表
    getTask (taskId, taskName, msgCount, index) {
      this.workListIndex = index ? index : 0
      this.$router.push('/alarm')
      this.$emit('getTask', taskId, taskName, msgCount)
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
        if (+item.taskId === taskId) {
          this.workList[index].msgCount = 0
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
    // socket
    // 断开连接
    onConnectionLost: function (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
        this.reconnectSocket()
      }
    },
    // 接收到的消息
    onMessageArrived: function (message) {
      // 直接拿message.payloadString就是服务端传来的消息
      // console.log('收到消息:' + message.payloadString)
      this.socketEvent(message.payloadString)
    },
    // 连接成功
    onConnect: function () {
      console.log('onConnected')
      this.client.subscribe(this.topic) // 订阅主题
    },
    // 连接失败
    errorFailure: function () {
      this.reconnectSocket()
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
      this.$eventHub.$on('messagePush', (messageString)=>{
        let message = JSON.parse(messageString)
        this.workList.forEach((item, index) => {
          if (+item.taskId === +message.messageBody.taskId) {
            this.workList[index].msgCount++
          }
        })
      })
    },
    closePopShow () {
      this.popShow = false
    },
    // websocket长连接
    reconnectSocket () {
      setTimeout(() => {
        this.client = new Paho.MQTT.Client(
          '101.236.53.175',
          8083,
          'web_' + this.getCookie('userId')
        );
        this.client.connect({
          userName: 'web',
          password: this.getCookie('userToken'),
          keepAliveInterval: 10,
          onSuccess: this.onConnect,
          onFailure: this.errorFailure
        })
      }, 4000)
    }
  },
  directives: { Clickoutside }
}
</script>

