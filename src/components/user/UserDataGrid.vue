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
                                                    :class="'py-0 chip v-picker--full-width justify-center ' +getColor(day,time)"
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
        <UserCellDetails
                :isOpened="isCellDetailsOpened"
                :selectedDate="selectedDate"
                :selectedTime="selectedTime"
                @declineRec="declineRec"
                @signUp="signUp"
                @toggle="toggleCellDetails"
                v-model="this.selected"
        >
        </UserCellDetails>
        <v-snackbar
                :timeout="5000"
                :top="true"
                :vertical="true"
                color="orange"
                v-model="isNotificationVisible"
        >{{notifText}}
        </v-snackbar>
    </v-main>
</template>
<script>
  import {mapGetters} from "vuex";
  import {DECLINE_REC, FETCH_SCHEDULE} from "../../vuex/actions/schedule";
  import UserCellDetails from "./UserCellDetails";

  export default {
    name: "UserDataGrid",
    components: {UserCellDetails},
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
        colorMatrix: [],
      }
    },
    methods: {
      async declineRec(assignmentUUID) {
        let payload = {
          assignmentUUID: assignmentUUID
        }
        await this.$store.dispatch(DECLINE_REC, {payload});
      },
      signUp(rec) {

        this.$emit("signUp",rec);
      },
      toggleCellDetails() {
        this.isCellDetailsOpened = !this.isCellDetailsOpened;
      },
      select(time, date) {
        console.log(this.getFilterByMaster);
        console.log(this.getFilterByService);
        if (this.getScheduleArrayFiltered[date][time].length) {
          if (this.isCellBusyCurrent(date, time)) {
            this.toggleCellDetails();
            this.selectedTime = time;
            this.selectedDate = date;
          } else {
            if (this.getFilterByMaster && this.getFilterByService) {
              this.toggleCellDetails();
              this.selectedTime = time;
              this.selectedDate = date;
            } else {
              this.toggleNotification();
            }
          }
        }
      },
      toggleNotification() {
        if (!this.getFilterByMaster && !this.getFilterByService) {
          this.notifText = "Выберите мастера и услугу"
        } else if (!this.getFilterByMaster) {
          this.notifText = "Выберите мастера"
        } else if (!this.getFilterByService) {
          this.notifText = "Выберите услугу"
        }
        this.isNotificationVisible = true;
      },
      isCellBusyCurrent(date, time) {
        let cell = this.getScheduleArrayFiltered[date][time];
        let rec = cell.filter(rec => rec.cellState === "BUSY_CURRENT")[0]
        if (rec) {
          return true
        }
        return false;
      },
      parseInfoArrayToDisplay(arrData) {
        if (arrData.length !== 0) {
          let takenInfo = {};
          let isTakenByCurUser = false;
          let masterCount = 0;
          let freeCount = 0;
          if (arrData.length === 1) {
            let rec = arrData[0];
            let res;
            console.log(rec)
            switch (rec.cellState) {
              case "BUSY":
                res = "Мастер: " + this.getMastersName(rec.master) + "<br>" + "Занят"
                break;
              case "BUSY_CURRENT":
                res = "Вы записаны к мастеру " + "<br>" + this.getMastersName(rec.master)
                break;
              case "FREE":
                res = "Мастер: " + this.getMastersName(rec.master) + "<br>" + "Свободен"
                break
            }
            return res;
          } else {
            arrData.forEach(rec => {
              if (rec.master) {
                masterCount++
              }
              if (rec.cellState === "BUSY_CURRENT") {
                isTakenByCurUser = true;
                takenInfo.master = rec.master
              } else if (rec.cellState === "FREE") {
                freeCount++;
              }
            });
          }
          if (isTakenByCurUser) {
            return "Вы записаны к " + this.getMastersName(takenInfo.master)
          }
          return "Мастеров: " + masterCount + "<br>" + "Свободно: " + freeCount;
        }
        return "";

      },
      getColor(day, time) {
        let data = this.parseInfoArrayToDisplay(this.getScheduleArrayFiltered[day][time]);
        if (data.includes("Свободно: 0") || data.includes("Занят")) {
          return "red"
        }
        if (data.includes("Вы записаны")) {
          return "green";
        }
        return "";
      },
      getMastersName(master) {
        return master.lastname + " " + master.firstname;
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