// 用户

import request from '@/utils/request'

export const getUserList = (data: any) =>
  request({
    url: '/user/query',
    method: 'post',
    data
  })
export const enableUser = (data: any) => {
  request({
    url: '/user/eanble',
    method: 'post',
    data
  })
}
