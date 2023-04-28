import request from '@/utils/request'

export const list = (params: any) =>
  request({
    url: '/recommend/list',
    method: 'post',
    data: params
  })

//check
export const create = (params: any) =>
  request({
    url: '/recommend/add',
    method: 'post',
    data: params
  })
//check
export const del = (params: any) =>
  request({
    url: '/recommend/delete',
    method: 'post',
    data: params
  })

export const check = () =>
  request({
    url: '/recommend/check',
    method: 'post',
  })

//clearCache
export const clearCache = () =>
  request({
    url: '/recommend/clearCache',
    method: 'post',
  })

//enable
export const enable = (params: any) =>
  request({
    url: '/recommend/enable',
    method: 'post',
    data: params
  })

//contentList
export const contentList = (params: any) =>
  request({
    url: '/recommend/contentList',
    method: 'post',
    data: params
  })

//updateContent
export const updateContent = (params: any) =>
  request({
    url: '/recommend/updateContent',
    method: 'post',
    data: params
  })

//getComicList
export const getComicList = (params: any) =>
  request({
    url: '/recommend/getComicList',
    method: 'post',
    data: params
  })