<template>
  <section id="sp-section" @keydown.esc="closeModal">

    <!-- ── Hero ──────────────────────────────────────── -->
    <div class="sp-hero">
      <div class="sp-hero__orb sp-hero__orb--1" aria-hidden="true"></div>
      <div class="sp-hero__orb sp-hero__orb--2" aria-hidden="true"></div>
      <div class="sp-hero__inner">
        <div class="sp-hero__text">
          <span class="sp-kicker">SALIP · Semana de Arte e Literatura</span>
          <h1 class="sp-hero__title">
            Palestrantes,<br />
            <em class="sp-hero__title-em">Artistas &amp;</em>
            oficineiros<br />
          </h1>
          <p class="sp-hero__desc">Todas as edições · todos os participantes</p>
        </div>

        <!-- Stats no hero -->
        <div class="sp-stats">
          <div class="sp-stat" v-for="stat in computedStats" :key="stat.label">
            <strong class="sp-stat__num">{{ stat.value }}</strong>
            <span class="sp-stat__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Body ──────────────────────────────────────── -->
    <div class="sp-body">

      <!-- Tabs de Edição -->
      <div class="edition-tabs" role="tablist" aria-label="Selecionar edição">
        <button
          v-for="ed in editions"
          :key="ed.year"
          role="tab"
          :aria-selected="selectedEdition === ed.year"
          class="edition-tab"
          :class="{ 'is-active': selectedEdition === ed.year }"
          @click="selectEdition(ed.year)"
        >
          <span class="edition-tab__year">{{ ed.year }}</span>
          <span class="edition-tab__label">{{ ed.label }}</span>
          <span class="edition-tab__count">{{ ed.data.length }}</span>
        </button>
      </div>

      <!-- Linha de controles -->
      <div class="controls-row">

        <!-- Busca -->
        <div class="sp-search">
          <svg class="sp-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            class="sp-search__input"
            type="search"
            placeholder="Buscar nome, evento ou local…"
            aria-label="Buscar participante"
          />
          <button v-if="searchQuery" class="sp-search__clear" @click="searchQuery = ''" aria-label="Limpar">✕</button>
        </div>

        <!-- Chips de tipo -->
        <div class="filter-chips" role="group" aria-label="Filtrar por tipo">
          <button
            v-for="type in typeFilters"
            :key="type.value"
            class="chip"
            :class="{ 'is-active': selectedType === type.value }"
            @click="selectedType = type.value"
          >
            <span class="chip__dot" :style="{ background: type.color }"></span>
            {{ type.label }}
            <span class="chip__count">{{ type.count }}</span>
          </button>
        </div>

        <!-- Toggle de vista -->
        <div class="view-toggle" role="group" aria-label="Modo de visualização">
          <button
            class="view-btn"
            :class="{ 'is-active': viewMode === 'carousel' }"
            @click="viewMode = 'carousel'"
            aria-label="Carrossel"
            title="Carrossel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="7" height="14" rx="1"/>
              <rect x="10.5" y="5" width="3" height="14" rx="1" opacity=".45"/>
              <rect x="15" y="5" width="7" height="14" rx="1" opacity=".25"/>
            </svg>
          </button>
          <button
            class="view-btn"
            :class="{ 'is-active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            aria-label="Grade"
            title="Grade"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="8" height="8" rx="1"/>
              <rect x="13" y="3" width="8" height="8" rx="1"/>
              <rect x="3" y="13" width="8" height="8" rx="1"/>
              <rect x="13" y="13" width="8" height="8" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de stats -->
      <div class="stats-bar">
        <span class="stats-bar__item">
          <strong>{{ filteredItems.length }}</strong>
          {{ filteredItems.length === 1 ? 'participante' : 'participantes' }}
        </span>
        <span class="stats-bar__sep">·</span>
        <span class="stats-bar__item">edição <strong>{{ selectedEdition }}</strong></span>
        <template v-if="searchQuery">
          <span class="stats-bar__sep">·</span>
          <span class="stats-bar__query">Resultado para "{{ searchQuery }}"</span>
        </template>
      </div>

      <!-- Estado vazio -->
      <Transition name="fade">
        <div v-if="filteredItems.length === 0" class="sp-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>Nenhum resultado encontrado.</p>
          <button @click="clearFilters">Limpar filtros</button>
        </div>
      </Transition>

      <!-- ── Modo Carrossel ─────────────────────────── -->
      <Transition name="slide-up">
        <div v-if="viewMode === 'carousel' && filteredItems.length > 0" class="carousel-wrap">
          <swiper
            :modules="modules"
            :loop="filteredItems.length > 3"
            :navigation="true"
            :pagination="{ clickable: true, dynamicBullets: true }"
            :autoplay="{ delay: 4500, disableOnInteraction: true, pauseOnMouseEnter: true }"
            :breakpoints="swiperBreakpoints"
            class="sp-swiper"
          >
            <swiper-slide v-for="(item, i) in filteredItems" :key="`c-${item.titulo}-${i}`">
              <article
                class="sp-card"
                @click="openModal(item)"
                tabindex="0"
                @keydown.enter="openModal(item)"
                role="button"
                :aria-label="`Ver detalhes de ${item.titulo}`"
              >
                <div class="sp-card__img-wrap">
                  <img
                    class="sp-card__img"
                    :src="item.url"
                    :alt="`Foto de ${item.titulo}`"
                    loading="lazy"
                  />
                  <div class="sp-card__img-overlay" aria-hidden="true"></div>
                  <span class="sp-card__badge" :style="{ '--badge-bg': badgeColor(item.descricao) }">
                    {{ item.descricao }}
                  </span>
                </div>

                <div class="sp-card__body">
                  <h2 class="sp-card__title">{{ item.titulo }}</h2>
                  <p class="sp-card__sub">{{ item.professor }}</p>
                  <ul class="sp-card__info" aria-label="Informações">
                    <li v-if="item.evento" class="sp-card__info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      <span>{{ item.evento }}</span>
                    </li>
                    <li v-if="item.data || item.hora" class="sp-card__info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <span>{{ item.data }}<strong v-if="item.hora"> · {{ item.hora }}</strong></span>
                    </li>
                    <li v-if="item.mediacao" class="sp-card__info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span>{{ item.mediacao }}</span>
                    </li>
                  </ul>
                </div>

                <div class="sp-card__footer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ item.local }}</span>
                </div>
              </article>
            </swiper-slide>
          </swiper>
        </div>
      </Transition>

      <!-- ── Modo Grade ─────────────────────────────── -->
      <Transition name="slide-up">
        <div v-if="viewMode === 'grid' && filteredItems.length > 0" class="grid-wrap">
          <TransitionGroup name="grid-item" tag="div" class="sp-grid">
            <article
              v-for="(item, i) in filteredItems"
              :key="`g-${item.titulo}-${i}`"
              class="sp-card"
              @click="openModal(item)"
              tabindex="0"
              @keydown.enter="openModal(item)"
              role="button"
              :aria-label="`Ver detalhes de ${item.titulo}`"
              :style="{ '--delay': `${(i % 12) * 40}ms` }"
            >
              <div class="sp-card__img-wrap">
                <img
                  class="sp-card__img"
                  :src="item.url"
                  :alt="`Foto de ${item.titulo}`"
                  loading="lazy"
                />
                <div class="sp-card__img-overlay" aria-hidden="true"></div>
                <span class="sp-card__badge" :style="{ '--badge-bg': badgeColor(item.descricao) }">
                  {{ item.descricao }}
                </span>
              </div>

              <div class="sp-card__body">
                <h2 class="sp-card__title">{{ item.titulo }}</h2>
                <p class="sp-card__sub">{{ item.professor }}</p>
                <ul class="sp-card__info" aria-label="Informações">
                  <li v-if="item.data || item.hora" class="sp-card__info-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span>{{ item.data }}<strong v-if="item.hora"> · {{ item.hora }}</strong></span>
                  </li>
                </ul>
              </div>

              <div class="sp-card__footer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ item.local }}</span>
              </div>
            </article>
          </TransitionGroup>
        </div>
      </Transition>

    </div>

    <!-- ── Modal ──────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modalItem"
          class="sp-modal-backdrop"
          @click.self="closeModal"
          role="dialog"
          aria-modal="true"
          :aria-label="modalItem?.titulo"
        >
          <div class="sp-modal">
            <button class="sp-modal__close" @click="closeModal" aria-label="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>



            <!-- Conteúdo -->
            <div class="sp-modal__content">
              <span
                class="sp-modal__badge"
                :style="{ '--badge-bg': badgeColor(modalItem.descricao) }"
              >{{ modalItem.descricao }}</span>

              <h2 class="sp-modal__title">{{ modalItem.titulo }}</h2>
              <p class="sp-modal__professor">{{ modalItem.professor }}</p>

              <div class="sp-modal__divider"></div>

              <dl class="sp-modal__details">
                <template v-if="modalItem.evento">
                  <dt>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    Evento
                  </dt>
                  <dd>{{ modalItem.evento }}</dd>
                </template>
                <template v-if="modalItem.data">
                  <dt>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    Data
                  </dt>
                  <dd>{{ modalItem.data }}<span v-if="modalItem.hora"> · {{ modalItem.hora }}</span></dd>
                </template>
                <template v-if="modalItem.mediacao">
                  <dt>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Mediação
                  </dt>
                  <dd>{{ modalItem.mediacao }}</dd>
                </template>
                <template v-if="modalItem.local">
                  <dt>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Local
                  </dt>
                  <dd>{{ modalItem.local }}</dd>
                </template>
              </dl>

              <!-- Ação de fechar no rodapé -->
              <div class="sp-modal__actions">
                <button class="sp-modal__btn-close" @click="closeModal">Fechar</button>
              </div>
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

// ── Swiper ────────────────────────────────────────────────────
const modules = [Pagination, Autoplay, Navigation]

const swiperBreakpoints = {
  320:  { slidesPerView: 1,   spaceBetween: 16 },
  580:  { slidesPerView: 2,   spaceBetween: 20 },
  900:  { slidesPerView: 3,   spaceBetween: 24 },
  1200: { slidesPerView: 4,   spaceBetween: 28 },
}

// ── Estado ────────────────────────────────────────────────────
const selectedEdition = ref(2026)
const selectedType    = ref('todos')
const searchQuery     = ref('')
const viewMode        = ref('carousel')
const modalItem       = ref(null)

// ── Ações ─────────────────────────────────────────────────────
function selectEdition(year) {
  selectedEdition.value = year
  selectedType.value    = 'todos'
  searchQuery.value     = ''
}
function openModal(item)  { modalItem.value = item }
function closeModal()     { modalItem.value = null }
function clearFilters()   { selectedType.value = 'todos'; searchQuery.value = '' }

// Cores semânticas por tipo — alinhadas ao sistema SALIP2
function badgeColor(desc) {
  if (!desc) return '#0D1B5E'
  const d = desc.toLowerCase()
  if (d.includes('show'))     return '#7C3AED'
  if (d.includes('pública'))  return '#059669'
  if (d.includes('palestra')) return '#0D1B5E'
  return '#0D1B5E'
}

// ── Dados ─────────────────────────────────────────────────────
const data2025 = [
  { url: '/IMG/edicao3/cardPalestrante.png',   titulo: 'Cineas Santos (PI)',                    professor: 'Prof. Cineas Santos',                           evento: 'A lírica do poeta Manuel Bandeira',                   data: '24/05/2025', hora: '8h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante2.png',  titulo: 'Luiz Romero Lima (PI)',                 professor: 'Prof. Luiz Romero Lima',                        evento: 'O cânone literário o sublime piauiense',              data: '23/05/2025', hora: '14h30', descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante3.png',  titulo: 'José de Nicola (SP)',                   professor: 'Prof. José de Nicola',                          evento: 'A lírica do poeta Manuel Bandeira',                   data: '24/05/2025', hora: '8h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante4.png',  titulo: 'Fabrício Carpinejar (RS)',              professor: 'Fabrício Carpinejar',                           evento: 'Palestra de abertura',                                data: '22/05/2025', hora: '19h',   descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'Centro de Eventos Dep. Ciro Nogueira' },
  { url: '/IMG/edicao3/cardPalestrante5.png',  titulo: 'Ernâni Getirana de Lima',               professor: 'Prof. Ernâni Getirana de Lima',                 evento: 'A literatura de Pedro II: da pré-história aos dias', data: '23/05/2025', hora: '16h30', descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/CardPalestrante6.png',  titulo: 'Gonzaga Lu e Trio Asa Branca',          professor: 'Gonzaga Lu e Trio Asa Branca',                  evento: 'Show de encerramento',                                data: '24/05/2025', hora: '21h',   descricao: 'Show público',      mediacao: 'Cantor: Gonzaga Lu',             local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/edicao3/CardPalestrante7.png',  titulo: 'Grupo Harém de Teatro (PI)',            professor: 'Texto: Samuel Beckett / Drama: Arimatan Martins', evento: 'Teatro',                                           data: '23/05/2025', hora: '19h',   descricao: 'Show público',      mediacao: 'Mediação: Helany Max',           local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/edicao3/CardPalestrante8.png',  titulo: 'Grupo Urutau',                          professor: 'Sítio do Pica-Pau Amarelo',                     evento: 'Teatro infantil',                                     data: '23/05/2025', hora: '10h',   descricao: 'Show público',      mediacao: 'Grupo: Urutau',                  local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/edicao3/cardPalestrante9.png',  titulo: 'Histórias / Teatro de Bonecos',         professor: 'Chagas Vale',                                   evento: 'Teatro de bonecos',                                   data: '23/05/2025', hora: '9h',    descricao: 'Show público',      mediacao: 'Mediação: Ravena Ribeiro',       local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/edicao3/cardPalestrante10.png', titulo: 'Histórias / Teatro de Bonecos',         professor: 'Talitha do Monte',                              evento: 'Teatro de bonecos',                                   data: '23/05/2025', hora: '9h',    descricao: 'Show público',      mediacao: 'Mediação: Ravena Ribeiro',       local: 'Praça Domingos Mourão Filho' },
  { url: '/IMG/edicao3/cardPalestrante11.png', titulo: 'A voz de Esperança Garcia',             professor: 'Bernardo Aurélio (PI)',                         evento: 'Teatro',                                              data: '23/05/2025', hora: '8h30',  descricao: 'Show público',      mediacao: 'Mediação: Waleria Rubens',       local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante12.png', titulo: 'A voz de Esperança Garcia',             professor: 'João P. Luiz (PI)',                             evento: 'Teatro',                                              data: '23/05/2025', hora: '8h30',  descricao: 'Show público',      mediacao: 'Mediação: Waleria Rubens',       local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante13.png', titulo: 'Grupo Cocares (PI)',                    professor: 'Vários Artistas',                               evento: 'Teatro',                                              data: '23/05/2025', hora: '8h30',  descricao: 'Show público',      mediacao: 'Mediação: Germano Bonfim',       local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/CardPslestrante14.png', titulo: 'Poesia, Música e Sala de Aula',         professor: 'Adriano Lobão Aragão (PI)',                     evento: 'Apresentação',                                        data: '24/05/2025', hora: '14h30', descricao: 'Show público',      mediacao: 'Mediação: Helany Max',           local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante17.png', titulo: 'Piauienses Escritoras',                 professor: 'Jasmine Malta (PI)',                            evento: 'Gênese histórica',                                    data: '24/05/2025', hora: '10h30', descricao: 'Show público',      mediacao: 'Mediação: Kássio Gomes',         local: 'Auditório Padre Norberto' },
  { url: '/IMG/edicao3/cardPalestrante15.png', titulo: 'Roda de Conversa: Mulher na Literatura', professor: 'Marina Campelo (PI)',                          evento: 'Roda de conversa',                                    data: '24/05/2025', hora: '16h30', descricao: 'Show público',      mediacao: 'Mediação: Ernâni Getirana',      local: 'Auditório Padre Norberto' },
]
// ── Dados ─────────────────────────────────────────────────────
const data2026 = [
  { url: '/IMG/edicao4/cardPalestrante.svg',   titulo: 'Algemira Mendes (PI)',                    professor: 'Professora Dra. Algemira Mendes(PI)',               evento: 'Mesa: Tempo e memória na literatura de Sérgia Alves',                   data: '09/05/2026', hora: '8h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante2.svg',   titulo: 'Francisco José (PE)',                    professor: 'Jornalista, escritor e ex-repórter da TV Globo',               evento: 'o desafio das grandes reportagens',                   data: '07/05/2026', hora: '19h',  descricao: 'Palestra pública',  mediacao: '',               local: 'Espaço de Eventos Dep. Ciro Nogueira' },
  { url: '/IMG/edicao4/cardPalestrante3.svg',   titulo: 'Ernâni Getirana (PI)',                    professor: 'Prof. Ernâni Getirana de Lima',               evento: 'Bate-papo e lançamentos de livros',                   data: '08/05/2026', hora: '14:30h',  descricao: 'Palestra pública',  mediacao: '',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante4.svg',   titulo: 'Fonseca Neto (PI)',                    professor: 'Prof. Fonseca Neto (PI)',               evento: 'Palestra: Pedro II, 200 anos: um homem, uma cidade',                   data: '08/05/2026', hora: '10:30h',  descricao: 'Palestra pública',  mediacao: 'Mediação: Wilson Brandão (PI)',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante5.svg',   titulo: 'Hamilton Werneck (RJ)',                    professor: 'Prof. Hamilton Werneck (RJ)',               evento: 'Palestra: Quando o professor acredita, a educação acontece',                   data: '08/05/2026', hora: '19h',  descricao: 'Palestra pública',  mediacao: 'Mediação: Wilson Brandão (PI)',               local: 'Praça Domingos Mourão' },
  { url: '/IMG/edicao4/cardPalestrante6.svg',   titulo: 'Jasmine Malta (PI)',                    professor: 'Prof. Jasmine Malta (PI)',               evento: 'Palestra: Casal de escritores: gênese de escrita literária de ficção investigativa',                   data: '09/05/2026', hora: '15h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: APLA',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante7.svg',   titulo: 'Lúcia Ana (PI)',                    professor: 'Assistente Social',               evento: 'Mesa: Mulheres que Escrevem: A Literatura de Marina Campelo, Lúcia Ana e Graça Targino',                   data: '08/05/2026', hora: '16h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: Helany Max (PI)',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante8.svg',   titulo: 'Marcelo Mesquita (SP/PI)',                    professor: 'Dr. Marcelo Mesquita (SP/PI)',               evento: 'Palestra: Educar com IA ou se educar para a IA? O futuro dos jovens nesta desafiante era.',                   data: '08/05/2026', hora: '15h',  descricao: 'Palestra pública',  mediacao: 'Mediação: Helany Max (PI) ',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante9.svg',   titulo: 'Márcio Lima (PI)',                    professor: 'Prof. Márcio Lima (PI)',               evento: 'Palestra: A crise invisível na educação',                   data: '09/05/2026', hora: '19h',  descricao: 'Palestra pública',  mediacao: 'Mediação: Kássio Gomes(PI)',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante10.svg',   titulo: 'Marina Campelo (PI)',                    professor: 'Poeta Marina Campelo (PI)',               evento: 'Mesa: Mulheres que Escrevem: A Literatura de Marina Campelo, Lúcia Ana e Graça Targino Marina Campelo ',                   data: '08/05/2026', hora: '16h30h',  descricao: 'Palestra pública',  mediacao: 'Mediação: Helany Max (PI)',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante11.svg',   titulo: 'Marleide Lins (PI)',                    professor: 'Escritora Marina Campelo (PI)',               evento: 'Mesa: Tempo e memória na literatura de Sérgia Alves',                   data: '09/05/2026', hora: '8h30h',  descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante12.svg',   titulo: 'Normandes Malta (PI)',                    professor: 'Prof. Normandes Malta (PI)',               evento: 'Casal de escritores: gênese de escrita literária de ficção investigativa',                   data: '09/05/2026', hora: '15h30',  descricao: 'Palestra pública',  mediacao: 'Helany Max',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante13.svg',   titulo: 'Rivanildo Feitosa (PI',                    professor: 'jornalista Rivanildo Feitosa (PI)',               evento: 'Bate-papo e exibição do filme: O Sacro e o Profano de Araújo e Verônica',                   data: '08/05/2026', hora: '9h',  descricao: 'Palestra pública',  mediacao: 'Wilson Brandão (PI)',               local: 'MGF Eventos' },
  { url: '/IMG/edicao4/cardPalestrante14.svg',   titulo: 'Sérgia Alves (PI)',                    professor: 'Professora Dra. Sérgia Alves (PI)',               evento: 'Mesa: Tempo e memória na literatura de Sérgia Alves',                   data: '09/05/2026', hora: '8h30',  descricao: 'Palestra pública',  mediacao: 'Mediação: SALIP2',               local: 'MGF Eventos' },
  { url: '/IMG/edicao3/CardPalestrante6.png',  titulo: 'Gonzaga Lu e Trio Asa Branca',          professor: 'Gonzaga Lu e Trio Asa Branca',                  evento: 'Show de encerramento',                                data: '24/05/2025', hora: '21h',   descricao: 'Show público',      mediacao: 'Cantor: Gonzaga Lu',             local: 'Praça Domingos Mourão Filho' },

]

// ── Edições ───────────────────────────────────────────────────
const editions = computed(() => [
  { year: 2025, label: '3ª Edição', data: data2025 },
  { year: 2026, label: '4ª Edição', data: data2026 },
  // Adicione mais edições conforme necessário:
  // { year: 2024, label: '2ª Edição', data: data2024 },
])

const currentData = computed(() =>
  editions.value.find(e => e.year === selectedEdition.value)?.data ?? []
)

// ── Filtros ───────────────────────────────────────────────────
const typeFilters = computed(() => {
  const d = currentData.value
  const count = (term) => d.filter(i => i.descricao?.toLowerCase().includes(term)).length
  return [
    { value: 'todos',    label: 'Todos',    color: '#64748b', count: d.length },
    { value: 'palestra', label: 'Palestra', color: '#0D1B5E', count: count('palestra') },
    { value: 'show',     label: 'Show',     color: '#7C3AED', count: count('show') },
  ]
})

const normalizar = t =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const filteredItems = computed(() => {
  let r = currentData.value
  if (selectedType.value !== 'todos') {
    r = r.filter(i => i.descricao?.toLowerCase().includes(selectedType.value))
  }
  const q = normalizar(searchQuery.value.trim())
  if (q) {
    r = r.filter(i =>
      normalizar(i.titulo      ?? '').includes(q) ||
      normalizar(i.professor   ?? '').includes(q) ||
      normalizar(i.evento      ?? '').includes(q) ||
      normalizar(i.local       ?? '').includes(q)
    )
  }
  return r
})

// ── Estatísticas ──────────────────────────────────────────────
const computedStats = computed(() => {
  const all    = editions.value.flatMap(e => e.data)
  const unique = new Set(all.map(i => i.professor)).size
  return [
    { value: all.length,                 label: 'participações'  },
    { value: unique,                     label: 'artistas únicos' },
    { value: editions.value.length,      label: 'edições'        },
    { value: filteredItems.value.length, label: 'exibindo'       },
  ]
})

// ── Watchers ──────────────────────────────────────────────────
watch(selectedEdition, () => { modalItem.value = null })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@400;500;600;700;800&display=swap');

/* ══════════════════════════════════════
   RESET
══════════════════════════════════════ */
* { box-sizing: border-box; }

/* ══════════════════════════════════════
   TOKENS
══════════════════════════════════════ */
#sp-section {
  --navy:       #0D1B5E;
  --navy-mid:   #1A2D80;
  --navy-deep:  #0A2450;
  --teal:       #00C2A8;
  --teal-dark:  #009E8A;
  --teal-lt:    #6EFAE8;
  --teal-muted: #007a6d;
  --bg-page:    #F5F6FC;
  --slate:      #94a3b8;
  --muted-text: #4a5585;
  --card-border: rgba(13,27,94,0.08);
  --card-border-hover: rgba(0,194,168,0.35);
  --radius-card: 16px;
  --radius-pill: 999px;
  --trans: 0.22s ease;

  font-family: 'Outfit', sans-serif;
  color: var(--navy);
  background: var(--bg-page);
  width: 100%;
}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
.sp-hero {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, var(--navy-deep) 100%);
  padding: 4.5rem 1.5rem 3.5rem;
  position: relative;
  overflow: hidden;
}

.sp-hero__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.sp-hero__orb--1 {
  width: 480px; height: 480px;
  top: -180px; right: -80px;
  background: radial-gradient(circle, rgba(0,194,168,.16) 0%, transparent 70%);
}
.sp-hero__orb--2 {
  width: 360px; height: 360px;
  bottom: -120px; left: -60px;
  background: radial-gradient(circle, rgba(0,194,168,.08) 0%, transparent 70%);
}

.sp-hero__inner {
  width: min(1080px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.sp-kicker {
  display: inline-block;
  background: rgba(0,194,168,.15);
  border: 1px solid rgba(0,194,168,.35);
  color: var(--teal-lt);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  padding: 0.3rem 0.9rem;
  border-radius: var(--radius-pill);
  margin-bottom: 0.9rem;
}

.sp-hero__title {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5.5vw, 4rem);
  font-weight: 900;
  line-height: 1;
  color: #fff;
  letter-spacing: -0.02em;
}
.sp-hero__title-em {
  color: var(--teal);
  font-style: italic;
  display: block;
}
.sp-hero__desc {
  margin: 1rem 0 0;
  color: rgba(255,255,255,.5);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
}

/* Stats no hero */
.sp-stats {
  display: flex;
  gap: 1px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}
.sp-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 1.1rem 1.4rem;
  background: rgba(255,255,255,.02);
  transition: background var(--trans);
}
.sp-stat:hover { background: rgba(0,194,168,.08); }
.sp-stat__num {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--teal);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.sp-stat__label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,.4);
}

/* ══════════════════════════════════════
   BODY
══════════════════════════════════════ */
.sp-body {
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 2rem 1.5rem 4.5rem;
}

/* ── Edition Tabs ── */
.edition-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}
.edition-tabs::-webkit-scrollbar { display: none; }

.edition-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.4rem;
  border-radius: 12px;
  border: 1.5px solid var(--card-border);
  background: #fff;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  color: var(--muted-text);
  transition: all var(--trans);
  white-space: nowrap;
  flex-shrink: 0;
}
.edition-tab:hover { border-color: rgba(0,194,168,.5); color: var(--navy); }
.edition-tab.is-active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}

.edition-tab__year { font-weight: 800; font-size: 0.95rem; }
.edition-tab__label { font-size: 0.72rem; opacity: 0.7; }
.edition-tab__count {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-pill);
  background: rgba(0,194,168,.18);
  color: var(--teal-muted);
}
.edition-tab.is-active .edition-tab__count {
  background: rgba(255,255,255,.18);
  color: #fff;
}

/* ── Controls ── */
.controls-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

/* Search */
.sp-search {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}
.sp-search__icon {
  position: absolute;
  left: 1rem;
  width: 17px; height: 17px;
  color: var(--slate);
  pointer-events: none;
}
.sp-search__input {
  width: 100%;
  height: 48px;
  padding: 0 2.8rem;
  border-radius: 13px;
  border: 1.5px solid var(--card-border);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  color: var(--navy);
  outline: none;
  transition: border-color var(--trans), box-shadow var(--trans);
  appearance: none;
}
.sp-search__input::placeholder { color: var(--slate); }
.sp-search__input:focus {
  border-color: rgba(0,194,168,.5);
  box-shadow: 0 0 0 3px rgba(0,194,168,.12);
}
.sp-search__clear {
  position: absolute;
  right: 1rem;
  background: none; border: none;
  color: var(--slate); cursor: pointer; font-size: 0.82rem;
}

/* Filter chips */
.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--card-border);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted-text);
  cursor: pointer;
  transition: all var(--trans);
}
.chip:hover { border-color: rgba(13,27,94,.22); }
.chip.is-active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.chip__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.chip.is-active .chip__dot { background: var(--teal) !important; }
.chip__count {
  font-size: 0.68rem;
  color: var(--slate);
  background: rgba(13,27,94,.05);
  border-radius: 10px;
  padding: 0 0.35rem;
}
.chip.is-active .chip__count {
  background: rgba(255,255,255,.2);
  color: rgba(255,255,255,.85);
}

/* View toggle */
.view-toggle {
  display: flex;
  gap: 2px;
  background: #fff;
  border: 1.5px solid var(--card-border);
  border-radius: 11px;
  padding: 3px;
  margin-left: auto;
}
.view-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; border-radius: 8px;
  color: var(--slate); cursor: pointer;
  transition: all var(--trans);
}
.view-btn svg { width: 16px; height: 16px; }
.view-btn:hover { color: var(--navy); background: rgba(13,27,94,.05); }
.view-btn.is-active { background: var(--navy); color: #fff; }

/* Stats bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  color: var(--slate);
}
.stats-bar__item { color: var(--muted-text); }
.stats-bar__item strong { color: var(--navy); }
.stats-bar__sep { color: #cbd5e1; }
.stats-bar__query { color: var(--navy); font-weight: 600; }

/* ── Empty state ── */
.sp-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--slate);
}
.sp-empty svg {
  width: 40px; height: 40px;
  display: block; margin: 0 auto 1rem;
}
.sp-empty p { font-size: 0.95rem; margin: 0 0 1.1rem; }
.sp-empty button {
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid rgba(13,27,94,.15);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-weight: 700; font-size: 0.85rem;
  color: var(--navy); cursor: pointer;
  transition: all var(--trans);
}
.sp-empty button:hover { border-color: rgba(0,194,168,.5); }

/* ══════════════════════════════════════
   CARDS
══════════════════════════════════════ */
.sp-card {
  background: #fff;
  border: 1.5px solid var(--card-border);
  border-radius: var(--radius-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  transition: transform var(--trans), border-color var(--trans), box-shadow var(--trans);
  /* para o ::after funcionar */
}
.sp-card:hover {
  transform: translateY(-5px);
  border-color: var(--card-border-hover);
  box-shadow: 0 16px 40px rgba(13,27,94,.1), 0 0 0 1px rgba(0,194,168,.08) inset;
}
.sp-card:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}

/* Linha teal inferior ao hover */
.sp-card::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--teal), transparent);
  opacity: 0;
  transition: opacity var(--trans);
  pointer-events: none;
}
.sp-card:hover::after { opacity: 1; }

/* Imagem */
.sp-card__img-wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(13,27,94,.05);
}
.sp-card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.7s cubic-bezier(.4,0,.2,1), filter 0.4s ease;
  filter: brightness(.95) saturate(.9);
}
.sp-card:hover .sp-card__img {
  transform: scale(1.06);
  filter: brightness(1) saturate(1);
}

/* Gradiente suave no bottom da imagem */
.sp-card__img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(13,27,94,.45) 0%, transparent 55%);
  pointer-events: none;
}

.sp-card__badge {
  position: absolute;
  top: 0.75rem; left: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--badge-bg, var(--navy));
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}

/* Body do card */
.sp-card__body {
  padding: 1.1rem 1.1rem 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.sp-card__title {
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 0.25rem;
  line-height: 1.3;
}
.sp-card__sub {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--teal-muted);
  margin: 0 0 0.85rem;
}
.sp-card__info {
  list-style: none;
  padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.48rem;
}
.sp-card__info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.sp-card__info-item svg {
  width: 13px; height: 13px;
  flex-shrink: 0;
  color: var(--teal);
  margin-top: 2px;
}
.sp-card__info-item span {
  font-size: 0.76rem;
  color: var(--muted-text);
  line-height: 1.45;
}
.sp-card__info-item strong { color: var(--navy); font-weight: 700; }

/* Footer do card */
.sp-card__footer {
  padding: 0.75rem 1.1rem;
  border-top: 1px solid rgba(13,27,94,.06);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sp-card__footer svg {
  width: 12px; height: 12px;
  flex-shrink: 0;
  color: var(--teal);
}
.sp-card__footer span {
  font-size: 0.73rem;
  font-weight: 600;
  color: var(--teal-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ══════════════════════════════════════
   SWIPER
══════════════════════════════════════ */
.carousel-wrap { position: relative; }

.sp-swiper {
  padding: 0.5rem 0.25rem 3.2rem !important;
}

:deep(.swiper-slide) {
  height: auto !important;
  display: flex;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(13,27,94,.2);
  opacity: 1;
  transition: all 0.25s ease;
}
:deep(.swiper-pagination-bullet-active) {
  background: var(--teal) !important;
  transform: scale(1.4);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  background: #fff !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 50%;
  border: 1.5px solid rgba(13,27,94,.12) !important;
  color: var(--navy) !important;
  box-shadow: 0 4px 16px rgba(13,27,94,.12);
  transition: all 0.2s ease;
}
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--navy) !important;
  color: #fff !important;
  border-color: var(--navy) !important;
  transform: scale(1.06);
}
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 14px !important;
  font-weight: 800;
}

/* ══════════════════════════════════════
   GRID
══════════════════════════════════════ */
.grid-wrap { position: relative; }

.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

/* ══════════════════════════════════════
   MODAL
══════════════════════════════════════ */
.sp-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(13,27,94,.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.sp-modal {
  position: relative;
  display: flex;
  background: #fff;
  border: 1.5px solid rgba(13,27,94,.1);
  border-radius: 24px;
  overflow: hidden;
  max-width: 820px;
  width: 100%;
  max-height: 90vh;
  box-shadow: 0 40px 80px rgba(13,27,94,.22);
}

.sp-modal__close {
  position: absolute;
  top: 1rem; right: 1rem;
  z-index: 10;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(13,27,94,.05);
  border: 1.5px solid rgba(13,27,94,.1);
  color: var(--slate);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.sp-modal__close:hover {
  color: var(--navy);
  border-color: rgba(13,27,94,.25);
  background: rgba(13,27,94,.08);
}
.sp-modal__close svg { width: 16px; height: 16px; }

/* Coluna da imagem */
.sp-modal__img-col {
  position: relative;
  width: 300px;
  flex-shrink: 0;
  overflow: hidden;
}
.sp-modal__img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top;
}
.sp-modal__img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, transparent 50%, #fff 100%);
}
.sp-modal__img-footer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 1rem;
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,.8);
  background: linear-gradient(to top, rgba(13,27,94,.75) 0%, transparent 100%);
}
.sp-modal__img-footer svg { width: 13px; height: 13px; color: var(--teal); }

/* Conteúdo */
.sp-modal__content {
  flex: 1;
  padding: 2rem 2rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sp-modal__badge {
  display: inline-block;
  background: var(--badge-bg, var(--navy));
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0A2450;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}

.sp-modal__title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.3rem, 3vw, 1.85rem);
  font-weight: 900;
  color: var(--navy);
  margin: 0 0 0.3rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #0A2450;

}

.sp-modal__professor {
  font-size: 0.92rem;
  font-weight: 600;
  color: #0A2450;

  margin: 0 0 1.25rem;
}

.sp-modal__divider {
  height: 1px;
  background: rgba(13,27,94,.07);

  color: #0A2450;

  margin: 0.85rem 0;
}

.sp-modal__details {
  display: grid;
  gap: 0.85rem;
  color: #0A2450;


  margin: 0;
}
.sp-modal__details dt {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--slate);
  font-weight: 700;
  margin-bottom: 0.15rem;
  color: var(--teal-muted);

}
.sp-modal__details dt svg {
  width: 13px; height: 13px;
  color: var(--teal);
  flex-shrink: 0;
  color: var(--teal-muted);
  
}
.sp-modal__details dd {
  margin: 0;
  font-size: 0.9rem;
  color: #0A2450;

  line-height: 1.5;
}

.sp-modal__actions {
  margin-top: auto;
  padding-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  color: #0A2450;

}
.sp-modal__btn-close {
  padding: 0.55rem 1.4rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid rgba(13,27,94,.15);
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--navy);
  cursor: pointer;
  transition: all var(--trans);
}
.sp-modal__btn-close:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

/* ══════════════════════════════════════
   TRANSIÇÕES VUE
══════════════════════════════════════ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.38s cubic-bezier(.4,0,.2,1); }
.slide-up-enter-from  { opacity: 0; transform: translateY(18px); }
.slide-up-leave-to    { opacity: 0; transform: translateY(-8px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.32s cubic-bezier(.4,0,.2,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .sp-modal, .modal-leave-to .sp-modal { transform: scale(0.96) translateY(16px); }
.modal-enter-active .sp-modal, .modal-leave-active .sp-modal { transition: transform 0.32s cubic-bezier(.4,0,.2,1); }

.grid-item-enter-active {
  transition: all 0.38s cubic-bezier(.4,0,.2,1);
  transition-delay: var(--delay, 0ms);
}
.grid-item-leave-active { transition: all 0.22s ease; }
.grid-item-enter-from { opacity: 0; transform: scale(0.95) translateY(10px); }
.grid-item-leave-to   { opacity: 0; transform: scale(0.95); }
.grid-item-move       { transition: transform 0.38s cubic-bezier(.4,0,.2,1); }

/* ══════════════════════════════════════
   RESPONSIVO
══════════════════════════════════════ */
@media (max-width: 720px) {
  .sp-hero { padding: 3rem 1rem 2.5rem; }
  .sp-hero__inner { flex-direction: column; align-items: flex-start; }
  .sp-stats { flex-wrap: wrap; width: 100%; }
  .sp-stat { flex: 1; min-width: 90px; padding: 0.85rem 1rem; }

  .sp-body { padding: 1.5rem 1rem 3rem; }

  .controls-row { flex-direction: column; align-items: stretch; }
  .sp-search { min-width: unset; }
  .view-toggle { margin-left: 0; align-self: flex-start; }

  .sp-modal { flex-direction: column; max-height: 95vh; }
  .sp-modal__img-col { width: 100%; height: 220px; flex-shrink: 0; }
  .sp-modal__img-overlay {
    background: linear-gradient(to top, #fff 0%, transparent 55%);
  }
  .sp-modal__img-footer { display: none; }
  .sp-modal__content { padding: 1.5rem 1.25rem 1.25rem; }
}

@media (max-width: 480px) {
  .sp-hero__title { font-size: clamp(1.8rem, 8vw, 2.5rem); }
  .sp-stat__num { font-size: 1.3rem; }
}

@media (prefers-reduced-motion: reduce) {
  .sp-card,
  .edition-tab,
  .chip,
  .view-btn,
  .sp-modal__close,
  .sp-modal__btn-close { transition: none !important; }
  .sp-card__img { transition: none !important; }
}
</style>