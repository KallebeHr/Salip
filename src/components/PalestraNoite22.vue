<template>
  <section class="gallery-section">
    <div class="swiper-wrapper-container">
      <swiper
        :modules="modules"
        :pagination="{ clickable: true, dynamicBullets: true }"
        :grab-cursor="true"
        :breakpoints="breakpoints"
        class="mySwiper"
      >
        <swiper-slide v-for="n in 28" :key="n" class="banner-slide">
          <div class="image-wrapper">
            <img 
              :src="`/IMG/Palestras/palestraCarp/carpNoite${n}.jpg`" 
              :alt="`Foto ${n} da palestra noturna`" 
              loading="lazy"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination]

// O Swiper cuida de 100% da responsividade. Não precisamos de media queries no CSS!
const breakpoints = {
  // Mobile pequeno (Celulares em pé)
  0: {
    slidesPerView: 1.2, // 1 slide inteiro + 20% do próximo (indica que há mais fotos)
    spaceBetween: 16
  },
  // Mobile maior / Phablets
  480: {
    slidesPerView: 1.5, // 1 slide e meio
    spaceBetween: 20
  },
  // Tablets
  768: {
    slidesPerView: 2.5,
    spaceBetween: 24
  },
  // Desktop / Laptops
  1024: {
    slidesPerView: 3,
    spaceBetween: 30
  },
  // Telas muito grandes (Ultrawide / Monitores grandes)
  1280: {
    slidesPerView: 4,
    spaceBetween: 32
  }
}
</script>

<style scoped>
/* 1. Container Geral */
.gallery-section {
  width: 100%;
  padding: 2rem 0; /* Espaço vertical, laterais encostam na borda para o efeito de "carrossel infinito" */
  overflow: hidden; /* Previne scroll horizontal no body da página */
}

.swiper-wrapper-container {
  width: 100%;
  max-width: 1400px; /* Impede que o carrossel fique gigante em monitores ultrawide */
  margin: 0 auto;
  padding: 0 1rem; /* Margem de segurança no celular */
  box-sizing: border-box;
}

/* 2. O Swiper */
.mySwiper {
  width: 100%;
  /* Padding embaixo essencial para as bolinhas de paginação não ficarem por cima das fotos */
  padding-bottom: 50px; 
}

/* 3. O Slide (Deixe o Swiper calcular a largura!) */
.banner-slide {
  height: auto; 
}

/* 4. Envoltório da Imagem (A Mágica da Proporção) */
.image-wrapper {
  /* Define a proporção da foto. 4/5 é ideal para fotos mais altas (retrato). 
     Se as fotos forem quadradas, use 1/1. Se forem deitadas, use 16/9. */
  aspect-ratio: 4 / 5; 
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background-color: #f0f0f0; /* Cor de fundo enquanto a foto carrega */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 5. A Imagem */
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Preenche a caixa sem distorcer a imagem */
  display: block;
  transition: transform 0.4s ease;
}

/* Efeito de zoom suave apenas para quem usa mouse (Desktop) */
@media (hover: hover) {
  .image-wrapper:hover img {
    transform: scale(1.05);
  }
}

/* 6. Customização Moderna da Paginação (Bolinhas) */
:deep(.swiper-pagination-bullet) {
  background-color: #999;
  opacity: 0.5;
  transition: all 0.3s ease;
  width: 8px;
  height: 8px;
}

/* Bolinha ativa vira um "tracinho" moderno (estilo Apple/Instagram) */
:deep(.swiper-pagination-bullet-active) {
  background-color: #2734af; /* Sua cor azul */
  opacity: 1;
  width: 24px; 
  border-radius: 4px;
}
</style>