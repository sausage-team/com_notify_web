import axios from 'axios'

export function getMsgTaskList () {
  return axios.get('/api/msg/task_list')
}

export function getPushStat (params) {
  const query = `api/msg/push_statistics?task_id=${params.taskId}`
  return axios.get(query)
}

export function getMsgDataList (params) {
  const query = `/api/msg/list?task_id=${params.taskId}&offset=${params.offset}&count=${params.count}`
  let body = {}
  if (params.queryFilter) {
    body = params.queryFilter
  }
  return axios.post(query, body)
}

export function getMsgDetail (params) {
  const query = `/api/msg/detail?msg_id=${params.msgId}`
  return axios.get(query)
}

export function ackMsg (params) {
  return axios.post('/api/msg/ack', params)
}

export function getSelector (params) {
  const query = `/api/msg/selector?task_id=${params.taskId}`
  return axios.get(query)
}

// ====================
/**
 *
 * @desc 预警信息表头查询
 * @param params
 * @returns {AxiosPromise}
 */
// export function getTitleList (params) {
//   return axios.post('/api/alarmInfo/titleList', params)
// }

/**
 *
 * @desc 预警信息表选择器
 * @param params
 * @returns {AxiosPromise}
 */
// export function getSelectorList (params) {
//   return axios.post('/api/alarmInfo/selectorList', params)
// }

/**
 *
 * @desc 预警信息详细信息
 * @param params
 * @returns {AxiosPromise}
 */
// export function getAlarmDetail (params) {
//   return axios.get('/api/alarmInfo/alarmDetailInfo', params)
// }

/**
 *
 * @desc 预警信息-签收
 * @param params
 * @returns {AxiosPromise}
 */
// export function getAlarmSign (params) {
//   return axios.post('/api/alarmInfo/alarmSign', params)
// }

/**
 *
 * @desc 预警信息-反馈
 * @param params
 * @returns {AxiosPromise}
 */
// export function getAlarmFeedback (params) {
//   return axios.post('/api/alarmInfo/alarmFeedback', params)
// }
