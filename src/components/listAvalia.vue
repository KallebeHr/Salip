<template>
  <section class="reviews-section">
    <div class="reviews-container">
      <header class="reviews-header">
        <span class="eyebrow">Avaliações do público</span>

        <h2>O que estão falando sobre o SALIP 2</h2>

        <p>
          Confira algumas avaliações enviadas por participantes sobre o evento,
          oficinas, palestras e exposições.
        </p>
      </header>

      <div class="summary-card">
        <div class="summary-main">
          <strong>{{ mediaGeral }}</strong>
          <span>/10</span>
        </div>

        <div class="summary-info">
          <h3>Nota média geral</h3>
          <p>
            Com base em {{ avaliacoes.length }} avaliação{{ avaliacoes.length !== 1 ? 'ões' : '' }}
            recebida{{ avaliacoes.length !== 1 ? 's' : '' }}.
          </p>
        </div>

        <div class="summary-stars" aria-hidden="true">
          <span
            v-for="star in 5"
            :key="star"
            :class="{ active: star <= mediaEstrelas }"
          >
            ★
          </span>
        </div>
      </div>

      <div class="filter-row" v-if="avaliacoes.length">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          class="filter-btn"
          :class="{ active: filtroAtual === filter.value }"
          @click="filtroAtual = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div v-if="loading" class="state-card">
        <span class="loader"></span>
        <strong>Carregando avaliações...</strong>
      </div>

      <div v-else-if="erro" class="state-card error">
        <strong>Não foi possível carregar as avaliações.</strong>
        <p>{{ erro }}</p>

        <button type="button" @click="carregarAvaliacoes">
          Tentar novamente
        </button>
      </div>

      <div v-else-if="avaliacoesFiltradas.length === 0" class="state-card">
        <strong>Ainda não há avaliações para mostrar.</strong>
        <p>As avaliações aparecerão aqui quando forem enviadas pelo público.</p>
      </div>

      <div v-else class="reviews-grid">
        <article
          v-for="avaliacao in avaliacoesVisiveis"
          :key="avaliacao.idAvaliacao"
          class="review-card"
        >
          <div class="review-top">
            <div class="review-user">
              <div class="avatar" :class="{ anonymous: avaliacao.anonimo }">
                {{ avaliacao.anonimo ? 'A' : getInitials(avaliacao.nome) }}
              </div>

              <div>
                <h3>
                  {{ avaliacao.anonimo ? 'Avaliação anônima' : avaliacao.nome }}
                </h3>

                <p>{{ avaliacao.tipoLabel }}</p>
              </div>
            </div>

            <div class="score" :class="getScoreClass(avaliacao.notaGeral)">
              {{ avaliacao.notaGeral }}/10
            </div>
          </div>

          <div class="activity-chip">
            {{ avaliacao.atividadeTitulo }}
          </div>

          <blockquote>
            “{{ avaliacao.comentario }}”
          </blockquote>

          <div class="review-footer">
            <span>{{ formatarData(avaliacao.criadoEm) }}</span>

            <div class="mini-stars" aria-hidden="true">
              <span
                v-for="star in 5"
                :key="star"
                :class="{ active: star <= notaParaEstrelas(avaliacao.notaGeral) }"
              >
                ★
              </span>
            </div>
          </div>
        </article>
      </div>

      <div class="load-more-wrap" v-if="podeMostrarMais">
        <button type="button" class="load-more" @click="limite += 6">
          Mostrar mais avaliações
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'

const avaliacoes = ref([])
const loading = ref(false)
const erro = ref('')
const filtroAtual = ref('todos')
const limite = ref(6)

const filters = [
  {
    label: 'Todas',
    value: 'todos',
  },
  {
    label: 'Evento geral',
    value: 'evento_geral',
  },
  {
    label: 'Oficinas',
    value: 'oficina',
  },
  {
    label: 'Palestras',
    value: 'palestra',
  },
  {
    label: 'Exposições',
    value: 'exposicao',
  },
]

onMounted(() => {
  carregarAvaliacoes()
})

async function carregarAvaliacoes() {
  loading.value = true
  erro.value = ''

  try {
    const q = query(
      collection(db, 'avaliacoes_salip2'),
      orderBy('controle.criadoEm', 'desc')
    )

    const snapshot = await getDocs(q)

    avaliacoes.value = snapshot.docs
      .map((documento) => normalizarAvaliacao(documento.id, documento.data()))
      .filter((avaliacao) => {
        return (
          avaliacao.status === 'recebida' &&
          avaliacao.autorizouUso &&
          avaliacao.comentario &&
          avaliacao.notaGeral > 0
        )
      })
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
    erro.value = 'Verifique a conexão, as regras do Firebase ou o nome da coleção avaliacoes_salip2.'
  } finally {
    loading.value = false
  }
}

function normalizarAvaliacao(idDocumento, data) {
  const participante = data.participante || {}
  const avaliacao = data.avaliacao || {}
  const controle = data.controle || {}

  const anonimo = Boolean(participante.anonimo)

  return {
    id: idDocumento,
    idAvaliacao: data.idAvaliacao || idDocumento,

    anonimo,
    nome: anonimo ? '' : participante.nome || '',

    tipo: avaliacao.tipo || '',
    tipoLabel: avaliacao.tipoLabel || formatarTipo(avaliacao.tipo),
    atividadeTitulo: avaliacao.atividadeTitulo || 'SALIP 2',
    notaGeral: Number(avaliacao.notaGeral || 0),
    comentario: avaliacao.comentario || '',
    autorizouUso: Boolean(avaliacao.autorizouUso),

    status: controle.status || 'recebida',
    criadoEm: controle.criadoEm || null,
  }
}

const avaliacoesFiltradas = computed(() => {
  if (filtroAtual.value === 'todos') {
    return avaliacoes.value
  }

  return avaliacoes.value.filter((avaliacao) => {
    return avaliacao.tipo === filtroAtual.value
  })
})

const avaliacoesVisiveis = computed(() => {
  return avaliacoesFiltradas.value.slice(0, limite.value)
})

const podeMostrarMais = computed(() => {
  return avaliacoesFiltradas.value.length > limite.value
})

const mediaGeral = computed(() => {
  const notas = avaliacoes.value
    .map((avaliacao) => avaliacao.notaGeral)
    .filter((nota) => nota > 0)

  if (!notas.length) return '0.0'

  const soma = notas.reduce((acc, nota) => acc + nota, 0)

  return (soma / notas.length).toFixed(1)
})

const mediaEstrelas = computed(() => {
  return notaParaEstrelas(Number(mediaGeral.value))
})

function notaParaEstrelas(nota) {
  if (!nota) return 0
  return Math.round(nota / 2)
}

function getScoreClass(score) {
  if (score <= 6) return 'low'
  if (score <= 8) return 'good'
  return 'high'
}

function getInitials(name) {
  return (
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || '?'
  )
}

function formatarTipo(tipo) {
  const map = {
    evento_geral: 'Evento geral',
    oficina: 'Oficina',
    palestra: 'Palestra',
    exposicao: 'Exposição',
  }

  return map[tipo] || 'Avaliação'
}

function formatarData(valor) {
  if (!valor) return 'Data não informada'

  try {
    const data = valor?.toDate ? valor.toDate() : new Date(valor)

    if (Number.isNaN(data.getTime())) {
      return 'Data não informada'
    }

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return 'Data não informada'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
}

.reviews-section {
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(216, 223, 82, 0.18), transparent 28rem),
    linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
  padding: clamp(48px, 8vw, 92px) 18px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.reviews-container {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.reviews-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 28px;
}

.eyebrow {
  display: inline-flex;
  background: #d8df52;
  color: #102b52;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 14px;
}

.reviews-header h2 {
  color: #144181;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.07em;
  margin: 0 0 14px;
  font-weight: 900;
}

.reviews-header p {
  color: #60748c;
  line-height: 1.7;
  font-weight: 600;
  margin: 0;
}

.summary-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  background: #144181;
  color: #ffffff;
  border-radius: 28px;
  padding: clamp(20px, 4vw, 28px);
  box-shadow: 0 22px 60px rgba(20, 65, 129, 0.22);
  margin-bottom: 22px;
}

.summary-main {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.summary-main strong {
  color: #d8df52;
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.summary-main span {
  color: #dbeafe;
  font-size: 1.2rem;
  font-weight: 900;
}

.summary-info h3 {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 900;
  margin: 0 0 4px;
}

.summary-info p {
  color: #dbeafe;
  line-height: 1.55;
  margin: 0;
  font-weight: 600;
}

.summary-stars,
.mini-stars {
  display: flex;
  gap: 3px;
}

.summary-stars span,
.mini-stars span {
  color: rgba(255, 255, 255, 0.28);
  font-size: 1.4rem;
}

.summary-stars span.active,
.mini-stars span.active {
  color: #d8df52;
}

.filter-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}

.filter-btn {
  border: 1px solid #d7e4f2;
  background: #ffffff;
  color: #52657d;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-btn:hover {
  border-color: #144181;
  color: #144181;
}

.filter-btn.active {
  background: #144181;
  border-color: #144181;
  color: #ffffff;
}

.state-card {
  background: #ffffff;
  border: 1px solid #dbe7f5;
  border-radius: 22px;
  padding: 30px;
  text-align: center;
  color: #52657d;
  display: grid;
  justify-items: center;
  gap: 10px;
}

.state-card strong {
  color: #144181;
  font-size: 1.1rem;
}

.state-card p {
  margin: 0;
  line-height: 1.5;
}

.state-card.error strong {
  color: #dc2626;
}

.state-card button {
  border: none;
  background: #144181;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
}

.loader {
  width: 26px;
  height: 26px;
  border: 3px solid #dbeafe;
  border-top-color: #144181;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.review-card {
  background: #ffffff;
  border: 1px solid #dbe7f5;
  border-radius: 26px;
  padding: 22px;
  box-shadow: 0 16px 40px rgba(20, 65, 129, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 280px;
}

.review-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.review-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  display: grid;
  place-items: center;
  font-weight: 900;
  flex-shrink: 0;
}

.avatar.anonymous {
  background: #f1f5f9;
  color: #64748b;
}

.review-user h3 {
  color: #102b52;
  font-size: 1rem;
  margin: 0 0 3px;
  font-weight: 900;
}

.review-user p {
  color: #718197;
  font-size: 0.82rem;
  margin: 0;
  font-weight: 700;
}

.score {
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 900;
  white-space: nowrap;
}

.score.low {
  background: #fee2e2;
  color: #991b1b;
}

.score.good {
  background: #fef3c7;
  color: #92400e;
}

.score.high {
  background: #dcfce7;
  color: #166534;
}

.activity-chip {
  align-self: flex-start;
  background: #eef5ff;
  color: #144181;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.78rem;
  font-weight: 900;
  line-height: 1.3;
}

blockquote {
  color: #34465c;
  line-height: 1.7;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.review-footer {
  border-top: 1px solid #edf3fa;
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.review-footer > span {
  color: #8a9aad;
  font-size: 0.78rem;
  font-weight: 700;
}

.mini-stars span {
  font-size: 1rem;
  color: #d3dbe6;
}

.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 26px;
}

.load-more {
  border: none;
  background: #144181;
  color: #ffffff;
  border-radius: 16px;
  padding: 13px 22px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.load-more:hover {
  background: #0f3264;
  transform: translateY(-2px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .reviews-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .summary-main,
  .summary-stars {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .reviews-section {
    padding: 42px 14px;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .review-card {
    border-radius: 22px;
  }

  .review-top {
    flex-direction: column;
  }

  .review-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-row {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }

  .filter-btn {
    white-space: nowrap;
  }
}
</style>