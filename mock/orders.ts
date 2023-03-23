import { Response, Request } from 'express'
import faker from 'faker'
import { ComicCategoryData } from '../src/api/types'

const testData: ComicCategoryData[] = []

function generateOrders(count = 10) {
  const orders = []

  for (let i = 0; i < count; i++) {
    const order = {
      orderNumber: faker.datatype.uuid(),
      username: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      rechargeName: faker.commerce.productName(),
      status: faker.helpers.randomize([
        '1',
        '2',
        '3'
      ]),
      paymentMethod: faker.helpers.randomize([
        '支付宝',
        '微信',
        '银行卡',
        '手动支付'
      ]),
      paymentTime: faker.date.recent(),
      createTime: faker.date.past(),
      updateTime: faker.date.recent(),
      remark: faker.lorem.sentence()
    }

    orders.push(order)
  }

  return orders
}

export const selectOrders = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 50,
      list: generateOrders(10)
    }
  })
}

export const manualPay = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 10,
      list: testData
    }
  })
}
function generateMessages(num:number) {
  const messages = []

  for (let i = 0; i < num; i++) {
    const message = {
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      date: faker.date.between('2022-01-01', '2023-01-01').toISOString(),
      status: faker.random.arrayElement(['read', 'unread']),
      msg: faker.lorem.sentence()
    }
    messages.push(message)
  }

  return messages
}

export const select = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 10,
      list: generateMessages(10)
    }
  })
}
