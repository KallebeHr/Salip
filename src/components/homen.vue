<template>
  <div class="container">
    <div class="content">
      <h1 class="title">HOMENAGEADOS DO SALIPI</h1>

      <div class="cards">
        <div class="card" v-for="pessoa in homenageados" :key="pessoa.nome">
          <img :src="pessoa.foto" :alt="pessoa.nome" class="foto" />
          <div class="info">
            <h2>{{ pessoa.nome }}</h2>
            <p class="bio">{{ pessoa.descricao }}</p>
            <blockquote>“{{ pessoa.frase }}”</blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const homenageados = [
  {
    nome: "Maria das Letras",
    descricao: "Professora e escritora piauiense, autora de mais de 20 livros infantis premiados no Brasil.",
    frase: "A leitura é a ponte que liga o sonho à realidade.",
    foto: "/IMG/pessoa1.jpg"
  },
  {
    nome: "José Raimundo Filho",
    descricao: "Jornalista e ativista cultural. Coordenou projetos de incentivo à leitura em comunidades rurais.",
    frase: "A palavra é minha arma, e a cultura, minha trincheira.",
    foto: "/IMG/pessoa2.jpg"
  },
  {
    nome: "Dona Zefinha",
    descricao: "Ícone da tradição oral nordestina, encantando gerações com histórias de sabedoria popular.",
    frase: "Quem ouve histórias, aprende a escutar a vida.",
    foto: "/IMG/pessoa3.jpg"
  },
  {
    nome: "Francisco Nogueira",
    descricao: "Poeta cordelista, educador e defensor da cultura sertaneja no interior do Piauí.",
    frase: "O sertão cabe num livro quando a alma cabe num verso.",
    foto: "/IMG/pessoa4.jpg"
  },
 {
    nome: "Dona Zefinha",
    descricao: "Ícone da tradição oral nordestina, encantando gerações com histórias de sabedoria popular.",
    frase: "Quem ouve histórias, aprende a escutar a vida.",
    foto: "/IMG/pessoa3.jpg"
  },
  {
    nome: "Maria das Letras",
    descricao: "Professora e escritora piauiense, autora de mais de 20 livros infantis premiados no Brasil.",
    frase: "A leitura é a ponte que liga o sonho à realidade.",
    foto: "/IMG/pessoa1.jpg"
  }
]
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  background-color: #fefefe;
}

.content {
  max-width: 1100px;
  width: 100%;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2734AF;
  text-align: center;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.foto {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

.info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.card h2 {
  font-size: 1.2rem;
  color: #2734AF;
}

.bio {
  font-size: 0.95rem;
  color: #444;
  text-align: justify;
}

blockquote {
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
  color: #555;
  border-left: 3px solid #2734AF;
  padding-left: 0.8rem;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }

  .title {
    font-size: 1.8rem;
  }

  .foto {
    height: 350px;
  }
}
</style>
