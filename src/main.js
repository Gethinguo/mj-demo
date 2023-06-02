import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fetch from '@/libs/fetch'

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

Vue.prototype.$fetch = fetch
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
