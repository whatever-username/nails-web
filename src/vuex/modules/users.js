// eslint-disable-next-line no-unused-vars
import {GET_USERS} from "../actions/users";
import usersApi from "../../api/users"

const state = {
  data: {
    users: [],
    loading: false
  }
}
const actions = {
  [GET_USERS]: async ({commit}) => {
    state.data.loading = true;
    let users = await usersApi.getUsers();
    console.log(users)
    state.data.loading = false
    commit("setUsers", users);

  },
}
const mutations = {
  setUsers(state, users) {
    state.data.users = users;
  },

}


const getters = {

  getUsers: state => {
    return state.data.users;
  },

}

export default {
  state,
  mutations,
  actions,
  getters,
}