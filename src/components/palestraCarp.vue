<template>
  <section class="gallery-section">
    <header class="gallery-header">
      <h1 class="titulo-data">Quinta-Feira | 22/05</h1>
    </header>

    <div class="banner-container">
      <swiper
        :modules="modules"
        effect="fade"
        :loop="true"
        :navigation="true"
        :autoplay="{ delay: 7500, disableOnInteraction: false }"
        :slides-per-view="1"
        class="banner-swiper"
      >
        <swiper-slide v-for="n in 9" :key="n" class="banner-slide">
          <img 
            :src="`/IMG/Palestras/palestraCarp/carp${n}.jpg`" 
            :alt="`Foto ${n} da palestra em Pedro II`" 
            loading="lazy"
          />
        </swiper-slide>
      </swiper> 
    </div>

    <footer class="gallery-footer">
      <p class="frase-descritiva">
        Em cada imagem, um sopro da alma literária que encheu Pedro II de encantos e histórias.
      </p>
    </footer>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, EffectFade, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const modules = [Navigation, EffectFade, Autoplay]
</script>

<style scoped>
/* 1. Estrutura Principal */
.gallery-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px; /* Limita o crescimento em telas gigantes */
  margin: 0 auto;
  padding: 2rem 1.5rem; /* Espaçamento de respiro nas laterais para celular */
  box-sizing: border-box;
}

/* 2. Tipografia Responsiva */
.gallery-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.titulo-data {
  /* clamp() ajusta o tamanho da fonte dinamicamente: min, ideal, max */
  font-size: clamp(1.5rem, 4vw, 2.2rem); 
  color: #333;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
}

/* 3. Contêiner do Banner (A Mágica da Responsividade) */
.banner-container {
  width: 100%;
  border-radius: 16px; /* Bordas arredondadas modernas */
  overflow: hidden; /* Impede que a imagem vaze pelas bordas arredondadas */
  box-shadow: 0 12px 32px rgba(39, 52, 175, 0.15); /* Sombra mais elegante e difusa */
  background-color: #f8f9fa; /* Fundo neutro caso a imagem demore a carregar */
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

/* 4. O Slide e a Imagem */
.banner-slide {
  /* Mantém a proporção de cinema (widescreen) em TODAS as telas */
  aspect-ratio: 16 / 9; 
  width: 100%;
  position: relative;
  background-color: #000;
  overflow: hidden;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cobre o espaço sem achatar ou esticar a foto */
  transition: transform 0.5s ease;
}

/* Efeito de zoom suave apenas em telas maiores que não usam touch */
@media (hover: hover) {
  .banner-slide:hover img {
    transform: scale(1.03);
  }
}

/* 5. Descrição Final */
.gallery-footer {
  margin-top: 2rem;
  text-align: center;
  max-width: 800px; /* Evita que o texto fique longo e ruim de ler no desktop */
}

.frase-descritiva {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-style: italic;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* 6. Customização dos Botões do Swiper */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: #fff;
  width: 44px;
  height: 44px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(8px); /* Efeito de vidro moderno */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

:deep(.swiper-button-prev:hover),
:deep(.swiper-button-next:hover) {
  background-color: rgba(39, 52, 175, 0.85); /* Azul mais sólido no hover */
  transform: scale(1.1); /* Dá um feedback visual de clique */
}

/* Reduz o tamanho da seta dentro do botão */
:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 1.2rem !important;
  font-weight: bold;
}

/* Ajuste dos botões para telas muito pequenas (celulares menores) */
@media (max-width: 480px) {
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    width: 36px;
    height: 36px;
  }
  :deep(.swiper-button-prev::after),
  :deep(.swiper-button-next::after) {
    font-size: 1rem !important;
  }
}
</style>