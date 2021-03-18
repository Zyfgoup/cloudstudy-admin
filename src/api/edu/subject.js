import request from '@/utils/request'

const api_name = '/service/category'

export default {

  getNestedTreeList() {
    return request({
      url: `${api_name}/get/all`,
      method: 'get'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'delete'
    })
  },
  saveLevelOne(subject) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: subject
    })
  },
  saveLevelTwo(subject) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: subject
    })
  }

}
