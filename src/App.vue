<template>
  <v-app>
    <HeaderNav />
    <router-view />
    <Footer />
  </v-app>
</template>

<script setup>
import HeaderNav  from "./components/HeaderNav.vue";
import Footer  from "./components/footer.vue";

  
</script>
