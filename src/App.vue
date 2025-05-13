<template>
  <v-app>
    <HeaderNav />
    <div>
          <div v-if="!isLoaded">
      <preloader />
    </div>
    <div v-else>
      <router-view />
    </div>
      <Footer />
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import HeaderNav  from "./components/HeaderNav.vue";
import Footer     from "./components/Footer.vue";

const isLoaded = ref(false);

onMounted(() => {
  const markLoaded = () => {
    // depois de garantir que tudo carregou, espera 3s e mostra app
    setTimeout(() => (isLoaded.value = true), 3000);
  };

  if (document.readyState === 'complete') {
    // já tá pronto
    markLoaded();
  } else {
    // escuta mudança de estado de carregamento
    const listener = () => {
      if (document.readyState === 'complete') {
        markLoaded();
        document.removeEventListener('readystatechange', listener);
      }
    };
    document.addEventListener('readystatechange', listener);
  }
});
</script>
