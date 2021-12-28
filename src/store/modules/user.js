import { login, getInfo } from '@/api/login'
import { Message } from 'element-ui'
import router, { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : '', // 认证凭证'
  username: '',
  menus: [],
  introduce: ''
}
const mutations = {
  SET_TOKEN(state, val) {
    state.token = val
    localStorage.setItem('token', val)
  },
  DEL_TOKEN(state) {
    state.token = ''
    state.username = ''
    state.menus = ''
    state.introduce = ''
    localStorage.removeItem('token')
  },
  SET_MENUS(state, payload) {
    state.menus = payload
  },
  SET_NAME(state, payload) {
    state.username = payload
  },
  SET_INTRODUCE(state, payload) {
    state.introduce = payload
  }
}
const actions = {
  // user login
  _login({ commit }, formdatas) {
    return new Promise((resolve, reject) => {
      login(formdatas)
        .then(res => {
          if (res.code === 200) {
            Message.success(res.msg)
            commit('SET_TOKEN', res.data)
            resolve(res)
          } else {
            Message.error(res.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  loginOut({ commit }) {
    commit('DEL_TOKEN')
    resetRouter()
    router.push({
      path: '/login',
      query: {
        redirect: '/'
      }
    })
  },
  _getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(res => {
          if (res.code === 200) {
            const { username, menus, introduce } = res.data
            commit('SET_MENUS', menus)
            commit('SET_NAME', username)
            commit('SET_INTRODUCE', introduce)
          } else {
            Message.error(res.msg)
            reject(res.msg)
          }
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
