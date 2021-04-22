<template>
    <v-main>
        <v-container>
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
                    <MasterDataGrid>

                    </MasterDataGrid>
                </v-col>
            </v-row>
        </v-container>

    </v-main>
</template>

<script>
  import MasterDataGrid from "../components/master/MasterDataGrid";
  import dateUtils from "../utils/dateUtils";
  import {CHANGE_FIRST_DAY, CHANGE_LAST_DAY} from "../vuex/actions/schedule";
  import DatePicker from "../components/DatePicker";
  export default {
    name: "MasterSchedule",
    components: {DatePicker, MasterDataGrid},
    async mounted() {
    },
    computed:{
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
    }
  }
</script>

<style scoped>

</style>