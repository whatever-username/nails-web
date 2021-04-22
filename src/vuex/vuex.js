import Vue from "vue";
import Vuex from "vuex";
import auth from "../vuex/modules/auth";
import service from "../vuex/modules/service";
import master from "../vuex/modules/master";
import schedule from "../vuex/modules/schedule";
import customer from "../vuex/modules/customer";
import users from "../vuex/modules/users";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters:{},
  modules: {
    auth,
    service,
    master,
    schedule,
    customer,
    users
  }
});

