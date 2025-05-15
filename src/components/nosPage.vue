<template>
  <div class="container">
    <div class="content">
      <h1 class="title">QUEM SOMOS?</h1>
      <p class="paragraph">
        O <strong>SALIP2 - Salão do Livro de Pedro II</strong> 
        é um evento literário e cultural que celebra a leitura e a educação.
      </p>

      <p class="paragraph">
        Em Pedro II, o evento tem origem em 2002, com o projeto "Cara alegre do Piauí", que reuniu artistas e intelectuais em nossa cidade e plantou a semente deste salão. O desafio lançado pelo professor Cineas Santos naquele momento foi abraçado anos depois, e assim nasceu a primeira edição do salip2 em 2016, homenageando o escritor Ernâni Getirana.
      </p>

      <p class="paragraph">
      
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
