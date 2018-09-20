import axios from 'axios'
import qs from 'qs'

/**
 *
 * @desc 登录
 * @param params
 * @returns {AxiosPromise}
 */
export function signIn (params) {
  return axios.post('/api/user/login', qs.stringify(params))
}

/**
 *
 * @desc 登出
 * @param params
 * @returns {AxiosPromise}
 */
export function signOut (params) {
  return axios.post('/api/user/logout', params)
}
/**
 *
 * @desc 查询组列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getGroupList (params) {
  return axios.post('/api/user/grouplist', params)
}

/**
 *
 * @desc 查询组成员
 * @param params
 * @returns {AxiosPromise}
 */
export function getGroupUsers (params) {
  return axios.post('/api/user/groupUsers', params)
}

/**
 *
 * @desc 查询用户属性
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserPortraits () {
  return axios.post('/api/user/getUserPortraits')
}

/**
 *
 * @desc 更改用户声音状态
 * @param params
 * @returns {AxiosPromise}
 */
export function updateSoundStatus (params) {
  return axios.post('api/user/updateSoundStatus', params)
}
