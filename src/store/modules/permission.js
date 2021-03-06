import { asyncRoutes, currencyRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}
const mutations = {
  SET_ROUTES(state, payload) {
    state.routes = [...currencyRoutes, ...payload]
    state.addRoutes = payload
  }
}

// 为menus中没有父菜单的添加父菜单
function forMenus(route, menus) {
  let arrNew = []
  for (let item of route) {
    let itemNew = { ...item } //解决浅拷贝共享同一内存地址
    if (menus.includes(itemNew.name)) {
      arrNew.push(itemNew.name)
      if (itemNew.children) {
        arrNew = arrNew.concat(forMenus(itemNew.children, menus))
      }
    } else {
      if (itemNew.children) {
        let arr = forMenus(itemNew.children, menus)
        if (arr.length > 0) {
          arrNew.push(itemNew.name)
          arrNew = arrNew.concat(arr)
        }
      }
    }
  }
  return arrNew
}

// 遍历asyncRoutes动态路由
function forSearchArr(route, menus) {
  // console.log('menus:', menus)
  let arrNew = []
  for (let item of route) {
    let itemNew = { ...item } //解决浅拷贝共享同一内存地址
    if (menus.includes(itemNew.name)) {
      if (itemNew.children) {
        itemNew.children = forSearchArr(itemNew.children, menus)
      }
      arrNew.push(itemNew)
    }
  }
  return arrNew
}
const actions = {
  getAsyncRoutes({ commit, rootGetters }, menus) {
    // console.log('menus1:', menus)
    return new Promise(resolve => {
      let routes = []
      if (rootGetters.rolevalue === 'admin') {
        routes = asyncRoutes || ''
      } else {
        menus = forMenus(asyncRoutes, menus)
        routes = forSearchArr(asyncRoutes, menus, false)
      }
      commit('SET_ROUTES', routes)
      resolve(routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
