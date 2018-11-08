import '@/lib/mqttws31'
import VueCookies from 'vue-cookies'

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
  initOnConnectionLost ({state}) {
    state.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
        setTimeout(() => {
          if (!state.client) {
            state.client = new window.Paho.MQTT.Client(
              state.mqttHost,
              state.mqttPort,
              state.clientId
            )
          }
          state.client.connect({
            userName: state.mqttUser,
            password: state.mqttPassword,
            keepAliveInterval: 10,
            cleanSession: false,
            onSuccess: state.onConnectSuccess,
            onFailure: state.errorFailure
          })
        }, 4000)
      }
    }
  },

  initOnMessageArrived ({state}, hand) {
    state.onMessageArrived = (message) => {
      // 直接拿message.payloadString就是服务端传来的消息
      console.log('收到消息:' + message.payloadString)
      if (hand) {
        hand(message.payloadString)
      }
    }
  },

  initOnConnectSuccess ({state}) {
    if (!state.onConnectSuccess) {
      state.onConnectSuccess = () => {
        console.log('mqtt connected success, subscribe topic: ' + state.topic)
        state.client.subscribe(state.topic)
      }
    }
  },

  initErrorFailure ({state}) {
    if (!state.errorFailure) {
      state.errorFailure = () => {
        setTimeout(() => {
          if (!state.client) {
            state.client = new window.Paho.MQTT.Client(
              state.mqttHost,
              state.mqttPort,
              state.clientId
            )
          }
          state.client.connect({
            userName: state.mqttUser,
            password: state.mqttPassword,
            keepAliveInterval: 10,
            cleanSession: false,
            onSuccess: state.onConnectSuccess,
            onFailure: state.errorFailure
          })
        }, 4000)
      }
    }
  },

  taskMqtt ({state, dispatch}, hand) {
    if (VueCookies.get('userId')) {
      state.topic = `pc/web/${VueCookies.get('userId')}`
      state.clientId = `web_${VueCookies.get('userId')}`
      state.mqttUser = `${VueCookies.get('username') ? VueCookies.get('username') : 'haizhi'}`
      state.mqttPassword = `${VueCookies.get('token')}`
    }
    setInterval(() => {
      if (VueCookies.get('token')) {
        if (VueCookies.get('mqtt_ws')) {
          state.mqttHost = VueCookies.get('mqtt_ws').split(':')[0]
          state.mqttPort = parseInt(VueCookies.get('mqtt_ws').split(':')[1])
          if (state.client) {
            if (!state.client.isConnected()) {
              setTimeout(() => {
                if (!state.client) {
                  state.client = new window.Paho.MQTT.Client(
                    state.mqttHost,
                    state.mqttPort,
                    state.clientId
                  )
                }
                state.client.connect({
                  userName: state.mqttUser,
                  password: state.mqttPassword,
                  keepAliveInterval: 10,
                  cleanSession: false,
                  onSuccess: state.onConnectSuccess,
                  onFailure: state.errorFailure
                })
              }, 4000)
            }
          } else if (VueCookies.get('userId')) {
            dispatch('startSub', hand)
          }
        }
      }
    }, 10000)
  },

  startSub ({state, dispatch}, hand) {
    dispatch('createNewMqtt', hand).then(() => {
      dispatch('initOnConnectSuccess').then(() => {
        dispatch('initErrorFailure').then(() => {
          state.client.connect({
            userName: state.mqttUser,
            password: state.mqttPassword,
            keepAliveInterval: 10,
            cleanSession: false,
            onSuccess: state.onConnectSuccess,
            onFailure: state.errorFailure
          })
        })
      })
    })
  },

  createNewMqtt ({state, dispatch}, hand) {
    dispatch('initOnConnectionLost').then(() => {
      dispatch('initOnMessageArrived', hand).then(() => {
        state.client = new window.Paho.MQTT.Client(
          state.mqttHost,
          state.mqttPort,
          state.clientId
        )
        state.client.onConnectionLost = state.onConnectionLost
        state.client.onMessageArrived = state.onMessageArrived
      })
    })
  },

  closeSub () {
    console.log('退出登录，断开连接', state.client, state.topic)
    if (state.client) {
      state.client.unsubscribe(state.topic)
      if (state.client.isConnected()) {
        state.client.disconnect()
      }
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
