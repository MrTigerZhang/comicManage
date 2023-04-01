import request from '@/utils/request'

export const dashboardData = (params: any) =>
  request({
    url: '/sys/dashboard/data',
    method: 'post',
  })
