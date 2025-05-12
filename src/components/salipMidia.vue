<template>
  <div id="app">
    <h1 class="title">MÍDIA SALIPI</h1>
    <swiper
      :slidesPerView="'auto'"
      :centeredSlides="true"
      :spaceBetween="20"
      :pagination="{ clickable: true }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="(item, index) in fotos" :key="index">
        <div class="slide-content">
          <img :src="item.url" :alt="item.titulo" />
          <div class="text-content">
            <h2>{{ item.titulo }}</h2>
            <p class="caption">{{ item.legenda }}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    const fotos = [
      {
        url: '/IMG/foto1.jpg',
        titulo: 'Abertura Oficial',
        legenda: 'Autoridades e convidados abriram oficialmente o evento com celebrações culturais.'
      },
      {
        url: '/IMG/foto2.jpg',
        titulo: 'Oficina Criativa',
        legenda: 'Jovens participaram de oficinas interativas de escrita e leitura.'
      },
      {
        url: '/IMG/foto3.jpg',
        titulo: 'Feira de Livros',
        legenda: 'Editoras e livrarias regionais ofereceram descontos e novidades literárias.'
      },
      {
        url: '/IMG/foto4.jpg',
        titulo: 'Contos para Crianças',
        legenda: 'Atividades de contadores de histórias encantaram o público infantil.'
      },
      {
        url: '/IMG/foto5.jpg',
        titulo: 'Sarau Poético',
        legenda: 'Encerramento do dia com apresentações de poesia, música e teatro local.'
      }
    ]

    return {
      fotos,
      modules: [Pagination]
    }
  }
}
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
  overflow-x: hidden;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  color: #2734AF;
  margin-bottom: 2rem;
  text-align: center;
}

.swiper {
  width: 100%;
  max-width: 1100px;
  padding-bottom: 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

.swiper-slide {
  width: 300px !important;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.slide-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.slide-content img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
  display: block;
}

.text-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

.text-content h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2734AF;
  margin-bottom: 0.5rem;
  text-align: center;
}

.caption {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.5;
  text-align: justify;
}

@media (max-width: 768px) {
  .swiper-slide {
    width: 90% !important;
  }

  .slide-content img {
    height: 180px;
  }

  .title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .swiper-slide {
    width: 95% !important;
  }

  .slide-content img {
    height: 160px;
  }

  .text-content h2 {
    font-size: 1rem;
  }

  .caption {
    font-size: 0.9rem;
  }
}
</style>
