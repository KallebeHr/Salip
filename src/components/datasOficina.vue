<template>
  <div class="container">
    <h1 class="titulo">OFICINAS </h1>
    <v-expansion-panels class="painel" variant="inset" elevation="1">
      <v-expansion-panel
        v-for="evento in eventosOf"
        :key="evento.titulo"
        :title="evento.titulo"
        :text="evento.descricao"
        class="evento-panel"
      />
    </v-expansion-panels>
  </div>
</template>

<script setup>
const eventosOf = [
  {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina de Literatura de Cordel Ministrante: Joaquim Mendes (Joames) | (PI) Vagas: 40 (quarenta) | Turma 01 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina de Fanzine. Ministrante: Jerciane Lima (PI) | Vagas: 40 (quarenta) | Turma 01 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina Poética “Escrever com Outros Passos” - Ministrante: Marina Campelo (PI)-  Vagas: 15 (quinze) – Turma 01-  Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina de Desenho - Ministrante: Arimatéa Júnior (PI) - Vagas: 15 (quinze) – Turma 01-Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h ",
    descricao: "Oficina de Literatura de Cordel Ministrante: Joaquim Mendes (Joames) | PIVagas: 40 (quarenta) | Turma 02 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h ",
    descricao: "Oficina de Literatura de Cordel Ministrante: Joaquim Mendes (Joames) | PIVagas: 40 (quarenta) | Turma 02 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h ",
    descricao: "Oficina Poética “Escrever com Outros Passos” - Ministrante: Marina Campelo (PI) - Vagas: 15 (quinze) – Turma 01 - Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h ",
    descricao: "Oficina de Literatura de Cordel Ministrante: Joaquim Mendes (Joames) | PIVagas: 40 (quarenta) | Turma 02 | Local: Escola José Teixeira Santos",
  },
]
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
    background-color: #f8f9fb;

  font-family: 'Inter', sans-serif;
  color: #2b2b2e;
}

.titulo {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 1.8px;
  color: #2b2b2e;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  text-align: center;
}

/* Painel principal */
.painel {
  width: 100%;
  max-width: 900px;
  background-color: transparent;
}

/* Estilo de cada painel */
.evento-panel {
  background: #fefefe !important;
  color: #2b2b2e;
    font-weight: 500;
  letter-spacing: 1px;

  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.evento-panel:hover {
  box-shadow: 0px 8px 22px rgba(0, 0, 0, 0.08);
  transform: scale(1.01);
}

/* Responsivo */
@media (max-width: 768px) {
  .container {
    padding: 3rem 1rem;
  }

  .titulo {
    font-size: 1.6rem;
    letter-spacing: 1.2px;
  }

  .painel {
    max-width: 100%;
  }
}
</style>
