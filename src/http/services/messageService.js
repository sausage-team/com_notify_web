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

  static getMessageDetail (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/detail', data, resolve)
    })
  }

  static readItem (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/read/item', data, resolve)
    })
  }

  static readAll (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/read_all', data, resolve)
    })
  }

  static signAll (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/ack_all', data, resolve)
    })
  }
}
