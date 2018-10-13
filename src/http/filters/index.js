import axios from 'axios'
// import qs from 'qs'
import iView from 'iview'
import router from '../../router'
axios.interceptors.request.use(
  config => {
    // if (config.method === 'post') {
    //   let data = qs.parse(config.data)
    //   config.data = {
    //     ts: Date.now(),
    //     ...data
    //   }
    // } else
    if (config.method === 'get') {
      config.params = {
        ts: Date.now(),
        ...config.params
      }
    }
    if (localStorage.getItem('token')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
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
