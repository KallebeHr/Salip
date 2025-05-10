<template>
    <div class="container">
      <header>
        <div class="data">
          <h2>13 a 16 | Maio</h2>
          <p>Espaço claudia eventos</p>
        </div>
        <div class="title">
          <h1>INSCRIÇÕES</h1>
          <h1> ABERTAS</h1>
        </div>
      </header>
      <p>
        Participar dos eventos do SALIP2 é simples, rápido e gratuito! clique no botão abaixo 
        e garanta sua vaga nas palestras, oficinas, mesas-redondas e demais atrações do 
        Salão do Livro de Pedro II.
      </p>
      <a href="/addUser"><p class="pAdd"> <img src="/IMG/iconAdd.png" class="icons" alt="InstagramIcon"> FAZER INSCRIÇÃO</p></a>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    font-family: "Roboto", sans-serif;
    text-align: center;
    background-color: #fdfffb;
    color: black;
    }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    font-size: 1.1rem;
    max-width: 700px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 2rem;
  }
  .pAdd{
    display: flex;
        align-items: center;
        border-bottom: solid 1px #2734AF;
        margin: 5px;
        padding: 7px;
        border-radius: 10px;
        width: 14rem;
        cursor: pointer;
    }
    .icons{
        height: 1.2rem;
        margin-right: 10px;

    }
    .pAdd:hover{
        border-bottom: solid 2px #2734AF;
        background-color: #2735af5b;
    }
    header{
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
    }
    header .title{
      padding: 0;
      margin: 0;
    }
  </style>
  