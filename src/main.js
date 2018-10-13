// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import iView from 'iview'

import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import '@/assets/sass/main.scss'

import './utils/util'
import './lib/mqttws31'

import router from './router'
import store from './stores'
import httpFilter from './http/filters'
import filter from './utils/filter'
import App from './App'

Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(iView)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(filter)

Vue.prototype.filterStatus = function (flag, val) {
  var res = ''
  if (flag === 0) {
    if (val === 0) {
      res = '已发送'
    } else if (val === 1) {
      res = '已反馈'
    } else if (val === 2) {
      res = '已签收'
    }
  }
  return res
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  httpFilter,
  store,
  components: { App },
  template: '<App/>'
})
