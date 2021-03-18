import request from '@/utils/request'

const api_name = '/service/course'

export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: courseInfo
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/upd`,
      method: 'put',
      data: courseInfo
    })
  },
  getCourseInfoById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/get/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },

  getList(){
    return request({
      url: `${api_name}/list`,
      method: 'post'
    })
  },

  removeById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'delete'
    })
  },
  getCoursePublishVoById(id) {
    return request({
      url: `${api_name}/vo/${id}`,
      method: 'get'
    })
  },
  updateStatusById(id) {
    return request({
      url: `${api_name}/updateStatus/${id}`,
      method: 'put'
    })
  }

}
