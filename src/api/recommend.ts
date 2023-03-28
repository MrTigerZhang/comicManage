import request from '@/utils/request'
 

export const getRecommendList = (params: any) =>
  request({
    url: '/recommend/list',
    method: 'post',
    params
  })

export const deleteRecommend = (params: any) =>
    request({
        url: '/recommend/delete',
        method: 'post',
        params
    })

export const addRecommend = (params: any) =>    
    request({
        url: '/recommend/add',
        method: 'post',
        params
    })

export const editRecommend = (params: any) =>
    request({
        url: '/recommend/editRecommend',
        method: 'post',
        params
    })

