<template>
  <div class="container">
    <header>
      <div class="data">
        <h2>13 a 16 | Maio</h2>
        <p>Espaço Cláudia Eventos</p>
      </div>
      <div class="title">
        <h1>INSCRIÇÕES</h1>
        <h1>ABERTAS</h1>
      </div>
    </header>

    <p class="description">
      Participar dos eventos do SALIP2 é simples, rápido e gratuito!  
      Clique no botão abaixo e garanta sua vaga nas palestras, oficinas, mesas-redondas  
      e demais atrações do Salão do Livro de Pedro II.
    </p>

    <a href="/addUser" class="btn-link">
      <p class="pAdd">
        <img src="/IMG/iconAdd.png" class="icons" alt="Icone de Inscrição" />
        FAZER INSCRIÇÃO
      </p>
    </a>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background-color: #fdfffb;
  color: black;
  font-family: "Roboto", sans-serif;
  text-align: center;
}

/* HEADER */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

header .data h2 {
  font-size: 1.6rem;
  color: #2734AF;
  margin: 0;
}

header .data p {
  font-size: 1rem;
  margin: 0;
  color: #666;
}

.title  .titles {
  font-size: 20rem;
  line-height: 1.1;
  color: #111;
  margin: 0;
}

/* DESCRIÇÃO */
.description {
  font-size: 1.1rem;
  max-width: 700px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 2rem;
}

/* BOTÃO */
.btn-link {
  text-decoration: none;
}

.pAdd {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  font-weight: bold;
  font-size: 1rem;
  color: #2734AF;
  border: 2px solid #2734AF;
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: transparent;
}

.pAdd:hover {
  background-color: #2734af10;
  transform: scale(1.03);
}

.icons {
  height: 1.2rem;
}

/* RESPONSIVO */
@media (min-width: 768px) {
  header {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 2rem;
  }

  header .title h1 {
    font-size: 2.5rem;
  }

  header .data {
    text-align: left;
  }
}
</style>
