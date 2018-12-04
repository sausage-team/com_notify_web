import http from 'axios'
export default class Service {
  static TEMPLATE_GET = (str, data, resolve) => {
    http.get(str, {
      params: data || {}
    }).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  static TEMPLATE_DELETE = (str, data, resolve) => {
    http.get(str, {
      params: data || {}
    }).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  static TEMPLATE_POST = (str, data, resolve) => {
    http.post(str, data).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }

  static TEMPLATE_PUT = (str, data, resolve) => {
    http.put(str, data).then(res => {
      if (res.status === 200 && res.data.status === 0) {
        resolve(res.data)
      } else {
        resolve(res.data || {
          status: 1,
          msg: '请求失败'
        })
      }
    })
  }
}
