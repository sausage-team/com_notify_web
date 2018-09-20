import axios from 'axios'

/**
 *
 * @desc 预警信息表头查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getTitleList (params) {
  return axios.post('/api/alarmInfo/titleList', params)
}

/**
 *
 * @desc 预警信息表选择器
 * @param params
 * @returns {AxiosPromise}
 */
export function getSelectorList (params) {
  return axios.post('/api/alarmInfo/selectorList', params)
}

/**
 *
 * @desc 预警信息数据列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getDataList (params) {
  return axios.post('/api/alarmInfo/dataList', params)
}

/**
 *
 * @desc 预警信息详细信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getAlarmDetail (params) {
  return axios.post('/api/alarmInfo/alarmDetailInfo', params)
}

/**
 *
 * @desc 预警信息-签收
 * @param params
 * @returns {AxiosPromise}
 */
export function getAlarmSign (params) {
  return axios.post('/api/alarmInfo/alarmSign', params)
}

/**
 *
 * @desc 预警信息-反馈
 * @param params
 * @returns {AxiosPromise}
 */
export function getAlarmFeedback (params) {
  return axios.post('/api/alarmInfo/alarmFeedback', params)
}
