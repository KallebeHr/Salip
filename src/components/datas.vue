<template>
  <div class="container">
    <h1>Programação dos Eventos!</h1>
    <v-expansion-panels class="painel" variant="inset" elevation="1">
      <v-expansion-panel
        v-for="evento in eventos"
        :key="evento.titulo"
        :title="evento.titulo"
        :text="evento.descricao"
      />
    </v-expansion-panels>
  </div>
</template>

<script setup>
const eventos = [
  {
    titulo: "🗓️ 10 de Agosto - 14h - Oficina de Escrita Criativa",
    descricao: "Participe de uma oficina envolvente com autores locais sobre técnicas de escrita literária.",
  },
  {
    titulo: "🗓️ 11 de Agosto - 10h - Roda de Conversa com Ilustradores",
    descricao: "Profissionais da ilustração compartilham suas experiências com livros infantis e capas de romance.",
  },
  {
    titulo: "🗓️ 12 de Agosto - 15h30 - Mesa Redonda: A Literatura e o Nordeste",
    descricao: "Debate sobre as raízes culturais e a literatura regional com convidados especiais.",
  },
  {
    titulo: "🗓️ 13 de Agosto - 09h - Contação de Histórias para Crianças",
    descricao: "Atividade lúdica com contadores de histórias para o público infantil.",
  },
  {
    titulo: "🗓️ 13 de Agosto - 17h - Lançamento de Livros Independentes",
    descricao: "Autores independentes apresentam e autografam suas novas publicações no auditório central.",
  },
  {
    titulo: "🗓️ 14 de Agosto - 11h - Palestra: A Leitura na Era Digital",
    descricao: "Reflexão sobre os hábitos de leitura contemporâneos com professores e influenciadores literários.",
  },
  {
    titulo: "🗓️ 14 de Agosto - 19h - Sarau Poético com Música ao Vivo",
    descricao: "Leitura de poemas, performances artísticas e música regional sob a luz do entardecer.",
  },
  {
    titulo: "🗓️ 15 de Agosto - 16h - Encontro com Autores Infantojuvenis",
    descricao: "Momento de conversa e autógrafos com autores que escrevem para crianças e adolescentes.",
  },
]
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  font-family: "Roboto", sans-serif;
  background: #fdfffb;
  text-align: center;
  color: #1c1c1c;
}

h1 {
  font-size: 2.4rem;
  font-weight: 700;
  color: #2734af;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Painel do Vuetify */
.painel {
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 8px 18px rgba(39, 52, 175, 0.1);
  overflow: hidden;
}

/* Responsivo */
@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .painel {
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
