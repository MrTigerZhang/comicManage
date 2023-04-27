import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(VueRouter)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  { // 首页 控制面板
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  { //   用户管理
    path: '/users',
    component: Layout,
    redirect: '/users/index',
    children: [
      {
        path: 'users',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/users/index.vue'),
        name: 'Users',
        meta: {
          title: 'users',
          icon: 'people',
          affix: true
        }
      }
    ]
  },
  { //   分类管理
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    children: [
      {
        path: 'category',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/category/index.vue'),
        name: 'category',
        meta: {
          title: 'category',
          icon: 'tree',
          affix: true
        }
      }
    ]
  },
  { //   作者管理
    path: '/author',
    component: Layout,
    redirect: '/author/index',
    children: [
      {
        path: 'author',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/author/index.vue'),
        name: 'author',
        meta: {
          title: 'author',
          icon: 'user',
          affix: true
        }
      }
    ]
  },{
    //帮助管理
    path: '/help',
    component: Layout,
    redirect: '/help/index',
    children: [
      {
        path: 'help',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/help/index.vue'),
        name: 'help',
        meta: {
          title: 'help',
          icon: 'guide',
          affix: true
        }
      },
      { // 帮助新增和编辑/详情页面
        path: 'helpeditor/:id(\\d+)',
        component: () => import('@/views/help/helpDetail.vue'),
        name: 'helpDetail',
        meta: {
          title: 'helpDetail',
          noCache: true,
          hidden: true
        }
      }
    ]
  },
  { //   漫画管理¬
    path: '/comic',
    component: Layout,
    redirect: '/comic/index',
    children: [
      { // 漫画列表页面
        path: 'comic',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/comic/index.vue'),
        name: 'comic',
        meta: {
          title: 'comic',
          icon: 'education',
          affix: true
        }
      },
      { // 漫画新增和编辑/详情页面
        path: 'editor/:id(\\d+)',
        component: () => import('@/views/comic/comidDetail.vue'),
        name: 'editor',
        meta: {
          title: 'comicDetail',
          noCache: true,
          hidden: true
        }
      },

      { // 漫画章节页面
        path: 'editorChapter/:comicId(\\d+)/:chapterId(\\d+)/:comicTitle',
        component: () => import('@/views/comic/chapterDetail.vue'),
        name: 'editorChapter',
        meta: {
          title: 'editorChapter',
          noCache: true,
          hidden: true
        }
      }
    ]
  }, { //   订单管理
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    children: [
      {
        path: 'order',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/order/index.vue'),
        name: 'order',
        meta: {
          title: 'order',
          icon: 'money',
          affix: true
        }
      }
    ]
  },
  //推荐管理 
  {
    path: '/recommend',
    component: Layout,
    redirect: '/recommend/index',
    children: [
      {
        path: 'recommend',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/recommend/index.vue'),
        name: 'recommend',
        meta: {
          title: 'recommend',
          icon: 'example',
          affix: true
        }
      }
    ]
  }

  , { //   消息管理
    path: '/msg',
    component: Layout,
    redirect: '/msg/index',
    children: [
      {
        path: 'msg',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/msg/index.vue'),
        name: 'msg',
        meta: {
          title: 'msg',
          icon: 'email',
          affix: true
        }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [

  {
    // 系统设置
    path: '/settings',
    component: Layout,
    redirect: '/settins/directive',
    meta: {
      title: 'settins',
      icon: 'component',
      roles: ['admin', 'editor'],
      alwaysShow: true
    },
    children: [
      { // 设置网站信息
        path: 'systemInfo',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/SEO/index.vue'),
        name: 'systemInfo',
        meta: {
          title: 'systemInfo',
          roles: ['admin', 'editor']
        }
      },

      { // 设置首页广告
        path: 'indexAd',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/AD/index.vue'),
        name: 'indexAd',
        meta: {
          title: 'indexAd',
          roles: ['admin', 'editor']
        }
      }
    ]

  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: 'Page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: 'Page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
