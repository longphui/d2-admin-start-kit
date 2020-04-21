import request from '@/plugin/axios'

export function addCustomer (data) {
  return request({
    url: '/crm/AddCustomer',
    method: 'post',
    data
  })
}
export function getCustomers (data) {
  return request({
    url: '/crm/GetCustomers',
    method: 'get',
    params: data
  })
}
export function privateToPublic (data) {
  return request({
    url: '/crm/privateToPublic',
    method: 'post',
    data
  })
}
export function updateCustomer (data) {
  return request({
    url: '/crm/updateCustomer',
    method: 'post',
    data
  })
}
export function addReturnVisit (data) {
  return request({
    url: '/crm/AddReturnVisit',
    method: 'post',
    data
  })
}
export function addVisitPlan (data) {
  return request({
    url: '/crm/AddVisitPlan',
    method: 'post',
    data
  })
}
