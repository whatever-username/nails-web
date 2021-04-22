<template>
    <v-container>
        <v-row>
            <v-col>
                <vue-good-table
                        :columns="columns"
                        :rows="getUsers"
                        @on-row-click="editUser"
                ></vue-good-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import {GET_USERS} from "../vuex/actions/users";
  import {mapGetters} from "vuex";

  export default {
    name: "Users",
    async mounted() {
      await this.$store.dispatch(GET_USERS);
    },
    data() {
      return {
        columns: [
          {
            label: 'Username',
            field: 'username'
          },
          {
            label: 'Имя',
            field: 'firstname'
          },
          {
            label: 'Фамилия',
            field: 'lastname'
          },
          {
            label: 'Отчество',
            field: 'fathername'
          },
          {
            label: 'Email',
            field: 'email'
          },
          {
            label: 'Номер телефона',
            field: 'phoneNumber'
          },
          {
            label: 'Роль',
            field: 'role'
          },
        ],
      }
    },
    methods:{
      editUser(user){
        console.log(user.row)
      }
    },
    computed:{
      ...mapGetters(["getUsers"])
    }
  }
</script>

<style scoped>

</style>