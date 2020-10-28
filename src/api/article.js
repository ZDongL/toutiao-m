// 获取文章列表模块

import request from '../utils/request'

export const getArticle = (params) => {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  })
}
