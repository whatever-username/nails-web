<template>
    <v-dialog @click:outside="toggle" scrollable v-model="isOpened" width="50vw">
        <v-card>
            <v-card-title>
                <span class="headline">{{formattedDate+" "+this.selectedTime}}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>

                <v-container>
                    <v-row>
                        <v-col cols="4">Мастер</v-col>
                        <v-col cols="4">Клиент</v-col>
                        <v-col cols="4">Процедура</v-col>
                    </v-row>
                    <v-row
                            :key="item.master.id"
                            v-for="item in value"
                    >
                        <v-col cols="4">{{getMasterText(item.master)}}</v-col>
                        <v-col cols="4" v-if="item.customer">{{getCustomerText(item.customer)}}</v-col>
                        <v-col cols="4" v-if="item.customer">{{getServiceText(item.service)}}</v-col>
                        <v-col cols="8" v-if="!item.customer">
                            <v-btn @click="toggleCustomerAndServiceModal(item.master)" width="100%">Назначить</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="toggleMastersModal">Добавить мастера</v-btn>
                <v-dialog @click:outside="toggleMastersModal" scrollable v-model="isMastersGridVisible" width="50vw">
                    <v-card>
                        <MastersGrid :toExclude="presentMasters" @click="addMaster"></MastersGrid>
                    </v-card>
                </v-dialog>
                <v-dialog @click:outside="toggleCustomerAndServiceModal" scrollable
                          v-model="isCustomerAndServiceGridVisible" width="50vw">
                    <v-card>
                        <CustomerAndServiceSelectionModal
                                :master="addingToMaster"
                                :selectedDate="selectedDate"
                                :selectedTime="selectedTime"
                                @proceed="customerAndServiceSelected"
                        >
                        </CustomerAndServiceSelectionModal>
                    </v-card>
                </v-dialog>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import MastersGrid from "./MastersGrid";
  import CustomerAndServiceSelectionModal from "./CustomerAndServiceSelectionModal";
  import {mapGetters} from "vuex";
  import scheduleApi from "../api/schedule";
  import {v4 as uuidv4} from 'uuid';

  export default {
    name: "CellDetails",
    components: {CustomerAndServiceSelectionModal, MastersGrid},
    data() {
      return {
        isMastersGridVisible: false,
        isCustomerAndServiceGridVisible: false,
        addingToMaster: null,
      }
    },
    props: ["value", "isOpened", "selectedDate", "selectedTime"],
    methods: {
      //Назначение услуги и клиента
      toggleCustomerAndServiceModal(master) {
        this.addingToMaster = master;
        this.isCustomerAndServiceGridVisible = !this.isCustomerAndServiceGridVisible;
      },/*
      setAddingToMaster(master){
        this.addingToMaster = master;
      },*/
      customerAndServiceSelected(customerId, serviceId, master) {
        this.isCustomerAndServiceGridVisible = !this.isCustomerAndServiceGridVisible;
        let customer = this.getCustomers.filter(c => c.id === customerId)[0];
        let service = this.getServices.filter(c => c.id === serviceId)[0];
        let keys = Object.keys(this.getScheduleArray[this.selectedDate]);
        let index = keys.indexOf(this.selectedTime);
        let assignmentUUID = uuidv4();
        for (let i = index; i < index + service.duration; i++) {
          let curRec = this.getScheduleArray[this.selectedDate][keys[i]].filter(rec => rec.master.id === master.id)[0];
          console.log(curRec)
          curRec.customer = customer;
          curRec.service = service;
          curRec.assignmentUUID = assignmentUUID;
          scheduleApi.assignCustomerAndService(curRec);
        }
      },
      //
      getMasterText(masterObj) {
        if (masterObj) {
          if (masterObj.lastname && masterObj.firstname) {
            return masterObj.lastname.concat(" ").concat(masterObj.firstname)
          } else {
            return masterObj.username;
          }
        }
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
      toggleMastersModal() {
        this.isMastersGridVisible = !this.isMastersGridVisible;
      },
      addMaster(master) {
        this.$emit("addMaster", master);
      }
    },
    computed: {
      ...mapGetters(["getCustomers", "getServices", "getScheduleArray", "isLoading"]),
      formattedDate() {
        return this.selectedDate ? this.selectedDate : "";
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