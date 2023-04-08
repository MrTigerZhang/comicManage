import request from '@/utils/request'

export const getMessages = (params: any) =>
  request({
    url: '/sys/message/list',
    method: 'post',
    data: params
  })

export const setMessageRead = (params: any) =>
  request({
    url: '/sys/message/read',
    method: 'post',
    data: params
  })
