<template>
  <div class="container">
    <div class="content">
      <h1 class="title">HOMENAGEADOS DO SALIPII</h1>

      <div class="cards">
        <div class="card" v-for="pessoa in homenageados" :key="pessoa.nome">
          <img :src="pessoa.foto" :alt="pessoa.nome" class="foto" />
          <div class="info">
            <h2>{{ pessoa.nome }}</h2>
            <p class="bio">{{ pessoa.descricao }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo }}</p>
            <p class="bio">{{ pessoa.descricao2 }}</p>
            <p class="bio">{{ pessoa.descricao3 }}</p>
            <p class="subTitulo">{{ pessoa.subTitulo2 }}</p>
            <p class="bio">{{ pessoa.descricao4 }}</p>
            <p class="bio">{{ pessoa.descricao5 }}</p>
            <p class="bio">{{ pessoa.descricao6 }}</p>
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
    nome: "JOSÉ LOURENÇO DE ARAÚJO MOURÃO",
    descricao: "NASCEU EM 19 DE OUTUBRO DE 1925, NA CIDADE DE PEDRO II, NO ESTADO DO PIAUÍ (PI).  FORMOU-SE BACHAREL EM DIREITO PELA FACULDADE DE DIREITO DO CEARÁ, EM 8 DE DEZEMBRO DE 1950.CASOU-SE EM FORTALEZA, NO DIA 1º DE SETEMBRO DE 1951, COM NONATA PEREZ NOBRE MOURÃO, NASCIDA EM 23 DE JANEIRO DE 1934, EM FOZ DO ENVIRA, MUNICÍPIO DE FEIJÓ, ESTADO DO ACRE (AC).",
    subTitulo: "TIVERAM CINCO FILHOS:",
    descricao3: "FERNANDA MARIA PEREZ NOBRE MOURÃO, NASCIDA EM TERESINA (PI) EM 15 DE JUNHO DE 1952.PAULO FERNANDO PEREZ NOBRE MOURÃO E DOMINGOS MOURÃO NETO (GÊMEOS), NASCIDOS EM FORTALEZA (CE) EM 29 DE JULHO DE 1953.CLÁUDIA PEREZ MOURÃO, NASCIDA EM FORTALEZA EM 18 DE NOVEMBRO DE 1954.JOSÉ LOURENÇO MOURÃO JÚNIOR, NASCIDO EM BRASÍLIA (DISTRITO FEDERAL - DF) EM 29 DE JUNHO DE 1963.EXERCEU O CARGO DE DEPUTADO ESTADUAL PELO ESTADO DO PIAUÍ (PI), NOPERÍODO DE: 1952 a 1955 - 1955 a 1960.",
    subTitulo2: "DÉCADA DE 1960",
    descricao4: "TRANSFERIDO DO TERRITÓRIO FEDERAL DO ACRE (AC) PARA O MINISTÉRIO PÚBLICO DO DISTRITO FEDERAL E TERRITÓRIOS (MPDFT), SENDO UM DOS SEIS MEMBROS PIONEIROS DO ÓRGÃO.",
    frase: "A leitura é a ponte que liga o sonho à realidade.",
    foto: "/IMG/pessoa1.jpg"
  },
  {
    nome: "WILLIAM PALHA DIAS",
    descricao: "WILLIAM PALHA DIAS NASCEU EM CARACOL - PIAUÍ, EM 17 DE SETEMBRO DE 1918. TEVE INTERESSE PELA LEITURA AINDA JOVEM. SEU PAI ERA MÉDICO E SUA MÃE LEONOR PALHA DIAS FALECEU QUANDO WILLIAM TINHA APENAS 3 ANOS DE IDADE. MOROU EM CARACOL ATÉ OS 20 ANOS, ATÉ SAIR PARA ESTUDAR NA CAPITAL TERESINA. DURANTE MUITOS ANOS NA CAPITAL TRABALHOU NO DEPARTAMENTO DE RODAGEM DO PIAUÍ COMO ASSESSOR TÉCNICO.",
    descricao2: "SE FORMOU EM DIREITO COM 41 ANOS E ATUOU COMO ADVOGADO MILITANTE ANTES DE TORNAR-SE JUIZ.",
    descricao3: "EM 1951 CASOU-SE COM A PROFESSORA MARIA DAS GRAÇAS E SILVA PALHA DIAS (QUAL ESCREVERA DOIS LIVROS DIDÁTICOS EM PARCERIA). NESSE PERÍODO TRABALHOU EM CIDADES DO INTERIOR DE PIAUÍ, TAIS   COMO REGENERAÇÃO, OEIRAS, CASTELO DO PIAUÍ, PEDRO II E PICOS, ONDE SE APOSENTOU. NA ÉPOCA, ERA OBRIGADO COMO JUIZ A ENSINAR EDUCAÇÃO MORAL E CÍVICA EM ESCOLAS.",
    descricao4: "CIDADÃO HONORÁRIO DAS CIDADES DE CRISTINO CASTRO, PEDRO II, REGENERAÇÃO E TERESINA.",
    descricao5: "VOLTA A MORAR EM TERESINA DEPOIS QUE SE APOSENTA, PORÉM NUNCA PERDERA A LIGAÇÃO COM SUA CIDADE NATAL, CARACOL, QUE FORA FUNDADA PELO SEU AVÔ, E SEMPRE RETORNAVA A CIDADE PARA VISITAR FAMILIARES.",
    descricao6: "JÁ APOSENTADO, USAVA SEU TEMPO PARA ESCREVER, ESCREVEU PARA JORNAIS E AJUDOU A FUNDAR A ANTIGA ASSOCIAÇÃO PROFISSIONAL DE JORNALISTAS DO PIAUÍ, QUE POSTERIORMENTE FORA TRANSFORMADA EM UM SINDICATO DE CLASSE.",
    frase: "A palavra é minha arma, e a cultura, minha trincheira.",
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
