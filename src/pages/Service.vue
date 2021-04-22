<template>
    <v-main>
        <v-container>
            <v-row>
                <v-col>
                    <ServicesTable></ServicesTable>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  import ServicesTable from "../components/ServicesTable";
  export default {
    name: "Service",
    components: {ServicesTable}
  }
</script>

<style scoped>

</style>