import Cookies from 'js-cookie'

export const state = () => {
  user:null
}

export const mutations = {
  setUser(state, user) {
    state.user = user
    Cookies.set('user', user)
    // console.log(state.user)
  },

  logout(state) {
    state.user = null
    Cookies.set('user', null)
  }
}

export const getters = {
  user: state => {
    return state.user
  },
  username: state => {
    return state.user && state.user.username
  },
  token: state => {
    return state.user && state.user.jwt
  },
  id: state => {
    return state.user && state.user.id
  }
}
