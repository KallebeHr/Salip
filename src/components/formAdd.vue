<template>
  <div class="page-wrap">
    
    <header class="page-header">
      <h1 class="brand-logo">📚 SALIP 2</h1>
      <p class="brand-subtitle">Salão do Livro de Pedro II</p>
    </header>

    <div class="progress-wrap">
      <div class="progress-steps">
        <div class="step-line">
          <div class="step-line-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="step-item"
          :class="{
            done: etapaAtual > i + 1,
            active: etapaAtual === i + 1,
          }"
        >
          <div class="step-circle">
            <svg v-if="etapaAtual > i + 1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
        </div>
      </div>
    </div>

    <main class="form-card">
      <Transition name="slide" mode="out-in">
        
        <div v-if="etapaAtual === 1" key="step1" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 1 de 4</span>
            <h2 class="etapa-title">Como você vai participar?</h2>
            <p class="etapa-desc">Escolha o perfil que melhor descreve você para personalizarmos sua experiência.</p>
          </header>

          <div class="tipo-grid" role="radiogroup">
            <label
              v-for="opcao in opcoesTipo"
              :key="opcao.valor"
              class="tipo-card"
              :class="{ selected: tipoParticipante === opcao.valor }"
              tabindex="0"
              @keydown.enter="tipoParticipante = opcao.valor"
            >
              <input type="radio" :value="opcao.valor" v-model="tipoParticipante" class="sr-only" />
              <div class="tipo-icon" v-html="opcao.icon"></div>
              <div class="tipo-info">
                <span class="tipo-label">{{ opcao.label }}</span>
                <span class="tipo-desc">{{ opcao.desc }}</span>
              </div>
              <div class="tipo-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </label>
          </div>

          <footer class="etapa-footer">
            <button class="btn-primary w-full-mobile" @click="irParaEtapa(2)">
              Continuar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 2" key="step2" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 2 de 4</span>
            <h2 class="etapa-title">Seus Dados Pessoais</h2>
            <p class="etapa-desc">Precisamos dessas informações para gerar seu crachá e certificado oficial.</p>
          </header>

          <div class="fields-col">
            <div class="field-wrap" :class="{ error: erros.nomeCompleto }">
              <label for="nome" class="field-label">Nome completo <span class="req">*</span></label>
              <input id="nome" type="text" class="field-input" v-model="form.nomeCompleto" placeholder="Ex: Maria Silva Santos" @blur="validarCampo('nomeCompleto')" />
              <span class="field-msg" v-if="erros.nomeCompleto">{{ erros.nomeCompleto }}</span>
            </div>

            <div class="field-row">
              <div class="field-wrap" :class="{ error: erros.cidade }">
                <label for="cidade" class="field-label">Cidade <span class="req">*</span></label>
                <div class="select-wrap">
                  <select id="cidade" class="field-input" v-model="form.cidade" @change="validarCampo('cidade')">
                    <option value="" disabled>Selecione...</option>
                    <optgroup v-for="grupo in cidadesAgrupadas" :key="grupo.estado" :label="grupo.estado">
                      <option v-for="cidade in grupo.cidades" :key="cidade" :value="cidade">{{ cidade }}</option>
                    </optgroup>
                  </select>
                </div>
                <span class="field-msg" v-if="erros.cidade">{{ erros.cidade }}</span>
              </div>

              <div class="field-wrap" :class="{ error: erros.uf }">
                <label for="uf" class="field-label">UF <span class="req">*</span></label>
                <input id="uf" type="text" class="field-input text-center" v-model="form.uf" maxlength="2" placeholder="PI" :readonly="form.cidade && ufAutomatica" @input="form.uf = form.uf.toUpperCase()" @blur="validarCampo('uf')" />
                <span class="field-msg" v-if="erros.uf">{{ erros.uf }}</span>
              </div>
            </div>

            <div class="field-wrap" :class="{ error: erros.dataNascimento }">
              <label for="nascimento" class="field-label">Data de nascimento <span class="req">*</span></label>
              <input id="nascimento" type="date" class="field-input" v-model="form.dataNascimento" :max="hoje" @blur="validarCampo('dataNascimento')" />
              <div class="field-footer">
                <span class="field-msg" v-if="erros.dataNascimento">{{ erros.dataNascimento }}</span>
                <span class="field-hint" v-else-if="form.dataNascimento">{{ calcIdade(form.dataNascimento) }} anos</span>
              </div>
            </div>

            <Transition name="fade">
              <div class="field-wrap" v-if="tipoParticipante === 'aluno'" :class="{ error: erros.escola }">
                <label for="escola" class="field-label">Em qual escola você estuda? <span class="req">*</span></label>
                <div class="select-wrap">
                  <select id="escola" class="field-input" v-model="form.escola" @change="validarCampo('escola')">
                    <option value="" disabled>Selecione sua escola...</option>
                    <option v-for="escola in escolas" :key="escola" :value="escola">{{ escola }}</option>
                  </select>
                </div>
                <span class="field-msg" v-if="erros.escola">{{ erros.escola }}</span>
              </div>
            </Transition>

            <Transition name="fade">
              <div class="field-wrap" v-if="tipoParticipante === 'funcionario'" :class="{ error: erros.localTrabalho }">
                <label for="trabalho" class="field-label">Local de trabalho <span class="req">*</span></label>
                <input id="trabalho" type="text" class="field-input" v-model="form.localTrabalho" placeholder="Ex: Secretaria de Educação" @blur="validarCampo('localTrabalho')" />
                <span class="field-msg" v-if="erros.localTrabalho">{{ erros.localTrabalho }}</span>
              </div>
            </Transition>
          </div>

          <footer class="etapa-footer sb">
            <button class="btn-secondary" @click="irParaEtapa(1)">Voltar</button>
            <button class="btn-primary" @click="validarEtapa2()">
              Continuar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 3" key="step3" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 3 de 4</span>
            <h2 class="etapa-title">Sua Agenda (Opcional)</h2>
            <p class="etapa-desc">Selecione as atividades exclusivas que você deseja participar. Se quiser apenas passear, pode pular.</p>
          </header>

          <div class="evento-selecao">
            <div class="evento-grid">
              <label v-for="cat in categoriasAtividades" :key="cat.id" class="evento-card checkbox-card" :class="{ selected: form.categorias.includes(cat.id) }">
                <input type="checkbox" :value="cat.id" v-model="form.categorias" class="sr-only" />
                <div class="evento-icon">{{ cat.icon }}</div>
                <div class="evento-nome">{{ cat.label }}</div>
                <div class="checkbox-indicator">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </label>
            </div>
          </div>

          <Transition name="fade">
            <div class="sub-atividade-wrap" v-if="form.categorias.length > 0">
              
              <div class="field-wrap" :class="{ error: erros.telefone }">
                <label class="field-label">Telefone (WhatsApp) <span class="req">*</span></label>
                <input type="tel" class="field-input" v-model="form.telefone" placeholder="(86) 99999-9999" @blur="validarCampo('telefone')" />
                <span class="field-msg" v-if="erros.telefone">{{ erros.telefone }}</span>
                <span class="field-hint" v-else>Para enviarmos os lembretes das vagas.</span>
              </div>

              <div v-if="form.categorias.includes('oficinas')" class="atividade-bloco" :class="{ error: erros.oficinas }">
                <h3 class="bloco-title">🎨 Escolha suas Oficinas</h3>
                <div class="opcoes-lista">
                  <label v-for="of in oficinas" :key="of" class="opcao-item" :class="{ selected: form.oficinasSelecionadas.includes(of) }">
                    <input type="checkbox" :value="of" v-model="form.oficinasSelecionadas" class="sr-only" />
                    <span class="opcao-check"><svg v-if="form.oficinasSelecionadas.includes(of)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="opcao-texto">{{ of }}</span>
                  </label>
                </div>
                <span class="field-msg" v-if="erros.oficinas">{{ erros.oficinas }}</span>
              </div>

              <div v-if="form.categorias.includes('exposicoes')" class="atividade-bloco" :class="{ error: erros.exposicoes }">
                <h3 class="bloco-title">📷 Horários da Exposição</h3>
                <div class="opcoes-lista">
                  <label v-for="ex in exposicaos" :key="ex" class="opcao-item" :class="{ selected: form.exposicoesSelecionadas.includes(ex) }">
                    <input type="checkbox" :value="ex" v-model="form.exposicoesSelecionadas" class="sr-only" />
                    <span class="opcao-check"><svg v-if="form.exposicoesSelecionadas.includes(ex)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="opcao-texto">{{ ex }}</span>
                  </label>
                </div>
                <span class="field-msg" v-if="erros.exposicoes">{{ erros.exposicoes }}</span>
              </div>

              <div v-if="form.categorias.includes('palestras')" class="atividade-bloco" :class="{ error: erros.palestras }">
                <h3 class="bloco-title">🎤 Palestras de interesse</h3>
                <div class="opcoes-lista">
                  <label v-for="pal in palestras" :key="pal" class="opcao-item" :class="{ selected: form.palestrasSelecionadas.includes(pal) }">
                    <input type="checkbox" :value="pal" v-model="form.palestrasSelecionadas" class="sr-only" />
                    <span class="opcao-check"><svg v-if="form.palestrasSelecionadas.includes(pal)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <span class="opcao-texto">{{ pal }}</span>
                  </label>
                </div>
                <span class="field-msg" v-if="erros.palestras">{{ erros.palestras }}</span>
              </div>

            </div>
          </Transition>

          <footer class="etapa-footer sb">
            <button class="btn-secondary" @click="irParaEtapa(2)">Voltar</button>
            <button class="btn-primary" @click="validarEtapa3()">
              Revisar Inscrição
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 4" key="step4" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 4 de 4</span>
            <h2 class="etapa-title">Revise seus dados</h2>
            <p class="etapa-desc">Verifique se está tudo correto antes de confirmar sua inscrição no SALIP2.</p>
          </header>

          <div class="resumo-wrap">
            <div class="resumo-card">
              <div class="resumo-header">
                <div class="badge-tipo">{{ labelTipo }}</div>
                <button class="btn-edit-link" @click="irParaEtapa(2)">Editar Dados</button>
              </div>
              <dl class="resumo-list">
                <div class="resumo-item">
                  <dt>Nome</dt>
                  <dd>{{ form.nomeCompleto }}</dd>
                </div>
                <div class="resumo-item">
                  <dt>Origem</dt>
                  <dd>{{ form.cidade }} - {{ form.uf }}</dd>
                </div>
                <div class="resumo-item" v-if="form.escola">
                  <dt>Escola</dt>
                  <dd>{{ form.escola }}</dd>
                </div>
              </dl>
            </div>

            <div class="resumo-card highlight">
              <div class="resumo-header">
                <strong>Sua Agenda</strong>
                <button class="btn-edit-link" @click="irParaEtapa(3)">Editar Agenda</button>
              </div>
              
              <div class="resumo-atividades" v-if="form.categorias.length > 0">
                <div v-if="form.oficinasSelecionadas.length" class="agenda-bloco">
                  <span>🎨 Oficinas</span>
                  <ul><li v-for="o in form.oficinasSelecionadas" :key="o">{{ o }}</li></ul>
                </div>
                <div v-if="form.exposicoesSelecionadas.length" class="agenda-bloco">
                  <span>📷 Exposições</span>
                  <ul><li v-for="e in form.exposicoesSelecionadas" :key="e">{{ e }}</li></ul>
                </div>
                <div v-if="form.palestrasSelecionadas.length" class="agenda-bloco">
                  <span>🎤 Palestras</span>
                  <ul><li v-for="p in form.palestrasSelecionadas" :key="p">{{ p }}</li></ul>
                </div>
              </div>
              <div class="resumo-atividades empty" v-else>
                <span>Nenhuma atividade extra. Acesso geral ao evento confirmado.</span>
              </div>
            </div>
          </div>

          <div class="termos-wrap">
            <label class="termos-label" :class="{ checked: aceitaTermos }">
              <input type="checkbox" v-model="aceitaTermos" class="sr-only" />
              <div class="termos-check">
                <svg v-if="aceitaTermos" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span class="termos-text">
                Li e aceito os <button type="button" class="link-inline" @click.prevent="mostrarTermos = true">Termos de Uso e Privacidade</button> do SALIP2.
              </span>
            </label>
            <span class="field-msg" v-if="erros.termos">{{ erros.termos }}</span>
          </div>

          <footer class="etapa-footer sb">
            <button class="btn-secondary" @click="irParaEtapa(3)" :disabled="isSubmitting">Voltar</button>
            <button class="btn-submit" :class="{ loading: isSubmitting }" :disabled="isSubmitting" @click="handleSubmit">
              <span v-if="!isSubmitting">Confirmar Inscrição</span>
              <span v-else class="spinner-wrap">Processando <span class="spinner"></span></span>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 5" key="step5" class="etapa sucesso-etapa">
          <div class="sucesso-anim">🎉</div>
          <h2 class="sucesso-titulo">Inscrição confirmada!</h2>
          <p class="sucesso-desc">
            Tudo certo, <strong>{{ nomeEnviado }}</strong>! Estamos ansiosos para te ver no SALIP2. Compartilhe com seus amigos que você vai colar lá!
          </p>
          
          <div class="acoes-sucesso">
            <button class="btn-story" @click="gerarStory" :disabled="isGeneratingStory">
              <svg v-if="!isGeneratingStory" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span v-if="!isGeneratingStory">Compartilhar no Story</span>
              <span v-else class="spinner-wrap">Gerando arte... <span class="spinner story-spinner"></span></span>
            </button>
            
            <button class="btn-text" @click="resetarFormulario">Fazer nova inscrição</button>
          </div>
        </div>
      </Transition>
    </main>

    <Transition name="fade">
      <div v-if="mostrarTermos" class="modal-overlay" @click.self="mostrarTermos = false">
        <div class="modal-card" role="dialog" aria-modal="true">
          <header class="modal-header">
            <h3>Termos de Uso e Privacidade</h3>
            <button @click="mostrarTermos = false" class="btn-close" aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </header>
          <div class="modal-body">
            <pre class="termos-conteudo">{{ textoTermos }}</pre>
          </div>
          <footer class="modal-footer">
            <button class="btn-primary w-full" @click="aceitaTermos = true; mostrarTermos = false">Entendi e Aceito</button>
          </footer>
        </div>
      </div>
    </Transition>

    <div class="story-export-wrapper">
      <div 
        ref="storyNode" 
        class="story-canvas" 
        style="background: linear-gradient(135deg, #0f2c59 0%, #144181 100%);"
      >
        <div class="story-bg-graphics">
          <div class="circle-top"></div>
          <div class="circle-bottom"></div>
        </div>
        
        <div class="story-content-box">
          <div class="story-event-brand">
            <div class="story-icon"><img src="/IMG/LOGONAMEPRIMARIO.png" alt="SALIP 2"></div>
          </div>
          
          <div class="story-badge">
            PRESENÇA CONFIRMADA 
          </div>
          
          <h2 class="story-title">Eu vou para o maior evento literário de Pedro II!</h2>
          
          <div class="story-ticket">
             <span class="user-label">Participante</span>
             <span class="user-name">{{ nomeStory }}</span>
          </div>
          
          <div class="story-footer">
            <span class="story-hashtag">#EuNoSalip2</span>
            <span class="story-date">23 e 24 de Maio</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { ref, reactive, computed, watch, nextTick } from 'vue'

// import { collection, addDoc } from 'firebase/firestore'
// import { db } from '@/firebase'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import html2canvas from 'html2canvas'

const $toast = useToast()

const etapaAtual = ref(1)
const steps = ['Perfil', 'Dados', 'Agenda', 'Revisão']
const progressWidth = computed(() => ((etapaAtual.value - 1) / (steps.length - 1)) * 100)

const tipoParticipante = ref('aluno')
const aceitaTermos = ref(false)
const mostrarTermos = ref(false)
const isSubmitting = ref(false)
const nomeEnviado = ref('')
const nomeStory = ref('')
const ufAutomatica = ref(false)
const hoje = new Date().toISOString().split('T')[0]

const form = reactive({
  nomeCompleto: '',
  cidade: '',
  uf: '',
  dataNascimento: '',
  escola: '',
  localTrabalho: '',
  telefone: '',
  categorias: [],
  oficinasSelecionadas: [],
  exposicoesSelecionadas: [],
  palestrasSelecionadas: [],
})

const erros = reactive({})

const opcoesTipo = [
  { valor: 'aluno', label: 'Estudante', desc: 'Aluno de escola ou universidade', icon: '🎒' },
  { valor: 'funcionario', label: 'Profissional', desc: 'Professor, servidor ou gestor', icon: '💼' },
  { valor: 'visitante', label: 'Visitante', desc: 'Comunidade em geral', icon: '🎟️' },
]

const cidadesComUF = {
  'Pedro II': 'PI', 'Teresina': 'PI', 'Parnaíba': 'PI', 'Piripiri': 'PI', 'Fortaleza': 'CE', 'São Luís': 'MA', 'Outra cidade': ''
}

const cidadesAgrupadas = [
  { estado: 'Piauí', cidades: ['Pedro II','Teresina','Parnaíba','Piripiri','Campo Maior','Picos'] },
  { estado: 'Ceará', cidades: ['Fortaleza','Sobral','Juazeiro do Norte'] },
  { estado: 'Outros', cidades: ['São Luís', 'Outra cidade'] }
]

watch(() => form.cidade, (cidade) => {
  if (cidade && cidadesComUF[cidade]) {
    form.uf = cidadesComUF[cidade]
    ufAutomatica.value = true
  } else {
    ufAutomatica.value = false
    if (cidade === 'Outra cidade') form.uf = ''
  }
})

const categoriasAtividades = [
  { id: 'oficinas', label: 'Oficinas Literárias', icon: '🎨' },
  { id: 'exposicoes', label: 'Exposições de Arte', icon: '📷' },
  { id: 'palestras', label: 'Palestras Oficiais', icon: '🎤' },
]

const exposicaos = ['23/05 — 9h', '23/05 — 14h30', '24/05 — 10h']
const palestras = [
  'Abertura com Fabrício Carpinejar',
  'A voz de Esperança Garcia',
  'O cânone literário piauiense',
  'A lírica de Manuel Bandeira'
]
const oficinas = ['Oficina de Literatura de Cordel', 'Oficina de Fanzine', 'Comida é Memória']
const escolas = ['Escola Municipal Monsenhor Lotário Weber', 'IFPI — Instituto Federal do Piauí', 'Outra (não listada)']

const labelTipo = computed(() => opcoesTipo.find(o => o.valor === tipoParticipante.value)?.label || 'Participante')

function validarCampo(campo) {
  delete erros[campo]
  if (campo === 'nomeCompleto' && !form.nomeCompleto.trim()) erros.nomeCompleto = 'Como devemos te chamar?'
  if (campo === 'cidade' && !form.cidade) erros.cidade = 'Qual sua cidade?'
  if (campo === 'uf' && !form.uf.trim()) erros.uf = 'Insira a sigla do estado'
  if (campo === 'dataNascimento' && !form.dataNascimento) erros.dataNascimento = 'Insira sua data de nascimento'
  if (campo === 'escola' && tipoParticipante.value === 'aluno' && !form.escola) erros.escola = 'Selecione sua instituição'
  if (campo === 'localTrabalho' && tipoParticipante.value === 'funcionario' && !form.localTrabalho.trim()) erros.localTrabalho = 'Informe o local'
  if (campo === 'telefone' && form.categorias.length > 0 && !form.telefone.trim()) erros.telefone = 'Informe seu WhatsApp'
}

function validarEtapa2() {
  ['nomeCompleto','cidade','uf','dataNascimento'].forEach(validarCampo)
  if (tipoParticipante.value === 'aluno') validarCampo('escola')
  if (tipoParticipante.value === 'funcionario') validarCampo('localTrabalho')
  if (Object.keys(erros).length === 0) irParaEtapa(3)
}

function validarEtapa3() {
  delete erros.telefone; delete erros.oficinas; delete erros.exposicoes; delete erros.palestras;
  let hasError = false;

  if (form.categorias.length > 0) {
    if (!form.telefone.trim()) { erros.telefone = 'Necessário para contato sobre as vagas.'; hasError = true; }
    if (form.categorias.includes('oficinas') && form.oficinasSelecionadas.length === 0) { erros.oficinas = 'Selecione ao menos uma oficina.'; hasError = true; }
    if (form.categorias.includes('exposicoes') && form.exposicoesSelecionadas.length === 0) { erros.exposicoes = 'Selecione um horário para visita.'; hasError = true; }
    if (form.categorias.includes('palestras') && form.palestrasSelecionadas.length === 0) { erros.palestras = 'Selecione ao menos uma palestra.'; hasError = true; }
  }

  if (!hasError) irParaEtapa(4)
}

function irParaEtapa(n) {
  etapaAtual.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  delete erros.termos
  if (!aceitaTermos.value) { erros.termos = 'Você precisa aceitar os termos de uso para continuar.'; return; }
  if (isSubmitting.value) return;
  isSubmitting.value = true

  // Simulando requisição (Aqui entra seu código do Firebase)
  try {
    await new Promise(res => setTimeout(res, 1200));

    nomeEnviado.value = form.nomeCompleto.split(' ')[0]
    nomeStory.value = form.nomeCompleto
    etapaAtual.value = 5
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error(err)
    $toast.error('Ocorreu um erro de conexão. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

function resetarFormulario() {
  Object.assign(form, { nomeCompleto: '', cidade: '', uf: '', dataNascimento: '', escola: '', localTrabalho: '', telefone: '', categorias: [], oficinasSelecionadas: [], exposicoesSelecionadas: [], palestrasSelecionadas: [] })
  tipoParticipante.value = 'aluno'; aceitaTermos.value = false;
  etapaAtual.value = 1; window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── INSTAGRAM STORY GENERATION (Bugfix de Fundo Branco) ───
const storyNode = ref(null)
const isGeneratingStory = ref(false)

async function gerarStory() {
  if (!storyNode.value || isGeneratingStory.value) return
  isGeneratingStory.value = true
  
  try {
    await nextTick()
    const canvas = await html2canvas(storyNode.value, {
      scale: 2, 
      useCORS: true,
      backgroundColor: '#144181', // Força azul
      width: 1080, // Trava a proporção de story
      height: 1920
    })
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)

    if (navigator.share) {
      try {
        const blob = await (await fetch(imageDataUrl)).blob()
        const file = new File([blob], 'salip2-story.jpg', { type: 'image/jpeg' })
        await navigator.share({
          title: 'Meu Ingresso SALIP 2',
          text: 'Olha só, minha inscrição no SALIP 2 está confirmada! #EuNoSalip2',
          files: [file]
        })
        isGeneratingStory.value = false
        return
      } catch (e) {
        console.warn('Share API falhou, acionando download.', e)
      }
    }

    const link = document.createElement('a')
    link.download = 'salip2-story.jpg'
    link.href = imageDataUrl
    link.click()
    $toast.success('Arte salva! Agora é só postar nos stories.')

  } catch (err) {
    console.error(err)
    $toast.error('Erro ao gerar a arte. Tente novamente.')
  } finally {
    isGeneratingStory.value = false
  }
}

function calcIdade(dob) {
  if (!dob) return ''
  const d = new Date(dob), now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
  return age
}

const textoTermos = `TERMOS DE USO E POLÍTICA DE PRIVACIDADE – SALIP2\n\n1. Finalidade...\n(Omitido para focar na lógica, mantenha seu texto original completo aqui)`
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;800&display=swap');

:root {
  --c-blue: #144181;
  --c-blue-hover: #103468;
  --c-blue-light: #000000;
  --c-yellow: #D8DF52;
  --c-yellow-hover: #c4cc42;
  --c-dark: #1e293b;
  --c-gray-text: #64748b;
  --c-border: #cbd5e1;
  --c-bg: #f1f5f9;
  --c-error: #ef4444;
  --c-error-bg: #fef2f2;
  --c-success: #22c55e;
  --radius: 16px;
  --shadow: 0 10px 40px -10px rgba(20, 65, 129, 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; 
    color: black !important; 
}
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

.page-wrap {
  min-height: 100vh;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--c-dark);
}

/* ─── HEADER SIMPLES ─── */
.page-header { text-align: center; margin-bottom: 2rem; }
.brand-logo { font-size: 2rem; font-weight: 800; color: var(--c-blue); letter-spacing: -0.5px; }
.brand-subtitle { font-size: 14px; font-weight: 600; color: var(--c-gray-text); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

/* ─── PROGRESS BAR ─── */
.progress-wrap { width: 100%; max-width: 650px; margin-bottom: 2rem; }
.progress-steps { display: flex; align-items: flex-start; justify-content: space-between; position: relative; }
.step-line { position: absolute; top: 16px; left: 12%; right: 12%; height: 3px; background: #e2e8f0; z-index: 0; border-radius: 4px; }
.step-line-fill { height: 100%; background: var(--c-blue); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 4px; }
.step-item { display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1; flex: 1; }
.step-circle { width: 34px; height: 34px; border-radius: 50%; background: #fff; border: 3px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #94a3b8; transition: all 0.3s; }
.step-item.active .step-circle { border-color: var(--c-blue); color: var(--c-blue); box-shadow: 0 0 0 4px rgba(20, 65, 129, 0.1); }
.step-item.done .step-circle { background: var(--c-blue); border-color: var(--c-blue); color: #fff; }
.step-label { font-size: 12px; font-weight: 600; color: var(--c-gray-text); transition: color 0.3s; }
.step-item.active .step-label { color: var(--c-blue); font-weight: 700; }

/* ─── FORM CONTAINER ─── */
.form-card { width: 100%; max-width: 650px; background: #fff; border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid rgba(0,0,0,0.05); overflow: hidden; position: relative; }
.etapa { padding: 3rem; display: flex; flex-direction: column; gap: 2rem; }
.etapa-header { display: flex; flex-direction: column; gap: 6px; }
.etapa-tag { font-size: 12px; font-weight: 700; color: var(--c-blue); text-transform: uppercase; letter-spacing: 1px; }
.etapa-title { font-size: 1.75rem; font-weight: 800; color: var(--c-dark); letter-spacing: -0.5px; }
.etapa-desc { font-size: 15px; color: var(--c-gray-text); line-height: 1.5; }

/* ─── TIPO SELEÇÃO ─── */
.tipo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.tipo-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.5rem 1rem; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; cursor: pointer; transition: all 0.2s; position: relative; outline: none; background: #f8fafc; }
.tipo-card:hover, .tipo-card:focus-within { border-color: #cbd5e1; background: #fff; transform: translateY(-2px); }
.tipo-card.selected { border-color: var(--c-blue); background: var(--c-blue-light); }
.tipo-icon { font-size: 2.2rem; }
.tipo-info { display: flex; flex-direction: column; gap: 4px; }
.tipo-label { font-weight: 700; font-size: 15px; color: var(--c-dark); }
.tipo-desc { font-size: 12px; color: var(--c-gray-text); line-height: 1.4; }
.tipo-check { position: absolute; top: 12px; right: 12px; width: 24px; height: 24px; border-radius: 50%; background: var(--c-blue); color: #fff; display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(0.5); transition: 0.2s; }
.tipo-card.selected .tipo-check { opacity: 1; transform: scale(1); }

/* ─── INPUTS E CAMPOS ─── */
.fields-col { display: flex; flex-direction: column; gap: 1.5rem; }
.field-row { display: grid; grid-template-columns: 1fr 120px; gap: 16px; }
.field-wrap { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 14px; font-weight: 700; color: var(--c-dark); }
.req { color: var(--c-error); }
.field-input { width: 100%; padding: 14px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 15px; font-family: inherit; color: var(--c-dark); transition: all 0.2s ease; outline: none; background: #f8fafc; }
.field-input::placeholder { color: #94a3b8; }
.field-input:focus { border-color: var(--c-blue); background: #fff; box-shadow: 0 0 0 4px rgba(20, 65, 129, 0.08); }
.text-center { text-align: center; }
.field-wrap.error .field-input { border-color: var(--c-error); background: var(--c-error-bg); }
.field-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.field-msg { font-size: 13px; font-weight: 600; color: var(--c-error); animation: fadeIn 0.2s; margin-top: 4px; }
.field-hint { font-size: 13px; font-weight: 500; color: var(--c-gray-text); }
.select-wrap { position: relative; }
select.field-input { appearance: none; cursor: pointer; padding-right: 40px; }
.select-wrap::after { content: '▾'; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; font-size: 16px; }

/* ─── EVENTOS MULTIPLOS ─── */
.evento-selecao { display: flex; flex-direction: column; gap: 16px; }
.evento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.checkbox-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; position: relative; text-align: center; background: #f8fafc; }
.checkbox-card:hover { border-color: #cbd5e1; background: #fff; }
.checkbox-card.selected { border-color: var(--c-blue); background: var(--c-blue-light); }
.evento-icon { font-size: 1.5rem; }
.evento-nome { font-size: 13px; font-weight: 600; color: var(--c-dark); }
.checkbox-indicator { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: transparent; transition: 0.2s; }
.checkbox-card.selected .checkbox-indicator { background: var(--c-blue); border-color: var(--c-blue); color: #fff; }

.sub-atividade-wrap { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 1.5rem; }
.atividade-bloco { display: flex; flex-direction: column; gap: 12px; }
.bloco-title { font-size: 15px; font-weight: 800; color: var(--c-blue); }
.opcoes-lista { display: flex; flex-direction: column; gap: 8px; }
.opcao-item { display: flex; align-items: center; gap: 12px; padding: 14px; background: #fff; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; transition: 0.2s; }
.opcao-item:hover { border-color: #cbd5e1; }
.opcao-item.selected { border-color: var(--c-blue); background: var(--c-blue-light); }
.opcao-check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: 0.2s; }
.opcao-item.selected .opcao-check { background: var(--c-blue); border-color: var(--c-blue); }
.opcao-texto { font-size: 14px; font-weight: 600; color: var(--c-dark); }

/* ─── REVISÃO E RESUMO ─── */
.resumo-wrap { display: flex; flex-direction: column; gap: 16px; }
.resumo-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
.resumo-card.highlight { background: var(--c-blue-light); border-color: #bfdbfe; }
.resumo-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 12px; }
.resumo-header strong { font-size: 16px; color: var(--c-blue); }
.badge-tipo { background: var(--c-yellow); color: var(--c-dark); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
.btn-edit-link { background: none; border: none; color: var(--c-blue); font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: underline; }
.resumo-list { display: flex; flex-direction: column; gap: 12px; }
.resumo-item { display: flex; justify-content: space-between; align-items: center; }
.resumo-item dt { font-size: 14px; color: var(--c-gray-text); }
.resumo-item dd { font-size: 14px; font-weight: 700; color: var(--c-dark); text-align: right; }
.resumo-atividades { display: flex; flex-direction: column; gap: 16px; }
.agenda-bloco span { font-size: 14px; font-weight: 800; color: var(--c-dark); margin-bottom: 8px; display: inline-block; }
.agenda-bloco ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.agenda-bloco li { font-size: 14px; font-weight: 600; color: var(--c-blue); padding-left: 16px; position: relative; }
.agenda-bloco li::before { content: '•'; color: var(--c-yellow); position: absolute; left: 0; font-size: 18px; line-height: 14px; }
.resumo-atividades.empty { text-align: center; color: var(--c-gray-text); font-size: 14px; font-weight: 500; }

/* ─── TERMOS ─── */
.termos-wrap { margin-top: 1rem; padding: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; }
.termos-label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.termos-check { width: 24px; height: 24px; border-radius: 6px; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: 0.2s; }
.termos-label.checked .termos-check { background: var(--c-blue); border-color: var(--c-blue); }
.termos-text { font-size: 14px; color: var(--c-dark); line-height: 1.5; font-weight: 500; }
.link-inline { background: none; border: none; color: var(--c-blue); font-weight: 700; cursor: pointer; text-decoration: underline; font-family: inherit; font-size: inherit; }

/* ─── BOTOES ─── */
.etapa-footer { display: flex; justify-content: flex-end; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; margin-top: 1.5rem; }
.etapa-footer.sb { justify-content: space-between; }
button { font-family: inherit; outline: none; }
.btn-primary { background: var(--c-blue); color: #fff; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
.btn-primary:hover, .btn-primary:focus-visible { background: var(--c-blue-hover); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(20,65,129,0.25); }
.btn-secondary { background: #fff; color: var(--c-gray-text); border: 2px solid #e2e8f0; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-secondary:hover { border-color: #cbd5e1; color: var(--c-dark); }
.btn-submit { background: var(--c-yellow); color: var(--c-dark); border: none; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.btn-submit:hover:not(:disabled) { background: var(--c-yellow-hover); transform: translateY(-2px); box-shadow: 0 6px 15px rgba(216, 223, 82, 0.4); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

/* ─── SPINNERS E ESTADOS ─── */
.spinner-wrap { display: flex; align-items: center; gap: 8px; }
.spinner { width: 18px; height: 18px; border: 3px solid rgba(0,0,0,0.1); border-top-color: currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── SUCESSO ─── */
.sucesso-etapa { align-items: center; text-align: center; padding: 4rem 2rem; }
.sucesso-anim { font-size: 6rem; animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; margin-bottom: 1rem; }
@keyframes pop { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.sucesso-titulo { font-size: 2.2rem; font-weight: 800; color: var(--c-blue); letter-spacing: -0.5px; }
.sucesso-desc { font-size: 16px; color: var(--c-gray-text); margin-bottom: 2.5rem; line-height: 1.6; }

.acoes-sucesso { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 340px; }
.btn-story { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #fff; border: none; padding: 18px; border-radius: 14px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 25px rgba(220, 39, 67, 0.3); }
.btn-story:hover:not(:disabled) { transform: scale(1.03); box-shadow: 0 15px 35px rgba(220, 39, 67, 0.4); }
.btn-text { background: transparent; border: none; color: var(--c-gray-text); font-weight: 700; cursor: pointer; padding: 10px; }
.btn-text:hover { color: var(--c-blue); text-decoration: underline; }

/* ─── MODAL ─── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.2s; }
.modal-card { background: #fff; width: 100%; max-width: 500px; max-height: 85vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.modal-header { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
.modal-header h3 { font-size: 18px; font-weight: 800; color: var(--c-dark); }
.btn-close { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--c-gray-text); transition: 0.2s; }
.btn-close:hover { background: #e2e8f0; color: var(--c-error); }
.modal-body { padding: 2rem; overflow-y: auto; flex: 1; }
.termos-conteudo { font-family: inherit; font-size: 14px; line-height: 1.6; color: var(--c-gray-text); white-space: pre-wrap; }
.modal-footer { padding: 1.5rem 2rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.w-full { width: 100%; justify-content: center; }

/* ─── TRANSIÇÕES ─── */
.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from { opacity: 0; transform: translateX(40px); }
.slide-leave-to { opacity: 0; transform: translateX(-40px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ─── RESPONSIVIDADE ─── */
@media (max-width: 650px) {
  .etapa { padding: 2rem 1.5rem; }
  .tipo-grid { grid-template-columns: 1fr; }
  .field-row { grid-template-columns: 1fr; gap: 1.5rem; }
  .evento-grid { grid-template-columns: 1fr; }
  .etapa-footer.sb { flex-direction: column-reverse; gap: 1rem; }
  .btn-primary, .btn-secondary, .btn-submit, .w-full-mobile { width: 100%; justify-content: center; }
  .sucesso-titulo { font-size: 1.8rem; }
}

/* ─── OFF-SCREEN STORY GENERATION (Mágica do Canvas) ─── */
.story-export-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1000;
  opacity: 0;
  pointer-events: none;
}
.story-canvas {
  width: 1080px;
  height: 1920px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
}
.story-bg-graphics {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.story-content-box {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  border: 2px solid rgba(20, 65, 129, 0.1);
  border-radius: 80px;
  padding: 140px 80px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  width: 900px;
}
.story-event-brand { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 50px; }
.story-icon { font-size: 80px; }

.story-badge { 
  background-color: var(--c-yellow); 
  color: var(--c-dark);
  font-size: 30px; 
  font-weight: 800; 
  padding: 20px 40px; 
  border-radius: 100px; 
  display: inline-block; 
  margin-bottom: 80px; 
  letter-spacing: 1px; 
}

.story-title { 
  color: var(--c-dark);
  font-size: 65px; 
  font-family: 'Great Vibes', cursive;  
  font-weight: 800; 
  line-height: 1.2; 
  margin-bottom: 80px; 
  padding: 0 40px; 
}

.story-ticket { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  margin-bottom: 80px; 
  padding: 50px; 
  border-radius: 40px; 
  width: 100%; 
  background-color: rgba(20, 65, 129, 0.05);
  border: 2px dashed rgba(20, 65, 129, 0.3);
}

.user-label { color: var(--c-blue); font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; }
.user-name { color: var(--c-dark); font-size: 55px; font-weight: 800; }

.story-footer { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
.story-hashtag { color: var(--c-blue); font-size: 45px; font-weight: 800; }
.story-date { color: var(--c-gray-text); font-size: 32px; font-weight: 600; }
</style>