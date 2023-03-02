import Mock from 'mockjs'
// 模拟用户数据
const users = [
    { username: 'manage', password: '123456', accessToken: 'admin-token' },
    { username: 'editor', password: '123456', accessToken: 'editor-token' }
]

// 模拟登陆接口
Mock.mock('/users/login', 'post', (options) => {
    const { username, password } = JSON.parse(options.body)
    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
        return {
            code: 500,
            message: '用户名或密码错误'
        }
    } 
    return {
        code: 200,
        message: '登陆成功',
        data: {
            token: user.accessToken
        }
    }
})

Mock.mock('/users/info', 'post',  {
    code: 200,
    data: {
        roles: ['admin'], // 用户角色，这里假设是管理员
        name: '@cname', // 随机生成中文名字
        avatar: Mock.Random.image('200x200', '#50B347', '#FFF', 'Mock.js'), // 随机生成头像
        introduction: '@paragraph(1, 3)', // 随机生成一到三段话的介绍
    },
})