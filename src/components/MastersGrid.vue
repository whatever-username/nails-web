<template>
    <v-main>

        <v-container v-if="isLoading">
            <v-row class="align-center justify-center">
                <v-progress-circular
                        :width="3"
                        color="green"
                        indeterminate
                ></v-progress-circular>
            </v-row>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-col cols="6">Фамилия</v-col>
                <v-col cols="6">Имя</v-col>
            </v-row>
            <v-row
                    :key="master.id"
                    @click="click(master)"
                    v-for="master in this.filteredMasters"
            >
                <v-col>{{master.lastname}}</v-col>
                <v-col>{{master.firstname}}</v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  import {mapGetters} from "vuex";
  import {FETCH_MASTERS} from "../vuex/actions/master";

  export default {
    name: "MastersGrid",
    async mounted() {
      await this.$store.dispatch(FETCH_MASTERS);
    },
    props: ["toExclude"],
    computed: {
      ...mapGetters(["getMasters", "isLoading"]),
      filteredMasters() {
        let presentMastersIds = this.toExclude.map(rec => rec.id);
        return this.getMasters.filter(rec => !presentMastersIds.includes(rec.id));
      }
    },
    methods: {
      click(master) {
        this.$emit("click", master)
      }
    }
  }
</script>

<style scoped>

</style>