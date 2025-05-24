<template>
  <div class="container">
    <h1 class="title">EDIÇÃO 2025</h1>
    <img src="/IMG/Palestras/palestraCarp/carp9.jpg" alt="Imagem da palestra Carp" class="responsive-image" />
    <ul class="date-list">
      <router-link to="/galeriaSalip222" class="no-style-link"><li>Quinta-Feira | 22/05</li></router-link>
      <router-link to="/" class="no-style-link"><li>Sexta-Feira | 23/05</li></router-link>
      <router-link to="/" class="no-style-link"><li>Sábado | 24/05</li></router-link>
    </ul>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  padding: 1rem 1rem 2rem;
  background-color: #f8f9fb;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(39, 52, 175, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2734af;
  text-align: center;
  margin-bottom: 1.5rem;
  user-select: none;
}

/* Imagem com proporção horizontal */
.responsive-image {
  width: 100%;
  max-width: 800px;
  height: 300px;      /* altura fixa para forçar "horizontal" */
  object-fit: cover;  /* cobre toda área, cortando se necessário */
  border-radius: 6px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.1);
  margin-bottom: 1.5rem;
}

/* Lista com estilo flexível e sem padding padrão */
.date-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.no-style-link {
  text-decoration: none;
  flex: 1 1 30%;
}

.date-list li {
  background-color: #2734af;
  color: #fff;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  user-select: none;
}

.date-list li:hover {
  background-color: #1a258a;
  color: #cbd5f7;
}

/* Responsividade */
@media (max-width: 480px) {
  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
.date-list {
flex-direction: column;
}
  .responsive-image {
    height: 200px; /* diminui altura no mobile */
  }
}
</style>
