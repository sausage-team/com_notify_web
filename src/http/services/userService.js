import Service from './index'

export default class userService {
  static signIn (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_POST('/api/account/user/login', data, resolve)
    })
  }

  static signOut (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_DELETE('/api/account/user/logout', data, resolve)
    })
  }

  static getProfile (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/account/user/profile', data, resolve)
    })
  }

  static updateSoundStatus (params, data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_PUT(`/api/account/user/update_sound_status?switch=${params.userSoundStatus}`, data, resolve)
    })
  }

  static getBackUrl (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/account/user/login/url', data, resolve)
    })
  }

  static getMenuUrl (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/ucenter/generate_url', data, resolve)
    })
  }

  static getMenuList (data) {
    return new Promise((resolve, reject) => {
      Service.TEMPLATE_GET('/api/ucenter/product/list', data, resolve)
    })
  }
}
