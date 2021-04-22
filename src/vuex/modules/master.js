import {FETCH_MASTERS} from "../actions/master";
import api from "../../api/master";

const state = {
  data:{
    masters:[]
  }
}
const actions = {
  [FETCH_MASTERS]: async ({commit}) => {
    let masters = await api.fetchMasters();
    commit("setMasters",masters)
  },
}
const mutations = {
  setMasters(state, masters){
    state.data.masters=masters;
  }
}


const getters = {
  getMasters : state =>{
    return state.data.masters;
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}