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
    icon: faker.image.imageUrl(),
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
