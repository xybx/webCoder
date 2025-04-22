/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
// @ts-ignore
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordName } from 'vue-router'
import type { VabRouteRecordRaw } from './types'
import { authentication, base, isHashRouterMode } from '/@/config'
import { setupPermissions } from '/@/router/permissions'
import Layout from '/@vab/layouts/index.vue'

export const constantRoutes: VabRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/loginst.vue'),
    meta: {
      hidden: true,
    },
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('/@/views/login/logined.vue'),
  //   meta: {
  //     hidden: true,
  //   },
  // },
  {
    path: '/403',
    name: '403',
    component: () => import('/@/views/error/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('/@/views/error/404.vue'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes: VabRouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    meta: {title: '首页', icon: 'home-2-line',levelHidden: true,breadcrumbHidden: true},
    children: [{
        path: 'home',
        name: 'Home',
        component: () => import('/src/views/home/index.vue'),
        meta: {title: '首页', icon: 'home-2-line',noClosable: true},
    }],
  },
  {
   path:'/listpage',
   name:'Listpage',
   component: Layout,
   meta: {title: '列表页', icon: 'code-box-line',levelHidden: true,breadcrumbHidden: true},
   children:[{
        path: 'list',
        name: 'List',
        component: () => import('/src/views/listpage/list.vue'),
        meta: {title: '列表页', icon: 'code-box-line'},
    },
    {
      path: 'Datasource22List',
      name: 'Datasource22List',
      component: () => import('/src/views/listpage/Datasource22List.vue'),
      meta: {title: '数据源管理', icon: 'code-box-line'},
  }
]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

const router = createRouter({
  history: isHashRouterMode ? createWebHashHistory(base) : createWebHistory(base),
  routes: constantRoutes as RouteRecordRaw[],
})

const fatteningRoutes = (routes: VabRouteRecordRaw[]): VabRouteRecordRaw[] => {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

const addRouter = (routes: VabRouteRecordRaw[]) => {
  routes.forEach((route: VabRouteRecordRaw) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export const resetRouter = (routes: VabRouteRecordRaw[] = constantRoutes) => {
  routes.map((route: VabRouteRecordRaw) => {
    if (route.children) route.children = fatteningRoutes(route.children)
  })
  router.getRoutes().forEach((route) => {
    if (route.name) {
      const routeName: RouteRecordName = route.name
      router.hasRoute(routeName) && router.removeRoute(routeName)
    }
  })
  addRouter(routes)
}

export const setupRouter = (app: App<Element>) => {
  if (authentication === 'intelligence') addRouter(asyncRoutes)
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
