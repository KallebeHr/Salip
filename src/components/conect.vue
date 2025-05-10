<template>
  <div class="ticker-container">
    <swiper
      :modules="modules"
      :loop="true"
      :autoplay="{ delay: 0, disableOnInteraction: false }"
      :speed="2000"
      :allowTouchMove="false"
      :slides-per-view="3"
      :breakpoints="{
        0: { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
        1440: { slidesPerView: 3 },
      }"
      class="ticker-swiper"
    >
      <swiper-slide v-for="i in 10" :key="i" class="ticker-slide">
        <img src="/IMG/iconInsta2.png" class="icon" alt="InstagramIcon" />
        <h1>CONECTE-SE AO SALIPI</h1>
        <img src="/IMG/iconInsta2.png" class="icon" alt="InstagramIcon" />
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
.ticker-container {
  width: 100%;
  background: #2734AF;
  overflow: hidden;
  padding: 1rem 0;
}

.ticker-swiper {
  width: 100%;
}

.ticker-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 1rem;
  white-space: nowrap;
}

/* Texto */
h1 {
  font-size: 1.8rem;
  color: white;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  white-space: nowrap;
}

/* Ícones */
.icon {
  width: 30px;
  height: 30px;
}

/* Responsivo */
@media (max-width: 768px) {
  .ticker-slide {
    gap: 0.8rem;
    padding: 0 0.5rem;
  }

  h1 {
    font-size: 1.2rem;
  }

  .icon {
    width: 22px;
    height: 22px;
  }
}
</style>
