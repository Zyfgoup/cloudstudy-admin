import request from '@/utils/request'
const order_api = '/order/order'

export default {
  getPageList(page, limit, searchObj) {
    console.log(searchObj)
    // 转成string 为空可以判断
    return request({
      url: `${order_api}/list/${page}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `${order_api}/remove/${id}`,
      method: 'delete'
    })
  }

}
