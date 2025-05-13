<template>
  <div class="form-wrapper">
    <form @submit="handleSubmit" class="form-container">
      <h2 class="form-title">Inscreva-se</h2>

      <!-- TIPO PARTICIPANTE -->
      <div class="form-group radio-group">
        <label v-for="opcao in opcoesTipo" :key="opcao.valor">
          <input type="radio" :value="opcao.valor" v-model="tipoParticipante" />
          <span>{{ opcao.label }}</span>
        </label>
      </div>

      <!-- CAMPOS BÁSICOS -->
      <div class="form-group">
        <input type="text" v-model="form.nomeCompleto" required placeholder="Nome completo" />
        <input type="text" v-model="form.cidade" required placeholder="Cidade" />
        <input type="text" v-model="form.uf" maxlength="2" required placeholder="UF (ex: PI)" />
        <input type="date" v-model="form.dataNascimento" required />
      </div>

      <!-- CAMPOS CONDICIONAIS -->
      <div class="form-group" v-if="tipoParticipante === 'aluno'">
        <select v-model="form.escola" required>
          <option value="" disabled selected>Selecione sua escola</option>
          <option v-for="escola in escolas" :key="escola" :value="escola">{{ escola }}</option>
        </select>
      </div>

      <div class="form-group" v-if="tipoParticipante === 'funcionario'">
        <input type="text" v-model="form.localTrabalho" required placeholder="Local de trabalho" />
      </div>

      <!-- EVENTO -->
<div class="form-group">
  <select v-model="form.evento" required>
    <option value="" disabled selected>Selecione um evento (opcional)</option>
    <option v-for="evento in eventos" :key="evento.value" :value="evento.value">
      {{ evento.label }}
    </option>
  </select>

  <input v-if="form.evento" type="tel" v-model="form.telefone" required placeholder="Telefone para contato" />

  <!-- exeposicao -->
  <select v-if="form.evento === 'EXPOSIÇÃO FOTOGRÁFICA'" v-model="form.exposicaoSelecionada" required>
    <option value="" disabled selected>Selecione a Exposição</option>
    <option v-for="exposicao in exposicaos" :key="exposicao" :value="exposicao">{{ exposicao }}</option>
  </select>

  <!-- OFICINA -->
  <select v-if="form.evento === 'oficina'" v-model="form.oficinaSelecionada" required>
    <option value="" disabled selected>Selecione a oficina</option>
    <option v-for="oficina in oficinas" :key="oficina" :value="oficina">{{ oficina }}</option>
  </select>
</div>

      <!-- TERMOS -->
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

// Firebase (não precisa mudar, está funcional)
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

// Opções dinâmicas
const opcoesTipo = [
  { valor: 'aluno', label: 'Sou aluno' },
  { valor: 'funcionario', label: 'Sou funcionário' },
  { valor: 'visitante', label: 'Sou visitante' }
]

const escolas = [
  'Escola Municipal Monsenhor Lotário Weber',
  'Escola Municipal João Benício da Silva',
  'Escola Municipal Inês Passos Galvão',
  'Escola Municipal Manoel Nogueira Lima',
  'Escola Municipal José Teixeira Santos',
  'Escola Municipal Gonçalo Medeiros',
  'Escola Municipal Maria Luisa Leite',
  'Escola Municipal Maria Luisa Malaquias',
  'Escola Municipal  Santa Ângela',
  'Escola Municipal Santa Úrsula',
  'Escola Municipal Cipriano Leite',
  'Escola Municipal Maria Gerhard',
  'Escola Municipal  Tia Alice',
  'Escola Municipal Tia Maria de Jesus',
  'CEMEI Walmir Café',
  'Escola Vovó Inácia',
  'Escola Chapeuzinho Vermelho',
  'Escola Tia Conceição Galvão',
  'Escola Municipal Felipe',
  'Escola Municipal Lagoa do Sucuruju',
  'Escola Municipal Domingos Alves',
  'Escola Municipal Tucuns dos Donato',
  'Escola Municipal Tapera dos Vital',
  'Escola Municipal Canto da Várzea',
  'Escola Municipal Escola Municipal Pedro Antonio da Silva',
  'Escola Municipal Expedito Pinheiro da Silva',
  'Escola Municipal Alfredo Pinheiro',
  'Escola Municipal  Prof Manoel Cunha',
  'Escola Municpal Cipó',
  'Coesp',
  'EFASA',
  'Escola Madre Rosa',
  'Escola Angelina Mendes Braga',
  'Escola Solon Brandão',
  'Escola Tertuliano Brandão Filho',
  'Escola Maria  Mendes Mourão',
  'Escola Pedro Soares',
  'EJA Dep Milton Brandão',
  'ASOP',
  'IFIPI Instituto Federal do Piauí',
  'Escola Municipal Gonçalo Domingos de Oliveira',
  'U. E. Maria Isaias de Jesus',
  'U. E. Adalgisa Morais Sousa',
  'U. E. Antonio Isaias de Maria',
  'U. E. Conrado Pereira dos Santos',
  'U. E. Monsenhor Uchoa',
  'U. E. Nossa Senhora Aparecida',
  'U. E. Raimundo Joaquim dos Santos',
  'U. E. Artur Gonçalves de Sousa',
  'Escola Mul Zilda Gonçakves',
  'Escola Mul Pedro Barros',
  'Grupo Esc Regina Gomes',
  'Grupo Esc prof José Raimundo',
  'Grupo Esc Felipe Gomes de Melo',
  'Esc Mul Prof José Soares da Silva',
  'Esc  Mul  Antonio Gomes',
  'Outra',
]

const eventos = [
  { value: 'oficina', label: 'Oficinas' },
  { value: 'EXPOSIÇÃO FOTOGRÁFICA', label: 'EXPOSIÇÃO FOTOGRÁFICA' },
]
const exposicaos = [
  '23/05 - 9h -	Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 10h -	Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 14h30min - Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 16h30min - Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 14h30min - Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 16h30min - Apresentação e Curadoria: Historiador Afonso Celso ',
  '24/05 - 9h - Exposição Fotográfica Reviver Pedro II ',
  '24/05 - 10h - Exposição Fotográfica Reviver Pedro II ',
]

const oficinas = [
  '23/05 - 9h - Oficina de Literatura de Cordel ',
  '23/05 - 9h - Oficina de Fanzine ',
  '24/05 - 9h - Oficina de Literatura de Cordel ',
  '24/05 - 9h - Oficina de Fanzine ',
]

const form = reactive({
  nomeCompleto: '',
  cidade: '',
  uf: '',
  dataNascimento: '',
  escola: '',
  localTrabalho: '',
  evento: '',
  telefone: '',
  oficinaSelecionada: '',
  exposicaoSelecionada: ''
})

// Refs e reactive
const tipoParticipante = ref('aluno')
const aceitaTermos = ref(false)

// Envio
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
    oficinaSelecionada: form.evento === 'oficina' ? form.oficinaSelecionada : null,
    exeposicaoSelecionada: form.evento === 'exposicao' ? form.exeposicaoSelecionada : null,
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