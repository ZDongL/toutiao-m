// 评论列表模块

import request from '../utils/request'

// 获取评论或评论回复
export const getComments = (params) => {
  return request({
    method: 'get',
    url: '/app/v1_0/comments',
    params
  })
}
// 点赞评论
export const addCommentsLike = (target) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消评论点赞
export const deleteCommentsLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}

// 添加评论列表
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
