const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
  buttons: state => state.user.buttons,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
