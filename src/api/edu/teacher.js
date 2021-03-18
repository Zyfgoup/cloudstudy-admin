import request from '@/utils/request'
const teacher_api = '/service/teacher'

export default {
  getList() {
    return request({
      url: `${teacher_api}/list`,
      method: 'get'
    })
  },
  getPageList(page, limit, searchObj) {
    console.log(searchObj)
    // 转成string 为空可以判断
    return request({
      url: `${teacher_api}/get/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${teacher_api}/delete/${id}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: `${teacher_api}/add`,
      method: 'post',
      data: teacher
    })
  },
  selectById(id) {
    return request({
      url: `${teacher_api}/get/by/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: `${teacher_api}/update`,
      method: 'put',
      data: teacher
    })
  }

}
