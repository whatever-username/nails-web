<template>
    <v-dialog @click:outside="toggle" scrollable v-model="isOpened" width="50vw">
        <v-card>
            <v-card-title>
                <span class="headline">{{formattedDate+" "+this.selectedTime}}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container v-if="this.info && this.info.customer">
                    <v-row>
                        <v-col>{{this.getCustomerText(info.customer)}}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>{{info.service.name}}</v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end" v-if="info && !info.customer">
                <v-btn @click="declineRec">Отменить запись</v-btn>
            </v-card-actions>
            <v-card-actions class="justify-end" v-if="!info">
                <v-btn @click="assign">Записаться</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";
  import {ADD_MASTER_TO_CELL_MASTER, DECLINE_REC_BY_DATE_TIME} from "../../vuex/actions/schedule";

  export default {
    name: "MasterCellDetails",
    data() {
      return {}
    },
    props: ["value", "isOpened", "selectedDate", "selectedTime"],
    methods: {
      getCustomerText(customer) {
        let customerText = (customer.firstname && customer.lastname) ? customer.lastname.concat(" ").concat(customer.firstname) : customer.username;
        return customerText;
      },
      toggle() {
        this.$emit("toggle")
      },
      async assign() {
        let payload = {};
        payload.date = this.selectedDate;
        payload.time = this.selectedTime;
        console.log(payload)
        await this.$store.dispatch(ADD_MASTER_TO_CELL_MASTER, {payload})
      },
      async declineRec(){
        let payload = {};
        payload.date = this.selectedDate;
        payload.time = this.selectedTime;
        await this.$store.dispatch(DECLINE_REC_BY_DATE_TIME, {payload});
      }
    },
    computed: {
      ...mapGetters(["getCustomers", "getServices", "getScheduleArray", "getFilterByService",
        "isLoading"]),
      formattedDate() {
        return this.selectedDate ? this.selectedDate : "";
      },
      info() {
        return this.value.length ? this.value[0] : null;
      }
    }
  }
</script>

<style scoped>

</style>