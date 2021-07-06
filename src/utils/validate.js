/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}
/**
 * 手机号码验证，含必填校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validPhone = (rule, value, callback) => {
    const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
    if (!value) {
        callback(new Error('请输入电话号码'))
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的11位手机号码'))
    } else {
        callback()
    }
}
