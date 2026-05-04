<template>
  <div class="container">
    <header>
      <div class="header-accent-line"></div>

      <ul class="menu-esquerda desktop-only">
        <router-link to="/midiasalipi" class="no-style-link">
          <li>
            <span class="mdi mdi-microphone-variant"></span>
            <span class="nav-label">CONVIDADOS</span>
          </li>
        </router-link>

        <router-link to="/homenageados" class="no-style-link">
          <li>
            <span class="mdi mdi-medal-outline"></span>
            <span class="nav-label">HOMENAGEADOS</span>
          </li>
        </router-link>

        <router-link to="/quemSomos" class="no-style-link">
          <li>
            <span class="mdi mdi-information-outline"></span>
            <span class="nav-label">QUEM SOMOS?</span>
          </li>
        </router-link>
      </ul>

      <router-link to="/" class="logo-link">
        <div class="logo-wrapper">
          <img src="/LOGOS/logoSalip.svg" alt="Logo" class="logoIMG" />
          <div class="logo-shimmer"></div>
        </div>
      </router-link>

      <ul class="menu-direita desktop-only">
        <li
          ref="desktopDropdownRef"
          class="li-cta dropdown-trigger"
          :class="{ 'dropdown-open': dropdownAberto }"
          role="button"
          tabindex="0"
          aria-haspopup="true"
          :aria-expanded="dropdownAberto"
          @click.stop="toggleDesktopDropdown"
          @keydown.enter.prevent="toggleDesktopDropdown"
          @keydown.space.prevent="toggleDesktopDropdown"
        >
          <span class="mdi mdi-account-box"></span>
          <span class="nav-label">ÁREA DO PARTICIPANTE</span>
          <span class="mdi mdi-chevron-down dropdown-chevron"></span>

          <transition name="dropdown-fade">
            <div v-if="dropdownAberto" class="dropdown-menu" @click.stop>
              <div class="dropdown-header">
                <span class="mdi mdi-account-circle-outline"></span>
                O que deseja fazer?
              </div>

              <router-link to="/addUser" class="dropdown-link" @click="closeAll">
                <div class="dropdown-item">
                  <div class="dropdown-item-icon inscricao-icon">
                    <span class="mdi mdi-pencil-plus-outline"></span>
                  </div>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Fazer Inscrição</span>
                    <span class="dropdown-item-desc">Inscreva-se no evento</span>
                  </div>
                  <span class="mdi mdi-arrow-right dropdown-item-arrow"></span>
                </div>
              </router-link>

              <router-link to="/certificado" class="dropdown-link" @click="closeAll">
                <div class="dropdown-item">
                  <div class="dropdown-item-icon certificado-icon">
                    <span class="mdi mdi-certificate-outline"></span>
                  </div>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Gerar Certificado</span>
                    <span class="dropdown-item-desc">Baixe sua certificação</span>
                  </div>
                  <span class="mdi mdi-arrow-right dropdown-item-arrow"></span>
                </div>
              </router-link>

              <router-link to="/avaliar" class="dropdown-link" @click="closeAll">
                <div class="dropdown-item">
                  <div class="dropdown-item-icon avaliar-icon">
                    <span class="mdi mdi-star-outline"></span>
                  </div>
                  <div class="dropdown-item-text">
                    <span class="dropdown-item-title">Avaliar Evento</span>
                    <span class="dropdown-item-desc">Compartilhe sua opinião</span>
                  </div>
                  <span class="mdi mdi-arrow-right dropdown-item-arrow"></span>
                </div>
              </router-link>
            </div>
          </transition>
        </li>

        <a
          href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet"
          target="_blank"
          rel="noopener noreferrer"
          class="no-style-link"
        >
          <li>
            <span class="mdi mdi-instagram"></span>
            <span class="nav-label">INSTAGRAM</span>
          </li>
        </a>

        <router-link to="/edicoes" class="no-style-link">
          <li>
            <span class="mdi mdi-book-open-page-variant-outline"></span>
            <span class="nav-label">EDIÇÕES</span>
          </li>
        </router-link>
      </ul>

      <button
        class="menu-icon mobile-only"
        :class="{ 'is-open': menuAberto }"
        type="button"
        :aria-expanded="menuAberto"
        aria-label="Abrir menu"
        @click="toggleMobileMenu"
      >
        <span class="mdi" :class="menuAberto ? 'mdi-close' : 'mdi-menu'"></span>
      </button>
    </header>

    <transition name="fade">
      <div v-if="dropdownAberto" class="overlay-dropdown" @click="dropdownAberto = false"></div>
    </transition>

    <transition name="fade">
      <div v-if="menuAberto" class="overlay-mobile" @click="closeAll"></div>
    </transition>

    <transition name="slide-down">
      <nav v-if="menuAberto" class="menu-mobile mobile-only" aria-label="Menu mobile">
        <ul>
          <router-link to="/midiasalipi" class="no-style-link" @click="closeAll">
            <li><span class="mdi mdi-microphone-variant"></span>CONVIDADOS</li>
          </router-link>

          <router-link to="/edicoes" class="no-style-link" @click="closeAll">
            <li><span class="mdi mdi-book-open-page-variant-outline"></span> EDIÇÕES</li>
          </router-link>

          <router-link to="/homenageados" class="no-style-link" @click="closeAll">
            <li><span class="mdi mdi-medal-outline"></span> HOMENAGEADOS</li>
          </router-link>

          <a
            href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet"
            target="_blank"
            rel="noopener noreferrer"
            class="no-style-link"
            @click="closeAll"
          >
            <li><span class="mdi mdi-instagram"></span> INSTAGRAM</li>
          </a>

          <router-link to="/quemSomos" class="no-style-link" @click="closeAll">
            <li><span class="mdi mdi-information-outline"></span> QUEM SOMOS?</li>
          </router-link>

          <a
            href="https://wa.link/sg68qw"
            target="_blank"
            rel="noopener noreferrer"
            class="no-style-link"
            @click="closeAll"
          >
            <li><span class="mdi mdi-whatsapp"></span> SUPORTE DE INSCRIÇÃO</li>
          </a>

          <li
            class="li-mobile-expand"
            role="button"
            tabindex="0"
            :aria-expanded="dropdownMobileAberto"
            @click="dropdownMobileAberto = !dropdownMobileAberto"
            @keydown.enter.prevent="dropdownMobileAberto = !dropdownMobileAberto"
            @keydown.space.prevent="dropdownMobileAberto = !dropdownMobileAberto"
          >
            <span class="mdi mdi-account-box"></span>
            ÁREA DO PARTICIPANTE
            <span class="mdi mdi-chevron-down mobile-chevron" :class="{ rotated: dropdownMobileAberto }"></span>
          </li>

          <div class="mobile-sub-slot" :class="{ opened: dropdownMobileAberto }">
            <div class="mobile-sub-menu">
              <router-link to="/addUser" class="no-style-link" @click="closeAll">
                <div class="mobile-sub-item">
                  <span class="mdi mdi-pencil-plus-outline"></span>
                  Fazer Inscrição
                </div>
              </router-link>

              <router-link to="/certificado" class="no-style-link" @click="closeAll">
                <div class="mobile-sub-item">
                  <span class="mdi mdi-certificate-outline"></span>
                  Gerar Certificado
                </div>
              </router-link>

              <router-link to="/avaliar" class="no-style-link" @click="closeAll">
                <div class="mobile-sub-item">
                  <span class="mdi mdi-star-outline"></span>
                  Avaliar Evento
                </div>
              </router-link>
            </div>
          </div>
        </ul>
      </nav>
    </transition>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuAberto = ref(false)
const dropdownAberto = ref(false)
const dropdownMobileAberto = ref(false)
const desktopDropdownRef = ref(null)

function toggleDesktopDropdown() {
  dropdownAberto.value = !dropdownAberto.value
  menuAberto.value = false
  dropdownMobileAberto.value = false
}

function toggleMobileMenu() {
  menuAberto.value = !menuAberto.value
  dropdownAberto.value = false

  if (!menuAberto.value) {
    dropdownMobileAberto.value = false
  }
}

function closeAll() {
  menuAberto.value = false
  dropdownAberto.value = false
  dropdownMobileAberto.value = false
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeAll()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => route.fullPath,
  () => closeAll()
)
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css');
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&display=swap');

.container {
  width: 100%;
  position: relative;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 90px;
  padding: 12px 24px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
  box-shadow: 0 4px 28px rgba(39, 53, 175, 0.18), 0 1px 0 rgba(39, 52, 175, 0.1);
  position: relative;
  z-index: 3000;
}

.header-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #c8a85a 30%, #e2c87a 50%, #c8a85a 70%, transparent 100%);
}

.logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  cursor: pointer;
}

.logo-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logoIMG {
  width: 13rem;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(39, 52, 175, 0.15));
  transition: transform 0.4s ease, filter 0.4s ease;
}

.logo-wrapper:hover .logoIMG {
  transform: scale(1.04);
  filter: drop-shadow(0 4px 16px rgba(39, 52, 175, 0.3));
}

.logo-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%);
  transform: translateX(-120%);
  pointer-events: none;
}

.logo-wrapper:hover .logo-shimmer {
  transform: translateX(120%);
  transition: transform 0.55s ease;
}

ul {
  list-style: none;
  margin: 0 1rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

li {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 7px 14px 7px 10px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #1a1a2e;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  overflow: visible;
  transition: color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
}

li::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: calc(100% - 16px);
  height: 1.5px;
  background: linear-gradient(90deg, #2734af, #c8a85a);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 2px;
}

li:hover::after {
  transform: translateX(-50%) scaleX(1);
}

li:hover {
  color: #2734af;
  background: rgba(39, 52, 175, 0.05);
  transform: translateX(2px);
}

.mdi {
  font-size: 1.1rem;
  color: #2734af;
  flex-shrink: 0;
  transition: color 0.25s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

li:hover .mdi {
  transform: scale(1.2) rotate(-4deg);
  color: #c8a85a;
}

a,
.no-style-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.li-cta {
  background: linear-gradient(135deg, #2734af 0%, #3d4fd1 100%);
  color: white !important;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(39, 52, 175, 0.35);
  position: relative;
  overflow: visible;
  user-select: none;
  z-index: 3200;
}

.li-cta::after {
  display: none;
}

.li-cta .mdi {
  color: rgba(255,255,255,0.9);
}

.li-cta:hover,
.li-cta.dropdown-open {
  background: linear-gradient(135deg, #3d4fd1 0%, #5468e7 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(39, 52, 175, 0.45);
  color: white !important;
}

.li-cta:hover > .mdi {
  transform: none;
}

.li-cta:hover > .mdi-account-box,
.li-cta.dropdown-open > .mdi-account-box {
  color: #e2c87a;
}

.li-cta:hover > .dropdown-chevron,
.li-cta.dropdown-open > .dropdown-chevron {
  color: rgba(255,255,255,0.9) !important;
}

.li-cta:hover .dropdown-menu .mdi,
.li-cta.dropdown-open .dropdown-menu .mdi {
  color: white;
  transform: none;
}

.li-cta:hover .dropdown-menu .dropdown-header .mdi,
.li-cta.dropdown-open .dropdown-menu .dropdown-header .mdi {
  color: #c8a85a;
}

.li-cta:hover .dropdown-link:hover .dropdown-item-icon .mdi {
  transform: scale(1.15) rotate(-4deg);
}

.dropdown-chevron {
  margin-left: auto !important;
  font-size: 1rem !important;
  color: rgba(255,255,255,0.8) !important;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.dropdown-open .dropdown-chevron {
  transform: rotate(180deg) !important;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 240px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow:
    0 20px 60px rgba(39, 52, 175, 0.22),
    0 4px 16px rgba(0,0,0,0.08),
    0 0 0 1px rgba(39, 52, 175, 0.08);
  overflow: hidden;
  z-index: 3300;
  color: #2734af !important;
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -7px;
  right: 28px;
  width: 14px;
  height: 14px;
  background: white;
  transform: rotate(45deg);
  border-radius: 2px;
  box-shadow: -2px -2px 6px rgba(39, 52, 175, 0.08);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 10px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #8892b0;
  border-bottom: 1px solid rgba(39, 52, 175, 0.08);
  text-transform: uppercase;
}

.dropdown-header .mdi {
  color: #c8a85a;
  font-size: 1rem;
}

.dropdown-link {
  display: block;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid rgba(39, 52, 175, 0.05);
  transition: background 0.2s ease;
}

.dropdown-link:last-of-type {
  border-bottom: none;
}

.dropdown-link:hover {
  background: rgba(39, 52, 175, 0.05);
}

.dropdown-link:hover .dropdown-item-title {
  color: #2734af;
}

.dropdown-link:hover .dropdown-item-arrow {
  transform: translateX(4px);
  color: #2734af;
}

.dropdown-link:hover .dropdown-item-icon .mdi {
  transform: scale(1.15) rotate(-4deg);
}

.dropdown-link::after {
  content: '';
  display: block;
  height: 1.5px;
  background: linear-gradient(90deg, #2734af, #c8a85a);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 2px;
}

.dropdown-link:hover::after {
  transform: scaleX(1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.dropdown-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-item-icon .mdi {
  font-size: 1.2rem;
  color: white;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.inscricao-icon {
  background: linear-gradient(135deg, #2734af, #3d4fd1);
}

.certificado-icon {
  background: linear-gradient(135deg, #c8a85a, #e2c87a);
}

.avaliar-icon {
  background: linear-gradient(135deg, #3d4fd1, #7b86e2);
}

.dropdown-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.dropdown-item-title {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #1a1a2e;
  transition: color 0.2s;
}

.dropdown-item-desc {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  color: #8892b0;
}

.dropdown-item-arrow {
  font-size: 1rem;
  color: #c8d0e0;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s;
}

.dropdown-fade-enter-active {
  animation: dropIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.dropdown-fade-leave-active {
  animation: dropOut 0.18s ease-in forwards;
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
  }
}

.overlay-dropdown {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 2500;
}

.overlay-mobile {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 60, 0.4);
  backdrop-filter: blur(3px);
  z-index: 2000;
}

.menu-icon {
  background: none;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  z-index: 4100;
  line-height: 0;
  transition: border-color 0.25s, background 0.25s;
}

.menu-icon .mdi {
  font-size: 3rem;
  color: #2734af;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s;
}

.menu-icon.is-open .mdi {
  transform: rotate(90deg);
  color: #c8a85a;
}

.menu-icon:hover {
  border-color: #2734af;
  background: rgba(39, 52, 175, 0.06);
}

.menu-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 545px;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
  box-shadow: 0 8px 40px rgba(39, 52, 175, 0.2);
  padding: 1.5rem 1rem 1.2rem;
  z-index: 3000;
  border-top: 3px solid #c8a85a;
  box-sizing: border-box;
}

.menu-mobile ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.menu-mobile li {
  justify-content: flex-start;
  font-size: 0.75rem;
  padding: 10px 16px;
  border-radius: 8px;
  width: 16rem;
  border-bottom: 1px solid rgba(39, 52, 175, 0.12);
  background: rgba(255,255,255,0.7);
  white-space: nowrap;
  transform: none !important;
  overflow: visible;
  box-sizing: border-box;
}

.li-mobile-expand {
  background: linear-gradient(135deg, #2734af 0%, #3d4fd1 100%) !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(39, 52, 175, 0.3);
  border-bottom-color: transparent !important;
  justify-content: space-between !important;
}

.li-mobile-expand .mdi {
  color: rgba(255,255,255,0.9) !important;
}

.mobile-chevron {
  margin-left: auto;
  font-size: 1rem !important;
  transition: transform 0.3s ease !important;
}

.mobile-chevron.rotated {
  transform: rotate(180deg) !important;
}

.mobile-sub-slot {
  width: 16rem;
  height: 128px;
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobile-sub-slot.opened {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.mobile-sub-menu {
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(39, 52, 175, 0.12);
  overflow: hidden;
  border: 1px solid rgba(39, 52, 175, 0.08);
  box-sizing: border-box;
}

.mobile-sub-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #1a1a2e;
  border-bottom: 1px solid rgba(39, 52, 175, 0.06);
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-sub-item:last-child {
  border-bottom: none;
}

.mobile-sub-item:hover {
  background: rgba(39, 52, 175, 0.05);
}

.mobile-sub-item .mdi {
  color: #2734af;
  font-size: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  animation: luxSlideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.slide-down-leave-active {
  animation: luxSlideUp 0.3s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}

@keyframes luxSlideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes luxSlideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

@media (max-width: 800px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
    justify-content: center;
  }

  header {
    min-height: 68px;
    justify-content: flex-start;
    padding: 10px 1rem;
  }

  .logoIMG {
    width: 8rem;
  }

  .logo-link {
    justify-content: flex-start;
  }
}

@media (min-width: 800px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: flex !important;
  }
}

@media (max-width: 360px) {
  .menu-mobile li,
  .mobile-sub-slot {
    width: calc(100vw - 2rem);
  }
}
</style>