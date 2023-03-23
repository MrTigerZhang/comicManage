import { Response, Request } from 'express'
import faker from 'faker'

// 创建一个函数来生成单个漫画的模拟数据
function generateFakeManga() {
  return {
    id: faker.datatype.number(40),
    name: faker.name.title(),
    category: faker.random.arrayElement(['冒险', '奇幻', '科幻', '悬疑', '恐怖']),
    author: faker.name.findName(),
    description: faker.lorem.paragraph(),
    thumbnail: faker.image.imageUrl(),
    currentEpisode: faker.datatype.number({ min: 1, max: 200 }),
    status: faker.random.arrayElement(['连载中', '已完结']),
    createDate: faker.date.past().toISOString().split('T')[0],
    updateDate: faker.date.past().toISOString().split('T')[0],
    freeUntil: faker.datatype.number(40),
    rating: faker.datatype.float({ min: 1, max: 5, precision: 0.1 }),
    popularity: faker.datatype.number({ min: 100, max: 10000 }),
    purchasePopularity: faker.datatype.number({ min: 10, max: 5000 }),
    isBanned: faker.datatype.boolean(),
    chapters: 123
  }
}

// 创建一个函数来生成一定数量的漫画模拟数据
function generateFakeMangaList(count: number) {
  const mangaList = []

  for (let i = 0; i < count; i++) {
    mangaList.push(generateFakeManga())
  }

  return mangaList
}

// 生成20条模拟漫画数据
const testData = generateFakeMangaList(10)

console.log(testData)

export const getComicList = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      total: 20,
      list: testData
    }
  })
}

export const getCategorys = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: [
      { label: '玄幻', value: '1' },
      { label: '成人', value: '2' }
    ]
  })
}

export const toggleBan = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getComicDetail = (req: Request, res: Response) => {
  // 创建测试数据
  const testData2 = {
    name: faker.name.title(),
    category: '2',
    author: '1',
    description: faker.lorem.paragraphs(2),
    thumbnail: faker.image.imageUrl(100, 100, 'cartoons', true),
    status: '1',
    banned: '2'
  }
  return res.json({
    code: 20000,
    data: testData2
  })
}

export const getAuthors2 = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: [
      { name: '李世民', id: '1' },
      { name: '成龙', id: '2' }
    ]
  })
}

const generateFakeChapters = (count: number) => {
  const chapters = []

  for (let i = 0; i < count; i++) {
    chapters.push({
      id: i + 1,
      name: faker.lorem.words(),
      order: i + 1,
      thumbnail: faker.image.imageUrl(),
      pageCount: faker.random.number({ min: 10, max: 50 }),
      price: faker.commerce.price(),
      popularity: faker.random.number({ min: 100, max: 10000 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      status: faker.random.arrayElement([0, 1])
    })
  }

  return chapters
}

export const queryChapters = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: {
      list: generateFakeChapters(10),
      total: 10
    }
  })
}

const chapterForm = {
  name: faker.random.words(3),
  thumbnail: faker.image.imageUrl(),
  pageCount: faker.random.number({ min: 1, max: 30 }),
  price: faker.commerce.price(),
  status: faker.random.boolean(),
  order: faker.random.number({ min: 1, max: 100 }),
  chapterId: faker.datatype.uuid()
}

export const getChapterById = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: chapterForm
  })
}

export const addOrUpdateChapter = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: chapterForm
  })
}

export const queryContentList = (req: Request, res: Response) => {
  return res.json({
    code: 20000,
    data: [{
      id: 1,
      pageNumber: 1,
      imgSrc: 'https://via.placeholder.com/100'
    },
    {
      id: 3,
      pageNumber: 2,
      imgSrc: 'https://via.placeholder.com/100'
    }, {
      id: 4,
      pageNumber: 2,
      imgSrc: 'https://via.placeholder.com/100'
    }, {
      id: 5,
      pageNumber: 2,
      imgSrc: 'https://via.placeholder.com/100'
    }, {
      id: 6,
      pageNumber: 2,
      imgSrc: 'https://via.placeholder.com/100'
    }, {
      id: 7,
      pageNumber: 2,
      imgSrc: 'https://via.placeholder.com/100'
    }
    ]
  })
}
