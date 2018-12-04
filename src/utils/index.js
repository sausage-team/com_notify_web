import moment from 'moment'

export default class Utils {
  static momentDate(num, type) {
    if (num) {
      if (Object.prototype.toString.call(num) === '[object Date]') {
        num = num.getTime()
      }
      switch (type) {
        case 'date':
          return moment(parseInt(num)).format('YYYY-MM-DD')
        case 'date_h':
          return moment(parseInt(num)).format('YYYY/MM/DD')
        case 'date_time':
          return moment(parseInt(num)).format('YYYY-MM-DD HH:mm:ss')
        case 'data_h_time':
          return moment(parseInt(num)).format('YYYY/MM/DD HH:mm:ss')
        case 'data_h_time_h':
          return moment(parseInt(num)).format('YYYY/MM/DD HH:mm')
        case 'time':
          return moment(parseInt(num)).format('HH:mm:ss')
        case 'time_h':
          return moment(parseInt(num)).format('HH:mm')
      }
    } else {
      return ''
    }
  }
}
