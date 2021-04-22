
import api from "../../api/customer";
import {FETCH_CUSTOMERS} from "../actions/customer";

const state = {
  data:{
    customers:[]
  }
}
const actions = {
  [FETCH_CUSTOMERS]: async ({commit}) => {
    let customers = await api.fetchCustomers();
    commit("setCustomers",customers)
  },
}
const mutations = {
  setCustomers(state, customers){
    state.data.customers=customers;
  }
}


const getters = {
  getCustomers : state =>{
    return state.data.customers;
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}