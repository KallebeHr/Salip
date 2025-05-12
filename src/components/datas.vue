<template>
  <div class="container">
    <h1 class="titulo">Programação dos Eventos OFICIAL</h1>
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
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 18h30min",
    descricao: "Solenidade Oficial de Abertura do 3º SaLiP2 - Salão do Livro de Pedro II Discursos de autoridades e homenageados. | Local: Espaço Educacional de Eventos Manoel Nogueira Filho  ",
  },
   {
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 19h",
    descricao: "Palestra de abertura com Fabrício Carpinejar (RS) | Local: Espaço Educacional de Eventos Manoel Nogueira Filho  ",
  },
   {
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 21h ",
    descricao: "Show com Soraya Castelo Branco (PI) | Local: Espaço Educacional de Eventos Manoel Nogueira Filho ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 8h ",
    descricao: "Acolhida: Gilciê Memória | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 8h30min ",
    descricao: "Palestra: A voz de Esperança Garcia  Palestrante: Bernardo Aurélio (PI) e João P. Luiz (PI) Apresentação/Mediação: | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 10h30min ",
    descricao: "Palestra/Show: Música e Letra, instrumentos de educação Palestrante: Grupo Cocares Apresentação/Mediação: | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 14h ",
    descricao: "Acolhida:  Jair Paulo e Julie | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 14h30min ",
    descricao: "Palestra:  O cânone literário - o sublime piauiense  Palestrante: Luiz Romero (PI) Apresentação/Mediação  | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 16h30min ",
    descricao: "Palestra: A literatura de Pedro II: da pré-história aos dias atuais Palestrante: Ernâni Getirana (PI) Apresentação/Mediação:  | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 18h30min",
    descricao: "Acolhida:  Leo Sorato | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 19h",
    descricao: "	Espetáculo: Esperando Godot - Texto: Samuel Becket  Apresentação: Grupo Harém de Teatro (PI) Apresentação/Mediação: Helany Max | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 21h",
    descricao: "Show com (A DEFINIR) | Local: Praça Domingos Mourão",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 8h",
    descricao: "Acolhida: Marcus Aurélio | Local: Auditório Padre Norberto | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ  | 8h30min",
    descricao: "Palestra: A lírica do poeta Manuel Bandeira  Palestrantes: José de Nicola (SP) e Cineas Santos (PI) Apresentação/Mediação: | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ  | 10h30min",
    descricao: "Palestra:  Palestrante:  Apresentação/Mediação | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 14h",
    descricao: "Acolhida: Grupo da Apae  | Local: Auditório Padre Norberto ",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 14h30min",
    descricao: "Palestra: Poesia, Música e Sala de Aula Palestrantes: Adriano Lobão Aragão (PI) e Vagner Ribeiro (PI) Apresentação/Mediação: ",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 16h30min",
    descricao: "Acolhida: Grupo da Apae  | Local: Auditório Padre Norberto ",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | NOITE  | 20h ",
    descricao: "Encerramento do 3º SaLiP2 com Show de Humor da Selma de Nieta | Local: Praça Domingos Mourão ",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | NOITE  | 21h ",
    descricao: "Show de encerramento com Gonzaga Lu e Trio Asa Branca | Local: Praça Domingos Mourão ",
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
