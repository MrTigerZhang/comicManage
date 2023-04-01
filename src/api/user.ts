// 用户

import request from '@/utils/request'

export const getUserList = (data: any) =>
  request({
    url: '/user/list',
    method: 'post',
    data
  })
export const enableUser = (data: any) => {
  request({
    url: '/user/disable',
    method: 'post',
    data: { data }
  })
}
