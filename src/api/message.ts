import request from '@/utils/request'

export const getMessages = (params: any) =>
  request({
    url: '/msg/select',
    method: 'post',
    params
  })

export const setMessageRead = (params: any) =>
  request({
    url: '/msg/setMessageRead',
    method: 'post',
    params
  })
