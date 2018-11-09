import VueCookies from 'vue-cookies'
// import '@/lib/mqttws31.js'
const mqtt = require('mqtt')
const url = require('url')

const state = {
  client: null,
  times: 1,
  topic: '',
  mqttHost: '',
  mqttPort: 0,
  mqttUser: '',
  mqttPassword: '',
  clientId: '',
  onConnectionLost: null,
  onMessageArrived: null,
  onConnectSuccess: null,
  errorFailure: null
}

const actions = {
  initClient ({state}) {
    state.client = mqtt.connect(url.parse(`ws://${state.mqttHost}:${state.mqttPort}`), {
      clientId: state.clientId,
      username: state.mqttUser,
      password: state.mqttPassword,
      path: '/mqtt'
    })
  },
  initConnect ({state}) {
    state.client.on('connect', () => {
      console.log('mqtt 连接成功')
    })
  },
  initSubscribe () {
    state.client.subscribe(state.topic, () => {
      console.log(`${state.topic} 订阅成功`)
    })
  },

  taskMqtt ({state, dispatch}, hand) {
    if (VueCookies.get('userId')) {
      state.topic = `pc/web/${VueCookies.get('userId')}`
      state.clientId = `web_${VueCookies.get('userId')}`
      state.mqttUser = `${VueCookies.get('username') ? VueCookies.get('username') : 'haizhi'}`
      state.mqttPassword = `${VueCookies.get('token')}`
    }
    if (VueCookies.get('token')) {
      if (VueCookies.get('mqtt_ws')) {
        state.mqttHost = VueCookies.get('mqtt_ws').split(':')[0]
        state.mqttPort = parseInt(VueCookies.get('mqtt_ws').split(':')[1])
        if (!state.client) {
          dispatch('initClient')
          dispatch('initSubscribe').then(() => {
            state.client.on('message', (topic, message, data) => {
              console.log(message.toString())
              if (hand) {
                hand(message.toString())
              }
            })
          })
        }
        if (!state.client.connected) {
          dispatch('initConnect')
        }
      }
    }
  },

  closeSub () {
    console.log('退出登录，断开连接', state.topic)
    if (state.client) {
      state.client.unsubscribe(state.topic)
      if (state.client.connected) {
        state.client.end()
      }
      setTimeout(() => {
        state.client = null
      })
    }
  }
}

const getters = {
}

const mutations = {
}

export default {
  state,
  actions,
  mutations,
  getters
}
