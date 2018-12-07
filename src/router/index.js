import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import main from '@/pages/main'
import messages from '@/pages/main/message'
import follows from '@/pages/main/follow'
import pushes from '@/pages/main/push'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        // 消息盒子
        {
          path: '/messages',
          name: 'messages',
          component: messages
        },
        // 关注列表
        {
          path: '/follows',
          name: 'follows',
          component: follows
        },
        // 推送记录
        {
          path: '/pushes',
          name: 'pushes',
          component: pushes
        }
      ]
    }
  ]
})
