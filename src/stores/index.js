import Vue from 'vue'
import Vuex from 'vuex'

const files = require.context('./modules/', false, /\.js$/)
const modules = {}

files.keys().forEach(item => {
  const tmpKey = item.replace(/.\//g, '').replace(/.js/g, '')
  modules[tmpKey] = files(item).default
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules
})
