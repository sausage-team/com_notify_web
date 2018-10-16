import axios from 'axios'

/**
 *
 * @desc 登录
 * @param params
 * @returns {AxiosPromise}
 */
export function signIn (params) {
  return axios.post('/api/account/user/login', params)
}

/**
 *
 * @desc 登出
 * @param params
 * @returns {AxiosPromise}
 */
export function signOut (params) {
  return axios.delete('/api/account/user/logout', params)
}

export function getProfile () {
  return axios.get('/api/account/user/profile')
}

/**
 *
 * @desc 更改用户声音状态
 * @param params
 * @returns {AxiosPromise}
 */
export function updateSoundStatus (params) {
  const query = `api/account/user/update_sound_status?switch=${params.userSoundStatus}`
  return axios.put(query)
}

// 移到推送中心，不要了 undo by chenbo 2018.10.10
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

export function getTaskDetail () {
  return axios.get('/api')
}
