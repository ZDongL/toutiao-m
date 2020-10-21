import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入全局组件
import './styles/index.scss'
// 导入 vant核心组件库
import Vant from 'vant'
// 导入 vant组件库样式
import 'vant/lib/index.css'
// 导入rem适配 包
import 'amfe-flexible'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
