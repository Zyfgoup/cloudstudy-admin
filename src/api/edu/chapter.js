import request from '@/utils/request'

const api_name = '/service/chapter'

export default {

  getChapterAndVideoByCourseId(courseId) {
    return request({
      url: `${api_name}/get/${courseId}`,
      method: 'get'
    })
  },
  save(chapter) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: chapter
    })
  },
  getChapterById(id) {
    return request({
      url: `${api_name}/get/chapter/${id}`,
      method: 'get'
    })
  },
  updateById(chapter) {
    return request({
      url: `${api_name}/upd`,
      method: 'put',
      data: chapter
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
