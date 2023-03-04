import faker from 'faker'
import { Response, Request } from 'express'

// 生成随机用户数据
const generateRandomUsers = (count: number) => {
  const users = []
  for (let i = 0; i < count; i++) {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const nickname = faker.internet.userName(firstName, lastName)
    const phone = faker.phone.phoneNumber()
    const balance = faker.finance.amount(100, 1000, 2)
    const createDate = faker.date.between('2021-01-01', '2023-03-01')
    const status = faker.random.arrayElement([1, 0])
    users.push({
      id: i + 1,
      nickname,
      phone,
      balance,
      createDate,
      status
    })
  }
  return users
}

// 用户列表
const userList = generateRandomUsers(100)

// 获取用户列表
export const getUserList = (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, phone, createDateRange } = req.query

  // 过滤
  let filteredUsers = userList
  if (phone) {
    filteredUsers = filteredUsers.filter(user => user.phone.includes(phone as unknown as string))
  }
  if (createDateRange) {
    const [startDate, endDate] = (createDateRange as unknown as string).split('至')
    filteredUsers = filteredUsers.filter(user => new Date(user.createDate) >= new Date(startDate) && new Date(user.createDate) <= new Date(endDate))
  }

  // 分页
  const p = page as unknown as number
  const pSize = pageSize as unknown as number
  const startIndex = (p - 1) * pSize
  const endIndex = startIndex + pSize
  const pagedUsers = filteredUsers.slice(startIndex, endIndex)

  return res.json({
    code: 20000,
    data: {
      total: filteredUsers.length,
      list: pagedUsers
    }
  })
}
// 获取用户列表
export const enableUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
    }
  })
}
