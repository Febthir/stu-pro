import request from '@/utils/request'

export function kickOut(data) {
    return request({
        url: '/monitor/online/kickOut',
        method: 'post',
        data
    })
}
