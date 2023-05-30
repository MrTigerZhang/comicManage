import request from '@/utils/request'

//添加接口
export const getHelpList = (params: any) =>
    request({
        url: '/sys/help/page',
        method: 'post',
        data: params
    })

//refresh
export const refresh = (params: any) =>
    request({
        url: '/sys/help/refresh',
        method: 'post',
        data: params
    })

export const addHelp = (params: any) =>
    request({
        url: '/sys/help/add',
        method: 'post',
        data: params
    })



export const updateHelp = (params: any) =>
    request({
        url: '/sys/help/update',
        method: 'post',
        data: params
    })

export const deleteHelp = (params: any) =>
    request({
        url: '/sys/help/delete',
        method: 'post',
        data: params
    })

export const getHelpInfo = (params: any) =>
    request({
        url: '/sys/help/query',
        method: 'post',
        data: params
    })
