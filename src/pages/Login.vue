<template>
    <v-app id="inspire">
        <v-main>
            <v-container
                    class="fill-height"
                    fluid
            >
                <v-row
                        align="center"
                        justify="center"
                >
                    <v-col
                            cols="12"
                            sm="8"
                            md="4"
                    >
                        <AuthForm></AuthForm>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import AuthForm from "../components/auth/AuthForm";
  export default {
    name: "Login",
    components: {AuthForm},
    async mounted(){
      console.log(this.access_token)
      console.log(this.user_id)
      console.log(this.expires_in)
      console.log(this.email)
    },
    props:["access_token","user_id", "expires_in","email"],

    methods:{
    }
  }
</script>

<style scoped>

</style>