<template>
    <div class="container">
      <h1>Programação dos Eventos!</h1>
      <v-expansion-panels class="painel">
        <v-expansion-panel
          title="🗓️ 10 de Agosto - 14h - Oficina de Escrita Criativa"
          text="Participe de uma oficina envolvente com autores locais sobre técnicas de escrita literária."
        />
        <v-expansion-panel
          title="🗓️ 11 de Agosto - 10h - Roda de Conversa com Ilustradores"
          text="Profissionais da ilustração compartilham suas experiências com livros infantis e capas de romance."
        />
        <v-expansion-panel
          title="🗓️ 12 de Agosto - 15h30 - Mesa Redonda: A Literatura e o Nordeste"
          text="Debate sobre as raízes culturais e a literatura regional com convidados especiais."
        />
        <v-expansion-panel
          title="🗓️ 13 de Agosto - 09h - Contação de Histórias para Crianças"
          text="Atividade lúdica com contadores de histórias para o público infantil."
        />
        <v-expansion-panel
          title="🗓️ 13 de Agosto - 17h - Lançamento de Livros Independentes"
          text="Autores independentes apresentam e autografam suas novas publicações no auditório central."
        />
        <v-expansion-panel
          title="🗓️ 14 de Agosto - 11h - Palestra: A Leitura na Era Digital"
          text="Reflexão sobre os hábitos de leitura contemporâneos com professores e influenciadores literários."
        />
        <v-expansion-panel
          title="🗓️ 14 de Agosto - 19h - Sarau Poético com Música ao Vivo"
          text="Leitura de poemas, performances artísticas e música regional sob a luz do entardecer."
        />
        <v-expansion-panel
          title="🗓️ 15 de Agosto - 16h - Encontro com Autores Infantojuvenis"
          text="Momento de conversa e autógrafos com autores que escrevem para crianças e adolescentes."
        />
      </v-expansion-panels>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    padding: 20px;
    font-family: "Roboto", sans-serif;
    text-align: center;
    background: white;

  }
  
  h1 {
    margin-top: 3rem;
    margin-bottom: 20px;
    font-size: 2rem;
    color: black;
  }
  
  .painel {
    width: 100%;
    max-width: 900px;
  }
  </style>
  