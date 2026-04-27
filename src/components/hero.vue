<template>
  <section class="hero-section">
    <div class="hero-top-wrapper">
      <div class="hero-container">
        
        <div class="hero-content-left">
          <div class="brand-box">
            <span class="festival-tag">4º Salão do Livro de Pedro II</span>
            <h1 class="main-title">SALIP2</h1>
          </div>
          
          <div class="event-date-box">
            <div class="calendar-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="date-info">
              <span class="label">DATA DO EVENTO</span>
              <span class="value">7 a 9 de Maio</span>
            </div>
          </div>
        </div>

        <div class="hero-content-right">
          <div class="quote-wrapper">
            <p class="cursive-text">
              “Uma casa sem livros é um corpo sem alma.”
            </p>
            <cite class="author-tag">— Marco Túlio Cícero</cite>
          </div>
        </div>

      </div>
    </div>

    <div class="hero-footer-scroller">
      <ScrollP />
    </div>
  </section>
</template>

<script setup>
/**
 * IMPORTANTE: 
 * Certifique-se de que o componente <ScrollP /> 
 * está importado e registrado globalmente ou localmente.
 * import ScrollP from './ScrollP.vue'
 */
</script>

<style scoped>
/* Importando Fontes Clássicas: Montserrat para o Institucional e Great Vibes para a Frase */
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;800&display=swap');
/* Import de ícones caso queira usar FontAwesome, ou pode usar SVGs */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.hero-section {
  width: 100%;
  min-height: auto; /* Ocupa quase toda a tela */
  background-color: #2734AF; /* Cor exata solicitada */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Empurra o Scroller para o rodapé */
  font-family: 'Montserrat', sans-serif;
  color: #FFFFFF;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

/* Envoltório superior para centralizar o conteúdo principal */
.hero-top-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4rem 2rem;
}

.hero-container {
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1.8fr 2.2fr; /* Coluna da esquerda um pouco maior */
  gap: 5rem;
  align-items: center;
}

/* --- LADO ESQUERDO: Estilo Institucional --- */
.hero-content-left {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.festival-tag {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 3px;
  color: #A5B4FC; /* Azul claro para contraste sutil */
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.main-title {
  font-size: 5.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 0.9;
  letter-spacing: -2px;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 500px;
  color: #E0E7FF;
  font-weight: 400;
}

.event-date-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.calendar-icon {
  font-size: 1.8rem;
  color: #FBBF24; /* Amarelo ouro para destaque institucional */
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-info .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #A5B4FC;
}

.date-info .value {
  font-size: 1.4rem;
  font-weight: 700;
}

/* --- LADO DIREITO: Frase Cursiva --- */
.hero-content-right {
  display: flex;
  justify-content: flex-end;
  text-align: center;
}

.quote-wrapper {
  max-width: 500px;
}

.cursive-text {
  font-family: 'Great Vibes', cursive;
  font-size: 5.5rem; /* Frase bem grande e elegante */
  line-height: 1;
  margin-bottom: 1rem;
  color: #FFFFFF;
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
}

.author-tag {
  font-size: 1.1rem;
  font-style: normal;
  font-weight: 600;
  color: #A5B4FC;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* --- RODAPÉ: Scroller --- */
.hero-footer-scroller {
  width: 100%;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 4rem;
  }
  
  .hero-content-left, .hero-description, .event-date-box {
    align-items: center;
    margin: 0 auto;
    text-align: center;
  }

  .hero-content-right {
    justify-content: center;
  }

  .main-title {
    font-size: 4rem;
  }

  .cursive-text {
    font-size: 3.5rem;
  }
}

@media (max-width: 640px) {
  .main-title {
    font-size: 3rem;
  }
  .cursive-text {
    font-size: 2.8rem;
  }
  .hero-top-wrapper {
    padding: 2rem 1rem;
  }
}
</style>