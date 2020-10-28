// 频道列表模块
import request from '../utils/request'

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

// 添加用户频道列表
export const addUserChannel = (Channel) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [Channel]
    }
  })
}

// 删除用户频道列表
export const deleteUserChannel = (channelId) => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
