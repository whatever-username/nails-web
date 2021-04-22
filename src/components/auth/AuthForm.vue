<template>
    <v-card>
        <v-card-text>
            <v-container v-if="type===null">
                <v-row>
                    <v-col>
                        <v-btn @click="setType('phone')">Войти по номеру телефона</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn @click="setType('VK')" color="primary">Войти через VK</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-container v-else-if="type==='phone'">
                <v-container
                        v-if="!phoneAuth.isGetCodePressed"
                >
                    <v-row>
                        <v-col>
                            <v-text-field v-model="phoneAuth.phoneNumber" placeholder="Номер телефона"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn :disabled="!isPhoneNumberCorrect" @click="sendSMSCode">Получить код</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
                <v-container v-else>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="phoneAuth.smsCode" placeholder="Код из SMS"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn @click="getToken">Продолжить</v-btn>
                        </v-col>
                    </v-row>
                </v-container>

            </v-container>
<!--            <v-container v-else-if="type==='VK'">-->
<!--                <v-row>-->
<!--                    <v-col>-->
<!--                        <v-text-field>Номер телефона</v-text-field>-->
<!--                    </v-col>-->
<!--                </v-row>-->
<!--                <v-row>-->
<!--                    <v-col>-->
<!--                        <v-text-field>Пароль</v-text-field>-->
<!--                    </v-col>-->
<!--                </v-row>-->
<!--            </v-container>-->
        </v-card-text>
    </v-card>

</template>

<script>
  import {GET_SMS, GET_TOKEN, VK_AUTH} from "../../vuex/actions/auth";
  export default {
    name: "AuthForm",
    data() {
      return {
        type: null,
        phoneAuth: {
          isGetCodePressed: false,
          phoneNumber: "",
          smsCode:""
        }
      }
    },
    methods: {
      setType(type) {
        this.type = type;
        if (type==="VK"){
          this.$store.dispatch(VK_AUTH);
        }
      },
      sendSMSCode(){
        this.phoneAuth.isGetCodePressed =  true
        let phoneNumber= this.phoneAuth.phoneNumber
        this.$store.dispatch(GET_SMS, {phoneNumber})
      },
      async getToken(){
        console.log("getToken()")
        let smsCode = this.phoneAuth.smsCode
        await this.$store.dispatch(GET_TOKEN,{smsCode});

      }
    },
    computed:{
      isPhoneNumberCorrect(){
        return true;
      }
    }
  }
</script>

<style scoped>

</style>