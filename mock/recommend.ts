
import { Response, Request } from 'express'
import faker from 'faker'


export const getList = (req: Request, res: Response) => {
    return res.json({
        code: 20000,
        data: {
            total: 10,
            list: [
                {
                    id: 1,
                    name: faker.commerce.department(),
                    description: faker.lorem.sentence(),
                    code: faker.random.alphaNumeric(),
                    sortOrder: 1,
                    content: [
                        {
                            id: 1,
                            name: faker.commerce.department(),
                        },{
                            id: 2,
                            name: faker.commerce.department(),
                        },{
                            id: 3,
                            name: faker.commerce.department(),
                        }
                    ]
                }]
        }
    })
}