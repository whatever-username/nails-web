<template>
    <v-app>
        <div>
            <v-app-bar
                    :elevate-on-scroll="true"
                    dark
                    dense
            >
                <v-app-bar-nav-icon></v-app-bar-nav-icon>

                <v-toolbar-title>{{appTitle}}</v-toolbar-title>
                <v-toolbar-items>
                    <v-btn @click="$router.push('/schedule')">Расписание</v-btn>
                    <v-btn @click="$router.push('/users')" v-if="getRole==='ROLE_ADMIN'">Пользователи</v-btn>
                </v-toolbar-items>
                <v-spacer></v-spacer>
                <v-dialog persistent v-if="!getUser" v-model="isLoginModalOpened">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                                @click="isLoginModalOpened=false"
                                color="primary"
                                small
                                v-bind="attrs"
                                v-on="on"
                        >
                            Войти
                        </v-btn>
                    </template>
                    <AuthForm></AuthForm>
                </v-dialog>
                <v-col class="text-right align-end justify-end" v-else>
                    <v-chip>{{userInfo}}</v-chip>
                    <v-btn @click="logout">Выйти</v-btn>
                </v-col>


            </v-app-bar>
        </div>

        <router-view :key="$route.fullPath"/>


    </v-app>
</template>

<script>

  import {APP_TITLE} from "./cfg";
  import AuthForm from "./components/auth/AuthForm";
  import {mapGetters} from "vuex";
  import {LOGOUT} from "./vuex/actions/auth";
  import router from "./router/router";

  export default {
    name: 'App',
    components: {AuthForm},
    async mounted() {
      console.log(this.getUser)
    },
    data() {
      return {
        appTitle: APP_TITLE,
        isLoginModalOpened: false,
      }
    },
    methods: {
      logout() {
        this.$store.dispatch(LOGOUT);
        router.go();
      }
    },
    computed: {
      ...mapGetters(["getUser", "getRole"]),
      userInfo() {
        let user = this.getUser;
        let role = user.role;
        if (user.firstname !== null && user.lastname !== null) {
          return user.firstname + " " + user.lastname;
        }
        return user.phoneNumber + '(' + role + ')';
      }
    },

  };
</script>
