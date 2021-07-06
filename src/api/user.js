import request from '@/utils/request'

// export function login(data) {
//     return request({
//         url: '/vue-admin-template/user/login',
//         method: 'post',
//         data
//     })
// }

// export function getInfo(token) {
//     return request({
//         url: '/vue-admin-template/user/info',
//         method: 'get',
//         params: { token }
//     })
// }

// export function logout() {
//     return request({
//         url: '/vue-admin-template/user/logout',
//         method: 'post'
//     })
// }
export function login(data) {
    return request({
        url: '/user/login',
        method: 'get',
        data
    })
}
export function getInfo(data) {
    return request({
        url: '/user/getInfo',
        method: 'post',
        data
    })
}
export function getMenu(data) {
    return request({
        url: '/user/getMenu',
        method: 'post',
        data
    })
}
export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}
