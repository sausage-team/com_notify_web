import Service from './index'
export default class followService {
  static getFollowData (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/box_list', {
        ...data,
        msg_type: 1
      }, resolve)
    })
  }
}
