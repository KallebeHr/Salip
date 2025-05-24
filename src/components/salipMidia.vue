<template>
  <div id="app">
    <h1 class="title">PALESTRANTES/ARTISTAS</h1>
    <swiper
      :slides-per-view="'auto'"
      :centered-slides="true"
      :space-between="20"
      :pagination="{ clickable: true }"
      :modules="modules"
      :loop="true"   
      :navigation="true"
      :autoplay="{ delay: 2000, disableOnInteraction: true }"
      class="mySwiper" 
    >
      <swiper-slide v-for="(item, index) in fotos" :key="index">
        <div class="slide-content">
          <img class="main-img" :src="item.url" :alt="item.titulo" />
          <div class="text-content">
            <h2>{{ item.titulo }}</h2>
          </div>
          <div class="about-content">
            <div class="info-row">
              <img :src="icons.persona" alt="professor" class="iconSVG" />
              <span>{{ item.professor }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.evento" alt="evento" class="iconSVG" />
              <span>{{ item.evento }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.calendario" alt="data" class="iconSVG" />
              <span>{{ item.data }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.hora" alt="hora" class="iconSVG" />
              <span>{{ item.hora }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.chat" alt="descrição" class="iconSVG" />
              <span>{{ item.descricao }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.tipo" alt="mediação" class="iconSVG" />
              <span>{{ item.mediacao }}</span>
            </div>
            <div class="info-row">
              <img :src="icons.local" alt="local" class="iconSVG" />
              <span>{{ item.local }}</span>
            </div>
          </div>
        </div>
      </swiper-slide> 
    </swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'

const modules = [Pagination, Autoplay]

const icons = ref({
  persona: '/IMG/persona.svg',
  evento: '/IMG/lista.svg',
  calendario: '/IMG/calendario.svg',
  hora: '/IMG/time.svg',
  chat: '/IMG/chat.svg',
  tipo: '/IMG/tipo.svg',
  local: '/IMG/local.svg'
})

const fotos = ref([
  {
    url: '/IMG/cardPalestrante.png',
    titulo: 'Cineas Santos (PI)',
    professor: 'Prof. Cineas Santos',
    evento: 'A lírica do poeta Manuel Bandeira ',
    data: '24/05/2025 ',
    hora: '8h30min',
    descricao: 'Palestra pública',
    mediacao: 'Mediação: SALIP2',
    local: 'Auditório Padre Norberto'
  },
  {
    url: '/IMG/cardPalestrante2.png',
    titulo: 'Luiz Romero Lima (PI)',
    professor: 'Prof. Luiz Romero Lima',
    evento: 'O cânone literário o sublime piauiense ',
    data: '23/05/2025',
    hora: '14h30min',
    descricao: 'Palestra pública',
    mediacao: 'Mediação: SALIP2',
    local: 'Auditório Padre Norberto'
  },
  {
    url: '/IMG/cardPalestrante3.png',
    titulo: 'José de Nicola (SP)',
    professor: 'Prof. José de Nicola',
    evento: 'A lírica do poeta Manuel Bandeira',
    data: '24/05/2025',
    hora: '8h30min',
    descricao: 'Palestra pública',
    mediacao: 'Mediação: SALIP2',
    local: 'Auditório Padre Norberto'
  },
  {
    url: '/IMG/cardPalestrante4.png',
    titulo: 'Fabrício Carpi Nejar',
    professor: 'Fabricio Carpinejar',
    evento: 'Palestra de abertura com Fabrício Carpinejar (RS)',
    data: '22/05/2025',
    hora: '19h',
    descricao: 'Palestra pública',
    mediacao: 'Mediação: SALIP2',
    local: 'Centro Educacional de Eventos Dep. Ciro Nogueira'
  }
  ,
  {
    url: '/IMG/cardPalestrante5.png',
    titulo: 'Ernâni Getirana de Lima',
    professor: 'Prof. Ernâni Getirana de Lima',
    evento: 'A literatura de Pedro II: da pré-história aos dias atuais',
    data: '23/05/2025 ',
    hora: '16h30min',
    descricao: 'Palestra pública',
    mediacao: 'Mediação: SALIP2',
    local: 'Auditório Padre Norberto'
  }
    ,
  {
    url: '/IMG/CardPalestrante6.png',
    titulo: 'Gonzaga Lu e Trio Asa Branca',
    professor: 'Gonzaga Lu e Trio Asa Branca',
    evento: 'Show de encerramento ',
    data: '24/05/2025 ',
    hora: '21h',
    descricao: 'Show público',
    mediacao: 'Cantor: Gonzaga Lu',
    local: 'Praça Domingos Mourão Filho'
  }
    ,
  {
    url: '/IMG/CardPalestrante7.png',
    titulo: 'Grupo Harém de Teatro (PI)',
    professor: 'Texto: Samuel Becket e Dramaturgia: Arimatan Martins',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '19h',
    descricao: 'Show Público',
    mediacao: 'Mediação: Helany Max ',
    local: 'Praça Domingos Mourão Filho'
  },
      {
    url: '/IMG/CardPalestrante8.png',
    titulo: 'Grupo Urutau',
    professor: 'Sítio do Pica-Pau Amarelo',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '10h',
    descricao: 'Show Público',
    mediacao: 'Grupo: Urutau',
    local: 'Praça Domingos Mourão Filho'
  }
  ,
      {
    url: '/IMG/cardPalestrante9.png',
    titulo: 'Histórias / Teatro de Bonecos',
    professor: 'Chagas Vale',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '9h',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ravena Ribeiro',
    local: 'Praça Domingos Mourão Filho'
  }
  ,
      {
    url: '/IMG/cardPalestrante10.png',
    titulo: 'Histórias / Teatro de Bonecos',
    professor: 'Talitha do Monte',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '9h',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ravena Ribeiro',
    local: 'Praça Domingos Mourão Filho'
  },
      {
    url: '/IMG/cardPalestrante11.png',
    titulo: 'A voz de Esperança Garcia',
    professor: 'Bernardo Aurélio (PI) ',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '8h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Waleria Rubens (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/cardPalestrante12.png',
    titulo: 'A voz de Esperança Garcia',
    professor: 'João P. Luiz (PI) ',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '8h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Waleria Rubens (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/cardPalestrante13.png',
    titulo: 'Grupo Cocares (PI)',
    professor: 'Wilker Marques, Marcos Silva, Daniel Glaydson, Rodrigo Lages, Wanderson Araújo e Francisco Oliveira.',
    evento: 'Teatro',
    data: '23/05/2025 ',
    hora: '8h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Germano Bonfim (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPslestrante14.png',
    titulo: 'Poesia, Música e Sala de Aula',
    professor: 'Adriano Lobão Aragão (PI) ',
    evento: 'Teatro',
    data: '24/05/2025 ',
    hora: '14h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Helany Max',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/cardPalestrante17.png',
    titulo: 'Piauienses Escritoras - Gênese Histórica',
    professor: 'Jasmine Malta (PI)',
    evento: 'Teatro',
    data: '24/05/2025 ',
    hora: '10h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Kássio Gomes (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/cardPalestrante15.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Marina Campelo (PI)',
    evento: 'Teatro',
    data: '24/05/2025 ',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante18.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Adeodata dos Anjos (PI)',
    evento: 'Teatro',
    data: '24/05/2025 ',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante19.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Aldenira Martins (PI)',
    evento: 'Teatro',
    data: '24/05/2025',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante20.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Dayse Benício (PI)',
    evento: 'Teatro',
    data: '24/05/2025',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante21.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Lucinete Maria do Nascimento (PI)',
    evento: 'Teatro',
    data: '24/05/2025',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante22.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Socorro Almeida (PI) ',
    evento: 'Teatro',
    data: '24/05/2025',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
  ,
    {
    url: '/IMG/CardPalestrante23.png',
    titulo: 'Roda de Conversa: Presença da Mulher na Literatura de Pedro II',
    professor: 'Margarete Gomes (PI)',
    evento: 'Teatro',
    data: '24/05/2025',
    hora: '16h30min',
    descricao: 'Show Público',
    mediacao: 'Mediação: Ernani Getirana (PI)',
    local: 'Auditório Padre Norberto'
  }
])
</script>

<style scoped>
#app {
  padding: 2rem 1rem;
  background: #f9f9f9;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: #2734AF;
  margin-bottom: 2rem;
  text-align: center;
}

.mySwiper {
  width: 100%;
  max-width: 1100px;
}

/* slide responsivo sem cortas */
.swiper-slide {
  flex: 0 0 auto;
  width: 280px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.slide-content {
  display: flex;
  flex-direction: column;
}

.main-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 5px solid #d8df52;
}

.text-content {
  padding: 1rem;
  text-align: center;
}

.text-content h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2734AF;
  margin: 0;
}

.about-content {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.iconSVG {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.info-row span {
  font-size: 0.75rem;
  color: #333;
  line-height: 1.2;
}
@media (max-width: 1150px) {
  .mySwiper {
    width: 100%;
    max-width: 900px;
  }
}
@media (max-width: 950px) {
.mySwiper {
  width: 100%;
  max-width: 700px;
}
}
@media (max-width: 768px) {
  .main-img {
    height: 400px;
  }
  .mySwiper {
  width: 100%;
  max-width: 400px;
}
}

@media (max-width: 480px) {
  .main-img {
    height: 400px;
  }
  .mySwiper {
  width: 100%;
  max-width: 300px;
}
  .about-content {
    padding: 0.5rem 0.75rem;
  }
  .iconSVG {
    width: 10px;
    height: 10px;
  }
  .info-row span {
    font-size: 0.7rem;
  }
}
</style>
