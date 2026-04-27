<template>
  <div class="certificado-container">
    <div class="certificado-card">
      <div class="icon-wrapper">
        <span class="mdi mdi-certificate-outline"></span>
        <div class="icon-shimmer"></div>
      </div>

      <h1 class="titulo">Certificados Indisponíveis</h1>
      <p class="descricao">
        A seção de <strong>Gerar Certificado</strong> só estará disponível e funcionará após a finalização de todo o evento. 
        Agradecemos a sua participação e compreensão!
      </p>

      <router-link to="/" class="btn-voltar">
        <span class="mdi mdi-arrow-left"></span>
        VOLTAR AO INÍCIO
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Nenhuma lógica complexa é necessária aqui, mas o script setup está pronto 
// caso você precise adicionar chamadas de API ou verificação de datas no futuro.
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css');
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&display=swap');

.certificado-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 90px); /* Subtrai a altura do seu header */
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f7f9ff 0%, #ffffff 100%);
  font-family: 'Josefin Sans', sans-serif;
}

.certificado-card {
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 
    0 20px 60px rgba(39, 52, 175, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(39, 52, 175, 0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Linha decorativa no topo do card (mesmo estilo do header) */
.certificado-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #c8a85a 0%, #e2c87a 50%, #c8a85a 100%);
}

.icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #c8a85a, #e2c87a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 12px 24px rgba(200, 168, 90, 0.3);
  animation: float 4s ease-in-out infinite;
  overflow: hidden;
}

.icon-wrapper .mdi {
  font-size: 2.5rem;
  color: white;
  z-index: 2;
}

.icon-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%);
  transform: translateX(-150%);
  animation: shimmer 3s infinite;
  z-index: 1;
}

.titulo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2734af;
  margin: 0 0 16px 0;
  letter-spacing: 0.05em;
}

.descricao {
  font-size: 1rem;
  font-weight: 400;
  color: #8892b0;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.descricao strong {
  color: #1a1a2e;
  font-weight: 600;
}

/* Botão utilizando o mesmo estilo CTA do seu header */
.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #2734af 0%, #3d4fd1 100%);
  color: white !important;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  box-shadow: 0 4px 14px rgba(39, 52, 175, 0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  cursor: pointer;
}

.btn-voltar .mdi {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.btn-voltar:hover {
  background: linear-gradient(135deg, #3d4fd1 0%, #5468e7 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(39, 52, 175, 0.45);
}

.btn-voltar:hover .mdi {
  transform: translateX(-4px);
}

/* Animações */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

@keyframes shimmer {
  0% { transform: translateX(-150%); }
  50% { transform: translateX(150%); }
  100% { transform: translateX(150%); }
}

/* Responsividade */
@media (max-width: 600px) {
  .certificado-card {
    padding: 32px 20px;
  }
  
  .titulo {
    font-size: 1.25rem;
  }
  
  .descricao {
    font-size: 0.9rem;
  }
}
</style>