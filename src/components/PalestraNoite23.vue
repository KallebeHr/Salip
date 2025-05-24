<template>
  <div class="container">
    <swiper
      :slides-per-view="3"
      :space-between="20"
      :pagination="{ clickable: true }"
      :breakpoints="breakpoints"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="n in 28" :key="n" class="banner-slide">
        <img :src="`/IMG/Palestras/23/carpNoite${n}.jpg`" :alt="`Foto ${n}`" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination]

const breakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 10
  },
  480: {
    slidesPerView: 1,  // um slide inteiro + metade do próximo
    spaceBetween: 15
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 20
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 20
  }
}

</script>

<style scoped>
.container {
    
  padding: 1rem;
  max-width: 100vw;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden; /* evita scroll horizontal indesejado */
}

.mySwiper {
  width: 80%;
  max-width: 100vw;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.banner-slide {
  flex: 0 0 auto;
  width: 280px;
  max-width: 90vw; /* limita slide a 90% da tela no mobile */
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.banner-slide img {
  width: 520px;
  height: 620px;
  max-height: 90vh; /* para não estourar a altura da tela */
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

/* Media Queries para reduzir largura e altura conforme tela menor */

@media (max-width: 1024px) {
  .banner-slide {
    width: 240px;
  }
  .banner-slide img {
    height: 380px;
  }
}

@media (max-width: 768px) {
  .banner-slide {
    width: 500px;
    max-width: 90vw;
  }
  .banner-slide img {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .banner-slide {
    width: 160px;
    max-width: 90vw;
  }
  .banner-slide img {
    height: 480px;
  }
}

</style>
