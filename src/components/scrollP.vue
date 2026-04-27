<template>
  <section class="sponsors">
    <div class="container">
      <div class="viewport" :style="maskStyle">
        <div class="track">
          <!-- GROUP A -->
          <div class="group">
            <div
              v-for="(s, i) in sponsors"
              :key="'a' + i"
              class="item"
            >
              <img
                v-if="s.logo"
                :src="s.logo"
                :alt="s.name"
                class="logo"
                loading="lazy"
              />

              <span v-else class="text">
                {{ s.name }}
              </span>
            </div>
          </div>

          <!-- GROUP B -->
          <div class="group" aria-hidden="true">
            <div
              v-for="(s, i) in sponsors"
              :key="'b' + i"
              class="item"
            >
              <img
                v-if="s.logo"
                :src="s.logo"
                :alt="s.name"
                class="logo"
                loading="lazy"
              />

              <span v-else class="text">
                {{ s.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const sponsors = [
  { name: "Prefeitura de Pedro II" },
  { name: "7 a 9 de Maio" },
  { name: "Prefeitura de Pedro II" },
  { name: "Nome Patrocinio" },
  { Name:"", linkSRc: "/"}
]

const maskStyle = `
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/rawline');

.sponsors {
  position: relative;
  padding: 5px 0;
  overflow: hidden;
}

.container {
  width: min(1280px, calc(100% - 10px));
  margin: 0 auto;
}

.head {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  margin: 0;
  color: rgba(0, 0, 0, 0.96);
  font-family: 'Rawline', sans-serif;
  font-size: clamp(1.55rem, 2.3vw, 2.45rem);

  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
}

.sub {
  margin: 12px auto 0;
  max-width: 640px;
  color: rgba(0, 0, 0, 0.56);
    font-family: 'Rawline', sans-serif;
  font-size: 0.98rem;
  line-height: 1.6;
}
.confirmed-section__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font: 800 11px/1 var(--sans);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #316eb9;
}

.confirmed-section__eyebrow::before,
.confirmed-section__eyebrow::after {
  content: "";
  width: 22px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.65;
}
.viewport {
  position: relative;
  overflow: hidden;
  padding: 10px 0;
}

.track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: ticker 24s linear infinite;
  will-change: transform;
}

.viewport:hover .track {
  animation-play-state: paused;
}

.group {
  display: flex;
  align-items: center;
  gap: 44px;
  padding-right: 40px;
}

.item {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
  opacity: 0.72;
  transform: translateY(0);
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    filter 220ms ease;
}

.item:hover {
  opacity: 1;
  transform: translateY(-4px);
}

.text {
  display: inline-block;
  white-space: nowrap;

  color: rgba(97, 97, 97, 0.65);

  font-family: 'Anton', sans-serif;

  font-size: clamp(1.8rem, 2.6vw, 3rem);
  font-weight: 900; 

  letter-spacing: 0.04em;
  line-height: 1;

  text-transform: uppercase;

  opacity: 0.6;

  transform: translateZ(0);
}

.logo {
  height: 42px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
  opacity: 0.72;
  filter:
    grayscale(100%)
    brightness(1.8)
    contrast(1.05)
    drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
}

@keyframes ticker {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (max-width: 768px) {
  .sponsors {
  }

  .container {
    width: min(1280px, calc(100% - 24px));
  }

  .head {
    margin-bottom: 20px;
  }

  .sub {
    font-size: 0.92rem;
  }

  .group {
    gap: 28px;
    padding-right: 28px;
  }

  .item {
    min-height: 58px;
  }

  .text {
    font-size: clamp(1.15rem, 6vw, 1.8rem);
  }

  .logo {
    height: 30px;
    max-width: 140px;
  }

  .track {
    animation-duration: 18s;
  }
}

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