import request from '@/utils/request'

export const getIndexAd = (params: any) =>
  request({
    url: '/sys/homeAd/get',
    method: 'post'
  })

export const setIndexAd = (data: any) =>
  request({
    url: '/sys/homeAd/addOrUpdate',
    method: 'post',
    data: data
  })

export const getSystemInfo = () =>
  request({
    url: '/system/config',
    method: 'post'
  })

export const setSystemInfo = (data: any) =>
  request({
    url: '/system/update',
    method: 'post',
    data: {
      data: data,
    }
  })
