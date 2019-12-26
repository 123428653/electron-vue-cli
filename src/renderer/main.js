import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import {
  Button,
  Icon,
  Overlay
} from 'vant'
import '@/assets/sass/base.scss'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Overlay)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
