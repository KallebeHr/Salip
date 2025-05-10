<template>
  <div class="container">
    <swiper
      :modules="modules"
      effect="fade"
      :navigation="true"
      :loop="true"
      :autoplay="{
        delay: 4500,
        disableOnInteraction: false,
      }"
      :slides-per-view="1"
      class="mySwiper"
    >
      <swiper-slide v-for="n in 6" :key="n">
        <img :src="`/IMG/Slide${n % 2 === 0 ? 2 : 1}.png`" :alt="`Foto ${n}`" />
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
.container {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
}

/* Swiper principal */
.swiper {
  width: 100%;
  height: auto;
}

/* Slide */
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

/* Imagem do slide */
.swiper-slide img {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: cover;
  border-radius: 4px;
}

/* Responsividade adicional */
@media (max-width: 768px) {
  .swiper-slide img {
    max-height: 50vh;
  }
}
</style>
