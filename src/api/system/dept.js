import request from '@/utils/request'

export function getDepts(params) {
    return request({
        url: 'system/dept/getDepts',
        method: 'get',
        params
    })
}

export function getSupDepts(data) {
    // const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
    return request({
        url: 'system/dept/getSupDepts',
        method: 'post',
        data
    })
}

export function add(data) {
    return request({
        url: 'api/dept',
        method: 'post',
        data
    })
}

export function del(ids) {
    return request({
        url: 'api/dept',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return request({
        url: 'api/dept',
        method: 'put',
        data
    })
}

export default { add, edit, del, getDepts, getSupDepts }
