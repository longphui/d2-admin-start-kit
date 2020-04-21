import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
export function getAllSysUser (roleName) {
  return request({
    url: '/sys/getAllSysUser',
    method: 'get',
    params: {
      roleName: roleName
    }
  })
}
export function addUser (data) {
  return request({
    url: '/sys/addUser',
    method: 'post',
    data
  })
}
export function deleteUser (data) {
  return request({
    url: '/sys/deleteUser',
    method: 'post',
    data
  })
}
export function getAdministrativeDivisionTree () {
  return request({
    url: '/sys/GetAdministrativeDivisionTree',
    method: 'get'
  })
}
export function getAdministrativeDivisionByCode (cityCode) {
  return request({
    url: '/sys/GetAdministrativeDivisionByCode',
    method: 'get',
    params: {
      cityCode: cityCode
    }
  })
}
