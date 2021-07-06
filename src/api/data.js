import request from '@/utils/request'
import qs from 'qs'
export function initData(url, data) {
    return request({
        url,
        method: 'post',
        data: qs.stringify(data, { indices: false })
    })
}

export function download(url, params) {
    return request({
        url: url + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
        responseType: 'blob'
    })
}
