import request from '@/plugin/axios'

export function getCustomerLevel () {
  return request({
    url: '/common/GetCustomerLevel',
    method: 'get'
  })
}

export function getVisitType () {
  return request({
    url: '/common/GetVisitType',
    method: 'get'
  })
}
