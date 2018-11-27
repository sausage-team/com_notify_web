// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import iView from 'iview'
import VueCookies from 'vue-cookies'

import 'element-ui/lib/theme-chalk/index.css'
import 'iview/dist/styles/iview.css'
import '@/assets/sass/main.scss'

import './utils'

import router from './router'
import store from './stores'
import httpFilter from './http/config'
import filter from './filters'
import App from './App'

Vue.prototype.notification = (msg) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification')
  } else if (Notification.permission === 'granted') {
    return new Notification(msg)
  } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        return new Notification(msg)
      }
    })
  }
}

Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(iView)
Vue.use(Vuex)
Vue.use(VueCookies)
Vue.use(filter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  httpFilter,
  store,
  components: { App },
  template: '<App/>'
})
