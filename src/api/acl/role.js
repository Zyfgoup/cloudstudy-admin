import request from '@/utils/request'

const api_name = '/user/role'

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
          url: `${api_name}/${id}`,
          method: 'get'
        })
      },

      save(role) {
        return request({
          url: `${api_name}/save`,
          method: 'post',
          data: role
        })
      },

      updateById(role) {
        return request({
          url: `${api_name}/update`,
          method: 'put',
          data: role
        })
      },

      getAssign(roleId){
        return request({
          url: `${api_name}/toAssign/${roleId}`,
          method: 'get'
        })
      },

      removeById(id){
        return request({
          url: `${api_name}/remove/${id}`,
          method: 'delete'
        })
      },

      removeRows(idList){
        return request({
          url: `${api_name}/batchRemove`,
          method: 'delete',
          data:idList
        })
      }

}
