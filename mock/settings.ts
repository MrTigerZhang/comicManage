import { Response, Request } from 'express'

// 生成随机用户数据
export const getIndexAd = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    code: 20000,
    data: {
      link: 'detail/1',
      imgUrl: 'https://gd2.alicdn.com/imgextra/i2/2058861653/O1CN01orxicZ1O57W04vgSi_!!2058861653.jpg',
      isShow: 1
    }
  })
}
export const setIndexAd = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    code: 20000,
    data: {

    }
  })
}
