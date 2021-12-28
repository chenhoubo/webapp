const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  menus: state => state.user.menus,
  introduce: state => state.user.introduce,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  opened: state => {
    if (state.app.opened === 'false') {
      return false
    } else if (state.app.opened === 'true') {
      return true
    }
  },
  msgIsShow: state => state.app.msgIsShow,
  showDriver: state => state.app.showDriver
}
export default getters
