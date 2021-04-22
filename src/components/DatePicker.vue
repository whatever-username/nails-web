<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-right="40"
    min-width="290px"
    offset-y
    transition="scale-transition"
    v-model="menu"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
              :placeholder="placeholder"
        dense
        outlined
        readonly

              v-model="value"
        v-bind:label=label
        :disabled="readonly"
        v-on="on"
        :rules="[notNullRule]"
      >
      </v-text-field>
    </template>
    <v-date-picker
      :max="max"
      :min="min"
      @input="menu = false"
      locale="ru"
      v-bind:value="value"
      v-on:input="$emit('input', $event)"
    >

    </v-date-picker>
    <v-divider></v-divider>
    <v-btn
      @click="$emit('input',null)" class="mx-1" color="primary"

      small
    >
      Очистить
    </v-btn>
  </v-menu>
</template>

<script>


  export default {
    name: "DatePicker",

    data: () => {
      return {
        menu: false
      }
    },
    methods: {
      notNullRule(){
        console.log(this.value)
        if (this.notNull){
          return true
        }
        if (this.value === null || this.value === undefined || this.value === ""){
          return false;
        }
        return true;
      }

    },
    props: ["label", "value", "max", "min","readonly","placeholder"]
  }
</script>

<style scoped>
</style>