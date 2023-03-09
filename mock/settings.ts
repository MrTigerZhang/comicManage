import { Response, Request } from 'express'

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

// title: "",
// description: "",
// keywords: "",
export const getSystemInfo = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    code: 20000,
    data: {
      title: '好康漫画网',
      description: '好康漫画网，这里有你最喜欢最想看的漫画',
      keywords: '好康的漫画-你喜欢的漫画-我就爱漫画网-韩国漫画你懂的'
    }
  })
}
export const setSystemInfo = (req: Request, res: Response) => {
  console.log(req.body)
  return res.json({
    code: 20000,
    data: {

    }
  })
}
