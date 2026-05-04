<template>
  <div class="page-wrap">
    <header class="page-header">
      <h1 class="brand-logo">SALIP 2</h1>
      <p class="brand-subtitle">Salão do Livro de Pedro II</p>
    </header>

    <div class="progress-wrap" v-if="etapaAtual <= 4">
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
            <svg
              v-if="etapaAtual > i + 1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" class="tt"/>
            </svg>
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
            <p class="etapa-desc">
              Escolha o perfil que melhor descreve você para personalizarmos sua experiência.
            </p>
          </header>

          <div class="tipo-grid" role="radiogroup" aria-label="Tipo de participante">
            <label
              v-for="opcao in opcoesTipo"
              :key="opcao.valor"
              class="tipo-card"
              :class="{ selected: tipoParticipante === opcao.valor }"
              tabindex="0"
              @keydown.enter="tipoParticipante = opcao.valor"
              @keydown.space.prevent="tipoParticipante = opcao.valor"
            >
              <input
                type="radio"
                :value="opcao.valor"
                v-model="tipoParticipante"
                class="sr-only"
              />

              <div class="tipo-icon" aria-hidden="true">{{ opcao.icon }}</div>

              <div class="tipo-info">
                <span class="tipo-label">{{ opcao.label }}</span>
                <span class="tipo-desc">{{ opcao.desc }}</span>
              </div>

              <div class="tipo-check" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </label>
          </div>

          <footer class="etapa-footer">
            <button class="btn-primary w-full-mobile" type="button" @click="irParaEtapa(2)">
              Continuar
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 2" key="step2" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 2 de 4</span>
            <h2 class="etapa-title">Seus dados pessoais</h2>
            <p class="etapa-desc">
              Precisamos dessas informações para gerar seu crachá e certificado oficial.
            </p>
          </header>

          <div class="fields-col">
            <div class="field-wrap" :class="{ error: erros.nomeCompleto }">
              <label for="nome" class="field-label">
                Nome completo <span class="req">*</span>
              </label>
              <input
                id="nome"
                type="text"
                class="field-input"
                v-model="form.nomeCompleto"
                placeholder="Ex: Maria Silva Santos"
                autocomplete="name"
                @blur="validarCampo('nomeCompleto')"
              />
              <span class="field-msg" v-if="erros.nomeCompleto">
                {{ erros.nomeCompleto }}
              </span>
            </div>

            <div class="field-row">
              <div class="field-wrap" :class="{ error: erros.cidade }">
                <label for="cidade" class="field-label">
                  Cidade <span class="req">*</span>
                </label>

                <div class="select-wrap">
                  <select
                    id="cidade"
                    class="field-input"
                    v-model="form.cidade"
                    @change="validarCampo('cidade')"
                  >
                    <option value="" disabled>Selecione...</option>

                    <optgroup
                      v-for="grupo in cidadesAgrupadas"
                      :key="grupo.estado"
                      :label="grupo.estado"
                    >
                      <option
                        v-for="cidade in grupo.cidades"
                        :key="cidade"
                        :value="cidade"
                      >
                        {{ cidade }}
                      </option>
                    </optgroup>
                  </select>
                </div>

                <span class="field-msg" v-if="erros.cidade">
                  {{ erros.cidade }}
                </span>
              </div>

              <div class="field-wrap" :class="{ error: erros.uf }">
                <label for="uf" class="field-label">
                  UF <span class="req">*</span>
                </label>

                <input
                  id="uf"
                  type="text"
                  class="field-input text-center"
                  v-model="form.uf"
                  maxlength="2"
                  placeholder="PI"
                  :readonly="form.cidade && ufAutomatica"
                  @input="form.uf = form.uf.toUpperCase()"
                  @blur="validarCampo('uf')"
                />

                <span class="field-msg" v-if="erros.uf">
                  {{ erros.uf }}
                </span>
              </div>
            </div>

            <div class="field-wrap" :class="{ error: erros.dataNascimento }">
              <label for="nascimento" class="field-label">
                Data de nascimento <span class="req">*</span>
              </label>

              <input
                id="nascimento"
                type="date"
                class="field-input"
                v-model="form.dataNascimento"
                :max="hoje"
                @blur="validarCampo('dataNascimento')"
              />

              <div class="field-footer">
                <span class="field-msg" v-if="erros.dataNascimento">
                  {{ erros.dataNascimento }}
                </span>

                <span class="field-hint" v-else-if="form.dataNascimento">
                  {{ calcIdade(form.dataNascimento) }} anos
                </span>
              </div>
            </div>

            <Transition name="fade">
              <div
                class="field-wrap"
                v-if="tipoParticipante === 'aluno'"
                :class="{ error: erros.escola }"
              >
                <label for="escola" class="field-label">
                  Em qual escola você estuda? <span class="req">*</span>
                </label>

                <div class="select-wrap">
                  <select
                    id="escola"
                    class="field-input"
                    v-model="form.escola"
                    @change="validarCampo('escola')"
                  >
                    <option value="" disabled>Selecione sua escola...</option>

                    <option
                      v-for="escola in escolas"
                      :key="escola"
                      :value="escola"
                    >
                      {{ escola }}
                    </option>
                  </select>
                </div>

                <span class="field-msg" v-if="erros.escola">
                  {{ erros.escola }}
                </span>
              </div>
            </Transition>

            <Transition name="fade">
              <div
                class="field-wrap"
                v-if="tipoParticipante === 'funcionario'"
                :class="{ error: erros.localTrabalho }"
              >
                <label for="trabalho" class="field-label">
                  Local de trabalho <span class="req">*</span>
                </label>

                <input
                  id="trabalho"
                  type="text"
                  class="field-input"
                  v-model="form.localTrabalho"
                  placeholder="Ex: Secretaria de Educação"
                  @blur="validarCampo('localTrabalho')"
                />

                <span class="field-msg" v-if="erros.localTrabalho">
                  {{ erros.localTrabalho }}
                </span>
              </div>
            </Transition>
          </div>

          <footer class="etapa-footer sb">
            <button class="btn-secondary" type="button" @click="irParaEtapa(1)">
              Voltar
            </button>

            <button class="btn-primary" type="button" @click="validarEtapa2">
              Continuar
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 3" key="step3" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 3 de 4</span>
            <h2 class="etapa-title">Sua agenda</h2>
            <p class="etapa-desc">
              Selecione as atividades exclusivas que você deseja participar. Se quiser apenas visitar o evento, pode continuar sem escolher.
            </p>
          </header>

          <div class="evento-selecao">
            <div class="evento-grid">
              <label
                v-for="cat in categoriasAtividades"
                :key="cat.id"
                class="evento-card checkbox-card"
                :class="{ selected: form.categorias.includes(cat.id) }"
              >
                <input
                  type="checkbox"
                  :value="cat.id"
                  v-model="form.categorias"
                  class="sr-only"
                />

                <div class="evento-icon" aria-hidden="true">{{ cat.icon }}</div>
                <div class="evento-nome">{{ cat.label }}</div>

                <div class="checkbox-indicator" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </label>
            </div>
          </div>

          <Transition name="fade">
            <div class="sub-atividade-wrap" v-if="form.categorias.length > 0">
              <div class="field-wrap" :class="{ error: erros.telefone }">
                <label class="field-label">
                  Telefone WhatsApp <span class="req">*</span>
                </label>

                <input
                  type="tel"
                  class="field-input"
                  v-model="form.telefone"
                  placeholder="(86) 99999-9999"
                  autocomplete="tel"
                  @input="form.telefone = mascararTelefone(form.telefone)"
                  @blur="validarCampo('telefone')"
                />

                <span class="field-msg" v-if="erros.telefone">
                  {{ erros.telefone }}
                </span>

                <span class="field-hint" v-else>
                  Usaremos apenas para lembretes sobre as atividades escolhidas.
                </span>
              </div>

              <div
                v-if="form.categorias.includes('oficinas')"
                class="atividade-bloco"
                :class="{ error: erros.oficinas }"
              >
                <h3 class="bloco-title">🎨 Escolha suas oficinas</h3>

                <div class="opcoes-lista">
                  <label
                    v-for="of in oficinas"
                    :key="of"
                    class="opcao-item"
                    :class="{ selected: form.oficinasSelecionadas.includes(of) }"
                  >
                    <input
                      type="checkbox"
                      :value="of"
                      v-model="form.oficinasSelecionadas"
                      class="sr-only"
                    />

                    <span class="opcao-check">
                      <svg
                        v-if="form.oficinasSelecionadas.includes(of)"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>

                    <span class="opcao-texto">{{ of }}</span>
                  </label>
                </div>

                <span class="field-msg" v-if="erros.oficinas">
                  {{ erros.oficinas }}
                </span>
              </div>

              <div
                v-if="form.categorias.includes('exposicoes')"
                class="atividade-bloco"
                :class="{ error: erros.exposicoes }"
              >
                <h3 class="bloco-title">📷 Horários da exposição</h3>

                <div class="opcoes-lista">
                  <label
                    v-for="ex in exposicoes"
                    :key="ex"
                    class="opcao-item"
                    :class="{ selected: form.exposicoesSelecionadas.includes(ex) }"
                  >
                    <input
                      type="checkbox"
                      :value="ex"
                      v-model="form.exposicoesSelecionadas"
                      class="sr-only"
                    />

                    <span class="opcao-check">
                      <svg
                        v-if="form.exposicoesSelecionadas.includes(ex)"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>

                    <span class="opcao-texto">{{ ex }}</span>
                  </label>
                </div>

                <span class="field-msg" v-if="erros.exposicoes">
                  {{ erros.exposicoes }}
                </span>
              </div>

              <div
                v-if="form.categorias.includes('palestras')"
                class="atividade-bloco"
                :class="{ error: erros.palestras }"
              >
                <h3 class="bloco-title">🎤 Palestras de interesse</h3>

                <div class="opcoes-lista">
                  <label
                    v-for="pal in palestras"
                    :key="pal"
                    class="opcao-item"
                    :class="{ selected: form.palestrasSelecionadas.includes(pal) }"
                  >
                    <input
                      type="checkbox"
                      :value="pal"
                      v-model="form.palestrasSelecionadas"
                      class="sr-only"
                    />

                    <span class="opcao-check">
                      <svg
                        v-if="form.palestrasSelecionadas.includes(pal)"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>

                    <span class="opcao-texto">{{ pal }}</span>
                  </label>
                </div>

                <span class="field-msg" v-if="erros.palestras">
                  {{ erros.palestras }}
                </span>
              </div>
            </div>
          </Transition>

          <footer class="etapa-footer sb">
            <button class="btn-secondary" type="button" @click="irParaEtapa(2)">
              Voltar
            </button>

            <button class="btn-primary" type="button" @click="validarEtapa3">
              Revisar inscrição
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 4" key="step4" class="etapa">
          <header class="etapa-header">
            <span class="etapa-tag">Passo 4 de 4</span>
            <h2 class="etapa-title">Revise seus dados</h2>
            <p class="etapa-desc">
              Verifique se está tudo correto antes de confirmar sua inscrição no SALIP 2.
            </p>
          </header>

          <div class="resumo-wrap">
            <div class="resumo-card">
              <div class="resumo-header">
                <div class="badge-tipo">{{ labelTipo }}</div>

                <button class="btn-edit-link" type="button" @click="irParaEtapa(2)">
                  Editar dados
                </button>
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

                <div class="resumo-item">
                  <dt>Nascimento</dt>
                  <dd>{{ formatarData(form.dataNascimento) }}</dd>
                </div>

                <div class="resumo-item" v-if="form.escola">
                  <dt>Escola</dt>
                  <dd>{{ form.escola }}</dd>
                </div>

                <div class="resumo-item" v-if="form.localTrabalho">
                  <dt>Trabalho</dt>
                  <dd>{{ form.localTrabalho }}</dd>
                </div>

                <div class="resumo-item" v-if="form.telefone">
                  <dt>WhatsApp</dt>
                  <dd>{{ form.telefone }}</dd>
                </div>
              </dl>
            </div>

            <div class="resumo-card highlight">
              <div class="resumo-header">
                <strong>Sua agenda</strong>

                <button class="btn-edit-link" type="button" @click="irParaEtapa(3)">
                  Editar agenda
                </button>
              </div>

              <div class="resumo-atividades" v-if="form.categorias.length > 0">
                <div v-if="form.oficinasSelecionadas.length" class="agenda-bloco">
                  <span>🎨 Oficinas</span>
                  <ul>
                    <li v-for="o in form.oficinasSelecionadas" :key="o">
                      {{ o }}
                    </li>
                  </ul>
                </div>

                <div v-if="form.exposicoesSelecionadas.length" class="agenda-bloco">
                  <span>📷 Exposições</span>
                  <ul>
                    <li v-for="e in form.exposicoesSelecionadas" :key="e">
                      {{ e }}
                    </li>
                  </ul>
                </div>

                <div v-if="form.palestrasSelecionadas.length" class="agenda-bloco">
                  <span>🎤 Palestras</span>
                  <ul>
                    <li v-for="p in form.palestrasSelecionadas" :key="p">
                      {{ p }}
                    </li>
                  </ul>
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

              <div class="termos-check" aria-hidden="true">
                <svg
                  v-if="aceitaTermos"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span class="termos-text">
                Li e aceito os
                <button
                  type="button"
                  class="link-inline"
                  @click.prevent="mostrarTermos = true"
                >
                  Termos de Uso e Privacidade
                </button>
                do SALIP 2.
              </span>
            </label>

            <span class="field-msg" v-if="erros.termos">
              {{ erros.termos }}
            </span>
          </div>

          <footer class="etapa-footer sb">
            <button
              class="btn-secondary"
              type="button"
              @click="irParaEtapa(3)"
              :disabled="isSubmitting"
            >
              Voltar
            </button>

            <button
              class="btn-submit"
              type="button"
              :class="{ loading: isSubmitting }"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="!isSubmitting">Confirmar inscrição</span>

              <span v-else class="spinner-wrap">
                Enviando dados
                <span class="spinner"></span>
              </span>
            </button>
          </footer>
        </div>

        <div v-else-if="etapaAtual === 5" key="step5" class="etapa sucesso-etapa">
          <div class="sucesso-anim" aria-hidden="true">🎉</div>

          <h2 class="sucesso-titulo">Inscrição confirmada!</h2>

          <p class="sucesso-desc">
            Tudo certo, <strong>{{ nomeEnviado }}</strong>! Sua inscrição foi enviada e organizada no sistema do SALIP 2.
          </p>

          <div class="id-confirmacao">
            <span class="id-label">Seu ID de inscrição</span>
            <strong class="id-code">{{ form.idUsuario }}</strong>
            <small>Guarde este código para consultar sua inscrição no evento.</small>
          </div>

          <div class="acoes-sucesso">
            <button
              class="btn-story"
              type="button"
              @click="gerarStory"
              :disabled="isGeneratingStory"
            >
              <svg
                v-if="!isGeneratingStory"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>

              <span v-if="!isGeneratingStory">Compartilhar no Story</span>

              <span v-else class="spinner-wrap">
                Gerando arte
                <span class="spinner story-spinner"></span>
              </span>
            </button>

            <button class="btn-text" type="button" @click="resetarFormulario">
              Fazer nova inscrição
            </button>
          </div>
        </div>
      </Transition>
    </main>

    <Transition name="fade">
      <div
        v-if="mostrarTermos"
        class="modal-overlay"
        @click.self="mostrarTermos = false"
      >
        <div class="modal-card" role="dialog" aria-modal="true">
          <header class="modal-header">
            <h3>Termos de Uso e Privacidade</h3>

            <button
              type="button"
              @click="mostrarTermos = false"
              class="btn-close"
              aria-label="Fechar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <div class="modal-body">
            <pre class="termos-conteudo">{{ textoTermos }}</pre>
          </div>

          <footer class="modal-footer">
            <button
              class="btn-primary w-full"
              type="button"
              @click="aceitaTermos = true; mostrarTermos = false"
            >
              Entendi e aceito
            </button>
          </footer>
        </div>
      </div>
    </Transition>

    <div class="story-export-wrapper">
      <div ref="storyNode" class="story-canvas">
        <div class="story-bg-graphics">
          <div class="circle-top"></div>
          <div class="circle-bottom"></div>
        </div>

        <div class="story-content-box">
          <div class="story-event-brand">
            <div class="story-icon">
              <img src="/LOGOS/logoSalip.svg" alt="SALIP 2" />
            </div>
          </div>

          <div class="story-badge">PRESENÇA CONFIRMADA</div>
              <img src="/LOGOS/artP.png" alt="SALIP 2" />
          <!-- <h2 class="story-title">
            Eu vou para o maior evento literário de Pedro II!
          </h2> -->

          <div class="story-ticket">
            <span class="user-label">Participante</span>
            <span class="user-name">{{ nomeStory }}</span>
            <span class="story-id">ID {{ form.idUsuario }}</span>
          </div>

          <div class="story-footer">
            <span class="story-hashtag">#EuNoSalip2</span>
            <span class="story-date">7 a 9 de Maio</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import html2canvas from 'html2canvas'

const $toast = useToast()

const etapaAtual = ref(1)
const steps = ['Perfil', 'Dados', 'Agenda', 'Revisão']

const progressWidth = computed(() => {
  return ((etapaAtual.value - 1) / (steps.length - 1)) * 100
})

const tipoParticipante = ref('aluno')
const aceitaTermos = ref(false)
const mostrarTermos = ref(false)
const isSubmitting = ref(false)
const isGeneratingStory = ref(false)
const nomeEnviado = ref('')
const nomeStory = ref('')
const ufAutomatica = ref(false)
const storyNode = ref(null)

const hoje = new Date().toISOString().split('T')[0]

const form = reactive({
  idUsuario: '',
  tipoParticipante: '',
  nomeCompleto: '',
  cidade: '',
  uf: '',
  dataNascimento: '',
  idade: null,
  escola: '',
  localTrabalho: '',
  telefone: '',
  categorias: [],
  oficinasSelecionadas: [],
  exposicoesSelecionadas: [],
  palestrasSelecionadas: [],
})

const erros = reactive({})

const dias = [
  { value: '07', label: '07/05', diaSemana: 'Quinta' },
  { value: '08', label: '08/05', diaSemana: 'Sexta' },
  { value: '09', label: '09/05', diaSemana: 'Sábado' },
]

const categorias = [
  { value: 'todos', label: 'Todos', cor: '#64748b' },
  { value: 'abertura', label: 'Abertura', cor: '#0D1B5E' },
  { value: 'acolhida', label: 'Acolhidas', cor: '#059669' },
  { value: 'palestra', label: 'Palestras', cor: '#0D1B5E' },
  { value: 'batepapo', label: 'Bate-papos', cor: '#D97706' },
  { value: 'mesa', label: 'Mesas', cor: '#7C3AED' },
  { value: 'lancamento', label: 'Lançamentos', cor: '#DB2777' },
  { value: 'oficina', label: 'Oficinas', cor: '#2563EB' },
  { value: 'show', label: 'Shows', cor: '#7C3AED' },
  { value: 'exposicao', label: 'Exposição', cor: '#D97706' },
]

const catMeta = {
  abertura: {
    label: 'Abertura',
    cor: '#0D1B5E',
  },
  acolhida: {
    label: 'Acolhida',
    cor: '#059669',
  },
  palestra: {
    label: 'Palestra',
    cor: '#0D1B5E',
  },
  batepapo: {
    label: 'Bate-papo',
    cor: '#D97706',
  },
  mesa: {
    label: 'Mesa',
    cor: '#7C3AED',
  },
  lancamento: {
    label: 'Lançamento',
    cor: '#DB2777',
  },
  oficina: {
    label: 'Oficina',
    cor: '#2563EB',
  },
  show: {
    label: 'Show',
    cor: '#7C3AED',
  },
  exposicao: {
    label: 'Exposição',
    cor: '#D97706',
  },
}

const locais = {
  ciro: {
    nome: 'Espaço de Eventos Deputado Ciro Nogueira',
    mapsUrl:
      'https://maps.google.com/?q=Espaço+de+Eventos+Deputado+Ciro+Nogueira+Pedro+II+PI',
  },

  mgf: {
    nome: 'Espaço MGF Eventos',
    mapsUrl: 'https://maps.google.com/?q=Espaço+MGF+Eventos+Pedro+II+PI',
  },

  praca: {
    nome: 'Praça Domingos Mourão Filho',
    mapsUrl: 'https://maps.google.com/?q=Praça+Domingos+Mourão+Pedro+II+PI',
  },

  pracaFilho: {
    nome: 'Praça Domingos Mourão Filho',
    mapsUrl:
      'https://maps.google.com/?q=Praça+Domingos+Mourão+Filho+Pedro+II+PI',
  },

  joseTeixeira: {
    nome: 'José Teixeira Santos',
    mapsUrl: 'https://maps.google.com/?q=José+Teixeira+Santos+Pedro+II+PI',
  },

  memorialBrandaoTertulianoFilho: {
    nome: 'Memorial Tertuliano Brandão Filho',
    mapsUrl:
      'https://www.google.com/maps/place/Memorial+Tertuliano+Filho/@-4.426702,-41.4619606,17z/data=!3m1!4b1!4m6!3m5!1s0x7939b178bebddf1:0x95960a0d41967966!8m2!3d-4.4267074!4d-41.4593857!16s%2Fg%2F11g_ydb6l9?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D',
  },
}

const todosEventos = [
  {
    dia: '07',
    horario: '18h30',
    periodo: 'Noite',
    _cat: 'abertura',
    titulo: 'Solenidade Oficial de Abertura do 4º SaLiP2',
    descricaoLimpa:
      'Abertura oficial do 4º Salão do Livro de Pedro II, com discursos de autoridades e homenageados.',
    vagas: null,
    _local: locais.ciro,
  },
  {
    dia: '07',
    horario: '19h00',
    periodo: 'Noite',
    _cat: 'palestra',
    titulo: 'Palestra de abertura: O desafio das grandes reportagens',
    descricaoLimpa:
      'Palestrante: Francisco José. Apresentação/Mediação: Wilson Brandão.',
    vagas: null,
    _local: locais.ciro,
  },
  {
    dia: '07',
    horario: '21h00',
    periodo: 'Noite',
    _cat: 'show',
    titulo: 'Show musical com Marcos Aurélio',
    descricaoLimpa: 'Apresentação musical de Marcos Aurélio.',
    vagas: null,
    _local: locais.ciro,
  },

  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'exposicao',
    titulo:
      'Exposição de acervos históricos do Núcleo de Memória do Tribunal de Justiça do Piauí - TJ/PI',
    descricaoLimpa: '',
    vagas: null,
    _local: locais.memorialBrandaoTertulianoFilho,
  },
  {
    dia: '08',
    horario: '07h30',
    periodo: 'Manhã',
    _cat: 'acolhida',
    titulo: 'Acolhida: Marcos Aurélio',
    descricaoLimpa: 'Abertura da programação da manhã com Marcos Aurélio.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 1',
    descricaoLimpa: 'Ministrante: Dinael Viana.',
    vagas: 25,
    _local: locais.joseTeixeira,
  },
  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 2',
    descricaoLimpa: 'Ministrante: Genary Viana Barroso.',
    vagas: 20,
    _local: locais.joseTeixeira,
  },
  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura Acrílica',
    descricaoLimpa: 'Ministrante: José de Arimatéa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Produção de Caricaturas',
    descricaoLimpa: 'Ministrante: Juniel Sousa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura a Óleo',
    descricaoLimpa: 'Ministrante: José de Arimatéa..',
    vagas: 3,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '08h30',
    periodo: 'Manhã',
    _cat: 'lancamento',
    titulo:
      'Bate-papo e lançamentos de livros de escritoras e escritores pedro-segundenses',
    descricaoLimpa:
      'Convidados: Amadeu Messias, Aldenira Martins e Claísse Sales. Apresentação/Mediação: APLA.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '09h00',
    periodo: 'Manhã',
    _cat: 'batepapo',
    titulo:
      'Bate-papo e exibição do filme: O Sacro e o Profano de Araújo e Verônica',
    descricaoLimpa:
      'Palestrante: Rivanildo Feitosa. Apresentação/Mediação: Wilson Brandão.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '10h30',
    periodo: 'Manhã',
    _cat: 'palestra',
    titulo: 'Pedro II, 200 anos: um homem, uma cidade',
    descricaoLimpa:
      'Palestrante: Fonseca Neto. Apresentação/Mediação: Wilson Brandão.',
    vagas: null,
    _local: locais.mgf,
  },

  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'acolhida',
    titulo: 'Acolhida: Marcos Aurélio',
    descricaoLimpa: 'Abertura da programação da tarde com Marcos Aurélio.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 1',
    descricaoLimpa: 'Ministrante: Dinael Viana.',
    vagas: 25,
    _local: locais.joseTeixeira,
  },
  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 2',
    descricaoLimpa: 'Ministrante: Genary Viana Barroso.',
    vagas: 20,
    _local: locais.joseTeixeira,
  },
  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura Acrílica',
    descricaoLimpa: 'Ministrante: José de Arimatéa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'oficina',
    titulo: 'Oficina de Produção de Caricaturas',
    descricaoLimpa: 'Ministrante: Juniel Sousa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura a Óleo',
    descricaoLimpa: 'Ministrante: José de Arimatéa..',
    vagas: 3,
    _local: locais.pracaFilho,
  },
  {
    dia: '08',
    horario: '14h30',
    periodo: 'Tarde',
    _cat: 'lancamento',
    titulo:
      'Bate-papo e lançamentos de livros de escritoras e escritores pedro-segundenses',
    descricaoLimpa:
      'Convidados: Rameiro Junior, Eduardo Albuquerque, Ernâni Getirana e Gerciane Lima. Apresentação/Mediação: APLA.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '15h00',
    periodo: 'Tarde',
    _cat: 'palestra',
    titulo:
      'Educar com IA ou se educar para a IA? O futuro dos jovens nesta desafiante era',
    descricaoLimpa:
      'Palestrante: Dr. Marcelo Mesquita. Apresentação/Mediação: Helany Max.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '16h30',
    periodo: 'Tarde',
    _cat: 'mesa',
    titulo:
      'Mulheres que Escrevem: A Literatura de Marina Campelo, Lúcia Ana e Graça Targino',
    descricaoLimpa:
      'Mesa com Marina Campelo, Lúcia Ana e Graça Targino. Apresentação/Mediação: Ernâni Getirana.',
    vagas: null,
    _local: locais.mgf,
  },

  {
    dia: '08',
    horario: '18h30',
    periodo: 'Noite',
    _cat: 'acolhida',
    titulo: 'Acolhida: Marcos Aurélio',
    descricaoLimpa: 'Abertura da programação da noite com Marcos Aurélio.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '19h00',
    periodo: 'Noite',
    _cat: 'palestra',
    titulo: 'Quando o professor acredita, a educação acontece',
    descricaoLimpa:
      'Palestrante: Hamilton Werneck. Apresentação/Mediação: Wilson Brandão.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '08',
    horario: '21h00',
    periodo: 'Noite',
    _cat: 'show',
    titulo: 'Show com a Banda Mistura Fina',
    descricaoLimpa: 'Apresentação musical da Banda Mistura Fina, de Piripiri.',
    vagas: null,
    _local: locais.praca,
  },

  {
    dia: '09',
    horario: '07h30',
    periodo: 'Manhã',
    _cat: 'acolhida',
    titulo: 'Acolhida: Sonayra',
    descricaoLimpa: 'Abertura da programação da manhã com Sonayra.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 1',
    descricaoLimpa: 'Ministrante: Dinael Viana.',
    vagas: 25,
    _local: locais.joseTeixeira,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Experimentos Científicos - 2',
    descricaoLimpa: 'Ministrante: Genary Viana Barroso.',
    vagas: 20,
    _local: locais.joseTeixeira,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura Acrílica',
    descricaoLimpa: 'Ministrante: José de Arimatéa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Produção de Caricaturas',
    descricaoLimpa: 'Ministrante: Juniel Sousa.',
    vagas: 15,
    _local: locais.pracaFilho,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'oficina',
    titulo: 'Oficina de Pintura a Óleo',
    descricaoLimpa: 'Ministrante: José de Arimatéa..',
    vagas: 3,
    _local: locais.pracaFilho,
  },
  {
    dia: '09',
    horario: '08h00',
    periodo: 'Manhã',
    _cat: 'lancamento',
    titulo:
      'Bate-papo e lançamentos de livros de escritoras e escritores pedro-segundenses',
    descricaoLimpa:
      'Convidados: Humberto Cordeiro, Ioman Malaquias, Raimundo Silva e Dayse Benício. Apresentação/Mediação: APLA.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '08h30',
    periodo: 'Manhã',
    _cat: 'mesa',
    titulo: 'Tempo e memória na literatura de Sérgia Alves',
    descricaoLimpa:
      'Mesa com Algemira Mendes e Sérgia Alves. Apresentação/Mediação: Marleide Lins.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '10h30',
    periodo: 'Manhã',
    _cat: 'palestra',
    titulo:
      'A estratégia do matuto: criação e técnica literária na poética de Genuíno Sales',
    descricaoLimpa:
      'Palestrante: Ernâni Getirana. Apresentação/Mediação: APLA.',
    vagas: null,
    _local: locais.mgf,
  },

  {
    dia: '09',
    horario: '14h00',
    periodo: 'Tarde',
    _cat: 'acolhida',
    titulo: 'Acolhida: Sonayra',
    descricaoLimpa: 'Abertura da programação da tarde com Sonayra.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '14h30',
    periodo: 'Tarde',
    _cat: 'lancamento',
    titulo:
      'Bate-papo e lançamentos de livros de escritoras e escritores pedro-segundenses',
    descricaoLimpa:
      'Convidados: Ricardo Resende, Socorro Almeida, Cleandro Oliveira e Wilson Brandão, em parceria com Zózimo Tavares. Apresentação/Mediação: APLA.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '15h30',
    periodo: 'Tarde',
    _cat: 'palestra',
    titulo:
      'Casal de escritores: gênese de escrita literária de ficção investigativa',
    descricaoLimpa:
      'Palestrantes: Normandes Malta e Jasmine Malta. Apresentação/Mediação: Helany Max.',
    vagas: null,
    _local: locais.mgf,
  },

  {
    dia: '09',
    horario: '18h30',
    periodo: 'Noite',
    _cat: 'acolhida',
    titulo: 'Acolhida: Sonayra',
    descricaoLimpa: 'Abertura da programação da noite com Sonayra.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '19h00',
    periodo: 'Noite',
    _cat: 'palestra',
    titulo: 'A crise invisível na educação',
    descricaoLimpa:
      'Palestrante: Márcio Lima. Apresentação/Mediação: Kássio Gomes.',
    vagas: null,
    _local: locais.mgf,
  },
  {
    dia: '09',
    horario: '20h00',
    periodo: 'Noite',
    _cat: 'show',
    titulo: 'Show com Gonzaga Lu e Trio Asa Branca',
    descricaoLimpa: 'Show musical com Gonzaga Lu e Trio Asa Branca.',
    vagas: null,
    _local: locais.praca,
  },
]

const catParaFiltro = {
  abertura: 'abertura',
  acolhida: 'acolhida',
  palestra: 'palestra',
  batepapo: 'batepapo',
  mesa: 'mesa',
  lancamento: 'lancamento',
  oficina: 'oficina',
  show: 'show',
  exposicao: 'exposicao',
}

const opcoesTipo = [
  {
    valor: 'aluno',
    label: 'Estudante',
    desc: 'Aluno de escola ou universidade',
    icon: '🎒',
  },
  {
    valor: 'funcionario',
    label: 'Profissional',
    desc: 'Professor, servidor ou gestor',
    icon: '💼',
  },
  {
    valor: 'visitante',
    label: 'Visitante',
    desc: 'Comunidade em geral',
    icon: '🎟️',
  },
]

const cidadesComUF = {
  'Pedro II': 'PI',
  Teresina: 'PI',
  Parnaíba: 'PI',
  Piripiri: 'PI',
  'Campo Maior': 'PI',
  Picos: 'PI',
  Fortaleza: 'CE',
  Sobral: 'CE',
  'Juazeiro do Norte': 'CE',
  'São Luís': 'MA',
  'Outra cidade': '',
}

const cidadesAgrupadas = [
  {
    estado: 'Piauí',
    cidades: ['Pedro II', 'Teresina', 'Parnaíba', 'Piripiri', 'Campo Maior', 'Picos'],
  },
  {
    estado: 'Ceará',
    cidades: ['Fortaleza', 'Sobral', 'Juazeiro do Norte'],
  },
  {
    estado: 'Maranhão',
    cidades: ['São Luís'],
  },
  {
    estado: 'Outros',
    cidades: ['Outra cidade'],
  },
]

const escolas = [
'E. M. Canto da Várzea',
'E. M. Cipó',
'E. M. Expedito Pinheiro dos Santos',
'E. M. Profº. Manoel Cunha',
'E. M. Tomás Gonçalves de Sousa',
'E. M. Lagoa do Sucuruju',
'E. M. Gonçalo Medeiro Uchôa ',
'E. M. Inês Passos Galvão',
'E. M. José Teixeira Santos',
'U. E. Cipriano Leite',
'E. M. Monsenhor Lotário Weber',
'E. M. Educação infantil Chapeuzinho Vermelho',
'E. M. Educação Infatil Tia Alice',
'E. M. João Benício da Silva',
'Anexo - João Benício da Silva',
'E. M. Manoel Nogueira Lima',
'E. M. Tapera',
'E. M. Tucuns dos Donatos',
'E. M. Pedro Antonio da Silva',
'E. M. Tempo Integral Santa Ângela ',
'E. M. de Tempo Integral Irmã Maria Gerhard',
'Anexo - E. M. de Tempo Integral Irmã Maria Gerhard',
'E. M. Vovó Inácia',
'CEMEI Dr. Walmir Café',
'U. E. Alfredo Monteiro Alves',
'E. M. Formiga',
'E. M. Lapa',
'E. M. Lourenço Barroso de Oliveira',
'E. M. Olho d água dos ',
'E. M. Olho d água dos Paulinos',
'E. M. São Luis de Cima',
'E. M. São Miguel',
'E. de E. Infantil Maria de Lurdes Viana dos Santos',
'E. M. Felipe',
'G. E. Arlindo  Oliveira do Monte',
'G. E. Clemente Pereira de Sousa',
'E. M. Domingos Alves de Oliveira',
'E. Teodora Lima Olegario',
'E. M. Mufumbo ',
'E. M. Maria Luisa Leite',
'E. M. Maria Luisa Malaquias',
'Escola de educação Infantil Branca de Neve',
  'Outra escola',
]

function getDiaLabel(dia) {
  const encontrado = dias.find((item) => item.value === dia)
  return encontrado ? `${encontrado.label} • ${encontrado.diaSemana}` : dia
}

function ordenarPorDiaHorario(a, b) {
  const dataA = `${a.dia}${a.horario.replace(/\D/g, '').padEnd(4, '0')}`
  const dataB = `${b.dia}${b.horario.replace(/\D/g, '').padEnd(4, '0')}`

  return dataA.localeCompare(dataB)
}

function formatarEventoParaOpcao(evento) {
  const vagasTexto = evento.vagas ? ` • ${evento.vagas} vagas` : ''
  const localTexto = evento._local?.nome ? ` • ${evento._local.nome}` : ''

  return `${getDiaLabel(evento.dia)} • ${evento.horario} • ${evento.titulo}${vagasTexto}${localTexto}`
}

function eventosPorCategoria(categoria) {
  return todosEventos
    .filter((evento) => evento._cat === categoria)
    .sort(ordenarPorDiaHorario)
    .map(formatarEventoParaOpcao)
}

const oficinas = eventosPorCategoria('oficina')
const exposicoes = eventosPorCategoria('exposicao')
const palestras = eventosPorCategoria('palestra')

const batepapos = eventosPorCategoria('batepapo')
const mesas = eventosPorCategoria('mesa')
const lancamentos = eventosPorCategoria('lancamento')
const shows = eventosPorCategoria('show')

const categoriasAtividades = [
  {
    id: 'oficinas',
    label: 'Oficinas',
    icon: '🎨',
    total: oficinas.length,
  },
  {
    id: 'exposicoes',
    label: 'Exposição Histórica',
    icon: '🏛️',
    total: exposicoes.length,
  },
  {
    id: 'palestras',
    label: 'Palestras Oficiais',
    icon: '🎤',
    total: palestras.length,
  },
]

const labelTipo = computed(() => {
  return (
    opcoesTipo.find((opcao) => opcao.valor === tipoParticipante.value)?.label ||
    'Participante'
  )
})

watch(
  () => form.cidade,
  (cidade) => {
    if (cidade && cidadesComUF[cidade]) {
      form.uf = cidadesComUF[cidade]
      ufAutomatica.value = true
    } else {
      ufAutomatica.value = false

      if (cidade === 'Outra cidade') {
        form.uf = ''
      }
    }
  }
)

watch(tipoParticipante, () => {
  delete erros.escola
  delete erros.localTrabalho

  if (tipoParticipante.value !== 'aluno') {
    form.escola = ''
  }

  if (tipoParticipante.value !== 'funcionario') {
    form.localTrabalho = ''
  }
})

watch(
  () => [...form.categorias],
  (categoriasSelecionadas) => {
    if (!categoriasSelecionadas.includes('oficinas')) {
      form.oficinasSelecionadas = []
      delete erros.oficinas
    }

    if (!categoriasSelecionadas.includes('exposicoes')) {
      form.exposicoesSelecionadas = []
      delete erros.exposicoes
    }

    if (!categoriasSelecionadas.includes('palestras')) {
      form.palestrasSelecionadas = []
      delete erros.palestras
    }

    if (categoriasSelecionadas.length === 0) {
      form.telefone = ''
      delete erros.telefone
    }
  }
)

function limparTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : valor
}

function gerarIdCurto(tamanho = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''

  for (let i = 0; i < tamanho; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return id
}

async function gerarIdUsuarioUnico() {
  let tentativas = 0
  const limiteTentativas = 30

  while (tentativas < limiteTentativas) {
    const id = gerarIdCurto(4)
    const refUsuario = doc(db, 'inscricoes_salip2', id)
    const snap = await getDoc(refUsuario)

    if (!snap.exists()) {
      return id
    }

    tentativas++
  }

  throw new Error('Não foi possível gerar um ID único.')
}

function montarDadosUsuario(idUsuario) {
  const idade = calcIdade(form.dataNascimento)

  return {
    idUsuario,

    evento: {
      nome: '4º SaLiP2 — Salão do Livro de Pedro II',
      ano: 2026,
      periodo: '07 a 09 de maio de 2026',
      cidade: 'Pedro II',
      uf: 'PI',
    },

    participante: {
      tipo: tipoParticipante.value,
      tipoLabel: labelTipo.value,
      nomeCompleto: limparTexto(form.nomeCompleto),
      primeiroNome: limparTexto(form.nomeCompleto).split(' ')[0] || '',
      cidade: form.cidade,
      uf: form.uf.toUpperCase(),
      dataNascimento: form.dataNascimento,
      idade,
      escola: tipoParticipante.value === 'aluno' ? form.escola : '',
      localTrabalho:
        tipoParticipante.value === 'funcionario'
          ? limparTexto(form.localTrabalho)
          : '',
      telefone: limparTexto(form.telefone),
    },

    agenda: {
      possuiAtividadesExtras: form.categorias.length > 0,
      categorias: [...form.categorias],
      oficinas: [...form.oficinasSelecionadas],
      exposicoes: [...form.exposicoesSelecionadas],
      palestras: [...form.palestrasSelecionadas],
    },

    programacaoBase: {
      totalEventos: todosEventos.length,
      totalOficinas: oficinas.length,
      totalExposicoes: exposicoes.length,
      totalPalestras: palestras.length,
      versao: 'SALIP2-2026-programacao-atualizada-v2',
    },

    consentimento: {
      aceitouTermos: aceitaTermos.value,
      textoTermosVersao: 'SALIP2-2026-v2',
      aceitoEm: serverTimestamp(),
    },

    controle: {
      status: 'confirmada',
      origem: 'formulario_site',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    },
  }
}

function validarCampo(campo) {
  delete erros[campo]

  if (campo === 'nomeCompleto') {
    if (!form.nomeCompleto.trim()) {
      erros.nomeCompleto = 'Informe seu nome completo.'
    } else if (form.nomeCompleto.trim().split(' ').length < 2) {
      erros.nomeCompleto = 'Digite nome e sobrenome.'
    }
  }

  if (campo === 'cidade' && !form.cidade) {
    erros.cidade = 'Selecione sua cidade.'
  }

  if (campo === 'uf') {
    const uf = form.uf.trim().toUpperCase()

    if (!uf) {
      erros.uf = 'Insira a sigla do estado.'
    } else if (!/^[A-Z]{2}$/.test(uf)) {
      erros.uf = 'Use apenas 2 letras.'
    }
  }

  if (campo === 'dataNascimento') {
    if (!form.dataNascimento) {
      erros.dataNascimento = 'Insira sua data de nascimento.'
    } else if (new Date(form.dataNascimento) > new Date()) {
      erros.dataNascimento = 'A data não pode ser no futuro.'
    }
  }

  if (campo === 'escola') {
    if (tipoParticipante.value === 'aluno' && !form.escola) {
      erros.escola = 'Selecione sua instituição.'
    }
  }

  if (campo === 'localTrabalho') {
    if (tipoParticipante.value === 'funcionario' && !form.localTrabalho.trim()) {
      erros.localTrabalho = 'Informe o local de trabalho.'
    }
  }

  if (campo === 'telefone') {
    if (form.categorias.length > 0 && !form.telefone.trim()) {
      erros.telefone = 'Informe seu WhatsApp.'
    } else if (
      form.telefone.trim() &&
      form.telefone.replace(/\D/g, '').length < 10
    ) {
      erros.telefone = 'Informe um telefone válido.'
    }
  }
}

function validarEtapa2() {
  ;['nomeCompleto', 'cidade', 'uf', 'dataNascimento'].forEach(validarCampo)

  if (tipoParticipante.value === 'aluno') {
    validarCampo('escola')
  }

  if (tipoParticipante.value === 'funcionario') {
    validarCampo('localTrabalho')
  }

  if (Object.keys(erros).length === 0) {
    irParaEtapa(3)
  } else {
    $toast.error('Revise os campos destacados antes de continuar.')
  }
}

function validarEtapa3() {
  delete erros.telefone
  delete erros.oficinas
  delete erros.exposicoes
  delete erros.palestras

  let hasError = false

  if (form.categorias.length > 0) {
    validarCampo('telefone')

    if (erros.telefone) {
      hasError = true
    }

    if (
      form.categorias.includes('oficinas') &&
      form.oficinasSelecionadas.length === 0
    ) {
      erros.oficinas = 'Selecione ao menos uma oficina.'
      hasError = true
    }

    if (
      form.categorias.includes('exposicoes') &&
      form.exposicoesSelecionadas.length === 0
    ) {
      erros.exposicoes = 'Selecione ao menos um horário da exposição.'
      hasError = true
    }

    if (
      form.categorias.includes('palestras') &&
      form.palestrasSelecionadas.length === 0
    ) {
      erros.palestras = 'Selecione ao menos uma palestra.'
      hasError = true
    }
  }

  if (!hasError) {
    irParaEtapa(4)
  } else {
    $toast.error('Escolha as atividades marcadas ou corrija o WhatsApp.')
  }
}

function irParaEtapa(n) {
  etapaAtual.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  delete erros.termos

  if (!aceitaTermos.value) {
    erros.termos = 'Você precisa aceitar os termos de uso para continuar.'
    $toast.error('Aceite os termos para confirmar sua inscrição.')
    return
  }

  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const idUsuario = await gerarIdUsuarioUnico()

    form.idUsuario = idUsuario
    form.tipoParticipante = tipoParticipante.value
    form.idade = calcIdade(form.dataNascimento)

    const dadosUsuario = montarDadosUsuario(idUsuario)

    await setDoc(doc(db, 'inscricoes_salip2', idUsuario), dadosUsuario)

    nomeEnviado.value = limparTexto(form.nomeCompleto).split(' ')[0]
    nomeStory.value = limparTexto(form.nomeCompleto)

    etapaAtual.value = 5

    $toast.success(`Inscrição confirmada! Seu ID é ${idUsuario}.`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error(err)
    $toast.error(
      'Não foi possível confirmar sua inscrição. Verifique sua conexão e tente novamente.'
    )
  } finally {
    isSubmitting.value = false
  }
}

function resetarFormulario() {
  Object.assign(form, {
    idUsuario: '',
    tipoParticipante: '',
    nomeCompleto: '',
    cidade: '',
    uf: '',
    dataNascimento: '',
    idade: null,
    escola: '',
    localTrabalho: '',
    telefone: '',
    categorias: [],
    oficinasSelecionadas: [],
    exposicoesSelecionadas: [],
    palestrasSelecionadas: [],
  })

  Object.keys(erros).forEach((key) => delete erros[key])

  tipoParticipante.value = 'aluno'
  aceitaTermos.value = false
  mostrarTermos.value = false
  nomeEnviado.value = ''
  nomeStory.value = ''
  etapaAtual.value = 1

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function gerarStory() {
  if (!storyNode.value || isGeneratingStory.value) return

  isGeneratingStory.value = true

  try {
    await nextTick()

    const canvas = await html2canvas(storyNode.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0D1B5E',
      width: 1080,
      height: 1920,
    })

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92)

    if (navigator.share) {
      try {
        const blob = await (await fetch(imageDataUrl)).blob()
        const file = new File([blob], 'salip2-story.jpg', {
          type: 'image/jpeg',
        })

        await navigator.share({
          title: 'Minha inscrição no SaLiP2',
          text: 'Minha inscrição no 4º SaLiP2 está confirmada! #EuNoSalip2',
          files: [file],
        })

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

  const d = new Date(dob)
  const now = new Date()

  let age = now.getFullYear() - d.getFullYear()

  if (
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
  ) {
    age--
  }

  return age
}

function formatarData(data) {
  if (!data) return ''

  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function mascararTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)

  if (numeros.length <= 2) {
    return numeros
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

const textoTermos = `TERMOS DE USO E POLÍTICA DE PRIVACIDADE – SALIP 2

1. Finalidade
Os dados informados neste formulário serão utilizados exclusivamente para organização da inscrição, controle de participação, emissão de crachás, certificados e comunicação sobre atividades do 4º SaLiP2 — Salão do Livro de Pedro II.

2. Dados coletados
Podemos coletar nome completo, cidade, UF, data de nascimento, tipo de participante, escola, local de trabalho, telefone e atividades selecionadas.

3. Uso das informações
As informações serão usadas para identificação do participante, organização da agenda, confirmação de inscrição, emissão de certificado e comunicação relacionada ao evento.

4. Compartilhamento
Os dados não serão vendidos. Poderão ser acessados apenas pela equipe organizadora e por prestadores envolvidos diretamente na realização do evento.

5. Consentimento
Ao aceitar estes termos, você declara estar ciente da coleta e do uso dos dados para as finalidades descritas.

6. Segurança
A organização adotará medidas razoáveis para proteger as informações enviadas.

7. Solicitações
O participante poderá solicitar correção ou remoção de seus dados entrando em contato com a organização do evento.`
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --c-blue: #144181;
  --c-blue-hover: #0f3368;
  --c-blue-soft: #eaf2ff;
  --c-blue-soft-strong: #dbeafe;
  --c-yellow: #d8df52;
  --c-yellow-hover: #c4cc42;
  --c-dark: #172033;
  --c-text: #334155;
  --c-muted: #64748b;
  --c-border: #dbe3ef;
  --c-bg: #f3f7fb;
  --c-white: #ffffff;
  --c-error: #dc2626;
  --c-error-bg: #fff1f2;
  --c-success: #16a34a;
  --radius: 18px;
  --shadow: 0 18px 50px -18px rgba(20, 65, 129, 0.28);
}

* {
  box-sizing: border-box;
  margin: 0;
  color: black;
  padding: 0;
}

button,
input,
select {
  font: inherit;
}

button {
  outline: none;
}

button:disabled {
  cursor: not-allowed;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.page-wrap {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(216, 223, 82, 0.25), transparent 30rem),
    linear-gradient(180deg, #eef5ff 0%, var(--c-bg) 45%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--c-dark);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #b8c9df;
  letter-spacing: -0.06em;
  line-height: 1;
}

.brand-subtitle {
  font-size: 0.82rem;
  font-weight: 700;
  color: #b8c9df;

  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 0.55rem;
}
.tt{
  color: #16a34a;
}
.progress-wrap {
  width: 100%;
  max-width: 680px;
  margin-bottom: 2rem;
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
  left: 12%;
  right: 12%;
  height: 4px;
  background: #dce7f5;
  z-index: 0;
  border-radius: 999px;
}

.step-line-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-blue), #2563eb);
  transition: width 0.4s ease;
  border-radius: 999px;

}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  z-index: 1;
  flex: 1;

}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #0651c1;
  border: 3px solid #dce7f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 800;
  color: #0651c1;
  transition: all 0.25s ease;
}

.step-item.active .step-circle {
  border-color: #b8c9df;
  color: #b8c9df;
  box-shadow: 0 0 0 5px rgba(20, 65, 129, 0.1);
}

.step-item.done .step-circle {
  background: #b8c9df;
  border-color: var(--c-blue);
  color: #16a34a;

}

.step-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: #b8c9df;
  transition: color 0.25s ease;
}

.step-item.active .step-label {
  color: #7d8500;
}

.form-card {
  width: 100%;
  max-width: 680px;
  background: rgba(255, 255, 255, 0.94);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid rgba(20, 65, 129, 0.1);
  overflow: hidden;
  position: relative;

}

.etapa {
  padding: clamp(1.5rem, 5vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;

}

.etapa-header {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.etapa-tag {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--c-blue);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.etapa-title {
  font-size: clamp(1.65rem, 5vw, 2rem);
  font-weight: 800;
  color: var(--c-dark);
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.etapa-desc {
  font-size: 0.95rem;
  color: var(--c-muted);
  line-height: 1.6;
}

.tipo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.tipo-card {
  border: 2px solid var(--c-border);
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
  background: #f8fbff;
}

.tipo-card:hover,
.tipo-card:focus-within {
  border-color: #396196;
  background: var(--c-white);
  transform: translateY(-2px);
}

.tipo-card.selected,
.checkbox-card.selected,
.opcao-item.selected {
  border-color: var(--c-blue);
  background: var(--c-blue-soft);
  box-shadow: 0 12px 28px rgba(20, 65, 129, 0.12);
  border: 2px solid #16a34a;

}

.tipo-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.tipo-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tipo-label {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--c-dark);
}

.tipo-desc {
  font-size: 0.76rem;
  color: var(--c-muted);
  line-height: 1.45;
}

.tipo-check {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 999px;
  background: #16a34a;
  color: var(--c-white);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.6);
  transition: 0.2s ease;
}

.tipo-card.selected .tipo-check {
  opacity: 1;
  transform: scale(1);
  
}

.fields-col {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 1rem;
}

.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--c-dark);
}

.req {
  color: var(--c-error);
}

.field-input {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 2px solid var(--c-border);
  border-radius: 0.8rem;
  font-size: 0.95rem;
  color: var(--c-dark);
  transition: all 0.2s ease;
  outline: none;
  background: #f8fbff;
}

.field-input::placeholder {
  color: #8da0b8;
}

.field-input:focus {
  border-color: var(--c-blue);
  background: var(--c-white);
  box-shadow: 0 0 0 4px rgba(20, 65, 129, 0.08);
}

.field-input:read-only {
  background: #eef4fb;
  color: var(--c-muted);
}

.text-center {
  text-align: center;
}

.field-wrap.error .field-input {
  border-color: var(--c-error);
  background: var(--c-error-bg);
}

.field-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2rem;
}

.field-msg {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--c-error);
  animation: fadeIn 0.2s;
  margin-top: 0.2rem;
}

.field-hint {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-muted);
}

.select-wrap {
  position: relative;
}

select.field-input {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--c-muted);
  font-size: 1rem;
}

.evento-selecao {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.evento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.checkbox-card {
  border: 2px solid var(--c-border);
  border-radius: 1rem;
  padding: 1.1rem 0.85rem;
  min-height: 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  cursor: pointer;
  transition: 0.2s ease;
  position: relative;
  text-align: center;
  background: #f8fbff;
}

.checkbox-card:hover {
  border-color: #b8c9df;
  background: var(--c-white);
  transform: translateY(-2px);
}

.evento-icon {
  font-size: 1.55rem;
  line-height: 1;
}

.evento-nome {
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--c-dark);
  line-height: 1.3;
}

.checkbox-indicator {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #bcc9da;
  border-radius: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  transition: 0.2s ease;
  background: var(--c-white);
}

.checkbox-card.selected .checkbox-indicator {
  background: var(--c-blue);
  border-color: var(--c-blue);
  color: var(--c-white);
}

.sub-atividade-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.35rem;
  background: #f8fbff;
  border-radius: 1rem;
  border: 1px solid var(--c-border);
  margin-top: 0.25rem;
}

.atividade-bloco {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bloco-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--c-blue);
}

.opcoes-lista {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.opcao-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  background: var(--c-white);
  border: 2px solid var(--c-border);
  border-radius: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.opcao-item:hover {
  border-color: #b8c9df;
}

.opcao-check {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.42rem;
  border: 2px solid #bcc9da;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-white);
  flex-shrink: 0;
  transition: 0.2s ease;
  background: var(--c-white);
}

.opcao-item.selected .opcao-check {
  background: var(--c-blue);
  border-color: var(--c-blue);
}

.opcao-texto {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-dark);
  line-height: 1.35;
}

.resumo-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resumo-card {
  background: #f8fbff;
  border: 1px solid var(--c-border);
  border-radius: 1rem;
  padding: 1.35rem;
}

.resumo-card.highlight {
  background: var(--c-blue-soft);
  border-color: var(--c-blue-soft-strong);
}

.resumo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(20, 65, 129, 0.1);
  margin-bottom: 0.85rem;
}

.resumo-header strong {
  font-size: 1rem;
  color: var(--c-blue);
}

.badge-tipo {
  background: var(--c-yellow);
  color: var(--c-dark);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.btn-edit-link {
  background: none;
  border: none;
  color: var(--c-blue);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
}

.resumo-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.resumo-item dt {
  font-size: 0.88rem;
  color: var(--c-muted);
  font-weight: 700;
}

.resumo-item dd {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--c-dark);
  text-align: right;
  line-height: 1.35;
}

.resumo-atividades {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agenda-bloco span {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--c-dark);
  margin-bottom: 0.45rem;
  display: inline-block;
}

.agenda-bloco ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.agenda-bloco li {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-blue);
  padding-left: 1rem;
  position: relative;
  line-height: 1.35;
}

.agenda-bloco li::before {
  content: '•';
  color: #7d8500;
  position: absolute;
  left: 0;
  font-size: 1.2rem;
  line-height: 0.85rem;
}

.resumo-atividades.empty {
  text-align: center;
  color: var(--c-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.termos-wrap {
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 1rem;
}

.termos-label {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  cursor: pointer;
}

.termos-check {
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 0.45rem;
  border: 2px solid #bcc9da;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-white);
  flex-shrink: 0;
  transition: 0.2s ease;
  background: var(--c-white);
}

.termos-label.checked .termos-check {
  background: var(--c-blue);
  border-color: var(--c-blue);
}

.termos-text {
  font-size: 0.88rem;
  color: var(--c-dark);
  line-height: 1.55;
  font-weight: 600;
}

.link-inline {
  background: none;
  border: none;
  color: var(--c-blue);
  font-weight: 900;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.etapa-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.4rem;
  border-top: 1px solid var(--c-border);
  margin-top: 0.5rem;
}

.etapa-footer.sb {
  justify-content: space-between;
  gap: 1rem;
}

.btn-primary {
  background: var(--c-blue);
  color: var(--c-white);
  border: none;
  padding: 0.9rem 1.6rem;
  border-radius: 0.8rem;
  font-size: 0.95rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: var(--c-blue-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(20, 65, 129, 0.26);
}

.btn-secondary {
  background: var(--c-white);
  color: var(--c-text);
  border: 2px solid var(--c-border);
  padding: 0.78rem 1.6rem;
  border-radius: 0.8rem;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-secondary:hover {
  border-color: #b8c9df;
  color: var(--c-dark);
}

.btn-submit {
  background: var(--c-yellow);
  color: var(--c-dark);
  border: none;
  padding: 0.9rem 1.8rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  background: var(--c-yellow-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(160, 168, 35, 0.28);
}

.btn-submit:disabled {
  opacity: 0.75;
}

.spinner-wrap {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.spinner {
  width: 1.1rem;
  height: 1.1rem;
  border: 3px solid rgba(23, 32, 51, 0.14);
  border-top-color: currentColor;
  border-radius: 999px;
  animation: spin 1s linear infinite;
}

.sucesso-etapa {
  align-items: center;
  text-align: center;
  padding: clamp(2.5rem, 7vw, 4rem) clamp(1.5rem, 5vw, 2rem);
}

.sucesso-anim {
  font-size: 5.5rem;
  animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  margin-bottom: 0.5rem;
}

.sucesso-titulo {
  font-size: clamp(1.8rem, 6vw, 2.3rem);
  font-weight: 900;
  color: var(--c-blue);
  letter-spacing: -0.05em;
}

.sucesso-desc {
  font-size: 1rem;
  color: var(--c-muted);
  margin-bottom: 0.5rem;
  line-height: 1.65;
  max-width: 520px;
}

.id-confirmacao {
  width: 100%;
  max-width: 360px;
  background: var(--c-blue-soft);
  border: 1px solid var(--c-blue-soft-strong);
  border-radius: 1.2rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.id-label {
  font-size: 0.78rem;
  font-weight: 900;
  color: var(--c-blue);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.id-code {
  font-size: 2.4rem;
  color: var(--c-dark);
  letter-spacing: 0.12em;
  line-height: 1;
}

.id-confirmacao small {
  color: var(--c-muted);
  font-weight: 600;
  line-height: 1.45;
}

.acoes-sucesso {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
  margin-top: 0.5rem;
}

.btn-story {
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  color: var(--c-white);
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 12px 28px rgba(220, 39, 67, 0.28);
}

.btn-story:hover:not(:disabled) {
  transform: scale(1.025);
  box-shadow: 0 18px 36px rgba(220, 39, 67, 0.34);
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--c-muted);
  font-weight: 800;
  cursor: pointer;
  padding: 0.65rem;
}

.btn-text:hover {
  color: var(--c-blue);
  text-decoration: underline;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.62);
  backdrop-filter: blur(5px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s;
}

.modal-card {
  background: var(--c-white);
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  border-radius: 1.4rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
}

.modal-header {
  padding: 1.4rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--c-border);
}

.modal-header h3 {
  font-size: 1.08rem;
  font-weight: 900;
  color: var(--c-dark);
}

.btn-close {
  background: #f1f5f9;
  border: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--c-muted);
  transition: 0.2s ease;
}

.btn-close:hover {
  background: #e2e8f0;
  color: var(--c-error);
}

.modal-body {
  padding: 1.6rem;
  overflow-y: auto;
  flex: 1;
}

.termos-conteudo {
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--c-text);
  white-space: pre-wrap;
}

.modal-footer {
  padding: 1.3rem 1.6rem;
  border-top: 1px solid var(--c-border);
  background: #f8fbff;
}

.w-full {
  width: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(32px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
  background: #2734AF;
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

.circle-top,
.circle-bottom {
  position: absolute;
  border-radius: 999px;
  background: rgba(216, 223, 82, 0.18);
  filter: blur(6px);
}

.circle-top {
  width: 520px;
  height: 520px;
  top: -120px;
  right: -120px;
}

.circle-bottom {
  width: 680px;
  height: 680px;
  bottom: -220px;
  left: -180px;
}

.story-content-box {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 80px;
  padding: 140px 80px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  width: 900px;
}

.story-event-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
}

.story-icon img {
  max-width: 580px;
  max-height: 320px;
  object-fit: contain;
}

.story-badge {
  background-color: var(--c-yellow);
  color: var(--c-dark);
  font-size: 30px;
  font-weight: 900;
  padding: 20px 40px;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 80px;
  letter-spacing: 1px;
}

.story-title {
  color: var(--c-dark);
  font-size: 65px;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 900;
  line-height: 1.18;
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
  background-color: rgba(20, 65, 129, 0.06);
  border: 2px dashed rgba(20, 65, 129, 0.3);
}

.user-label {
  color: var(--c-blue);
  font-size: 28px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.user-name {
  color: var(--c-dark);
  font-size: 55px;
  font-weight: 900;
  line-height: 1.08;
}

.story-id {
  color: var(--c-muted);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.story-footer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.story-hashtag {
  color: var(--c-blue);
  font-size: 45px;
  font-weight: 900;
}

.story-date {
  color: var(--c-muted);
  font-size: 32px;
  font-weight: 700;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 650px) {
  .page-wrap {
    padding: 2rem 0.85rem 4rem;
  }

  .tipo-grid,
  .evento-grid,
  .field-row {
    grid-template-columns: 1fr;
  }

  .etapa-footer.sb {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary,
  .btn-submit,
  .w-full-mobile {
    width: 100%;
  }

  .resumo-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .resumo-item dd {
    text-align: left;
  }

  .sucesso-anim {
    font-size: 4.5rem;
  }
}
</style>