<template>
  <div class="container">
    <div class="content">
      <h1 class="title">QUEM SOMOS</h1>
      <p class="paragraph">
        O <strong>SALIPI - Salão do Livro de Pedro II</strong> é um evento literário e cultural que celebra a leitura, a arte e a educação. Fundado em 2010, o evento reúne escritores, artistas, educadores e leitores de todas as idades para uma programação gratuita e inclusiva.
      </p>

      <p class="paragraph">
        A cada edição, o SALIPI promove palestras, oficinas, lançamentos de livros, saraus, contação de histórias, música e muito mais. É uma oportunidade única para vivenciar o poder transformador da literatura em uma das cidades mais encantadoras do Piauí.
      </p>

      <p class="paragraph">
        Com o apoio de instituições públicas e privadas, o Salão do Livro se consolida como um dos maiores encontros literários do interior nordestino. Em Pedro II, a cultura é celebrada em cada página virada.
      </p>

      <p class="highlight">
        Nosso objetivo? Incentivar a leitura, valorizar os autores locais e democratizar o acesso à cultura.
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  background-color: #fdfdfd;
}

.content {
  max-width: 900px;
  font-family: "Inter", sans-serif;
  color: #222;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2734AF;
  text-align: center;
  margin-bottom: 1rem;
}

.paragraph {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  text-align: justify;
}

.highlight {
  background: #e8f0fe;
  border-left: 4px solid #2734AF;
  padding: 1rem;
  font-style: italic;
  font-weight: 500;
  color: #1c1c1e;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .paragraph,
  .highlight {
    font-size: 0.95rem;
  }

  .content {
    padding: 0 0.5rem;
  }
}
</style>
