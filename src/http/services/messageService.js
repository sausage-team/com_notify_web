import Service from './index'
export default class messageService {
  static getMessageData (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/box_list', {
        ...data,
        msg_type: 0
      }, resolve)
    })
  }
}
