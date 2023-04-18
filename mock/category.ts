import { Response, Request } from 'express'
import faker from 'faker'
import { ComicCategoryData } from '../src/api/types'

const testData: ComicCategoryData[] = []

// 创建 10 个测试分类
for (let i = 0; i < 10; i++) {
  testData.push({
    id: i + 1,
    name: faker.commerce.department(),
    description: faker.lorem.sentence(),
    code: faker.random.alphaNumeric(),
    sortOrder: i + 1,
    iconUrl: 'https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=git%E4%BB%8E%E5%BD%93%E5%89%8D%E5%88%86%E6%94%AF%E5%88%9B%E5%BB%BA%E6%96%B0%E5%88%86%E6%94%AF%E7%9A%84%E5%91%BD%E4%BB%A4&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=992877399,2634654365&os=2813449293,2910179310&simid=992877399,2634654365&pn=3&rn=1&di=7207123747461922817&ln=1579&fr=&fmq=1679643264000_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=15&spn=0&pi=0&gsm=1e&objurl=https%3A%2F%2Fimg-blog.csdnimg.cn%2F20200815154520566.png%3Fx-oss-process%3Dimage%2Fwatermark%2Ctype_ZmFuZ3poZW5naGVpdGk%2Cshadow_10%2Ctext_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3h0aG82Mg%3D%3D%2Csize_16%2Ccolor_FFFFFF%2Ct_70%23pic_center&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&dyTabStr=MCwxLDQsNSw2LDMsNyw4LDIsOQ%3D%3D',
    status: 'active'
  })
}

export const getCategories = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 10,
      list: testData
    }
  })
}
export const deleteCategory = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}

export const addCategory = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}