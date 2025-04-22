/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
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
    component: () => import('/@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
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
    meta: {title: '代码生成器', icon: 'code-box-line',},
    children: [
      {
        path: 'usermanage',
        name: 'Usermanage',
        component: () => import('/src/views/generator/usermanage.vue'),
        meta: {title: '用户管理', icon: 'user-add-line', noClosable: true},
      },
      {
        path: 'programage',
        name: 'Programage',
        component: () => import('/src/views/generator/programage.vue'),
        meta: {title: '项目管理', icon: 'mini-program-line'},
      },
      {
        path: 'dataSource',
        name: 'DataSource',
        component: () => import('/src/views/generator/dataSource.vue'),
        meta: {title: '数据源管理', icon: 'bar-chart-fill'},
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('/src/views/generator/dictionary.vue'),
        meta: {title: '数据字典管理', icon: 'article-fill'},
      },
      {
        path: 'temStyle',
        name: 'TemStyle',
        component: () => import('/src/views/generator/temStyle.vue'),
        meta: {title: '模板风格管理', icon: 'clipboard-line'},
      },
      {
        path: 'commonCode',
        name: 'CommonCode',
        component: () => import('/src/views/generator/commonCode.vue'),
        meta: {title: '通用代码模板管理', icon: 'barcode-box-line'},
      },
      {
        path: 'generator',
        name: 'Generator',
        component: () => import('/src/views/generator/generator.vue'),
        meta: {title: '代码生成', icon: 'calendar-todo-fill'},
      },
      {
        path: 'usualAddress',
        name: 'UsualAddress',
        component: () => import('/src/views/generator/usualAddress.vue'),
        meta: {title: '常用网址', icon: 'barcode-box-line'},
      },
      {
        path: 'usualAddressShow',
        name: 'UsualAddressShow',
        component: () => import('/src/views/generator/usualAddressShow.vue'),
        meta: {title: '常用网址展示', icon: 'barcode-box-line'},
      },
    ],
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
