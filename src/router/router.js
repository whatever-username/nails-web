import VueRouter from "vue-router";
import Vue from "vue"
import Login from "../pages/Login";
import Service from "../pages/Service";
import {VK_CLIENT_ID} from "../cfg";
import Index from "../pages/Index";
import {AUTH} from "../vuex/actions/auth";
import vuex from "../vuex/vuex";
import Users from "../pages/Users";
Vue.use(VueRouter);

const routes = [
  {
    path: '/vk',
    beforeEnter: (from) => {
      console.log(from)
    },
    redirect:
      () => {
        let url = "https://oauth.vk.com/authorize?client_id=" + VK_CLIENT_ID + "&redirect_uri=http://192.168.1.52:8080/login/vk&scope=email&response_type=token&v=5.122";
        console.log(url)
        window.location = url;

      }
  },
  {
    path: '/login', component:
    Login
  }, {
    path: '/', component:
    Index
  }
  ,
  {
    path: '/services', component:
    Service
  },
  {
    path: '/users',
    beforeEnter: (to, from, next) => {
      if (getRole() === "ROLE_ADMIN") {
        next();
      }
    },
    component: Users
  }
  ,
  {
    path: '/schedule',
    component: function () {
      if(getRole()==="ROLE_ADMIN"){

        return import('../pages/Schedule')
      }else if(getRole()==="ROLE_MASTER"){
        return import('../pages/MasterSchedule.vue')
      }else {
        return import('../pages/UserSchedule.vue')
      }
    }
  }
  ,
  {
    path: '/login/vk',
    props:
      route => getQueryParams(route),
    component:
    Login
  }
  ,
]
const router = new VueRouter({
  routes,
  mode: 'history'
});
router.beforeEach(async (to, from, next) => {
  if (localStorage.getItem("token") && !vuex.getters.getUser) {
    let user = await tryToGetAuth();
    console.log(user)
  }
  next();
  console.log(to)
  console.log(from)
  console.log(next)

});

async function tryToGetAuth() {
  console.log("trying to get auth")
  return await vuex.dispatch(AUTH);
}

function getRole() {
  return vuex.getters.getRole;
}

function getQueryParams(route) {
  let params = new Object();
  let query = route.hash.split("&");
  params.access_token = query.filter(value => value.includes("access_token"))[0].split("=")[1];
  params.user_id = query.filter(value => value.includes("user_id"))[0].split("=")[1];
  params.expires_in = query.filter(value => value.includes("expires_in"))[0].split("=")[1];
  params.email = query.filter(value => value.includes("email"))[0].split("=")[1];
  return params;
}

export default router

