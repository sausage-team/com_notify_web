import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import alarm from '@/components/alarm/alarm'
import task from '@/components/task/task'
import AddTask from '@/components/task/task_add'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'alarm',
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
    },
    {
      path: '/task',
      name: 'task',
      component: task
    }, {
      path: '/add_task',
      name: 'AddTask',
      component: AddTask
    }
  ]
})
