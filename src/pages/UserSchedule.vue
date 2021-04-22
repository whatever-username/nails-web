<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <v-select :items="this.getMasters"
                              outlined
                              dense
                              @change="setFilterByMaster"
                              deletable-chips
                              item-value="id"
                              v-model="selectedMaster"
                              placeholder="Мастер"
                    >
                        <template v-slot:item="{ item }">
                            {{item.lastname+" "+item.firstname}}
                        </template>
                        <template v-slot:selection="{ item }">
                            {{item.lastname+" "+item.firstname}}
                        </template>
                        <template v-slot:append-item>
                            <v-btn @click="(selectedMaster=null)&setFilterByMaster(null)">Очистить</v-btn>
                        </template>
                    </v-select>
                </v-col>
                <v-col>
                    <v-select :items="this.getServices"
                              outlined
                              dense
                              @change="setFilterByService"
                              deletable-chips
                              item-value="id"
                              v-model="selectedService"
                              placeholder="Услуга"
                    >
                        <template v-slot:item="{ item }">
                            {{item.name}}
                        </template>
                        <template v-slot:selection="{ item }">
                            {{item.name}}
                        </template>
                        <template v-slot:append-item>
                            <v-btn @click="(selectedService=null)&setFilterByService(null)">Очистить</v-btn>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <DatePicker :min="today" v-model="firstDate" :label="`Дата: от`"></DatePicker>
                </v-col>
                <v-col>
                    <DatePicker :min="firstDate" v-model="lastDate" :label="`Дата: до`"></DatePicker>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <UserDataGrid
                        @signUp="signUp"
                    ></UserDataGrid>
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script>
  import {mapGetters} from "vuex";
  import {FETCH_MASTERS} from "../vuex/actions/master";
  import {FETCH_SERVICES} from "../vuex/actions/service";
  import DatePicker from "../components/DatePicker";
  import {CHANGE_FIRST_DAY, CHANGE_LAST_DAY, USER_ASSIGN} from "../vuex/actions/schedule";
  import UserDataGrid from "../components/user/UserDataGrid";
  import dateUtils from "../utils/dateUtils";

  export default {
    name: "UserSchedule",
    components: {UserDataGrid, DatePicker},
    async mounted() {
      await this.$store.dispatch(FETCH_MASTERS);
      await this.$store.dispatch(FETCH_SERVICES);
    },
    data() {
      return {
        selectedMaster: null,
        selectedService: null,
      }
    },
    computed: {
      ...mapGetters(["getMasters", "isLoading","getServices"]),
      firstDate: {
        get() {
          return this.$store.state.schedule.data.dateLine[0]
        },
        set(value) {
          this.$store.dispatch(CHANGE_FIRST_DAY, {value})
        }
      },
      lastDate: {
        get() {
          return this.$store.state.schedule.data.dateLine[this.$store.state.schedule.data.dateLine.length - 1]
        },
        set(value) {
          this.$store.dispatch(CHANGE_LAST_DAY, {value})
        }
      },
      today(){
        return dateUtils.dateToYYYYMMDD(new Date());
      }
    },
    methods: {
      setFilterByMaster(master) {
        this.$store.commit("setFilterByMaster", master)
      },
      setFilterByService(service) {
        this.$store.commit("setFilterByService", service)
      },
      log(a) {
        console.log(a)
      },
      async signUp(rec){

        let payload = {};
        payload.info = rec;
        payload.service = this.selectedService;
        await this.$store.dispatch(USER_ASSIGN,{payload});
      }
    },
  }
</script>

<style scoped>

</style>