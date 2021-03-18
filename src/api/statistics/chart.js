import request from '@/utils/request'

const api_name = '/service/chart'

export default {
  chart1() {
    return request({
      url: `${api_name}/chart1/`,
      method: 'post'
    })
  },

  chart2() {
    return request({
      url: `${api_name}/chart2/`,
      method: 'post'
    })
  },

  chart3() {
    return request({
      url: `${api_name}/chart3/`,
      method: 'post'
    })
  },

  chart4() {
    return request({
      url: `${api_name}/chart4/`,
      method: 'post'
    })
  },


}
