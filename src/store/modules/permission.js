import router, { asyncRoutes, constantRoutes } from '@/router'
// import { getAsyncRoutes } from '@/router/asyncRouter'
import { getMenu } from '@/api/user'
import Layout from '@/layout/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    return routes.filter(route => {
        // const tmp = { ...route }
        if (hasPermission(roles, route)) {
            if (route.component) {
                if (route.component === 'Layout') {
                    route.component = Layout
                } else {
                    route.component = loadView(route.component)
                }
            }
            if (!!route.children && route.children.length) {
                route.children = filterAsyncRoutes(filterChildren(route.children), roles)
            } else {
                delete route['children']
                delete route['redirect']
            }
        }
        return true
    })
}
function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView') {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}
const loadView = view => {
    return resolve => require([`@/views/${view}`], resolve)
}
const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            let accessedRoutes
            // asyncRoutes()
            getMenu().then(res => {
                // console.log(res)
                const { data } = res
                // if (roles.includes('admin')) {
                //     accessedRoutes = asyncRoutes || []
                // } else {
                //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                // }
                accessedRoutes = filterAsyncRoutes(data, roles)
                // console.log(accessedRoutes)
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
            })
            // if (roles.includes('admin')) {
            //     accessedRoutes = asyncRoutes || []
            // } else {
            //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            // }
            // commit('SET_ROUTES', accessedRoutes)
            // resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
