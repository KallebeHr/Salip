<template>
  <div class="container">
    <h1 class="titulo">EXPOSIÇÃO FOTOGRÁFICA REVIVER PEDRO II (CLUBE 11 DE AGOSTO) </h1>
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
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso. | Local: Cube 11 de Agosto |	Vagas: 40 visitantes",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 10h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso. | Local: Cube 11 de Agosto |	Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE | 14h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto	| Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE | 16h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto |	Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto	| Vagas: 40 visitantes",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 10h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto	| Vagas: 40 visitantes",
  }
    ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE | 14h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto |	Vagas: 40 visitantes",
  }
    ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE | 16h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: Cube 11 de Agosto	| Vagas: 40 visitantes",
  }
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

.painel {
  width: 100%;
  max-width: 900px;
  background-color: transparent;
}

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
