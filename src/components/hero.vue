<template>
  <section class="hero-section">
    <div class="hero-bg-details" aria-hidden="true">
      <span class="soft-circle circle-one"></span>
      <span class="soft-circle circle-two"></span>
      <span class="book-line line-one"></span>
      <span class="book-line line-two"></span>
    </div>

    <div class="hero-top-wrapper">
      <div class="hero-container">
        <!-- LADO ESQUERDO -->
        <div class="hero-content-left">
          <div class="eyebrow">
            <span class="eyebrow-line"></span>
            <span>4º Salão do Livro de Pedro II</span>
          </div>

          <div class="brand-box">
            <h1 class="main-title">SALI<span>P2</span></h1>
          </div>

          <div class="hero-actions">
            <div class="event-date-box">
              <div class="calendar-card">
                <span class="calendar-day">07</span>
                <span class="calendar-month">MAI</span>
              </div>

              <div class="date-info">
                <span class="label">DATA DO EVENTO</span>
                <span class="value">7 a 9 de Maio</span>
              </div>
            </div>

            <div class="mini-info">
              <span class="mini-dot"></span>
              <span>Pedro II • Piauí</span>
            </div>
          </div>
        </div>

        <!-- LADO DIREITO -->
        <div class="hero-content-right">
          <div class="quote-card">
            
            <p class="cursive-text">
              "Um encontro de livros, vozes e tradições"
            </p>
            

            <div class="book-mark" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
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
/*
  Caso o componente ScrollP não esteja registrado globalmente,
  importe ele aqui:

  import ScrollP from './ScrollP.vue'
*/
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;800&display=swap');
.hero-section {
  position: relative;
  width: 100%;
  min-height: 680px;
  background:
    radial-gradient(circle at 12% 20%, rgba(216, 223, 82, 0.15), transparent 28%),
    radial-gradient(circle at 85% 12%, rgba(255, 255, 255, 0.12), transparent 24%),
    linear-gradient(135deg, #1d2787 0%, #2634aa 48%, #1a247f 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

/* textura discreta */
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), transparent 90%);
  pointer-events: none;
}

.hero-section::after {
  content: '';
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  pointer-events: none;
}

/* detalhes decorativos */
.hero-bg-details {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.soft-circle {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.circle-one {
  width: 360px;
  height: 360px;
  left: -120px;
  top: 80px;
}

.circle-two {
  width: 520px;
  height: 520px;
  right: -220px;
  bottom: 20px;
}

.book-line {
  position: absolute;
  width: 220px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(216, 223, 82, 0.55), transparent);
  transform: rotate(-28deg);
}

.line-one {
  right: 16%;
  top: 28%;
}

.line-two {
  left: 11%;
  bottom: 18%;
}

.hero-top-wrapper {
  position: relative;
  z-index: 2;
  flex-grow: 1;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6rem 2rem 4.5rem;
}

.hero-container {
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 4rem;
  align-items: center;
}

/* lado esquerdo */
.hero-content-left {
  display: flex;
  flex-direction: column;
  gap: 1.7rem;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  width: fit-content;
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.eyebrow-line {
  width: 44px;
  height: 1px;
  background: #d8df52;
  display: inline-block;
}

.brand-box {
  max-width: 680px;
}

.main-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: clamp(4.8rem, 10vw, 8.8rem);
  font-weight: 700;
  line-height: 0.78;
  letter-spacing: -0.055em;
  margin: 0;
  color: #ffffff;
}
.main-title span{
  color: #eaff00fa;

}
.hero-subtitle {
  max-width: 560px;
  margin: 1.7rem 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(1rem, 1.8vw, 1.18rem);
  line-height: 1.75;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem 1.3rem;
  margin-top: 0.6rem;
}

.event-date-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  padding: 0.75rem 1.15rem 0.75rem 0.75rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.105);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(14px);
}

.calendar-card {
  width: 64px;
  height: 70px;
  border-radius: 17px;
  background: #1a247f;
  color: #d8df52;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -5px 0 rgba(29, 39, 135, 0.09);
}

.calendar-day {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
}

.calendar-month {
  margin-top: 0.18rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.date-info .label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: rgba(216, 223, 82, 0.9);
}

.date-info .value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.mini-info {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.96rem;
  font-weight: 500;
}

.mini-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d8df52;
  box-shadow: 0 0 0 6px rgba(216, 223, 82, 0.12);
}

/* lado direito */
.hero-content-right {
  display: flex;
  justify-content: flex-end;
}

.quote-card {
  position: relative;
  width: min(100%, 500px);
  min-height: 390px;
  padding: 3rem 2.7rem;
  border-radius: 34px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.075));
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.quote-card::before {
  content: '';
  position: absolute;
  right: -80px;
  top: -80px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(216, 223, 82, 0.16);
}

.quote-card::after {
  content: '';
  position: absolute;
  left: 2.7rem;
  right: 2.7rem;
  bottom: 2rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(216, 223, 82, 0.65), transparent);
}

.quote-icon {
  position: absolute;
  top: 1rem;
  left: 2rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 9rem;
  line-height: 1;
  color: rgba(216, 223, 82, 0.26);
}

.cursive-text {
  position: relative;
  z-index: 1;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2.7rem, 4.7vw, 4.9rem);
  font-weight: 200;
  line-height: 0.98;
   text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.02em;
  margin: 0 0 1.4rem;
  color: #ffffff;
}

.author-tag {
  position: relative;
  z-index: 1;
  width: fit-content;
  font-size: 0.84rem;
  font-style: normal;
  font-weight: 800;
  color: #d8df52;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.book-mark {
  position: absolute;
  right: 2.4rem;
  bottom: 2.55rem;
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
  opacity: 0.7;
}

.book-mark span {
  display: block;
  width: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
}

.book-mark span:nth-child(1) {
  height: 34px;
}

.book-mark span:nth-child(2) {
  height: 48px;
  background: rgba(216, 223, 82, 0.85);
}

.book-mark span:nth-child(3) {
  height: 26px;
}

.hero-footer-scroller {
  position: relative;
  z-index: 2;
  width: 100%;
}

/* responsividade */
@media (max-width: 1024px) {
  .hero-section {
    min-height: auto;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    text-align: center;
  }

  .hero-content-left {
    align-items: center;
  }

  .brand-box,
  .hero-subtitle {
    max-width: 720px;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-content-right {
    justify-content: center;
  }

  .quote-card {
    min-height: 320px;
  }
}

@media (max-width: 640px) {
  .hero-section::after {
    inset: 10px;
    border-radius: 22px;
  }

  .hero-top-wrapper {
    padding: 4rem 1rem 3rem;
  }

  .hero-container {
    gap: 2.3rem;
  }

  .eyebrow {
    justify-content: center;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
  }

  .eyebrow-line {
    width: 30px;
  }

  .main-title {
    font-size: clamp(4rem, 21vw, 5.2rem);
  }

  .hero-subtitle {
    font-size: 0.98rem;
    line-height: 1.65;
  }

  .event-date-box {
    width: 100%;
    max-width: 330px;
    justify-content: flex-start;
  }

  .mini-info {
    width: 100%;
    justify-content: center;
  }

  .quote-card {
    width: 100%;
    min-height: 300px;
    padding: 2.5rem 1.5rem;
    border-radius: 28px;
  }

  .quote-card::after {
    left: 1.5rem;
    right: 1.5rem;
  }

  .quote-icon {
    left: 1rem;
    top: 0.6rem;
    font-size: 7rem;
  }

  .cursive-text {
    font-size: clamp(2.4rem, 13vw, 3.4rem);
  }

  .author-tag {
    font-size: 0.72rem;
  }

  .book-mark {
    right: 1.4rem;
    bottom: 2.3rem;
  }
}

@media (max-width: 390px) {
  .event-date-box {
    align-items: flex-start;
  }

  .calendar-card {
    width: 58px;
    height: 64px;
  }

  .date-info .value {
    font-size: 1.08rem;
  }
}
</style>