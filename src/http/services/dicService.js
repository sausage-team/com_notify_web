import Service from './index'

export default class dicService {
  static getDictInfo (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_POST('/api/dict/dictInfo', data, resolve)
    })
  }
}
