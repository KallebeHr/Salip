<template>
  <div class="container">
    <header>
      <!-- ESQUERDA DESKTOP -->
      <ul class="menu-esquerda desktop-only">
         <router-link to="/midiasalipi" class="no-style-link">
        <li><img src="/IMG/Camera.png" class="icons" alt="InstagramIcon"> MIDIA SALIPI</li>
        </router-link>

         <router-link to="/homenageados" class="no-style-link">
        <li><img src="/IMG/home.png" class="icons" alt="InstagramIcon"> HOMENAGEADOS</li>
        </router-link>
        <router-link to="/quemSomos" class="no-style-link">
          <li><img src="/IMG/iconSomos.png" class="icons" alt="QuemSomos"> QUEM SOMOS?</li>
        </router-link>
      </ul>

      <!-- LOGO CENTRAL -->
      <a href="/" class="logo-link">
        <img src="/IMG/LOGONAMEPRIMARIO.png" alt="Logo" class="logoIMG" />
      </a>

      <!-- DIREITA DESKTOP -->
      <ul class="menu-direita desktop-only">
        <router-link to="/addUser" class="no-style-link">
          <li>
            <img src="/IMG/iconAdd.png" class="icons" alt="AddIcon" />
            FAZER INSCRIÇÃO
          </li>
        </router-link>
        <a href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer">
        <li><img src="/IMG/iconInsta.png" class="icons" alt="InstagramIcon"> INSTAGRAM</li>
        </a>
 <a href="https://wa.link/sg68qw" target="_blank" rel="noopener noreferrer">
        <li>
          <img src="/IMG/iconWhats.png" class="icons" alt="WhatsApp Icon" />
            SUPORTE DE INSCRIÇÃO
          </li>
          </a>
      </ul>

      <!-- ÍCONE DE MENU NO MOBILE -->
      <img
        src="/IMG/menu.png"
        class="menu-icon mobile-only"
        alt="Menu"
        @click="menuAberto = !menuAberto"
      />
    </header>

    <!-- OVERLAY -->
    <transition name="fade">
      <div v-if="menuAberto" class="overlay" @click="menuAberto = false"></div>
    </transition>

    <!-- MENU MOBILE -->
    <transition name="slide-down">
      <div v-if="menuAberto" class="menu-mobile mobile-only">
        <ul>
          <router-link to="/midiasalipi" class="no-style-link">
          <li @click="menuAberto = false">
            <img src="/IMG/iconInsta.png" class="icons" alt="CameraIcon"> MIDIA SALIPI
          </li>
          </router-link>
          <router-link to="/homenageados" class="no-style-link">
          <li @click="menuAberto = false">
            <img src="/IMG/iconInsta.png" class="icons" alt="HomenIcon"> HOMENAGEADOS
          </li>
          </router-link>
           <a href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer">
          <li @click="menuAberto = false">
            <img src="/IMG/iconInsta.png" class="icons" alt="InstagramIcon"> INSTAGRAM
          </li></a>
          <router-link to="/quemSomos" class="no-style-link" @click="menuAberto = false">
            <li><img src="/IMG/iconSomos.png" class="icons" alt="QuemSomos"> QUEM SOMOS?</li>
          </router-link>
          <li @click="menuAberto = false">
            <img src="/IMG/iconWhats.png" class="icons" alt="WhatsApp Icon" />
            <a href="https://wa.link/sg68qw" target="_blank" rel="noopener noreferrer">SUPORTE DE INSCRIÇÃO</a>
          </li>
          <router-link to="/addUser" class="no-style-link" @click="menuAberto = false">
            <li><img src="/IMG/iconAdd.png" class="icons" alt="AddIcon" /> FAZER INSCRIÇÃO</li>
          </router-link>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const menuAberto = ref(false)
</script>

<style scoped>
.container {
  width: 100%;
  color: black;
}

/* HEADER */
header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100%;
  background-color: #fdfffb;
  box-shadow: 0 10px 18px rgba(39, 53, 175, 0.279);
  position: relative;
  z-index: 1000;
}

/* MENU */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
  font-family: "Inter", sans-serif;
  font-size: 0.8rem;
  gap: 8px;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #2734af;
  padding: 7px;
  border-radius: 10px;
  width: 16rem;
  cursor: pointer;
}
li:hover {
  border-bottom: 2px solid #2734af;
}

.icons {
  height: 1.2rem;
  margin-right: 10px;
}

a {
  all: unset;
  cursor: pointer;
}

.logoIMG {
  width: 15rem;
}

.logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ÍCONE DE MENU NO MOBILE */
.menu-icon {
  height: 30px;
  width: 30px;
  position: absolute;
  top: 2rem;
  right: 1.5rem;
  cursor: pointer;
  z-index: 1001;
}

/* MENU MOBILE */
.menu-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fdfffb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 1002;
  border-top: 1px solid #e0e0e0;
}

.menu-mobile ul {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.menu-mobile li {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2734af;
  border-radius: 10px;
  width: 15rem;
  cursor: pointer;
}
/* OVERLAY */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(1px);
  z-index: 1000;
}

/* TRANSIÇÕES */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease-out forwards;
}
.slide-down-leave-active {
  animation: slideUp 0.3s ease-in forwards;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0px); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(0px); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
}

/* RESPONSIVO */
@media (max-width: 800px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
  }

  .logoIMG {
    width: 8rem;
  }

  ul {
    align-items: center;
    justify-content: center;
  }

  li {
    width: 100%;
  }

  .logo-link {
    justify-content: flex-start;
    width: 100%;
  }

  header {
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
</style>
