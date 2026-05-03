<template>
  <div id="sp-section">

    <!-- ══ HERO ══ -->
    <header class="sp-hero">
      <div class="sp-hero__orb sp-hero__orb--1"></div>
      <div class="sp-hero__orb sp-hero__orb--2"></div>
      <div class="sp-hero__inner">
        <div>
          <span class="sp-kicker">Simpósio de Literatura do Piauí</span>
          <h1 class="sp-hero__title">
            Homenageados
            <em class="sp-hero__title-em">SALIP</em>
          </h1>
          <p class="sp-hero__desc">Personalidades que marcaram a cultura e a história do Piauí</p>
        </div>
        <div class="sp-stats">
          <div class="sp-stat">
            <span class="sp-stat__num">{{ totalHomenageados }}</span>
            <span class="sp-stat__label">Homenageados</span>
          </div>
          <div class="sp-stat">
            <span class="sp-stat__num">{{ edicoes.length }}</span>
            <span class="sp-stat__label">Edições</span>
          </div>
          <div class="sp-stat">
            <span class="sp-stat__num">{{ anoInicio }}</span>
            <span class="sp-stat__label">Desde</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ══ BODY ══ -->
    <!-- Tabs fora do sp-body para scroll horizontal sem corte -->
    <div class="edition-tabs-outer">
      <nav class="edition-tabs" role="tablist">
        <button
          class="edition-tab"
          :class="{ 'is-active': edicaoAtiva === null }"
          @click="edicaoAtiva = null"
          role="tab"
        >
          <span class="edition-tab__year">Todas</span>
          <span class="edition-tab__count">{{ totalHomenageados }}</span>
        </button>
        <button
          v-for="ed in edicoes"
          :key="ed.ano"
          class="edition-tab"
          :class="{ 'is-active': edicaoAtiva === ed.ano }"
          @click="edicaoAtiva = ed.ano"
          role="tab"
        >
          <div>
            <span class="edition-tab__year">{{ ed.ano }}</span>
            <span class="edition-tab__label"> · {{ ed.tema }}</span>
          </div>
          <span class="edition-tab__count">{{ ed.homenageados.length }}</span>
        </button>
      </nav>
    </div>

    <main class="sp-body">

      <!-- Controles -->
      <div class="controls-row">
        <div class="sp-search">
          <svg class="sp-search__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8.5" cy="8.5" r="5.5"/><path d="M15 15l3 3"/>
          </svg>
          <input
            class="sp-search__input"
            type="search"
            v-model="busca"
            placeholder="Buscar homenageado..."
            aria-label="Buscar homenageado"
          />
          <button v-if="busca" class="sp-search__clear" @click="busca = ''" aria-label="Limpar busca">✕</button>
        </div>

        <div class="filter-chips">
          <button
            v-for="area in areasDisponiveis"
            :key="area.label"
            class="chip"
            :class="{ 'is-active': areaAtiva === area.label }"
            @click="areaAtiva = areaAtiva === area.label ? null : area.label"
          >
            <span class="chip__dot" :style="{ background: area.cor }"></span>
            {{ area.label }}
            <span class="chip__count">{{ area.total }}</span>
          </button>
        </div>

        <div class="view-toggle">
          <button class="view-btn" :class="{ 'is-active': view === 'grid' }" @click="view = 'grid'" title="Grade">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
              <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
          </button>
          <button class="view-btn" :class="{ 'is-active': view === 'lista' }" @click="view = 'lista'" title="Lista">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="3" rx="1"/><rect x="1" y="7" width="14" height="3" rx="1"/>
              <rect x="1" y="12" width="14" height="3" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="stats-bar">
        <span class="stats-bar__item">
          <strong>{{ homenageadosFiltrados.length }}</strong> resultado{{ homenageadosFiltrados.length !== 1 ? 's' : '' }}
        </span>
        <template v-if="busca || areaAtiva || edicaoAtiva">
          <span class="stats-bar__sep">·</span>
          <span v-if="busca">buscando <strong class="stats-bar__query">"{{ busca }}"</strong></span>
          <span v-if="areaAtiva" class="stats-bar__item">área: <strong>{{ areaAtiva }}</strong></span>
          <span v-if="edicaoAtiva" class="stats-bar__item">edição <strong>{{ edicaoAtiva }}</strong></span>
          <span class="stats-bar__sep">·</span>
          <button style="background:none;border:none;cursor:pointer;color:#007a6d;font-size:0.82rem;font-weight:600;padding:0" @click="limparFiltros">Limpar filtros</button>
        </template>
      </div>

      <!-- Empty state -->
      <div v-if="homenageadosFiltrados.length === 0" class="sp-empty">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="18" cy="18" r="13"/><path d="M28 28l8 8"/>
        </svg>
        <p>Nenhum homenageado encontrado para os filtros selecionados.</p>
        <button @click="limparFiltros">Limpar filtros</button>
      </div>

      <!-- GRID -->
      <div v-else-if="view === 'grid'" class="grid-wrap">
        <div class="sp-grid">
          <article
            v-for="(pessoa, idx) in homenageadosFiltrados"
            :key="pessoa.nome + pessoa.edicao"
            class="sp-card"
            tabindex="0"
            @click="abrirModal(pessoa)"
            @keydown.enter="abrirModal(pessoa)"
            :style="{ '--delay': idx * 40 + 'ms' }"
          >
            <div class="sp-card__img-wrap">
              <img
                :src="pessoa.foto"
                :alt="pessoa.nome"
                class="sp-card__img"
                loading="lazy"
              />
              <div class="sp-card__img-overlay"></div>
              <span
                class="sp-card__badge"
                :style="{ '--badge-bg': corBadge(pessoa.area) }"
              >{{ pessoa.area }}</span>
            </div>
            <div class="sp-card__body">
              <h2 class="sp-card__title">{{ pessoa.nome }}</h2>
              <p class="sp-card__sub">{{ pessoa.nascimento }} {{ pessoa.falecimento ? '— ' + pessoa.falecimento : '' }}</p>
              <ul class="sp-card__info">
                <li class="sp-card__info-item" v-if="pessoa.naturalidade">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z"/>
                    <circle cx="8" cy="6" r="1.5"/>
                  </svg>
                  <span>{{ pessoa.naturalidade }}</span>
                </li>
                <li class="sp-card__info-item" v-if="pessoa.formacao">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 6l6-4 6 4-6 4-6-4z"/><path d="M14 6v5"/><path d="M5 8.5V12c1 1 5 1 6 0V8.5"/>
                  </svg>
                  <span>{{ pessoa.formacao }}</span>
                </li>
                <li class="sp-card__info-item" v-if="pessoa.destaque">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="8,2 10,6 14,6.5 11,9.5 11.8,14 8,12 4.2,14 5,9.5 2,6.5 6,6"/>
                  </svg>
                  <span><strong>{{ pessoa.destaque }}</strong></span>
                </li>
              </ul>
            </div>
            <div class="sp-card__footer">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="12" height="10" rx="1"/>
                <path d="M5 7h6M5 10h4"/>
              </svg>
              <span>SALIP {{ pessoa.edicao }}</span>
            </div>
          </article>
        </div>
      </div>

      <!-- LISTA -->
      <div v-else class="lista-wrap">
        <div
          v-for="pessoa in homenageadosFiltrados"
          :key="pessoa.nome + pessoa.edicao"
          class="lista-item"
          tabindex="0"
          @click="abrirModal(pessoa)"
          @keydown.enter="abrirModal(pessoa)"
        >
          <div class="lista-item__img-wrap">
            <img :src="pessoa.foto" :alt="pessoa.nome" class="lista-item__img" loading="lazy"/>
          </div>
          <div class="lista-item__body">
            <div class="lista-item__top">
              <h2 class="lista-item__nome">{{ pessoa.nome }}</h2>
              <span class="lista-item__badge" :style="{ '--badge-bg': corBadge(pessoa.area) }">{{ pessoa.area }}</span>
            </div>
            <p class="lista-item__bio">{{ pessoa.descricao }}</p>
          </div>
          <div class="lista-item__edicao">SALIP {{ pessoa.edicao }}</div>
          <svg class="lista-item__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 3l5 5-5 5"/>
          </svg>
        </div>
      </div>

    </main>

    <!-- ══ MODAL ══ -->
    <Transition name="modal">
      <div v-if="modalPessoa" class="sp-modal-backdrop" @click.self="fecharModal" role="dialog" aria-modal="true">
        <div class="sp-modal">
          <button class="sp-modal__close" @click="fecharModal" aria-label="Fechar">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>


          <div class="sp-modal__content">
            <span class="sp-modal__badge" :style="{ '--badge-bg': corBadge(modalPessoa.area) }">{{ modalPessoa.area }}</span>
            <h2 class="sp-modal__title">{{ modalPessoa.nome }}</h2>
            <p class="sp-modal__professor">{{ modalPessoa.nascimento }}{{ modalPessoa.falecimento ? ' — ' + modalPessoa.falecimento : '' }}</p>

            <div class="sp-modal__divider"></div>

            <dl class="sp-modal__details">
              <template v-if="modalPessoa.naturalidade">
                <dt>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z"/>
                    <circle cx="8" cy="6" r="1.5"/>
                  </svg>
                  Naturalidade
                </dt>
                <dd>{{ modalPessoa.naturalidade }}</dd>
              </template>

              <template v-if="modalPessoa.formacao">
                <dt>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 6l6-4 6 4-6 4-6-4z"/><path d="M14 6v5"/><path d="M5 8.5V12c1 1 5 1 6 0V8.5"/>
                  </svg>
                  Formação
                </dt>
                <dd>{{ modalPessoa.formacao }}</dd>
              </template>

              <template v-if="modalPessoa.atuacao">
                <dt>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8h6M8 5v6"/>
                  </svg>
                  Atuação
                </dt>
                <dd>{{ modalPessoa.atuacao }}</dd>
              </template>
            </dl>

            <div class="sp-modal__divider"></div>

            <!-- Seções da biografia -->
            <div class="sp-modal__bio">
              <template v-for="(secao, i) in modalPessoa.secoes" :key="i">
                <h3 v-if="secao.titulo" class="sp-modal__secao-titulo">{{ secao.titulo }}</h3>
                <p class="sp-modal__secao-texto">{{ secao.texto }}</p>
              </template>
            </div>

            <div class="sp-modal__actions">
              <button class="sp-modal__btn-close" @click="fecharModal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ══════════════════════════════════════
   DADOS — Estrutura escalável por edição
   Adicione novas edições ao array `edicoes`
══════════════════════════════════════ */
const edicoes = ref([
  {
    ano: 2026,
    tema: 'Memória e Identidade',
    homenageados: [
      {
        nome: 'José Lourenço de Araújo Mourão',
        foto: '/IMG/pessoa1.jpg',
        area: 'Direito',
        nascimento: '19 out. 1925',
        falecimento: '25 out. 1997',
        naturalidade: 'Pedro II, Piauí',
        formacao: 'Direito — Faculdade de Direito do Ceará (1950)',
        atuacao: 'Promotor de Justiça, Subprocurador-Geral e Presidente do MPDFT',
        destaque: 'Membro pioneiro do MPDFT',
        descricao: 'Nasceu em Pedro II (PI), formou-se em Direito no Ceará e foi um dos seis membros pioneiros do Ministério Público do DF e Territórios.',
        secoes: [
          { titulo: null, texto: 'Nasceu em 19 de outubro de 1925, na cidade de Pedro II, no estado do Piauí.' },
          { titulo: null, texto: 'Formou-se em Direito pela Faculdade de Direito do Ceará, em 8 de dezembro de 1950. Casou-se em Fortaleza, no dia 1º de setembro de 1951, com Nonata Perez Nobre Mourão.' },
          { titulo: 'Família', texto: 'Tiveram cinco filhos: Fernanda Maria, Paulo Fernando e Domingos Mourão Neto (gêmeos), Cláudia Perez Mourão e José Lourenço Mourão Júnior.' },
          { titulo: 'Carreira política', texto: 'Exerceu o cargo de deputado estadual pelo estado do Piauí no período de 1954 a 1958.' },
          { titulo: 'Ministério Público', texto: 'Transferido do território federal do Acre para o MPDFT, sendo um dos seis membros pioneiros do órgão. Atuou em diversas Varas do TJDF entre 1960 e 1994.' },
          { titulo: 'Cargos de destaque', texto: 'Subprocurador-Geral de Justiça do MPDFT (1974, 1979–1980), Presidente do MPDFT (1975–1977), Corregedor-Geral do MPDFT (1991–1992).' },
          { titulo: 'Aposentadoria', texto: 'Aposentou-se em 10 de março de 1995. Faleceu em Pedro II (PI), no dia 25 de outubro de 1997.' },
          { titulo: 'Homenagem', texto: 'Dr. José Lourenço Mourão, se Deus não o tivesse levado tão subitamente do nosso convívio, estaria completando um século de vida e nos dando o privilégio do seu extremado afeto e da sua imensurável bondade espiritual.' },
        ]
      },
      {
        nome: 'William Palha Dias',
        foto: '/IMG/pessoa2.jpg',
        area: 'Literatura',
        nascimento: '17 set. 1918',
        falecimento: '14 fev. 2012',
        naturalidade: 'Caracol, Piauí',
        formacao: 'Direito (formou-se aos 41 anos)',
        atuacao: 'Juiz, escritor, jornalista e membro da Academia Piauiense de Letras',
        destaque: '19 obras publicadas',
        descricao: 'Escritor piauiense com 19 obras publicadas, juiz aposentado e membro da Academia Piauiense de Letras. Sua obra "Os Irmãos Quixaba" foi adaptada para o cinema em 2004.',
        secoes: [
          { titulo: null, texto: 'William Palha Dias nasceu em Caracol, Piauí, em 17 de setembro de 1918. Morou em Caracol até os 20 anos, quando saiu para estudar em Teresina.' },
          { titulo: 'Formação e carreira jurídica', texto: 'Formou-se em Direito aos 41 anos e atuou como advogado militante antes de tornar-se juiz. Trabalhou em cidades do interior do Piauí: Regeneração, Oeiras, Castelo do Piauí, Pedro II e Picos, onde se aposentou.' },
          { titulo: 'Família', texto: 'Em 1951, casou-se com a professora Maria das Graças e Silva Palha Dias.' },
          { titulo: 'Cidadania honorária', texto: 'Recebeu o título de cidadão honorário das cidades de Cristino Castro, Pedro II, Regeneração e Teresina.' },
          { titulo: 'Obra literária', texto: 'Escreveu diversas obras de gêneros variados: romances de fundo histórico-sociológico, documentários, crônicas e memórias. Obras de destaque: "Caracol na história do Piauí" (1959), "Os Irmãos Quixaba" (1979) — adotado pelos vestibulares do Piauí e adaptado para o cinema em 2004 — e "Flagrantes do quotidiano" (1998). No total, publicou 19 obras.' },
          { titulo: 'Associações', texto: 'Membro da Academia Piauiense de Letras, do Instituto Histórico e Geográfico do Piauí, do Instituto Histórico de Oeiras e da União Brasileira de Escritores do Piauí. Ajudou a fundar a associação profissional de jornalistas do Piauí.' },
          { titulo: 'Falecimento', texto: 'O escritor faleceu em Teresina, no dia 14 de fevereiro de 2012, aos 93 anos.' },
        ]
      },
    ]
  },
  {
    ano: 2025,
    tema: 'Memória e Identidade',
    homenageados: [
      {
        nome: 'José Lourenço de Araújo Mourão',
        foto: '/IMG/pessoa1.jpg',
        area: 'Direito',
        nascimento: '19 out. 1925',
        falecimento: '25 out. 1997',
        naturalidade: 'Pedro II, Piauí',
        formacao: 'Direito — Faculdade de Direito do Ceará (1950)',
        atuacao: 'Promotor de Justiça, Subprocurador-Geral e Presidente do MPDFT',
        destaque: 'Membro pioneiro do MPDFT',
        descricao: 'Nasceu em Pedro II (PI), formou-se em Direito no Ceará e foi um dos seis membros pioneiros do Ministério Público do DF e Territórios.',
        secoes: [
          { titulo: null, texto: 'Nasceu em 19 de outubro de 1925, na cidade de Pedro II, no estado do Piauí.' },
          { titulo: null, texto: 'Formou-se em Direito pela Faculdade de Direito do Ceará, em 8 de dezembro de 1950. Casou-se em Fortaleza, no dia 1º de setembro de 1951, com Nonata Perez Nobre Mourão.' },
          { titulo: 'Família', texto: 'Tiveram cinco filhos: Fernanda Maria, Paulo Fernando e Domingos Mourão Neto (gêmeos), Cláudia Perez Mourão e José Lourenço Mourão Júnior.' },
          { titulo: 'Carreira política', texto: 'Exerceu o cargo de deputado estadual pelo estado do Piauí no período de 1954 a 1958.' },
          { titulo: 'Ministério Público', texto: 'Transferido do território federal do Acre para o MPDFT, sendo um dos seis membros pioneiros do órgão. Atuou em diversas Varas do TJDF entre 1960 e 1994.' },
          { titulo: 'Cargos de destaque', texto: 'Subprocurador-Geral de Justiça do MPDFT (1974, 1979–1980), Presidente do MPDFT (1975–1977), Corregedor-Geral do MPDFT (1991–1992).' },
          { titulo: 'Aposentadoria', texto: 'Aposentou-se em 10 de março de 1995. Faleceu em Pedro II (PI), no dia 25 de outubro de 1997.' },
          { titulo: 'Homenagem', texto: 'Dr. José Lourenço Mourão, se Deus não o tivesse levado tão subitamente do nosso convívio, estaria completando um século de vida e nos dando o privilégio do seu extremado afeto e da sua imensurável bondade espiritual.' },
        ]
      },
      {
        nome: 'William Palha Dias',
        foto: '/IMG/pessoa2.jpg',
        area: 'Literatura',
        nascimento: '17 set. 1918',
        falecimento: '14 fev. 2012',
        naturalidade: 'Caracol, Piauí',
        formacao: 'Direito (formou-se aos 41 anos)',
        atuacao: 'Juiz, escritor, jornalista e membro da Academia Piauiense de Letras',
        destaque: '19 obras publicadas',
        descricao: 'Escritor piauiense com 19 obras publicadas, juiz aposentado e membro da Academia Piauiense de Letras. Sua obra "Os Irmãos Quixaba" foi adaptada para o cinema em 2004.',
        secoes: [
          { titulo: null, texto: 'William Palha Dias nasceu em Caracol, Piauí, em 17 de setembro de 1918. Morou em Caracol até os 20 anos, quando saiu para estudar em Teresina.' },
          { titulo: 'Formação e carreira jurídica', texto: 'Formou-se em Direito aos 41 anos e atuou como advogado militante antes de tornar-se juiz. Trabalhou em cidades do interior do Piauí: Regeneração, Oeiras, Castelo do Piauí, Pedro II e Picos, onde se aposentou.' },
          { titulo: 'Família', texto: 'Em 1951, casou-se com a professora Maria das Graças e Silva Palha Dias.' },
          { titulo: 'Cidadania honorária', texto: 'Recebeu o título de cidadão honorário das cidades de Cristino Castro, Pedro II, Regeneração e Teresina.' },
          { titulo: 'Obra literária', texto: 'Escreveu diversas obras de gêneros variados: romances de fundo histórico-sociológico, documentários, crônicas e memórias. Obras de destaque: "Caracol na história do Piauí" (1959), "Os Irmãos Quixaba" (1979) — adotado pelos vestibulares do Piauí e adaptado para o cinema em 2004 — e "Flagrantes do quotidiano" (1998). No total, publicou 19 obras.' },
          { titulo: 'Associações', texto: 'Membro da Academia Piauiense de Letras, do Instituto Histórico e Geográfico do Piauí, do Instituto Histórico de Oeiras e da União Brasileira de Escritores do Piauí. Ajudou a fundar a associação profissional de jornalistas do Piauí.' },
          { titulo: 'Falecimento', texto: 'O escritor faleceu em Teresina, no dia 14 de fevereiro de 2012, aos 93 anos.' },
        ]
      },
    ]
  },
  /* ── Adicione novas edições abaixo ──
  {
    ano: 2026,
    tema: 'Tema da Edição',
    homenageados: [ { nome: '...', ... } ]
  },
  */
])

/* ══════════════════════════════════════
   ESTADO
══════════════════════════════════════ */
const busca        = ref('')
const areaAtiva    = ref(null)
const edicaoAtiva  = ref(null)
const view         = ref('grid')
const modalPessoa  = ref(null)

/* ══════════════════════════════════════
   COMPUTED
══════════════════════════════════════ */
const todosHomenageados = computed(() =>
  edicoes.value.flatMap(ed =>
    ed.homenageados.map(h => ({ ...h, edicao: ed.ano, temaEdicao: ed.tema }))
  )
)

const totalHomenageados = computed(() => todosHomenageados.value.length)
const anoInicio = computed(() => Math.min(...edicoes.value.map(e => e.ano)))

const areasDisponiveis = computed(() => {
  const mapa = {}
  todosHomenageados.value.forEach(h => {
    if (!mapa[h.area]) mapa[h.area] = { label: h.area, total: 0, cor: corBadge(h.area) }
    mapa[h.area].total++
  })
  return Object.values(mapa)
})

const homenageadosFiltrados = computed(() => {
  let lista = todosHomenageados.value
  if (edicaoAtiva.value) lista = lista.filter(h => h.edicao === edicaoAtiva.value)
  if (areaAtiva.value)   lista = lista.filter(h => h.area === areaAtiva.value)
  if (busca.value.trim()) {
    const q = busca.value.toLowerCase()
    lista = lista.filter(h =>
      h.nome.toLowerCase().includes(q) ||
      h.descricao?.toLowerCase().includes(q) ||
      h.naturalidade?.toLowerCase().includes(q) ||
      h.area?.toLowerCase().includes(q)
    )
  }
  return lista
})

/* ══════════════════════════════════════
   MÉTODOS
══════════════════════════════════════ */
function corBadge(area) {
  const cores = {
    'Direito':    '#1A2D80',
    'Literatura': '#007a6d',
    'Jornalismo': '#5b4a00',
    'Educação':   '#4a0a40',
    'Medicina':   '#8b1a1a',
    'Política':   '#003d1f',
  }
  return cores[area] || '#0D1B5E'
}

function abrirModal(pessoa) { modalPessoa.value = pessoa }
function fecharModal() { modalPessoa.value = null }

function limparFiltros() {
  busca.value = ''
  areaAtiva.value = null
  edicaoAtiva.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }

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

/* ── HERO ── */
.sp-hero {
  background: linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, var(--navy-deep) 100%);
  padding: 4.5rem 1.5rem 3.5rem;
  position: relative;
  overflow: hidden;
}
.sp-hero__orb { position: absolute; border-radius: 50%; pointer-events: none; }
.sp-hero__orb--1 { width: 480px; height: 480px; top: -180px; right: -80px; background: radial-gradient(circle, rgba(0,194,168,.16) 0%, transparent 70%); }
.sp-hero__orb--2 { width: 360px; height: 360px; bottom: -120px; left: -60px; background: radial-gradient(circle, rgba(0,194,168,.08) 0%, transparent 70%); }
.sp-hero__inner { width: min(1080px, 100%); margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; flex-wrap: wrap; position: relative; z-index: 1; }
.sp-kicker { display: inline-block; background: rgba(0,194,168,.15); border: 1px solid rgba(0,194,168,.35); color: var(--teal-lt); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; padding: 0.3rem 0.9rem; border-radius: var(--radius-pill); margin-bottom: 0.9rem; }
.sp-hero__title { margin: 0; font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5.5vw, 4rem); font-weight: 900; line-height: 1; color: #fff; letter-spacing: -0.02em; }
.sp-hero__title-em { color: var(--teal); font-style: italic; display: block; }
.sp-hero__desc { margin: 1rem 0 0; color: rgba(255,255,255,.5); font-size: 0.9rem; letter-spacing: 0.04em; }
.sp-stats { display: flex; gap: 1px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; overflow: hidden; flex-shrink: 0; }
.sp-stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; padding: 1.1rem 1.4rem; background: rgba(255,255,255,.02); transition: background var(--trans); }
.sp-stat:hover { background: rgba(0,194,168,.08); }
.sp-stat__num { font-size: 1.6rem; font-weight: 800; color: var(--teal); line-height: 1; }
.sp-stat__label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,.4); }

/* ── BODY ── */
.sp-body { width: min(1080px, 100%); margin: 0 auto; padding: 2rem 1.5rem 4.5rem; }

/* ── TABS ── */
.edition-tabs-outer { width: 100%; overflow: hidden; background: var(--bg-page); }
.edition-tabs { display: flex; gap: 0.5rem; width: min(1080px, 100%); margin: 0 auto; padding: 1.25rem 1.5rem; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.edition-tabs::-webkit-scrollbar { display: none; }
@media (max-width: 720px) {
  .edition-tabs { padding: 1rem; }
  .edition-tabs-outer { overflow-x: auto; }
  .edition-tabs { width: max-content; min-width: 100%; }
}
.edition-tab { display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1.4rem; border-radius: 12px; border: 1.5px solid var(--card-border); background: #fff; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: var(--muted-text); transition: all var(--trans); white-space: nowrap; flex-shrink: 0; }
.edition-tab:hover { border-color: rgba(0,194,168,.5); color: var(--navy); }
.edition-tab.is-active { background: var(--navy); border-color: var(--navy); color: #fff; }
.edition-tab__year { font-weight: 800; font-size: 0.95rem; }
.edition-tab__label { font-size: 0.72rem; opacity: 0.7; }
.edition-tab__count { font-size: 0.68rem; font-weight: 700; padding: 0.1rem 0.5rem; border-radius: var(--radius-pill); background: rgba(0,194,168,.18); color: var(--teal-muted); }
.edition-tab.is-active .edition-tab__count { background: rgba(255,255,255,.18); color: #fff; }

/* ── CONTROLS ── */
.controls-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
.sp-search { flex: 1; min-width: 200px; position: relative; display: flex; align-items: center; }
.sp-search__icon { position: absolute; left: 1rem; width: 17px; height: 17px; color: var(--slate); pointer-events: none; }
.sp-search__input { width: 100%; height: 48px; padding: 0 2.8rem; border-radius: 13px; border: 1.5px solid var(--card-border); background: #fff; font-family: 'Outfit', sans-serif; font-size: 0.9rem; color: var(--navy); outline: none; transition: border-color var(--trans), box-shadow var(--trans); appearance: none; }
.sp-search__input::placeholder { color: var(--slate); }
.sp-search__input:focus { border-color: rgba(0,194,168,.5); box-shadow: 0 0 0 3px rgba(0,194,168,.12); }
.sp-search__clear { position: absolute; right: 1rem; background: none; border: none; color: var(--slate); cursor: pointer; font-size: 0.82rem; }
.filter-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.9rem; border-radius: var(--radius-pill); border: 1.5px solid var(--card-border); background: #fff; font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--muted-text); cursor: pointer; transition: all var(--trans); }
.chip:hover { border-color: rgba(13,27,94,.22); }
.chip.is-active { background: var(--navy); border-color: var(--navy); color: #fff; }
.chip__dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.chip.is-active .chip__dot { background: var(--teal) !important; }
.chip__count { font-size: 0.68rem; color: var(--slate); background: rgba(13,27,94,.05); border-radius: 10px; padding: 0 0.35rem; }
.chip.is-active .chip__count { background: rgba(255,255,255,.2); color: rgba(255,255,255,.85); }
.view-toggle { display: flex; gap: 2px; background: #fff; border: 1.5px solid var(--card-border); border-radius: 11px; padding: 3px; margin-left: auto; }
.view-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; border-radius: 8px; color: var(--slate); cursor: pointer; transition: all var(--trans); }
.view-btn svg { width: 16px; height: 16px; }
.view-btn:hover { color: var(--navy); background: rgba(13,27,94,.05); }
.view-btn.is-active { background: var(--navy); color: #fff; }

/* ── STATS BAR ── */
.stats-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: var(--slate); flex-wrap: wrap; }
.stats-bar__item { color: var(--muted-text); }
.stats-bar__item strong { color: var(--navy); }
.stats-bar__sep { color: #cbd5e1; }
.stats-bar__query { color: var(--navy); font-weight: 600; }

/* ── EMPTY ── */
.sp-empty { text-align: center; padding: 4rem 1rem; color: var(--slate); }
.sp-empty svg { width: 40px; height: 40px; display: block; margin: 0 auto 1rem; }
.sp-empty p { font-size: 0.95rem; margin: 0 0 1.1rem; }
.sp-empty button { padding: 0.5rem 1.25rem; border-radius: var(--radius-pill); border: 1.5px solid rgba(13,27,94,.15); background: #fff; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--navy); cursor: pointer; transition: all var(--trans); }
.sp-empty button:hover { border-color: rgba(0,194,168,.5); }

/* ── GRID ── */
.sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }

/* ── CARD ── */
.sp-card { background: #fff; border: 1.5px solid var(--card-border); border-radius: var(--radius-card); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; position: relative; transition: transform var(--trans), border-color var(--trans), box-shadow var(--trans); }
.sp-card:hover { transform: translateY(-5px); border-color: var(--card-border-hover); box-shadow: 0 16px 40px rgba(13,27,94,.1); }
.sp-card:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.sp-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--teal), transparent); opacity: 0; transition: opacity var(--trans); pointer-events: none; }
.sp-card:hover::after { opacity: 1; }
.sp-card__img-wrap { position: relative; overflow: hidden; width: 100%; aspect-ratio: 1/1; background: rgba(13,27,94,.05); }
.sp-card__img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.7s cubic-bezier(.4,0,.2,1), filter 0.4s ease; filter: brightness(.95) saturate(.9); }
.sp-card:hover .sp-card__img { transform: scale(1.06); filter: brightness(1) saturate(1); }
.sp-card__img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,27,94,.45) 0%, transparent 55%); pointer-events: none; }
.sp-card__badge { position: absolute; top: 0.75rem; left: 0.75rem; padding: 0.25rem 0.75rem; border-radius: var(--radius-pill); background: var(--badge-bg, var(--navy)); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; }
.sp-card__body { padding: 1.1rem 1.1rem 0.75rem; flex: 1; display: flex; flex-direction: column; }
.sp-card__title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--navy); margin: 0 0 0.25rem; line-height: 1.3; }
.sp-card__sub { font-size: 0.78rem; font-weight: 600; color: var(--teal-muted); margin: 0 0 0.85rem; }
.sp-card__info { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.48rem; }
.sp-card__info-item { display: flex; align-items: flex-start; gap: 0.5rem; }
.sp-card__info-item svg { width: 13px; height: 13px; flex-shrink: 0; color: var(--teal); margin-top: 2px; }
.sp-card__info-item span { font-size: 0.76rem; color: var(--muted-text); line-height: 1.45; }
.sp-card__info-item strong { color: var(--navy); font-weight: 700; }
.sp-card__footer { padding: 0.75rem 1.1rem; border-top: 1px solid rgba(13,27,94,.06); display: flex; align-items: center; gap: 0.5rem; }
.sp-card__footer svg { width: 12px; height: 12px; flex-shrink: 0; color: var(--teal); }
.sp-card__footer span { font-size: 0.73rem; font-weight: 600; color: var(--teal-muted); }

/* ── LISTA ── */
.lista-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #fff; border: 1.5px solid var(--card-border); border-radius: var(--radius-card); cursor: pointer; transition: all var(--trans); margin-bottom: 0.75rem; }
.lista-item:hover { border-color: var(--card-border-hover); box-shadow: 0 8px 24px rgba(13,27,94,.07); transform: translateX(4px); }
.lista-item:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.lista-item__img-wrap { width: 64px; height: 64px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid rgba(0,194,168,.2); }
.lista-item__img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.lista-item__body { flex: 1; min-width: 0; }
.lista-item__top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem; flex-wrap: wrap; }
.lista-item__nome { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--navy); margin: 0; }
.lista-item__badge { padding: 0.15rem 0.65rem; border-radius: var(--radius-pill); background: var(--badge-bg, var(--navy)); font-size: 0.62rem; font-weight: 700; text-transform: uppercase; color: #fff; letter-spacing: 0.06em; }
.lista-item__bio { font-size: 0.82rem; color: var(--muted-text); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lista-item__edicao { font-size: 0.75rem; font-weight: 700; color: var(--teal-muted); white-space: nowrap; }
.lista-item__arrow { width: 16px; height: 16px; flex-shrink: 0; color: var(--slate); transition: transform var(--trans); }
.lista-item:hover .lista-item__arrow { transform: translateX(3px); color: var(--teal); }

/* ── MODAL ── */
.sp-modal-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(13,27,94,.72); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
.sp-modal { position: relative; display: flex; background: #fff; border: 1.5px solid rgba(13,27,94,.1); border-radius: 24px; overflow: hidden; max-width: 820px; width: 100%; max-height: 90vh; box-shadow: 0 40px 80px rgba(13,27,94,.22); }
.sp-modal__close { position: absolute; top: 1rem; right: 1rem; z-index: 10; width: 36px; height: 36px; border-radius: 50%; background: rgba(13,27,94,.05); border: 1.5px solid rgba(13,27,94,.1); color: var(--slate); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.sp-modal__close:hover { color: var(--navy); border-color: rgba(13,27,94,.25); background: rgba(13,27,94,.08); }
.sp-modal__close svg { width: 16px; height: 16px; }
.sp-modal__img-col { position: relative; width: 280px; flex-shrink: 0; overflow: hidden; }
.sp-modal__img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.sp-modal__img-overlay { position: absolute; inset: 0; background: linear-gradient(to right, transparent 50%, #fff 100%); }
.sp-modal__img-footer { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,.8); background: linear-gradient(to top, rgba(13,27,94,.75) 0%, transparent 100%); }
.sp-modal__img-footer svg { width: 13px; height: 13px; color: var(--teal); }
.sp-modal__content { flex: 1; padding: 2rem 2rem 1.5rem; overflow-y: auto; display: flex; flex-direction: column; }
.sp-modal__badge { display: inline-block; background: var(--badge-bg, var(--navy)); padding: 0.25rem 0.75rem; border-radius: var(--radius-pill); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; margin-bottom: 1rem; }
.sp-modal__title { font-family: 'Playfair Display', serif; font-size: clamp(1.3rem, 3vw, 1.85rem); font-weight: 900; color: var(--navy-deep); margin: 0 0 0.3rem; line-height: 1.15; letter-spacing: -0.02em; }
.sp-modal__professor { font-size: 0.92rem; font-weight: 600; color: var(--teal-muted); margin: 0 0 1.25rem; }
.sp-modal__divider { height: 1px; background: rgba(13,27,94,.07); margin: 0.85rem 0; }
.sp-modal__details { display: grid; gap: 0.85rem; margin: 0; }
.sp-modal__details dt { display: flex; align-items: center; gap: 0.45rem; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--teal-muted); font-weight: 700; margin-bottom: 0.15rem; }
.sp-modal__details dt svg { width: 13px; height: 13px; color: var(--teal); flex-shrink: 0; }
.sp-modal__details dd { margin: 0; font-size: 0.9rem; color: var(--navy-deep); line-height: 1.5; }
.sp-modal__bio { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem; }
.sp-modal__secao-titulo { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: var(--navy); margin: 0.75rem 0 0.2rem; }
.sp-modal__secao-texto { font-size: 0.88rem; color: var(--muted-text); line-height: 1.65; margin: 0; text-align: justify; }
.sp-modal__actions { margin-top: auto; padding-top: 1.5rem; display: flex; justify-content: flex-end; }
.sp-modal__btn-close { padding: 0.55rem 1.4rem; border-radius: var(--radius-pill); border: 1.5px solid rgba(13,27,94,.15); background: transparent; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 700; color: var(--navy); cursor: pointer; transition: all var(--trans); }
.sp-modal__btn-close:hover { background: var(--navy); color: #fff; border-color: var(--navy); }

/* ── TRANSITIONS ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.32s cubic-bezier(.4,0,.2,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .sp-modal, .modal-leave-to .sp-modal { transform: scale(0.96) translateY(16px); }
.modal-enter-active .sp-modal, .modal-leave-active .sp-modal { transition: transform 0.32s cubic-bezier(.4,0,.2,1); }

/* ── RESPONSIVO ── */
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
  .sp-modal__img-overlay { background: linear-gradient(to top, #fff 0%, transparent 55%); }
  .sp-modal__img-footer { display: none; }
  .sp-modal__content { padding: 1.5rem 1.25rem 1.25rem; }
  .lista-item__bio { display: none; }
}

@media (max-width: 480px) {
  .sp-hero__title { font-size: clamp(1.8rem, 8vw, 2.5rem); }
  .sp-stat__num { font-size: 1.3rem; }
}

@media (prefers-reduced-motion: reduce) {
  .sp-card, .edition-tab, .chip, .view-btn, .lista-item { transition: none !important; }
  .sp-card__img { transition: none !important; }
}
</style>