<template>
    <v-dialog @click:outside="toggle" scrollable v-model="isOpened" width="50vw">
        <v-card>
            <v-card-title>
                <span class="headline">{{formattedDate+" "+this.selectedTime}}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>

                <v-container v-if="busyCurrentText">
                    {{busyCurrentText}}
                </v-container>
                <v-container v-else>
                    <v-row>
                        <v-col>Мастер:</v-col>
                        <v-col>{{getMastersName(value[0]? value[0].master: "")}}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>Процедура:</v-col>
                        <v-col>{{getServices.filter(rec=>rec.id==getFilterByService)[0].name}}</v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="declineRec" v-if="busyCurrentText">Отменить запись</v-btn>
                <v-btn @click="signUp" v-else>Записаться</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "UserCellDetails",
    data() {
      return {
      }
    },
    props: ["value", "isOpened", "selectedDate", "selectedTime"],
    methods: {
      getMastersName(master) {
        return master.lastname + " " + master.firstname;
      },
      getMasterText(masterObj) {
        return masterObj ? masterObj.lastname.concat(" ").concat(masterObj.firstname) : "";
      },
      getCustomerText(customerObj) {
        return customerObj ?
          (customerObj.lastname && customerObj.firstname) ?
            customerObj.lastname.concat(" ").concat(customerObj.firstname)
            : customerObj.username
          : "";
      },
      getServiceText(serviceObj) {
        return serviceObj ? serviceObj.name : "";
      },
      toggle() {
        this.$emit("toggle")
      },
      declineRec() {
        console.log(this.value.filter(rec => rec.cellState === "BUSY_CURRENT")[0])
        this.$emit("declineRec",this.value.filter(rec => rec.cellState === "BUSY_CURRENT")[0].assignmentUUID);
      },
      signUp(){
        console.log(this.value[0])
        this.$emit("signUp",this.value[0]);
      }
    },
    computed: {
      ...mapGetters(["getCustomers", "getServices", "getScheduleArray", "getFilterByService",
        "isLoading"]),
      formattedDate() {
        return this.selectedDate ? this.selectedDate : "";
      },
      busyCurrentText() {
        if (!this.value) {
          return null
        }
        let rec = this.value.filter(rec => rec.cellState === "BUSY_CURRENT")[0]
        if (rec) {
          return "Вы записаны к " + this.getMastersName(rec.master);
        }
        return null;
      },
      presentMasters() {
        if (!this.value) {
          return []
        }
        return this.value.map(rec => {
          return rec.master
        });
      }
    }
  }
</script>

<style scoped>

</style>