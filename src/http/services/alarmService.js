import Service from './index'

export default class alarmService {
  static getMsgTaskList (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/task_list', data, resolve)
    })
  }

  static getPushStat (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/push_statistics', {
        task_id: data.taskId
      }, resolve)
    })
  }

  static getMsgDataList (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_POST('/api/msg/list', data, resolve)
    })
  }

  static getMsgDetail (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/detail', {
        msg_id: data.msgId
      }, resolve)
    })
  }

  static ackMsg (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_POST('/api/msg/ack', data, resolve)
    })
  }

  static getSelector (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/selector', {
        task_id: data.taskId
      }, resolve)
    })
  }

  static getMsgListTry (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/try_task', data, resolve)
    })
  }

  static readAll (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/msg/read_all', data, resolve)
    })
  }
}
