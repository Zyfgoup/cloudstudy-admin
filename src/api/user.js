import request from '@/utils/request'
const user_api = '/user/user'

export default {
  getList() {
    return request({
      url: `${user_api}/list`,
      method: 'post',
    })
  },

}
