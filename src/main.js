import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store'
import '@/style/index.scss' // glob scss
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/descriptions-item.css'
import './plugins/element.js'
import animated from 'animate.css'
import '@/assets/iconfont/iconfont.css'

Vue.use(animated)
// Vue.use(ElementUI)
// import SlideVerify from 'vue-monoplasty-slide-verify'

// Vue.use(SlideVerify)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
