import request from '@/utils/request'
import { IArticleData } from './types'

export const getCategories = (params: any) =>
  request({
    url: '/cat/get',
    method: 'post',
    params
  })

export const deleteCategory = (params: any) =>
  request({
    url: '/cat/delete',
    method: 'post',
    params
  })
export const addCategory = (params: any) =>
  request({
    url: '/cat/add',
    method: 'post',
    params
  })

export const updateSort = (params: any) =>
  request({
    url: '/cat/updateSort',
    method: 'post',
    params
  })
