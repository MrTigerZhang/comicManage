import { Response, Request } from 'express'
import faker from 'faker'
import { ComicCategoryData } from '../src/api/types'

function generateFakeAuthors(count:number) {
  const authors = []

  for (let i = 0; i < count; i++) {
    const author = {
      id: faker.random.uuid(),
      icon: faker.image.avatar(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      createDate: faker.date.past().toISOString().split('T')[0],
      status: faker.random.boolean() ? 'active' : 'inactive'
    }
    authors.push(author)
  }

  return authors
}

export const getAuthors = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 10,
      list: generateFakeAuthors(10)
    }
  })
}
export const addAuthor = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}

export const updateAuthor = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}
export const deleteAuthor = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}
export const toggleAuthorStatus = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {

    }
  })
}
