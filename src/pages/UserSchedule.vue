<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <v-select deletable-chips
                            :items="this.getMasters"
                            @change="setFilterByMaster"
                            item-value="id"
                            v-model="selectedMaster"
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
            </v-row>
            <v-row>
                <v-col>
                    <DatePicker @change="log" v-model="firstDate"></DatePicker>
                </v-col>
                <v-col>
                    <DatePicker :min="firstDate" v-model="lastDate"></DatePicker>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <DataGrid
                    ></DataGrid>
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script>
  import DataGrid from "../components/DataGrid";
  import {mapGetters} from "vuex";
  import {FETCH_MASTERS} from "../vuex/actions/master";
  import {FETCH_SERVICES} from "../vuex/actions/service";
  import DatePicker from "../components/DatePicker";
  import {CHANGE_FIRST_DAY, CHANGE_LAST_DAY} from "../vuex/actions/schedule";

  export default {
    name: "Schedule",
    components: {DatePicker, DataGrid},
    async mounted() {
      await this.$store.dispatch(FETCH_MASTERS);
      await this.$store.dispatch(FETCH_SERVICES);
    },
    data() {
      return {
        selectedMaster: null,
      }
    },
    computed: {
      ...mapGetters(["getMasters", "isLoading"]),
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
      }
    },
    methods: {
      setFilterByMaster(master) {
        this.$store.commit("setFilterByMaster", master)
      },
      log(a) {
        console.log(a)
      }
    },
  }
</script>

<style scoped>

</style>