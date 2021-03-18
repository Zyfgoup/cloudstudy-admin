// @ 符号在build/webpack.base.conf.js 中配置 表示 'src' 路径
import request from '@/utils/request'

export default {

  //所有推荐类别列表
  list() {
    return request({
      url: '/cms/adType/list',
      method: 'get'
    })
  },

  //推荐类别分页列表
  pageList(page, limit) {
    return request({
      url: `/cms/adType/list/${page}/${limit}`,
      method: 'get'
    })
  },

  //根据ID删除推荐类别
  removeById(id) {
    return request({
      url: `/cms/adType/remove/${id}`,
      method: 'delete'
    })
  },

  //新增推荐类别
  save(adType) {
    return request({
      url: '/cms/adType/save',
      method: 'post',
      data: adType
    })
  },

  //根据id获取推荐类别信息
  getById(id) {
    return request({
      url: `/cms/adType/get/${id}`,
      method: 'get'
    })
  },

  //更新推荐类别
  updateById(adType) {
    return request({
      url: '/cms/adType/update',
      method: 'put',
      data: adType
    })
  }
}
