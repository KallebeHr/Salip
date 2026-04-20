<template>
  <section id="app-speakers">
    <div class="section-header">
      <h1 class="section-title">Palestrantes e Artistas</h1>
      <div class="title-underline"></div>
    </div>
    
    <swiper
      :modules="modules"
      :loop="true"
      :navigation="true"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :breakpoints="swiperBreakpoints"
      class="mySwiper"
    >
      <swiper-slide v-for="(item, index) in fotos" :key="index">
        <article class="card">
          
          <header class="card-header">
            <div class="img-wrapper">
              <img class="main-img" :src="item.url" :alt="`Foto de ${item.titulo}`" loading="lazy" />
              <div class="img-overlay"></div> 
            </div>
            <span class="badge">{{ item.descricao }}</span>
          </header>

          <div class="card-body">
            <h2 class="card-title">{{ item.titulo }}</h2>
            <h3 class="card-subtitle">{{ item.professor }}</h3>

            <ul class="info-list">
              <li class="info-item" v-if="item.evento">
                <img :src="icons.evento" alt="Evento" class="iconSVG" />
                <span>{{ item.evento }}</span>
              </li>
              <li class="info-item" v-if="item.data || item.hora">
                <img :src="icons.calendario" alt="Data" class="iconSVG" />
                <span>{{ item.data }} <strong v-if="item.hora">às {{ item.hora }}</strong></span>
              </li>
              <li class="info-item" v-if="item.mediacao">
                <img :src="icons.tipo" alt="Mediação" class="iconSVG" />
                <span>{{ item.mediacao }}</span>
              </li>
            </ul>
          </div>

          <footer class="card-footer">
            <img :src="icons.local" alt="Local" class="iconSVG" />
            <span>{{ item.local }}</span>
          </footer>

        </article>
      </swiper-slide> 
    </swiper>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'

const modules = [Pagination, Autoplay, Navigation]

const swiperBreakpoints = {
  320: { slidesPerView: 1, spaceBetween: 20 },
  576: { slidesPerView: 2, spaceBetween: 24 },
  992: { slidesPerView: 3, spaceBetween: 30 },
  1200: { slidesPerView: 4, spaceBetween: 32 }
}

const icons = ref({
  persona: '/IMG/persona.svg',
  evento: '/IMG/lista.svg',
  calendario: '/IMG/calendario.svg',
  hora: '/IMG/time.svg',
  chat: '/IMG/chat.svg',
  tipo: '/IMG/tipo.svg',
  local: '/IMG/local.svg'
})

// MANTIVE SEUS DADOS EXATAMENTE IGUAIS
const fotos = ref([
  { url: '/IMG/cardPalestrante.png', titulo: 'Cineas Santos (PI)', professor: 'Prof. Cineas Santos', evento: 'A lírica do poeta Manuel Bandeira ', data: '24/05/2025', hora: '8h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante2.png', titulo: 'Luiz Romero Lima (PI)', professor: 'Prof. Luiz Romero Lima', evento: 'O cânone literário o sublime piauiense ', data: '23/05/2025', hora: '14h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante3.png', titulo: 'José de Nicola (SP)', professor: 'Prof. José de Nicola', evento: 'A lírica do poeta Manuel Bandeira', data: '24/05/2025', hora: '8h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante4.png', titulo: 'Fabrício Carpi Nejar', professor: 'Fabricio Carpinejar', evento: 'Palestra de abertura com Fabrício Carpinejar (RS)', data: '22/05/2025', hora: '19h', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2', local: 'Centro Educacional de Eventos Dep. Ciro Nogueira' },
  { url: '/IMG/cardPalestrante5.png', titulo: 'Ernâni Getirana de Lima', professor: 'Prof. Ernâni Getirana de Lima', evento: 'A literatura de Pedro II: da pré-história aos dias atuais', data: '23/05/2025', hora: '16h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2', local: 'Auditório Padre Norberto' },
  { url: '/IMG/CardPalestrante6.png', titulo: 'Gonzaga Lu e Trio Asa Branca', professor: 'Gonzaga Lu e Trio Asa Branca', evento: 'Show de encerramento ', data: '24/05/2025', hora: '21h', descricao: 'Show público', mediacao: 'Cantor: Gonzaga Lu', local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/CardPalestrante7.png', titulo: 'Grupo Harém de Teatro (PI)', professor: 'Texto: Samuel Becket / Drama: Arimatan Martins', evento: 'Teatro', data: '23/05/2025', hora: '19h', descricao: 'Show Público', mediacao: 'Mediação: Helany Max ', local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/CardPalestrante8.png', titulo: 'Grupo Urutau', professor: 'Sítio do Pica-Pau Amarelo', evento: 'Teatro', data: '23/05/2025', hora: '10h', descricao: 'Show Público', mediacao: 'Grupo: Urutau', local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante9.png', titulo: 'Histórias / Teatro de Bonecos', professor: 'Chagas Vale', evento: 'Teatro', data: '23/05/2025', hora: '9h', descricao: 'Show Público', mediacao: 'Mediação: Ravena Ribeiro', local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante10.png', titulo: 'Histórias / Teatro de Bonecos', professor: 'Talitha do Monte', evento: 'Teatro', data: '23/05/2025', hora: '9h', descricao: 'Show Público', mediacao: 'Mediação: Ravena Ribeiro', local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante11.png', titulo: 'A voz de Esperança Garcia', professor: 'Bernardo Aurélio (PI) ', evento: 'Teatro', data: '23/05/2025', hora: '8h30min', descricao: 'Show Público', mediacao: 'Mediação: Waleria Rubens (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante12.png', titulo: 'A voz de Esperança Garcia', professor: 'João P. Luiz (PI) ', evento: 'Teatro', data: '23/05/2025', hora: '8h30min', descricao: 'Show Público', mediacao: 'Mediação: Waleria Rubens (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante13.png', titulo: 'Grupo Cocares (PI)', professor: 'Vários Artistas', evento: 'Teatro', data: '23/05/2025', hora: '8h30min', descricao: 'Show Público', mediacao: 'Mediação: Germano Bonfim (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/CardPslestrante14.png', titulo: 'Poesia, Música e Sala de Aula', professor: 'Adriano Lobão Aragão (PI) ', evento: 'Teatro', data: '24/05/2025', hora: '14h30min', descricao: 'Show Público', mediacao: 'Mediação: Helany Max', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante17.png', titulo: 'Piauienses Escritoras', professor: 'Jasmine Malta (PI)', evento: 'Teatro - Gênese Histórica', data: '24/05/2025', hora: '10h30min', descricao: 'Show Público', mediacao: 'Mediação: Kássio Gomes (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante15.png', titulo: 'Roda de Conversa: Mulher na Literatura', professor: 'Marina Campelo (PI)', evento: 'Teatro', data: '24/05/2025', hora: '16h30min', descricao: 'Show Público', mediacao: 'Mediação: Ernani Getirana (PI)', local: 'Auditório Padre Norberto' }
])
</script>

<style scoped>
/* =========================================
   VARIÁVEIS DE COR E TEMA - MODERNIZADAS
========================================= */
#app-speakers {
  --primary-color: #2734AF;
  --primary-hover: #1e288a;
  --accent-color: #d8df52;
  --text-dark: #0f172a;    /* Slate 900 - Mais elegante que preto */
  --text-light: #64748b;   /* Slate 500 - Leitura suave */
  --bg-card: #ffffff;
  --bg-app: #f8fafc;       /* Fundo super suave */
  
  padding: 4rem 1rem;
  background: var(--bg-app);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* =========================================
   CABEÇALHO DA SEÇÃO
========================================= */
.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: var(--accent-color);
  margin: 0 auto;
  border-radius: 4px;
}

/* =========================================
   CONFIGURAÇÃO DO SWIPER
========================================= */
.mySwiper {
  width: 100%;
  max-width: 1350px;
  padding: 1rem 0 4rem 0; /* Padding extra para as sombras e paginação não cortarem */
}

:deep(.swiper-slide) {
  height: auto !important; 
  display: flex;
}

/* =========================================
   ESTILOS DO CARD
========================================= */
.card {
  flex: 1;
  background: var(--bg-card);
  border-radius: 20px; /* Bordas mais modernas */
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); /* Sombra mais suave */
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  border: 1px solid rgba(0,0,0,0.03);
  position: relative;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(39, 52, 175, 0.08); /* Sombra colorida no hover */
}

/* CABEÇALHO DO CARD */
.card-header {
  position: relative;
  width: 100%;
}

.img-wrapper {
  width: 100%;
  aspect-ratio: 4 / 4; /* CSS Moderno: substitui o padding-top 75% */
  overflow: hidden;
  position: relative;
  background-color: #e2e8f0;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover .main-img {
  transform: scale(1.08); /* Efeito de Zoom Premium */
}

.img-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%);
  pointer-events: none;
}

/* GLASSMORPHISM NO BADGE */
.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(39, 52, 175, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: white;
  padding: 0.4rem 0.85rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  z-index: 10;
}

/* CORPO DO CARD */
.card-body {
  padding: 1.75rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.card-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 1.25rem 0;
}

/* LISTA DE INFORMAÇÕES */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item span {
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.5;
  font-weight: 500;
}

.info-item strong {
  color: var(--text-dark);
  font-weight: 700;
}

/* ÍCONES PADRONIZADOS */
.iconSVG {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  opacity: 0.7; /* Suaviza a cor do SVG original */
}

/* RODAPÉ DO CARD */
.card-footer {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.card-footer .iconSVG {
  opacity: 1; /* Ícone de local em destaque */
}

.card-footer span {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* =========================================
   SWIPER CUSTOMIZAÇÃO - BOTÕES E PAGINAÇÃO
========================================= */
:deep(.swiper-pagination-bullet) {
  background: #cbd5e1;
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary-color) !important;
  transform: scale(1.3); /* Destaque para a bolinha ativa */
}

/* Botões do Swiper mais modernos (Estilo "App" Flutuante) */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  background: white;
  width: 44px !important;
  height: 44px !important;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  color: var(--primary-color) !important;
  transition: all 0.2s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--primary-color);
  color: white !important;
  transform: scale(1.1);
}

/* Ajusta o ícone nativo do swiper para caber no botão redondo */
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 18px !important;
  font-weight: 800;
}
</style>