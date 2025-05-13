<template>
  <div class="banner-container">
    <swiper
      :modules="modules"
      effect="fade"
      :loop="true"
      :navigation="true"
      :autoplay="{ delay: 4500, disableOnInteraction: false }"
      :slides-per-view="1"
      class="banner-swiper"
    >
      <swiper-slide v-for="n in 4" :key="n" class="banner-slide">
        <img :src="`/IMG/Slide${n}.png`" :alt="`Foto ${n}`" />
      </swiper-slide>
    </swiper>
  </div>
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
/* Container principal */
.banner-container {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(39, 52, 175, 0.15);
  background-color: #000;
}

/* Swiper principal */
.banner-swiper {
  width: 100%;
  height: 100%;
}

/* Slide interno */
.banner-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

/* Imagem */
.banner-slide img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.banner-slide img:hover {
  transform: scale(1.02);
}

/* Estilizando botões de navegação */
.swiper-button-prev,
.swiper-button-next {
  color: white;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  backdrop-filter: blur(4px);
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
  background-color: rgba(39, 52, 175, 0.7);
}

/* Ícone menor */
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 1.2rem;
}

/* Responsivo */
@media (max-width: 768px) {
  .banner-slide img {
    max-height: 55vh;
  }

  .swiper-button-prev,
  .swiper-button-next {
    width: 30px;
    height: 30px;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 1rem;
  }
}
</style>
