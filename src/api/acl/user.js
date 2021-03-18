import request from '@/utils/request'

const api_name = '/user/admin'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/get/${page}/${limit}`,
      method: 'post',
      data: searchObj // url查询字符串或表单键值对
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  save(user) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: user
    })
  },

  updateById(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  saveAssign(userId, roleIds){
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params:{ userId, roleIds }
    })
  },
  removeById(id){
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  removeRows(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  },

  freeze(id){
    const map = {
      "id":id
    }
    return request({
      url: `${api_name}/freeze`,
      method: 'put',
      data: map
    })
  },

  unfreeze(id){
    const map = {
      "id":id
    }
    return request({
      url: `${api_name}/unfreeze`,
      method: 'put',
      data: map
    })
  }

}
