import request from '@/utils/request'

export const getComicList = (params: any) =>
  request({
    url: '/sys/comic/list',
    method: 'post',
    data: params
  })

export const getCategorys = (params: any) =>
  request({
    url: '/sys/comic/category/list',
    method: 'post',
    data: params
  })

export const getAuthors = (params: any) =>
  request({
    url: '/sys/comic/author/list',
    method: 'post',
  })

export const getComicDetail = (params: any) =>
  request({
    url: '/sys/comic/detail',
    method: 'post',
    data: params
  })

export const toggleBan = (params: any) =>
  request({
    url: '/sys/comic/shelf',
    method: 'post',
    data: params
  })

export const deleteManga = (params: any) =>
  request({
    url: '/sys/comic/delete',
    method: 'post',
    data: params
  })

export const startScraping = (params: any) =>
  request({
    url: '/sys/comic/collect',
    method: 'post',
  })

export const addOrUpdateComic = (params: any) =>
  request({
    url: '/sys/comic/addOrUpdate',
    method: 'post',
    data: params
  })

export const queryChapters = (params: any) =>
  request({
    url: '/sys/chapter/list',
    method: 'post',
    data: params
  })

export const deleteChapter = (params: any) =>
  request({
    url: 'sys/chapter/delete',
    method: 'post',
    data: params
  })

export const toggleChapterStatus = (params: any) =>
  request({
    url: '/sys/chapter/shelf',
    method: 'post',
    data: params
  })

export const getChapterById = (params: any) =>
  request({
    url: '/sys/chapter/detail',
    method: 'post',
    data: params
  })
export const  getComicPrice = (params: any) =>
  request({
    url: '/sys/chapter/price',
    method: 'post',
    data: params
  })
export const addOrUpdateChapter = (params: any) =>
  request({
    url: '/sys/chapter/addOrUpdate',
    method: 'post',
    data: params
  })

export const addContent = (params: any) =>
  request({
    url: '/sys/images/add',
    method: 'post',
    data: params
  })

export const queryContentList = (params: any) =>
  request({
    url: '/sys/images/list',
    method: 'post',
    data: params
  })

export const deleteContent = (params: any) =>
  request({
    url: '/sys/images/delete',
    method: 'post',
    data: params
  })

export const updateContentSort = (params: any) =>
  request({
    url: '/sys/images/swap',
    method: 'post',
    data: params
  })


export const getMaxChapterNo = (params: any) =>
  request({
    url: '/sys/chapter/maxNo',
    method: 'post',
    data: params
  })

export const updateChapterOrder = (params: any) =>
  request({
    url: '/sys/chapter/swap',
    method: 'post',
    data: params
  })