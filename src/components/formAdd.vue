<template>
    <div class="container">
        <header>
            <h1>Inscreva-se</h1>
        </header>
      <section class="section_form">
        <form id="consultation-form" class="feed-form" action="#">
  
          <!-- ✅ OPÇÕES NO TOPO -->
          <div class="checkboxes">
            <!-- SOU ALUNO -->
            <div class="checkbox-item">
              <input
                type="radio"
                id="radio-aluno"
                value="aluno"
                v-model="tipoParticipante"
                style="display: none;" />
              <label for="radio-aluno" class="check"> Sou aluno
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1 9c0-5 3-8 8-8s8 3 8 8-3 8-8 8-8-3-8-8z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </div>
  
            <!-- SOU FUNCIONÁRIO -->
            <div class="checkbox-item">
              <input
                type="radio"
                id="radio-func"
                value="funcionario"
                v-model="tipoParticipante"
                style="display: none;" />
              <label for="radio-func" class="check"> Sou funcionário
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1 9c0-5 3-8 8-8s8 3 8 8-3 8-8 8-8-3-8-8z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </div>
  
            <!-- SOU VISITANTE -->
            <div class="checkbox-item">
              <input
                type="radio"
                id="radio-visit"
                value="visitante"
                v-model="tipoParticipante"
                style="display: none;" />
              <label for="radio-visit" class="check"> Sou visitante
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M1 9c0-5 3-8 8-8s8 3 8 8-3 8-8 8-8-3-8-8z"></path>
                  <polyline points="1 9 7 14 15 4"></polyline>
                </svg>
              </label>
            </div>
          </div>
  
          <!-- 🧩 CAMPOS EM 2 COLUNAS -->
          <div class="form-grid">
            <!-- COLUNA ESQUERDA -->
            <div class="form-col">
              <input required placeholder="Nome completo" type="text" name="nomeCompleto" />
              <input required placeholder="CPF" type="text" name="cpf" maxlength="14" />
              <input required placeholder="Telefone" type="tel" name="telefone" />
              <input required placeholder="Cidade" type="text" name="cidade" />
              <input required placeholder="UF (ex: PI)" type="text" name="uf" maxlength="2" />
            </div>
  
            <!-- COLUNA DIREITA -->
            <div class="form-col">
              <input required type="date" name="dataNascimento" placeholder="Data de nascimento" />
  
              <select required name="sexo">
                <option value="" disabled selected>Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Prefere não informar">Prefere não informar</option>
              </select>
  
              <!-- ESCOLA (ALUNO) -->
              <select v-if="tipoParticipante === 'aluno'" required name="escola">
                <option value="" disabled selected>Selecione sua escola</option>
                <option value="Escola Estadual João XXIII">Escola Estadual João XXIII</option>
                <option value="Colégio São José">Colégio São José</option>
                <option value="Instituto Federal - IFPI">Instituto Federal - IFPI</option>
                <option value="Escola Municipal Luz do Saber">Escola Municipal Luz do Saber</option>
              </select>
  
              <!-- TRABALHO (FUNCIONÁRIO) -->
              <input
                v-if="tipoParticipante === 'funcionario'"
                required
                type="text"
                name="localTrabalho"
                placeholder="Local de trabalho" />
  
              <!-- E-MAIL -->
              <input name="email" required placeholder="E-mail" type="email" />
            </div>
          </div>
  
          <button class="button_submit">INSCREVER</button>
        </form>
      </section>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue'
  
  // Valor padrão é aluno
  const tipoParticipante = ref('aluno')
  </script>
  
  <!-- Estilos mantidos exatamente iguais -->
  <style scoped>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: auto;
    padding: 20px;
  }
  
  .feed-form {
    margin-top: 36px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 740px;
  }
  
  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-col {
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .form-grid {
      flex-direction: row;
      justify-content: space-between;
    }
  
    .form-col {
      width: 48%;
    }
  }
  
  .feed-form input,
  .feed-form select {
    height: 50px;
    border-radius: 5px;
    background: white;
    margin-bottom: 14px;
    border: 1px solid #ccc;
    padding: 0 16px;
    font-weight: 300;
    font-size: 14px;
    color: #4B4B4B;
    transition: 0.2s ease;
  }
  
  .feed-form input:focus,
  .feed-form select:focus {
    outline: none;
    border-color: #a3e583;
    box-shadow: 0 0 0 2px rgba(163, 229, 131, 0.2);
  }
  
  .checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-start;
    margin-bottom: 14px;
  }
  
  .checkbox-item {
    display: flex;
    align-items: center;
  }
  
  .check {
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
    font-size: 14px;
  }
  
  .check:before {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(34, 50, 84, 0.03);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.5;
    transition: all 0.2s ease;
  }
  
  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
  }
  
  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
  }
  
  .check:hover:before {
    opacity: 1;
  }
  
  .check:hover svg {
    stroke: var(--accent-color, #a3e583);
  }
  
  input[type="radio"]:checked + .check svg {
    stroke: var(--accent-color, #a3e583);
  }
  
  input[type="radio"]:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }
  
  input[type="radio"]:checked + .check svg polyline {
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
  }
  
  .button_submit {
    width: 100%;
    height: 54px;
    font-size: 14px;
    color: white;
    background: red;
    border-radius: 5px;
    border: none;
    font-weight: 500;
    text-transform: uppercase;
    margin-top: 10px;
    transition: 0.2s ease;
  }
  
  .button_submit:hover {
    transform: scale(1.01);
    box-shadow: 0px 0px 5px 0px #212529;
    background: #cc0000;
  }
  </style>
  