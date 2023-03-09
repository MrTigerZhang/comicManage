import request from '@/utils/request'

export const getIndexAd = (params: any) =>
  request({
    url: '/settings/getIndexAd',
    method: 'post'
  })

export const setIndexAd = (data: any) =>
  request({
    url: '/settings/setIndexAd',
    method: 'post',
    data
  })

export const getSystemInfo = () =>
  request({
    url: '/settings/getSystemInfo',
    method: 'post'
  })

export const setSystemInfo = (data: any) =>
  request({
    url: '/settings/setSystemInfo',
    method: 'post',
    data
  })
