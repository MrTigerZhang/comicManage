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
