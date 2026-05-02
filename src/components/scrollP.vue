<template>
  <section class="sponsors">
    <div class="viewport" :style="maskStyle">
      <div class="track" ref="trackRef">

        <template v-for="clone in 2" :key="clone">
          <div
            v-for="(section, i) in sections"
            :key="clone + '-' + i"
            class="section-card"
            :aria-hidden="clone === 2"
          >
            <span class="section-label">{{ section.label }}</span>
            <div class="section-divider" />

            <div class="logos-row">
              <div
                v-for="(item, j) in section.items"
                :key="j"
                class="logo-item"
              >
                <img
                  v-if="item.src"
                  :src="item.src"
                  :alt="item.name"
                  class="logo-img"
                  loading="lazy"
                />
                <span v-else class="logo-text">{{ item.name }}</span>
              </div>
            </div>
          </div>

          <!-- Separador vertical entre os blocos de seções -->
          <div
            v-if="clone === 1"
            class="block-sep"
            aria-hidden="true"
          />
        </template>

      </div>
    </div>
  </section>
</template>

<script setup>
const sections = [
  {
    label: "REALIZAÇÃO",
    items: [
      { name: "Secretaria da Cultura", src: "/LOGOS/secult.png" },
    ],
  },
  {
    label: "ORGANIZAÇÃO E CURADORIA",
    items: [
      { name: "Fundação Quixote", src: "/LOGOS/quixote.png" },
    ],
  },
  {
    label: "APOIO",
    items: [
      { name: "Secretaria de Educação", src: "/LOGOS/semed.png" },
      { name: "Wilson Brandão", src: "/LOGOS/wilson2.png" },
    ],
  },
]

const maskStyle = `
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
`
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');

/* ── Wrapper ─────────────────────────────────────── */
.sponsors {
  overflow: hidden;
  background: transparent; /* herda o fundo da página */
}

/* ── Viewport com máscara ────────────────────────── */
.viewport {
  position: relative;
  overflow: hidden;

  /* ALTURA FIXA — ajuste esse valor conforme seu design */
  height: 158px;
}

/* ── Trilha animada ──────────────────────────────── */
.track {
  display: inline-flex;    /* largura = soma dos filhos */
  align-items: stretch;
  height: 100%;
  animation: ticker 8s linear infinite;
  will-change: transform;
  white-space: nowrap;
}

.viewport:hover .track {
  animation-play-state: paused;
}

/* ── Cartão de seção ─────────────────────────────── */
.section-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  gap: 6px;
  flex-shrink: 0;
  height: 100%;
}

/* ── Label da seção ──────────────────────────────── */
.section-label {
  display: block;
  font-family: 'Rawline', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  white-space: nowrap;
}

/* ── Linha separadora ────────────────────────────── */
.section-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

/* ── Linha de logos ──────────────────────────────── */
.logos-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-shrink: 0;
}

/* ── Item individual ─────────────────────────────── */
.logo-item {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.75;
  transition: opacity 200ms ease, transform 200ms ease;
}

.logo-item:hover {
  opacity: 1;
  transform: translateY(-2px);
}

/* ── Imagem de logo — largura AUTO, altura fixa ──── */
.logo-img {
  height: 86px;   /* altura fixa → largura se ajusta automaticamente */
  width: auto;    /* ← preserva proporção sem corte */
  max-width: 160px;
  object-fit: contain;
}

/* ── Logo em texto (fallback) ────────────────────── */
.logo-text {
  font-family: 'Rawline', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.3rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

/* ── Separador vertical entre os blocos ──────────── */
.block-sep {
  flex-shrink: 0;
  width: 1px;
  height: 60%;
  align-self: center;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 8px;
}

/* ── Animação ────────────────────────────────────── */
@keyframes ticker {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-50%, 0, 0); }
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 768px) {
  .viewport {
    height: 72px;
  }

  .section-card {
    padding: 0 24px;
    gap: 5px;
  }

  .logos-row {
    gap: 16px;
  }

  .logo-img {
    height: 26px;
  }

  .logo-label {
    font-size: 0.55rem;
  }

  .track {
    animation-duration: 20s;
  }
}

/* ── Sem animação (acessibilidade) ───────────────── */
@media (prefers-reduced-motion: reduce) {
  .track {
    animation: none;
  }
  .viewport {
    overflow-x: auto;
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }
}
</style>