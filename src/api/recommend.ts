import request from '@/utils/request'


export const getRecommendList = (params: any) =>
    request({
        url: '/sys/recommend/list',
        method: 'post',
        data: params
    })

export const deleteRecommend = (params: any) =>
    request({
        url: '/sys/recommend/delete',
        method: 'post',
        data: params
    })

export const addRecommend = (params: any) =>
    request({
        url: '/sys/recommend/add',
        method: 'post',
        data: params
    })

export const editRecommend = (params: any) =>
    request({
        url: '/sys/recommend/update',
        method: 'post',
        data: params
    })

export const getRecommendSelectList = (params: any) =>
    request({
        url: '/sys/recommend/comicSelectList',
        method: 'post',
        data: params
    })