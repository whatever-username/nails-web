import {AUTH, GET_SMS, GET_TOKEN, GET_VK_DATA, LOGOUT, VK_AUTH} from "../actions/auth";
import authApi from "../../api/auth";
import router from "../../router/router";
import axios from "axios";

const state = {
  data: {
    user: null,
    phoneNumber: null
  }
}
const actions = {
  [GET_SMS]: async ({commit}, {phoneNumber}) => {
    await authApi.getSmsCode(phoneNumber)
    commit("setPhoneNumber", phoneNumber);
  },
  [GET_TOKEN]: async ({commit}, {smsCode}) => {
    let response = await authApi.getToken(state.data.phoneNumber, smsCode)
    commit("setUser", response.user);
    console.log(response.user)
    console.log(response.token)
    localStorage.setItem("token", response.token)
    axios.defaults.headers.common['Authorization'] = response.token;
    router.go();
  },
  [VK_AUTH]: async () => {
    await router.push("/vk")
  },
  [GET_VK_DATA]: async () => {
    await router.push("/vk")
  },
  [AUTH]: async ({commit}) => {
    let token = localStorage.getItem("token");
    let resp = await authApi.auth(token)
    console.log("in auth action:")
    console.log(resp)
    if (resp.id) {
      commit("setUser", resp);
      axios.defaults.headers.common['Authorization'] = token;
    }
    return resp
  },
  [LOGOUT]: async ({commit}) => {
    let resp = await authApi.logout(state.data.user.id)
    console.log("in logout action:")
    console.log(resp)
    commit('logout');
  },

}
const mutations = {
  setPhoneNumber(state, phoneNumber) {
    state.data.phoneNumber = phoneNumber;

  },
  setUser(state, user) {
    state.data.user = user
  },
  logout(state) {
    state.data.user = null;
    localStorage.removeItem("token")
    delete axios.defaults.headers.common['Authorization'];
  }
}

const getters = {
  getUser: state => {
    return state.data.user;
  },
  getRole: state => {
    return state.data.user ? state.data.user.role : null;
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}