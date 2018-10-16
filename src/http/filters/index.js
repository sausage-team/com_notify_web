import axios from 'axios'
import iView from 'iview'
import router from '../../router'
import VueCookies from 'vue-cookies'
axios.interceptors.request.use(
  config => {
    if (VueCookies.get('token')) {
      config.headers.Authorization = 'Bearer ' + VueCookies.get('token')
    }
    return config
  },
  error => {
    return error // 返回接口返回的错误信息
  }
)

axios.interceptors.response.use(
  res => {
    if (res.status === 401 || res.status === 403) {
      router.push('/login')
    } else if (res.data.status !== 0) {
      iView.Message.error(res.data.msg)
    }
    return res
  },
  error => {
    if (error.response) {
      let res = error.response
      if (res.status === 401 || res.status === 403) {
        router.push('/login')
      }
    } else {
      return error // 返回接口返回的错误信息
    }
  }
)

export default axios
