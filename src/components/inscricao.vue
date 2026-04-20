<template>
  <section class="insc" aria-labelledby="insc-title">

    <!-- Decoração de fundo -->
    <div class="insc__bg" aria-hidden="true">
      <div class="bg-shape bg-shape--circle"></div>
      <div class="bg-shape bg-shape--arc"></div>
      <div class="bg-lines">
        <span v-for="n in 6" :key="n" class="bg-line" :style="`--i:${n}`"></span>
      </div>
      <div class="bg-dots"></div>
    </div>

    <div class="insc__wrap">

      <!-- Logo + Identidade do Evento -->
      <div class="insc__brand" data-anim="rise">

        <div class="insc__edition">
          <span class="edition__tag">3ª Edição</span>
          <p class="edition__subtitle">Salão do Livro de Pedro II</p>
        </div>
      </div>

      <!-- Bloco Principal -->
      <div class="insc__hero">
        <div class="insc__headline" data-anim="rise" style="--delay: 0.1s">
          <p class="headline__overline">Vagas Limitadas · Entrada Gratuita</p>
          <h1 id="insc-title" class="headline__title">
            Inscrições<br />
            <span class="headline__accent">Abertas</span>
          </h1>
        </div>

        <!-- Cards de Informação -->
        <div class="insc__cards" data-anim="rise" style="--delay: 0.2s">
          <div class="info-card">
            <div class="info-card__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="info-card__content">
              <p class="info-card__label">Data do Evento</p>
              <strong class="info-card__value">22 a 24 de Maio</strong>
            </div>
          </div>

          <div class="info-card">
            <div class="info-card__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="info-card__content">
              <p class="info-card__label">Local</p>
              <strong class="info-card__value">Pedro II · PI</strong>
            </div>
          </div>

          <div class="info-card info-card--highlight">
            <div class="info-card__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="info-card__content">
              <p class="info-card__label">Inscrição</p>
              <strong class="info-card__value">100% Gratuita</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Descrição -->
      <p class="insc__desc" data-anim="rise" style="--delay: 0.3s">
        Participe de <strong>palestras</strong>, <strong>oficinas</strong> e outras atrações do maior
        evento literário da região. Clique abaixo e garanta sua vaga em poucos segundos.
      </p>

      <!-- Ações -->
      <div class="insc__actions" data-anim="rise" style="--delay: 0.4s">
        <a href="/addUser" class="btn btn--primary">
          <span class="btn__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </span>
          <span class="btn__text">Fazer Inscrição</span>
          <span class="btn__arrow">→</span>
        </a>

        <a href="https://wa.link/sg68qw" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">
          <span class="btn__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </span>
          <span class="btn__text">Suporte via WhatsApp</span>
        </a>
      </div>

      <!-- Rodapé informativo -->
      <p class="insc__note" data-anim="rise" style="--delay: 0.5s">
        Dúvidas? Fale com nossa equipe pelo WhatsApp ou consulte os locais do evento abaixo.
      </p>

    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@400;500;600;700&display=swap');

/* ─── Tokens ─────────────────────────────────────────── */
:root {
  --navy:       #0D1B5E;
  --navy-mid:   #1A2D80;
  --teal:       #00C2A8;
  --teal-light: #E0F9F6;
  --orange:     #F5824C;
  --orange-soft:#FFF0E8;
  --white:      #FFFFFF;
  --off-white:  #F5F6FC;
  --text:       #0D1B5E;
  --text-soft:  #4A5585;
}

* { box-sizing: border-box; }

/* ─── Section ────────────────────────────────────────── */
.insc {
  position: relative;
  overflow: hidden;
  padding: 5rem 1.5rem 5.5rem;
  background: linear-gradient(160deg, #0D1B5E 0%, #1A2D80 55%, #0A2450 100%);
  font-family: 'Outfit', sans-serif;
}

/* ─── Background Decorativo ──────────────────────────── */
.insc__bg { position: absolute; inset: 0; pointer-events: none; }

.bg-shape {
  position: absolute;
  border-radius: 999px;
}
.bg-shape--circle {
  width: 480px; height: 480px;
  top: -160px; right: -120px;
  background: radial-gradient(circle, rgba(0,194,168,0.18) 0%, transparent 70%);
}
.bg-shape--arc {
  width: 340px; height: 340px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(245,130,76,0.14) 0%, transparent 70%);
}

.bg-lines {
  position: absolute;
  inset: 0;
}
.bg-line {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
  top: calc(var(--i) * 16.6%);
}

.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* ─── Wrap ───────────────────────────────────────────── */
.insc__wrap {
  position: relative;
  z-index: 1;
  width: min(1080px, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

/* ─── Animações ──────────────────────────────────────── */
[data-anim="rise"] {
  animation: rise 0.7s ease both;
  animation-delay: var(--delay, 0s);
}
@keyframes rise {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Brand / Logo ───────────────────────────────────── */
.insc__brand {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  animation: rise 0.6s ease both;
}

.insc__logo-wrap {
  border-radius: 16px;
  padding: 0.75rem 1.1rem;
}

.insc__logo {
  height: 64px;
  width: auto;
  display: block;
}

.insc__edition {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.edition__tag {
  display: inline-block;
  background: rgba(0,194,168,0.18);
  border: 1px solid rgba(0,194,168,0.4);
  color: #6EFAE8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  width: fit-content;
}

.edition__subtitle {
  margin: 0;
  color: rgba(255,255,255,0.65);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ─── Hero ───────────────────────────────────────────── */
.insc__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  width: 100%;
}

/* ─── Headline ───────────────────────────────────────── */
.insc__headline { display: flex; flex-direction: column; gap: 0.75rem; }

.headline__overline {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.headline__title {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 9vw, 7rem);
  font-weight: 900;
  line-height: 0.9;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.headline__accent {
  display: block;
  color: var(--teal);
  font-style: italic;
  text-shadow: 0 0 60px rgba(0,194,168,0.35);
}

/* ─── Cards de Info ──────────────────────────────────── */
.insc__cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1.35rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.25s ease, background 0.25s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.1);
}

.info-card--highlight {
  background: rgba(0,194,168,0.12);
  border-color: rgba(0,194,168,0.35);
}

.info-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--teal);
}

.info-card__icon svg {
  width: 18px;
  height: 18px;
}

.info-card--highlight .info-card__icon {
  background: rgba(0,194,168,0.2);
}

.info-card__content { text-align: left; }

.info-card__label {
  margin: 0 0 0.15rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
}

.info-card__value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

/* ─── Descrição ──────────────────────────────────────── */
.insc__desc {
  margin: 0;
  max-width: 680px;
  text-align: center;
  font-size: 1.05rem;
  line-height: 1.85;
  color: rgba(255,255,255,0.62);
}

.insc__desc strong {
  color: rgba(255,255,255,0.92);
  font-weight: 600;
}

/* ─── Botões ─────────────────────────────────────────── */
.insc__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 1.5rem;
  min-height: 60px;
  border-radius: 999px;
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  will-change: transform;
}

.btn:hover { transform: translateY(-3px); }

.btn__icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.btn__icon svg { width: 18px; height: 18px; }

.btn__arrow {
  font-size: 1.1rem;
  transition: transform 0.25s ease;
}
.btn--primary:hover .btn__arrow { transform: translateX(4px); }

.btn--primary {
  background: linear-gradient(135deg, #00C2A8 0%, #00A08A 100%);
  color: #ffffff;
  box-shadow: 0 16px 40px rgba(0,194,168,0.35);
}
.btn--primary:hover {
  box-shadow: 0 20px 44px rgba(0,194,168,0.45);
}

.btn--secondary {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.88);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.btn--secondary:hover {
  background: rgba(255,255,255,0.14);
  color: #ffffff;
}

/* ─── Nota de rodapé ─────────────────────────────────── */
.insc__note {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.35);
  text-align: center;
  max-width: 540px;
}

/* ─── Responsividade ─────────────────────────────────── */
@media (min-width: 768px) {
  .insc__hero {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
  }
  .insc__headline { align-items: flex-start; }
  .insc__cards { justify-content: flex-start; }
}

@media (max-width: 560px) {
  .insc { padding: 4rem 1rem 4.5rem; }

  .insc__brand { flex-direction: column; align-items: flex-start; }

  .insc__actions {
    flex-direction: column;
    width: 100%;
  }
  .btn { width: 100%; justify-content: center; }

  .info-card { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  [data-anim], .btn, .info-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>