import axios from 'axios'

/**
 *
 * @desc 字典查询
 * @param params
 * @returns {AxiosPromise}
 */
export function getDictInfo (params) {
  return axios.post('/api/dict/dictInfo', params)
}

/**
 *
 * @desc 字典列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getDictList (params) {
  return axios.post('/api/dict/dictList', params)
}
