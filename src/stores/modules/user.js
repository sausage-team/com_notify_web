import '@/lib/mqttws31'
import VueCookies from 'vue-cookies'

const state = {
  client: null,
  times: 1,
  topic: 'pc/web/' + VueCookies.get('userId'),
  mqttHost: '192.168.0.104',
  mqttPort: 19001,
  mqttUser: 'haizhi',
  path: '/pc_web',
  mqttPassword: 'MpK2dTV8P',
  clientId: 'web_' + VueCookies.get('userId')
}

const actions = {
  startSub ({ state, commit, rootState }) {
    commit('createNewMqtt')
    state.client.onConnectionLost = commit('onConnectSuccess')
    state.client.onMessageArrived = this.onMessageArrived
    state.client.connect({
      userName: state.mqttUser,
      password: state.mqttPassword,
      keepAliveInterval: 10,
      cleanSession: false,
      onSuccess: state.onConnectSuccess,
      onFailure: state.errorFailure
    })
  }
}

const mutations = {
  onConnectSuccess (state) {
    console.log('mqtt connected success, subscribe topic: ' + state.topic)
    state.client.subscribe(state.topic) // 订阅主题
  },
  createNewMqtt (state) {
    state.client = new window.Paho.MQTT.Client(
      state.mqttHost,
      state.mqttPort,
      state.path,
      state.clientId + '_' + Date.now()
    )
    return state.client
  }
}

const getters = {
}

export default {
  state,
  actions,
  mutations,
  getters
}
