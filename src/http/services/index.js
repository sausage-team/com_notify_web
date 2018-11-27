import http from 'axios'

const TEMPLATE_GET = (str, data, resolve) => {
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

const TEMPLATE_DELETE = (str, data, resolve) => {
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

const TEMPLATE_POST = (str, data, resolve) => {
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

const TEMPLATE_PUT = (str, data, resolve) => {
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

const service = {
  userService: {
    signIn: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_POST('/api/account/user/login', data, resolve)
      })
    },
    signOut: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_DELETE('/api/account/user/logout', data, resolve)
      })
    },
    getProfile: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/account/user/profile', data, resolve)
      })
    },
    updateSoundStatus: (params, data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_PUT(`/api/account/user/update_sound_status?switch=${params.userSoundStatus}`, data, resolve)
      })
    }
  },
  alarmService: {
    getMsgTaskList: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/task_list', data, resolve)
      })
    },
    getPushStat: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/push_statistics', {
          task_id: data.taskId
        }, resolve)
      })
    },
    getMsgDataList: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_POST('/api/msg/list', data, resolve)
      })
    },
    getMsgDetail: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/detail', {
          msg_id: data.msgId
        }, resolve)
      })
    },
    ackMsg: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_POST('/api/msg/ack', data, resolve)
      })
    },
    getSelector: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/selector', {
          task_id: data.taskId
        }, resolve)
      })
    },
    getMsgListTry: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/try_task', data, resolve)
      })
    },
    readAll: (data) => {
      return new Promise((resolve, reject) => {
        TEMPLATE_GET('/api/msg/read_all', data, resolve)
      })
    }
  },
  dicService: {
    getDictInfo (data) {
      return new Promise((resolve, reject) => {
        TEMPLATE_POST('/api/dict/dictInfo', data, resolve)
      })
    }
  },
  messageService: {
    getMsgDataList: (data) => {
      // return new Promise((resolve, reject) => {
      //   TEMPLATE_POST('/api/msg/list', data, resolve)
      // })
    }
  }
}

export default service
