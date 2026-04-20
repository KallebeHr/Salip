<template>
  <div class="admin-wrap">

    <!-- ===== HEADER ===== -->
    <header class="topbar">
      <div class="topbar-left">
        <div class="logo-mark">
          <span class="logo-icon">◈</span>
        </div>
        <div>
          <h1 class="topbar-title">Painel Administrativo</h1>
          <p class="topbar-sub">Inscrições · {{ atualizadoEm }}</p>
        </div>
      </div>
      <div class="topbar-right">
        <span class="online-badge">
          <span class="dot-pulse"></span>
          {{ usuariosOrdenados.length }} inscritos
        </span>
        <button class="btn-logout" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair
        </button>
      </div>
    </header>

    <main class="content">

      <!-- ===== KPI CARDS ===== -->
      <section class="kpi-grid">
        <div
          v-for="card in kpiCards"
          :key="card.tipo"
          class="kpi-card"
          :class="{ active: filtroAtual === card.tipo }"
          :style="{ '--accent': card.color }"
          @click="filtroAtual = card.tipo"
        >
          <div class="kpi-top">
            <span class="kpi-icon" v-html="card.icon"></span>
            <span class="kpi-delta" v-if="filtroAtual === card.tipo">selecionado</span>
          </div>
          <div class="kpi-number">{{ card.count }}</div>
          <div class="kpi-label">{{ card.label }}</div>
          <div class="kpi-bar">
            <div class="kpi-bar-fill" :style="{ width: card.pct + '%', background: card.color }"></div>
          </div>
          <div class="kpi-pct">{{ card.pct }}% do total</div>
        </div>
      </section>

      <!-- ===== CHARTS ROW ===== -->
      <section class="charts-row">

        <!-- Donut -->
        <div class="chart-card donut-card">
          <h2 class="card-title">Distribuição por tipo</h2>
          <div class="donut-wrap">
            <div class="donut-container">
              <canvas ref="donutRef" width="160" height="160"
                role="img"
                aria-label="Gráfico de rosca: distribuição por tipo de participante"
              >Distribuição por tipo de participante.</canvas>
              <div class="donut-center">
                <span class="donut-total">{{ usuariosOrdenados.length }}</span>
                <span class="donut-total-label">total</span>
              </div>
            </div>
            <div class="donut-legend">
              <div
                v-for="item in donutLegendItems"
                :key="item.label"
                class="donut-legend-item"
              >
                <span class="legend-square" :style="{ background: item.color }"></span>
                <span class="legend-name">{{ item.label }}</span>
                <span class="legend-count">{{ item.count }}</span>
                <span class="legend-pct">{{ item.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bar chart: cidades -->
        <div class="chart-card bar-card">
          <h2 class="card-title">Top 5 cidades</h2>
          <div class="bar-chart-wrap">
            <canvas ref="barRef" width="300" height="180"
              role="img"
              aria-label="Gráfico de barras com as 5 cidades com mais inscritos"
            >Top 5 cidades por inscrições.</canvas>
          </div>
        </div>

        <!-- Faixa etária -->
        <div class="chart-card">
          <h2 class="card-title">Faixa etária</h2>
          <div class="age-list">
            <div v-for="fx in faixasEtarias" :key="fx.label" class="age-row">
              <span class="age-label">{{ fx.label }}</span>
              <div class="age-track">
                <div class="age-fill" :style="{ width: fx.pct + '%', background: fx.color }"></div>
              </div>
              <span class="age-count">{{ fx.count }}</span>
              <span class="age-pct">{{ fx.pct }}%</span>
            </div>
          </div>
        </div>

      </section>

      <!-- ===== STATS ROW ===== -->
      <section class="stats-row">

        <div class="chart-card">
          <h2 class="card-title">Por UF</h2>
          <div class="stat-list">
            <div v-for="item in statsPorUF" :key="item.label" class="stat-item">
              <span class="stat-name">{{ item.label }}</span>
              <div class="stat-track">
                <div class="stat-fill" :style="{ width: item.pct + '%' }"></div>
              </div>
              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h2 class="card-title">Eventos populares</h2>
          <div class="stat-list">
            <div v-for="item in statsEventos" :key="item.label" class="stat-item">
              <span class="stat-name">{{ item.label }}</span>
              <div class="stat-track">
                <div class="stat-fill green" :style="{ width: item.pct + '%' }"></div>
              </div>
              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h2 class="card-title">Escola / Trabalho (top 5)</h2>
          <div class="stat-list">
            <div v-for="item in statsInstituicoes" :key="item.label" class="stat-item">
              <span class="stat-name">{{ item.label }}</span>
              <div class="stat-track">
                <div class="stat-fill amber" :style="{ width: item.pct + '%' }"></div>
              </div>
              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>
        </div>

      </section>

      <!-- ===== TABELA ===== -->
      <section class="table-section">
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="card-title" style="margin-bottom:0">Participantes</h2>
            <span class="result-count">{{ usuariosFiltrados.length }} resultado{{ usuariosFiltrados.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="toolbar-right">
            <div class="search-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                v-model="termoBusca"
                class="search-input"
                placeholder="Buscar nome, cidade, escola..."
              />
            </div>
            <div class="filter-pills">
              <button
                v-for="f in filtros"
                :key="f.value"
                class="pill"
                :class="{ active: filtroAtual === f.value }"
                @click="filtroAtual = f.value"
              >{{ f.label }}</button>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th @click="toggleSort('nomeCompleto')" class="sortable">
                  Nome <span class="sort-arrow">{{ sortCol === 'nomeCompleto' ? (sortDir === 1 ? '↑' : '↓') : '↕' }}</span>
                </th>
                <th @click="toggleSort('cidade')" class="sortable">
                  Cidade <span class="sort-arrow">{{ sortCol === 'cidade' ? (sortDir === 1 ? '↑' : '↓') : '↕' }}</span>
                </th>
                <th>UF</th>
                <th>Tipo</th>
                <th>Escola / Trabalho</th>
                <th>Eventos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="8" class="empty-row">Nenhum participante encontrado.</td>
              </tr>
              <tr
                v-for="(u, i) in usuariosPaginados"
                :key="u.id"
                class="data-row"
                :class="{ alt: i % 2 === 1 }"
                @click="abrirModal(u)"
              >
                <td class="td-num">{{ (paginaAtual - 1) * itensPorPagina + i + 1 }}</td>
                <td>
                  <div class="user-cell">
                    <div class="avatar" :style="{ background: getColor(u.tipoParticipante).light, color: getColor(u.tipoParticipante).text }">
                      {{ getInitials(u.nomeCompleto) }}
                    </div>
                    <span class="user-name">{{ u.nomeCompleto }}</span>
                  </div>
                </td>
                <td class="td-muted">{{ u.cidade || '—' }}</td>
                <td class="td-muted">{{ u.uf || '—' }}</td>
                <td>
                  <span class="badge" :class="'badge-' + (u.tipoParticipante || 'outro')">
                    {{ u.tipoParticipante || '—' }}
                  </span>
                </td>
                <td class="td-muted td-trunc">{{ u.escola || u.localTrabalho || '—' }}</td>
                <td class="td-muted td-trunc">
                  {{ Array.isArray(u.eventosSelecionados) ? u.eventosSelecionados.join(', ') : (u.eventosSelecionados || '—') }}
                </td>
                <td>
                  <button class="btn-detail" @click.stop="abrirModal(u)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        <div class="pagination">
          <span class="pag-info">
            Página {{ paginaAtual }} de {{ totalPaginas || 1 }}
          </span>
          <div class="pag-btns">
            <button class="pag-btn" :disabled="paginaAtual === 1" @click="paginaAtual = 1">«</button>
            <button class="pag-btn" :disabled="paginaAtual === 1" @click="paginaAtual--">‹</button>
            <button
              v-for="p in paginasVisiveis"
              :key="p"
              class="pag-btn"
              :class="{ current: p === paginaAtual }"
              @click="paginaAtual = p"
            >{{ p }}</button>
            <button class="pag-btn" :disabled="paginaAtual === totalPaginas" @click="paginaAtual++">›</button>
            <button class="pag-btn" :disabled="paginaAtual === totalPaginas" @click="paginaAtual = totalPaginas">»</button>
          </div>
          <select v-model.number="itensPorPagina" class="pag-select" @change="paginaAtual = 1">
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
      </section>

      <!-- ===== AÇÕES RODAPÉ ===== -->
      <section class="actions-bar">
        <div class="actions-left">
          <button class="btn-action green" @click="baixarExcel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar Excel
          </button>
          <button class="btn-action blue" @click="baixarCSV">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar CSV
          </button>
          <span class="export-note">Exportando {{ usuariosFiltrados.length }} registro(s) {{ filtroAtual !== 'todos' ? '— filtro: ' + filtroAtual : '' }}</span>
        </div>
        <button class="btn-logout-footer" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sair da Administração
        </button>
      </section>

    </main>

    <!-- ===== MODAL ===== -->
    <Transition name="fade">
      <div v-if="modalAberto" class="modal-overlay" @click.self="modalAberto = false">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-avatar"
              :style="{ background: getColor(usuarioSelecionado?.tipoParticipante).light, color: getColor(usuarioSelecionado?.tipoParticipante).text }"
            >
              {{ getInitials(usuarioSelecionado?.nomeCompleto || '') }}
            </div>
            <div class="modal-info">
              <h2 class="modal-name">{{ usuarioSelecionado?.nomeCompleto }}</h2>
              <span class="badge" :class="'badge-' + (usuarioSelecionado?.tipoParticipante || 'outro')">
                {{ usuarioSelecionado?.tipoParticipante }}
              </span>
            </div>
            <button class="modal-close-btn" @click="modalAberto = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="modal-body" v-if="usuarioSelecionado">
            <div class="modal-section">
              <div class="modal-section-title">Dados pessoais</div>
              <div class="modal-row" v-if="usuarioSelecionado.cidade">
                <span class="modal-label">Cidade</span>
                <span class="modal-val">{{ usuarioSelecionado.cidade }}{{ usuarioSelecionado.uf ? ' — ' + usuarioSelecionado.uf : '' }}</span>
              </div>
              <div class="modal-row" v-if="usuarioSelecionado.dataNascimento">
                <span class="modal-label">Nascimento</span>
                <span class="modal-val">{{ usuarioSelecionado.dataNascimento }} ({{ calcIdade(usuarioSelecionado.dataNascimento) }} anos)</span>
              </div>
              <div class="modal-row" v-if="usuarioSelecionado.telefone">
                <span class="modal-label">Telefone</span>
                <span class="modal-val">{{ usuarioSelecionado.telefone }}</span>
              </div>
            </div>

            <div class="modal-section" v-if="usuarioSelecionado.escola || usuarioSelecionado.localTrabalho">
              <div class="modal-section-title">Vínculo</div>
              <div class="modal-row" v-if="usuarioSelecionado.escola">
                <span class="modal-label">Escola</span>
                <span class="modal-val">{{ usuarioSelecionado.escola }}</span>
              </div>
              <div class="modal-row" v-if="usuarioSelecionado.localTrabalho">
                <span class="modal-label">Trabalho</span>
                <span class="modal-val">{{ usuarioSelecionado.localTrabalho }}</span>
              </div>
            </div>

            <div class="modal-section" v-if="temAtividades(usuarioSelecionado)">
              <div class="modal-section-title">Atividades inscritas</div>
              <div class="modal-row" v-if="usuarioSelecionado.eventosSelecionados?.length">
                <span class="modal-label">Eventos</span>
                <span class="modal-val">
                  {{ Array.isArray(usuarioSelecionado.eventosSelecionados)
                    ? usuarioSelecionado.eventosSelecionados.join(', ')
                    : usuarioSelecionado.eventosSelecionados }}
                </span>
              </div>
              <div class="modal-row" v-if="oficinasStr(usuarioSelecionado)">
                <span class="modal-label">Oficinas</span>
                <span class="modal-val">{{ oficinasStr(usuarioSelecionado) }}</span>
              </div>
              <div class="modal-row" v-if="exposicoesStr(usuarioSelecionado)">
                <span class="modal-label">Exposições</span>
                <span class="modal-val">{{ exposicoesStr(usuarioSelecionado) }}</span>
              </div>
              <div class="modal-row" v-if="usuarioSelecionado.palestraSelecionada">
                <span class="modal-label">Palestra</span>
                <span class="modal-val">{{ usuarioSelecionado.palestraSelecionada }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-action blue" @click="modalAberto = false">Fechar</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Chart, DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip)

// ─── refs ───
const usuariosOrdenados = ref([])
const filtroAtual = ref('todos')
const termoBusca = ref('')
const sortCol = ref('nomeCompleto')
const sortDir = ref(1)
const paginaAtual = ref(1)
const itensPorPagina = ref(20)
const modalAberto = ref(false)
const usuarioSelecionado = ref(null)
const donutRef = ref(null)
const barRef = ref(null)
const atualizadoEm = ref('')
const router = useRouter()

let donutChart = null
let barChart = null

// ─── paleta de cores por tipo ───
const COLORS = {
  aluno:       { bg: '#3266ad', light: '#dbeafe', text: '#1e40af' },
  funcionario: { bg: '#639922', light: '#dcfce7', text: '#166534' },
  visitante:   { bg: '#BA7517', light: '#fef3c7', text: '#92400e' },
  outro:       { bg: '#6b7280', light: '#f3f4f6', text: '#374151' },
}

// ─── firebase ───
onMounted(async () => {
  atualizadoEm.value = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  try {
    const q = query(collection(db, 'inscricoes'), orderBy('nomeCompleto'))
    const snapshot = await getDocs(q)
    usuariosOrdenados.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) =>
        (a.nomeCompleto || '').normalize('NFD').toLowerCase()
          .localeCompare((b.nomeCompleto || '').normalize('NFD').toLowerCase())
      )
  } catch (err) {
    console.error('Erro ao carregar inscrições:', err)
  }
  await nextTick()
  renderDonut()
  renderBarChart()
})

// ─── computed: contagens ───
const totalAlunos      = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'aluno').length)
const totalFuncionarios = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'funcionario').length)
const totalVisitantes  = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'visitante').length)

const kpiCards = computed(() => {
  const total = usuariosOrdenados.value.length || 1
  return [
    {
      tipo: 'todos',
      label: 'Total geral',
      count: usuariosOrdenados.value.length,
      pct: 100,
      color: '#3b82f6',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      tipo: 'aluno',
      label: 'Alunos',
      count: totalAlunos.value,
      pct: Math.round(totalAlunos.value / total * 100),
      color: '#3266ad',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
    },
    {
      tipo: 'funcionario',
      label: 'Funcionários',
      count: totalFuncionarios.value,
      pct: Math.round(totalFuncionarios.value / total * 100),
      color: '#639922',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
    },
    {
      tipo: 'visitante',
      label: 'Visitantes',
      count: totalVisitantes.value,
      pct: Math.round(totalVisitantes.value / total * 100),
      color: '#BA7517',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>'
    },
  ]
})

// ─── filtros de tabela ───
const filtros = [
  { label: 'Todos', value: 'todos' },
  { label: 'Alunos', value: 'aluno' },
  { label: 'Funcionários', value: 'funcionario' },
  { label: 'Visitantes', value: 'visitante' },
]

const usuariosFiltrados = computed(() => {
  let data = filtroAtual.value === 'todos'
    ? usuariosOrdenados.value
    : usuariosOrdenados.value.filter(u => u.tipoParticipante === filtroAtual.value)

  const s = termoBusca.value.trim().toLowerCase()
  if (s) {
    data = data.filter(u =>
      (u.nomeCompleto || '').toLowerCase().includes(s) ||
      (u.cidade || '').toLowerCase().includes(s) ||
      (u.escola || '').toLowerCase().includes(s) ||
      (u.localTrabalho || '').toLowerCase().includes(s) ||
      (u.uf || '').toLowerCase().includes(s)
    )
  }

  return [...data].sort((a, b) => {
    const va = (a[sortCol.value] || '').toString().toLowerCase()
    const vb = (b[sortCol.value] || '').toString().toLowerCase()
    return sortDir.value * va.localeCompare(vb)
  })
})

// ─── paginação ───
const totalPaginas = computed(() => Math.ceil(usuariosFiltrados.value.length / itensPorPagina.value))
const usuariosPaginados = computed(() => {
  const start = (paginaAtual.value - 1) * itensPorPagina.value
  return usuariosFiltrados.value.slice(start, start + itensPorPagina.value)
})
const paginasVisiveis = computed(() => {
  const total = totalPaginas.value
  const cur = paginaAtual.value
  const pages = []
  for (let p = Math.max(1, cur - 2); p <= Math.min(total, cur + 2); p++) pages.push(p)
  return pages
})
watch([filtroAtual, termoBusca], () => { paginaAtual.value = 1 })

// ─── estatísticas ───
function countBy(arr, key) {
  const map = {}
  arr.forEach(u => {
    const v = u[key]
    if (v) map[v] = (map[v] || 0) + 1
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

const statsPorUF = computed(() => {
  const entries = countBy(usuariosOrdenados.value, 'uf')
  const max = entries[0]?.[1] || 1
  const total = usuariosOrdenados.value.length || 1
  return entries.map(([label, count]) => ({
    label, count, pct: Math.round(count / total * 100),
    barPct: Math.round(count / max * 100)
  }))
})

const statsEventos = computed(() => {
  const map = {}
  usuariosOrdenados.value.forEach(u => {
    const evs = Array.isArray(u.eventosSelecionados) ? u.eventosSelecionados : [u.eventosSelecionados]
    evs.forEach(e => { if (e) map[e] = (map[e] || 0) + 1 })
  })
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = entries[0]?.[1] || 1
  const total = usuariosOrdenados.value.length || 1
  return entries.map(([label, count]) => ({
    label, count, pct: Math.round(count / max * 100)
  }))
})

const statsInstituicoes = computed(() => {
  const map = {}
  usuariosOrdenados.value.forEach(u => {
    const inst = u.escola || u.localTrabalho
    if (inst) map[inst] = (map[inst] || 0) + 1
  })
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = entries[0]?.[1] || 1
  return entries.map(([label, count]) => ({
    label, count, pct: Math.round(count / max * 100)
  }))
})

const faixasEtarias = computed(() => {
  const buckets = { '< 15': 0, '15–17': 0, '18–25': 0, '26–40': 0, '> 40': 0 }
  const colors  = { '< 15': '#818cf8', '15–17': '#3266ad', '18–25': '#639922', '26–40': '#BA7517', '> 40': '#e06b61' }
  usuariosOrdenados.value.forEach(u => {
    if (!u.dataNascimento) return
    const age = calcIdade(u.dataNascimento)
    if (age < 15) buckets['< 15']++
    else if (age <= 17) buckets['15–17']++
    else if (age <= 25) buckets['18–25']++
    else if (age <= 40) buckets['26–40']++
    else buckets['> 40']++
  })
  const max = Math.max(...Object.values(buckets), 1)
  const total = usuariosOrdenados.value.length || 1
  return Object.entries(buckets).map(([label, count]) => ({
    label, count,
    pct: Math.round(count / total * 100),
    color: colors[label]
  }))
})

const donutLegendItems = computed(() => {
  const total = usuariosOrdenados.value.length || 1
  return [
    { label: 'Alunos', count: totalAlunos.value, pct: Math.round(totalAlunos.value / total * 100), color: '#3266ad' },
    { label: 'Funcionários', count: totalFuncionarios.value, pct: Math.round(totalFuncionarios.value / total * 100), color: '#639922' },
    { label: 'Visitantes', count: totalVisitantes.value, pct: Math.round(totalVisitantes.value / total * 100), color: '#BA7517' },
  ]
})

// ─── gráficos ───
function renderDonut() {
  if (!donutRef.value) return
  const ctx = donutRef.value.getContext('2d')
  if (donutChart) donutChart.destroy()
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Alunos', 'Funcionários', 'Visitantes'],
      datasets: [{
        data: [totalAlunos.value, totalFuncionarios.value, totalVisitantes.value],
        backgroundColor: ['#3266ad', '#639922', '#BA7517'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: false,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
      }
    }
  })
}

function renderBarChart() {
  if (!barRef.value) return
  const ctx = barRef.value.getContext('2d')
  const entries = countBy(usuariosOrdenados.value, 'cidade').slice(0, 5)
  if (barChart) barChart.destroy()
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: entries.map(([l]) => l),
      datasets: [{
        label: 'Inscritos',
        data: entries.map(([, c]) => c),
        backgroundColor: ['#3266ad', '#639922', '#BA7517', '#818cf8', '#e06b61'],
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 1, font: { size: 11 } } }
      }
    }
  })
}

watch(usuariosOrdenados, async () => {
  await nextTick()
  renderDonut()
  renderBarChart()
})

// ─── helpers ───
function getColor(tipo) {
  return COLORS[tipo] || COLORS.outro
}

function getInitials(name) {
  return (name || '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

function calcIdade(dob) {
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
  return age
}

function toggleSort(col) {
  if (sortCol.value === col) sortDir.value *= -1
  else { sortCol.value = col; sortDir.value = 1 }
}

function temAtividades(u) {
  return u?.eventosSelecionados?.length ||
    (u?.oficinasSelecionadas && Object.keys(u.oficinasSelecionadas).length) ||
    (u?.exposicoesSelecionadas && Object.keys(u.exposicoesSelecionadas).length) ||
    u?.palestraSelecionada
}

function oficinasStr(u) {
  if (!u?.oficinasSelecionadas) return ''
  return Object.values(u.oficinasSelecionadas).filter(Boolean).join(', ')
}

function exposicoesStr(u) {
  if (!u?.exposicoesSelecionadas) return ''
  return Object.values(u.exposicoesSelecionadas).filter(Boolean).join(', ')
}

// ─── modal ───
function abrirModal(usuario) {
  usuarioSelecionado.value = usuario
  modalAberto.value = true
}

// ─── exportações ───
function baixarExcel() {
  const dados = usuariosFiltrados.value.map(u => ({
    Nome: u.nomeCompleto || '',
    Cidade: u.cidade || '',
    UF: u.uf || '',
    Tipo: u.tipoParticipante || '',
    Escola: u.escola || '',
    Trabalho: u.localTrabalho || '',
    Telefone: u.telefone || '',
    Nascimento: u.dataNascimento || '',
    Eventos: Array.isArray(u.eventosSelecionados)
      ? u.eventosSelecionados.join(', ')
      : (u.eventosSelecionados || ''),
    Oficinas: oficinasStr(u),
    Exposicoes: exposicoesStr(u),
    Palestra: u.palestraSelecionada || '',
  }))
  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inscritos')
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([out], { type: 'application/octet-stream' }), 'inscritos.xlsx')
}

function baixarCSV() {
  const headers = ['Nome','Cidade','UF','Tipo','Escola','Trabalho','Telefone','Nascimento','Eventos']
  const rows = usuariosFiltrados.value.map(u => [
    u.nomeCompleto || '',
    u.cidade || '',
    u.uf || '',
    u.tipoParticipante || '',
    u.escola || '',
    u.localTrabalho || '',
    u.telefone || '',
    u.dataNascimento || '',
    Array.isArray(u.eventosSelecionados) ? u.eventosSelecionados.join(' | ') : (u.eventosSelecionados || ''),
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  saveAs(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), 'inscritos.csv')
}

async function logout() {
  try {
    await signOut(auth)
    router.push('/')
  } catch (err) {
    console.error('Erro ao sair:', err)
  }
}
</script>

<style scoped>
/* ─── imports ─── */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

/* ─── reset & base ─── */
* { box-sizing: border-box; margin: 0; padding: 0; }

.admin-wrap {
  min-height: 100vh;
  background: #f8f7f4;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1a18;
}

/* ─── topbar ─── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #2734AF;
  color: #f0ede6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 2rem;
  gap: 1rem;
}
.topbar-left { display: flex; align-items: center; gap: 14px; }
.logo-mark {
  width: 36px; height: 36px;
  background: #2d4a8a;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.topbar-title { font-size: 15px; font-weight: 600; line-height: 1.2; color: #f0ede6; }
.topbar-sub { font-size: 11px; color: #8a8780; font-family: 'IBM Plex Mono', monospace; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.online-badge {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: white;
  font-family: 'IBM Plex Mono', monospace;
}
.dot-pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74,222,128,0.4);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
  70%  { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
}
.btn-logout {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid white;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-logout:hover { background: #2d0f0f; border-color: #7f1d1d; color: #fca5a5; }

/* ─── content ─── */
.content { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; max-width: 1400px; margin: 0 auto; }

/* ─── kpi grid ─── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 12px;
}
.kpi-card {
  background: #fff;
  border: 1.5px solid #e8e6e0;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}
.kpi-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.kpi-card.active { border-color: var(--accent); }
.kpi-card.active::before { opacity: 1; }
.kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.kpi-icon { color: var(--accent); opacity: 0.8; }
.kpi-delta {
  font-size: 10px;
  font-family: 'IBM Plex Mono', monospace;
  background: #f0ede6;
  padding: 2px 6px;
  border-radius: 4px;
  color: #6b6860;
}
.kpi-number { font-size: 2.4rem; font-weight: 600; line-height: 1; color: #1a1a18; }
.kpi-label { font-size: 13px; color: #6b6860; margin-top: 4px; margin-bottom: 10px; }
.kpi-bar { height: 4px; background: #f0ede6; border-radius: 2px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s ease; }
.kpi-pct { font-size: 11px; color: #9a9890; margin-top: 4px; font-family: 'IBM Plex Mono', monospace; }

/* ─── chart cards ─── */
.charts-row, .stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.chart-card {
  background: #fff;
  border: 1.5px solid #e8e6e0;
  border-radius: 12px;
  padding: 1.25rem;
}
.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #3a3a36;
  letter-spacing: 0.02em;
  margin-bottom: 1rem;
  text-transform: uppercase;
}
.donut-wrap { display: flex; align-items: center; gap: 1.5rem; }
.donut-container { position: relative; flex-shrink: 0; }
.donut-center {
  position: absolute;
  inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  pointer-events: none;
}
.donut-total { font-size: 26px; font-weight: 600; line-height: 1; color: #1a1a18; }
.donut-total-label { font-size: 10px; color: #9a9890; font-family: 'IBM Plex Mono', monospace; margin-top: 2px; }
.donut-legend { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.donut-legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; }
.legend-square { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.legend-name { flex: 1; color: #3a3a36; }
.legend-count { font-weight: 600; color: #1a1a18; }
.legend-pct { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #9a9890; }
.bar-chart-wrap { position: relative; height: 160px; }

/* ─── progress lists ─── */
.age-list, .stat-list { display: flex; flex-direction: column; gap: 8px; }
.age-row, .stat-item {
  display: grid;
  grid-template-columns: 70px 1fr 30px 36px;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.age-label, .stat-name {
  color: #3a3a36;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.age-track, .stat-track {
  height: 6px;
  background: #f0ede6;
  border-radius: 3px;
  overflow: hidden;
}
.age-fill, .stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
  background: #3266ad;
}
.stat-fill.green { background: #639922; }
.stat-fill.amber { background: #BA7517; }
.age-count, .stat-count { color: #1a1a18; font-weight: 500; text-align: right; }
.age-pct, .stat-pct { font-size: 10px; color: #9a9890; font-family: 'IBM Plex Mono', monospace; }

/* ─── table ─── */
.table-section {
  background: #fff;
  border: 1.5px solid #e8e6e0;
  border-radius: 12px;
  overflow: hidden;
}
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid #f0ede6;
}
.toolbar-left { display: flex; align-items: center; gap: 10px; }
.result-count {
  font-size: 12px;
  background: #f0ede6;
  padding: 2px 8px;
  border-radius: 10px;
  color: #6b6860;
  font-family: 'IBM Plex Mono', monospace;
}
.toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9a9890; }
.search-input {
  padding: 7px 12px 7px 30px;
  background: #f8f7f4;
  border: 1px solid #e8e6e0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #1a1a18;
  outline: none;
  width: 220px;
  transition: border-color 0.15s;
}
.search-input:focus { border-color: #2d4a8a; background: #fff; }
.filter-pills { display: flex; gap: 5px; }
.pill {
  padding: 5px 12px;
  font-size: 12px;
  background: #f8f7f4;
  border: 1px solid #e8e6e0;
  border-radius: 20px;
  cursor: pointer;
  color: #6b6860;
  transition: all 0.15s;
  font-family: inherit;
}
.pill:hover { border-color: #2d4a8a; color: #2d4a8a; }
.pill.active { background: #2d4a8a; border-color: #2d4a8a; color: #fff; }
.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.data-table thead tr {
  background: #f8f7f4;
  border-bottom: 1px solid #e8e6e0;
}
.data-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6b6860;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.data-table th.sortable { cursor: pointer; user-select: none; }
.data-table th.sortable:hover { color: #1a1a18; }
.sort-arrow { font-size: 10px; color: #9a9890; margin-left: 3px; }
.data-row td { padding: 10px 14px; border-bottom: 1px solid #f4f2ed; color: #1a1a18; vertical-align: middle; }
.data-row:last-child td { border-bottom: none; }
.data-row.alt { background: #faf9f7; }
.data-row:hover td { background: #f0ede6 !important; cursor: pointer; }
.td-num { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #9a9890; width: 36px; }
.td-muted { color: #6b6860; }
.td-trunc { max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-cell { display: flex; align-items: center; gap: 9px; }
.avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  flex-shrink: 0;
}
.user-name { font-weight: 500; color: #1a1a18; }
.empty-row { text-align: center; padding: 3rem; color: #9a9890; font-size: 13px; }

/* ─── badges ─── */
.badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-aluno       { background: #dbeafe; color: #1e40af; }
.badge-funcionario { background: #dcfce7; color: #166534; }
.badge-visitante   { background: #fef3c7; color: #92400e; }
.badge-outro       { background: #f3f4f6; color: #374151; }

/* ─── btn detail ─── */
.btn-detail {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #e8e6e0;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #6b6860;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-detail:hover { background: #f0ede6; border-color: #2d4a8a; color: #2d4a8a; }

/* ─── paginação ─── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0.9rem 1.25rem;
  border-top: 1px solid #f0ede6;
}
.pag-info { font-size: 12px; color: #9a9890; font-family: 'IBM Plex Mono', monospace; }
.pag-btns { display: flex; gap: 4px; }
.pag-btn {
  min-width: 30px; height: 30px;
  background: transparent;
  border: 1px solid #e8e6e0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: #3a3a36;
  font-family: inherit;
  transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; padding: 0 6px;
}
.pag-btn:hover:not(:disabled) { background: #f0ede6; border-color: #2d4a8a; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-btn.current { background: #2d4a8a; border-color: #2d4a8a; color: #fff; }
.pag-select {
  padding: 5px 8px;
  background: #f8f7f4;
  border: 1px solid #e8e6e0;
  border-radius: 6px;
  font-size: 12px;
  font-family: inherit;
  color: #3a3a36;
  cursor: pointer;
}

/* ─── actions bar ─── */
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #e8e6e0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.actions-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.btn-action {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-action.green { background: #166534; color: #fff; }
.btn-action.green:hover { background: #14532d; }
.btn-action.blue { background: #1e3a8a; color: #fff; }
.btn-action.blue:hover { background: #1e40af; }
.export-note { font-size: 12px; color: #9a9890; font-family: 'IBM Plex Mono', monospace; }
.btn-logout-footer {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e8e6e0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  color: #6b6860;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-logout-footer:hover { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }

/* ─── modal ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,26,24,0.55);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1.5px solid #e8e6e0;
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.25rem;
  border-bottom: 1px solid #f0ede6;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.modal-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 600;
  flex-shrink: 0;
}
.modal-info { flex: 1; }
.modal-name { font-size: 16px; font-weight: 600; color: #1a1a18; margin-bottom: 4px; }
.modal-close-btn {
  background: transparent;
  border: 1px solid #e8e6e0;
  border-radius: 6px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #9a9890;
  transition: all 0.15s;
}
.modal-close-btn:hover { background: #f0ede6; color: #1a1a18; }
.modal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
.modal-section-title {
  font-size: 10px;
  font-weight: 600;
  color: #9a9890;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  font-family: 'IBM Plex Mono', monospace;
}
.modal-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 0;
  border-bottom: 1px solid #f8f7f4;
  gap: 12px;
}
.modal-row:last-child { border-bottom: none; }
.modal-label { font-size: 13px; color: #6b6860; flex-shrink: 0; }
.modal-val { font-size: 13px; font-weight: 500; color: #1a1a18; text-align: right; }
.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #f0ede6;
  display: flex;
  justify-content: flex-end;
}

/* ─── transition ─── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ─── responsivo ─── */
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row, .stats-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .content { padding: 1rem; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .topbar { padding: 0.75rem 1rem; }
  .toolbar-right { width: 100%; }
  .search-input { width: 100%; }
}
</style>