<template>
  <div class="form-wrapper">
    <form class="form-container">
      <h2 class="form-title">Inscreva-se</h2>

      <div class="form-group radio-group">
        <label v-for="opcao in opcoesTipo" :key="opcao.valor">
          <input type="radio" :value="opcao.valor" v-model="tipoParticipante" />
          <span>{{ opcao.label }}</span>
        </label>
      </div>

      <div class="form-group">
        <input type="text" v-model="form.nomeCompleto" placeholder="Nome completo" />
        <input type="text" v-model="form.cidade" placeholder="Cidade" />
        <input type="text" v-model="form.uf" maxlength="2" placeholder="UF (ex: PI)" />
        <label for="date">Data de Nascimento <input type="date" v-model="form.dataNascimento" /></label>
        
      </div>

      <div class="form-group" v-if="tipoParticipante === 'aluno'">
        <select v-model="form.escola">
          <option value="" disabled>Selecione sua escola</option>
          <option v-for="escola in escolas" :key="escola" :value="escola">{{ escola }}</option>
        </select>
      </div>

      <div class="form-group" v-if="tipoParticipante === 'funcionario'">
        <input type="text" v-model="form.localTrabalho" placeholder="Local de trabalho" />
      </div>

      <div class="form-group">
        <select v-model="form.evento">
          <option value="" disabled>Selecione um evento (opcional)</option>
          <option v-for="evento in eventos" :key="evento.value" :value="evento.value">
            {{ evento.label }}
          </option>
        </select>
        <input
          v-if="form.evento"
          type="tel"
          v-model="form.telefone"
          placeholder="Telefone para contato"
        />
        <select
          v-if="form.evento === 'EXPOSIÇÃO FOTOGRÁFICA'"
          v-model="form.exposicaoSelecionada"
        >
          <option value="" disabled>Selecione a Exposição</option>
          <option v-for="exposicao in exposicaos" :key="exposicao" :value="exposicao">
            {{ exposicao }}
          </option>
        </select>
        <select
          v-if="form.evento === 'oficina'"
          v-model="form.oficinaSelecionada"
        >
          <option value="" disabled>Selecione a oficina</option>
          <option v-for="oficina in oficinas" :key="oficina" :value="oficina">
            {{ oficina }}
          </option> 
        </select>
<div v-if="form.evento === 'palestra'">
  <div
    v-for="(palestra, index) in palestrasSelecionadas"
    :key="index"
    class="form-group"
  >
    <select v-model="palestrasSelecionadas[index]">
      <option value="" disabled>Selecione a Palestra</option>
      <option v-for="op in palestras" :key="op" :value="op">
        {{ op }}
      </option>
    </select>
  </div>

  <button
    type="button"
    @click="palestrasSelecionadas.push('')"
    class="form-button"
  >
    + Adicionar outra palestra
  </button>
</div>

      </div>

<div class="form-group checkbox-group" style="display: flex; align-items: center; gap: 8px;">
  <input type="checkbox" id="termos" v-model="aceitaTermosDialog" />
  <label for="termos">
    Li e aceito os 
    <span
      style="color: #1976d2; text-decoration: underline; cursor: pointer;"
      @click="mostrarTermos = true"
    >
      termos da inscrição
    </span>
  </label>
</div>

<v-dialog v-model="mostrarTermos" max-width="600">
  <v-card title="TERMOS DE USO E POLÍTICA DE PRIVACIDADE – SALIP2">
<v-card-text style="white-space: pre-line; max-height: 400px; overflow-y: auto;">
  {{ textoTermos }}
</v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text="Fechar" @click="mostrarTermos = false" color="primary"></v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


      <button
        type="button"
        class="form-button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        {{ isSubmitting ? 'Enviando...' : 'Enviar inscrição' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

const aceitaTermosDialog = ref(false)

const mostrarTermos = ref(false)
const textoTermos = String.raw`
TERMOS DE USO E POLÍTICA DE PRIVACIDADE – SALIP2

Ao se cadastrar no site do Salip2 – Salão do Livro do Pedro II, você concorda com os seguintes termos:

1. Finalidade do Site
O Salip2 é um ambiente virtual destinado à divulgação, organização e participação em atividades culturais e literárias promovidas por alunos, professores e convidados do município de Pedro II - PI.

2. Cadastro de Usuário
O cadastro é gratuito e destinado a alunos, professores, organizadores e participantes do evento. É proibido o uso de informações falsas ou de terceiros sem autorização.

3. Privacidade e Proteção de Dados
As informações fornecidas no cadastro (como nome, número e preferências de atividade) serão utilizadas exclusivamente para fins de organização do evento. Seus dados não serão compartilhados com terceiros sem seu consentimento.

4. Comportamento Esperado
Ao participar do Salip2, você se compromete a agir com respeito e cordialidade. Não é permitido o envio de conteúdos ofensivos, discriminatórios ou que violem leis vigentes.

5. Responsabilidades do Usuário
Você é responsável pelas informações inseridas em seu perfil e pela utilização de sua conta.

6. Alterações no Evento ou Plataforma
A organização do Salip2 reserva-se o direito de modificar o conteúdo da plataforma ou o cronograma do evento sem aviso prévio, quando necessário.

7. Aceite dos Termos
Ao marcar o campo "Li e aceito os Termos de Uso e a Política de Privacidade", você declara estar de acordo com todos os pontos acima.
`

const $toast = useToast();

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

const opcoesTipo = [
  { valor: 'aluno', label: 'Sou aluno' },
  { valor: 'funcionario', label: 'Sou funcionário' },
  { valor: 'visitante', label: 'Sou visitante' }
]

const palestrasSelecionadas = ref(['']) 
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
  'Outra, pois a minha não está na lista!',
]

const eventos = [
  { value: 'oficina', label: 'Oficinas' },
  { value: 'EXPOSIÇÃO FOTOGRÁFICA', label: 'EXPOSIÇÃO FOTOGRÁFICA' },
  {value: "palestra", label:'Palestras'}
]
const exposicaos = [
  '23/05 - 9h -	Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 10h -	Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 14h30min - Exposição Fotográfica Reviver Pedro II ',
  '23/05 - 16h30min - Exposição Fotográfica Reviver Pedro II ',
  '24/05 - 9h - Exposição Fotográfica Reviver Pedro II ',
  '24/05 - 10h - Exposição Fotográfica Reviver Pedro II ',
  '24/05 - 14h30min - Exposição Fotográfica Reviver Pedro II ',
  '24/05 - 16h30min - Exposição Fotográfica Reviver Pedro II ',
] 
const palestras = [
'Palestra de abertura com Fabrício Carpinejar (RS)',
'Palestra: A voz de Esperança Garcia - Palestrante: Bernardo Aurélio (PI) e João P. Luiz (PI)',
'Palestra/Show: Música e Letra - instrumentos de educação - Palestrante: Grupo Cocares',
'Palestra:  O cânone literário   o sublime piauiense  - Palestrante: Luiz Romero (PI)',
'Palestra: A literatura de Pedro II: da pré-história aos dias atuais - Palestrante: Ernâni Getirana (PI)',
'Espetáculo: Esperando Godot - Texto: Samuel Becket - Apresentação: Grupo Harém de Teatro (PI)',
'Palestra: A lírica do poeta Manuel Bandeira - Palestrantes: José de Nicola (SP) e Cineas Santos (PI)',
'Palestra: Poesia, Música e Sala de Aula - Palestrantes: Adriano Lobão Aragão (PI) e Vagner Ribeiro (PI)',
]
const oficinas = [
  '23/05 - 9h - Oficina de Literatura de Cordel ',
  '23/05 - 9h - Oficina de Fanzine ',
  '23/05 - 9h - Comida é Memória',
  '23/05 - 9h - Oficina Poética',
]
function teste() {
  let instance = $toast.warning('inscrição enviada com sucesso!', {
    position: 'top-right'
  });
}
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
  exposicaoSelecionada: '',
  palestraSelecionada: [], 
})

const tipoParticipante = ref('aluno')
const aceitaTermos = ref(false)
const isSubmitting = ref(false)

function checkFields() {
  if (!form.nomeCompleto) {
    $toast.warning('Preencha o Nome completo.', { position: 'top-right' })
    return false
  }
  if (!form.cidade) {
    $toast.warning('Preencha a Cidade.', { position: 'top-right' })
    return false
  }
  if (!form.uf) {
    $toast.warning('Preencha a UF.', { position: 'top-right' })
    return false
  }
  if (!form.dataNascimento) {
    $toast.warning('Preencha a Data de nascimento.', { position: 'top-right' })
    return false
  }
  if (tipoParticipante.value === 'aluno' && !form.escola) {
    $toast.warning('Selecione a Escola.', { position: 'top-right' })
    return false
  }
  if (tipoParticipante.value === 'funcionario' && !form.localTrabalho) {
    $toast.warning('Preencha o Local de trabalho.', { position: 'top-right' })
    return false
  }
  if (form.evento && !form.telefone) {
    $toast.warning('Preencha o Telefone para contato.', { position: 'top-right' })
    return false
  }
  if (form.evento === 'oficina' && !form.oficinaSelecionada) {
    $toast.warning('Selecione a Oficina.', { position: 'top-right' })
    return false
  }
  if (form.evento === 'EXPOSIÇÃO FOTOGRÁFICA' && !form.exposicaoSelecionada) {
    $toast.warning('Selecione a Exposição.', { position: 'top-right' })
    return false
  }
 if (form.evento === 'palestra') {

  if (palestrasSelecionadas.value.length === 0 || palestrasSelecionadas.value.some(p => !p || p.trim() === '')) {
      $toast.error('Selecione palestra');
      return;
    }
  }
  if (!aceitaTermosDialog.value) {
    $toast.warning('Você precisa aceitar os termos.', { position: 'top-right' })
    return false
  }
  return true
}
 
const handleSubmit = async () => {
  if (isSubmitting.value) return;
  if (!checkFields()) return;
  isSubmitting.value = true;

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
    palestraSelecionada: palestrasSelecionadas.value.length ? [...palestrasSelecionadas.value] : null,
    oficinaSelecionada: form.evento === 'oficina' ? form.oficinaSelecionada : null,
    exposicaoSelecionada: form.evento === 'EXPOSIÇÃO FOTOGRÁFICA' ? form.exposicaoSelecionada : null,
    timestamp: new Date()
  };

  try {
    await addDoc(collection(db, 'inscricoes'), dados);
    Object.keys(form).forEach(key => form[key] = '');
    tipoParticipante.value = 'aluno';
    aceitaTermos.value = false;
    $toast.success('Inscrição enviada com sucesso!', { position: 'top-right' });
  } catch (error) {
    console.error(error);
    $toast.error('Erro ao enviar inscrição. Tente novamente.', { position: 'top-right' });
  } finally {
    isSubmitting.value = false;
  }
};
watch(() => form.evento, (novoEvento) => {
  form.telefone = ''
  form.exposicaoSelecionada = ''
  form.oficinaSelecionada = ''
  palestrasSelecionadas.value = ['']


})
</script>


<style scoped>
   .form-wrapper {
  background-color: #fff;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-group label,label,
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #999;

}

input[type="radio"],
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #999;
  
}

input[type="text"],
input[type="date"],
input[type="tel"],
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  color: #999;
}

button.form-button {
  background-color: #2b72ff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button.form-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .form-wrapper {
    padding: 15px;
  }

  .form-container {
    gap: 14px;
  }

  .radio-group,
  .checkbox-group {
    gap: 8px;
  }

  .form-title {
    font-size: 1.25rem;
  }
}

    </style>