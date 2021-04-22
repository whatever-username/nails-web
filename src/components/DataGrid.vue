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
                                            <v-chip @click="select(time,day)"
                                                    class="py-0 chip v-picker--full-width justify-center"
                                                    color="primary" label
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
        <CellDetails
                :isOpened="isCellDetailsOpened"
                :selectedDate="selectedDate"
                :selectedTime="selectedTime"
                @addMaster="addMaster"
                @toggle="toggleCellDetails"
                v-model="this.selected"

        ></CellDetails>
    </v-main>
</template>
<script>
  import CellDetails from "./CellDetails";
  import {mapGetters} from "vuex";
  import {ADD_MASTER_TO_CELL, FETCH_SCHEDULE} from "../vuex/actions/schedule";
  import schedule from "../vuex/modules/schedule";

  export default {
    name: "DataGrid",
    components: {CellDetails},
    async mounted() {
      await this.$store.dispatch(FETCH_SCHEDULE);
    },
    computed: {
      ...mapGetters(["getSchedule", "getScheduleArray", "getScheduleArrayFiltered", "getDateLine", "getTimeLine"]),
      selected() {
        if ((this.selectedDate != null && this.selectedTime != null)) {
          if (this.getScheduleArray[this.selectedDate]) {
            if (this.getScheduleArray[this.selectedDate][this.selectedTime]) {
              return this.getScheduleArray[this.selectedDate][this.selectedTime]
            }
          }
        }
        return ""
      },

    },
    props: ["value"],
    data() {
      return {

        isCellDetailsOpened: false,

        selectedDate: null,
        selectedTime: null,
      }
    },
    methods: {
      addMaster(master) {
        // this.$store.dispatch(ADD_MASTER_TO_CELL, {date:this.selectedDate, time:this.selectedTime,master: master})
        let rec = schedule.getEmptyCell();
        rec.master = master;
        rec.time = this.selectedTime + ":00";
        rec.date = this.selectedDate;
        this.$store.dispatch(ADD_MASTER_TO_CELL, {rec});
      },
      toggleCellDetails() {
        this.isCellDetailsOpened = !this.isCellDetailsOpened;
      },
      select(time, date) {
        this.toggleCellDetails();
        this.selectedTime = time;
        this.selectedDate = date;
      },

      parseInfoArrayToDisplay(arrData) {
        let masterCount = 0;
        let freeMasterCount = 0;
        arrData.forEach(rec => {
          masterCount++;
          if (!rec.customer) {
            freeMasterCount++
          }
        })
        if (masterCount === 0) {
          return ""
        }
        if (masterCount === 1) {
          let rec = arrData[0];
          return rec.master.lastname + " " + rec.master.firstname + "<br>" + (rec.customer ? (rec.customer.lastname + ' ' + rec.customer.firstname) : 'Свободен');
        }
        return "Мастеров: " + masterCount + "<br>" + "Свободных: " + freeMasterCount;
      },

    },


  }
</script>

<style scoped>
    .chip {
        height: 7vh;
        width: 100%;
    }
</style>