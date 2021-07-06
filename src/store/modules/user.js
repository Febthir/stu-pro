import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import storage from 'store'
const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        userInfo: undefined
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}
let uName
const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        uName = username
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password })
                .then(response => {
                    console.log(response)
                    const { data } = response
                    commit('SET_TOKEN', data.token)
                    setToken(data.token)
                    resolve()
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            const userInfo = storage.get('userInfo')
            uName = userInfo?.username ?? uName // uName = username ?? uName
            getInfo({ username: uName })
                .then(response => {
                    // console.log(response)
                    const { data } = response
                    if (!data) {
                        reject('Verification failed, please Login again.')
                    }

                    const { roles, name, avatar, userInfo } = data

                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject('getInfo: roles must be a non-null array!')
                    }

                    commit('SET_ROLES', roles)
                    commit('SET_NAME', name)
                    commit('SET_AVATAR', avatar)
                    commit('SET_USERINFO', userInfo)
                    storage.set('userInfo', data)
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    removeToken() // must remove  token  first
                    resetRouter()
                    commit('RESET_STATE')
                    storage.remove('userInfo')
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
