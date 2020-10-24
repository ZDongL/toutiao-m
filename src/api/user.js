/**
 * 用户相关请求模块
 */

import request from '../utils/request.js'

export const login = (data) => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}

export const sendSms = (modile) => {
  return request({
    method: 'get',
    url: '/app/v1_0/sms/codes/' + modile
  })
}
