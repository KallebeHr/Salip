<template>
  <div class="container">
    <header>
      <div class="data">
        <h2>22 a 24 | Maio</h2>
        <p>Locais abaixo.</p>
      </div>
      <div class="title">
        <h1>INSCRIÇÕES</h1>
        <h1>ABERTAS</h1>
      </div>
    </header>

    <p class="description">
      Participar dos eventos do SALIP2 é simples, rápido e gratuito.<br />
      Clique no botão abaixo e garanta sua vaga nas palestras, oficinas<br />
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

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  background-color: #f8f9fb;
  color: #222;
  font-family: 'Inter', sans-serif;
  text-align: center;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
}

.data h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2734af;
  margin: 0;
  letter-spacing: 1px;
}

.data p {
  font-size: 0.95rem;
  margin: 0;
  color: #666;
}

.title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #1c1c1e;
  letter-spacing: 2px;
  line-height: 1.2;
}

.description {
  font-size: 1.05rem;
  max-width: 720px;
  line-height: 1.7;
  color: #444;
  margin-bottom: 2.5rem;
}

.btn-link {
  text-decoration: none;
}

.pAdd {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  color: #2734af;
  border: 2px solid #2734af;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.pAdd:hover {
  background-color: #2734af10;
  transform: scale(1.04);
  box-shadow: 0 6px 16px rgba(39, 52, 175, 0.2);
}

.icons {
  height: 1.1rem;
}

@media (min-width: 768px) {
  header {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 1000px;
  }

  .title h1 {
    font-size: 3rem;
    text-align: right;
  }

  .data {
    text-align: left;
  }

  .description {
    font-size: 1.1rem;
  }
}
</style>
