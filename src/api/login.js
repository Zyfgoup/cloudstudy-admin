import request from '@/utils/request'
import store from '@/store'

export function login(username, password) {
  return request({
    url: '/auth/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// 获取菜单权限数据
export function getMenu() {
  const name = store.getters.name
  return request({
    url: `/user/permission/menu/${name}`,
    method: 'get'

  })
}

// 获取菜单权限数据
export function getButtons(name) {
  return request({
    url: `/user/permission/get/buttons/${name}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/admin/logout',
    method: 'post'
  })
}
