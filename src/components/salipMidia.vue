<template>
  <div id="app">
    <h1 class="title">PALESTRAS</h1>
    <swiper
      :slides-per-view="'auto'"
      :centered-slides="true"
      :space-between="20"
      :pagination="{ clickable: true }"
      :modules="modules"
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
import { Pagination } from 'swiper/modules'

const modules = [Pagination]

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
    titulo: 'HEULLER KALLEBE ALMEIDA',
    professor: 'Heuller K. Almeida',
    evento: 'Palestra de Abertura',
    data: '18/11/2023',
    hora: '14:00',
    descricao: 'Autoridades e convidados abriram oficialmente o evento.',
    mediacao: 'Mediação: Salivapi',
    local: 'Auditório CETI Santo Antônio'
  },
  {
    url: '/IMG/cardPalestrante.png',
    titulo: 'MARIA FERNANDA',
    professor: 'Maria Fernanda Silva',
    evento: 'Oficina Criativa',
    data: '19/11/2023',
    hora: '10:00',
    descricao: 'Jovens participaram de atividades interativas.',
    mediacao: 'Mediação: Grupo Jovem',
    local: 'Sala de Oficinas 1'
  },
  {
    url: '/IMG/cardPalestrante.png',
    titulo: 'MARIA FERNANDA',
    professor: 'Maria Fernanda Silva',
    evento: 'Oficina Criativa',
    data: '19/11/2023',
    hora: '10:00',
    descricao: 'Jovens participaram de atividades interativas.',
    mediacao: 'Mediação: Grupo Jovem',
    local: 'Sala de Oficinas 1'
  },
  {
    url: '/IMG/cardPalestrante.png',
    titulo: 'MARIA FERNANDA',
    professor: 'Maria Fernanda Silva',
    evento: 'Oficina Criativa',
    data: '19/11/2023',
    hora: '10:00',
    descricao: 'Jovens participaram de atividades interativas.',
    mediacao: 'Mediação: Grupo Jovem',
    local: 'Sala de Oficinas 1'
  }
  // ... adicione novos cards aqui
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

@media (max-width: 768px) {
  .main-img {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .main-img {
    height: 400px;
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
