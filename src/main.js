import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// 样式
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css

// 权限指令
import checkPer from '@/utils/permission'
import permission from './directive/permission'
// 数据字典
import dict from './utils/Dict'
// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router'

import '@/assets/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock')
    mockXHR()
}
Vue.use(checkPer)
Vue.use(permission)
Vue.use(dict)
Vue.use(VueHighlightJS)

// set ElementUI lang to EN
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    locale
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
