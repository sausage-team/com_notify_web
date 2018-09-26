import Vue from 'vue'
import VueCookies from 'vue-cookies'

let client = null
let times = 1
let topic = '/web/groupid/' + getCookie('userId')

// 获取cookie
function getCookie(cname) {
  let arr
  let reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return arr[2]
  else return null
}

// 开启订阅（登录成功后调用）
export const startSub = () => {
  client = new Paho.MQTT.Client(
    '101.236.53.175',
    8083,
    'web_' + getCookie('userId')
  );
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  client.connect({
    userName: 'web',
    password: getCookie('userToken'),
    keepAliveInterval: 10,
    onSuccess: onConnect,
    onFailure: errorFailure
  });

  // 连接成功
  function onConnect() {
    console.log('onConnected')
    let topic = '/web/groupid/' + getCookie('userId')
    client.subscribe(topic) // 订阅主题
  }

  // 连接失败
  function errorFailure() {
    reconnectSocket()
  }

  // 断开连接
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
      console.log('连接已断开')
      reconnectSocket()
    }
  }

  // 接收到的消息
  function onMessageArrived(message) {
    // 直接拿message.payloadString就是服务端传来的消息
    console.log('收到消息:' + message.payloadString)
    
    if (VueCookies.get('userSoundStatus') == 1) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        if (times >= 6) {
          setTimeout(function () {
            times = 1
          }, 10000)
          return
        }
      }
      this.timeoutId = setTimeout(function () {
        document.getElementById("tipAudio").play()
        times++
      }, 1000)
    }
    new Vue().$eventHub.$emit('messagePush', message.payloadString)
  }

  // websocket长连接
  function reconnectSocket() {
    setTimeout(() => {
      client = new Paho.MQTT.Client(
        '101.236.53.175',
        8083,
        'web_' + getCookie('userId')
      );
      client.connect({
        userName: 'web',
        password: getCookie('userToken'),
        keepAliveInterval: 10,
        onSuccess: onConnect,
        onFailure: errorFailure
      })
    }, 4000)
  }
  Vue.prototype.$mqtt = client // 方便在vue组件中可以直接使用this.$mqtt -> client
}


// 关闭订阅（退出登录时调用）
export const closeSub = () => {
  console.log('退出登录，断开连接', client);
  if (client) {
    topic.forEach(function (value) {
      client.unsubscribe(value);
    });
    client.disconnect();
  }
}

export const getNewMQTT = () => {
  return new Paho.MQTT.Client(
    '101.236.53.175',
    8083,
    'web_' + getCookie('userId')
  )
}