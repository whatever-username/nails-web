<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col cols="1">
                    <v-row>
                        <v-col></v-col>
                    </v-row>
                    <v-row
                            :key="index"
                            v-for="(time,index) in getTimeLine"
                    >
                        <v-col class="px-0 py-0">
                            <v-chip class=" chip v-picker--full-width justify-center"
                                    label outlined
                            >
                                {{time}}
                            </v-chip>
                        </v-col>

                    </v-row>
                </v-col>
                <v-col cols="11">
                    <v-card outlined>
                        <v-slide-group

                                class="pm-0"
                                multiple
                        >
                            <template slot="next">
                                <v-icon>mdi-arrow-right</v-icon>
                            </template>
                            <template slot="prev">
                                <v-icon>mdi-arrow-left</v-icon>
                            </template>
                            <v-slide-item
                                    :key="dateKey"
                                    v-for="(day,dateKey) in getDateLine"
                            >
                                <v-container class="pt-0">
                                    <v-row no-gutters>
                                        <v-col>
                                            {{day }}
                                        </v-col>
                                    </v-row>
                                    <v-row
                                            :key="timeKey"
                                            no-gutters
                                            v-for="(time,timeKey) in getTimeLine"
                                    >
                                        <v-col class="px-0 py-0">
                                            <v-chip
                                                    :class="'py-0 chip v-picker--full-width justify-center '+getColor(getScheduleArrayFiltered[day][time])"
                                                    @click="select(time,day)"
                                                    label
                                                    outlined

                                                    v-html="parseInfoArrayToDisplay(getScheduleArrayFiltered[day][time])"
                                            >
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-slide-item>
                        </v-slide-group>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
        <MasterCellDetails
                :isOpened="isCellDetailsOpened"
                :selectedDate="selectedDate"
                :selectedTime="selectedTime"
                @toggle="toggleCellDetails"
                v-model="this.selected"
        >
        </MasterCellDetails>
    </v-main>
</template>
<script>
  import {mapGetters} from "vuex";
  import {FETCH_SCHEDULE} from "../../vuex/actions/schedule";
  import MasterCellDetails from "./MasterCellDetails";

  export default {
    name: "MasterDataGrid",
    components: {MasterCellDetails},
    async mounted() {
      await this.$store.dispatch(FETCH_SCHEDULE);
    },
    computed: {
      ...mapGetters(["getSchedule", "getScheduleArray", "getScheduleArrayFiltered",
        "getDateLine", "getTimeLine", "getFilterByMaster", "getFilterByService"]),
      selected() {
        if ((this.selectedDate != null && this.selectedTime != null)) {
          if (this.getScheduleArrayFiltered[this.selectedDate]) {
            if (this.getScheduleArrayFiltered[this.selectedDate][this.selectedTime]) {
              return this.getScheduleArrayFiltered[this.selectedDate][this.selectedTime]
            }
          }
        }
        return ""
      },


    },
    props: ["value"],
    data() {
      return {
        isNotificationVisible: false,
        notifText: "",

        isCellDetailsOpened: false,

        selectedDate: null,
        selectedTime: null,
      }
    },
    methods: {
      getColor(arrData) {
        if (!arrData.length) {
          return "";
        }
        let info = arrData[0];
        if (info.customer) {
          return "green";
        }else{
          return "blue";
        }
      },
      toggleCellDetails() {
        this.isCellDetailsOpened = !this.isCellDetailsOpened;
      },
      select(time, date) {
        this.selectedTime = time;
        this.selectedDate = date;
        this.toggleCellDetails();
      },
      parseInfoArrayToDisplay(arrData) {
        if (arrData.length === 0) {
          return "";
        }
        let info = arrData[0];
        if (info.customer) {
          let customer = info.customer;
          let customerText = (customer.firstname && customer.lastname) ? customer.lastname.concat(" ").concat(customer.firstname) : customer.username;
          customerText = customerText.concat("<br>").concat(info.service.name)
          return customerText;
        } else {
          return "Свободен"
        }
      },
    },


  }

</script>

<style scoped>
    .chip {
        height: 7vh;
        width: 100%;
    }

    .red {
        color: red;
    }

    .green {
        color: green;
    }

    .blue {
        color: blue;
    }
</style>