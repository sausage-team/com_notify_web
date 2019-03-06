const state = {
  loginUrl: ''
}

const actions = {
  setUrl ({state}, url) {
    state.loginUrl = url
  },

  getLogin ({state}) {
    window.location.href = state.loginUrl
  }
}

const getters = {
}

const mutations = {
}

export default {
  state,
  actions,
  mutations,
  getters
}
