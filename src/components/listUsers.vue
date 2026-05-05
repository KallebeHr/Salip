<template>
  <div class="admin-wrap">
    <header class="topbar">
      <div class="topbar-left">
        <div class="logo-mark">
          <span>S2</span>
        </div>

        <div>
          <h1 class="topbar-title">Painel Administrativo</h1>
          <p class="topbar-sub">
            SALIP 2 · Atualizado {{ atualizadoEm || '—' }}
          </p>
        </div>
      </div>

      <div class="topbar-right">
        <span class="online-badge">
          <span class="dot-pulse"></span>
          {{ usuariosOrdenados.length }} inscritos · {{ avaliacoesOrdenadas.length }} avaliações
        </span>

        <button class="btn-logout" type="button" @click="logout">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </header>

    <main class="content">
      <section class="status-card" v-if="loadingUsuarios || loadingAvaliacoes || erroUsuarios || erroAvaliacoes">
        <div v-if="loadingUsuarios || loadingAvaliacoes" class="status-content">
          <span class="loader"></span>
          <div>
            <strong>Carregando dados</strong>
            <p>Buscando inscrições e avaliações no Firebase.</p>
          </div>
        </div>

        <div v-else class="status-content error">
          <strong>Algum dado não foi carregado</strong>
          <p v-if="erroUsuarios">{{ erroUsuarios }}</p>
          <p v-if="erroAvaliacoes">{{ erroAvaliacoes }}</p>

          <button class="btn-action blue" type="button" @click="carregarTudo">
            Tentar novamente
          </button>
        </div>
      </section>

      <!-- KPIs USUÁRIOS -->
      <section class="kpi-grid">
        <button
          v-for="card in kpiCards"
          :key="card.tipo"
          type="button"
          class="kpi-card"
          :class="{ active: filtroUsuarioTipo === card.tipo }"
          :style="{ '--accent': card.color }"
          @click="filtroUsuarioTipo = card.tipo"
        >
          <div class="kpi-top">
            <span class="kpi-icon" v-html="card.icon"></span>
            <span class="kpi-delta" v-if="filtroUsuarioTipo === card.tipo">selecionado</span>
          </div>

          <div class="kpi-number">{{ card.count }}</div>
          <div class="kpi-label">{{ card.label }}</div>

          <div class="kpi-bar">
            <div
              class="kpi-bar-fill"
              :style="{ width: card.pct + '%', background: card.color }"
            ></div>
          </div>

          <div class="kpi-pct">{{ card.pct }}% do total</div>
        </button>
      </section>

      <!-- ESTATÍSTICAS USUÁRIOS -->
      <section class="stats-row">
        <div class="chart-card">
          <h2 class="card-title">Por UF</h2>

          <div class="stat-list" v-if="statsPorUF.length">
            <div v-for="item in statsPorUF" :key="item.label" class="stat-item">
              <span class="stat-name">{{ item.label }}</span>

              <div class="stat-track">
                <div class="stat-fill" :style="{ width: item.barPct + '%' }"></div>
              </div>

              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>

          <p v-else class="empty-card">Nenhum dado de UF.</p>
        </div>

        <div class="chart-card">
          <h2 class="card-title">Atividades populares</h2>

          <div class="stat-list" v-if="statsEventos.length">
            <div v-for="item in statsEventos" :key="item.label" class="stat-item">
              <span class="stat-name">{{ item.label }}</span>

              <div class="stat-track">
                <div class="stat-fill green" :style="{ width: item.barPct + '%' }"></div>
              </div>

              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>

          <p v-else class="empty-card">Nenhuma atividade selecionada.</p>
        </div>

        <div class="chart-card">
          <h2 class="card-title">Escola / Trabalho</h2>

          <div class="stat-list" v-if="statsInstituicoes.length">
            <div
              v-for="item in statsInstituicoes"
              :key="item.label"
              class="stat-item"
            >
              <span class="stat-name stat-name-marquee" :title="item.label">
                <span>{{ item.label }}</span>
              </span>

              <div class="stat-track">
                <div class="stat-fill amber" :style="{ width: item.barPct + '%' }"></div>
              </div>

              <span class="stat-count">{{ item.count }}</span>
              <span class="stat-pct">{{ item.pct }}%</span>
            </div>
          </div>

          <p v-else class="empty-card">Nenhum vínculo informado.</p>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════ -->
      <!-- GESTÃO DE OFICINAS                            -->
      <!-- ══════════════════════════════════════════════ -->
      <section class="oficinas-section">
        <div class="section-header oficinas-header">
          <div>
            <span class="section-kicker kicker-green">Agenda</span>
            <h2>Gestão de Oficinas</h2>
            <p>
              Gerencie vagas, confirmados e lista de espera de cada oficina.
              O sistema calcula automaticamente os status com base na ordem de inscrição.
            </p>
          </div>

          <div class="section-actions">
            <button class="btn-action teal" type="button" @click="baixarExcelTodasOficinas">
              Excel · Todas oficinas
            </button>
            <button class="btn-action neutral" type="button" @click="carregarTudo">
              Atualizar
            </button>
          </div>
        </div>

        <!-- KPIs OFICINAS -->
        <div class="oficinas-kpis">
          <div class="okpi-card">
            <span class="okpi-label">Oficinas</span>
            <strong class="okpi-number">{{ todasOficinasParsed.length }}</strong>
            <small>sessões</small>
          </div>
          <div class="okpi-card">
            <span class="okpi-label">Inscrições</span>
            <strong class="okpi-number">{{ totalInscricoesOficinas }}</strong>
            <small>total</small>
          </div>
          <div class="okpi-card okpi-green">
            <span class="okpi-label">Confirmados</span>
            <strong class="okpi-number">{{ totalConfirmadosOficinas }}</strong>
            <small>com vaga</small>
          </div>
          <div class="okpi-card okpi-amber">
            <span class="okpi-label">Reserva</span>
            <strong class="okpi-number">{{ totalReservaOficinas }}</strong>
            <small>aguardando</small>
          </div>
          <div class="okpi-card okpi-blue">
            <span class="okpi-label">Vagas totais</span>
            <strong class="okpi-number">{{ totalVagasOficinas }}</strong>
            <small>disponíveis</small>
          </div>
        </div>

        <!-- BARRA DE BUSCA -->
        <div class="table-toolbar inner">
          <div class="toolbar-left">
            <h2 class="card-title no-margin">Sessões cadastradas</h2>
            <span class="result-count">{{ oficinasFiltradasGestao.length }} oficina{{ oficinasFiltradasGestao.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="toolbar-right">
            <div class="search-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input v-model="buscaOficinas" class="search-input" placeholder="Buscar oficina, local, data..." />
            </div>
            <select v-model="filtroOficinaStatus" class="filter-select">
              <option value="todas">Todas</option>
              <option value="com_reserva">Com lista de espera</option>
              <option value="vagas_disponiveis">Com vagas livres</option>
              <option value="lotada">Lotadas</option>
            </select>
          </div>
        </div>

        <!-- GRID DE OFICINAS -->
        <div class="oficinas-grid" v-if="oficinasFiltradasGestao.length">
          <div
            v-for="of in oficinasFiltradasGestao"
            :key="of.key"
            class="oficina-card"
            @click="abrirModalOficinaGestao(of)"
          >
            <div class="ocard-top">
              <div class="ocard-date-badge">
                <span class="ocard-dia">{{ of.diaSemana }}</span>
                <span class="ocard-data">{{ of.data }}</span>
              </div>
              <div class="ocard-hora-badge">{{ of.horario }}</div>
            </div>

            <div class="ocard-nome">{{ of.nome }}</div>

            <div class="ocard-professor" v-if="professoresMap[of.nome]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {{ professoresMap[of.nome] }}
            </div>
            <div class="ocard-professor muted" v-else>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Professor não definido
            </div>

            <div class="ocard-local" :title="of.local">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ of.local }}
            </div>

            <div class="ocard-vagas-row">
              <div class="ocard-vagas-bar-wrap">
                <div
                  class="ocard-vagas-bar"
                  :style="{
                    width: of.vagas > 0 ? Math.min(100, Math.round((getConfirmados(of) / of.vagas) * 100)) + '%' : '100%',
                    background: getConfirmados(of) >= of.vagas ? '#ef4444' : getConfirmados(of) >= of.vagas * 0.8 ? '#f59e0b' : '#16a34a'
                  }"
                ></div>
              </div>
              <div class="ocard-vagas-nums">
                <span class="ocard-confirmados">{{ getConfirmados(of) }}/{{ of.vagas }}</span>
                <span v-if="getReserva(of) > 0" class="ocard-reserva-badge">+{{ getReserva(of) }} reserva</span>
                <span v-else-if="getConfirmados(of) < of.vagas" class="ocard-livre-badge">{{ of.vagas - getConfirmados(of) }} livre{{ of.vagas - getConfirmados(of) !== 1 ? 's' : '' }}</span>
              </div>
            </div>

            <div class="ocard-footer">
              <span class="ocard-total-inscritos">{{ of.alunos.length }} inscrito{{ of.alunos.length !== 1 ? 's' : '' }}</span>
              <span class="ocard-ver-btn">Ver lista →</span>
            </div>
          </div>
        </div>

        <div class="empty-oficinas" v-else>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <p>Nenhuma oficina encontrada.</p>
        </div>
      </section>

      <!-- ÁREA AVALIAÇÕES -->
      <section class="avaliacoes-section">
        <div class="section-header">
          <div>
            <span class="section-kicker">Feedbacks</span>
            <h2>Avaliações recebidas</h2>
            <p>
              Pesquise, filtre e acompanhe as avaliações enviadas pelo público.
              As avaliações anônimas aparecem sem nome.
            </p>
          </div>

          <div class="section-actions">
            <button class="btn-action green" type="button" @click="baixarExcelAvaliacoes">
              Excel avaliações
            </button>

            <button class="btn-action blue" type="button" @click="baixarCSVAvaliacoes">
              CSV avaliações
            </button>
          </div>
        </div>

        <div class="reviews-summary">
          <div class="review-summary-card main">
            <span>Nota média</span>
            <strong>{{ mediaGeralAvaliacoes }}</strong>
            <small>/10</small>
          </div>

          <div class="review-summary-card">
            <span>Total</span>
            <strong>{{ avaliacoesOrdenadas.length }}</strong>
            <small>avaliações</small>
          </div>

          <div class="review-summary-card">
            <span>Anônimas</span>
            <strong>{{ totalAvaliacoesAnonimas }}</strong>
            <small>{{ pctAvaliacoesAnonimas }}%</small>
          </div>

          <div class="review-summary-card">
            <span>Com comentário</span>
            <strong>{{ totalAvaliacoesComComentario }}</strong>
            <small>{{ pctAvaliacoesComComentario }}%</small>
          </div>
        </div>

        <div class="table-toolbar inner">
          <div class="toolbar-left">
            <h2 class="card-title no-margin">Lista de avaliações</h2>

            <span class="result-count">
              {{ avaliacoesFiltradas.length }} resultado{{ avaliacoesFiltradas.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="toolbar-right">
            <div class="search-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                v-model="buscaAvaliacoes"
                class="search-input"
                placeholder="Buscar avaliação, atividade, comentário..."
              />
            </div>

            <select v-model="filtroAvaliacaoTipo" class="filter-select">
              <option value="todos">Todos os tipos</option>
              <option value="evento_geral">Evento geral</option>
              <option value="oficina">Oficinas</option>
              <option value="palestra">Palestras</option>
              <option value="exposicao">Exposições</option>
            </select>

            <select v-model="filtroAvaliacaoIdentificacao" class="filter-select">
              <option value="todos">Todas</option>
              <option value="anonima">Anônimas</option>
              <option value="identificada">Identificadas</option>
            </select>

            <select v-model="filtroAvaliacaoNota" class="filter-select">
              <option value="todas">Todas as notas</option>
              <option value="baixas">Notas 1 a 6</option>
              <option value="boas">Notas 7 e 8</option>
              <option value="excelentes">Notas 9 e 10</option>
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Participante</th>
                <th>Tipo</th>
                <th>Atividade</th>
                <th class="sortable" @click="toggleSortAvaliacao('notaGeral')">
                  Nota
                  <span class="sort-arrow">
                    {{ sortAvaliacaoCol === 'notaGeral' ? (sortAvaliacaoDir === 1 ? '↑' : '↓') : '↕' }}
                  </span>
                </th>
                <th>Aspectos</th>
                <th>Comentário</th>
                <th class="sortable" @click="toggleSortAvaliacao('criadoEmMs')">
                  Data
                  <span class="sort-arrow">
                    {{ sortAvaliacaoCol === 'criadoEmMs' ? (sortAvaliacaoDir === 1 ? '↑' : '↓') : '↕' }}
                  </span>
                </th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="avaliacoesFiltradas.length === 0">
                <td colspan="9" class="empty-row">Nenhuma avaliação encontrada.</td>
              </tr>

              <tr
                v-for="avaliacao in avaliacoesPaginadas"
                :key="avaliacao.idAvaliacao"
                class="data-row"
                @click="abrirModalAvaliacao(avaliacao)"
              >
                <td>
                  <span class="id-chip">{{ avaliacao.idAvaliacao }}</span>
                </td>

                <td>
                  <div class="user-cell">
                    <div class="avatar" :class="{ anonymous: avaliacao.anonimo }">
                      {{ avaliacao.anonimo ? 'A' : getInitials(avaliacao.nome) }}
                    </div>

                    <div class="user-info-cell">
                      <span class="user-name">
                        {{ avaliacao.anonimo ? 'Anônimo' : avaliacao.nome }}
                      </span>
                      <small>{{ avaliacao.modoIdentificacaoLabel }}</small>
                    </div>
                  </div>
                </td>

                <td>
                  <span class="badge-review" :class="'review-' + avaliacao.tipo">
                    {{ avaliacao.tipoLabel }}
                  </span>
                </td>

                <td class="td-muted td-trunc">
                  {{ avaliacao.atividadeTitulo || '—' }}
                </td>

                <td>
                  <span class="score-pill" :class="getScoreClass(avaliacao.notaGeral)">
                    {{ avaliacao.notaGeral }}/10
                  </span>
                </td>

                <td>
                  <span class="aspect-pill">{{ avaliacao.mediaAspectos || 0 }}/5</span>
                </td>

                <td class="td-muted td-trunc">
                  {{ avaliacao.comentario || 'Sem comentário' }}
                </td>

                <td class="td-muted">
                  {{ formatarDataHora(avaliacao.criadoEm) || '—' }}
                </td>

                <td>
                  <button class="btn-detail" type="button" @click.stop="abrirModalAvaliacao(avaliacao)">
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span class="pag-info">
            Página {{ paginaAvaliacoes }} de {{ totalPaginasAvaliacoes || 1 }}
          </span>

          <div class="pag-btns">
            <button class="pag-btn" type="button" :disabled="paginaAvaliacoes === 1" @click="paginaAvaliacoes = 1">«</button>
            <button class="pag-btn" type="button" :disabled="paginaAvaliacoes === 1" @click="paginaAvaliacoes--">‹</button>

            <button
              v-for="p in paginasAvaliacoesVisiveis"
              :key="p"
              type="button"
              class="pag-btn"
              :class="{ current: p === paginaAvaliacoes }"
              @click="paginaAvaliacoes = p"
            >
              {{ p }}
            </button>

            <button
              class="pag-btn"
              type="button"
              :disabled="paginaAvaliacoes === totalPaginasAvaliacoes || totalPaginasAvaliacoes === 0"
              @click="paginaAvaliacoes++"
            >
              ›
            </button>

            <button
              class="pag-btn"
              type="button"
              :disabled="paginaAvaliacoes === totalPaginasAvaliacoes || totalPaginasAvaliacoes === 0"
              @click="paginaAvaliacoes = totalPaginasAvaliacoes"
            >
              »
            </button>
          </div>

          <select v-model.number="itensPorPaginaAvaliacoes" class="pag-select" @change="paginaAvaliacoes = 1">
            <option :value="5">5 por página</option>
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
          </select>
        </div>
      </section>

      <!-- TABELA USUÁRIOS -->
      <section class="table-section">
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="card-title no-margin">Participantes cadastrados</h2>

            <span class="result-count">
              {{ usuariosFiltrados.length }} resultado{{ usuariosFiltrados.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <div class="toolbar-right">
            <div class="search-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                v-model="buscaUsuarios"
                class="search-input"
                placeholder="Buscar ID, nome, cidade, escola..."
              />
            </div>

            <div class="filter-pills">
              <button
                v-for="f in filtrosUsuarios"
                :key="f.value"
                type="button"
                class="pill"
                :class="{ active: filtroUsuarioTipo === f.value }"
                @click="filtroUsuarioTipo = f.value"
              >
                {{ f.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>

                <th class="sortable" @click="toggleSortUsuario('nomeCompleto')">
                  Nome
                  <span class="sort-arrow">
                    {{ sortUsuarioCol === 'nomeCompleto' ? (sortUsuarioDir === 1 ? '↑' : '↓') : '↕' }}
                  </span>
                </th>

                <th class="sortable" @click="toggleSortUsuario('cidade')">
                  Cidade
                  <span class="sort-arrow">
                    {{ sortUsuarioCol === 'cidade' ? (sortUsuarioDir === 1 ? '↑' : '↓') : '↕' }}
                  </span>
                </th>

                <th>UF</th>
                <th>Tipo</th>
                <th>Idade</th>
                <th>Escola / Trabalho</th>
                <th>Atividades</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="10" class="empty-row">Nenhum participante encontrado.</td>
              </tr>

              <tr
                v-for="(u, i) in usuariosPaginados"
                :key="u.idUsuario"
                class="data-row"
                :class="{ alt: i % 2 === 1 }"
                @click="abrirModalUsuario(u)"
              >
                <td>
                  <span class="id-chip">{{ u.idUsuario }}</span>
                </td>

                <td>
                  <div class="user-cell">
                    <div
                      class="avatar"
                      :style="{
                        background: getColor(u.tipoParticipante).light,
                        color: getColor(u.tipoParticipante).text
                      }"
                    >
                      {{ getInitials(u.nomeCompleto) }}
                    </div>

                    <div class="user-info-cell">
                      <span class="user-name">{{ u.nomeCompleto || '—' }}</span>
                      <small>{{ formatarDataHora(u.criadoEm) }}</small>
                    </div>
                  </div>
                </td>

                <td class="td-muted">{{ u.cidade || '—' }}</td>
                <td class="td-muted">{{ u.uf || '—' }}</td>

                <td>
                  <span class="badge" :class="'badge-' + (u.tipoParticipante || 'outro')">
                    {{ formatarTipoUsuario(u.tipoParticipante) }}
                  </span>
                </td>

                <td class="td-muted">{{ u.idade || calcIdade(u.dataNascimento) || '—' }}</td>

                <td class="td-muted td-trunc">
                  {{ u.escola || u.localTrabalho || '—' }}
                </td>

                <td class="td-muted td-trunc">
                  {{ resumoAtividades(u) }}
                </td>

                <td>
                  <span class="status-badge" :class="'status-' + (u.status || 'confirmada')">
                    {{ u.status || 'confirmada' }}
                  </span>
                </td>

                <td>
                  <button class="btn-detail" type="button" @click.stop="abrirModalUsuario(u)">
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span class="pag-info">
            Página {{ paginaUsuarios }} de {{ totalPaginasUsuarios || 1 }}
          </span>

          <div class="pag-btns">
            <button class="pag-btn" type="button" :disabled="paginaUsuarios === 1" @click="paginaUsuarios = 1">«</button>
            <button class="pag-btn" type="button" :disabled="paginaUsuarios === 1" @click="paginaUsuarios--">‹</button>

            <button
              v-for="p in paginasUsuariosVisiveis"
              :key="p"
              type="button"
              class="pag-btn"
              :class="{ current: p === paginaUsuarios }"
              @click="paginaUsuarios = p"
            >
              {{ p }}
            </button>

            <button
              class="pag-btn"
              type="button"
              :disabled="paginaUsuarios === totalPaginasUsuarios || totalPaginasUsuarios === 0"
              @click="paginaUsuarios++"
            >
              ›
            </button>

            <button
              class="pag-btn"
              type="button"
              :disabled="paginaUsuarios === totalPaginasUsuarios || totalPaginasUsuarios === 0"
              @click="paginaUsuarios = totalPaginasUsuarios"
            >
              »
            </button>
          </div>

          <select v-model.number="itensPorPaginaUsuarios" class="pag-select" @change="paginaUsuarios = 1">
            <option :value="10">10 por página</option>
            <option :value="20">20 por página</option>
            <option :value="50">50 por página</option>
            <option :value="100">100 por página</option>
          </select>
        </div>
      </section>

      <section class="actions-bar">
        <div class="actions-left">
          <button class="btn-action green" type="button" @click="baixarExcelUsuarios">
            Baixar Excel inscritos
          </button>

          <button class="btn-action blue" type="button" @click="baixarCSVUsuarios">
            Baixar CSV inscritos
          </button>

          <button class="btn-action neutral" type="button" @click="carregarTudo">
            Atualizar tudo
          </button>

          <span class="export-note">
            Inscritos: {{ usuariosFiltrados.length }} · Avaliações: {{ avaliacoesFiltradas.length }}
          </span>
        </div>

        <button class="btn-logout-footer" type="button" @click="logout">
          Sair da Administração
        </button>
      </section>
    </main>

    <!-- ══════════════════════════════════════════════ -->
    <!-- MODAL GESTÃO DE OFICINA                       -->
    <!-- ══════════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="modalOficinaGestaoAberto" class="modal-overlay" @click.self="modalOficinaGestaoAberto = false">
        <div class="modal modal-wide">
          <div class="modal-header oficina-modal-header">
            <div class="oficina-modal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>

            <div class="modal-info" style="flex:1">
              <h2 class="modal-name">{{ oficinaSelecionadaGestao?.nome }}</h2>
              <div class="modal-badges" style="flex-wrap:wrap;gap:0.35rem">
                <span class="ocard-date-badge inline">
                  {{ oficinaSelecionadaGestao?.diaSemana }} {{ oficinaSelecionadaGestao?.data }}
                </span>
                <span class="ocard-hora-badge">{{ oficinaSelecionadaGestao?.horario }}</span>
                <span class="vagas-chip">
                  {{ oficinaSelecionadaGestao ? getConfirmados(oficinaSelecionadaGestao) : 0 }}/{{ oficinaSelecionadaGestao?.vagas }} vagas
                </span>
                <span
                  v-if="oficinaSelecionadaGestao && getReserva(oficinaSelecionadaGestao) > 0"
                  class="reserva-chip"
                >
                  {{ getReserva(oficinaSelecionadaGestao) }} na reserva
                </span>
              </div>
            </div>

            <button class="modal-close-btn" type="button" @click="modalOficinaGestaoAberto = false">
              ×
            </button>
          </div>

          <!-- Infos da oficina + professor -->
          <div class="oficina-modal-meta" v-if="oficinaSelecionadaGestao">
            <div class="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ oficinaSelecionadaGestao.local || '—' }}
            </div>

            <div class="meta-item professor-edit-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <template v-if="editandoProfessorOficina === oficinaSelecionadaGestao.nome">
                <input
                  v-model="novoProfessorNome"
                  class="professor-input"
                  placeholder="Nome do professor..."
                  @keyup.enter="salvarProfessor(oficinaSelecionadaGestao.nome)"
                  @keyup.esc="editandoProfessorOficina = null"
                  autofocus
                />
                <button class="btn-mini green" type="button" @click="salvarProfessor(oficinaSelecionadaGestao.nome)">Salvar</button>
                <button class="btn-mini neutral" type="button" @click="editandoProfessorOficina = null">Cancelar</button>
              </template>
              <template v-else>
                <span>{{ professoresMap[oficinaSelecionadaGestao.nome] || 'Professor não definido' }}</span>
                <button class="btn-mini neutral" type="button" @click="iniciarEdicaoProfessor(oficinaSelecionadaGestao.nome)">
                  {{ professoresMap[oficinaSelecionadaGestao.nome] ? 'Editar' : 'Definir' }}
                </button>
              </template>
            </div>
          </div>

          <!-- Legenda + download -->
          <div class="oficina-modal-toolbar">
            <div class="omt-legend">
              <span class="leg-chip confirmado">● Confirmado — com vaga garantida</span>
              <span class="leg-chip reserva">● Reserva — aguardando desistência</span>
            </div>
            <div class="omt-actions">
              <button class="btn-action green" type="button" @click="baixarExcelOficina(oficinaSelecionadaGestao)">
                Excel desta oficina
              </button>
              <button class="btn-action blue" type="button" @click="baixarCSVOficina(oficinaSelecionadaGestao)">
                CSV desta oficina
              </button>
            </div>
          </div>

          <!-- Tabela de alunos -->
          <div class="table-wrap oficina-table-wrap" v-if="oficinaSelecionadaGestao">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Participante</th>
                  <th>Escola / Trabalho</th>
                  <th>Cidade</th>
                  <th>Telefone</th>
                  <th>Inscrito em</th>
                  <th>Status</th>
                  <th>Alterar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="oficinaSelecionadaGestao.alunos.length === 0">
                  <td colspan="8" class="empty-row">Nenhum inscrito nesta oficina.</td>
                </tr>

                <tr
                  v-for="(u, idx) in oficinaSelecionadaGestao.alunos"
                  :key="u.idUsuario"
                  class="data-row"
                  :class="{
                    'row-confirmado': getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'confirmado',
                    'row-reserva': getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'reserva'
                  }"
                >
                  <td>
                    <span
                      class="posicao-num"
                      :class="{
                        'pos-confirmado': getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'confirmado',
                        'pos-reserva': getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'reserva'
                      }"
                    >
                      {{ idx + 1 }}
                    </span>
                  </td>

                  <td>
                    <div class="user-cell">
                      <div
                        class="avatar"
                        :style="{
                          background: getColor(u.tipoParticipante).light,
                          color: getColor(u.tipoParticipante).text
                        }"
                      >
                        {{ getInitials(u.nomeCompleto) }}
                      </div>
                      <div class="user-info-cell">
                        <span class="user-name">{{ u.nomeCompleto || '—' }}</span>
                        <small>
                          <span class="badge" :class="'badge-' + (u.tipoParticipante || 'outro')" style="font-size:0.6rem;padding:0.1rem 0.35rem">
                            {{ formatarTipoUsuario(u.tipoParticipante) }}
                          </span>
                        </small>
                      </div>
                    </div>
                  </td>

                  <td class="td-muted td-trunc">{{ u.escola || u.localTrabalho || '—' }}</td>
                  <td class="td-muted">{{ u.cidade || '—' }}<span v-if="u.uf"> · {{ u.uf }}</span></td>
                  <td class="td-muted">{{ u.telefone || '—' }}</td>
                  <td class="td-muted" style="white-space:nowrap;font-size:0.74rem;">{{ formatarDataHora(u.criadoEm) || '—' }}</td>

                  <td>
                    <span
                      class="status-oficina-pill"
                      :class="getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'confirmado' ? 'sop-confirmado' : 'sop-reserva'"
                    >
                      {{ getStatusOficinaUsuario(u, oficinaSelecionadaGestao) === 'confirmado' ? '✓ Confirmado' : '⏳ Reserva' }}
                    </span>
                    <span
                      v-if="u.vagasOficinas?.[oficinaSelecionadaGestao.key]"
                      class="manual-badge"
                      title="Status alterado manualmente pelo admin"
                    >manual</span>
                  </td>

                  <td>
                    <div class="toggle-btns" v-if="!updatingOficinaStatus[getLoadingKey(u, oficinaSelecionadaGestao)]">
                      <button
                        v-if="getStatusOficinaUsuario(u, oficinaSelecionadaGestao) !== 'confirmado'"
                        class="btn-mini green"
                        type="button"
                        @click="toggleStatusOficinaUsuario(u, oficinaSelecionadaGestao, 'confirmado')"
                      >
                        Confirmar
                      </button>
                      <button
                        v-if="getStatusOficinaUsuario(u, oficinaSelecionadaGestao) !== 'reserva'"
                        class="btn-mini amber"
                        type="button"
                        @click="toggleStatusOficinaUsuario(u, oficinaSelecionadaGestao, 'reserva')"
                      >
                        Reserva
                      </button>
                      <button
                        v-if="u.vagasOficinas?.[oficinaSelecionadaGestao.key]"
                        class="btn-mini neutral"
                        type="button"
                        title="Remover override manual e voltar ao automático"
                        @click="resetarStatusOficinaUsuario(u, oficinaSelecionadaGestao)"
                      >
                        Auto
                      </button>
                    </div>
                    <span v-else class="loader-small"></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-footer" style="justify-content:space-between;align-items:center">
            <p class="footer-note" v-if="oficinaSelecionadaGestao">
              Os primeiros <strong>{{ oficinaSelecionadaGestao.vagas }}</strong> inscritos por data de cadastro recebem vaga automaticamente.
              O admin pode alterar manualmente qualquer status.
            </p>
            <button class="btn-action blue" type="button" @click="modalOficinaGestaoAberto = false">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL USUÁRIO -->
    <Transition name="fade">
      <div v-if="modalUsuarioAberto" class="modal-overlay" @click.self="modalUsuarioAberto = false">
        <div class="modal">
          <div class="modal-header">
            <div
              class="modal-avatar"
              :style="{
                background: getColor(usuarioSelecionado?.tipoParticipante).light,
                color: getColor(usuarioSelecionado?.tipoParticipante).text
              }"
            >
              {{ getInitials(usuarioSelecionado?.nomeCompleto || '') }}
            </div>

            <div class="modal-info">
              <h2 class="modal-name">{{ usuarioSelecionado?.nomeCompleto }}</h2>

              <div class="modal-badges">
                <span class="id-chip">{{ usuarioSelecionado?.idUsuario }}</span>
                <span class="badge" :class="'badge-' + (usuarioSelecionado?.tipoParticipante || 'outro')">
                  {{ formatarTipoUsuario(usuarioSelecionado?.tipoParticipante) }}
                </span>
              </div>
            </div>

            <button class="modal-close-btn" type="button" @click="modalUsuarioAberto = false">
              ×
            </button>
          </div>

          <div class="modal-body" v-if="usuarioSelecionado">
            <div class="modal-section">
              <div class="modal-section-title">Dados pessoais</div>

              <div class="modal-row">
                <span class="modal-label">ID</span>
                <span class="modal-val">{{ usuarioSelecionado.idUsuario }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Nome</span>
                <span class="modal-val">{{ usuarioSelecionado.nomeCompleto || '—' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Cidade</span>
                <span class="modal-val">
                  {{ usuarioSelecionado.cidade || '—' }}
                  {{ usuarioSelecionado.uf ? ' — ' + usuarioSelecionado.uf : '' }}
                </span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Nascimento</span>
                <span class="modal-val">
                  {{ formatarData(usuarioSelecionado.dataNascimento) || '—' }}
                  <span v-if="usuarioSelecionado.dataNascimento">
                    · {{ usuarioSelecionado.idade || calcIdade(usuarioSelecionado.dataNascimento) }} anos
                  </span>
                </span>
              </div>

              <div class="modal-row" v-if="usuarioSelecionado.telefone">
                <span class="modal-label">WhatsApp</span>
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

            <div class="modal-section">
              <div class="modal-section-title">Agenda</div>

              <div class="modal-row">
                <span class="modal-label">Tem atividades?</span>
                <span class="modal-val">{{ usuarioSelecionado.possuiAtividadesExtras ? 'Sim' : 'Não' }}</span>
              </div>

              <div class="modal-row" v-if="usuarioSelecionado.categorias.length">
                <span class="modal-label">Categorias</span>
                <span class="modal-val">{{ usuarioSelecionado.categorias.join(', ') }}</span>
              </div>

              <div class="modal-row" v-if="usuarioSelecionado.oficinas.length">
                <span class="modal-label">Oficinas</span>
                <span class="modal-val">{{ usuarioSelecionado.oficinas.join(', ') }}</span>
              </div>

              <div class="modal-row" v-if="usuarioSelecionado.exposicoes.length">
                <span class="modal-label">Exposições</span>
                <span class="modal-val">{{ usuarioSelecionado.exposicoes.join(', ') }}</span>
              </div>

              <div class="modal-row" v-if="usuarioSelecionado.palestras.length">
                <span class="modal-label">Palestras</span>
                <span class="modal-val">{{ usuarioSelecionado.palestras.join(', ') }}</span>
              </div>

              <div class="modal-row" v-if="!temAtividades(usuarioSelecionado)">
                <span class="modal-label">Atividades</span>
                <span class="modal-val">Acesso geral ao evento</span>
              </div>
            </div>

            <!-- STATUS OFICINAS DO USUÁRIO -->
            <div class="modal-section" v-if="usuarioSelecionado.oficinas.length">
              <div class="modal-section-title">Status nas oficinas</div>

              <div
                v-for="ofStr in usuarioSelecionado.oficinas"
                :key="ofStr"
                class="modal-row"
              >
                <span class="modal-label" style="max-width:55%;font-size:0.76rem">{{ parsearOficina(ofStr).nome }} · {{ parsearOficina(ofStr).data }}</span>
                <span
                  class="status-oficina-pill"
                  :class="getStatusOficinaUsuarioByStr(usuarioSelecionado, ofStr) === 'confirmado' ? 'sop-confirmado' : 'sop-reserva'"
                >
                  {{ getStatusOficinaUsuarioByStr(usuarioSelecionado, ofStr) === 'confirmado' ? '✓ Confirmado' : '⏳ Reserva' }}
                </span>
              </div>
            </div>

            <div class="modal-section">
              <div class="modal-section-title">Controle</div>

              <div class="modal-row">
                <span class="modal-label">Status</span>
                <span class="modal-val">{{ usuarioSelecionado.status || 'confirmada' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Origem</span>
                <span class="modal-val">{{ usuarioSelecionado.origem || '—' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Criado em</span>
                <span class="modal-val">{{ formatarDataHora(usuarioSelecionado.criadoEm) || '—' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Termos</span>
                <span class="modal-val">{{ usuarioSelecionado.aceitouTermos ? 'Aceitos' : 'Não informado' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-action blue" type="button" @click="modalUsuarioAberto = false">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL AVALIAÇÃO -->
    <Transition name="fade">
      <div v-if="modalAvaliacaoAberto" class="modal-overlay" @click.self="modalAvaliacaoAberto = false">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-avatar" :class="{ anonymous: avaliacaoSelecionada?.anonimo }">
              {{ avaliacaoSelecionada?.anonimo ? 'A' : getInitials(avaliacaoSelecionada?.nome) }}
            </div>

            <div class="modal-info">
              <h2 class="modal-name">
                {{ avaliacaoSelecionada?.anonimo ? 'Avaliação anônima' : avaliacaoSelecionada?.nome }}
              </h2>

              <div class="modal-badges">
                <span class="id-chip">{{ avaliacaoSelecionada?.idAvaliacao }}</span>
                <span class="badge-review" :class="'review-' + avaliacaoSelecionada?.tipo">
                  {{ avaliacaoSelecionada?.tipoLabel }}
                </span>
                <span class="score-pill" :class="getScoreClass(avaliacaoSelecionada?.notaGeral)">
                  {{ avaliacaoSelecionada?.notaGeral }}/10
                </span>
              </div>
            </div>

            <button class="modal-close-btn" type="button" @click="modalAvaliacaoAberto = false">
              ×
            </button>
          </div>

          <div class="modal-body" v-if="avaliacaoSelecionada">
            <div class="modal-section">
              <div class="modal-section-title">Avaliação</div>

              <div class="modal-row">
                <span class="modal-label">Tipo</span>
                <span class="modal-val">{{ avaliacaoSelecionada.tipoLabel }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Atividade</span>
                <span class="modal-val">{{ avaliacaoSelecionada.atividadeTitulo || '—' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Nota geral</span>
                <span class="modal-val">{{ avaliacaoSelecionada.notaGeral }}/10</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Identificação</span>
                <span class="modal-val">{{ avaliacaoSelecionada.modoIdentificacaoLabel }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Data</span>
                <span class="modal-val">{{ formatarDataHora(avaliacaoSelecionada.criadoEm) || '—' }}</span>
              </div>
            </div>

            <div class="modal-section">
              <div class="modal-section-title">Aspectos</div>

              <div class="aspect-detail">
                <div>
                  <span>Organização</span>
                  <strong>{{ avaliacaoSelecionada.aspectos.organizacao || 0 }}/5</strong>
                </div>

                <div>
                  <span>Estrutura</span>
                  <strong>{{ avaliacaoSelecionada.aspectos.estrutura || 0 }}/5</strong>
                </div>

                <div>
                  <span>Conteúdo</span>
                  <strong>{{ avaliacaoSelecionada.aspectos.conteudo || 0 }}/5</strong>
                </div>

                <div>
                  <span>Atendimento</span>
                  <strong>{{ avaliacaoSelecionada.aspectos.atendimento || 0 }}/5</strong>
                </div>
              </div>
            </div>

            <div class="modal-section">
              <div class="modal-section-title">Comentário</div>

              <p class="comment-box">
                {{ avaliacaoSelecionada.comentario || 'O participante não deixou comentário.' }}
              </p>
            </div>

            <div class="modal-section">
              <div class="modal-section-title">Controle</div>

              <div class="modal-row">
                <span class="modal-label">Status</span>
                <span class="modal-val">{{ avaliacaoSelecionada.status || 'recebida' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Origem</span>
                <span class="modal-val">{{ avaliacaoSelecionada.origem || '—' }}</span>
              </div>

              <div class="modal-row">
                <span class="modal-label">Autorizou uso</span>
                <span class="modal-val">{{ avaliacaoSelecionada.autorizouUso ? 'Sim' : 'Não informado' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-action blue" type="button" @click="modalAvaliacaoAberto = false">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy, updateDoc, doc, setDoc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const router = useRouter()

// ─────────────────────────────────────────────────────
// STATE — Dados principais
// ─────────────────────────────────────────────────────
const usuariosOrdenados = ref([])
const avaliacoesOrdenadas = ref([])

const loadingUsuarios = ref(false)
const loadingAvaliacoes = ref(false)
const erroUsuarios = ref('')
const erroAvaliacoes = ref('')
const atualizadoEm = ref('')

// ─────────────────────────────────────────────────────
// STATE — Filtros / Busca / Paginação USUÁRIOS
// ─────────────────────────────────────────────────────
const filtroUsuarioTipo = ref('todos')
const buscaUsuarios = ref('')
const sortUsuarioCol = ref('nomeCompleto')
const sortUsuarioDir = ref(1)
const paginaUsuarios = ref(1)
const itensPorPaginaUsuarios = ref(20)

// ─────────────────────────────────────────────────────
// STATE — Filtros / Busca / Paginação AVALIAÇÕES
// ─────────────────────────────────────────────────────
const filtroAvaliacaoTipo = ref('todos')
const filtroAvaliacaoIdentificacao = ref('todos')
const filtroAvaliacaoNota = ref('todas')
const buscaAvaliacoes = ref('')
const sortAvaliacaoCol = ref('criadoEmMs')
const sortAvaliacaoDir = ref(-1)
const paginaAvaliacoes = ref(1)
const itensPorPaginaAvaliacoes = ref(10)

// ─────────────────────────────────────────────────────
// STATE — Modais
// ─────────────────────────────────────────────────────
const modalUsuarioAberto = ref(false)
const usuarioSelecionado = ref(null)
const modalAvaliacaoAberto = ref(false)
const avaliacaoSelecionada = ref(null)

// ─────────────────────────────────────────────────────
// STATE — Gestão de Oficinas
// ─────────────────────────────────────────────────────
const modalOficinaGestaoAberto = ref(false)
const oficinaSelecionadaGestao = ref(null)
const buscaOficinas = ref('')
const filtroOficinaStatus = ref('todas')
const updatingOficinaStatus = ref({})

// Mapa de professores: { nomeDaOficina: 'Nome do Professor' }
// Carregado/salvo no Firestore em config_salip2/professores
const professoresMap = ref({})
const editandoProfessorOficina = ref(null)
const novoProfessorNome = ref('')

// ─────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────
const COLORS = {
  aluno: { bg: '#2563eb', light: '#dbeafe', text: '#1e40af' },
  funcionario: { bg: '#16a34a', light: '#dcfce7', text: '#166534' },
  visitante: { bg: '#d97706', light: '#fef3c7', text: '#92400e' },
  outro: { bg: '#64748b', light: '#f1f5f9', text: '#334155' },
}

const filtrosUsuarios = [
  { label: 'Todos', value: 'todos' },
  { label: 'Alunos', value: 'aluno' },
  { label: 'Funcionários', value: 'funcionario' },
  { label: 'Visitantes', value: 'visitante' },
]

// ─────────────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────────────
onMounted(async () => {
  await carregarTudo()
})

// ─────────────────────────────────────────────────────
// CARREGAMENTO
// ─────────────────────────────────────────────────────
async function carregarTudo() {
  await Promise.all([carregarInscricoes(), carregarAvaliacoes(), carregarProfessores()])
  atualizadoEm.value = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

async function carregarInscricoes() {
  loadingUsuarios.value = true
  erroUsuarios.value = ''
  try {
    const q = query(collection(db, 'inscricoes_salip2'), orderBy('controle.criadoEm', 'desc'))
    const snapshot = await getDocs(q)
    usuariosOrdenados.value = snapshot.docs
      .map((documento) => normalizarUsuario(documento.id, documento.data()))
      .sort((a, b) => getTimestampMs(b.criadoEm) - getTimestampMs(a.criadoEm))
  } catch (err) {
    console.error('Erro ao carregar inscrições:', err)
    erroUsuarios.value = 'Não foi possível carregar as inscrições.'
  } finally {
    loadingUsuarios.value = false
  }
}

async function carregarAvaliacoes() {
  loadingAvaliacoes.value = true
  erroAvaliacoes.value = ''
  try {
    const q = query(collection(db, 'avaliacoes_salip2'), orderBy('controle.criadoEm', 'desc'))
    const snapshot = await getDocs(q)
    avaliacoesOrdenadas.value = snapshot.docs
      .map((documento) => normalizarAvaliacao(documento.id, documento.data()))
      .sort((a, b) => getTimestampMs(b.criadoEm) - getTimestampMs(a.criadoEm))
  } catch (err) {
    console.error('Erro ao carregar avaliações:', err)
    erroAvaliacoes.value = 'Não foi possível carregar as avaliações.'
  } finally {
    loadingAvaliacoes.value = false
  }
}

async function carregarProfessores() {
  try {
    const docRef = doc(db, 'config_salip2', 'professores')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      professoresMap.value = docSnap.data() || {}
    }
  } catch (err) {
    // Silently ignore: pode não existir ainda
    console.warn('config_salip2/professores não encontrado.')
  }
}

async function salvarProfessoresFirestore() {
  try {
    await setDoc(doc(db, 'config_salip2', 'professores'), professoresMap.value)
  } catch (err) {
    console.error('Erro ao salvar professores:', err)
  }
}

// ─────────────────────────────────────────────────────
// NORMALIZAÇÃO
// ─────────────────────────────────────────────────────
function normalizarUsuario(idDocumento, data) {
  const participante = data.participante || {}
  const agenda = data.agenda || {}
  const consentimento = data.consentimento || {}
  const controle = data.controle || {}

  return {
    id: idDocumento,
    idUsuario: data.idUsuario || idDocumento,

    tipoParticipante: participante.tipo || data.tipoParticipante || 'visitante',
    tipoLabel: participante.tipoLabel || formatarTipoUsuario(participante.tipo || data.tipoParticipante),

    nomeCompleto: participante.nomeCompleto || data.nomeCompleto || '',
    primeiroNome: participante.primeiroNome || '',
    cidade: participante.cidade || data.cidade || '',
    uf: participante.uf || data.uf || '',
    dataNascimento: participante.dataNascimento || data.dataNascimento || '',
    idade: participante.idade || data.idade || '',
    escola: participante.escola || data.escola || '',
    localTrabalho: participante.localTrabalho || data.localTrabalho || '',
    telefone: participante.telefone || data.telefone || '',

    possuiAtividadesExtras: Boolean(agenda.possuiAtividadesExtras),
    categorias: Array.isArray(agenda.categorias) ? agenda.categorias : [],
    oficinas: Array.isArray(agenda.oficinas) ? agenda.oficinas : [],
    exposicoes: Array.isArray(agenda.exposicoes) ? agenda.exposicoes : [],
    palestras: Array.isArray(agenda.palestras) ? agenda.palestras : [],

    aceitouTermos: Boolean(consentimento.aceitouTermos),
    aceitoEm: consentimento.aceitoEm || null,

    status: controle.status || 'confirmada',
    origem: controle.origem || '',
    criadoEm: controle.criadoEm || data.criadoEm || null,
    atualizadoEm: controle.atualizadoEm || data.atualizadoEm || null,

    // ← NOVO: status manual por oficina
    vagasOficinas: controle.vagasOficinas || {},

    raw: data,
  }
}

function normalizarAvaliacao(idDocumento, data) {
  const participante = data.participante || {}
  const avaliacao = data.avaliacao || {}
  const aspectos = data.aspectos || {}
  const controle = data.controle || {}
  const anonimo = Boolean(participante.anonimo)

  return {
    id: idDocumento,
    idAvaliacao: data.idAvaliacao || idDocumento,

    nome: anonimo ? '' : participante.nome || '',
    anonimo,
    modoIdentificacao: participante.modoIdentificacao || (anonimo ? 'anonima' : 'identificada'),
    modoIdentificacaoLabel: anonimo ? 'Anônima' : 'Identificada',

    tipo: avaliacao.tipo || '',
    tipoLabel: avaliacao.tipoLabel || formatarTipoAvaliacao(avaliacao.tipo),
    atividadeId: avaliacao.atividadeId || '',
    atividadeTitulo: avaliacao.atividadeTitulo || '',
    notaGeral: Number(avaliacao.notaGeral || 0),
    comentario: avaliacao.comentario || '',
    autorizouUso: Boolean(avaliacao.autorizouUso),

    aspectos: {
      organizacao: Number(aspectos.organizacao || 0),
      estrutura: Number(aspectos.estrutura || 0),
      conteudo: Number(aspectos.conteudo || 0),
      atendimento: Number(aspectos.atendimento || 0),
    },

    mediaAspectos: Number(aspectos.mediaAspectos || calcularMedia([
      aspectos.organizacao, aspectos.estrutura, aspectos.conteudo, aspectos.atendimento,
    ])),

    status: controle.status || 'recebida',
    origem: controle.origem || '',
    criadoEm: controle.criadoEm || null,
    criadoEmMs: getTimestampMs(controle.criadoEm),
    atualizadoEm: controle.atualizadoEm || null,

    raw: data,
  }
}

// ─────────────────────────────────────────────────────
// PARSE DE OFICINAS
// ─────────────────────────────────────────────────────
// Formato: "08/05 • Sexta • 08h00 • Oficina de Pintura a Óleo • 3 vagas • Praça Domingos Mourão Filho"
function parsearOficina(str) {
  const partes = str.split('•').map((p) => p.trim())
  const vagasParte = partes.find((p) => /vagas?/i.test(p)) || ''
  const vagasNum = parseInt(vagasParte.match(/\d+/)?.[0] || '0')

  // Encontrar o índice da parte de vagas para pegar o local corretamente
  const idxVagas = partes.findIndex((p) => /vagas?/i.test(p))
  const local = idxVagas >= 0 && partes[idxVagas + 1] ? partes[idxVagas + 1] : (partes[5] || partes[4] || '')

  return {
    raw: str,
    key: str,
    data: partes[0] || '',
    diaSemana: partes[1] || '',
    horario: partes[2] || '',
    nome: partes[3] || str,
    vagasStr: vagasParte,
    vagas: vagasNum,
    local,
  }
}

// ─────────────────────────────────────────────────────
// COMPUTED — Oficinas com alunos
// ─────────────────────────────────────────────────────
const todasOficinasParsed = computed(() => {
  const map = {}
  usuariosOrdenados.value.forEach((u) => {
    ;(u.oficinas || []).forEach((ofStr) => {
      if (!map[ofStr]) {
        map[ofStr] = { ...parsearOficina(ofStr), alunos: [] }
      }
      map[ofStr].alunos.push(u)
    })
  })

  // Ordenar alunos pela data de inscrição (mais antigo primeiro = prioridade)
  Object.values(map).forEach((of) => {
    of.alunos.sort((a, b) => getTimestampMs(a.criadoEm) - getTimestampMs(b.criadoEm))
  })

  return Object.values(map).sort((a, b) => {
    if (a.data !== b.data) return a.data.localeCompare(b.data)
    return a.horario.localeCompare(b.horario)
  })
})

const oficinasFiltradasGestao = computed(() => {
  let data = todasOficinasParsed.value
  const busca = normalizarBusca(buscaOficinas.value)

  if (busca) {
    data = data.filter((of) =>
      normalizarBusca([of.nome, of.data, of.diaSemana, of.local, of.horario].join(' ')).includes(busca)
    )
  }

  if (filtroOficinaStatus.value === 'com_reserva') {
    data = data.filter((of) => getReserva(of) > 0)
  } else if (filtroOficinaStatus.value === 'vagas_disponiveis') {
    data = data.filter((of) => getConfirmados(of) < of.vagas)
  } else if (filtroOficinaStatus.value === 'lotada') {
    data = data.filter((of) => getConfirmados(of) >= of.vagas)
  }

  return data
})

// KPIs Oficinas
const totalInscricoesOficinas = computed(() =>
  todasOficinasParsed.value.reduce((acc, of) => acc + of.alunos.length, 0)
)

const totalConfirmadosOficinas = computed(() =>
  todasOficinasParsed.value.reduce((acc, of) => acc + getConfirmados(of), 0)
)

const totalReservaOficinas = computed(() =>
  todasOficinasParsed.value.reduce((acc, of) => acc + getReserva(of), 0)
)

const totalVagasOficinas = computed(() =>
  todasOficinasParsed.value.reduce((acc, of) => acc + of.vagas, 0)
)

// ─────────────────────────────────────────────────────
// MÉTODOS — Oficinas: Status
// ─────────────────────────────────────────────────────

// Hash simples para gerar chave de loading sem caracteres problemáticos
function hashStr(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

function getLoadingKey(usuario, oficina) {
  return `${usuario.idUsuario}_${hashStr(oficina.key)}`
}

// Retorna status de um usuário em uma oficina (objeto)
function getStatusOficinaUsuario(usuario, oficina) {
  // Override manual do admin tem prioridade
  const override = usuario.vagasOficinas?.[oficina.key]
  if (override) return override

  // Automático: posição na fila vs vagas disponíveis
  const idx = oficina.alunos.findIndex((a) => a.idUsuario === usuario.idUsuario)
  if (idx === -1) return 'reserva'
  return idx < oficina.vagas ? 'confirmado' : 'reserva'
}

// Retorna status de um usuário dado o string da oficina (para modal de usuário)
function getStatusOficinaUsuarioByStr(usuario, ofStr) {
  const override = usuario.vagasOficinas?.[ofStr]
  if (override) return override

  // Buscar a oficina no computed
  const of = todasOficinasParsed.value.find((o) => o.key === ofStr)
  if (!of) return 'reserva'

  const idx = of.alunos.findIndex((a) => a.idUsuario === usuario.idUsuario)
  if (idx === -1) return 'reserva'
  return idx < of.vagas ? 'confirmado' : 'reserva'
}

// Conta confirmados em uma oficina
function getConfirmados(oficina) {
  return oficina.alunos.filter((u) => getStatusOficinaUsuario(u, oficina) === 'confirmado').length
}

// Conta reserva em uma oficina
function getReserva(oficina) {
  return oficina.alunos.filter((u) => getStatusOficinaUsuario(u, oficina) === 'reserva').length
}

// Altera status manualmente (persiste no Firestore)
async function toggleStatusOficinaUsuario(usuario, oficina, novoStatus) {
  const key = getLoadingKey(usuario, oficina)
  updatingOficinaStatus.value = { ...updatingOficinaStatus.value, [key]: true }

  try {
    const userRef = doc(db, 'inscricoes_salip2', usuario.id)
    const currentVagas = { ...(usuario.vagasOficinas || {}) }
    currentVagas[oficina.key] = novoStatus

    await updateDoc(userRef, { 'controle.vagasOficinas': currentVagas })

    // Atualizar local (reativo)
    const userInList = usuariosOrdenados.value.find((u) => u.id === usuario.id)
    if (userInList) userInList.vagasOficinas = { ...currentVagas }
    usuario.vagasOficinas = { ...currentVagas }
  } catch (err) {
    console.error('Erro ao atualizar status da oficina:', err)
  } finally {
    const updated = { ...updatingOficinaStatus.value }
    delete updated[key]
    updatingOficinaStatus.value = updated
  }
}

// Remove override manual (volta ao automático)
async function resetarStatusOficinaUsuario(usuario, oficina) {
  const key = getLoadingKey(usuario, oficina)
  updatingOficinaStatus.value = { ...updatingOficinaStatus.value, [key]: true }

  try {
    const userRef = doc(db, 'inscricoes_salip2', usuario.id)
    const currentVagas = { ...(usuario.vagasOficinas || {}) }
    delete currentVagas[oficina.key]

    await updateDoc(userRef, { 'controle.vagasOficinas': currentVagas })

    const userInList = usuariosOrdenados.value.find((u) => u.id === usuario.id)
    if (userInList) userInList.vagasOficinas = { ...currentVagas }
    usuario.vagasOficinas = { ...currentVagas }
  } catch (err) {
    console.error('Erro ao resetar status da oficina:', err)
  } finally {
    const updated = { ...updatingOficinaStatus.value }
    delete updated[key]
    updatingOficinaStatus.value = updated
  }
}

// ─────────────────────────────────────────────────────
// MÉTODOS — Professores
// ─────────────────────────────────────────────────────
function iniciarEdicaoProfessor(nomeOficina) {
  editandoProfessorOficina.value = nomeOficina
  novoProfessorNome.value = professoresMap.value[nomeOficina] || ''
}

async function salvarProfessor(nomeOficina) {
  const nome = novoProfessorNome.value.trim()
  if (nome) {
    professoresMap.value = { ...professoresMap.value, [nomeOficina]: nome }
  } else {
    const updated = { ...professoresMap.value }
    delete updated[nomeOficina]
    professoresMap.value = updated
  }
  editandoProfessorOficina.value = null
  novoProfessorNome.value = ''
  await salvarProfessoresFirestore()
}

// ─────────────────────────────────────────────────────
// MÉTODOS — Modais
// ─────────────────────────────────────────────────────
function abrirModalOficinaGestao(oficina) {
  oficinaSelecionadaGestao.value = oficina
  modalOficinaGestaoAberto.value = true
}

function abrirModalUsuario(usuario) {
  usuarioSelecionado.value = usuario
  modalUsuarioAberto.value = true
}

function abrirModalAvaliacao(avaliacao) {
  avaliacaoSelecionada.value = avaliacao
  modalAvaliacaoAberto.value = true
}

// ─────────────────────────────────────────────────────
// COMPUTED — USUÁRIOS
// ─────────────────────────────────────────────────────
const totalAlunos = computed(() => usuariosOrdenados.value.filter((u) => u.tipoParticipante === 'aluno').length)
const totalFuncionarios = computed(() => usuariosOrdenados.value.filter((u) => u.tipoParticipante === 'funcionario').length)
const totalVisitantes = computed(() => usuariosOrdenados.value.filter((u) => u.tipoParticipante === 'visitante').length)

const kpiCards = computed(() => {
  const total = usuariosOrdenados.value.length || 1
  return [
    {
      tipo: 'todos', label: 'Total geral', count: usuariosOrdenados.value.length, pct: 100, color: '#3b82f6',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    },
    {
      tipo: 'aluno', label: 'Alunos', count: totalAlunos.value,
      pct: Math.round((totalAlunos.value / total) * 100), color: COLORS.aluno.bg,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    },
    {
      tipo: 'funcionario', label: 'Funcionários', count: totalFuncionarios.value,
      pct: Math.round((totalFuncionarios.value / total) * 100), color: COLORS.funcionario.bg,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    },
    {
      tipo: 'visitante', label: 'Visitantes', count: totalVisitantes.value,
      pct: Math.round((totalVisitantes.value / total) * 100), color: COLORS.visitante.bg,
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
    },
  ]
})

const usuariosFiltrados = computed(() => {
  let data = filtroUsuarioTipo.value === 'todos'
    ? usuariosOrdenados.value
    : usuariosOrdenados.value.filter((u) => u.tipoParticipante === filtroUsuarioTipo.value)

  const busca = normalizarBusca(buscaUsuarios.value)
  if (busca) {
    data = data.filter((u) => {
      const texto = normalizarBusca([
        u.idUsuario, u.nomeCompleto, u.cidade, u.uf, u.tipoParticipante,
        u.escola, u.localTrabalho, u.telefone, resumoAtividades(u), u.status,
      ].join(' '))
      return texto.includes(busca)
    })
  }

  return [...data].sort((a, b) => {
    const va = normalizarBusca(a[sortUsuarioCol.value] || '')
    const vb = normalizarBusca(b[sortUsuarioCol.value] || '')
    return sortUsuarioDir.value * va.localeCompare(vb)
  })
})

const totalPaginasUsuarios = computed(() => Math.ceil(usuariosFiltrados.value.length / itensPorPaginaUsuarios.value))
const usuariosPaginados = computed(() => {
  const start = (paginaUsuarios.value - 1) * itensPorPaginaUsuarios.value
  return usuariosFiltrados.value.slice(start, start + itensPorPaginaUsuarios.value)
})
const paginasUsuariosVisiveis = computed(() => {
  const total = totalPaginasUsuarios.value
  const atual = paginaUsuarios.value
  const pages = []
  for (let p = Math.max(1, atual - 2); p <= Math.min(total, atual + 2); p++) pages.push(p)
  return pages
})

const statsPorUF = computed(() => {
  const entries = countBy(usuariosOrdenados.value, 'uf')
  const max = entries[0]?.[1] || 1
  const total = usuariosOrdenados.value.length || 1
  return entries.slice(0, 8).map(([label, count]) => ({
    label, count,
    pct: Math.round((count / total) * 100),
    barPct: Math.round((count / max) * 100),
  }))
})

const statsEventos = computed(() => {
  const map = {}
  usuariosOrdenados.value.forEach((u) => {
    ;[...u.categorias, ...u.oficinas, ...u.exposicoes, ...u.palestras].forEach((a) => {
      if (a) map[a] = (map[a] || 0) + 1
    })
  })
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = entries[0]?.[1] || 1
  const total = usuariosOrdenados.value.length || 1
  return entries.map(([label, count]) => ({
    label, count,
    pct: Math.round((count / total) * 100),
    barPct: Math.round((count / max) * 100),
  }))
})

const statsInstituicoes = computed(() => {
  const map = {}
  usuariosOrdenados.value.forEach((u) => {
    const inst = u.escola || u.localTrabalho
    if (inst) map[inst] = (map[inst] || 0) + 1
  })
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = entries[0]?.[1] || 1
  const total = usuariosOrdenados.value.length || 1
  return entries.map(([label, count]) => ({
    label, count,
    pct: Math.round((count / total) * 100),
    barPct: Math.round((count / max) * 100),
  }))
})

// ─────────────────────────────────────────────────────
// COMPUTED — AVALIAÇÕES
// ─────────────────────────────────────────────────────
const avaliacoesFiltradas = computed(() => {
  let data = [...avaliacoesOrdenadas.value]

  if (filtroAvaliacaoTipo.value !== 'todos') data = data.filter((a) => a.tipo === filtroAvaliacaoTipo.value)
  if (filtroAvaliacaoIdentificacao.value !== 'todos') data = data.filter((a) => a.modoIdentificacao === filtroAvaliacaoIdentificacao.value)
  if (filtroAvaliacaoNota.value === 'baixas') data = data.filter((a) => a.notaGeral >= 1 && a.notaGeral <= 6)
  if (filtroAvaliacaoNota.value === 'boas') data = data.filter((a) => a.notaGeral >= 7 && a.notaGeral <= 8)
  if (filtroAvaliacaoNota.value === 'excelentes') data = data.filter((a) => a.notaGeral >= 9)

  const busca = normalizarBusca(buscaAvaliacoes.value)
  if (busca) {
    data = data.filter((a) => {
      const texto = normalizarBusca([a.idAvaliacao, a.nome, a.tipoLabel, a.atividadeTitulo, a.comentario, a.status].join(' '))
      return texto.includes(busca)
    })
  }

  data.sort((a, b) => {
    const va = a[sortAvaliacaoCol.value]
    const vb = b[sortAvaliacaoCol.value]
    if (typeof va === 'number' && typeof vb === 'number') return sortAvaliacaoDir.value * (va - vb)
    return sortAvaliacaoDir.value * String(va || '').localeCompare(String(vb || ''))
  })

  return data
})

const totalPaginasAvaliacoes = computed(() => Math.ceil(avaliacoesFiltradas.value.length / itensPorPaginaAvaliacoes.value))
const avaliacoesPaginadas = computed(() => {
  const start = (paginaAvaliacoes.value - 1) * itensPorPaginaAvaliacoes.value
  return avaliacoesFiltradas.value.slice(start, start + itensPorPaginaAvaliacoes.value)
})
const paginasAvaliacoesVisiveis = computed(() => {
  const total = totalPaginasAvaliacoes.value
  const atual = paginaAvaliacoes.value
  const pages = []
  for (let p = Math.max(1, atual - 2); p <= Math.min(total, atual + 2); p++) pages.push(p)
  return pages
})

const mediaGeralAvaliacoes = computed(() => {
  const notas = avaliacoesOrdenadas.value.map((a) => Number(a.notaGeral || 0)).filter((n) => n > 0)
  if (!notas.length) return '0.0'
  return (notas.reduce((acc, n) => acc + n, 0) / notas.length).toFixed(1)
})

const totalAvaliacoesAnonimas = computed(() => avaliacoesOrdenadas.value.filter((a) => a.anonimo).length)
const totalAvaliacoesComComentario = computed(() => avaliacoesOrdenadas.value.filter((a) => a.comentario).length)
const pctAvaliacoesAnonimas = computed(() => {
  if (!avaliacoesOrdenadas.value.length) return 0
  return Math.round((totalAvaliacoesAnonimas.value / avaliacoesOrdenadas.value.length) * 100)
})
const pctAvaliacoesComComentario = computed(() => {
  if (!avaliacoesOrdenadas.value.length) return 0
  return Math.round((totalAvaliacoesComComentario.value / avaliacoesOrdenadas.value.length) * 100)
})

// ─────────────────────────────────────────────────────
// WATCHERS
// ─────────────────────────────────────────────────────
watch([filtroUsuarioTipo, buscaUsuarios, itensPorPaginaUsuarios], () => { paginaUsuarios.value = 1 })
watch([filtroAvaliacaoTipo, filtroAvaliacaoIdentificacao, filtroAvaliacaoNota, buscaAvaliacoes, itensPorPaginaAvaliacoes], () => { paginaAvaliacoes.value = 1 })
watch([buscaOficinas, filtroOficinaStatus], () => {})

// ─────────────────────────────────────────────────────
// SORT
// ─────────────────────────────────────────────────────
function toggleSortUsuario(col) {
  if (sortUsuarioCol.value === col) sortUsuarioDir.value *= -1
  else { sortUsuarioCol.value = col; sortUsuarioDir.value = 1 }
}

function toggleSortAvaliacao(col) {
  if (sortAvaliacaoCol.value === col) sortAvaliacaoDir.value *= -1
  else { sortAvaliacaoCol.value = col; sortAvaliacaoDir.value = 1 }
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────
function countBy(arr, key) {
  const map = {}
  arr.forEach((item) => { const v = item[key]; if (v) map[v] = (map[v] || 0) + 1 })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

function getColor(tipo) { return COLORS[tipo] || COLORS.outro }

function getInitials(name) {
  return String(name || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}

function calcIdade(dob) {
  if (!dob) return ''
  const d = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
  return age
}

function temAtividades(u) {
  return Boolean(u?.categorias?.length || u?.oficinas?.length || u?.exposicoes?.length || u?.palestras?.length)
}

function resumoAtividades(u) {
  const items = []
  if (u.oficinas?.length) items.push(`${u.oficinas.length} oficina(s)`)
  if (u.exposicoes?.length) items.push(`${u.exposicoes.length} exposição(ões)`)
  if (u.palestras?.length) items.push(`${u.palestras.length} palestra(s)`)
  return items.length ? items.join(' · ') : 'Acesso geral'
}

function formatarTipoUsuario(tipo) {
  return { aluno: 'Aluno', funcionario: 'Funcionário', visitante: 'Visitante', todos: 'Todos' }[tipo] || 'Outro'
}

function formatarTipoAvaliacao(tipo) {
  return { evento_geral: 'Evento geral', oficina: 'Oficina', palestra: 'Palestra', exposicao: 'Exposição' }[tipo] || 'Avaliação'
}

function getScoreClass(score) {
  if (score <= 6) return 'score-low'
  if (score <= 8) return 'score-good'
  return 'score-high'
}

function calcularMedia(valores) {
  const nums = valores.map(Number).filter((v) => v > 0)
  if (!nums.length) return 0
  return Number((nums.reduce((acc, v) => acc + v, 0) / nums.length).toFixed(1))
}

function formatarData(data) {
  if (!data) return ''
  if (typeof data === 'string' && data.includes('-')) {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }
  return data
}

function formatarDataHora(valor) {
  if (!valor) return ''
  try {
    let data
    if (valor?.toDate) data = valor.toDate()
    else if (valor instanceof Date) data = valor
    else data = new Date(valor)
    if (Number.isNaN(data.getTime())) return ''
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

function getTimestampMs(valor) {
  if (!valor) return 0
  if (valor?.toMillis) return valor.toMillis()
  if (valor?.toDate) return valor.toDate().getTime()
  if (valor instanceof Date) return valor.getTime()
  const data = new Date(valor)
  return Number.isNaN(data.getTime()) ? 0 : data.getTime()
}

function normalizarBusca(valor) {
  return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

// ─────────────────────────────────────────────────────
// EXPORTAÇÕES — USUÁRIOS
// ─────────────────────────────────────────────────────
function montarLinhasUsuarios() {
  return usuariosFiltrados.value.map((u) => ({
    ID: u.idUsuario || '',
    Nome: u.nomeCompleto || '',
    Tipo: formatarTipoUsuario(u.tipoParticipante),
    Cidade: u.cidade || '',
    UF: u.uf || '',
    Idade: u.idade || calcIdade(u.dataNascimento) || '',
    Nascimento: formatarData(u.dataNascimento) || '',
    Escola: u.escola || '',
    Trabalho: u.localTrabalho || '',
    Telefone: u.telefone || '',
    Categorias: u.categorias.join(', '),
    Oficinas: u.oficinas.join(', '),
    Exposicoes: u.exposicoes.join(', '),
    Palestras: u.palestras.join(', '),
    AtividadesResumo: resumoAtividades(u),
    Status: u.status || 'confirmada',
    Origem: u.origem || '',
    AceitouTermos: u.aceitouTermos ? 'Sim' : 'Não',
    CriadoEm: formatarDataHora(u.criadoEm),
  }))
}

function baixarExcelUsuarios() {
  baixarExcelGenerico(montarLinhasUsuarios(), 'Inscritos SALIP2', `inscritos-salip2-${dataArquivo()}.xlsx`)
}

function baixarCSVUsuarios() {
  baixarCSVGenerico(montarLinhasUsuarios(), `inscritos-salip2-${dataArquivo()}.csv`)
}

// ─────────────────────────────────────────────────────
// EXPORTAÇÕES — AVALIAÇÕES
// ─────────────────────────────────────────────────────
function montarLinhasAvaliacoes() {
  return avaliacoesFiltradas.value.map((a) => ({
    ID: a.idAvaliacao,
    Data: formatarDataHora(a.criadoEm),
    Identificacao: a.modoIdentificacaoLabel,
    Nome: a.anonimo ? '' : a.nome,
    Tipo: a.tipoLabel,
    Atividade: a.atividadeTitulo,
    NotaGeral: a.notaGeral,
    Organizacao: a.aspectos.organizacao,
    Estrutura: a.aspectos.estrutura,
    Conteudo: a.aspectos.conteudo,
    Atendimento: a.aspectos.atendimento,
    MediaAspectos: a.mediaAspectos,
    Comentario: a.comentario,
    AutorizouUso: a.autorizouUso ? 'Sim' : 'Não',
    Status: a.status,
    Origem: a.origem,
  }))
}

function baixarExcelAvaliacoes() {
  baixarExcelGenerico(montarLinhasAvaliacoes(), 'Avaliacoes SALIP2', `avaliacoes-salip2-${dataArquivo()}.xlsx`)
}

function baixarCSVAvaliacoes() {
  baixarCSVGenerico(montarLinhasAvaliacoes(), `avaliacoes-salip2-${dataArquivo()}.csv`)
}

// ─────────────────────────────────────────────────────
// EXPORTAÇÕES — OFICINAS
// ─────────────────────────────────────────────────────
function montarLinhasOficina(oficina) {
  return oficina.alunos.map((u, idx) => {
    const status = getStatusOficinaUsuario(u, oficina)
    const manual = Boolean(u.vagasOficinas?.[oficina.key])
    return {
      Posicao: idx + 1,
      Status: status === 'confirmado' ? 'Confirmado' : 'Reserva',
      StatusManual: manual ? 'Sim (alterado pelo admin)' : 'Não (automático)',
      Nome: u.nomeCompleto || '',
      Tipo: formatarTipoUsuario(u.tipoParticipante),
      Escola: u.escola || u.localTrabalho || '',
      Cidade: u.cidade || '',
      UF: u.uf || '',
      Telefone: u.telefone || '',
      CriadoEm: formatarDataHora(u.criadoEm),
    }
  })
}

function baixarExcelOficina(oficina) {
  if (!oficina) return
  const nomeArq = normalizarBusca(oficina.nome).replace(/\s+/g, '-').substring(0, 30)
  baixarExcelGenerico(
    montarLinhasOficina(oficina),
    oficina.nome.substring(0, 31),
    `oficina-${nomeArq}-${oficina.data.replace('/', '-')}-${dataArquivo()}.xlsx`
  )
}

function baixarCSVOficina(oficina) {
  if (!oficina) return
  const nomeArq = normalizarBusca(oficina.nome).replace(/\s+/g, '-').substring(0, 30)
  baixarCSVGenerico(
    montarLinhasOficina(oficina),
    `oficina-${nomeArq}-${oficina.data.replace('/', '-')}-${dataArquivo()}.csv`
  )
}

function baixarExcelTodasOficinas() {
  const wb = XLSX.utils.book_new()
  todasOficinasParsed.value.forEach((of) => {
    const ws = XLSX.utils.json_to_sheet(montarLinhasOficina(of))
    const nomeAba = of.nome.substring(0, 25) + ' ' + of.data
    XLSX.utils.book_append_sheet(wb, ws, nomeAba.substring(0, 31))
  })
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([out], { type: 'application/octet-stream' }), `todas-oficinas-salip2-${dataArquivo()}.xlsx`)
}

// ─────────────────────────────────────────────────────
// EXPORTAÇÕES — Genérico
// ─────────────────────────────────────────────────────
function baixarExcelGenerico(dados, nomeAba, nomeArquivo) {
  const ws = XLSX.utils.json_to_sheet(dados)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, nomeAba)
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([out], { type: 'application/octet-stream' }), nomeArquivo)
}

function baixarCSVGenerico(dados, nomeArquivo) {
  const headers = Object.keys(dados[0] || {})
  const rows = dados.map((row) =>
    headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  saveAs(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), nomeArquivo)
}

function dataArquivo() {
  return new Date().toISOString().slice(0, 10)
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
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
button, input, select { font: inherit; }
button { outline: none; }

.admin-wrap {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 28rem),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #172033;
}

/* ─── TOPBAR ─────────────────────────────────────── */
.topbar {
  position: sticky; top: 0; z-index: 50;
  background: #144181; color: #fff;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.95rem 2rem; gap: 1rem;
  box-shadow: 0 12px 32px rgba(15,23,42,0.12);
}
.topbar-left, .topbar-right { display: flex; align-items: center; gap: 0.9rem; }
.logo-mark {
  width: 42px; height: 42px; background: #d8df52; color: #172033;
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 900; letter-spacing: -0.04em;
}
.topbar-title { font-size: 1rem; font-weight: 900; line-height: 1.2; color: #fff; }
.topbar-sub { font-size: 0.74rem; color: #dbeafe; font-family: 'IBM Plex Mono', monospace; margin-top: 0.15rem; }
.online-badge { display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; color: #fff; font-family: 'IBM Plex Mono', monospace; }
.dot-pulse {
  width: 0.48rem; height: 0.48rem; border-radius: 999px; background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74,222,128,0.4); animation: pulse 2s infinite;
}
.btn-logout, .btn-logout-footer {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.48rem 0.9rem; background: transparent;
  border: 1px solid rgba(255,255,255,0.55); border-radius: 0.55rem;
  color: #fff; font-size: 0.8rem; cursor: pointer; transition: all 0.15s;
}
.btn-logout:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

/* ─── CONTENT ────────────────────────────────────── */
.content { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; max-width: 1500px; margin: 0 auto; }

.status-card, .chart-card, .table-section, .actions-bar, .avaliacoes-section, .oficinas-section {
  background: #fff; border: 1.5px solid #dbe3ef; border-radius: 1rem;
  box-shadow: 0 14px 40px rgba(15,23,42,0.04);
}
.status-card { padding: 1rem; }
.status-content { display: flex; align-items: center; gap: 1rem; color: #334155; }
.status-content p { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
.status-content.error { align-items: flex-start; flex-direction: column; }
.loader {
  width: 1.25rem; height: 1.25rem; border: 3px solid #dbeafe; border-top-color: #144181;
  border-radius: 999px; animation: spin 1s linear infinite;
}

/* ─── KPI GRID ───────────────────────────────────── */
.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.85rem; }
.kpi-card {
  text-align: left; background: #fff; border: 1.5px solid #dbe3ef; border-radius: 1rem;
  padding: 1.25rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  color: #172033; box-shadow: 0 14px 40px rgba(15,23,42,0.04);
}
.kpi-card::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 4px;
  background: var(--accent); opacity: 0; transition: opacity 0.2s;
}
.kpi-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.kpi-card.active { border-color: var(--accent); }
.kpi-card.active::before { opacity: 1; }
.kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; }
.kpi-icon { color: var(--accent); opacity: 0.95; }
.kpi-delta { font-size: 0.65rem; font-family: 'IBM Plex Mono', monospace; background: #f1f5f9; padding: 0.2rem 0.45rem; border-radius: 0.4rem; color: #64748b; }
.kpi-number { font-size: 2.35rem; font-weight: 900; line-height: 1; color: #172033; letter-spacing: -0.06em; }
.kpi-label { font-size: 0.85rem; color: #64748b; margin-top: 0.35rem; margin-bottom: 0.8rem; font-weight: 800; }
.kpi-bar { height: 5px; background: #eef2f7; border-radius: 999px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 999px; transition: width 0.8s; }
.kpi-pct { font-size: 0.72rem; color: #94a3b8; margin-top: 0.4rem; font-family: 'IBM Plex Mono', monospace; }

/* ─── STATS ROW ──────────────────────────────────── */
.stats-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.85rem; }
.chart-card { padding: 1.25rem; }
.card-title { font-size: 0.78rem; font-weight: 900; color: #334155; letter-spacing: 0.06em; margin-bottom: 1rem; text-transform: uppercase; }
.no-margin { margin-bottom: 0; }
.stat-list { display: flex; flex-direction: column; gap: 0.55rem; }
.stat-item { display: grid; grid-template-columns: 76px 1fr 34px 42px; align-items: center; gap: 0.55rem; font-size: 0.76rem; }
.stat-name { color: #334155; font-size: 0.76rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 800; }
.stat-name-marquee { position: relative; display: block; overflow: hidden; white-space: nowrap; max-width: 100%; mask-image: linear-gradient(90deg,transparent 0%,black 10%,black 88%,transparent 100%); -webkit-mask-image: linear-gradient(90deg,transparent 0%,black 10%,black 88%,transparent 100%); }
.stat-name-marquee span { display: inline-block; min-width: max-content; padding-right: 2rem; animation: marqueeSchool 8s linear infinite; animation-play-state: paused; }
.stat-item:hover .stat-name-marquee span { animation-play-state: running; }
.stat-track { height: 7px; background: #eef2f7; border-radius: 999px; overflow: hidden; }
.stat-fill { height: 100%; border-radius: 999px; transition: width 0.8s; background: #2563eb; }
.stat-fill.green { background: #16a34a; }
.stat-fill.amber { background: #d97706; }
.stat-count { color: #172033; font-weight: 900; text-align: right; }
.stat-pct { font-size: 0.68rem; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.empty-card { color: #94a3b8; font-size: 0.85rem; padding: 1rem 0; }

/* ─── SECTION HEADER ─────────────────────────────── */
.section-header {
  padding: 1.25rem; border-bottom: 1px solid #eef2f7;
  background: radial-gradient(circle at top left,rgba(216,223,82,0.16),transparent 18rem), linear-gradient(135deg,#fff 0%,#f8fbff 100%);
  display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;
}
.section-kicker {
  display: inline-flex; background: #eaf2ff; color: #144181;
  padding: 0.32rem 0.65rem; border-radius: 999px; font-size: 0.68rem; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.6rem;
}
.section-kicker.kicker-green { background: #dcfce7; color: #166534; }
.section-header h2 { color: #172033; font-size: 1.15rem; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 0.25rem; }
.section-header p { color: #64748b; font-size: 0.88rem; line-height: 1.55; max-width: 720px; }
.section-actions { display: flex; gap: 0.65rem; flex-wrap: wrap; }

/* ─── OFICINAS SECTION ───────────────────────────── */
.oficinas-section { overflow: hidden; }
.oficinas-header { background: radial-gradient(circle at top right,rgba(22,163,74,0.08),transparent 18rem), linear-gradient(135deg,#fff 0%,#f0fdf4 100%) !important; }

.oficinas-kpis {
  display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.85rem; padding: 1.25rem; border-bottom: 1px solid #eef2f7;
}
.okpi-card {
  background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 1rem;
  padding: 1rem; text-align: center;
}
.okpi-card.okpi-green { background: #f0fdf4; border-color: #bbf7d0; }
.okpi-card.okpi-amber { background: #fffbeb; border-color: #fde68a; }
.okpi-card.okpi-blue { background: #eff6ff; border-color: #bfdbfe; }
.okpi-label { display: block; color: #64748b; font-size: 0.68rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; }
.okpi-number { display: block; color: #172033; font-size: 1.9rem; font-weight: 900; letter-spacing: -0.06em; margin-top: 0.25rem; }
.okpi-card small { color: #94a3b8; font-size: 0.72rem; font-weight: 700; }
.okpi-green .okpi-number { color: #16a34a; }
.okpi-amber .okpi-number { color: #d97706; }
.okpi-blue .okpi-number { color: #2563eb; }

.oficinas-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem; padding: 1.25rem;
}

.oficina-card {
  background: #fff; border: 1.5px solid #dbe3ef; border-radius: 1rem;
  padding: 1.1rem; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; gap: 0.6rem;
  box-shadow: 0 4px 16px rgba(15,23,42,0.04);
}
.oficina-card:hover {
  border-color: #16a34a; transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22,163,74,0.1);
}

.ocard-top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.ocard-date-badge {
  display: inline-flex; flex-direction: column; align-items: center;
  background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 0.6rem;
  padding: 0.3rem 0.65rem; line-height: 1.2;
}
.ocard-date-badge.inline { flex-direction: row; gap: 0.35rem; padding: 0.22rem 0.6rem; }
.ocard-dia { font-size: 0.6rem; color: #3b82f6; font-weight: 900; text-transform: uppercase; }
.ocard-data { font-size: 0.8rem; color: #1e40af; font-weight: 900; font-family: 'IBM Plex Mono', monospace; }
.ocard-hora-badge {
  display: inline-flex; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 0.6rem; padding: 0.22rem 0.65rem; font-size: 0.78rem;
  font-weight: 900; color: #16a34a; font-family: 'IBM Plex Mono', monospace;
}
.vagas-chip {
  display: inline-flex; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 999px; padding: 0.22rem 0.65rem; font-size: 0.72rem; font-weight: 900; color: #1e40af;
}
.reserva-chip {
  display: inline-flex; align-items: center; background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 999px; padding: 0.22rem 0.65rem; font-size: 0.72rem; font-weight: 900; color: #92400e;
}

.ocard-nome { font-size: 0.92rem; font-weight: 900; color: #172033; line-height: 1.35; }
.ocard-professor {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.75rem; color: #334155; font-weight: 700;
}
.ocard-professor.muted { color: #94a3b8; }
.ocard-local {
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.72rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.ocard-vagas-row { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.2rem; }
.ocard-vagas-bar-wrap { height: 6px; background: #eef2f7; border-radius: 999px; overflow: hidden; }
.ocard-vagas-bar { height: 100%; border-radius: 999px; transition: width 0.6s, background 0.3s; }
.ocard-vagas-nums { display: flex; align-items: center; gap: 0.5rem; }
.ocard-confirmados { font-size: 0.76rem; font-weight: 900; color: #172033; font-family: 'IBM Plex Mono', monospace; }
.ocard-reserva-badge {
  font-size: 0.66rem; font-weight: 900; background: #fffbeb; color: #92400e;
  border: 1px solid #fde68a; border-radius: 999px; padding: 0.12rem 0.45rem;
}
.ocard-livre-badge {
  font-size: 0.66rem; font-weight: 900; background: #dcfce7; color: #166534;
  border: 1px solid #bbf7d0; border-radius: 999px; padding: 0.12rem 0.45rem;
}
.ocard-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 0.5rem; border-top: 1px solid #f1f5f9; margin-top: 0.1rem;
}
.ocard-total-inscritos { font-size: 0.72rem; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.ocard-ver-btn { font-size: 0.72rem; font-weight: 900; color: #16a34a; }
.oficina-card:hover .ocard-ver-btn { text-decoration: underline; }

.empty-oficinas {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  padding: 3rem; color: #94a3b8; text-align: center;
}
.empty-oficinas p { font-size: 0.9rem; }

/* ─── OFICINA MODAL ──────────────────────────────── */
.modal-wide { max-width: 900px !important; }

.oficina-modal-header {
  background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%) !important;
  border-bottom-color: #bbf7d0 !important;
}
.oficina-modal-icon {
  width: 2.8rem; height: 2.8rem; border-radius: 0.9rem; flex-shrink: 0;
  background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center;
}

.oficina-modal-meta {
  display: flex; align-items: flex-start; gap: 2rem; flex-wrap: wrap;
  padding: 0.85rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #eef2f7;
}
.meta-item {
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.82rem; color: #334155; font-weight: 700;
}
.professor-edit-row { gap: 0.5rem; flex-wrap: wrap; }
.professor-input {
  background: #fff; border: 1px solid #dbe3ef; border-radius: 0.5rem;
  padding: 0.32rem 0.65rem; font-size: 0.82rem; color: #172033; outline: none; width: 200px;
}
.professor-input:focus { border-color: #16a34a; }

.oficina-modal-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  gap: 0.75rem; padding: 0.85rem 1.25rem; border-bottom: 1px solid #eef2f7;
}
.omt-legend { display: flex; gap: 1rem; flex-wrap: wrap; }
.leg-chip { font-size: 0.74rem; font-weight: 800; }
.leg-chip.confirmado { color: #16a34a; }
.leg-chip.reserva { color: #d97706; }
.omt-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.oficina-table-wrap { max-height: 420px; overflow-y: auto; }

.row-confirmado { background: rgba(220,252,231,0.25) !important; }
.row-reserva { background: rgba(255,251,235,0.25) !important; }
.row-confirmado:hover td { background: rgba(220,252,231,0.5) !important; }
.row-reserva:hover td { background: rgba(255,251,235,0.5) !important; }

.posicao-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 1.6rem; height: 1.6rem; border-radius: 999px;
  font-size: 0.72rem; font-weight: 900; font-family: 'IBM Plex Mono', monospace;
}
.pos-confirmado { background: #dcfce7; color: #166534; }
.pos-reserva { background: #fef3c7; color: #92400e; }

.status-oficina-pill {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.22rem 0.65rem; border-radius: 999px; font-size: 0.7rem; font-weight: 900; white-space: nowrap;
}
.sop-confirmado { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.sop-reserva { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

.manual-badge {
  display: inline-flex; margin-left: 0.3rem; padding: 0.1rem 0.4rem;
  background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe;
  border-radius: 999px; font-size: 0.6rem; font-weight: 900; vertical-align: middle;
  font-family: 'IBM Plex Mono', monospace;
}

.toggle-btns { display: flex; gap: 0.3rem; flex-wrap: wrap; }

.btn-mini {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.28rem 0.6rem; border: 1px solid; border-radius: 0.45rem;
  font-size: 0.72rem; font-weight: 900; cursor: pointer; transition: all 0.15s; white-space: nowrap;
}
.btn-mini.green { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.btn-mini.green:hover { background: #dcfce7; }
.btn-mini.amber { background: #fffbeb; border-color: #fde68a; color: #d97706; }
.btn-mini.amber:hover { background: #fef3c7; }
.btn-mini.neutral { background: #f8fafc; border-color: #dbe3ef; color: #64748b; }
.btn-mini.neutral:hover { background: #f1f5f9; }

.loader-small {
  display: inline-block; width: 1rem; height: 1rem;
  border: 2px solid #dbeafe; border-top-color: #144181;
  border-radius: 999px; animation: spin 0.8s linear infinite;
}

.footer-note { font-size: 0.78rem; color: #64748b; max-width: 480px; line-height: 1.5; }

/* ─── AVALIAÇÕES ─────────────────────────────────── */
.avaliacoes-section { overflow: hidden; }
.reviews-summary { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 0.85rem; padding: 1.25rem; border-bottom: 1px solid #eef2f7; }
.review-summary-card { background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 1rem; padding: 1rem; }
.review-summary-card.main { background: #144181; }
.review-summary-card span { display: block; color: #64748b; font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; }
.review-summary-card strong { display: inline-block; color: #172033; font-size: 2rem; font-weight: 900; letter-spacing: -0.06em; margin-top: 0.35rem; }
.review-summary-card small { color: #94a3b8; font-weight: 900; margin-left: 0.2rem; }
.review-summary-card.main span, .review-summary-card.main small { color: #dbeafe; }
.review-summary-card.main strong { color: #d8df52; }

/* ─── TABLE ──────────────────────────────────────── */
.table-section { overflow: hidden; }
.table-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.9rem; padding: 1.1rem 1.25rem; border-bottom: 1px solid #eef2f7;
}
.table-toolbar.inner { border-top: 1px solid #eef2f7; }
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }
.result-count { font-size: 0.74rem; background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 999px; color: #64748b; font-family: 'IBM Plex Mono', monospace; }
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.search-input, .filter-select, .pag-select { background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 0.7rem; color: #172033; outline: none; font-size: 0.82rem; }
.search-input { padding: 0.55rem 0.8rem 0.55rem 2rem; width: 280px; }
.filter-select, .pag-select { padding: 0.55rem 0.75rem; cursor: pointer; }
.search-input:focus, .filter-select:focus { border-color: #144181; background: #fff; }
.filter-pills { display: flex; gap: 0.35rem; }
.pill { padding: 0.42rem 0.8rem; font-size: 0.76rem; background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 999px; cursor: pointer; color: #64748b; transition: all 0.15s; font-weight: 800; }
.pill:hover { border-color: #144181; color: #144181; }
.pill.active { background: #144181; border-color: #144181; color: #fff; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #dbe3ef; }
.data-table th { padding: 0.75rem 0.9rem; text-align: left; font-size: 0.68rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
.data-table th.sortable { cursor: pointer; user-select: none; }
.data-table th.sortable:hover { color: #172033; }
.sort-arrow { font-size: 0.65rem; color: #94a3b8; margin-left: 0.25rem; }
.data-row td { padding: 0.75rem 0.9rem; border-bottom: 1px solid #eef2f7; color: #172033; vertical-align: middle; }
.data-row:last-child td { border-bottom: none; }
.data-row.alt { background: #fbfdff; }
.data-row:hover td { background: #eef6ff !important; cursor: pointer; }
.td-muted { color: #64748b; }
.td-trunc { max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.user-cell { display: flex; align-items: center; gap: 0.65rem; }
.avatar, .modal-avatar { border-radius: 999px; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
.avatar { width: 2rem; height: 2rem; font-size: 0.72rem; }
.avatar.anonymous, .modal-avatar.anonymous { background: #f1f5f9; color: #64748b; }
.user-info-cell { display: flex; flex-direction: column; gap: 0.1rem; }
.user-info-cell small { color: #94a3b8; font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; }
.user-name { font-weight: 900; color: #172033; }
.empty-row { text-align: center; padding: 3rem !important; color: #94a3b8; font-size: 0.9rem; }

.id-chip {
  display: inline-flex; align-items: center; justify-content: center;
  background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe;
  padding: 0.18rem 0.5rem; border-radius: 0.45rem;
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.05em;
}

.badge, .status-badge, .badge-review, .score-pill, .aspect-pill {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.22rem 0.6rem; border-radius: 999px; font-size: 0.7rem; font-weight: 900; white-space: nowrap;
}
.badge-aluno { background: #dbeafe; color: #1e40af; }
.badge-funcionario { background: #dcfce7; color: #166534; }
.badge-visitante { background: #fef3c7; color: #92400e; }
.badge-outro { background: #f1f5f9; color: #334155; }
.status-confirmada { background: #dcfce7; color: #166534; }
.status-cancelada { background: #fee2e2; color: #991b1b; }
.review-evento_geral { background: #dbeafe; color: #1e40af; }
.review-oficina { background: #dcfce7; color: #166534; }
.review-palestra { background: #fef3c7; color: #92400e; }
.review-exposicao { background: #ede9fe; color: #5b21b6; }
.score-low { background: #fee2e2; color: #991b1b; }
.score-good { background: #fef3c7; color: #92400e; }
.score-high { background: #dcfce7; color: #166534; }
.aspect-pill { background: #eef2ff; color: #3730a3; }

.btn-detail {
  display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.7rem;
  background: transparent; border: 1px solid #dbe3ef; border-radius: 0.55rem;
  font-size: 0.75rem; cursor: pointer; color: #64748b; transition: all 0.15s; white-space: nowrap; font-weight: 900;
}
.btn-detail:hover { background: #eef6ff; border-color: #144181; color: #144181; }

/* ─── PAGINATION ─────────────────────────────────── */
.pagination { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.7rem; padding: 0.9rem 1.25rem; border-top: 1px solid #eef2f7; }
.pag-info { font-size: 0.74rem; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.pag-btns { display: flex; gap: 0.3rem; }
.pag-btn { min-width: 2rem; height: 2rem; background: transparent; border: 1px solid #dbe3ef; border-radius: 0.5rem; font-size: 0.82rem; cursor: pointer; color: #334155; transition: all 0.15s; display: flex; align-items: center; justify-content: center; padding: 0 0.4rem; }
.pag-btn:hover:not(:disabled) { background: #eef6ff; border-color: #144181; }
.pag-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pag-btn.current { background: #144181; border-color: #144181; color: #fff; }

/* ─── ACTIONS BAR ────────────────────────────────── */
.actions-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem; padding: 1rem 1.25rem; }
.actions-left { display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap; }

.btn-action {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
  padding: 0.58rem 1rem; border: none; border-radius: 0.65rem;
  font-size: 0.82rem; font-weight: 900; cursor: pointer; transition: all 0.15s;
}
.btn-action.green { background: #166534; color: #fff; }
.btn-action.green:hover { background: #14532d; }
.btn-action.blue { background: #144181; color: #fff; }
.btn-action.blue:hover { background: #0f3368; }
.btn-action.teal { background: #0f766e; color: #fff; }
.btn-action.teal:hover { background: #0d5f58; }
.btn-action.neutral { background: #f1f5f9; color: #334155; border: 1px solid #dbe3ef; }
.btn-action.neutral:hover { background: #e2e8f0; }
.export-note { font-size: 0.74rem; color: #94a3b8; font-family: 'IBM Plex Mono', monospace; }
.btn-logout-footer { color: #64748b; border-color: #dbe3ef; }
.btn-logout-footer:hover { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }

/* ─── MODAIS ─────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.58);
  backdrop-filter: blur(4px); z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal {
  background: #fff; border-radius: 1.1rem; width: 100%; max-width: 620px;
  max-height: 90vh; overflow-y: auto; border: 1.5px solid #dbe3ef;
  box-shadow: 0 24px 70px rgba(0,0,0,0.25);
}
.modal-header {
  display: flex; align-items: center; gap: 0.85rem; padding: 1.25rem;
  border-bottom: 1px solid #eef2f7; position: sticky; top: 0; background: #fff; z-index: 1;
}
.modal-avatar { width: 2.8rem; height: 2.8rem; font-size: 0.95rem; }
.modal-info { flex: 1; }
.modal-name { font-size: 1.05rem; font-weight: 900; color: #172033; margin-bottom: 0.35rem; line-height: 1.25; }
.modal-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.modal-close-btn {
  background: transparent; border: 1px solid #dbe3ef; border-radius: 0.55rem;
  width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #94a3b8; transition: all 0.15s; font-size: 1.3rem; line-height: 1;
}
.modal-close-btn:hover { background: #f1f5f9; color: #172033; }
.modal-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
.modal-section-title { font-size: 0.68rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.55rem; font-family: 'IBM Plex Mono', monospace; }
.modal-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.48rem 0; border-bottom: 1px solid #f1f5f9; gap: 1rem; }
.modal-row:last-child { border-bottom: none; }
.modal-label { font-size: 0.82rem; color: #64748b; flex-shrink: 0; font-weight: 800; }
.modal-val { font-size: 0.82rem; font-weight: 800; color: #172033; text-align: right; line-height: 1.45; }
.aspect-detail { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
.aspect-detail div { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.8rem; padding: 0.85rem; }
.aspect-detail span { display: block; color: #64748b; font-size: 0.75rem; font-weight: 900; margin-bottom: 0.25rem; }
.aspect-detail strong { color: #144181; font-size: 1.2rem; }
.comment-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.9rem; padding: 1rem; color: #334155; line-height: 1.65; font-weight: 700; }
.modal-footer { padding: 1rem 1.25rem; border-top: 1px solid #eef2f7; display: flex; justify-content: flex-end; }

/* ─── TRANSITIONS ────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ─── ANIMATIONS ─────────────────────────────────── */
@keyframes marqueeSchool {
  0% { transform: translateX(0); }
  12% { transform: translateX(0); }
  88% { transform: translateX(calc(-100% + 76px)); }
  100% { transform: translateX(calc(-100% + 76px)); }
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
  70% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
  100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 1200px) {
  .oficinas-kpis { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stats-row, .reviews-summary { grid-template-columns: 1fr 1fr; }
  .oficinas-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .topbar { padding: 0.85rem 1rem; align-items: flex-start; flex-direction: column; }
  .topbar-right { width: 100%; justify-content: space-between; flex-wrap: wrap; }
  .content { padding: 1rem; }
  .kpi-grid, .stats-row, .reviews-summary, .oficinas-kpis { grid-template-columns: 1fr; }
  .oficinas-grid { grid-template-columns: 1fr; }
  .section-header { flex-direction: column; }
  .section-actions, .section-actions .btn-action { width: 100%; }
  .table-toolbar, .toolbar-right, .search-wrap, .search-input, .filter-select { width: 100%; }
  .filter-pills { width: 100%; overflow-x: auto; padding-bottom: 0.2rem; }
  .pagination { align-items: flex-start; flex-direction: column; }
  .actions-bar { align-items: flex-start; flex-direction: column; }
  .actions-left, .btn-action, .btn-logout-footer { width: 100%; }
  .modal-row { flex-direction: column; gap: 0.25rem; }
  .modal-val { text-align: left; }
  .aspect-detail { grid-template-columns: 1fr; }
  .oficina-modal-meta { flex-direction: column; gap: 0.75rem; }
  .oficina-modal-toolbar { flex-direction: column; }
  .omt-actions { width: 100%; }
  .omt-actions .btn-action { flex: 1; }
  .footer-note { display: none; }
  .modal-wide { max-width: 100% !important; }
}
</style>