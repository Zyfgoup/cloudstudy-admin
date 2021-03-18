import request from '@/utils/request'

const api_name = '/service/video'

export default {

  saveVideo(video) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: video
    })
  },
  getVideoById(id) {
    return request({
      url: `${api_name}/get/video/${id}`,
      method: 'get'
    })
  },
  updateVideo(video) {
    return request({
      url: `${api_name}/upd`,
      method: 'put',
      data: video
    })
  },
  removeVideoById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  removeVideoSource(id) {
    return request({
      url: `/vod/video/${id}`,
      method: 'delete'
    })
  }
}
