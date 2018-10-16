<template>
  <div class="hide" @startHub="startSub"></div>
</template>
<script>
import '@/lib/mqttws31'
export default {
  data () {
    return {
      client: null,
      mqttStr: '',
      times: 1,
      topic: 'pc/web/' + this.$cookies.get('userId'),
      mqttHost: '',
      mqttPort: 0,
      mqttUser: 'haizhi',
      path: '/pc_web',
      mqttPassword: 'MpK2dTV8P',
      clientId: 'web_' + this.$cookies.get('userId')
    }
  },
  created () {
    this.taskMqtt()
  },
  methods: {
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
        this.client.unsubscribe(this.topic)
        this.client.disconnect()
      }
    },
    taskMqtt () {
      setInterval(() => {
        if (this.$cookies.get('token')) {
          if (this.$cookies.get('mqtt_ws')) {
            this.mqttHost = this.$cookies.get('mqtt_ws').split(':')[0]
            this.mqttPort = parseInt(this.$cookies.get('mqtt_ws').split(':')[1])
            if (this.client) {
              if (!this.client.isConnected()) {
                this.reconnectSocket()
              }
            } else if (this.$cookies.get('userId')) {
              this.startSub()
            }
          }
        }
      }, 10000)
    }
  }
}
</script>
