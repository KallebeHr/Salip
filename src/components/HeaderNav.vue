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
  
        <!-- LOGO CENTRAL (SEMPRE VISÍVEL) -->
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
  
        <!-- BOTÃO HAMBÚRGUER MOBILE -->
        <button class="menu-toggle mobile-only" @click="menuAberto = !menuAberto">
          <img src="/IMG/iconInsta.png" class="menu-icon" alt="menu" />
        </button>
      </header>
  
      <!-- MENU MOBILE (só quando aberto) -->
      <div v-if="menuAberto" class="menu-mobile mobile-only">
        <ul>
          <li><img src="/IMG/iconInsta.png" class="icons" alt="InstagramIcon"> INSTAGRAM</li>
          <router-link to="/quemSomos" class="no-style-link">
            <li><img src="/IMG/iconSomos.png" class="icons" alt="QuemSomos"> QUEM SOMOS?</li>
          </router-link>
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
  
  /* ITENS EM COLUNA */
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
  
  /* BOTÃO MENU */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    margin-left: auto;
  }
  
  .menu-icon {
    width: 24px;
    height: 24px;
  }
  
  /* MENU MOBILE */
  .menu-mobile {
    background: #fdfffb;
    padding: 1rem;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  }
  
  /* MOBILE CONFIG */
  @media (max-width: 800px) {
    .desktop-only {
      display: none !important;
    }
    .logoIMG{
    width: 8rem;

    }
    .mobile-only {
      display: block !important;
    }
  
    ul {
      align-items: flex-start;
      justify-content: center;
      align-items: center;
    }
  
    li {
      width: 100%;
    }
  
    .menu-toggle {
      display: block;
      position: absolute;
      right: 1rem;
    }
  
    .logo-link {
      justify-content: flex-start;
      width: 100%;
    }
  
    header {
      justify-content: flex-start;
    }
  }
  
  /* DESKTOP CONFIG */
  @media (min-width: 800px) {
    ul {
      flex-direction: column;
    }
  
    .mobile-only {
      display: none !important;
    }
  
    .desktop-only {
      display: flex !important;
    }
  }
  </style>
  