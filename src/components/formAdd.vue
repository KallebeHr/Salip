<template>
  <div class="page-wrap">

    <!-- Progress bar -->
    <div class="progress-wrap">
      <div class="progress-steps">
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
            <svg v-if="etapaAtual > i + 1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
        </div>
        <div class="step-line">
          <div class="step-line-fill" :style="{ width: progressWidth + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="form-card">

      <!-- ETAPA 1: Tipo de participante -->
      <Transition name="slide" mode="out-in">
      <div v-if="etapaAtual === 1" key="step1" class="etapa">
        <div class="etapa-header">
          <div class="etapa-icon">👤</div>
          <h2 class="etapa-title">Quem é você?</h2>
          <p class="etapa-desc">Selecione como você participará do SALIP2</p>
        </div>

        <div class="tipo-grid">
          <label
            v-for="opcao in opcoesTipo"
            :key="opcao.valor"
            class="tipo-card"
            :class="{ selected: tipoParticipante === opcao.valor }"
          >
            <input type="radio" :value="opcao.valor" v-model="tipoParticipante" hidden />
            <div class="tipo-icon" v-html="opcao.icon"></div>
            <div class="tipo-label">{{ opcao.label }}</div>
            <div class="tipo-desc">{{ opcao.desc }}</div>
            <div class="tipo-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </label>
        </div>

        <div class="etapa-footer">
          <button class="btn-next" @click="irParaEtapa(2)">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ETAPA 2: Dados pessoais -->
      <Transition name="slide" mode="out-in">
      <div v-if="etapaAtual === 2" key="step2" class="etapa">
        <div class="etapa-header">
          <div class="etapa-icon">📋</div>
          <h2 class="etapa-title">Dados pessoais</h2>
          <p class="etapa-desc">Preencha suas informações básicas</p>
        </div>

        <div class="fields-col">

          <div class="field-wrap" :class="{ error: erros.nomeCompleto, success: form.nomeCompleto && !erros.nomeCompleto }">
            <label class="field-label">Nome completo <span class="req">*</span></label>
            <input
              type="text"
              class="field-input"
              v-model="form.nomeCompleto"
              placeholder="Ex: Maria Silva Santos"
              @blur="validarCampo('nomeCompleto')"
            />
            <span class="field-msg" v-if="erros.nomeCompleto">{{ erros.nomeCompleto }}</span>
          </div>

          <div class="field-row">
            <div class="field-wrap" :class="{ error: erros.cidade, success: form.cidade && !erros.cidade }">
              <label class="field-label">Cidade <span class="req">*</span></label>
              <div class="select-wrap">
                <select class="field-input" v-model="form.cidade" @change="validarCampo('cidade')">
                  <option value="" disabled>Selecione sua cidade</option>
                  <optgroup v-for="grupo in cidadesAgrupadas" :key="grupo.estado" :label="grupo.estado">
                    <option v-for="cidade in grupo.cidades" :key="cidade" :value="cidade">{{ cidade }}</option>
                  </optgroup>
                </select>
              </div>
              <span class="field-msg" v-if="erros.cidade">{{ erros.cidade }}</span>
            </div>

            <div class="field-wrap uf-wrap" :class="{ error: erros.uf, success: form.uf && !erros.uf }">
              <label class="field-label">UF <span class="req">*</span></label>
              <input
                type="text"
                class="field-input"
                v-model="form.uf"
                maxlength="2"
                placeholder="PI"
                :readonly="form.cidade && ufAutomatica"
                @input="form.uf = form.uf.toUpperCase()"
                @blur="validarCampo('uf')"
              />
              <span class="field-msg" v-if="erros.uf">{{ erros.uf }}</span>
            </div>
          </div>

          <div class="field-wrap" :class="{ error: erros.dataNascimento, success: form.dataNascimento && !erros.dataNascimento }">
            <label class="field-label">Data de nascimento <span class="req">*</span></label>
            <input
              type="date"
              class="field-input"
              v-model="form.dataNascimento"
              :max="hoje"
              @blur="validarCampo('dataNascimento')"
            />
            <span class="field-hint" v-if="form.dataNascimento && !erros.dataNascimento">
              {{ calcIdade(form.dataNascimento) }} anos
            </span>
            <span class="field-msg" v-if="erros.dataNascimento">{{ erros.dataNascimento }}</span>
          </div>

          <!-- Campo condicional: escola -->
          <Transition name="fade">
          <div class="field-wrap" v-if="tipoParticipante === 'aluno'"
            :class="{ error: erros.escola, success: form.escola && !erros.escola }">
            <label class="field-label">Escola <span class="req">*</span></label>
            <div class="select-wrap">
              <select class="field-input" v-model="form.escola" @change="validarCampo('escola')">
                <option value="" disabled>Selecione sua escola</option>
                <option v-for="escola in escolas" :key="escola" :value="escola">{{ escola }}</option>
              </select>
            </div>
            <span class="field-msg" v-if="erros.escola">{{ erros.escola }}</span>
          </div>
          </Transition>

          <!-- Campo condicional: trabalho -->
          <Transition name="fade">
          <div class="field-wrap" v-if="tipoParticipante === 'funcionario'"
            :class="{ error: erros.localTrabalho, success: form.localTrabalho && !erros.localTrabalho }">
            <label class="field-label">Local de trabalho <span class="req">*</span></label>
            <input
              type="text"
              class="field-input"
              v-model="form.localTrabalho"
              placeholder="Ex: Secretaria Municipal de Educação"
              @blur="validarCampo('localTrabalho')"
            />
            <span class="field-msg" v-if="erros.localTrabalho">{{ erros.localTrabalho }}</span>
          </div>
          </Transition>

        </div>

        <div class="etapa-footer">
          <button class="btn-back" @click="irParaEtapa(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </button>
          <button class="btn-next" @click="validarEtapa2()">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ETAPA 3: Atividades -->
      <Transition name="slide" mode="out-in">
      <div v-if="etapaAtual === 3" key="step3" class="etapa">
        <div class="etapa-header">
          <div class="etapa-icon">🎯</div>
          <h2 class="etapa-title">Atividades</h2>
          <p class="etapa-desc">Deseja participar de alguma atividade? (opcional)</p>
        </div>

        <!-- Seleção de evento -->
        <div class="evento-grid">
          <div
            v-for="ev in eventosOpcoes"
            :key="ev.value"
            class="evento-card"
            :class="{ selected: form.evento === ev.value }"
            @click="selecionarEvento(ev.value)"
          >
            <div class="evento-icon">{{ ev.icon }}</div>
            <div class="evento-nome">{{ ev.label }}</div>
            <div class="evento-desc">{{ ev.desc }}</div>
          </div>
          <div
            class="evento-card nenhum-card"
            :class="{ selected: form.evento === '' }"
            @click="selecionarEvento('')"
          >
            <div class="evento-icon">⏭️</div>
            <div class="evento-nome">Nenhuma atividade</div>
            <div class="evento-desc">Apenas participar do evento</div>
          </div>
        </div>

        <!-- Sub-opções de atividade -->
        <Transition name="fade">
        <div v-if="form.evento" class="sub-atividade">

          <div class="field-wrap" :class="{ error: erros.telefone, success: form.telefone && !erros.telefone }">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.98 3.48 2 2 0 0 1 3.94 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Telefone para contato <span class="req">*</span>
            </label>
            <input
              type="tel"
              class="field-input"
              v-model="form.telefone"
              placeholder="(86) 99999-9999"
              @blur="validarCampo('telefone')"
            />
            <span class="field-msg" v-if="erros.telefone">{{ erros.telefone }}</span>
          </div>

          <!-- Oficina -->
          <Transition name="fade">
          <div v-if="form.evento === 'oficina'" class="field-wrap"
            :class="{ error: erros.oficinaSelecionada, success: form.oficinaSelecionada && !erros.oficinaSelecionada }">
            <label class="field-label">Escolha a oficina <span class="req">*</span></label>
            <div class="opcoes-lista">
              <label
                v-for="of in oficinas"
                :key="of"
                class="opcao-item"
                :class="{ selected: form.oficinaSelecionada === of }"
              >
                <input type="radio" :value="of" v-model="form.oficinaSelecionada" hidden />
                <span class="opcao-radio"></span>
                <span class="opcao-texto">{{ of }}</span>
              </label>
            </div>
            <span class="field-msg" v-if="erros.oficinaSelecionada">{{ erros.oficinaSelecionada }}</span>
          </div>
          </Transition>

          <!-- Exposição -->
          <Transition name="fade">
          <div v-if="form.evento === 'EXPOSIÇÃO FOTOGRÁFICA'" class="field-wrap"
            :class="{ error: erros.exposicaoSelecionada, success: form.exposicaoSelecionada && !erros.exposicaoSelecionada }">
            <label class="field-label">Escolha o horário da exposição <span class="req">*</span></label>
            <div class="opcoes-lista">
              <label
                v-for="ex in exposicaos"
                :key="ex"
                class="opcao-item"
                :class="{ selected: form.exposicaoSelecionada === ex }"
              >
                <input type="radio" :value="ex" v-model="form.exposicaoSelecionada" hidden />
                <span class="opcao-radio"></span>
                <span class="opcao-texto">{{ ex }}</span>
              </label>
            </div>
            <span class="field-msg" v-if="erros.exposicaoSelecionada">{{ erros.exposicaoSelecionada }}</span>
          </div>
          </Transition>

          <!-- Palestras -->
          <Transition name="fade">
          <div v-if="form.evento === 'palestra'" class="field-wrap">
            <label class="field-label">Selecione as palestras que deseja assistir <span class="req">*</span></label>
            <p class="field-hint" style="margin-bottom:10px;">Você pode selecionar mais de uma</p>
            <div class="opcoes-lista">
              <label
                v-for="pal in palestras"
                :key="pal"
                class="opcao-item checkbox-item"
                :class="{ selected: palestrasSelecionadas.includes(pal) }"
              >
                <input type="checkbox" :value="pal" v-model="palestrasSelecionadas" hidden />
                <span class="opcao-check">
                  <svg v-if="palestrasSelecionadas.includes(pal)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="opcao-texto">{{ pal }}</span>
              </label>
            </div>
            <span class="field-msg" v-if="erros.palestra">{{ erros.palestra }}</span>
          </div>
          </Transition>

        </div>
        </Transition>

        <div class="etapa-footer">
          <button class="btn-back" @click="irParaEtapa(2)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </button>
          <button class="btn-next" @click="validarEtapa3()">
            Continuar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
      </Transition>

      <!-- ETAPA 4: Revisão e envio -->
      <Transition name="slide" mode="out-in">
      <div v-if="etapaAtual === 4" key="step4" class="etapa">
        <div class="etapa-header">
          <div class="etapa-icon">✅</div>
          <h2 class="etapa-title">Confirmar inscrição</h2>
          <p class="etapa-desc">Verifique seus dados antes de enviar</p>
        </div>

        <div class="resumo-card">
          <div class="resumo-tipo">
            <span class="badge-tipo" :class="'tipo-' + tipoParticipante">{{ labelTipo }}</span>
          </div>

          <div class="resumo-section">
            <div class="resumo-section-title">Dados pessoais</div>
            <div class="resumo-row">
              <span class="resumo-label">Nome</span>
              <span class="resumo-val">{{ form.nomeCompleto }}</span>
            </div>
            <div class="resumo-row">
              <span class="resumo-label">Cidade / UF</span>
              <span class="resumo-val">{{ form.cidade }} — {{ form.uf }}</span>
            </div>
            <div class="resumo-row">
              <span class="resumo-label">Nascimento</span>
              <span class="resumo-val">{{ formatarData(form.dataNascimento) }} ({{ calcIdade(form.dataNascimento) }} anos)</span>
            </div>
            <div class="resumo-row" v-if="form.escola">
              <span class="resumo-label">Escola</span>
              <span class="resumo-val">{{ form.escola }}</span>
            </div>
            <div class="resumo-row" v-if="form.localTrabalho">
              <span class="resumo-label">Trabalho</span>
              <span class="resumo-val">{{ form.localTrabalho }}</span>
            </div>
          </div>

          <div class="resumo-section" v-if="form.evento">
            <div class="resumo-section-title">Atividade escolhida</div>
            <div class="resumo-row">
              <span class="resumo-label">Tipo</span>
              <span class="resumo-val">{{ labelEvento }}</span>
            </div>
            <div class="resumo-row">
              <span class="resumo-label">Telefone</span>
              <span class="resumo-val">{{ form.telefone }}</span>
            </div>
            <div class="resumo-row" v-if="form.oficinaSelecionada">
              <span class="resumo-label">Oficina</span>
              <span class="resumo-val">{{ form.oficinaSelecionada }}</span>
            </div>
            <div class="resumo-row" v-if="form.exposicaoSelecionada">
              <span class="resumo-label">Exposição</span>
              <span class="resumo-val">{{ form.exposicaoSelecionada }}</span>
            </div>
            <div class="resumo-row" v-if="palestrasSelecionadas.length">
              <span class="resumo-label">Palestras</span>
              <span class="resumo-val">
                <span v-for="p in palestrasSelecionadas" :key="p" class="palestra-chip">{{ p }}</span>
              </span>
            </div>
          </div>

          <div class="resumo-section" v-else>
            <div class="resumo-section-title">Atividade</div>
            <div class="resumo-row">
              <span class="resumo-label">Participação</span>
              <span class="resumo-val" style="color:#6b6860;">Apenas presença no evento</span>
            </div>
          </div>
        </div>

        <div class="btn-editar-wrap">
          <button class="btn-editar" @click="irParaEtapa(2)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar dados
          </button>
        </div>

        <!-- Termos -->
        <div class="termos-wrap">
          <label class="termos-label" :class="{ checked: aceitaTermos }">
            <div class="termos-check" @click="aceitaTermos = !aceitaTermos">
              <svg v-if="aceitaTermos" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span>
              Li e aceito os
              <button type="button" class="link-termos" @click="mostrarTermos = true">termos de uso e privacidade</button>
              do SALIP2
            </span>
          </label>
          <span class="field-msg" v-if="erros.termos">{{ erros.termos }}</span>
        </div>

        <div class="etapa-footer">
          <button class="btn-back" @click="irParaEtapa(3)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Voltar
          </button>
          <button class="btn-submit" :disabled="isSubmitting" @click="handleSubmit">
            <svg v-if="!isSubmitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span class="spinner" v-if="isSubmitting"></span>
            {{ isSubmitting ? 'Enviando...' : 'Enviar inscrição' }}
          </button>
        </div>
      </div>
      </Transition>

      <!-- SUCESSO -->
      <Transition name="slide" mode="out-in">
      <div v-if="etapaAtual === 5" key="step5" class="etapa sucesso-etapa">
        <div class="sucesso-icon">🎉</div>
        <h2 class="sucesso-titulo">Inscrição realizada!</h2>
        <p class="sucesso-desc">
          Obrigado, <strong>{{ nomeEnviado }}</strong>!<br>
          Sua inscrição no <strong>SALIP2</strong> foi registrada com sucesso.
        </p>
        <div class="sucesso-card" v-if="nomeEnviado">
          <div class="sucesso-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Dados confirmados
          </div>
          <div class="sucesso-item" v-if="form.evento">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Atividade reservada
          </div>
        </div>
        <button class="btn-next" @click="resetarFormulario" style="align-self:center; margin-top:1rem;">
          Nova inscrição
        </button>
      </div>
      </Transition>

    </div>

    <!-- Modal de termos -->
    <Transition name="fade">
    <div v-if="mostrarTermos" class="modal-overlay" @click.self="mostrarTermos = false">
      <div class="modal-termos">
        <div class="modal-header">
          <h3>Termos de uso e privacidade — SALIP2</h3>
          <button @click="mostrarTermos = false" class="modal-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <pre class="termos-texto">{{ textoTermos }}</pre>
        </div>
        <div class="modal-footer">
          <button class="btn-next" @click="aceitaTermos = true; mostrarTermos = false">
            Li e aceito os termos
          </button>
        </div>
      </div>
    </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

const $toast = useToast()

// ─── estado de navegação ───
const etapaAtual = ref(1)
const steps = ['Perfil', 'Dados', 'Atividades', 'Confirmar']
const progressWidth = computed(() => ((etapaAtual.value - 1) / (steps.length - 1)) * 100)

// ─── dados do formulário ───
const tipoParticipante = ref('aluno')
const palestrasSelecionadas = ref([])
const aceitaTermos = ref(false)
const mostrarTermos = ref(false)
const isSubmitting = ref(false)
const nomeEnviado = ref('')
const ufAutomatica = ref(false)
const hoje = new Date().toISOString().split('T')[0]

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
})

const erros = reactive({})

// ─── opções ───
const opcoesTipo = [
  {
    valor: 'aluno',
    label: 'Aluno',
    desc: 'Estudante de escola ou instituição',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
  },
  {
    valor: 'funcionario',
    label: 'Funcionário',
    desc: 'Professor ou servidor público',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
  },
  {
    valor: 'visitante',
    label: 'Visitante',
    desc: 'Comunidade em geral',
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
]

// ─── cidades agrupadas com UF automático ───
const cidadesComUF = {
  'Pedro II': 'PI',
  'Teresina': 'PI',
  'Parnaíba': 'PI',
  'Piripiri': 'PI',
  'Campo Maior': 'PI',
  'Picos': 'PI',
  'Floriano': 'PI',
  'Oeiras': 'PI',
  'São Raimundo Nonato': 'PI',
  'Corrente': 'PI',
  'Barras': 'PI',
  'Batalha': 'PI',
  'José de Freitas': 'PI',
  'Altos': 'PI',
  'Esperantina': 'PI',
  'São João do Piauí': 'PI',
  'Valença do Piauí': 'PI',
  'Água Branca': 'PI',
  'Fortaleza': 'CE',
  'Sobral': 'CE',
  'Juazeiro do Norte': 'CE',
  'Crato': 'CE',
  'Caucaia': 'CE',
  'São Luís': 'MA',
  'Imperatriz': 'MA',
  'Timon': 'MA',
  'Caxias': 'MA',
  'Outra cidade': '',
}

const cidadesAgrupadas = [
  {
    estado: '── Piauí (PI) ──',
    cidades: ['Pedro II','Teresina','Parnaíba','Piripiri','Campo Maior','Picos','Floriano','Oeiras','São Raimundo Nonato','Corrente','Barras','Batalha','José de Freitas','Altos','Esperantina','São João do Piauí','Valença do Piauí','Água Branca']
  },
  {
    estado: '── Ceará (CE) ──',
    cidades: ['Fortaleza','Sobral','Juazeiro do Norte','Crato','Caucaia']
  },
  {
    estado: '── Maranhão (MA) ──',
    cidades: ['São Luís','Imperatriz','Timon','Caxias']
  },
  {
    estado: '── Outra ──',
    cidades: ['Outra cidade']
  }
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

const eventosOpcoes = [
  { value: 'oficina', label: 'Oficinas', icon: '🎨', desc: 'Atividades práticas e criativas' },
  { value: 'EXPOSIÇÃO FOTOGRÁFICA', label: 'Exposição fotográfica', icon: '📷', desc: 'Reviver Pedro II' },
  { value: 'palestra', label: 'Palestras', icon: '🎤', desc: 'Palestras com autores e especialistas' },
]

const exposicaos = [
  '23/05 — 9h — Exposição Fotográfica Reviver Pedro II',
  '23/05 — 10h — Exposição Fotográfica Reviver Pedro II',
  '23/05 — 14h30 — Exposição Fotográfica Reviver Pedro II',
  '23/05 — 16h30 — Exposição Fotográfica Reviver Pedro II',
  '24/05 — 9h — Exposição Fotográfica Reviver Pedro II',
  '24/05 — 10h — Exposição Fotográfica Reviver Pedro II',
  '24/05 — 14h30 — Exposição Fotográfica Reviver Pedro II',
  '24/05 — 16h30 — Exposição Fotográfica Reviver Pedro II',
]

const palestras = [
  'Palestra de abertura com Fabrício Carpinejar (RS)',
  'Palestra: A voz de Esperança Garcia — Bernardo Aurélio (PI) e João P. Luiz (PI)',
  'Palestra/Show: Música e Letra — Grupo Cocares',
  'Palestra: Piauienses Escritoras — Jasmine Malta (PI)',
  'Palestra: O cânone literário piauiense — Luiz Romero (PI)',
  'Palestra: A literatura de Pedro II — Ernâni Getirana (PI)',
  'Espetáculo: Esperando Godot — Grupo Harém de Teatro (PI)',
  'Palestra: A lírica de Manuel Bandeira — José de Nicola (SP) e Cineas Santos (PI)',
  'Palestra: Poesia, Música e Sala de Aula — Adriano Lobão (PI) e Vagner Ribeiro (PI)',
]

const oficinas = [
  '23/05 — 9h — Oficina de Literatura de Cordel',
  '23/05 — 9h — Oficina de Fanzine',
  '23/05 — 9h — Comida é Memória',
  '23/05 — 9h — Oficina Poética',
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
  'Escola Municipal Santa Ângela',
  'Escola Municipal Santa Úrsula',
  'Escola Municipal Cipriano Leite',
  'Escola Municipal Maria Gerhard',
  'Escola Municipal Tia Alice',
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
  'Escola Municipal Pedro Antonio da Silva',
  'Escola Municipal Expedito Pinheiro da Silva',
  'Escola Municipal Alfredo Pinheiro',
  'Escola Municipal Prof Manoel Cunha',
  'Escola Municipal Cipó',
  'Coesp',
  'EFASA',
  'Escola Madre Rosa',
  'Escola Angelina Mendes Braga',
  'Escola Solon Brandão',
  'Escola Tertuliano Brandão Filho',
  'Escola Maria Mendes Mourão',
  'Escola Pedro Soares',
  'EJA Dep Milton Brandão',
  'ASOP',
  'IFPI — Instituto Federal do Piauí',
  'Escola Municipal Gonçalo Domingos de Oliveira',
  'U. E. Maria Isaias de Jesus',
  'U. E. Adalgisa Morais Sousa',
  'U. E. Antonio Isaias de Maria',
  'U. E. Conrado Pereira dos Santos',
  'U. E. Monsenhor Uchoa',
  'U. E. Nossa Senhora Aparecida',
  'U. E. Raimundo Joaquim dos Santos',
  'U. E. Artur Gonçalves de Sousa',
  'Escola Mul Zilda Gonçalves',
  'Escola Mul Pedro Barros',
  'Grupo Esc Regina Gomes',
  'Grupo Esc Prof José Raimundo',
  'Grupo Esc Felipe Gomes de Melo',
  'Esc Mul Prof José Soares da Silva',
  'Esc Mul Antonio Gomes',
  'Outra (minha escola não está na lista)',
]

// ─── computados ───
const labelTipo = computed(() => opcoesTipo.find(o => o.valor === tipoParticipante.value)?.label || '')
const labelEvento = computed(() => eventosOpcoes.find(e => e.value === form.evento)?.label || '')

// ─── validações ───
function validarCampo(campo) {
  delete erros[campo]
  if (campo === 'nomeCompleto' && !form.nomeCompleto.trim()) erros.nomeCompleto = 'Informe seu nome completo'
  if (campo === 'cidade' && !form.cidade) erros.cidade = 'Selecione sua cidade'
  if (campo === 'uf' && !form.uf) erros.uf = 'Informe a UF'
  if (campo === 'dataNascimento' && !form.dataNascimento) erros.dataNascimento = 'Informe sua data de nascimento'
  if (campo === 'escola' && tipoParticipante.value === 'aluno' && !form.escola) erros.escola = 'Selecione sua escola'
  if (campo === 'localTrabalho' && tipoParticipante.value === 'funcionario' && !form.localTrabalho.trim()) erros.localTrabalho = 'Informe o local de trabalho'
  if (campo === 'telefone' && form.evento && !form.telefone.trim()) erros.telefone = 'Informe um telefone para contato'
}

function validarEtapa2() {
  ['nomeCompleto','cidade','uf','dataNascimento'].forEach(f => validarCampo(f))
  if (tipoParticipante.value === 'aluno') validarCampo('escola')
  if (tipoParticipante.value === 'funcionario') validarCampo('localTrabalho')
  if (Object.keys(erros).length === 0) irParaEtapa(3)
}

function validarEtapa3() {
  delete erros.telefone
  delete erros.oficinaSelecionada
  delete erros.exposicaoSelecionada
  delete erros.palestra

  if (form.evento) {
    if (!form.telefone.trim()) { erros.telefone = 'Informe o telefone'; return }
    if (form.evento === 'oficina' && !form.oficinaSelecionada) { erros.oficinaSelecionada = 'Selecione uma oficina'; return }
    if (form.evento === 'EXPOSIÇÃO FOTOGRÁFICA' && !form.exposicaoSelecionada) { erros.exposicaoSelecionada = 'Selecione um horário'; return }
    if (form.evento === 'palestra' && palestrasSelecionadas.value.length === 0) { erros.palestra = 'Selecione ao menos uma palestra'; return }
  }
  irParaEtapa(4)
}

function irParaEtapa(n) {
  etapaAtual.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function selecionarEvento(val) {
  form.evento = val
  form.telefone = ''
  form.oficinaSelecionada = ''
  form.exposicaoSelecionada = ''
  palestrasSelecionadas.value = []
}

// ─── submit ───
async function handleSubmit() {
  delete erros.termos
  if (!aceitaTermos.value) { erros.termos = 'Você precisa aceitar os termos para continuar'; return }
  if (isSubmitting.value) return
  isSubmitting.value = true

  const dados = {
    tipoParticipante: tipoParticipante.value,
    nomeCompleto: form.nomeCompleto.trim(),
    cidade: form.cidade,
    uf: form.uf.toUpperCase(),
    dataNascimento: form.dataNascimento,
    escola: tipoParticipante.value === 'aluno' ? form.escola : null,
    localTrabalho: tipoParticipante.value === 'funcionario' ? form.localTrabalho.trim() : null,
    evento: form.evento || null,
    telefone: form.evento ? form.telefone.trim() : null,
    palestraSelecionada: form.evento === 'palestra' ? [...palestrasSelecionadas.value] : null,
    oficinaSelecionada: form.evento === 'oficina' ? form.oficinaSelecionada : null,
    exposicaoSelecionada: form.evento === 'EXPOSIÇÃO FOTOGRÁFICA' ? form.exposicaoSelecionada : null,
    timestamp: new Date(),
  }

  try {
    await addDoc(collection(db, 'inscricoes'), dados)
    nomeEnviado.value = form.nomeCompleto.split(' ')[0]
    etapaAtual.value = 5
  } catch (err) {
    console.error(err)
    $toast.error('Erro ao enviar inscrição. Tente novamente.', { position: 'top-right' })
  } finally {
    isSubmitting.value = false
  }
}

function resetarFormulario() {
  Object.keys(form).forEach(k => form[k] = '')
  tipoParticipante.value = 'aluno'
  palestrasSelecionadas.value = []
  aceitaTermos.value = false
  nomeEnviado.value = ''
  etapaAtual.value = 1
}

// ─── helpers ───
function calcIdade(dob) {
  if (!dob) return ''
  const d = new Date(dob), now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
  return age
}

function formatarData(dob) {
  if (!dob) return ''
  const [y, m, d] = dob.split('-')
  return `${d}/${m}/${y}`
}

const textoTermos = `TERMOS DE USO E POLÍTICA DE PRIVACIDADE – SALIP2

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
Ao marcar o campo "Li e aceito os Termos de Uso e a Política de Privacidade", você declara estar de acordo com todos os pontos acima.`
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.page-wrap {
  min-height: 100vh;
  background: #f0ede6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 4rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ─── progress ─── */
.progress-wrap {
  width: 100%;
  max-width: 560px;
  margin-bottom: 1.5rem;
}
.progress-steps {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}
.step-line {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #d8d4cc;
  z-index: 0;
}
.step-line-fill {
  height: 100%;
  background: #2d4a8a;
  transition: width 0.5s ease;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 1;
  flex: 1;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #d8d4cc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #8a8780;
  transition: all 0.3s;
}
.step-item.active .step-circle {
  background: #2d4a8a;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(45,74,138,0.15);
}
.step-item.done .step-circle {
  background: #166534;
  color: #fff;
}
.step-label {
  font-size: 11px;
  color: #8a8780;
  font-weight: 500;
}
.step-item.active .step-label { color: #2d4a8a; font-weight: 600; }
.step-item.done .step-label { color: #166534; }

/* ─── form card ─── */
.form-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #e0dbd2;
  width: 100%;
  max-width: 560px;
  overflow: hidden;
}

/* ─── etapa ─── */
.etapa {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.etapa-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding-bottom: 1rem;
  border-bottom: 1.5px solid #f0ede6;
}
.etapa-icon { font-size: 2rem; line-height: 1; }
.etapa-title { font-size: 1.4rem; font-weight: 600; color: #1a1a18; }
.etapa-desc { font-size: 14px; color: #6b6860; }

/* ─── tipo grid ─── */
.tipo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.tipo-card {
  border: 2px solid #e0dbd2;
  border-radius: 12px;
  padding: 1.1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  text-align: center;
  background: #faf9f7;
}
.tipo-card:hover { border-color: #2d4a8a; background: #fff; }
.tipo-card.selected { border-color: #2d4a8a; background: #eef2fb; }
.tipo-icon { color: #6b6860; }
.tipo-card.selected .tipo-icon { color: #2d4a8a; }
.tipo-label { font-size: 14px; font-weight: 600; color: #1a1a18; }
.tipo-desc { font-size: 11px; color: #9a9890; }
.tipo-check {
  position: absolute;
  top: 8px; right: 8px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #2d4a8a;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s;
  color: #fff;
}
.tipo-card.selected .tipo-check { opacity: 1; transform: scale(1); }

/* ─── campos ─── */
.fields-col { display: flex; flex-direction: column; gap: 1rem; }
.field-row { display: grid; grid-template-columns: 1fr 90px; gap: 10px; }
.uf-wrap { }

.field-wrap { display: flex; flex-direction: column; gap: 5px; }
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #3a3a36;
  display: flex;
  align-items: center;
  gap: 5px;
}
.req { color: #c0392b; font-weight: 700; }
.field-input {
  padding: 10px 14px;
  border: 1.5px solid #e0dbd2;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #1a1a18;
  background: #faf9f7;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
}
.field-input:focus { border-color: #2d4a8a; background: #fff; }
.field-wrap.error .field-input { border-color: #c0392b; background: #fff8f8; }
.field-wrap.success .field-input { border-color: #166534; }
.field-msg { font-size: 12px; color: #c0392b; }
.field-hint { font-size: 12px; color: #639922; font-family: 'IBM Plex Mono', monospace; }
.select-wrap { position: relative; }
select.field-input { appearance: none; padding-right: 32px; cursor: pointer; }
.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  color: #8a8780;
  pointer-events: none;
  font-size: 12px;
}

/* ─── evento grid ─── */
.evento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.evento-card {
  border: 2px solid #e0dbd2;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: #faf9f7;
}
.evento-card:hover { border-color: #2d4a8a; background: #fff; }
.evento-card.selected { border-color: #2d4a8a; background: #eef2fb; }
.nenhum-card:hover { border-color: #8a8780; background: #f4f2ed; }
.nenhum-card.selected { border-color: #8a8780; background: #f4f2ed; }
.evento-icon { font-size: 1.5rem; }
.evento-nome { font-size: 13px; font-weight: 600; color: #1a1a18; }
.evento-desc { font-size: 11px; color: #9a9890; }

.sub-atividade { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem; background: #faf9f7; border-radius: 10px; border: 1.5px solid #e8e4dc; }

/* ─── lista de opções ─── */
.opcoes-lista { display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto; }
.opcao-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1.5px solid #e0dbd2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  background: #fff;
}
.opcao-item:hover { border-color: #2d4a8a; }
.opcao-item.selected { border-color: #2d4a8a; background: #eef2fb; }
.opcao-radio {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid #d0ccc4;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.15s;
}
.opcao-item.selected .opcao-radio {
  border-color: #2d4a8a;
  background: #2d4a8a;
  box-shadow: inset 0 0 0 3px #fff;
}
.opcao-check {
  width: 18px; height: 18px;
  border-radius: 4px;
  border: 2px solid #d0ccc4;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: #fff;
}
.opcao-item.selected .opcao-check { border-color: #2d4a8a; background: #2d4a8a; }
.opcao-texto { font-size: 13px; color: #3a3a36; line-height: 1.4; }

/* ─── resumo ─── */
.resumo-card {
  border: 1.5px solid #e0dbd2;
  border-radius: 12px;
  overflow: hidden;
}
.resumo-tipo {
  padding: 1rem 1.25rem;
  background: #f8f7f4;
  border-bottom: 1.5px solid #e0dbd2;
}
.badge-tipo {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}
.tipo-aluno { background: #dbeafe; color: #1e40af; }
.tipo-funcionario { background: #dcfce7; color: #166534; }
.tipo-visitante { background: #fef3c7; color: #92400e; }
.resumo-section { padding: 1rem 1.25rem; border-bottom: 1.5px solid #f0ede6; }
.resumo-section:last-child { border-bottom: none; }
.resumo-section-title {
  font-size: 10px;
  font-weight: 700;
  color: #9a9890;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
  font-family: 'IBM Plex Mono', monospace;
}
.resumo-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 5px 0; gap: 12px; border-bottom: 1px solid #f8f7f4; }
.resumo-row:last-child { border-bottom: none; }
.resumo-label { font-size: 13px; color: #6b6860; flex-shrink: 0; }
.resumo-val { font-size: 13px; font-weight: 500; color: #1a1a18; text-align: right; display: flex; flex-direction: column; gap: 4px; }
.palestra-chip {
  display: block;
  background: #eef2fb;
  color: #2d4a8a;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-align: right;
}
.btn-editar-wrap { display: flex; justify-content: flex-end; }
.btn-editar {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #e0dbd2;
  border-radius: 8px;
  font-size: 12px;
  font-family: inherit;
  color: #6b6860;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-editar:hover { border-color: #2d4a8a; color: #2d4a8a; }

/* ─── termos ─── */
.termos-wrap { display: flex; flex-direction: column; gap: 6px; }
.termos-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #3a3a36;
  cursor: pointer;
  line-height: 1.5;
}
.termos-check {
  width: 20px; height: 20px;
  border-radius: 4px;
  border: 2px solid #d0ccc4;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  background: #fff;
  cursor: pointer;
  color: #fff;
}
.termos-label.checked .termos-check { border-color: #2d4a8a; background: #2d4a8a; }
.link-termos {
  background: none;
  border: none;
  color: #2d4a8a;
  font-size: 13px;
  font-family: inherit;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

/* ─── footer botões ─── */
.etapa-footer { display: flex; gap: 10px; justify-content: flex-end; padding-top: 0.5rem; border-top: 1.5px solid #f0ede6; }
.btn-back {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px;
  background: transparent;
  border: 1.5px solid #e0dbd2;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #6b6860;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-back:hover { border-color: #8a8780; color: #1a1a18; }
.btn-next {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px;
  background: #1a1a18;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-next:hover { background: #2d4a8a; }
.btn-submit {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 11px 24px;
  background: #166534;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-submit:hover:not(:disabled) { background: #14532d; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── sucesso ─── */
.sucesso-etapa { align-items: center; text-align: center; padding: 3rem 2rem; }
.sucesso-icon { font-size: 3.5rem; animation: bounce 0.6s ease; }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.sucesso-titulo { font-size: 1.6rem; font-weight: 600; color: #1a1a18; }
.sucesso-desc { font-size: 14px; color: #6b6860; line-height: 1.7; }
.sucesso-card {
  border: 1.5px solid #bbf7d0;
  background: #f0fdf4;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 0.5rem;
}
.sucesso-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #166534;
  font-weight: 500;
}

/* ─── modal ─── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(26,26,24,0.5);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-termos {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border: 1.5px solid #e0dbd2;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1.5px solid #f0ede6;
}
.modal-header h3 { font-size: 14px; font-weight: 600; color: #1a1a18; }
.modal-close {
  background: transparent;
  border: 1px solid #e0dbd2;
  border-radius: 6px;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #9a9890;
}
.modal-close:hover { background: #f0ede6; }
.modal-body { flex: 1; overflow-y: auto; padding: 1.25rem; }
.termos-texto { font-size: 12px; color: #3a3a36; line-height: 1.8; white-space: pre-wrap; font-family: 'IBM Plex Mono', monospace; }
.modal-footer { padding: 1rem 1.25rem; border-top: 1.5px solid #f0ede6; display: flex; justify-content: flex-end; }

/* ─── transitions ─── */
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; }
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(-20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ─── responsivo ─── */
@media (max-width: 500px) {
  .tipo-grid { grid-template-columns: 1fr; }
  .evento-grid { grid-template-columns: 1fr; }
  .field-row { grid-template-columns: 1fr 72px; }
  .etapa { padding: 1.25rem; }
  .page-wrap { padding: 1rem 0.75rem 3rem; }
  .etapa-footer { flex-direction: column-reverse; }
  .btn-back, .btn-next, .btn-submit { width: 100%; justify-content: center; }
}
</style>