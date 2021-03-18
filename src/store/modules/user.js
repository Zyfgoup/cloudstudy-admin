import { login, logout, getButtons} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import jwtDecode from 'jwt-decode'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    buttons: [],
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const token = response.headers['authorization']
          setToken(token)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {

        // 用用户信息生成的token  解析token获取用户信息
        const userInfo = jwtDecode(state.token).sub
        const user = JSON.parse(userInfo)
        if (user.roles && user.roles.length > 0) { //    修改了  没有验证返回的roles是否是一个非空数组
          commit('SET_ROLES', user.roles)
        } else {
          reject('getInfo: roles must be a non-null array !')
        }

        // 获取对应按钮权限
        const buttonAuthList = []
         getButtons(user.nickname).then(response => {
          const permissionValueList = response.data.data
          // 按钮权限
          permissionValueList.forEach(button => {
            buttonAuthList.push(button)
          })
        }).catch(()=>{
            reject("获取按钮权限失败");
        })

        commit('SET_BUTTONS', buttonAuthList)
        commit('SET_NAME', user.nickname)
        commit('SET_AVATAR', user.avatar)
        commit('SET_ID',user.id);
        resolve(user.roles)
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_BUTTONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
