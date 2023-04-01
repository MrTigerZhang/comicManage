import request from '@/utils/request'

export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

export const getUserInfo = () =>
  request({
    url: '/sys/user/info',
    method: 'post',
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const login = (data: any) =>
  request({
    url: '/login',
    method: 'post',
    data: {
      data: data,
      page: 1,
      size: 0
    }
  })

export const logout = () =>
  request({
    url: '/logout',
    method: 'post'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })

export const getSystemConfig = () =>
  request({
    url: '/system/config',
    method: 'post'
  })
