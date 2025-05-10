<template>
  <div class="container">
    <header>
      <!-- ESQUERDA -->
      <ul class="menu-esquerda desktop-only">
        <li><img src="/IMG/iconInsta.png" class="icons" alt="InstagramIcon"> INSTAGRAM</li>
        <router-link to="/quemSomos" class="no-style-link">
          <li><img src="/IMG/iconSomos.png" class="icons" alt="QuemSomos"> QUEM SOMOS?</li>
        </router-link>
      </ul>

      <!-- LOGO CENTRAL -->
      <a href="/" class="logo-link">
        <img src="/IMG/LOGONAMEPRIMARIO.png" alt="Logo" class="logoIMG" />
      </a>

      <!-- DIREITA -->
      <ul class="menu-direita desktop-only">
        <li>
          <img src="/IMG/iconWhats.png" class="icons" alt="WhatsApp Icon" />
          <a href="https://wa.link/sg68qw" target="_blank" rel="noopener noreferrer">
            SUPORTE DE INSCRIÇÃO
          </a>
        </li>
        <router-link to="/addUser" class="no-style-link">
          <li>
            <img src="/IMG/iconAdd.png" class="icons" alt="AddIcon" />
            FAZER INSCRIÇÃO
          </li>
        </router-link>
      </ul>

      <!-- HAMBÚRGUER MOBILE -->
      <input type="checkbox" id="menuToggle" v-model="menuAberto" class="hamburger-checkbox mobile-only" />
      <label for="menuToggle" class="hamburger-icon mobile-only">
        <span></span>
        <span></span>
        <span></span>
      </label>
    </header>

    <!-- MENU MOBILE SOBREPOSTO -->
    <div v-if="menuAberto" class="menu-mobile mobile-only">
      <ul>
        <li @click="menuAberto = false">
          <img src="/IMG/iconInsta.png" class="icons" alt="InstagramIcon"> INSTAGRAM
        </li>
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

header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 100%;
  background-color: #fdfffb;
  box-shadow: 0 10px 18px rgba(39, 53, 175, 0.279);
  z-index: 1000;
  position: relative;
}

/* MENU */
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
  font-family: "Inter", sans-serif;
  font-weight: 300;
  font-size: 0.8rem;
  gap: 8px;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  border-bottom: solid 1px #2734af;
  padding: 7px;
  border-radius: 10px;
  width: 14rem;
  cursor: pointer;
}

li:hover {
  border-bottom: solid 2px #2734af;
}

.icons {
  height: 1.2rem;
  margin-right: 10px;
}

a {
  all: unset;
  cursor: pointer;
  text-decoration: none;
}

.logoIMG {
  width: 15rem;
}

.logo-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* HAMBÚRGUER */
.hamburger-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.hamburger-icon {
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 30px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 1001;
}

.hamburger-icon span {
  display: block;
  height: 4px;
  width: 100%;
  background-color: #2734AF;
  border-radius: 3px;
  transition: 0.3s;
}

#menuToggle:checked + .hamburger-icon span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
#menuToggle:checked + .hamburger-icon span:nth-child(2) {
  opacity: 0;
}
#menuToggle:checked + .hamburger-icon span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.menu-mobile {
  position: fixed;
  top: 100px; /* ajusta para não cobrir o header */
  left: 0;
  width: 100%;
  background: #fdfffb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 9999;
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
