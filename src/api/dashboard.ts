import request from '@/utils/request'

export const dashboardData = (params: any) =>
  request({
    url: '/dashboard/data',
    method: 'post',
    params
  })
