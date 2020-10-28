// 搜索数据模块

import request from '../utils/request'

export const getSuggestion = (q) => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q: q
    }
  })
}

export const getResult = (params) => {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params
  })
}
