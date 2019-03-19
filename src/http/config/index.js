import axios from 'axios'
import iView from 'iview'
import store from '@/stores'
import VueCookies from 'vue-cookies'

let reqCount = 0
axios.defaults.timeout = 45000

axios.interceptors.request.use(
  config => {
    if (VueCookies.get('no_token')) {
      config.headers.Authorization = 'Bearer ' + VueCookies.get('no_token')
      config.headers.userId = VueCookies.get('no_user_id')
    }
    if (reqCount === 0) {
      iView.Spin.show()
    }
    reqCount++
    return config
  },
  error => {
    reqCount--
    if (reqCount === 0) {
      setTimeout(() => {
        iView.Spin.hide()
      }, 300)
    }
    return error // 返回接口返回的错误信息
  }
)

axios.interceptors.response.use(
  res => {
    reqCount--
    if (reqCount === 0) {
      setTimeout(() => {
        iView.Spin.hide()
      }, 300)
    }
    if (res.status === 401 || res.status === 403) {
      store.dispatch('closeSub')
      store.dispatch('getLogin')
    } else if (res.data.status !== 0) {
      iView.Message.error(res.data.msg)
    }
    return res
  },
  error => {
    reqCount--
    if (reqCount === 0) {
      setTimeout(() => {
        iView.Spin.hide()
      }, 300)
    }
    if (error.response) {
      let res = error.response
      if (res.status === 401 || res.status === 403) {
        store.dispatch('getLogin')
        store.dispatch('closeSub')
      }
    } else {
      return error // 返回接口返回的错误信息
    }
  }
)

export default axios
