import request from '@/utils/request'
import config from '@/config'

// 服务器列表
export function fetchList (data) {
  return request({
    url: config.BASEURL + '/api/gc/client/pub/home/index',
    method: 'GET'
  })
}
