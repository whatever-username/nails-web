import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from "./router/router"
import store from './vuex/vuex'
import vueGoodTable from './plugins/vueGoodTable'
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  vueGoodTable,
  store,

  render: h => h(App)
}).$mount('#app')
