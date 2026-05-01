<template>
  <section class="wrapper">
    <form class="card" @submit.prevent="submitEvaluation">
      <header class="header">
        <span class="tag">SALIP 2 • Avaliação • Melhoria contínua</span>

        <h1>Avalie sua experiência</h1>

        <p>
          Sua opinião ajuda a equipe do SALIP 2 a entender o que funcionou bem,
          o que pode melhorar e quais atividades marcaram o público.
        </p>
      </header>

      <div class="privacy-alert">
        <div class="privacy-icon">🔒</div>

        <div>
          <strong>Você escolhe como quer se identificar</strong>
          <p>
            Sua avaliação pode ser enviada de forma anônima. Caso queira, você também
            pode deixar seu nome registrado junto com o comentário.
          </p>
        </div>
      </div>

      <div class="progress-box">
        <div class="progress-info">
          <span>Progresso da avaliação</span>
          <strong>{{ completedSteps }}/6</strong>
        </div>

        <div class="progress">
          <div :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div class="step">
        <div class="step-title">
          <span>1</span>

          <div>
            <h2>Identificação</h2>
            <p>Escolha se deseja enviar sua avaliação com nome ou de forma anônima.</p>
          </div>
        </div>

        <div class="identity-grid">
          <button
            type="button"
            class="identity-card"
            :class="{ selected: form.identificationMode === 'anonima' }"
            @click="selectIdentificationMode('anonima')"
          >
            <span class="identity-icon">🕊️</span>

            <span>
              <strong>Avaliar anonimamente</strong>
              <small>Seu nome não será salvo junto com a avaliação.</small>
            </span>

            <i>
              <svg
                v-if="form.identificationMode === 'anonima'"
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
            </i>
          </button>

          <button
            type="button"
            class="identity-card"
            :class="{ selected: form.identificationMode === 'identificada' }"
            @click="selectIdentificationMode('identificada')"
          >
            <span class="identity-icon">✍️</span>

            <span>
              <strong>Registrar meu nome</strong>
              <small>Seu nome será salvo junto com sua avaliação.</small>
            </span>

            <i>
              <svg
                v-if="form.identificationMode === 'identificada'"
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
            </i>
          </button>
        </div>

        <small v-if="errors.identificationMode">{{ errors.identificationMode }}</small>

        <Transition name="fade">
          <div class="field name-field" v-if="form.identificationMode === 'identificada'">
            <label for="name">Nome <b>*</b></label>

            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              placeholder="Ex: Maria Eduarda"
              autocomplete="name"
              @input="clearFieldError('name')"
            />

            <small v-if="errors.name">{{ errors.name }}</small>
          </div>
        </Transition>
      </div>

      <div class="step">
        <div class="step-title">
          <span>2</span>

          <div>
            <h2>O que você quer avaliar?</h2>
            <p>Você pode avaliar o evento geral, uma oficina, palestra ou exposição específica.</p>
          </div>
        </div>

        <div class="choice-grid">
          <button
            v-for="option in evaluationTypes"
            :key="option.value"
            type="button"
            class="choice-card"
            :class="{ selected: form.evaluationType === option.value }"
            @click="selectEvaluationType(option.value)"
          >
            <span class="choice-icon">{{ option.icon }}</span>

            <span class="choice-text">
              <strong>{{ option.label }}</strong>
              <small>{{ option.description }}</small>
            </span>

            <span class="choice-check">
              <svg
                v-if="form.evaluationType === option.value"
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
            </span>
          </button>
        </div>

        <small v-if="errors.evaluationType">{{ errors.evaluationType }}</small>

        <Transition name="fade">
          <div class="field activity-field" v-if="form.evaluationType">
            <label for="activity">{{ activityLabel }} <b>*</b></label>

            <select
              id="activity"
              v-model="form.activity"
              @change="clearFieldError('activity')"
            >
              <option value="" disabled>{{ activityPlaceholder }}</option>

              <option
                v-for="activity in filteredActivities"
                :key="activity.id"
                :value="activity.title"
              >
                {{ activity.title }}
              </option>
            </select>

            <small v-if="errors.activity">{{ errors.activity }}</small>
          </div>
        </Transition>
      </div>

      <div class="step rating-step">
        <div class="step-title">
          <span>3</span>

          <div>
            <h2>Nota principal</h2>
            <p>Dê uma nota de 1 a 10 para a experiência escolhida.</p>
          </div>
        </div>

        <div class="stars" @mouseleave="hoverRating = 0">
          <button
            v-for="star in 10"
            :key="star"
            type="button"
            class="star"
            :class="{ active: star <= displayedRating }"
            @mouseenter="hoverRating = star"
            @click="selectRating(star)"
            :aria-label="`Avaliar com nota ${star}`"
          >
            ★
          </button>
        </div>

        <div class="score-box">
          <strong>{{ form.rating || displayedRating || 0 }}</strong>
          <span>/10</span>
        </div>

        <p class="rating-message">{{ ratingMessage }}</p>

        <small v-if="errors.rating">{{ errors.rating }}</small>
      </div>

      <div class="step">
        <div class="step-title">
          <span>4</span>

          <div>
            <h2>Avaliação por aspectos</h2>
            <p>Ajude a entender melhor os pontos fortes e os pontos que precisam evoluir.</p>
          </div>
        </div>

        <div class="aspect-list">
          <div
            v-for="aspect in aspects"
            :key="aspect.key"
            class="aspect-row"
          >
            <div class="aspect-info">
              <strong>{{ aspect.label }}</strong>
              <span>{{ aspect.description }}</span>
            </div>

            <div class="mini-rating">
              <button
                v-for="value in 5"
                :key="value"
                type="button"
                :class="{ active: form.aspects[aspect.key] >= value }"
                @click="form.aspects[aspect.key] = value"
              >
                {{ value }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="step">
        <div class="step-title">
          <span>5</span>

          <div>
            <h2>Comentário</h2>
            <p>Escreva um elogio, sugestão ou ponto de melhoria. Esse campo é opcional.</p>
          </div>
        </div>

        <textarea
          v-model.trim="form.comment"
          placeholder="Ex: Gostei da organização e da palestra, mas poderia ter mais sinalização para as salas..."
          rows="5"
          maxlength="700"
        ></textarea>

        <div class="textarea-footer">
          <span>{{ form.comment.length }}/700 caracteres</span>
        </div>
      </div>

      <div class="step">
        <div class="step-title">
          <span>6</span>

          <div>
            <h2>Autorização</h2>
            <p>Confirme o envio da sua avaliação para a organização do evento.</p>
          </div>
        </div>

        <label class="terms" :class="{ checked: form.allowUse }">
          <input type="checkbox" v-model="form.allowUse" />

          <span class="terms-box">
            <svg
              v-if="form.allowUse"
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
          </span>

          <span>
            Autorizo o uso desta avaliação para fins de melhoria, relatório interno
            e planejamento das próximas edições do SALIP 2.
          </span>
        </label>

        <small v-if="errors.allowUse">{{ errors.allowUse }}</small>
      </div>

      <button class="submit" type="submit" :disabled="isSubmitting">
        <span v-if="!isSubmitting">Enviar avaliação</span>

        <span v-else class="loading-text">
          Enviando avaliação
          <span class="spinner"></span>
        </span>
      </button>

      <p class="security-note">
        A avaliação será salva no Firebase. Se você escolher a opção anônima,
        nenhum nome será registrado.
      </p>
    </form>

    <transition name="toast">
      <div
        v-if="notification.show"
        class="notification"
        :class="notification.type"
      >
        <strong>{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'

const hoverRating = ref(0)
const isSubmitting = ref(false)

const evaluationTypes = [
  {
    value: 'evento_geral',
    label: 'Evento geral',
    description: 'Organização, estrutura, recepção e experiência completa.',
    icon: '🎪',
  },
  {
    value: 'oficina',
    label: 'Oficina',
    description: 'Avalie uma oficina específica que você participou.',
    icon: '🎨',
  },
  {
    value: 'palestra',
    label: 'Palestra',
    description: 'Avalie uma palestra, mesa ou conversa literária.',
    icon: '🎤',
  },
  {
    value: 'exposicao',
    label: 'Exposição',
    description: 'Avalie uma exposição ou visita guiada.',
    icon: '🖼️',
  },
]

const activities = [
  {
    id: 'evento-geral-salip2',
    type: 'evento_geral',
    title: 'SALIP 2 — Experiência geral do evento',
  },
  {
    id: 'oficina-cordel',
    type: 'oficina',
    title: 'Oficina de Literatura de Cordel',
  },
  {
    id: 'oficina-fanzine',
    type: 'oficina',
    title: 'Oficina de Fanzine',
  },
  {
    id: 'oficina-comida-memoria',
    type: 'oficina',
    title: 'Comida é Memória',
  },
  {
    id: 'palestra-carpinejar',
    type: 'palestra',
    title: 'Abertura com Fabrício Carpinejar',
  },
  {
    id: 'palestra-esperanca-garcia',
    type: 'palestra',
    title: 'A voz de Esperança Garcia',
  },
  {
    id: 'palestra-canone-piauiense',
    type: 'palestra',
    title: 'O cânone literário piauiense',
  },
  {
    id: 'palestra-manuel-bandeira',
    type: 'palestra',
    title: 'A lírica de Manuel Bandeira',
  },
  {
    id: 'exposicao-23-09',
    type: 'exposicao',
    title: 'Exposição — 23/05 às 9h',
  },
  {
    id: 'exposicao-23-1430',
    type: 'exposicao',
    title: 'Exposição — 23/05 às 14h30',
  },
  {
    id: 'exposicao-24-10',
    type: 'exposicao',
    title: 'Exposição — 24/05 às 10h',
  },
]

const aspects = [
  {
    key: 'organizacao',
    label: 'Organização',
    description: 'Pontualidade, clareza das informações e condução.',
  },
  {
    key: 'estrutura',
    label: 'Estrutura',
    description: 'Espaço, conforto, sinalização e acessibilidade.',
  },
  {
    key: 'conteudo',
    label: 'Conteúdo',
    description: 'Qualidade, relevância e aprendizado.',
  },
  {
    key: 'atendimento',
    label: 'Atendimento',
    description: 'Recepção, orientação e suporte da equipe.',
  },
]

const form = reactive({
  identificationMode: '',
  name: '',
  evaluationType: '',
  activity: '',
  rating: 0,
  aspects: {
    organizacao: 0,
    estrutura: 0,
    conteudo: 0,
    atendimento: 0,
  },
  comment: '',
  allowUse: false,
})

const errors = reactive({
  identificationMode: '',
  name: '',
  evaluationType: '',
  activity: '',
  rating: '',
  allowUse: '',
})

const notification = reactive({
  show: false,
  type: 'success',
  title: '',
  message: '',
})

const displayedRating = computed(() => hoverRating.value || form.rating)

const filteredActivities = computed(() => {
  if (!form.evaluationType) return []
  return activities.filter((activity) => activity.type === form.evaluationType)
})

const activityLabel = computed(() => {
  if (form.evaluationType === 'evento_geral') return 'Evento avaliado'
  if (form.evaluationType === 'oficina') return 'Oficina avaliada'
  if (form.evaluationType === 'palestra') return 'Palestra avaliada'
  if (form.evaluationType === 'exposicao') return 'Exposição avaliada'
  return 'Atividade avaliada'
})

const activityPlaceholder = computed(() => {
  if (form.evaluationType === 'evento_geral') return 'Selecione o evento geral'
  if (form.evaluationType === 'oficina') return 'Selecione a oficina'
  if (form.evaluationType === 'palestra') return 'Selecione a palestra'
  if (form.evaluationType === 'exposicao') return 'Selecione a exposição'
  return 'Selecione uma opção'
})

const completedSteps = computed(() => {
  let total = 0

  if (
    form.identificationMode === 'anonima' ||
    (form.identificationMode === 'identificada' && form.name)
  ) {
    total++
  }

  if (form.evaluationType && form.activity) total++
  if (form.rating) total++

  const hasAspect = Object.values(form.aspects).some((value) => value > 0)
  if (hasAspect) total++

  if (form.comment) total++
  if (form.allowUse) total++

  return total
})

const progress = computed(() => Math.round((completedSteps.value / 6) * 100))

const ratingMessage = computed(() => {
  const rating = displayedRating.value

  if (!rating) return 'A nota ajuda a medir a qualidade da experiência.'
  if (rating <= 3) return 'Sentimos muito. Seu retorno ajuda a corrigir pontos importantes.'
  if (rating <= 6) return 'Obrigado pelo retorno. Há pontos que podemos evoluir.'
  if (rating <= 8) return 'Que bom! Parece que a experiência foi positiva.'
  return 'Excelente! Ficamos felizes que a experiência tenha sido marcante.'
})

function selectIdentificationMode(mode) {
  form.identificationMode = mode
  errors.identificationMode = ''

  if (mode === 'anonima') {
    form.name = ''
    errors.name = ''
  }
}

function selectEvaluationType(type) {
  form.evaluationType = type
  form.activity = ''
  clearFieldError('evaluationType')
  clearFieldError('activity')
}

function selectRating(value) {
  form.rating = value
  errors.rating = ''
}

function clearFieldError(field) {
  errors[field] = ''
}

function showNotification(type, title, message) {
  notification.type = type
  notification.title = title
  notification.message = message
  notification.show = true

  setTimeout(() => {
    notification.show = false
  }, 4200)
}

function validateForm() {
  errors.identificationMode = ''
  errors.name = ''
  errors.evaluationType = ''
  errors.activity = ''
  errors.rating = ''
  errors.allowUse = ''

  if (!form.identificationMode) {
    errors.identificationMode = 'Escolha se deseja avaliar anonimamente ou registrar seu nome.'
  }

  if (form.identificationMode === 'identificada' && !form.name) {
    errors.name = 'Digite seu nome ou escolha avaliar anonimamente.'
  }

  if (!form.evaluationType) {
    errors.evaluationType = 'Escolha se deseja avaliar o evento geral, oficina, palestra ou exposição.'
  }

  if (!form.activity) {
    errors.activity = 'Escolha a atividade que você deseja avaliar.'
  }

  if (!form.rating) {
    errors.rating = 'Selecione uma nota de 1 a 10.'
  }

  if (!form.allowUse) {
    errors.allowUse = 'Confirme a autorização para enviar sua avaliação.'
  }

  return (
    !errors.identificationMode &&
    !errors.name &&
    !errors.evaluationType &&
    !errors.activity &&
    !errors.rating &&
    !errors.allowUse
  )
}

function gerarIdCurto(tamanho = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''

  for (let i = 0; i < tamanho; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return id
}

async function gerarIdAvaliacaoUnico() {
  let tentativas = 0
  const limiteTentativas = 30

  while (tentativas < limiteTentativas) {
    const id = gerarIdCurto(6)
    const ref = doc(db, 'avaliacoes_salip2', id)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      return id
    }

    tentativas++
  }

  throw new Error('Não foi possível gerar um ID único para a avaliação.')
}

function montarDadosAvaliacao(idAvaliacao) {
  const activityData = activities.find((item) => item.title === form.activity)
  const isAnonima = form.identificationMode === 'anonima'

  return {
    idAvaliacao,

    participante: {
      modoIdentificacao: form.identificationMode,
      anonimo: isAnonima,
      nome: isAnonima ? '' : form.name.trim(),
    },

    avaliacao: {
      tipo: form.evaluationType,
      tipoLabel: getEvaluationTypeLabel(form.evaluationType),
      atividadeId: activityData?.id || '',
      atividadeTitulo: form.activity,
      notaGeral: form.rating,
      comentario: form.comment.trim(),
      autorizouUso: form.allowUse,
    },

    aspectos: {
      organizacao: form.aspects.organizacao,
      estrutura: form.aspects.estrutura,
      conteudo: form.aspects.conteudo,
      atendimento: form.aspects.atendimento,
      mediaAspectos: calcularMediaAspectos(),
    },

    privacidade: {
      mensagem:
        isAnonima
          ? 'Usuário escolheu enviar avaliação anônima.'
          : 'Usuário escolheu registrar o nome na avaliação.',
      nomeRegistrado: !isAnonima,
    },

    controle: {
      status: 'recebida',
      origem: 'formulario_avaliacao_salip2',
      criadoEm: serverTimestamp(),
      atualizadoEm: serverTimestamp(),
    },
  }
}

function calcularMediaAspectos() {
  const valores = Object.values(form.aspects).filter((value) => value > 0)

  if (!valores.length) return 0

  const soma = valores.reduce((acc, value) => acc + value, 0)
  return Number((soma / valores.length).toFixed(1))
}

function getEvaluationTypeLabel(type) {
  const item = evaluationTypes.find((option) => option.value === type)
  return item?.label || 'Avaliação'
}

async function submitEvaluation() {
  if (!validateForm()) {
    showNotification(
      'error',
      'Existem campos pendentes',
      'Revise as informações destacadas antes de enviar sua avaliação.'
    )
    return
  }

  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const idAvaliacao = await gerarIdAvaliacaoUnico()
    const dados = montarDadosAvaliacao(idAvaliacao)

    await setDoc(doc(db, 'avaliacoes_salip2', idAvaliacao), dados)

    showNotification(
      'success',
      'Avaliação enviada!',
      form.identificationMode === 'anonima'
        ? 'Obrigado! Sua avaliação foi registrada de forma anônima.'
        : `Obrigado, ${form.name}. Sua avaliação foi registrada.`
    )

    resetForm()
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error)

    showNotification(
      'error',
      'Erro ao enviar',
      'Não foi possível salvar sua avaliação agora. Verifique sua conexão e tente novamente.'
    )
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.identificationMode = ''
  form.name = ''
  form.evaluationType = ''
  form.activity = ''
  form.rating = 0
  form.aspects.organizacao = 0
  form.aspects.estrutura = 0
  form.aspects.conteudo = 0
  form.aspects.atendimento = 0
  form.comment = ''
  form.allowUse = false
  hoverRating.value = 0
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

.wrapper {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(216, 223, 82, 0.28), transparent 28rem),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.16), transparent 24rem),
    linear-gradient(135deg, #0f2f60 0%, #144181 52%, #0d2b55 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.card {
  width: 100%;
  max-width: 820px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 32px;
  padding: clamp(22px, 5vw, 38px);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.tag {
  display: inline-flex;
  background: #d8df52;
  color: #102b52;
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 900;
  margin-bottom: 16px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

h1 {
  color: #144181;
  font-size: clamp(2rem, 5vw, 3.35rem);
  line-height: 1;
  letter-spacing: -0.07em;
  margin: 0 0 12px;
  font-weight: 900;
}

.header p {
  color: #52657d;
  line-height: 1.7;
  max-width: 620px;
  margin: 0 auto;
  font-weight: 500;
}

.privacy-alert {
  display: flex;
  gap: 14px;
  background: #eef5ff;
  border: 1px solid #d8e6f8;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 18px;
}

.privacy-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #144181;
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.privacy-alert strong {
  display: block;
  color: #144181;
  font-weight: 900;
  margin-bottom: 4px;
}

.privacy-alert p {
  color: #52657d;
  line-height: 1.55;
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
}

.progress-box {
  background: #eef5ff;
  border: 1px solid #d8e6f8;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 24px;
  color: #144181;
  display: grid;
  gap: 10px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.progress-info span {
  font-weight: 800;
  color: #315577;
}

.progress-info strong {
  font-size: 1.25rem;
  color: #144181;
}

.progress {
  height: 10px;
  background: #dce7f5;
  border-radius: 999px;
  overflow: hidden;
}

.progress div {
  height: 100%;
  background: linear-gradient(90deg, #d8df52, #b7c126);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.step {
  border: 2px solid #e5edf7;
  border-radius: 24px;
  padding: clamp(16px, 4vw, 22px);
  margin-bottom: 18px;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.step:focus-within {
  border-color: rgba(20, 65, 129, 0.4);
  box-shadow: 0 12px 30px rgba(20, 65, 129, 0.08);
}

.step-title {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
}

.step-title > span {
  min-width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #144181;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 900;
  box-shadow: 0 8px 20px rgba(20, 65, 129, 0.2);
}

.step-title h2 {
  color: #144181;
  margin: 0 0 5px;
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.step-title p {
  margin: 0;
  color: #63758c;
  font-size: 0.95rem;
  line-height: 1.5;
}

.identity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.identity-card {
  border: 2px solid #dfe8f4;
  background: #f9fbff;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
  color: #17345e;
}

.identity-card:hover {
  border-color: #b9c9dd;
  background: #ffffff;
  transform: translateY(-2px);
}

.identity-card.selected {
  border-color: #144181;
  background: #eaf2ff;
  box-shadow: 0 12px 26px rgba(20, 65, 129, 0.12);
}

.identity-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.identity-card span:nth-child(2) {
  display: grid;
  gap: 4px;
  flex: 1;
}

.identity-card strong {
  color: #144181;
  font-weight: 900;
}

.identity-card small {
  color: #63758c;
  font-size: 0.78rem;
  line-height: 1.4;
  font-weight: 700;
}

.identity-card i {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #144181;
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.8);
  transition: 0.2s ease;
  font-style: normal;
}

.identity-card.selected i {
  opacity: 1;
  transform: scale(1);
}

.name-field {
  margin-top: 16px;
}

.field {
  display: grid;
  gap: 8px;
}

label {
  color: #18365f;
  font-weight: 900;
  font-size: 0.9rem;
}

label b {
  color: #dc2626;
}

input,
select,
textarea {
  width: 100%;
  border: 2px solid #dfe8f4;
  border-radius: 16px;
  padding: 14px 15px;
  color: #16345c;
  background: #f9fbff;
  outline: none;
  transition: 0.2s ease;
  font: inherit;
  font-weight: 600;
}

input::placeholder,
textarea::placeholder {
  color: #93a4b8;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #144181;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(20, 65, 129, 0.1);
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  font-size: 0.78rem;
  color: #7a8ca1;
  font-weight: 700;
}

small {
  display: block;
  color: #dc2626;
  font-weight: 800;
  font-size: 0.82rem;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.choice-card {
  border: 2px solid #dfe8f4;
  background: #f9fbff;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  transition: 0.2s ease;
  color: #17345e;
}

.choice-card:hover {
  border-color: #b9c9dd;
  background: #ffffff;
  transform: translateY(-2px);
}

.choice-card.selected {
  border-color: #144181;
  background: #eaf2ff;
  box-shadow: 0 12px 26px rgba(20, 65, 129, 0.12);
}

.choice-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.choice-text {
  flex: 1;
  display: grid;
  gap: 4px;
}

.choice-text strong {
  color: #144181;
  font-weight: 900;
}

.choice-text small {
  color: #63758c;
  font-size: 0.78rem;
  line-height: 1.4;
  font-weight: 700;
}

.choice-check {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #144181;
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.8);
  transition: 0.2s ease;
}

.choice-card.selected .choice-check {
  opacity: 1;
  transform: scale(1);
}

.activity-field {
  margin-top: 16px;
}

.rating-step {
  text-align: center;
}

.rating-step .step-title {
  text-align: left;
}

.stars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-top: 10px;
}

.star {
  border: none;
  background: transparent;
  color: #cdd6e3;
  font-size: clamp(1.8rem, 6vw, 3rem);
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
  padding: 0 2px;
}

.star:hover {
  transform: scale(1.18) rotate(-6deg);
}

.star.active {
  color: #d8df52;
  text-shadow: 0 0 14px rgba(216, 223, 82, 0.65);
}

.score-box {
  margin-top: 10px;
  color: #144181;
}

.score-box strong {
  font-size: 2.5rem;
  font-weight: 900;
}

.score-box span {
  font-weight: 900;
  color: #60758d;
}

.rating-message {
  color: #144181;
  font-weight: 900;
  margin: 8px 0 0;
  line-height: 1.5;
}

.aspect-list {
  display: grid;
  gap: 12px;
}

.aspect-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  align-items: center;
  background: #f9fbff;
  border: 1px solid #e4edf8;
  border-radius: 18px;
  padding: 14px;
}

.aspect-info {
  display: grid;
  gap: 3px;
}

.aspect-info strong {
  color: #144181;
  font-weight: 900;
}

.aspect-info span {
  color: #65778d;
  font-size: 0.84rem;
  line-height: 1.4;
  font-weight: 600;
}

.mini-rating {
  display: flex;
  gap: 5px;
}

.mini-rating button {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 2px solid #dfe8f4;
  background: #ffffff;
  color: #52657d;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.mini-rating button:hover {
  border-color: #144181;
  color: #144181;
}

.mini-rating button.active {
  background: #144181;
  border-color: #144181;
  color: #ffffff;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  color: #315577;
  line-height: 1.55;
  font-weight: 700;
}

.terms input {
  display: none;
}

.terms-box {
  width: 26px;
  height: 26px;
  border: 2px solid #bccada;
  background: #ffffff;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #ffffff;
  flex-shrink: 0;
  transition: 0.2s ease;
}

.terms.checked .terms-box {
  background: #144181;
  border-color: #144181;
}

.submit {
  width: 100%;
  border: none;
  border-radius: 20px;
  padding: 17px;
  background: #144181;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
  margin-top: 4px;
}

.submit:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #0f3264;
  box-shadow: 0 12px 28px rgba(20, 65, 129, 0.25);
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 999px;
  animation: spin 1s linear infinite;
}

.security-note {
  text-align: center;
  color: #718197;
  font-size: 0.82rem;
  font-weight: 700;
  margin: 14px 0 0;
}

.notification {
  position: fixed;
  right: 24px;
  bottom: 24px;
  max-width: 380px;
  padding: 18px 20px;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
  z-index: 20;
}

.notification strong {
  display: block;
  margin-bottom: 4px;
}

.notification p {
  margin: 0;
  line-height: 1.5;
  font-weight: 600;
}

.notification.success {
  background: #d8df52;
  color: #144181;
}

.notification.error {
  background: #ffffff;
  color: #dc2626;
  border-left: 8px solid #dc2626;
}

.toast-enter-active,
.toast-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .wrapper {
    padding: 14px;
    align-items: flex-start;
  }

  .card {
    border-radius: 24px;
  }

  .identity-grid,
  .choice-grid,
  .aspect-row {
    grid-template-columns: 1fr;
  }

  .mini-rating {
    width: 100%;
    justify-content: space-between;
  }

  .mini-rating button {
    flex: 1;
  }

  .notification {
    left: 14px;
    right: 14px;
    bottom: 14px;
    max-width: none;
  }
}
</style>