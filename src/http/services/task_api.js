import axios from 'axios'

/**
 *
 * @desc 查询任务列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getTaskList (params) {
  return axios.post('/api/task/taskList', params)
}

/**
 *
 * @desc 查询任务列表简单信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getTaskTitleList (params) {
  return axios.post('/api/task/taskTitleList', params)
}

/**
 *
 * @desc socket消息已读通知
 * @param params
 * @returns {AxiosPromise}
 */
export function setReadMsg (params) {
  return axios.post('/api/task/setReadMsg', params)
}
/**
 *
 * @desc 查询工作表列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getWorkList (params) {
  return axios.post('/api/taskManager/worktableList', params)
}

/**
 *
 * @desc 工作表数据预览
 * @param params
 * @returns {AxiosPromise}
 */
export function getWorkPreview (params) {
  return axios.post('/api/taskManager/worktablePreview', params)
}

/**
 *
 * @desc 保存新增工作表
 * @param params
 * @returns {AxiosPromise}
 */
export function saveWorkList (params) {
  return axios.post('/api/taskManager/addTaskForConditions', params)
}

/**
 *
 * @desc 保存编辑工作表
 * @param params
 * @returns {AxiosPromise}
 */
export function updateWorkList (params) {
  return axios.post('/api/taskManager/updateTaskForConditions', params)
}

/**
 *
 * @desc 保存任务字段
 * @param params
 * @returns {AxiosPromise}
 */
export function saveTaskFields (params) {
  return axios.post('/api/taskManager/saveTaskFields', params)
}

/**
 *
 * @desc 新增保存推送规则
 * @param params
 * @returns {AxiosPromise}
 */
export function addPushTargetRule (params) {
  return axios.post('/api/taskManager/addPushTargetRule', params)
}

/**
 *
 * @desc 编辑保存推送规则
 * @param params
 * @returns {AxiosPromise}
 */
export function savePushRule (params) {
  return axios.post('/api/taskManager/updatePushTargetRule', params)
}

/**
 *
 * @desc 查询任务字段
 * @param params
 * @returns {AxiosPromise}
 */
export function queryTaskFields (params) {
  return axios.post('/api/taskManager/queryTaskFields', params)
}

/**
 *
 * @desc 查询工作表
 * @param params
 * @returns {AxiosPromise}
 */
export function showCondition (params) {
  return axios.post('/api/taskManager/showCondition', params)
}

/**
 *
 * @desc 查询推送规则
 * @param params
 * @returns {AxiosPromise}
 */
export function selectPushRule (params) {
  return axios.post('/api/taskManager/selectPushTargetRule', params)
}

/**
 *
 * @desc 删除任务
 * @param params
 * @returns {AxiosPromise}
 */
export function changeTaskStatus (params) {
  return axios.post('/api/task/changeTaskStatus', params)
}

/**
 *
 * @desc 检查任务名称是否重复
 * @param params
 * @returns {AxiosPromise}
 */
export function checkTaskByName (params) {
  return axios.post('/api/task/checkTaskByName', params)
}

/**
 *
 * @desc 获取任务类型列表
 * @returns {AxiosPromise}
 */
export function getTaskTypekList () {
  return axios.post('/api/task/taskTypeList')
}

/**
 *
 * @desc 获取任务详情
 * @returns {AxiosPromise}
 */
export function getTaskDetail (params) {
  return axios.post('/api/task/taskDetail', params)
}