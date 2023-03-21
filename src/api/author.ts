import request from '@/utils/request'

export const getAuthors = (params: any) =>
  request({
    url: '/author/get',
    method: 'post',
    params
  })

export const addAuthor = (params: any) =>
  request({
    url: '/author/add',
    method: 'post',
    params
  })

export const updateAuthor = (params: any) =>
  request({
    url: '/author/update',
    method: 'post',
    params
  })

export const deleteAuthor = (params: any) =>
  request({
    url: '/author/delete',
    method: 'post',
    params
  })

export const toggleAuthorStatus = (params: any) =>
  request({
    url: '/author/toggleAuthorStatus',
    method: 'post',
    params
  })
