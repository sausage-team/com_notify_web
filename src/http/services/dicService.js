import Service from './index'

export default class dicService {
  static getDictInfo (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_POST('/api/dict/dictInfo', data, resolve)
    })
  }

  static getDicConData (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/dic/content/list', data, resolve)
    })
  }
}
