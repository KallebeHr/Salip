<template>
  <section class="event-showcase">
    
    <header class="showcase-header">
      <span class="badge">Arquivo Histórico</span>
      <h1 class="title">EDIÇÃO <span class="highlight">{{ edicaoSelecionada.ano }}</span></h1>
      
      <nav class="year-tabs" aria-label="Navegação por anos das edições">
        <button 
          v-for="edicao in edicoes" 
          :key="edicao.ano"
          @click="mudarEdicao(edicao)"
          :class="['tab-btn', { 'is-active': edicaoSelecionada.ano === edicao.ano }]"
          :aria-selected="edicaoSelecionada.ano === edicao.ano"
        >
          {{ edicao.ano }}
        </button>
      </nav>
    </header>

    <transition name="fade-slide" mode="out-in">
      <main :key="edicaoSelecionada.ano" class="showcase-body">
        
        <figure class="image-container">
          <img 
            :src="edicaoSelecionada.imagem" 
            :alt="`Banner oficial da palestra Carp, edição de ${edicaoSelecionada.ano}`" 
            class="hero-image" 
            loading="lazy" 
          />
          <div class="image-overlay"></div>
        </figure>
        
        <div class="schedule-grid">
          <router-link 
            v-for="(dia, index) in edicaoSelecionada.dias" 
            :key="index"
            :to="dia.rota" 
            class="schedule-card"
          >
            <svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div class="card-content">
              <span class="day-name">{{ dia.nomeDia }}</span>
              <span class="day-date">{{ dia.dataExata }}</span>
            </div>
            <span class="arrow-icon">→</span>
          </router-link>
        </div>

      </main>
    </transition>
  </section>
</template>

<script setup>
import { ref } from 'vue';

/* =========================================================================
   1. FONTE DA VERDADE (DATA STRUCTURE)
   Separar o visual (HTML) da lógica (JS) é a regra de ouro de um código limpo.
   Note que dividi "Quinta-Feira | 22/05" em duas propriedades diferentes
   (nomeDia e dataExata). Isso nos dá poder para estilizar cada parte 
   de forma independente no CSS!
   ========================================================================= */
const edicoes = ref([

  {
    ano: 2023,
    imagem: '/IMG/Palestras/palestraCarp/carp9.jpg',
    dias: [
      { nomeDia: 'Quinta-Feira', dataExata: '22 de Maio', rota: '/galeriaSalip222' },
      { nomeDia: 'Sexta-Feira', dataExata: '23 de Maio', rota: '/galeriaSalip223' },
      { nomeDia: 'Sábado', dataExata: '24 de Maio', rota: '/galeriaSalip224' }
    ]
  },
  {
    ano: 2024,
    imagem: '/IMG/Palestras/palestraCarp/carp9.jpg',
    dias: [
      { nomeDia: 'Quinta-Feira', dataExata: '22 de Maio', rota: '/galeriaSalip222' },
      { nomeDia: 'Sexta-Feira', dataExata: '23 de Maio', rota: '/galeriaSalip223' },
      { nomeDia: 'Sábado', dataExata: '24 de Maio', rota: '/galeriaSalip224' }
    ]
  },
  {
    ano: 2025,
    imagem: '/IMG/Palestras/palestraCarp/carp9.jpg',
    dias: [
      { nomeDia: 'Quinta-Feira', dataExata: '22 de Maio', rota: '/galeriaSalip222' },
      { nomeDia: 'Sexta-Feira', dataExata: '23 de Maio', rota: '/galeriaSalip223' },
      { nomeDia: 'Sábado', dataExata: '24 de Maio', rota: '/galeriaSalip224' }
    ]
  },
  {
    ano: 2026,
    imagem: '/IMG/Palestras/palestraCarp/carp9.jpg',
    dias: [
      { nomeDia: 'Quinta-Feira', dataExata: '22 de Maio', rota: '/galeriaSalip222' },
      { nomeDia: 'Sexta-Feira', dataExata: '23 de Maio', rota: '/galeriaSalip223' },
      { nomeDia: 'Sábado', dataExata: '24 de Maio', rota: '/galeriaSalip224' }
    ]
  }
]);

/* =========================================================================
   2. REATIVIDADE (STATE MANAGEMENT)
   O 'ref' torna a variável reativa. Se o valor mudar, o Vue automaticamente
   redesenha a tela apenas onde essa variável está sendo usada.
   ========================================================================= */
const edicaoSelecionada = ref(edicoes.value[0]); // Inicia com o primeiro item do array

/* =========================================================================
   3. MÉTODOS (ACTIONS)
   Função pura, de responsabilidade única: apenas altera o estado atual.
   ========================================================================= */
const mudarEdicao = (novaEdicao) => {
  // Evita re-renderização desnecessária se o usuário clicar no ano que já está ativo
  if (edicaoSelecionada.value.ano !== novaEdicao.ano) {
    edicaoSelecionada.value = novaEdicao;
  }
};
</script>

<style scoped>
/* =========================================================================
   DESIGN SYSTEM LOCAL (VARIÁVEIS CSS)
   Gerenciar cores e espaçamentos aqui torna o código manutenível.
   ========================================================================= */
.event-showcase {
  --color-brand: #2734af;
  --color-brand-light: #4453d8;
  --color-brand-dark: #151e73;
  --color-surface: #ffffff;
  --color-bg: #f4f6f9;
  --color-text-main: #1e293b;
  --color-text-muted: #64748b;
  
  --radius-lg: 16px;
  --radius-md: 10px;
  --radius-pill: 9999px;
  
  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 10px 25px rgba(39, 52, 175, 0.15);
  
  --transition-smooth: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  max-width: auto;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background: var(--color-bg);
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* --- Cabeçalho --- */
.showcase-header {
  text-align: center;
  margin-bottom: 3rem;
}

.badge {
  display: inline-block;
  background: rgba(39, 52, 175, 0.1);
  color: var(--color-brand);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-pill);
  margin-bottom: 1rem;
}

.title {
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--color-text-main);
  margin: 0 0 1.5rem 0;
  letter-spacing: -1px;
}

.title .highlight {
  color: var(--color-brand);
}

/* --- Tabs (Seletores de Ano) --- */
.year-tabs {
  display: inline-flex;
  background: var(--color-surface);
  padding: 0.5rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-soft);
  gap: 0.5rem;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.6rem 2rem;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.tab-btn:hover {
  color: var(--color-brand);
  background: rgba(39, 52, 175, 0.05);
}

.tab-btn.is-active {
  background: var(--color-brand);
  color: #fff;
  box-shadow: 0 4px 12px rgba(39, 52, 175, 0.3);
}

/* --- Body e Imagem --- */
.showcase-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 21 / 9; /* Proporção ultra-wide moderna em vez de height fixo */
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  margin: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.image-container:hover .hero-image {
  transform: scale(1.03); /* Efeito sutil de zoom in ao passar o mouse */
}

/* Efeito sutil de gradiente escuro na parte inferior da imagem para dar profundidade */
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
  pointer-events: none;
}

/* --- Grid de Datas (Cards Profissionais) --- */
.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.schedule-card {
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

.schedule-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-brand);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: bottom;
}

.schedule-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(39, 52, 175, 0.2);
}

.schedule-card:hover::before {
  transform: scaleY(1);
}

.calendar-icon {
  width: 24px;
  height: 24px;
  color: var(--color-brand);
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.day-name {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.day-date {
  font-size: 1.15rem;
  color: var(--color-text-main);
  font-weight: 800;
}

.arrow-icon {
  color: var(--color-brand);
  font-weight: bold;
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-smooth);
}

.schedule-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* --- Transições do Vue --- */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* --- Responsividade Extrema --- */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .image-container {
    aspect-ratio: 16 / 9; /* Ajusta a proporção para telas menores */
  }

  .schedule-grid {
    grid-template-columns: 1fr; /* 1 coluna no mobile */
  }
}

@media (max-width: 480px) {
  .year-tabs {
    flex-direction: column;
    width: 100%;
    border-radius: var(--radius-md);
  }
  
  .tab-btn {
    width: 100%;
    border-radius: var(--radius-md);
  }
  
  .image-container {
    aspect-ratio: 4 / 3; /* Imagem mais quadrada em celulares */
  }
}
</style>