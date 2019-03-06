export default class CONSTANT {
  static taskType = {
    '1': '涉恐',
    '2': '涉稳',
    '3': '涉黄',
    '4': '涉毒'
  }

  static taskList = [
    {
      label: '涉恐预警',
      value: 1
    },
    {
      label: '涉稳预警',
      value: 2
    },
    {
      label: '涉黄预警',
      value: 3
    },
    {
      label: '涉毒预警',
      value: 4
    }
  ]

  static feedTypeList = [
    {
      label: '已反馈',
      value: 1
    },
    {
      label: '未反馈',
      value: 0
    }
  ]
  static ackTypeList = [
    {
      label: '已签收',
      value: 1
    },
    {
      label: '未签收',
      value: 0
    }
  ]
}
