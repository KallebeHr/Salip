<template>
  <section class="archive">
    <div class="archive__container">
      
      <header class="archive__header">
        <div class="archive__intro">
          <span class="archive__badge">Mural de Memórias</span>
          <h1 class="archive__title">Edição <span class="text-gradient">{{ edicaoSelecionada.ano }}</span></h1>
          <p class="archive__subtitle">Explore o histórico de palestras, fotos e momentos que marcaram nossa trajetória.</p>
        </div>

        <nav class="year-selector">
          <div class="year-selector__track">
            <button 
              v-for="edicao in edicoes" 
              :key="edicao.ano"
              @click="mudarEdicao(edicao)"
              :class="['year-btn', { 'is-active': edicaoSelecionada.ano === edicao.ano }]"
            >
              {{ edicao.ano }}
            </button>
          </div>
        </nav>
      </header>

      <transition name="page-flip" mode="out-in">
        <main :key="edicaoSelecionada.ano" class="archive__content">
          
          <div class="bento-grid">
            
            <div class="bento-item bento-item--hero">
              <figure class="hero-figure">
                <img :src="edicaoSelecionada.imagem" :alt="edicaoSelecionada.ano" class="hero-img" />
                <div class="hero-overlay">
                  <div class="hero-info">
                    <span class="hero-label">Palestra Principal</span>
                    <h2 class="hero-title">Fabrício Carpi Nejar {{ edicaoSelecionada.ano }}</h2>
                  </div>
                </div>
              </figure>
            </div>

            <router-link 
              v-for="(dia, index) in edicaoSelecionada.dias" 
              :key="index"
              :to="dia.rota" 
              class="bento-item bento-item--day"
              :style="{ '--delay': index * 0.1 + 's' }"
            >
              <div class="day-card">
                <div class="day-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div class="day-card__info">
                  <span class="day-card__label">{{ dia.nomeDia }}</span>
                  <h3 class="day-card__name">{{ dia.dataExata }}</h3>
                </div>
                <div class="day-card__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </div>
            </router-link>

          </div>
        </main>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const edicoes = ref([

  {
    ano: 2025,
    imagem: '/IMG/Palestras/palestraCarp/carp9.jpg',
    dias: [
      { nomeDia: 'Quinta-Feira', dataExata: '22 de Maio', rota: '/galeriaSalip222' },
      { nomeDia: 'Sexta-Feira', dataExata: '23 de Maio', rota: '/galeriaSalip223' },
      { nomeDia: 'Sábado', dataExata: '24 de Maio', rota: '/galeriaSalip224' }
    ]
  }
]);

const edicaoSelecionada = ref(edicoes.value[0]);

const mudarEdicao = (novaEdicao) => {
  if (edicaoSelecionada.value.ano !== novaEdicao.ano) {
    edicaoSelecionada.value = novaEdicao;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

.archive {
  --primary: #4f46e5;
  --primary-dark: #3730a3;
  --bg: #f8fafc;
  --surface: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --radius: 24px;
  
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg);
  min-height: 100vh;
  padding: 4rem 2rem;
  color: var(--text-main);
}

.archive__container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Estilo Apple */
.archive__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
}

.archive__badge {
  background: white;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.archive__title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -2px;
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary), #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.archive__subtitle {
  color: var(--text-muted);
  max-width: 500px;
  margin-top: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Seletor de Anos Flutuante */
.year-selector {
  margin-top: 2.5rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 0.4rem;
  border-radius: 100px;
  border: 1px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.year-btn {
  border: none;
  background: transparent;
  padding: 0.8rem 2rem;
  border-radius: 100px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
}

.year-btn.is-active {
  background: var(--primary);
  color: white;
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 160px;
  gap: 1.5rem;
}

.bento-item {
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  background: var(--surface);
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bento-item--hero {
  grid-column: span 4;
  grid-row: span 3;
}

.bento-item--day {
  grid-column: span 2; /* No desktop, 2 dias por linha abaixo do herói */
  grid-row: span 1;
}

@media (min-width: 1024px) {
  .bento-item--hero { grid-column: span 3; grid-row: span 3; }
  .bento-item--day { grid-column: span 1; grid-row: span 1; }
}

/* Hero Styles */
.hero-figure {
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.bento-item--hero:hover .hero-img {
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 2.5rem;
}

.hero-label {
  color: #a5b4fc;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 2px;
}

.hero-title {
  color: white;
  font-size: 2rem;
  margin: 0.5rem 0 0;
  font-weight: 800;
}

/* Day Cards */
.day-card {
  height: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
}

.day-card__icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  transition: all 0.3s ease;
}

.day-card__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.day-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.day-card__arrow {
  margin-left: auto;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: var(--primary);
}

.bento-item--day:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.bento-item--day:hover .day-card__icon {
  background: var(--primary);
  color: white;
}

.bento-item--day:hover .day-card__arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Transições de Página */
.page-flip-enter-active, .page-flip-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-flip-enter-from { opacity: 0; transform: translateY(30px) scale(0.98); }
.page-flip-leave-to { opacity: 0; transform: translateY(-30px) scale(1.02); }

/* Responsividade */
@media (max-width: 768px) {
  .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .bento-item--hero { grid-column: span 1; aspect-ratio: 4/3; }
  .bento-item--day { grid-column: span 1; }
  .archive { padding: 2rem 1rem; }
  .year-selector { display: flex; overflow-x: auto; max-width: 100%; border-radius: 20px; }
}
</style>