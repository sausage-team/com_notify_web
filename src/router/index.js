import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import alarm from '@/components/alarm/alarm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'alarm_default',
      component: alarm
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: alarm
    }
  ]
})
