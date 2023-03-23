import request from '@/utils/request'

export const selectOrders = (params: any) =>
  request({
    url: '/order/select',
    method: 'post',
    params
  })

export const manualPay = (params: any) =>
  request({
    url: '/order/manualPay',
    method: 'post',
    params
  })
