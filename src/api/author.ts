import request from '@/utils/request'

export const getAuthors = (params: any) =>
  request({
    url: '/sys/author/list',
    method: 'post',
    data: params
  })

export const addAuthor = (params: any) =>
  request({
    url: '/sys/author/add',
    method: 'post',
    data: params
  })

export const updateAuthor = (params: any) =>
  request({
    url: '/sys/author/update',
    method: 'post',
    data: params
  })

export const deleteAuthor = (params: any) =>
  request({
    url: '/sys/author/delete',
    method: 'post',
    data: params
  })

export const toggleAuthorStatus = (params: any) =>
  request({
    url: '/sys/author/toggleStatus',
    method: 'post',
    data: params
  })
