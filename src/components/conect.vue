<template>
  <div class="ticker-wrapper">
    <swiper
      :modules="modules"
      :loop="true"
      :autoplay="{ delay: 0, disableOnInteraction: false }"
      :speed="3000" 
      :allow-touch-move="false"
      slides-per-view="auto"
      :space-between="30"
      class="ticker-swiper"
    >
      <swiper-slide v-for="i in 8" :key="i" class="ticker-slide">
        <a 
          href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet" 
          target="_blank" 
          rel="noopener noreferrer"
          class="ticker-link"
        >
          <img src="/IMG/iconInsta2.png" class="icon" alt="Siga o Salão do Livro de Pedro II no Instagram" />
          <span class="ticker-text">CONECTE-SE AO SALIP2</span>
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const modules = [Autoplay]
</script>

<style scoped>
/* 1. O Contêiner Principal */
.ticker-wrapper {
  width: 100%;
  /* Um gradiente sutil deixa o azul mais rico e moderno do que uma cor chapada */
  background: linear-gradient(90deg, #1f2a8f 0%, #2734AF 50%, #1f2a8f 100%);
  overflow: hidden;
  padding: 1.2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ticker-swiper {
  width: 100%;
}

/* 2. O Segredo do Movimento Contínuo (MÁGICA AQUI) */
/* Isso tira a "freada" do Swiper e faz ele rodar liso em velocidade constante */
:deep(.swiper-wrapper) {
  transition-timing-function: linear !important;
}

/* 3. O Slide */
.ticker-slide {
  /* Largura automática com base no conteúdo, adeus breakpoints engessados! */
  width: max-content; 
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 4. O Link (Área clicável) */
.ticker-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Efeito bacana quando o usuário passa o mouse por cima do letreiro */
.ticker-link:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

/* 5. A Tipografia e o Ícone */
.ticker-text {
  /* clamp() novamente salvando o dia na responsividade */
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap; /* Impede o texto de quebrar linha */
  letter-spacing: 1px;
}

.icon {
  /* Tamanho do ícone cresce e diminui proporcionalmente junto com a tela */
  width: clamp(24px, 4vw, 36px);
  height: clamp(24px, 4vw, 36px);
  object-fit: contain;
}
</style>