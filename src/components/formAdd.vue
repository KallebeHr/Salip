<template>
  <div class="form-wrapper">
    <form @submit="handleSubmit" class="form-container">
      <h2 class="form-title">Inscreva-se</h2>

      <div class="form-group radio-group">
        <label>
          <input type="radio" value="aluno" v-model="tipoParticipante" />
          <span>Sou aluno</span>
        </label>
        <label>
          <input type="radio" value="funcionario" v-model="tipoParticipante" />
          <span>Sou funcionário</span>
        </label>
        <label>
          <input type="radio" value="visitante" v-model="tipoParticipante" />
          <span>Sou visitante</span>
        </label>
      </div>

      <div class="form-group">
        <input type="text" v-model="form.nomeCompleto" required placeholder="Nome completo" />
        <input type="text" v-model="form.cidade" required placeholder="Cidade" />
        <input type="text" v-model="form.uf" maxlength="2" required placeholder="UF (ex: PI)" />
        <input type="date" v-model="form.dataNascimento" required />
      </div>

      <div class="form-group" v-if="tipoParticipante === 'aluno'">
        <select v-model="form.escola" required>
          <option value="" disabled selected>Selecione sua escola</option>
          <option value="Escola Estadual João XXIII">Escola Estadual João XXIII</option>
          <option value="Colégio São José">Colégio São José</option>
          <option value="Instituto Federal - IFPI">Instituto Federal - IFPI</option>
          <option value="Escola Municipal Luz do Saber">Escola Municipal Luz do Saber</option>
        </select>
      </div>

      <div class="form-group" v-if="tipoParticipante === 'funcionario'">
        <input type="text" v-model="form.localTrabalho" required placeholder="Local de trabalho" />
      </div>

      <!-- NOVO CAMPO: EVENTO -->
      <div class="form-group">
        <select v-model="form.evento">
          <option value="" disabled selected>Selecione um evento (opcional)</option>
          <option value="Oficina de Escrita Criativa">Oficina de Escrita Criativa</option>
          <option value="Roda de Conversa com Ilustradores">Roda de Conversa com Ilustradores</option>
          <option value="Mesa Redonda: Literatura e o Nordeste">Mesa Redonda: Literatura e o Nordeste</option>
          <option value="Contação de Histórias para Crianças">Contação de Histórias para Crianças</option>
          <option value="Lançamento de Livros Independentes">Lançamento de Livros Independentes</option>
          <option value="Sarau Poético com Música ao Vivo">Sarau Poético com Música ao Vivo</option>
          <option value="Encontro com Autores Infantojuvenis">Encontro com Autores Infantojuvenis</option>
          <option value="palestra">Palestra</option>
        </select>

        <input v-if="form.evento" type="tel" v-model="form.telefone" required placeholder="Telefone para contato" />

        <select v-if="form.evento === 'palestra'" v-model="form.palestraSelecionada" required>
          <option value="" disabled selected>Selecione a palestra</option>
          <option value="14/08 - 11h - A Leitura na Era Digital">14/08 - 11h - A Leitura na Era Digital</option>
          <option value="10/08 - 14h - Escrita Criativa para Jovens">10/08 - 14h - Escrita Criativa para Jovens</option>
          <option value="12/08 - 09h - Literatura e Inclusão">12/08 - 09h - Literatura e Inclusão</option>
        </select>
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="aceitaTermos" required />
          <span>Li e aceito os termos da inscrição</span>
        </label>
      </div>

      <button type="submit" class="form-button">Enviar inscrição</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBtHvQv2ePdKzE8tVfWbADQ-Codvtu9g1E",
  authDomain: "salip-d76d3.firebaseapp.com",
  projectId: "salip-d76d3",
  storageBucket: "salip-d76d3.appspot.com",
  messagingSenderId: "237055139750",
  appId: "1:237055139750:web:4c186ea506d846c60cb967",
  measurementId: "G-DR97X44WB5"
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const tipoParticipante = ref('aluno')
const aceitaTermos = ref(false)

const form = reactive({
  nomeCompleto: '',
  cidade: '',
  uf: '',
  dataNascimento: '',
  escola: '',
  localTrabalho: '',
  evento: '',
  telefone: '',
  palestraSelecionada: ''
})

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!aceitaTermos.value) {
    alert("Você precisa aceitar os termos para continuar.")
    return
  }

  const dados = {
    tipoParticipante: tipoParticipante.value,
    nomeCompleto: form.nomeCompleto,
    cidade: form.cidade,
    uf: form.uf,
    dataNascimento: form.dataNascimento,
    escola: tipoParticipante.value === 'aluno' ? form.escola : null,
    localTrabalho: tipoParticipante.value === 'funcionario' ? form.localTrabalho : null,
    evento: form.evento || null,
    telefone: form.evento ? form.telefone : null,
    palestraSelecionada: form.evento === 'palestra' ? form.palestraSelecionada : null,
    timestamp: new Date()
  }

  try {
    await addDoc(collection(db, 'inscricoes'), dados)

    tipoParticipante.value = 'aluno'
    aceitaTermos.value = false
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })

    alert('Inscrição enviada com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar inscrição:', error)
    alert('Erro ao enviar inscrição. Tente novamente.')
  }
}
</script>
2
<style scoped>
    .form-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 1.5rem;
      min-height: 100vh;
    }
    
    .form-container {
      width: 100%;
      max-width: 520px;
        background-color: #f8f9fb;
      padding: 3rem 2rem;
      border-radius: 14px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
      font-family: 'Inter', sans-serif;
      color: #1c1c1e;
    }
    
    .form-title {
      font-size: 1.75rem;
      text-align: center;
      font-weight: 600;
      margin-bottom: 2.5rem;
      color: #2b2b2e;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    
    .form-group input,
    .form-group select {
      padding: 0.85rem 1.2rem;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      font-size: 1rem;
      background-color: #fefefe;
      transition: 0.2s ease;
      color: #333;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      border-color: #4caf50;
      outline: none;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.15);
    }
    
    .radio-group {
      flex-direction: row;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .radio-group label,
    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      color: #333;
    }
    
    .radio-group input[type="radio"],
    .checkbox-group input[type="checkbox"] {
      accent-color: #4caf50;
    }
    
    .form-button {
      width: 100%;
      padding: 0.9rem;
      font-size: 1rem;
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s ease-in-out;
    }
    
    .form-button:hover {
      background-color: #43a047;
      box-shadow: 0 4px 14px rgba(76, 175, 80, 0.2);
    }
    
    @media (max-width: 480px) {
      .radio-group {
        flex-direction: column;
        gap: 1rem;
      }
    
      .form-container {
        padding: 2rem 1.5rem;
      }
    
      .form-title {
        font-size: 1.5rem;
      }
    }
    </style>