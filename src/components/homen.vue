<template>
  <div class="container">
    <div class="content">
      <h1 class="title">HOMENAGEADOS SALIP2 / 2025</h1>

      <div class="cards">
        <div class="card" v-for="pessoa in homenageados" :key="pessoa.nome">
          <img :src="pessoa.foto" :alt="pessoa.nome" class="foto" />
          <div class="info">
            <h2>{{ pessoa.nome }}</h2>
            <p class="bio">{{ pessoa.descricao }}</p>
            <p class="bio">{{ pessoa.descricao2 }}</p>
            <p class="bio">{{ pessoa.descricao3 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo }}</p>
            <p class="bio">{{ pessoa.descricao4 }}</p>
            <p class="bio">{{ pessoa.descricao5 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo2 }}</p>
            <p class="bio">{{ pessoa.descricao6 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo3 }}</p>
            <p class="bio">{{ pessoa.descricao7 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo4 }}</p>
            <p class="bio">{{ pessoa.descricao8 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo5 }}</p>
            <p class="bio">{{ pessoa.descricao9 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo6 }}</p>
            <p class="bio">{{ pessoa.descricao10 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo7 }}</p>
            <p class="bio">{{ pessoa.descricao11 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo8 }}</p>
            <p class="bio">{{ pessoa.descricao12 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo9 }}</p>
            <p class="bio">{{ pessoa.descricao13 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const homenageados = [
  {
    nome: "JOSÉ LOURENÇO DE ARAÚJO MOURÃO",
    descricao: "Nasceu em 19 de outubro de 1925, na cidade de Pedro II, no estado do Piauí.",
    descricao2: "Formou-se em Direito pela Faculdade de Direito do Ceará, em 8 de dezembro de 1950.",
    descricao3: "Casou-se em Fortaleza, no dia 1º de setembro de 1951, com Nonata Perez Nobre Mourão, nascida no estado do Acre.",
    subTitulo: "Tiveram cinco filhos:",
    descricao4: "Fernanda Maria Perez Nobre Mourão, nascida em Teresina; Paulo Fernando Perez Nobre Mourão e Domingos Mourão Neto (gêmeos), nascidos em Fortaleza; Cláudia Perez Mourão, nascida em Fortaleza; José Lourenço Mourão Júnior, nascido em Brasília.",
    descricao5: "Exerceu o cargo de deputado estadual pelo estado do Piauí (PI), no período de 1954 a 1958.",
    subTitulo2: "Década de 1960",
    descricao6: "Transferido do território federal do Acre para o Ministério Público do Distrito Federal e Territórios (MPDFT), sendo um dos seis membros pioneiros do órgão.",
    subTitulo3: "Atuou nas seguintes funções:",
    descricao7: "Vara de Registro Civil das Pessoas Naturais: 1960, 1961; Vara Criminal do TJDF: 1962; Varas da Fazenda Pública e Cível do TJDF: 1963; Chefia de Gabinete da Procuradoria-Geral de Justiça do MPDFT: 1964–1967.",
    subTitulo4: "Atuação em turmas do TJDF:",
    descricao8: "Secretário de Relações Públicas da Associação dos Membros do MPDFT: 1965–1967, 1967–1969; Esteve à disposição do governo do estado do Piauí para chefiar a Secretaria de Planejamento e Coordenação Econômica: 1967; Continuou na Curadoria de Menores: 1971–1972; Assessor Legislativo do TJDF: 1970; Subprocurador-Geral de Justiça do MPDFT: 1974, 1979–1980; Presidente da MPDFT: 1975–1977.",
    subTitulo5: "Atuação em turma cível do TJDF:",
    descricao9: "Gabinete da Procuradoria-Geral de Justiça do MPDFT: 1981; Conselheiro do Conselho Superior do MPDFT: 1984–1986; Corregedor-Geral do MPDFT: 1991–1992; Conselho da Magistratura do TJDF: 1994.",
    subTitulo6: "Aposentadoria e falecimento",
    descricao10: "Aposentou-se em 10 de março de 1995. Faleceu em Pedro II (PI), no dia 25 de outubro de 1997.",
    subTitulo7: "Homenagem",
    descricao11: "Dr. José Lourenço Mourão, se Deus não o tivesse levado tão subitamente do nosso convívio, estaria completando um século de vida e nos dando o privilégio do seu extremado afeto e da sua imensurável bondade espiritual.",
    foto: "/IMG/pessoa1.jpg"
  },
    {
    nome: "William Palha Dias",
    descricao: "William Palha Dias nasceu em Caracol - Piauí, em 17 de setembro de 1918. Morou em Caracol até os 20 anos, até sair para estudar em Teresina. Durante muitos anos na capital.",
    descricao2: "Formou-se em Direito aos 41 anos e atuou como advogado militante antes de tornar-se juiz.",
    descricao3: "Em 1951 casou-se com a professora Maria das Graças e Silva Palha Dias. Nesse período trabalhou em cidades do interior de Piauí, tais   como Regeneração, Oeiras, Castelo do Piauí,Pedro II e Picos, onde se aposentou.",
    descricao4: "Cidadão honorário das cidades de Cristino Castro, Pedro II, Regeneração e Teresina.",
    descricao5: "Volta a morar em Teresina depois que se aposenta, porém nunca perdera a ligação com sua cidade natal, caracol, que fora fundada pelo seu avô, e sempre retornava a cidade para visitar familiares.",
    descricao6: "Já aposentado, usava seu tempo para escrever, escreveu para jornais e ajudou a fundar a antiga associação profissional de jornalistas do Piauí, que posteriormente fora transformada em um sindicato de classe.",
    descricao7: "Escreveu diversas obras de diversos gêneros literários, desde romances de fundo histórico-sociológico até documentário, crônicas e memórias. Dessas obras destacam-se o Caracol na história do Piauí (1959); flagrantes do quotidiano (1998) e os irmãos quixaba (1979) que, adotado pelos vestibulares do Piauí, ganhou adaptação para o cinema em 2004. Como escritor foi membro da academia piauiense de letras. No total, William Palha Dias tinha 19 obras publicadas.",
    descricao8: "Além da Academia Piauiense de Letras, o escritor fazia parte do Instituto Histórico e Geográfico do Piauí, Instituto Histórico de Oeiras e a União Brasileira de Escritores do Piauí.",
    descricao9: "O escritor faleceu em Teresina, no dia 14 de fevereiro de 2012, aos 93 anos.",
    foto: "/IMG/pessoa2.jpg"
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
  max-width: 1600px;
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
.subTitulo{
  font-size: 1.2rem;
  color: #2734AF;
}
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 500px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.foto {
  width: 100%;
  height: 450px;
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
