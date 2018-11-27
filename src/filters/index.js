const filter = {
  status: (Vue, option) => {
    // 状态转换
    Vue.prototype.filterStatus = function (flag, val) {
      let res = ''
      if (flag === 0) {
        if (val === 0) {
          res = '已发送'
        } else if (val === 1) {
          res = '已反馈'
        } else if (val === 2) {
          res = '已签收'
        }
      }
      return res
    }
  }
}

export default filter
