import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import main from '@/pages'
import messages from '@/pages/message'
import follows from '@/pages/follow'
import pushes from '@/pages/push'

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
        // 根目录跳到消息盒子
        {
          path: '/',
          name: 'messages',
          component: messages
        },
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
