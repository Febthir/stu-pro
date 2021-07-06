import request from '@/utils/request'
/**
 * 获取菜单树的数据 - 异步获取
 * @param {} pid
 * @returns
 */
export function getMenusTree(pid) {
    return request({
        url: 'system/menus/getMenusTree?pid=' + pid,
        method: 'get'
    })
}
/**
 * 获取菜单列表数据-异步获取
 * @param {*} params
 * @returns
 */
export function getMenus(params) {
    return request({
        url: 'system/menus/getMenus',
        method: 'post',
        params
    })
}
/**
 * 获取菜单树数据-编辑时
 * @param {*} ids
 * @returns
 */
export function getSupMenus(data) {
    // const data = Array.isArray(ids) || ids.length === 0 ? ids : Array.of(ids)
    return request({
        url: 'system/menus/getSupMenus',
        method: 'post',
        data
    })
}

export function getChild(pid) {
    return request({
        url: 'system/menus/getChild?pid=' + pid,
        method: 'get'
    })
}

export function buildMenus() {
    return request({
        url: 'api/menus/build',
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: 'api/menus',
        method: 'post',
        data
    })
}

export function del(ids) {
    return request({
        url: 'api/menus',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return request({
        url: 'api/menus',
        method: 'put',
        data
    })
}

export default {
    add,
    edit,
    del,
    getMenusTree,
    getSupMenus,
    getMenus,
    getChild
}
