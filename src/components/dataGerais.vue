<template>
  <div class="container">
     <!-- From Uiverse.io by devestter --> 
     <!-- From Uiverse.io by devestter --> 
<button class="button" @click="baixarArquivo">
   <svg class="saveicon" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke-linejoin="round" stroke-linecap="round"></path>
</svg>
   Clique aqui e baixe a Programação 
  

</button>
    <v-text-field
      v-model="busca"
      placeholder="Digite o nome, data ou local"
      variant="outlined"
      clearable
      density="comfortable"
      hide-details
      prepend-inner-icon="mdi-magnify"
      class="mb-4 text-lg custom-input"
    />
    <div v-for="(categoria, nome) in categorias" :key="nome">
      <h2 class="titulo">{{ nome }}</h2>
      <v-expansion-panels class="painel" variant="inset" elevation="1">
        <v-expansion-panel
          v-for="evento in filtrarEventos(categoria)"
          :key="evento.titulo"
          :title="evento.titulo"
          :text="evento.descricao"
          class="evento-panel"
        />
        <v-expansion-panel class="evento-panel" v-if="filtrarEventos(categoria).length === 0"  title="Nenhum resultado encontrado." text="Tente outra palavra-chave." />
      
      </v-expansion-panels>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
const baixarArquivo = () => {
  const fileUrl = '/ARQ/FolderPrograma.pdf' 
  const fileName = 'Folder.pdf'

  const link = document.createElement('a')
  link.href = fileUrl
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const busca = ref('')
const palestrasAndShows = [
  {
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 18h30min",
    descricao: "Solenidade Oficial de Abertura do 3º SaLiP2 - Salão do Livro de Pedro II Discursos de autoridades e homenageados. | Local: Centro Educacional de Eventos Dep. Ciro Nogueira(Antigo Claudia Eventos)",
  },
   {
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 19h",
    descricao: "Palestra de abertura com Fabrício Carpinejar (RS) | Local: Centro Educacional de Eventos Dep. Ciro Nogueira(Antigo Claudia Eventos) ",
  },
   {
    titulo: "🗓️ DIA 22/05/2025 | QUINTA-FEIRA | NOITE | 21h ",
    descricao: "Show com Soraya Castelo Branco (PI) | Local: Centro Educacional de Eventos Dep. Ciro Nogueira(Antigo Claudia Eventos)",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 8h ",
    descricao: "Acolhida: Gilciê Memória | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 8h30min ",
    descricao: "Palestra: A voz de Esperança Garcia  Palestrante: Bernardo Aurélio (PI) e João P. Luiz (PI) Apresentação/Mediação: Wáleria Rubens | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 10h30min ",
    descricao: "Palestra/Show: Música e Letra, instrumentos de educação - Palestrante: Grupo Cocares Apresentação/Mediação: Socorrinha Almeida | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 14h ",
    descricao: "Acolhida:  Jair Paulo e Julie | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 14h30min ",
    descricao: "Palestra:  O cânone literário - o sublime piauiense  Palestrante: Luiz Romero (PI) Apresentação/Mediação: Wilson Brandão  | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE  | 16h30min ",
    descricao: "Palestra: A literatura de Pedro II: da pré-história aos dias atuais - Palestrante: Ernâni Getirana (PI) Apresentação/Mediação: Claisse Sales | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 18h30min",
    descricao: "Acolhida: Marcos Aurélio | Local: Auditório Padre Norberto",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 19h",
    descricao: "Espetáculo: Esperando Godot - Texto: Samuel Becket - Apresentação: Grupo Harém de Teatro (PI) Apresentação/Mediação: Helany Max | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | NOITE  | 21h",
    descricao: "Show com Sonayra | Local: Praça Domingos Mourão Filho",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 8h",
    descricao: "Acolhida: Marcus Aurélio | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ  | 8h30min",
    descricao: "Palestra: A lírica do poeta Manuel Bandeira  Palestrantes: José de Nicola (SP) e Cineas Santos (PI) Apresentação/Mediação: Wilson Brandão | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ  | 10h30min",
    descricao: "Palestra: Piauienses Escritoras - Gênese Histórica - Palestrante: Jasmine Malta (PI)  - Apresentação/Mediação: Kássio Gomes (PI) | Local: Auditório Padre Norberto ",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 14h",
    descricao: "Acolhida: Grupo da Apae  | Local: Auditório Padre Norberto ",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 14h30min",
    descricao: "Palestra: Poesia, Música e Sala de Aula Palestrantes: Adriano Lobão Aragão (PI) e Vagner Ribeiro (PI) Apresentação/Mediação: | Local: Auditório Padre Norberto",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE  | 16h30min",
    descricao: "Roda de Conversa: Presença da Mulher na Literatura de Pedro II Convidadas: Marina Campelo (PI), Adeodata dos Anjos (PI), Aldenira Martins (PI), Dayse Benício (PI) e Margarete Gomes (PI), Socorro Almeida (PI). Apresentação/Mediação: Ernani Getirana (PI) | Local: Auditório Padre Norberto",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | NOITE  | 20h ",
    descricao: "Encerramento do 3º SaLiP2 com Show de Humor da Selma de Nieta | Local: Praça Auditório Padre Norberto",
  },
  {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | NOITE  | 21h ",
    descricao: "Show de encerramento com Gonzaga Lu e Trio Asa Branca | Local: Praça Domingos Mourão Filho",
  }
]

const fotografia = [
  {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso. | Local: clube 11 de Agosto |	Vagas: 40 visitantes",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 10h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso. | Local: clube 11 de Agosto |	Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE | 14h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto	| Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | TARDE | 16h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto |	Vagas: 40 visitantes",
  }
  ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto	| Vagas: 40 visitantes",
  },
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 10h",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto	| Vagas: 40 visitantes",
  }
    ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE | 14h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto |	Vagas: 40 visitantes",
  }
    ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | TARDE | 16h30min",
    descricao: "Exposição Fotográfica Reviver Pedro II. Apresentação e Curadoria: Historiador Afonso Celso | Local: clube 11 de Agosto	| Vagas: 40 visitantes",
  }
]
const eventosInfantis = [
  {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Contação de Histórias / Teatro de Bonecos. Apresentação: Chagas Vale e Talitha do Monte | Local: Praça Domingos Mourão Filho",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 10h",
    descricao: "Lenda da Sereia do Pirapora. Apresentação: Grupo Urutau | Local: Praça Domingos Mourão Filho",
  }
  ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SÁBADO | MANHÃ | 9h",
    descricao: "Contação de Histórias / Teatro de Bonecos. Apresentação: Chagas Vale e Talitha do Monte | Praça Domingos Mourão Filho",
  }
  ,
   {
    titulo: "🗓️ DIA 24/05/2025 | SEXTA-FEIRA | MANHÃ | 10h",
    descricao: "Sítio do Pica-Pau Amarelo. Apresentação: Grupo Urutau | Local: 	Praça Domingos Mourão Filho",
  }
]
const oficinas  = [
  {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina de Literatura de Cordel Ministrante: Joaquim Mendes (Joames) | (PI) Vagas: 20 (vinte) | Turma 01 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina de Fanzine. Ministrante: Jerciane Lima (PI) | Vagas: 20 (Vinte) | Turma 01 | Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina Poética “Escrever com Outros Passos” - Ministrante: Marina Campelo (PI)-  Vagas: 20 (vinte) – Turma 01-  Local: Escola José Teixeira Santos",
  },
   {
    titulo: "🗓️ DIA 23/05/2025 | SEXTA-FEIRA | MANHÃ | 9h",
    descricao: "Oficina “Comida é Memória”- Ministrante: Nutricionista Renata Luiza - Vagas: 20 (vinte) – Turma 01-  Local: Escola José Teixeira Santos",
  },
]
// Agrupar eventos por categoria
const categorias = {
  'Programação Palestras e Shows': palestrasAndShows,
  'Programação Fotografia': fotografia,
  'Programação Eventos Infantis': eventosInfantis,
  'Programação Oficinas': oficinas
}

// Função para buscar eventos de acordo com a palavra-chave
const filtrarEventos = (eventos) => {
  if (!busca.value) return eventos
  const termo = busca.value.toLowerCase()
  return eventos.filter(e =>
    e.titulo.toLowerCase().includes(termo) ||
    e.descricao.toLowerCase().includes(termo)
  )
}
</script>

<style scoped>
.container{
    display:flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    height: auto;
  flex-direction: column;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
  color: #2b2b2e;
    background-color: #f8f9fb;
}
/* From Uiverse.io by devestter */ 
.button {
  padding: 12px 19px;
  border: none;
  color: #fefefe;
  cursor: pointer;
  background-color: #2734AF;
  border-radius: 7px;
  font-weight: bold;
  transition: 0.5s;
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 13px;
  box-shadow: rgba(150, 143, 143, 0.2) 0px 2px 8px 0px;
  margin: 20px;
}

.button:hover {
  background-color: rgb(164, 206, 253);
  color: #2734AF;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}

.saveicon {
  width: 17px;
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
.custom-input {
  height: 40px; /* aumenta a altura */
  font-size: 18px; /* aumenta o texto */
  width: 20rem;
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