<template>
  <section id="app-speakers" @keydown.esc="closeModal">

    <!-- ══════════ FUNDO ATMOSFÉRICO ══════════ -->
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--1" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--2" aria-hidden="true"></div>

    <!-- ══════════ CABEÇALHO EDITORIAL ══════════ -->
    <header class="section-header">
      <div class="eyebrow">
        <span class="eyebrow-line"></span>
        <span class="eyebrow-text">SALIP · Semana de Arte e Literatura</span>
        <span class="eyebrow-line"></span>
      </div>
      <h1 class="section-title">
        Palestrantes<br /><em>&amp; Artistas</em>
      </h1>
      <p class="section-sub">Todas as edições · todos os participantes</p>

      <!-- Contadores -->
      <div class="stats-row">
        <div class="stat-card" v-for="stat in computedStats" :key="stat.label">
          <strong class="stat-num">{{ stat.value }}</strong>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </header>

    <!-- ══════════ CONTROLES ══════════ -->
    <div class="controls-bar">

      <!-- Seletor de Edição -->
      <nav class="edition-tabs" role="tablist" aria-label="Selecionar edição">
        <button
          v-for="ed in editions"
          :key="ed.year"
          role="tab"
          :aria-selected="selectedEdition === ed.year"
          class="edition-tab"
          :class="{ 'is-active': selectedEdition === ed.year }"
          @click="selectEdition(ed.year)"
        >
          <span class="tab-year">{{ ed.year }}</span>
          <span class="tab-label">{{ ed.label }}</span>
          <span class="tab-count">{{ ed.data.length }}</span>
        </button>
      </nav>

      <!-- Linha 2: Busca + Filtros + View -->
      <div class="controls-row2">
        <!-- Busca -->
        <label class="search-wrapper" aria-label="Buscar participante">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            class="search-input"
            type="search"
            placeholder="Buscar nome, evento ou local…"
            aria-label="Buscar participante"
          />
          <kbd v-if="!searchQuery" class="search-kbd">⌘K</kbd>
        </label>

        <!-- Filtro Tipo -->
        <div class="filter-chips" role="group" aria-label="Filtrar por tipo">
          <button
            v-for="type in typeFilters"
            :key="type.value"
            class="chip"
            :class="{ 'is-active': selectedType === type.value }"
            @click="selectedType = type.value"
          >
            <span class="chip-dot" :style="{ background: type.color }"></span>
            {{ type.label }}
            <span class="chip-count">{{ type.count }}</span>
          </button>
        </div>

        <!-- Toggle de vista -->
        <div class="view-toggle" role="group" aria-label="Modo de visualização">
          <button
            class="view-btn"
            :class="{ 'is-active': viewMode === 'carousel' }"
            @click="viewMode = 'carousel'"
            aria-label="Ver como carrossel"
            title="Carrossel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="7" height="14" rx="1"/><rect x="10.5" y="5" width="3" height="14" rx="1" opacity=".5"/>
              <rect x="15" y="5" width="7" height="14" rx="1" opacity=".3"/>
            </svg>
          </button>
          <button
            class="view-btn"
            :class="{ 'is-active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            aria-label="Ver como grade"
            title="Grade"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
              <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════ RESULTADO VAZIO ══════════ -->
    <Transition name="fade">
      <div v-if="filteredFotos.length === 0" class="empty-state">
        <svg viewBox="0 0 64 64" fill="none" class="empty-icon">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
          <path d="M22 32h20M32 22v20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".4"/>
        </svg>
        <p>Nenhum resultado encontrado</p>
        <button class="btn-ghost" @click="clearFilters">Limpar filtros</button>
      </div>
    </Transition>

    <!-- ══════════ MODO CARROSSEL ══════════ -->
    <Transition name="slide-up">
      <div v-if="viewMode === 'carousel' && filteredFotos.length > 0" class="carousel-wrap">
        <swiper
          :modules="modules"
          :loop="filteredFotos.length > swiperBreakpoints[1200].slidesPerView"
          :navigation="true"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :autoplay="{ delay: 4500, disableOnInteraction: true, pauseOnMouseEnter: true }"
          :breakpoints="swiperBreakpoints"
          class="mySwiper"
        >
          <swiper-slide v-for="(item, index) in filteredFotos" :key="`${item.titulo}-${index}`">
            <article class="card" @click="openModal(item)" tabindex="0" @keydown.enter="openModal(item)">
              <header class="card-header">
                <div class="img-wrapper">
                  <img class="main-img" :src="item.url" :alt="`Foto de ${item.titulo}`" loading="lazy" />
                  <div class="card-glow" aria-hidden="true"></div>
                </div>
                <span class="badge" :style="{ background: badgeColor(item.descricao) }">{{ item.descricao }}</span>
                <button class="card-btn-info" @click.stop="openModal(item)" aria-label="Ver detalhes" tabindex="-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </button>
              </header>

              <div class="card-body">
                <h2 class="card-title">{{ item.titulo }}</h2>
                <h3 class="card-subtitle">{{ item.professor }}</h3>

                <ul class="info-list">
                  <li class="info-item" v-if="item.evento">
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <span>{{ item.evento }}</span>
                  </li>
                  <li class="info-item" v-if="item.data || item.hora">
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span>{{ item.data }} <strong v-if="item.hora">às {{ item.hora }}</strong></span>
                  </li>
                  <li class="info-item" v-if="item.mediacao">
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>{{ item.mediacao }}</span>
                  </li>
                </ul>
              </div>

              <footer class="card-footer">
                <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ item.local }}</span>
              </footer>
            </article>
          </swiper-slide>
        </swiper>
      </div>
    </Transition>

    <!-- ══════════ MODO GRADE ══════════ -->
    <Transition name="slide-up">
      <div v-if="viewMode === 'grid' && filteredFotos.length > 0" class="grid-wrap">
        <TransitionGroup name="grid-item" tag="div" class="grid-container">
          <article
            v-for="(item, index) in filteredFotos"
            :key="`grid-${item.titulo}-${index}`"
            class="card"
            @click="openModal(item)"
            tabindex="0"
            @keydown.enter="openModal(item)"
            :style="{ '--delay': `${(index % 12) * 40}ms` }"
          >
            <header class="card-header">
              <div class="img-wrapper">
                <img class="main-img" :src="item.url" :alt="`Foto de ${item.titulo}`" loading="lazy" />
                <div class="card-glow" aria-hidden="true"></div>
              </div>
              <span class="badge" :style="{ background: badgeColor(item.descricao) }">{{ item.descricao }}</span>
            </header>

            <div class="card-body">
              <h2 class="card-title">{{ item.titulo }}</h2>
              <h3 class="card-subtitle">{{ item.professor }}</h3>

              <ul class="info-list">
                <li class="info-item" v-if="item.data || item.hora">
                  <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  <span>{{ item.data }} <strong v-if="item.hora">às {{ item.hora }}</strong></span>
                </li>
              </ul>
            </div>

            <footer class="card-footer">
              <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ item.local }}</span>
            </footer>
          </article>
        </TransitionGroup>
      </div>
    </Transition>

    <!-- ══════════ MODAL DE DETALHES ══════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalItem" class="modal-backdrop" @click.self="closeModal" role="dialog" aria-modal="true" :aria-label="modalItem?.titulo">
          <div class="modal-panel">
            <button class="modal-close" @click="closeModal" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <div class="modal-img-col">
              <img :src="modalItem.url" :alt="modalItem.titulo" class="modal-img" />
              <div class="modal-img-glow" aria-hidden="true"></div>
            </div>

            <div class="modal-content">
              <span class="badge modal-badge" :style="{ background: badgeColor(modalItem.descricao) }">{{ modalItem.descricao }}</span>
              <h2 class="modal-title">{{ modalItem.titulo }}</h2>
              <p class="modal-professor">{{ modalItem.professor }}</p>

              <div class="modal-divider"></div>

              <dl class="modal-details">
                <template v-if="modalItem.evento">
                  <dt>
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    Evento
                  </dt>
                  <dd>{{ modalItem.evento }}</dd>
                </template>

                <template v-if="modalItem.data">
                  <dt>
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    Data
                  </dt>
                  <dd>{{ modalItem.data }}<span v-if="modalItem.hora"> · {{ modalItem.hora }}</span></dd>
                </template>

                <template v-if="modalItem.mediacao">
                  <dt>
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Mediação
                  </dt>
                  <dd>{{ modalItem.mediacao }}</dd>
                </template>

                <template v-if="modalItem.local">
                  <dt>
                    <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Local
                  </dt>
                  <dd>{{ modalItem.local }}</dd>
                </template>
              </dl>

              <div class="modal-divider"></div>
              <p class="modal-edition-tag">
                <svg class="icosvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                SALIP · Edição {{ selectedEdition }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'

// ─── Módulos Swiper ───────────────────────────────────────────
const modules = [Pagination, Autoplay, Navigation]

const swiperBreakpoints = {
  320:  { slidesPerView: 1,   spaceBetween: 16 },
  580:  { slidesPerView: 2,   spaceBetween: 20 },
  900:  { slidesPerView: 3,   spaceBetween: 24 },
  1200: { slidesPerView: 4,   spaceBetween: 28 },
}

// ─── Estado ───────────────────────────────────────────────────
const selectedEdition = ref(2025)
const selectedType    = ref('todos')
const searchQuery     = ref('')
const viewMode        = ref('carousel')
const modalItem       = ref(null)

// ─── Funções de controle ──────────────────────────────────────
function selectEdition(year) {
  selectedEdition.value = year
  selectedType.value = 'todos'
  searchQuery.value = ''
}

function openModal(item) { modalItem.value = item }
function closeModal()    { modalItem.value = null  }
function clearFilters()  { selectedType.value = 'todos'; searchQuery.value = '' }

function badgeColor(desc) {
  if (!desc) return '#2734AF'
  const d = desc.toLowerCase()
  if (d.includes('show'))    return '#8B1A4A'
  if (d.includes('pública')) return '#1a6b4a'
  return '#2734AF'
}

// ─── Dados por Edição ─────────────────────────────────────────
const data2025 = [
  { url: '/IMG/cardPalestrante.png',   titulo: 'Cineas Santos (PI)',            professor: 'Prof. Cineas Santos',                  evento: 'A lírica do poeta Manuel Bandeira',                  data: '24/05/2025', hora: '8h30min', descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',            local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante2.png',  titulo: 'Luiz Romero Lima (PI)',          professor: 'Prof. Luiz Romero Lima',               evento: 'O cânone literário o sublime piauiense',             data: '23/05/2025', hora: '14h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2',            local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante3.png',  titulo: 'José de Nicola (SP)',            professor: 'Prof. José de Nicola',                 evento: 'A lírica do poeta Manuel Bandeira',                  data: '24/05/2025', hora: '8h30min', descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',            local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante4.png',  titulo: 'Fabrício Carpinejar (RS)',       professor: 'Fabricio Carpinejar',                  evento: 'Palestra de abertura com Fabrício Carpinejar',       data: '22/05/2025', hora: '19h',     descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',            local: 'Centro Educacional de Eventos Dep. Ciro Nogueira' },
  { url: '/IMG/cardPalestrante5.png',  titulo: 'Ernâni Getirana de Lima',        professor: 'Prof. Ernâni Getirana de Lima',        evento: 'A literatura de Pedro II: da pré-história aos dias', data: '23/05/2025', hora: '16h30min', descricao: 'Palestra pública', mediacao: 'Mediação: SALIP2',            local: 'Auditório Padre Norberto' },
  { url: '/IMG/CardPalestrante6.png',  titulo: 'Gonzaga Lu e Trio Asa Branca',   professor: 'Gonzaga Lu e Trio Asa Branca',         evento: 'Show de encerramento',                               data: '24/05/2025', hora: '21h',     descricao: 'Show público',      mediacao: 'Cantor: Gonzaga Lu',          local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/CardPalestrante7.png',  titulo: 'Grupo Harém de Teatro (PI)',     professor: 'Texto: Samuel Becket / Drama: Arimatan Martins', evento: 'Teatro',                              data: '23/05/2025', hora: '19h',     descricao: 'Show Público',      mediacao: 'Mediação: Helany Max',        local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/CardPalestrante8.png',  titulo: 'Grupo Urutau',                   professor: 'Sítio do Pica-Pau Amarelo',            evento: 'Teatro',                                             data: '23/05/2025', hora: '10h',     descricao: 'Show Público',      mediacao: 'Grupo: Urutau',               local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante9.png',  titulo: 'Histórias / Teatro de Bonecos',  professor: 'Chagas Vale',                          evento: 'Teatro',                                             data: '23/05/2025', hora: '9h',      descricao: 'Show Público',      mediacao: 'Mediação: Ravena Ribeiro',    local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante10.png', titulo: 'Histórias / Teatro de Bonecos',  professor: 'Talitha do Monte',                     evento: 'Teatro',                                             data: '23/05/2025', hora: '9h',      descricao: 'Show Público',      mediacao: 'Mediação: Ravena Ribeiro',    local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/cardPalestrante11.png', titulo: 'A voz de Esperança Garcia',      professor: 'Bernardo Aurélio (PI)',                evento: 'Teatro',                                             data: '23/05/2025', hora: '8h30min', descricao: 'Show Público',      mediacao: 'Mediação: Waleria Rubens (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante12.png', titulo: 'A voz de Esperança Garcia',      professor: 'João P. Luiz (PI)',                    evento: 'Teatro',                                             data: '23/05/2025', hora: '8h30min', descricao: 'Show Público',      mediacao: 'Mediação: Waleria Rubens (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante13.png', titulo: 'Grupo Cocares (PI)',             professor: 'Vários Artistas',                      evento: 'Teatro',                                             data: '23/05/2025', hora: '8h30min', descricao: 'Show Público',      mediacao: 'Mediação: Germano Bonfim (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/CardPslestrante14.png', titulo: 'Poesia, Música e Sala de Aula',  professor: 'Adriano Lobão Aragão (PI)',            evento: 'Teatro',                                             data: '24/05/2025', hora: '14h30min', descricao: 'Show Público',     mediacao: 'Mediação: Helany Max',        local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante17.png', titulo: 'Piauienses Escritoras',          professor: 'Jasmine Malta (PI)',                   evento: 'Teatro - Gênese Histórica',                          data: '24/05/2025', hora: '10h30min', descricao: 'Show Público',     mediacao: 'Mediação: Kássio Gomes (PI)', local: 'Auditório Padre Norberto' },
  { url: '/IMG/cardPalestrante15.png', titulo: 'Roda de Conversa: Mulher na Literatura', professor: 'Marina Campelo (PI)',         evento: 'Teatro',                                             data: '24/05/2025', hora: '16h30min', descricao: 'Show Público',     mediacao: 'Mediação: Ernani Getirana (PI)', local: 'Auditório Padre Norberto' },
]


// ─── Edições disponíveis ──────────────────────────────────────
const editions = computed(() => [
  { year: 2025, label: '3ª Edição', data: data2025 },
])

const currentEditionData = computed(() =>
  editions.value.find(e => e.year === selectedEdition.value)?.data ?? []
)

// ─── Filtros de tipo ──────────────────────────────────────────
const typeFilters = computed(() => {
  const data = currentEditionData.value
  const count = (term) => data.filter(i => i.descricao?.toLowerCase().includes(term)).length
  return [
    { value: 'todos',    label: 'Todos',    color: '#6366f1', count: data.length },
    { value: 'palestra', label: 'Palestra', color: '#1a6b4a', count: count('palestra') },
    { value: 'show',     label: 'Show',     color: '#8B1A4A', count: count('show') },
  ]
})

// ─── Dados filtrados ──────────────────────────────────────────
const filteredFotos = computed(() => {
  let result = currentEditionData.value
  if (selectedType.value !== 'todos') {
    result = result.filter(i => i.descricao?.toLowerCase().includes(selectedType.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(i =>
      i.titulo?.toLowerCase().includes(q) ||
      i.professor?.toLowerCase().includes(q) ||
      i.evento?.toLowerCase().includes(q) ||
      i.local?.toLowerCase().includes(q)
    )
  }
  return result
})

// ─── Estatísticas ─────────────────────────────────────────────
const computedStats = computed(() => {
  const all = editions.value.flatMap(e => e.data)
  const unique = new Set(all.map(i => i.professor)).size
  return [
    { value: all.length,               label: 'participações' },
    { value: unique,                   label: 'artistas únicos' },
    { value: editions.value.length,    label: 'edições' },
    { value: filteredFotos.value.length, label: 'exibindo' },
  ]
})

// ─── Fechar modal ao trocar edição ───────────────────────────
watch(selectedEdition, () => { modalItem.value = null })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap');

/* ════════════════════════════════════════
   RESET & ROOT
════════════════════════════════════════ */
#app-speakers {
  --c-bg:      #2734AF ;
  --c-surface: #0d1124;
  --c-border:  rgba(255,255,255,0.06);
  --c-gold:    #c9a84c;
  --c-gold-lt: #e8c97a;
  --c-wine:    #8B1A4A;
  --c-teal:    #1a6b4a;
  --c-blue:    #2734AF;
  --c-text:    #e8e4da;
  --c-muted:   rgba(232,228,218,0.45);
  --c-dim:     rgba(232,228,218,0.25);
  --ff-title:  'Playfair Display', Georgia, serif;
  --ff-body:   'Outfit', system-ui, sans-serif;
  --radius:    16px;
  --transition: 0.35s cubic-bezier(.4,0,.2,1);

  position: relative;
  padding: 5rem 1.5rem 6rem;
  background: var(--c-bg);
  font-family: var(--ff-body);
  color: var(--c-text);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* ════════════════════════════════════════
   FUNDO ATMOSFÉRICO
════════════════════════════════════════ */
.bg-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

.bg-orb {
  position: absolute; pointer-events: none; border-radius: 50%;
  filter: blur(120px); opacity: .12;
}
.bg-orb--1 { width: 600px; height: 600px; top: -200px; left: -100px; background: radial-gradient(circle, #c9a84c, transparent 70%); }
.bg-orb--2 { width: 500px; height: 500px; bottom: -150px; right: -100px; background: radial-gradient(circle, #8B1A4A, transparent 70%); }

/* ════════════════════════════════════════
   CABEÇALHO EDITORIAL
════════════════════════════════════════ */
.section-header { text-align: center; margin-bottom: 3.5rem; position: relative; z-index: 1; }

.eyebrow {
  display: flex; align-items: center; justify-content: center;
  gap: 1rem; margin-bottom: 1.5rem;
}
.eyebrow-line { flex: 1; max-width: 80px; height: 1px; background: linear-gradient(to right, transparent, var(--c-gold)); }
.eyebrow-line:last-child { background: linear-gradient(to left, transparent, var(--c-gold)); }
.eyebrow-text { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-gold); }

.section-title {
  font-family: var(--ff-title);
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 0.75rem;
  color: #fff;
  letter-spacing: -1px;
}
.section-title em {
  font-style: italic;
  color: var(--c-gold);
  display: block;
}

.section-sub {
  font-size: 0.9rem; color: var(--c-muted); margin: 0 0 2.5rem;
  letter-spacing: 0.05em;
}

/* Stats Row */
.stats-row {
  display: flex; justify-content: center; flex-wrap: wrap;
  gap: 1px; background: var(--c-border);
  border: 1px solid var(--c-border);
  border-radius: var(--radius); overflow: hidden;
  max-width: 600px; margin: 0 auto;
}
.stat-card {
  flex: 1; min-width: 110px; padding: 1.25rem 1.5rem;
  background: rgba(255,255,255,.02);
  display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
  transition: background var(--transition);
}
.stat-card:hover { background: rgba(201,168,76,.06); }
.stat-num { font-size: 1.6rem; font-weight: 700; color: var(--c-gold-lt); font-variant-numeric: tabular-nums; }
.stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--c-muted); }

/* ════════════════════════════════════════
   CONTROLES
════════════════════════════════════════ */
.controls-bar {
  position: relative; z-index: 5;
  max-width: 1350px; margin: 0 auto 2.5rem;
  display: flex; flex-direction: column; gap: 1.25rem;
}

/* Tabs de edição */
.edition-tabs {
  display: flex; gap: 0;
  border: 1px solid var(--c-border); border-radius: 50px;
  background: rgba(255,255,255,.02);
  padding: 4px; width: fit-content; margin: 0 auto;
  overflow: hidden;
}

.edition-tab {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.6rem 1.5rem;
  background: transparent; border: none; border-radius: 40px;
  color: var(--c-muted); cursor: pointer;
  font-family: var(--ff-body); font-size: 0.85rem; font-weight: 500;
  transition: all var(--transition);
}
.edition-tab:hover { color: var(--c-text); background: rgba(255,255,255,.04); }
.edition-tab.is-active {
  background: var(--c-gold);
  color: #000;
  font-weight: 600;
}
.tab-year { font-weight: 700; }
.tab-label { opacity: .7; font-size: 0.75rem; }
.tab-count {
  background: rgba(0,0,0,.2); color: inherit;
  border-radius: 20px; padding: 0.1rem 0.5rem; font-size: 0.7rem;
}
.edition-tab.is-active .tab-count { background: rgba(0,0,0,.15); }

/* Row 2 */
.controls-row2 {
  display: flex; align-items: center; flex-wrap: wrap; gap: 0.75rem;
}

/* Search */
.search-wrapper {
  flex: 1; min-width: 220px;
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px; padding: 0 1rem; cursor: text;
  transition: border-color var(--transition);
}
.search-wrapper:focus-within { border-color: var(--c-gold); }
.search-icon { width: 16px; height: 16px; color: var(--c-muted); flex-shrink: 0; }
.search-input {
  flex: 1; background: none; border: none; outline: none;
  color: var(--c-text); font-family: var(--ff-body); font-size: 0.9rem;
  padding: 0.8rem 0;
}
.search-input::placeholder { color: var(--c-dim); }
.search-kbd {
  font-size: 0.65rem; color: var(--c-dim);
  border: 1px solid var(--c-border); border-radius: 4px;
  padding: 0.15rem 0.4rem; background: rgba(255,255,255,.04);
  font-family: var(--ff-body);
}

/* Filter chips */
.filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 50px; color: var(--c-muted);
  cursor: pointer; font-family: var(--ff-body); font-size: 0.8rem; font-weight: 500;
  transition: all var(--transition);
}
.chip:hover { color: var(--c-text); border-color: rgba(255,255,255,.15); }
.chip.is-active { color: var(--c-text); border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.07); }
.chip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.chip-count {
  font-size: 0.7rem; color: var(--c-muted);
  background: rgba(255,255,255,.05); border-radius: 10px; padding: 0 0.35rem;
}

/* View toggle */
.view-toggle {
  display: flex; gap: 2px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 10px; padding: 3px;
  margin-left: auto;
}
.view-btn {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; border-radius: 8px;
  color: var(--c-muted); cursor: pointer; transition: all var(--transition);
}
.view-btn svg { width: 16px; height: 16px; }
.view-btn:hover { color: var(--c-text); background: rgba(255,255,255,.05); }
.view-btn.is-active { background: var(--c-gold); color: #000; }

/* ════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════ */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 1rem; padding: 5rem 2rem; color: var(--c-muted);
}
.empty-icon { width: 64px; height: 64px; color: var(--c-muted); }
.btn-ghost {
  padding: 0.6rem 1.5rem; background: none;
  border: 1px solid var(--c-border); border-radius: 50px;
  color: var(--c-gold); cursor: pointer; font-family: var(--ff-body);
  font-size: 0.85rem; transition: all var(--transition);
}
.btn-ghost:hover { background: rgba(201,168,76,.1); border-color: var(--c-gold); }

/* ════════════════════════════════════════
   SWIPER CARROSSEL
════════════════════════════════════════ */
.carousel-wrap {
  position: relative; z-index: 1;
  max-width: 1350px; margin: 0 auto;
}

.mySwiper {
  width: 100%; padding: 1rem 0.5rem 3.5rem;
}

:deep(.swiper-slide) { height: auto !important; display: flex; }

/* ════════════════════════════════════════
   GRADE
════════════════════════════════════════ */
.grid-wrap {
  position: relative; z-index: 1;
  max-width: 1350px; margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

/* ════════════════════════════════════════
   CARDS
════════════════════════════════════════ */
.card {
  flex: 1;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex; flex-direction: column;
  cursor: pointer;
  position: relative;
  transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
  animation: cardIn var(--transition) var(--delay, 0ms) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-6px);
  border-color: rgba(201,168,76,.3);
  box-shadow: 0 20px 50px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,.1) inset;
}
.card:focus-visible { outline: 2px solid var(--c-gold); outline-offset: 2px; }

/* Linha dourada ao hover */
.card::before {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-gold), transparent);
  opacity: 0; transition: opacity var(--transition);
}
.card:hover::before { opacity: 1; }

/* Header do card */
.card-header { position: relative; overflow: hidden; }

.img-wrapper {
  width: 100%; aspect-ratio: 4/4; overflow: hidden;
  background: #1a1a2e;
}

.main-img {
  width: 100%; height: 100%; object-fit: cover; object-position: top center;
  transition: transform 0.7s cubic-bezier(.4,0,.2,1), filter 0.5s ease;
  filter: brightness(.9) saturate(.8);
}
.card:hover .main-img { transform: scale(1.07); filter: brightness(1) saturate(1); }

.card-glow {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(5,7,15,.85) 0%, transparent 50%);
  pointer-events: none;
}

/* Badge */
.badge {
  position: absolute; top: 0.85rem; left: 0.85rem;
  padding: 0.3rem 0.8rem; border-radius: 30px;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 10px rgba(0,0,0,.3);
}

.card-btn-info {
  position: absolute; top: 0.85rem; right: 0.85rem;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(5,7,15,.7); border: 1px solid rgba(255,255,255,.15);
  color: rgba(255,255,255,.7); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
  opacity: 0; transform: scale(0.8); transition: all 0.2s ease;
}
.card-btn-info svg { width: 14px; height: 14px; }
.card:hover .card-btn-info { opacity: 1; transform: scale(1); }

/* Body do card */
.card-body {
  padding: 1.25rem 1.25rem 0.75rem;
  flex: 1; display: flex; flex-direction: column;
}

.card-title {
  font-family: var(--ff-title);
  font-size: 1.05rem; font-weight: 700;
  color: #fff; margin: 0 0 0.2rem;
  line-height: 1.25;
}

.card-subtitle {
  font-size: 0.8rem; font-weight: 500;
  color: var(--c-gold); margin: 0 0 1rem;
}

.info-list {
  list-style: none; padding: 0; margin: 0 0 0.25rem;
  display: flex; flex-direction: column; gap: 0.55rem;
}
.info-item { display: flex; align-items: flex-start; gap: 0.6rem; }
.info-item span { font-size: 0.78rem; color: var(--c-muted); line-height: 1.45; }
.info-item strong { color: var(--c-text); font-weight: 600; }

/* Ícones inline */
.icosvg { width: 14px; height: 14px; flex-shrink: 0; color: var(--c-gold); margin-top: 1px; }

/* Footer do card */
.card-footer {
  padding: 0.9rem 1.25rem;
  border-top: 1px solid var(--c-border);
  display: flex; align-items: center; gap: 0.6rem;
}
.card-footer span { font-size: 0.75rem; font-weight: 600; color: var(--c-gold-lt); }

/* ════════════════════════════════════════
   SWIPER — CUSTOMIZAÇÃO
════════════════════════════════════════ */
:deep(.swiper-pagination-bullet) {
  background: rgba(255,255,255,.2); opacity: 1; transition: all 0.3s;
}
:deep(.swiper-pagination-bullet-active) {
  background: var(--c-gold) !important;
  transform: scale(1.4);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  background: var(--c-surface);
  width: 44px !important; height: 44px !important;
  border-radius: 50%;
  border: 1px solid var(--c-border);
  color: var(--c-gold) !important;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,.4);
}
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--c-gold); color: #000 !important;
  border-color: var(--c-gold); transform: scale(1.08);
}
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 16px !important; font-weight: 800;
}

/* ════════════════════════════════════════
   MODAL DE DETALHES
════════════════════════════════════════ */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(5,7,15,.88);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

.modal-panel {
  position: relative; display: flex;
  background: var(--c-surface);
  border: 1px solid rgba(201,168,76,.2);
  border-radius: 24px; overflow: hidden;
  max-width: 820px; width: 100%;
  max-height: 90vh;
  box-shadow: 0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(201,168,76,.1);
}

.modal-close {
  position: absolute; top: 1rem; right: 1rem; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(5,7,15,.7); border: 1px solid var(--c-border);
  color: var(--c-muted); cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: all 0.2s; backdrop-filter: blur(8px);
}
.modal-close:hover { color: #fff; border-color: rgba(255,255,255,.3); background: rgba(255,255,255,.1); }
.modal-close svg { width: 16px; height: 16px; }

.modal-img-col {
  position: relative; width: 320px; flex-shrink: 0; overflow: hidden;
}
.modal-img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.modal-img-glow {
  position: absolute; inset: 0;
  background: linear-gradient(to right, transparent 60%, var(--c-surface) 100%);
}

.modal-content {
  flex: 1; padding: 2.5rem 2rem; overflow-y: auto;
  display: flex; flex-direction: column; gap: 0;
}

.modal-badge { position: static; margin-bottom: 1rem; display: inline-block; }

.modal-title {
  font-family: var(--ff-title);
  font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900;
  color: #fff; margin: 0 0 0.3rem; line-height: 1.15;
}

.modal-professor { font-size: 0.95rem; font-weight: 500; color: var(--c-gold); margin: 0 0 1.5rem; }

.modal-divider { height: 1px; background: var(--c-border); margin: 1rem 0; }

.modal-details {
  display: grid; gap: 0.9rem; margin: 0;
}
.modal-details dt {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--c-muted); font-weight: 600; margin-bottom: 0.2rem;
}
.modal-details dd { margin: 0; font-size: 0.92rem; color: var(--c-text); font-weight: 400; }

.modal-edition-tag {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: var(--c-dim);
  margin-top: auto; padding-top: 0.5rem;
}

/* ════════════════════════════════════════
   TRANSIÇÕES VUE
════════════════════════════════════════ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(.4,0,.2,1); }
.slide-up-enter-from  { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to    { opacity: 0; transform: translateY(-10px); }

.modal-enter-active, .modal-leave-active { transition: all 0.35s cubic-bezier(.4,0,.2,1); }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
.modal-enter-from .modal-panel, .modal-leave-to .modal-panel { transform: scale(0.94) translateY(20px); }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.35s cubic-bezier(.4,0,.2,1); }

.grid-item-enter-active { transition: all 0.4s cubic-bezier(.4,0,.2,1); }
.grid-item-leave-active { transition: all 0.25s ease; }
.grid-item-enter-from   { opacity: 0; transform: scale(0.95) translateY(10px); }
.grid-item-leave-to     { opacity: 0; transform: scale(0.95); }
.grid-item-move         { transition: transform 0.4s cubic-bezier(.4,0,.2,1); }

/* ════════════════════════════════════════
   RESPONSIVO
════════════════════════════════════════ */
@media (max-width: 720px) {
  .modal-panel { flex-direction: column; max-height: 95vh; }
  .modal-img-col { width: 100%; height: 220px; }
  .modal-img-glow { background: linear-gradient(to top, var(--c-surface) 0%, transparent 60%); }
  .edition-tabs { flex-wrap: wrap; border-radius: var(--radius); }
  .edition-tab { padding: 0.5rem 1rem; }
  .controls-row2 { flex-direction: column; align-items: stretch; }
  .view-toggle { margin-left: 0; width: fit-content; }
}
</style>