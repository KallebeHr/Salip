<template>
  <div class='container'>
    <Slide/>
    <inscricao />
    <DataGerais />
    <Local />
    <Conect />
  </div>
</template>

<script setup>
import DatasOficina from '@/components/datasOficina.vue';
import DataGerais from '@/components/dataGerais.vue';

</script>

<style scoped>
.container{
  display:flex;
  justify-content: center;
  flex-direction: column;
  height: auto;
  }
</style>