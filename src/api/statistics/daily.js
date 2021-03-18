import request from '@/utils/request'

const api_name = '/service/static/daily'

export default {
  createStatistics(day) {
    return request({
      url: `${api_name}/create/${day}`,
      method: 'post'
    })
  },
  showChart(searchObj) {
    return request({
      url: `${api_name}/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
