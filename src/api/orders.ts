import request from '@/utils/request'

export const selectOrders = (params: any) =>
  request({
    url: '/sys/comicOrder/list',
    method: 'post',
    data: params
  })

export const manualPay = (params: any) =>
  request({
    url: '/sys/comicOrder/pay',
    method: 'post',
    data: params
  })
