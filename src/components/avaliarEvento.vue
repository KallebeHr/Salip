<template>
  <section class="wrapper">
    <form class="card" @submit.prevent="submitEvaluation">
      <header class="header">
        <span class="tag">Educação • Participação • Melhoria</span>
        <h1>Avalie sua experiência</h1>
        <p>
          Sua avaliação ajuda nossa equipe a entender o que funcionou bem
          e o que pode melhorar nos próximos eventos.
        </p>
      </header>

      <div class="progress-box">
        <span>Etapas preenchidas</span>
        <strong>{{ completedSteps }}/4</strong>
        <div class="progress">
          <div :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <div class="step">
        <div class="step-title">
          <span>1</span>
          <div>
            <h2>Identificação</h2>
            <p>Informe seu nome para registrarmos sua participação.</p>
          </div>
        </div>

        <input
          v-model.trim="form.name"
          type="text"
          placeholder="Ex: Maria Eduarda"
          @input="clearFieldError('name')"
        />

        <small v-if="errors.name">{{ errors.name }}</small>
      </div>

      <div class="step">
        <div class="step-title">
          <span>2</span>
          <div>
            <h2>Evento avaliado</h2>
            <p>Escolha a oficina, palestra ou atividade que você participou.</p>
          </div>
        </div>

        <select v-model="form.event" @change="clearFieldError('event')">
          <option value="" disabled>Selecione uma opção</option>
          <option v-for="event in events" :key="event.id" :value="event.title">
            {{ event.title }}
          </option>
        </select>

        <small v-if="errors.event">{{ errors.event }}</small>
      </div>

      <div class="step rating-step">
        <div class="step-title">
          <span>3</span>
          <div>
            <h2>Nota do evento</h2>
            <p>Clique nas estrelas para dar uma nota de 1 a 10.</p>
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
          <strong>{{ form.rating || displayedRating }}</strong>
          <span>/10</span>
        </div>

        <p class="rating-message">{{ ratingMessage }}</p>

        <small v-if="errors.rating">{{ errors.rating }}</small>
      </div>

      <div class="step">
        <div class="step-title">
          <span>4</span>
          <div>
            <h2>Comentário educativo</h2>
            <p>
              Escreva uma sugestão, elogio ou ponto de melhoria.
              Esse campo é opcional.
            </p>
          </div>
        </div>

        <textarea
          v-model.trim="form.comment"
          placeholder="Ex: Gostei da dinâmica da oficina, mas poderia ter mais tempo para perguntas..."
          rows="4"
        ></textarea>
      </div>

      <button class="submit" type="submit">
        Enviar avaliação
      </button>
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

const hoverRating = ref(0)

const events = [
  { id: 1, title: 'Oficina de Robótica Educacional' },
  { id: 2, title: 'Palestra: Educação do Futuro' },
  { id: 3, title: 'Workshop de Inteligência Artificial' },
  { id: 4, title: 'Mesa-redonda sobre Inclusão Digital' },
  { id: 5, title: 'Laboratório Criativo Maker' }
]

const form = reactive({
  name: '',
  event: '',
  rating: 0,
  comment: ''
})

const errors = reactive({
  name: '',
  event: '',
  rating: ''
})

const notification = reactive({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const displayedRating = computed(() => hoverRating.value || form.rating)

const completedSteps = computed(() => {
  let total = 0

  if (form.name) total++
  if (form.event) total++
  if (form.rating) total++
  if (form.comment) total++

  return total
})

const progress = computed(() => (completedSteps.value / 4) * 100)

const ratingMessage = computed(() => {
  const rating = displayedRating.value

  if (!rating) return 'A nota ajuda a medir a qualidade da atividade.'
  if (rating <= 3) return 'Sentimos muito. Sua opinião é importante para melhorarmos.'
  if (rating <= 6) return 'Obrigado pelo retorno. Há pontos que podemos evoluir.'
  if (rating <= 8) return 'Que bom! Parece que a experiência foi positiva.'
  return 'Excelente! Ficamos felizes que o evento foi marcante.'
})

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
  }, 3500)
}

function validateForm() {
  errors.name = ''
  errors.event = ''
  errors.rating = ''

  if (!form.name) {
    errors.name = 'Digite seu nome antes de continuar.'
  }

  if (!form.event) {
    errors.event = 'Escolha o evento que você deseja avaliar.'
  }

  if (!form.rating) {
    errors.rating = 'Selecione uma nota de 1 a 10.'
  }

  return !errors.name && !errors.event && !errors.rating
}

function submitEvaluation() {
  if (!validateForm()) {
    showNotification(
      'error',
      'Existem campos pendentes',
      'Revise as informações destacadas antes de enviar sua avaliação.'
    )
    return
  }

  showNotification(
    'success',
    'Avaliação enviada!',
    `Obrigado, ${form.name}. Sua participação ajuda a melhorar os próximos eventos.`
  )

  console.log('Avaliação enviada:', { ...form })

  form.name = ''
  form.event = ''
  form.rating = 0
  form.comment = ''
  hoverRating.value = 0
}
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  width: 100%;
  background: #144181;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.tag {
  display: inline-block;
  background: #d8df52;
  color: #144181;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
  margin-bottom: 14px;
}

h1 {
  color: #144181;
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 0 10px;
}

.header p {
  color: #52657d;
  line-height: 1.6;
}

.progress-box {
  background: rgba(20, 65, 129, 0.08);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 26px;
  color: #144181;
}

.progress-box {
  display: grid;
  gap: 8px;
}

.progress-box strong {
  font-size: 1.4rem;
}

.progress {
  height: 10px;
  background: #e8ecf2;
  border-radius: 999px;
  overflow: hidden;
}

.progress div {
  height: 100%;
  background: #d8df52;
  transition: width 0.3s ease;
}

.step {
  border: 2px solid rgba(20, 65, 129, 0.08);
  border-radius: 22px;
  padding: 20px;
  margin-bottom: 18px;
}

.step-title {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
}

.step-title span {
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #144181;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.step-title h2 {
  color: #144181;
  margin: 0 0 4px;
  font-size: 1.1rem;
}

.step-title p {
  margin: 0;
  color: #63758c;
  font-size: 0.95rem;
}

input,
select,
textarea {
  width: 100%;
  border: 2px solid #e5eaf0;
  border-radius: 16px;
  padding: 14px;
  color: #144181;
  outline: none;
  transition: 0.2s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #d8df52;
  box-shadow: 0 0 0 4px rgba(216, 223, 82, 0.25);
}

small {
  display: block;
  margin-top: 8px;
  color: #d93025;
  font-weight: 700;
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
  margin-top: 12px;
}

.star {
  border: none;
  background: transparent;
  color: #d4d9e2;
  font-size: clamp(1.7rem, 6vw, 3rem);
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.star:hover {
  transform: scale(1.18) rotate(-6deg);
}

.star.active {
  color: #d8df52;
  text-shadow: 0 0 12px rgba(216, 223, 82, 0.7);
}

.score-box {
  margin-top: 10px;
  color: #144181;
}

.score-box strong {
  font-size: 2.4rem;
}

.rating-message {
  color: #144181;
  font-weight: 800;
}

.submit {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 16px;
  background: #144181;
  color: white;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.submit:hover {
  transform: translateY(-2px);
  background: #0f3264;
}

.notification {
  position: fixed;
  right: 24px;
  bottom: 24px;
  max-width: 360px;
  padding: 18px 20px;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
  z-index: 20;
}

.notification strong {
  display: block;
  margin-bottom: 4px;
}

.notification p {
  margin: 0;
}

.notification.success {
  background: #d8df52;
  color: #144181;
}

.notification.error {
  background: #ffffff;
  color: #d93025;
  border-left: 8px solid #d93025;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 600px) {
  .wrapper {
    padding: 14px;
    align-items: flex-start;
  }

  .card {
    padding: 22px;
    border-radius: 22px;
  }

  .step {
    padding: 16px;
  }

  .step-title {
    gap: 10px;
  }

  .notification {
    left: 14px;
    right: 14px;
    bottom: 14px;
    max-width: none;
  }
}
</style>