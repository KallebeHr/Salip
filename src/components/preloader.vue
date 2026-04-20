<template>
  <transition name="fade">
    <div class="loader-overlay" v-if="!isloaded">
      <div class="loading-container">
        
        <div class="loading-text">
          <span style="--i:1">S</span>
          <span style="--i:2">A</span>
          <span style="--i:3">L</span>
          <span style="--i:4">I</span>
          <span style="--i:5">P</span>
          <span style="--i:6">2</span>
        </div>

        <div class="glow-track">
          <div class="glow-line"></div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isloaded: false
    }
  },
  mounted() {
    // Verifica se a página já está carregada (útil para Hot Reload no desenvolvimento)
    if (document.readyState === "complete") {
      this.finishLoading();
    } else {
      // Usar o evento 'load' do window é mais seguro para garantir que imagens e scripts carregaram
      window.addEventListener("load", this.finishLoading);
    }
  },
  methods: {
    finishLoading() {
      // Um pequeno delay opcional apenas para a animação não cortar rápido demais
      setTimeout(() => {
        this.isloaded = true;
      }, 3000);
    }
  }
}
</script>

<style scoped>
/* Peso 700 para a fonte ficar mais imponente e moderna */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* --- ANIMAÇÃO DE SAÍDA DO VUE (FADE) --- */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05); /* Dá um leve zoom out ao sumir */
}

/* --- OVERLAY PRINCIPAL --- */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Gradiente moderno substituindo a cor sólida */
  background: linear-gradient(135deg, #161e6d 0%, #2734af 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  z-index: 99999; /* Garante que fique por cima de tudo */
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* --- TEXTO E EFEITO DE ONDA --- */
.loading-text {
  display: flex;
  gap: 8px; /* Espaçamento consistente entre as letras */
  font-size: 4rem; /* Tamanho ajustado e responsivo */
  color: #ffffff;
  letter-spacing: 5px;
}

.loading-text span {
  display: inline-block;
  opacity: 0;
  /* A animação usa o valor da variável --i definida no HTML para o delay */
  animation: floatBounce 2s infinite ease-in-out;
  animation-delay: calc(0.15s * var(--i)); 
}

@keyframes floatBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
    text-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 1;
    /* Efeito de neon azul claro quando a letra sobe */
    text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4), 0 0 20px #00d2ff; 
  }
}

/* --- LINHA DE CARREGAMENTO (ESTILO SCANNER) --- */
.glow-track {
  width: 250px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1); /* Trilho de fundo sutil */
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.glow-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  /* Gradiente na linha que viaja de um lado para o outro */
  background: linear-gradient(90deg, transparent, #00d2ff, #ffffff, transparent);
  animation: scanLine 2s infinite ease-in-out;
}

@keyframes scanLine {
  0% {
    left: -100%;
  }
  50% {
    left: 150%;
  }
  100% {
    left: -100%;
  }
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 600px) {
  .loading-text {
    font-size: 2.5rem;
    gap: 4px;
  }
  .glow-track {
    width: 200px;
  }
}
</style>