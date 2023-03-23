import request from '@/utils/request'

export const getComicList = (params: any) =>
  request({
    url: '/comic/list',
    method: 'post',
    params
  })

export const getCategorys = (params: any) =>
  request({
    url: '/comic/getCategorys',
    method: 'post',
    params
  })

export const getAuthors = (params: any) =>
  request({
    url: '/comic/getAuthors',
    method: 'post',
    params
  })

export const getComicDetail = (params: any) =>
  request({
    url: '/comic/getComicDetail',
    method: 'post',
    params
  })

export const toggleBan = (params: any) =>
  request({
    url: '/comic/toggleBan',
    method: 'post',
    params
  })

export const deleteManga = (params: any) =>
  request({
    url: '/comic/deleteManga',
    method: 'post',
    params
  })

export const startScraping = (params: any) =>
  request({
    url: '/comic/startScraping',
    method: 'post',
    params
  })

export const addOrUpdateComic = (params: any) =>
  request({
    url: '/comic/addOrUpdateComic',
    method: 'post',
    params
  })

export const queryChapters = (params: any) =>
  request({
    url: '/comic/queryChapters',
    method: 'post',
    params
  })

export const deleteChapter = (params: any) =>
  request({
    url: '/comic/deleteChapter',
    method: 'post',
    params
  })

export const toggleChapterStatus = (params: any) =>
  request({
    url: '/comic/toggleChapterStatus',
    method: 'post',
    params
  })

export const getChapterById = (params: any) =>
  request({
    url: '/comic/getChapterById',
    method: 'post',
    params
  })

export const addOrUpdateChapter = (params: any) =>
  request({
    url: '/comic/addOrUpdateChapter',
    method: 'post',
    params
  })

export const addContent = (params: any) =>
  request({
    url: '/comic/addContent',
    method: 'post',
    params
  })

export const queryContentList = (params: any) =>
  request({
    url: '/comic/queryContentList',
    method: 'post',
    params
  })

export const deleteContent = (params: any) =>
  request({
    url: '/comic/deleteContent',
    method: 'post',
    params
  })

export const updateContentSort = (params: any) =>
  request({
    url: '/comic/updateContentSort',
    method: 'post',
    params
  })
