import Vue from 'vue'
import App from './App.vue'
import { getSize, isPlatform } from './assets/js/util'
import { getUserInfo } from './assets/js/ISALES'
import store from './vuex/store.js'
import router from './router'
Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.GLOBAL = {
  hasTitle:
    !!/hasTitle=y/.test(location.href) &&
    !/micromessenger/.test(navigator.userAgent.toLowerCase())
}
// 页面适配
getSize()
window.addEventListener('resize', () => {
  getSize()
})

new Vue({
  store,
  router,
  render: h => h(App),
  created () {
    if (isPlatform('isales')) {
      getUserInfo()
        .then(res => {
          console.log(res)
        })
      console.log('是泰行销环境')
    } else {
      console.log('不是泰行销')
    }
  }
}).$mount('#app')
