<template>
  <div class="hide"></div>
</template>
<script>
import '@/lib/mqttws31'
export default {
  data () {
    return {
      client: null,
      times: 1,
      topic: 'pc/web/' + this.getCookie('userId'),
      mqttHost: '127.0.0.1',
      mqttPort: 19001,
      mqttUser: 'haizhi',
      path: '/pc_web',
      mqttPassword: 'MpK2dTV8P',
      clientId: 'web_' + this.getCookie('userId')
    }
  },
  created () {
    this.taskMqtt()
  },
  methods: {
    getCookie (cname) {
      let arr
      let reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) return arr[2]
      else return null
    },
    startSub () {
      this.createNewMqtt()
      this.client.connect({
        userName: this.mqttUser,
        password: this.mqttPassword,
        keepAliveInterval: 10,
        cleanSession: false,
        onSuccess: this.onConnectSuccess,
        onFailure: this.errorFailure
      })
    },
    createNewMqtt () {
      this.client = new window.Paho.MQTT.Client(
        this.mqttHost,
        this.mqttPort,
        this.path,
        this.clientId + '_' + Date.now()
      )
      this.client.onConnectionLost = this.onConnectionLost
      this.client.onMessageArrived = this.onMessageArrived
      return this.client
    },
    errorFailure () {
      this.reconnectSocket()
    },
    onConnectionLost (responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
        this.reconnectSocket()
      }
    },
    onConnectSuccess () {
      console.log('mqtt connected success, subscribe topic: ' + this.topic)
      this.client.subscribe(this.topic) // 订阅主题
    },
    reconnectSocket () {
      setTimeout(() => {
        if (!this.client) {
          this.createNewMqtt()
        }
        this.client.connect({
          userName: this.mqttUser,
          password: this.mqttPassword,
          keepAliveInterval: 10,
          cleanSession: false,
          onSuccess: this.onConnectSuccess,
          onFailure: this.errorFailure
        })
      }, 4000)
    },
    onMessageArrived (message) {
      // 直接拿message.payloadString就是服务端传来的消息
      // console.log('收到消息:' + message.payloadString)

      this.$eventHub.$emit('messagePush', message.payloadString)
    },
    closeSub () {
      console.log('退出登录，断开连接', this.client)
      if (this.client) {
        // topic.forEach(function (value) {
        //   client.unsubscribe(value)
        // })
        this.client.unsubscribe(this.topic)
        this.client.disconnect()
      }
    },
    taskMqtt () {
      setInterval(() => {
        if (this.client) {
          if (!this.client.isConnected()) {
            this.reconnectSocket()
          }
        } else if (this.getCookie('userId')) {
          this.startSub()
        }
      }, 10000)
    }
  }
}
</script>
