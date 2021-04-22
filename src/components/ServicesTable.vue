<template>
    <v-data-table
            :headers="headers"
            :items="getServices"
            :items-per-page="5"
            class="elevation-1"
    >

    </v-data-table>
</template>

<script>

  import {FETCH_SERVICES} from "../vuex/actions/service";
  import {mapGetters} from "vuex";

  export default {
    name: "ServicesTable",
    async mounted() {
      await this.$store.dispatch(FETCH_SERVICES)
    },
    data() {
      return {
        headers: [
          {
            text: 'Наименование',
            align: 'start',
            sortable: false,
            value: "name"
          },
          {
            text: 'Цена',
            align: 'start',
            sortable: false,
            value: "price"
          },
          {
            text: 'Вкл.',
            align: 'start',
            sortable: false,
            value: "isActive"
          },

        ]
      }
    },
    computed:{
      ...mapGetters(["getServices"])
    }
  }
</script>

<style scoped>

</style>