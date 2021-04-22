
import {FETCH_SERVICES} from "../actions/service";
import api from "../../api/service"

const state = {
  data:{
    services:[]
  }
}
const actions = {
  [FETCH_SERVICES]: async ({commit}) => {
    let services = await api.fetchServices();
    commit("setServices",services)
  },
}
const mutations = {
  setServices(state, services){
    state.data.services=services;
  }
}


const getters = {
  getServices : state =>{
    return state.data.services;
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
}