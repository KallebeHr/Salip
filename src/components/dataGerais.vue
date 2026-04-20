<template>
  <section class="prog" aria-labelledby="prog-title">

    <!-- ── Hero ─────────────────────────────────────────── -->
    <div class="prog__hero">
      <div class="prog__hero-inner">
        <div class="prog__hero-text">
          <span class="kicker">SALIP2 · Programação Oficial</span>
          <h2 id="prog-title" class="prog__title">
            O que acontece<br />
            <span class="prog__title-accent">no evento?</span>
          </h2>
          <p class="prog__desc">
            Filtre por dia, categoria ou busque pelo nome do palestrante,
            horário ou local para planejar sua visita.
          </p>
        </div>
        <div class="prog__hero-actions">
          <button class="hero-btn hero-btn--primary" @click="baixarArquivo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Baixar Folder
          </button>
          <a href="https://wa.link/sg68qw" target="_blank" rel="noopener noreferrer" class="hero-btn hero-btn--ghost">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.87 9.87 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Suporte
          </a>
        </div>
      </div>
    </div>

    <!-- ── Corpo ──────────────────────────────────────────── -->
    <div class="prog__body">

      <!-- Busca -->
      <div class="prog__search">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="busca"
          class="search-input"
          type="search"
          placeholder="Buscar por palestrante, horário, local…"
          aria-label="Buscar na programação"
        />
        <button v-if="busca" class="search-clear" @click="busca = ''" aria-label="Limpar busca">✕</button>
      </div>

      <!-- Abas de Dia -->
      <div class="tabs" role="tablist" aria-label="Selecione o dia">
        <button
          v-for="dia in dias"
          :key="dia.value"
          class="tab"
          :class="{ 'tab--active': diaAtivo === dia.value }"
          role="tab"
          :aria-selected="diaAtivo === dia.value"
          @click="diaAtivo = dia.value"
        >
          <span class="tab__date">{{ dia.label }}</span>
          <span class="tab__day">{{ dia.diaSemana }}</span>
          <span class="tab__count">{{ contarEventosDia(dia.value) }}</span>
        </button>
      </div>

      <!-- Filtros de categoria -->
      <div class="filters" role="group" aria-label="Filtrar por categoria">
        <button
          v-for="cat in categorias"
          :key="cat.value"
          class="filter-chip"
          :class="{ 'filter-chip--active': categoriaAtiva === cat.value }"
          @click="categoriaAtiva = categoriaAtiva === cat.value ? 'todos' : cat.value"
        >
          <span class="filter-chip__dot" :style="`background:${cat.cor}`"></span>
          {{ cat.label }}
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-bar">
        <span class="stats-bar__item">
          <strong>{{ eventosFiltrados.length }}</strong>
          {{ eventosFiltrados.length === 1 ? 'evento' : 'eventos' }}
        </span>
        <span class="stats-bar__sep">·</span>
        <span class="stats-bar__item">
          <strong>{{ locaisUnicos.length }}</strong>
          {{ locaisUnicos.length === 1 ? 'local' : 'locais' }}
        </span>
        <span v-if="busca" class="stats-bar__sep">·</span>
        <span v-if="busca" class="stats-bar__query">Resultado para "{{ busca }}"</span>
      </div>

      <!-- Locais do dia (mapa rápido) -->
      <div v-if="!busca" class="locais-strip">
        <a
          v-for="local in locaisUnicos"
          :key="local.nome"
          :href="local.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="local-chip"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ local.nome }}
          <span class="local-chip__arrow">↗</span>
        </a>
      </div>

      <!-- Timeline de Eventos -->
      <div v-if="eventosFiltrados.length > 0" class="timeline">
        <template v-for="(grupo, periodo) in eventosPorPeriodo" :key="periodo">
          <div v-if="grupo.length > 0" class="timeline__period">
            <div class="period-label">
              <span class="period-label__icon">{{ periodoIcone[periodo] }}</span>
              <span>{{ periodo }}</span>
            </div>

            <div class="timeline__events">
              <article
                v-for="ev in grupo"
                :key="ev._id"
                class="ev-card"
                :class="[`ev-card--${ev._cor}`, { 'ev-card--open': eventoAberto === ev._id }]"
                @click="eventoAberto = eventoAberto === ev._id ? null : ev._id"
              >
                <!-- Linha do tempo -->
                <div class="ev-card__time-col">
                  <span class="ev-card__time">{{ ev.horario }}</span>
                  <div class="ev-card__dot"></div>
                </div>

                <!-- Conteúdo -->
                <div class="ev-card__content">
                  <div class="ev-card__head">
                    <div class="ev-card__meta">
                      <span class="ev-card__cat-badge" :style="`background:${ev._catCor}18; color:${ev._catCor}; border-color:${ev._catCor}30`">
                        {{ ev._catLabel }}
                      </span>
                      <span v-if="ev.vagas" class="ev-card__vagas">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {{ ev.vagas }}
                      </span>
                    </div>
                    <svg class="ev-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>

                  <h4 class="ev-card__title">{{ ev.titulo }}</h4>

                  <!-- Localização sempre visível -->
                  <a
                    v-if="ev._local"
                    :href="ev._local.mapsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="ev-card__local"
                    @click.stop
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ ev._local.nome }}
                  </a>

                  <!-- Descrição expandida -->
                  <div v-if="eventoAberto === ev._id" class="ev-card__desc">
                    {{ ev.descricaoLimpa }}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </template>
      </div>

      <!-- Vazio -->
      <div v-else class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p>Nenhum evento encontrado.</p>
        <button @click="resetFiltros">Limpar filtros</button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Estado ─────────────────────────────────────────────
const busca       = ref('')
const diaAtivo    = ref('22')
const categoriaAtiva = ref('todos')
const eventoAberto   = ref(null)

// ── Dias ───────────────────────────────────────────────
const dias = [
  { value: '22', label: '22/05', diaSemana: 'Quinta' },
  { value: '23', label: '23/05', diaSemana: 'Sexta'  },
  { value: '24', label: '24/05', diaSemana: 'Sábado' },
]

// ── Categorias ─────────────────────────────────────────
const categorias = [
  { value: 'todos',    label: 'Todos',         cor: '#64748b' },
  { value: 'palestra', label: 'Palestras',      cor: '#0D1B5E' },
  { value: 'show',     label: 'Shows',          cor: '#7C3AED' },
  { value: 'oficina',  label: 'Oficinas',       cor: '#D97706' },
  { value: 'infantil', label: 'Infantil',       cor: '#059669' },
  { value: 'foto',     label: 'Fotografia',     cor: '#DB2777' },
]

const catMeta = {
  palestra: { label: 'Palestra',    cor: '#0D1B5E' },
  show:     { label: 'Show',        cor: '#7C3AED' },
  oficina:  { label: 'Oficina',     cor: '#D97706' },
  infantil: { label: 'Infantil',    cor: '#059669' },
  foto:     { label: 'Fotografia',  cor: '#DB2777' },
  abertura: { label: 'Abertura',    cor: '#0D1B5E' },
  espetaculo: { label: 'Espetáculo', cor: '#7C3AED' },
  roda:     { label: 'Roda de Conversa', cor: '#0D1B5E' },
  encerramen: { label: 'Encerramento', cor: '#7C3AED' },
}

// ── Locais ─────────────────────────────────────────────
const locais = {
  ciro:    { nome: 'Centro de Eventos Dep. Ciro Nogueira', mapsUrl: 'https://maps.google.com/?q=Pedro+II+PI+Centro+de+Eventos' },
  norberto:{ nome: 'Auditório Padre Norberto',            mapsUrl: 'https://maps.google.com/?q=Auditório+Padre+Norberto+Pedro+II+PI' },
  praca:   { nome: 'Praça Domingos Mourão Filho',         mapsUrl: 'https://maps.google.com/?q=Praça+Domingos+Mourão+Filho+Pedro+II+PI' },
  clube:   { nome: 'Clube 11 de Agosto',                  mapsUrl: 'https://maps.google.com/?q=Clube+11+de+Agosto+Pedro+II+PI' },
  escola:  { nome: 'Escola José Teixeira Santos',         mapsUrl: 'https://maps.google.com/?q=Escola+José+Teixeira+Santos+Pedro+II+PI' },
}

// ── Dados ─────────────────────────────────────────────
// campo _cat é a categoria para o filtro
const todosEventos = [
  // DIA 22
  { dia:'22', horario:'18h30', periodo:'Noite',  _cat:'abertura',   titulo:'Solenidade Oficial de Abertura do 3º SALIP2',                       descricaoLimpa:'Discursos de autoridades e homenageados.',                                                                                             vagas:null,  _local: locais.ciro },
  { dia:'22', horario:'19h00', periodo:'Noite',  _cat:'palestra',   titulo:'Palestra de Abertura: Fabrício Carpinejar (RS)',                     descricaoLimpa:'Palestra de abertura com o escritor e colunista Fabrício Carpinejar, vindo do Rio Grande do Sul.',                                       vagas:null,  _local: locais.ciro },
  { dia:'22', horario:'21h00', periodo:'Noite',  _cat:'show',       titulo:'Show com Soraya Castelo Branco (PI)',                               descricaoLimpa:'Apresentação musical de Soraya Castelo Branco.',                                                                                        vagas:null,  _local: locais.ciro },
  // DIA 23 MANHÃ
  { dia:'23', horario:'8h00',  periodo:'Manhã',  _cat:'palestra',   titulo:'Acolhida: Gilciê Memória',                                         descricaoLimpa:'Abertura da programação matinal com Gilciê Memória.',                                                                                   vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'8h30',  periodo:'Manhã',  _cat:'palestra',   titulo:'A Voz de Esperança Garcia — Bernardo Aurélio e João P. Luiz (PI)',  descricaoLimpa:'Mediação: Wáleria Rubens.',                                                                                                            vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 1',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'infantil',   titulo:'Contação de Histórias / Teatro de Bonecos',                        descricaoLimpa:'Apresentação: Chagas Vale e Talitha do Monte.',                                                                                         vagas:null,  _local: locais.praca },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'oficina',    titulo:'Oficina de Literatura de Cordel — Joames (PI) · Turma 01',         descricaoLimpa:'Ministrante: Joaquim Mendes (Joames).',                                                                                                vagas:'20 vagas', _local: locais.escola },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'oficina',    titulo:'Oficina de Fanzine — Jerciane Lima (PI) · Turma 01',               descricaoLimpa:'Introdução ao universo do fanzine como ferramenta de expressão literária.',                                                             vagas:'20 vagas', _local: locais.escola },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'oficina',    titulo:'Oficina Poética "Escrever com Outros Passos" — Marina Campelo (PI) · Turma 01', descricaoLimpa:'Escrita criativa com foco na poesia e no movimento.',                                                                     vagas:'20 vagas', _local: locais.escola },
  { dia:'23', horario:'9h00',  periodo:'Manhã',  _cat:'oficina',    titulo:'Oficina "Comida é Memória" — Nutricionista Renata Luiza · Turma 01', descricaoLimpa:'Relação entre gastronomia, memória afetiva e literatura.',                                                                           vagas:'20 vagas', _local: locais.escola },
  { dia:'23', horario:'10h00', periodo:'Manhã',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 2',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'23', horario:'10h00', periodo:'Manhã',  _cat:'infantil',   titulo:'Lenda da Sereia do Pirapora — Grupo Urutau',                       descricaoLimpa:'Espetáculo infantil baseado em lenda regional.',                                                                                        vagas:null,  _local: locais.praca },
  { dia:'23', horario:'10h30', periodo:'Manhã',  _cat:'palestra',   titulo:'Música e Letra, Instrumentos de Educação — Grupo Cocares',         descricaoLimpa:'Palestra/Show. Mediação: Socorrinha Almeida.',                                                                                          vagas:null,  _local: locais.norberto },
  // DIA 23 TARDE
  { dia:'23', horario:'14h00', periodo:'Tarde',  _cat:'palestra',   titulo:'Acolhida: Jair Paulo e Julie',                                     descricaoLimpa:'Abertura do período da tarde.',                                                                                                         vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'14h30', periodo:'Tarde',  _cat:'palestra',   titulo:'O Cânone Literário — O Sublime Piauiense · Luiz Romero (PI)',      descricaoLimpa:'Mediação: Wilson Brandão.',                                                                                                             vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'14h30', periodo:'Tarde',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 3',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'23', horario:'16h30', periodo:'Tarde',  _cat:'palestra',   titulo:'A Literatura de Pedro II: da Pré-história aos Dias Atuais · Ernâni Getirana (PI)', descricaoLimpa:'Mediação: Claisse Sales.',                                                                                             vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'16h30', periodo:'Tarde',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 4',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  // DIA 23 NOITE
  { dia:'23', horario:'18h30', periodo:'Noite',  _cat:'palestra',   titulo:'Acolhida: Marcos Aurélio',                                         descricaoLimpa:'Abertura da programação noturna.',                                                                                                      vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'19h00', periodo:'Noite',  _cat:'espetaculo', titulo:'Espetáculo Esperando Godot — Grupo Harém de Teatro (PI)',          descricaoLimpa:'Texto: Samuel Beckett. Mediação: Helany Max.',                                                                                          vagas:null,  _local: locais.norberto },
  { dia:'23', horario:'21h00', periodo:'Noite',  _cat:'show',       titulo:'Show com Sonayra',                                                 descricaoLimpa:'Apresentação musical na praça.',                                                                                                        vagas:null,  _local: locais.praca },
  // DIA 24 MANHÃ
  { dia:'24', horario:'8h00',  periodo:'Manhã',  _cat:'palestra',   titulo:'Acolhida: Marcus Aurélio',                                         descricaoLimpa:'Abertura da programação matinal.',                                                                                                      vagas:null,  _local: locais.norberto },
  { dia:'24', horario:'8h30',  periodo:'Manhã',  _cat:'palestra',   titulo:'A Lírica de Manuel Bandeira — José de Nicola (SP) e Cineas Santos (PI)', descricaoLimpa:'Mediação: Wilson Brandão.',                                                                                                      vagas:null,  _local: locais.norberto },
  { dia:'24', horario:'9h00',  periodo:'Manhã',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 5',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'24', horario:'9h00',  periodo:'Manhã',  _cat:'infantil',   titulo:'Contação de Histórias / Teatro de Bonecos',                        descricaoLimpa:'Apresentação: Chagas Vale e Talitha do Monte.',                                                                                         vagas:null,  _local: locais.praca },
  { dia:'24', horario:'10h00', periodo:'Manhã',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 6',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'24', horario:'10h00', periodo:'Manhã',  _cat:'infantil',   titulo:'Sítio do Pica-Pau Amarelo — Grupo Urutau',                         descricaoLimpa:'Espetáculo infantil inspirado na obra de Monteiro Lobato.',                                                                             vagas:null,  _local: locais.praca },
  { dia:'24', horario:'10h30', periodo:'Manhã',  _cat:'palestra',   titulo:'Piauienses Escritoras — Gênese Histórica · Jasmine Malta (PI)',    descricaoLimpa:'Mediação: Kássio Gomes (PI).',                                                                                                          vagas:null,  _local: locais.norberto },
  // DIA 24 TARDE
  { dia:'24', horario:'14h00', periodo:'Tarde',  _cat:'palestra',   titulo:'Acolhida: Grupo da APAE',                                          descricaoLimpa:'Abertura da programação da tarde.',                                                                                                     vagas:null,  _local: locais.norberto },
  { dia:'24', horario:'14h30', periodo:'Tarde',  _cat:'palestra',   titulo:'Poesia, Música e Sala de Aula — Adriano Lobão Aragão e Vagner Ribeiro (PI)', descricaoLimpa:'Integração entre literatura, música e prática pedagógica.',                                                                  vagas:null,  _local: locais.norberto },
  { dia:'24', horario:'14h30', periodo:'Tarde',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 7',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  { dia:'24', horario:'16h30', periodo:'Tarde',  _cat:'roda',       titulo:'Roda de Conversa: A Mulher na Literatura de Pedro II',             descricaoLimpa:'Convidadas: Marina Campelo, Adeodata dos Anjos, Aldenira Martins, Dayse Benício, Margarete Gomes e Socorro Almeida. Mediação: Ernani Getirana (PI).', vagas:null, _local: locais.norberto },
  { dia:'24', horario:'16h30', periodo:'Tarde',  _cat:'foto',       titulo:'Exposição Fotográfica "Reviver Pedro II" — Turma 8',               descricaoLimpa:'Curadoria: Historiador Afonso Celso.',                                                                                                  vagas:'40 vagas', _local: locais.clube },
  // DIA 24 NOITE
  { dia:'24', horario:'20h00', periodo:'Noite',  _cat:'encerramen', titulo:'Show de Humor de Encerramento — Selma de Nieta',                   descricaoLimpa:'Encerramento oficial do 3º SALIP2.',                                                                                                    vagas:null,  _local: locais.norberto },
  { dia:'24', horario:'21h00', periodo:'Noite',  _cat:'show',       titulo:'Show de Encerramento — Gonzaga Lu e Trio Asa Branca',             descricaoLimpa:'Show musical de encerramento na praça.',                                                                                                vagas:null,  _local: locais.praca },
]

// Mapa de cat para grupo de filtro
const catParaFiltro = {
  palestra: 'palestra', show: 'show', oficina: 'oficina',
  infantil: 'infantil', foto: 'foto',
  abertura: 'palestra', espetaculo: 'show',
  roda: 'palestra', encerramen: 'show',
}

// ── Computed ───────────────────────────────────────────
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const eventosFiltrados = computed(() => {
  const termo = normalizar(busca.value.trim())
  return todosEventos
    .filter(ev => busca.value ? true : ev.dia === diaAtivo.value)
    .filter(ev => categoriaAtiva.value === 'todos' || catParaFiltro[ev._cat] === categoriaAtiva.value)
    .filter(ev => {
      if (!termo) return true
      return normalizar(ev.titulo).includes(termo) ||
             normalizar(ev.descricaoLimpa).includes(termo) ||
             normalizar(ev._local?.nome || '').includes(termo) ||
             normalizar(ev.horario).includes(termo)
    })
    .map((ev, i) => ({
      ...ev,
      _id: `${ev.dia}-${ev.horario}-${i}`,
      _catLabel: catMeta[ev._cat]?.label || ev._cat,
      _catCor:   catMeta[ev._cat]?.cor   || '#64748b',
    }))
})

const periodoIcone = { Manhã: '🌅', Tarde: '☀️', Noite: '🌙' }

const eventosPorPeriodo = computed(() => {
  const ordem = ['Manhã', 'Tarde', 'Noite']
  return Object.fromEntries(
    ordem.map(p => [p, eventosFiltrados.value.filter(ev => ev.periodo === p)])
  )
})

const locaisUnicos = computed(() => {
  const vistos = new Set()
  return eventosFiltrados.value
    .filter(ev => ev._local && !vistos.has(ev._local.nome) && vistos.add(ev._local.nome))
    .map(ev => ev._local)
})

const contarEventosDia = dia =>
  todosEventos.filter(ev => ev.dia === dia &&
    (categoriaAtiva.value === 'todos' || catParaFiltro[ev._cat] === categoriaAtiva.value)).length

const resetFiltros = () => { busca.value = ''; categoriaAtiva.value = 'todos'; diaAtivo.value = '22' }

const baixarArquivo = () => {
  const link = document.createElement('a')
  link.href = '/ARQ/FolderPrograma.pdf'
  link.download = 'Folder-SALIP2.pdf'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }

/* ── Tokens ──────────────────────────────────────────── */
.prog {
  font-family: 'Outfit', sans-serif;
  color: #0D1B5E;
  background: #F5F6FC;
}

/* ── Hero ────────────────────────────────────────────── */
.prog__hero {
  background: linear-gradient(160deg, #0D1B5E 0%, #1A2D80 60%, #0A2450 100%);
  padding: 4rem 1.5rem 3rem;
  position: relative;
  overflow: hidden;
}

.prog__hero::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 320px; height: 320px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0,194,168,0.18) 0%, transparent 70%);
  pointer-events: none;
}

.prog__hero-inner {
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

.kicker {
  display: inline-block;
  background: rgba(0,194,168,0.15);
  border: 1px solid rgba(0,194,168,0.35);
  color: #6EFAE8;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 0.85rem;
}

.prog__title {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 900;
  line-height: 1;
  color: #fff;
}

.prog__title-accent { color: #00C2A8; font-style: italic; }

.prog__desc {
  margin: 0.9rem 0 0;
  color: rgba(255,255,255,0.55);
  font-size: 0.95rem;
  line-height: 1.75;
  max-width: 480px;
}

.prog__hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.1rem;
  height: 46px;
  border-radius: 999px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.87rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.hero-btn:hover { transform: translateY(-2px); }
.hero-btn svg { width: 16px; height: 16px; }

.hero-btn--primary {
  background: linear-gradient(135deg, #00C2A8, #009E8A);
  color: #fff;
  box-shadow: 0 10px 28px rgba(0,194,168,0.3);
}
.hero-btn--ghost {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.18);
}

/* ── Body ────────────────────────────────────────────── */
.prog__body {
  width: min(1080px, 100%);
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* ── Busca ───────────────────────────────────────────── */
.prog__search {
  position: relative;
  margin-bottom: 1.5rem;
}
.search-icon {
  position: absolute;
  left: 1rem; top: 50%;
  transform: translateY(-50%);
  width: 18px; height: 18px;
  color: #94a3b8;
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 52px;
  padding: 0 2.8rem 0 2.8rem;
  border-radius: 14px;
  border: 1.5px solid rgba(13,27,94,0.1);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  color: #0D1B5E;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus {
  border-color: rgba(0,194,168,0.5);
  box-shadow: 0 0 0 3px rgba(0,194,168,0.12);
}
.search-clear {
  position: absolute;
  right: 1rem; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: #94a3b8; cursor: pointer;
  font-size: 0.85rem; padding: 0.2rem;
}

/* ── Tabs de Dia ─────────────────────────────────────── */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  border: 1.5px solid rgba(13,27,94,0.1);
  background: #fff;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.tab:hover { border-color: rgba(0,194,168,0.5); }

.tab--active {
  background: #0D1B5E;
  border-color: #0D1B5E;
  color: #fff;
}

.tab__date { font-size: 0.95rem; font-weight: 800; }
.tab__day  { font-size: 0.72rem; font-weight: 500; opacity: 0.7; }
.tab__count {
  margin-top: 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: rgba(0,194,168,0.2);
  color: #00a08a;
}
.tab--active .tab__count { background: rgba(255,255,255,0.18); color: #fff; }

/* ── Filtros ─────────────────────────────────────────── */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1.5px solid rgba(13,27,94,0.1);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4a5585;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-chip:hover { border-color: rgba(13,27,94,0.25); }
.filter-chip--active {
  background: #0D1B5E;
  border-color: #0D1B5E;
  color: #fff;
}
.filter-chip__dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.filter-chip--active .filter-chip__dot { background: #00C2A8 !important; }

/* ── Stats ───────────────────────────────────────────── */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  font-size: 0.83rem;
  color: #94a3b8;
}
.stats-bar__item { color: #4a5585; }
.stats-bar__item strong { color: #0D1B5E; }
.stats-bar__sep { color: #cbd5e1; }
.stats-bar__query { color: #0D1B5E; font-weight: 600; }

/* ── Locais Strip ────────────────────────────────────── */
.locais-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.local-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.85rem;
  border-radius: 10px;
  background: rgba(0,194,168,0.08);
  border: 1px solid rgba(0,194,168,0.2);
  color: #007a6d;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.18s ease;
}
.local-chip:hover { background: rgba(0,194,168,0.15); }
.local-chip svg { width: 12px; height: 12px; }
.local-chip__arrow { opacity: 0.6; font-size: 0.75rem; }

/* ── Timeline ────────────────────────────────────────── */
.timeline { display: flex; flex-direction: column; gap: 2rem; }

.timeline__period {}

.period-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.timeline__events {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 2px solid rgba(13,27,94,0.08);
  padding-left: 1.25rem;
  margin-left: 0.5rem;
}

/* ── Evento Card ─────────────────────────────────────── */
.ev-card {
  display: flex;
  gap: 1rem;
  background: #fff;
  border: 1.5px solid rgba(13,27,94,0.08);
  border-radius: 14px;
  padding: 1rem 1.1rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  position: relative;
}
.ev-card:hover {
  border-color: rgba(13,27,94,0.18);
  box-shadow: 0 6px 20px rgba(13,27,94,0.06);
  transform: translateX(3px);
}
.ev-card--open {
  border-color: rgba(0,194,168,0.35) !important;
  box-shadow: 0 8px 24px rgba(0,194,168,0.1) !important;
}

.ev-card__time-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  padding-top: 0.15rem;
}

.ev-card__time {
  font-size: 0.78rem;
  font-weight: 800;
  color: #0D1B5E;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.ev-card__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(13,27,94,0.15);
  position: relative;
}
.ev-card--open .ev-card__dot { background: #00C2A8; }

.ev-card__content { flex: 1; min-width: 0; }

.ev-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.ev-card__meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

.ev-card__cat-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  border: 1px solid;
}

.ev-card__vagas {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #D97706;
  background: #FEF3C7;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.ev-card__vagas svg { width: 11px; height: 11px; }

.ev-card__chevron {
  width: 18px; height: 18px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.25s ease;
}
.ev-card--open .ev-card__chevron { transform: rotate(180deg); color: #00C2A8; }

.ev-card__title {
  margin: 0 0 0.45rem;
  font-size: 0.93rem;
  font-weight: 700;
  line-height: 1.45;
  color: #0D1B5E;
}

.ev-card__local {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #007a6d;
  text-decoration: none;
  padding: 0.2rem 0.55rem;
  background: rgba(0,194,168,0.07);
  border-radius: 8px;
  transition: background 0.18s ease;
}
.ev-card__local:hover { background: rgba(0,194,168,0.15); }
.ev-card__local svg { width: 11px; height: 11px; flex-shrink: 0; }

.ev-card__desc {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(13,27,94,0.06);
  font-size: 0.87rem;
  line-height: 1.7;
  color: #4a5585;
  animation: fadeDown 0.2s ease both;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Vazio ───────────────────────────────────────────── */
.empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
}
.empty svg { width: 40px; height: 40px; margin-bottom: 1rem; display: block; margin-inline: auto; }
.empty p { font-size: 0.95rem; margin: 0 0 1rem; }
.empty button {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: 1.5px solid rgba(13,27,94,0.15);
  background: #fff;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #0D1B5E;
  cursor: pointer;
}

/* ── Responsivo ──────────────────────────────────────── */
@media (max-width: 640px) {
  .prog__hero { padding: 3rem 1rem 2.5rem; }
  .prog__hero-inner { flex-direction: column; align-items: flex-start; }
  .prog__body { padding: 1.5rem 1rem 3rem; }
  .hero-btn--ghost span { display: none; }

  .ev-card__time-col { display: none; }
  .timeline__events { padding-left: 0; border-left: none; margin-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ev-card, .hero-btn, .tab, .filter-chip, .local-chip { transition: none !important; }
  .ev-card__desc { animation: none !important; }
}
</style>