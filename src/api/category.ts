import request from '@/utils/request'

export const getCategories = (params: any) =>
  request({
    url: '/category/list',
    method: 'post',
    params
  })

export const deleteCategory = (params: any) =>
  request({
    url: '/category/delete',
    method: 'post',
    data: params
  })
export const addCategory = (params: any) =>
  request({
    url: '/category/add',
    method: 'post',
    data: params
  })

export const updateCategory = (params: any) =>
  request({
    url: '/category/update',
    method: 'post',
    data: params
  })

export const updateSort = (params: any) =>
  request({
    url: '/category/sort',
    method: 'post',
    data: params
  })
export const toggleStatus = (params: any) =>
  request({
    url: '/category/toggleStatus',
    method: 'post',
    data:params
  })


export const clearCache = () =>
  request({
    url: '/category/clearCache',
    method: 'post',
  })
