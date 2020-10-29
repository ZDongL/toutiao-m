// 用户相关请求模块

import request from '../utils/request.js'

export const login = (data) => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}

// 发送验证码
// 注意：每手机号每分钟1次
export const sendSms = (modile) => {
  return request({
    method: 'get',
    url: '/app/v1_0/sms/codes/' + modile
  })
}

// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user'
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   // token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户列表信息
export const getUserChannel = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = (target) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}
// 取消关注用户
export const deleteFollow = (target) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`
  })
}
