import { stringify } from 'qs'
import { recordRoute } from '/@/config'
import type { VabRoute, VabRouteRecordRaw } from '/@/router/types'
import { hasPermission } from '/@/utils/permission'
import { isExternal } from '/@/utils/validate'

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export const convertRouter = (asyncRoutes: VabRouteRecordRaw[]) => {
  const routeAllPathToCompMap = import.meta.glob(`../**/*.vue`)
  return asyncRoutes.map((route: VabRouteRecordRaw) => {
    if (route.component)
      if (route.component === 'Layout') route.component = () => import('/@vab/layouts/index.vue')
      else {
        const index = route.component.indexOf('views')
        const path = index > 0 ? route.component.slice(index) : `${route.component}`
        route.component = routeAllPathToCompMap[`../${path}`]
      }
    if (route.children && route.children.length) route.children = convertRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @description 根据roles数组拦截路由
 * @param routes 路由
 * @param rolesControl 是否进行权限控制
 * @param baseUrl 基础路由
 * @returns {[]}
 */
export const filterRoutes = (routes: VabRouteRecordRaw[], rolesControl: boolean, baseUrl = '/') => {
  return routes
    .filter((route: VabRouteRecordRaw) => (rolesControl && route.meta && route.meta.guard ? hasPermission(route.meta.guard) : true))
    .map((route: VabRouteRecordRaw) => {
      route = { ...route }
      if (route.path !== '*' && !isExternal(route.path)) {
        if (baseUrl.slice(-1) === '/') route.path = baseUrl + (route.path[0] === '/' ? route.path.slice(1) : route.path)
        else route.path = baseUrl + (route.path[0] === '/' ? route.path : `/${route.path}`)
      }
      if (route.children && route.children.length > 0) {
        route.children = filterRoutes(route.children, rolesControl, route.path)
        if (route.children.length > 0) {
          route.childrenPathList = route.children.flatMap((item: VabRouteRecordRaw) => item.childrenPathList)
          if (!route.redirect) route.redirect = route.children[0].redirect ? route.children[0].redirect : route.children[0].path
        }
      } else route.childrenPathList = [route.path]
      return route
    })
}

/**
 * 根据path路径获取matched
 * @param routes 菜单routes
 * @param name 路由名
 * @returns {*} matched
 */
/**
 * 根据path路径获取matched
 * @param routes 菜单routes
 * @param path 路径
 * @returns {*} matched
 */
export const handleMatched = (routes: VabRouteRecordRaw[], path: string): VabRouteRecordRaw[] => {
  return routes
    .filter((route) => route.childrenPathList.indexOf(path) + 1)
    .flatMap((route) => (route.children ? [route, ...handleMatched(route.children, path)] : [route]))
}

/**
 * 生成单个多标签元素，可用于同步/异步添加多标签
 * @param tag route页信息
 */
export const handleTabs = (tag: VabRoute) => {
  let parentIcon = null
  if (tag.matched)
    for (let i = tag.matched.length - 2; i >= 0; i--) if (!parentIcon && tag.matched[i].meta.icon) parentIcon = tag.matched[i].meta.icon
  if (!parentIcon) parentIcon = 'menu-line'
  const path = handleActivePath(tag, true)
  if (tag.name && tag.meta && tag.meta.tabHidden !== true) {
    return {
      path: path,
      query: tag.query,
      params: tag.params,
      name: tag.name,
      parentIcon,
      meta: { ...tag.meta },
    }
  }
}

/**
 * 根据当前route获取激活菜单
 * @param route 当前路由
 * @param isTab 是否是标签
 * @returns {string|*}
 */
export const handleActivePath = (route: VabRoute, isTab = false) => {
  const { meta, path } = route
  const rawPath = route.matched ? route.matched[route.matched.length - 1].path : path
  const fullPath = route.query && Object.keys(route.query).length ? `${route.path}?${stringify(route.query)}` : route.path
  if (isTab) return meta.dynamicNewTab ? fullPath : rawPath
  if (meta.activeMenu) return meta.activeMenu
  return fullPath
}

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export const toLoginRoute = (currentPath: string) => {
  if (recordRoute && currentPath !== '/')
    return {
      path: '/login',
      // query: { redirect: currentPath },
      query: {},
      replace: true,
    }
  else return { path: '/login', replace: true }
}

/**
 * 获取路由中所有的Name
 * @param routes 路由数组
 * @returns {*} Name数组
 */
export const getNames = (routes: VabRouteRecordRaw[]): string[] => {
  return routes.flatMap((route: VabRouteRecordRaw) => {
    const names = []
    if (route.name) names.push(route.name)
    if (route.children) names.push(...getNames(route.children))
    return names
  })
}
