<template>
    <v-card>
        <v-card-title v-html="this.selectedDate+' '+
            this.selectedTime + '<br>'+
            this.master.lastname +' '+ this.master.firstname+ '<br>'+'Время до след. записи: '+this.freeTime">
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-select
                                :items="getCustomers"
                                item-value="id"
                                placeholder="Клиент"
                                solo
                                v-model="selectedCustomer"
                        >
                            <template v-slot:item="{item}">
                                <v-row>
                                    <v-col>{{item.lastname+" "+item.firstname}}</v-col>
                                </v-row>
                            </template>
                            <template v-slot:selection="{item}">
                                <v-row>
                                    <v-col>{{item.lastname+" "+item.firstname}}</v-col>
                                </v-row>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-select
                                :items="getServicesLimited"
                                item-value="id"
                                placeholder="Услуга"
                                solo
                                v-model="selectedService"
                        >
                            <template v-slot:prepend-item>
                                <v-container>
                                    <v-row>
                                        <v-col>Наименование</v-col>
                                        <v-col>Стоимость</v-col>
                                        <v-col>Продолжительность</v-col>
                                    </v-row>
                                </v-container>
                            </template>
                            <template v-slot:item="{item}">
                                <v-row>
                                    <v-col>{{item.name}}</v-col>
                                    <v-col>{{item.price}}</v-col>
                                    <v-col>{{item.duration}}</v-col>
                                </v-row>
                            </template>
                            <template v-slot:selection="{item}">
                                <v-row>
                                    <v-col>{{item.name}}</v-col>
                                </v-row>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
            </v-container>
            <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="proceed">ОК</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import {FETCH_CUSTOMERS} from "../vuex/actions/customer";
  import {mapGetters} from "vuex";
  import {FETCH_SERVICES} from "../vuex/actions/service";

  export default {
    name: "CustomerAndServiceSelectionModal",
    async mounted() {
      await this.$store.dispatch(FETCH_CUSTOMERS);
      await this.$store.dispatch(FETCH_SERVICES);
        this.recalcFreeTime();
    },
    props: ["selectedTime", "selectedDate", "master"],
    data() {
      return {
        selectedCustomer: null,
        selectedService: null,

        freeTime: 0,
      }
    },
    computed: {
      ...mapGetters(["getCustomers", "getServices", "getScheduleArray", "getTimeLine"]),
      getServicesLimited(){
        return this.getServices.filter(s=>s.duration<=this.freeTime);
      }
    },
    methods: {
      proceed() {
        this.$emit("proceed", this.selectedCustomer, this.selectedService, this.master)
      },
      recalcFreeTime() {
        let selectedDayObj = this.getScheduleArray[this.selectedDate];
        let keys = Object.keys(selectedDayObj);
        // console.log(keys)
        let index = keys.indexOf(this.selectedTime);
        // let freeTime=0;
        let i =index;
        let freeTime=0;
        while (i<keys.length && selectedDayObj[keys[i]].filter(rec=>rec.master.id===this.master.id).length>0){
          // console.log(selectedDayObj[keys[i]])
          i++;
          freeTime++;
        }
        this.freeTime=freeTime;
      }
    },
    watch: {
      selectedTime: {
        handler: function () {
          this.recalcFreeTime();
        }
      },
      selectedDate: {
        handler: function () {
          this.recalcFreeTime();
        }
      },
      master: {
        handler: function () {
          this.recalcFreeTime();
        }
      }
    }
  }
</script>

<style scoped>

</style>