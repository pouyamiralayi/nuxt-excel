
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
  username: state => {
    return state.user && state.user.username
  },
  role: state => {
    return state.user && state.user.role && state.user.role.name
  },
  token: state => {
    return state.user && state.user.jwt
  },
  id: state => {
    return state.user && state.user.id
  }
}
