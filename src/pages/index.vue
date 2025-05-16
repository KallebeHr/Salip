<template>
  <div class='container'>
    <Slide/>
    <inscricao />
    <datas />
    <datasInf />
    <DatasFotos />
    <DatasOficina />
    <Local />
    <Conect />
  </div>
</template>

<script setup>
import DatasOficina from '@/components/datasOficina.vue';

</script>

<style scoped>
.container{
  display:flex;
  justify-content: center;
  flex-direction: column;
  height: auto;
  }
</style>