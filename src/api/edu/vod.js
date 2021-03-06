import request from '@/utils/request'

const api_name = '/vod'

export default {

  removeById(id) {
    return request({
      url: `${api_name}/video/${id}`,
      method: 'delete'
    })
  }
}
