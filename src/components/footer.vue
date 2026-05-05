<template>
  <footer class="footer">
    <div class="footer-container">
      
      <div class="footer-brand">
        <img src="/LOGOS/logoSalip.svg" alt="Logo SALIP2" class="footer-logo" />
        <p class="brand-desc">
          O maior evento literário de Pedro II. Cultura, arte, música e conhecimento reunidos em um só lugar.
        </p>
      </div>

      <div class="footer-links">
        <h3>Explorar</h3>
        <ul>
          <li>
            <router-link to="/midiasalipi" class="link-item">
              <img src="/IMG/pales.png" class="footer-icon" alt="Palestras" /> Palestrantes / Shows
            </router-link>
          </li>
          <li>
            <router-link to="/homenageados" class="link-item">
              <img src="/IMG/home.png" class="footer-icon" alt="Homenageados" /> Homenageados
            </router-link>
          </li>
          <li>
            <router-link to="/edicoes" class="link-item">
              <img src="/IMG/edit.png" class="footer-icon" alt="Edições" /> Edições Anteriores
            </router-link>
          </li>
          <li>
            <router-link to="/quemSomos" class="link-item">
              <img src="/IMG/iconSomos.png" class="footer-icon" alt="Quem Somos" /> Quem Somos?
            </router-link>
          </li>
        </ul>
      </div>

      <div class="footer-contact">
        <h3>Conecte-se</h3>
        <ul>
          <li>
            <a href="https://www.instagram.com/salaodolivrodepii/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" class="link-item">
              <img src="/IMG/iconInsta.png" class="footer-icon" alt="Instagram" /> Instagram Oficial
            </a>
          </li>
          <li>
            <a href="https://wa.link/sg68qw" target="_blank" rel="noopener noreferrer" class="link-item">
              <img src="/IMG/iconWhats.png" class="footer-icon" alt="WhatsApp" /> Suporte de Inscrição
            </a>
          </li>
        </ul>
        
        <router-link to="/addUser" class="btn-inscricao">
          <img src="/IMG/iconAdd.png" class="btn-icon" alt="Add" />
          Garantir Inscrição
        </router-link>
      </div>

    </div>

    <div class="footer-bottom">
      <div class="bottom-content">
        <p>© {{ currentYear }} SALIP2 - Salão do Livro de Pedro II. Todos os direitos reservados.</p>
        <p class="dev-credits">
          Desenvolvido por <span> <a href="https://www.instagram.com/kallebemax/">KallebeMax</a></span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Forma mais limpa de pegar o ano atual usando o Composition API
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{
  color: black;
}
.footer {
  width: 100%;
  background: #FDFFFB;
  color: #fdfffb;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  color: black;

}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 3rem;
}

/* --- COLUNA 1: MARCA --- */
.footer-logo {
  width: 180px;
  margin-bottom: 1rem;
  /* Esse filtro deixa a imagem da logo branca (ótimo se a original for preta/escura) */
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.05);
}

.brand-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #d1d5db;
  color: black;

  max-width: 300px;
}

/* --- COLUNAS 2 E 3: LINKS E CONTATO --- */
.footer h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
}

/* Linha decorativa embaixo dos títulos */
.footer h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 40px;
  height: 3px;
  background-color: #00d2ff;
  border-radius: 2px;
}

.footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link-item {
  all: unset;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #d1d5db;
  color: black;

  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-icon {
  height: 1.2rem;
  margin-right: 12px;
  /* Tira a saturação dos ícones pra ficarem brancos/cinzas e combinarem com o tema escuro */
  transition: all 0.3s ease;
  color: black;

}

/* Animação MUITO foda ao passar o mouse */
.link-item:hover {
  color: #ffffff;
  color: black;

  transform: translateX(8px); /* Empurra o link levemente para a direita */
}

.link-item:hover .footer-icon {
  filter: brightness(0) invert(1);
  transform: scale(1.1) rotate(5deg);
}

/* --- BOTÃO DE INSCRIÇÃO --- */
.btn-inscricao {
  all: unset;
  display: inline-flex;
  align-items: center;
  margin-top: 1.5rem;
  background-color: #1d2786;
  color: white;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
}

.btn-icon {
  height: 1.2rem;
  margin-right: 8px;
  filter: brightness(4); /* Deixa o ícone preto/escuro para contrastar com o botão claro */
}

.btn-inscricao:hover {
  background-color: #000000;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
}

/* --- BARRA INFERIOR (COPYRIGHT) --- */
.footer-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #9ca3af;
  color: black;

}

.dev-credits span {
  color: #1d2786;
  font-weight: 600;
}

/* --- RESPONSIVIDADE --- */
@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 600px) {
  .footer-container {
    grid-template-columns: 1fr;
    padding: 3rem 1.5rem;
    text-align: center;
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .link-item {
    justify-content: center;
  }

  .btn-inscricao {
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
  }

  .bottom-content {
    flex-direction: column;
    gap: 0.8rem;
    text-align: center;
  }
}
</style>