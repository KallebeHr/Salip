<template>
  <section class="map-route" aria-labelledby="map-route-title">
    <div class="map-route__bg" aria-hidden="true">
      <span class="blur blur--a"></span>
      <span class="blur blur--b"></span>
    </div>

    <div class="map-route__wrap">
      <header class="map-route__header">
        <div class="map-route__intro">
          <span class="map-route__kicker">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Locais do Evento
          </span>
          <h2 id="map-route-title" class="map-route__title">
            Encontre sua rota ideal
          </h2>
          <p class="map-route__desc">
            Selecione o destino, ative sua localização e acompanhe a distância em tempo real.
          </p>
        </div>

        <div class="map-route__status">
          <span class="status-indicator" :class="{ 'is-active': trackingAtivo }">
            <span class="status-indicator__dot"></span>
            {{ trackingAtivo ? 'Modo Ao Vivo' : 'Ao Vivo Desligado' }}
          </span>
        </div>
      </header>

      <div 
        class="map-route__locations" 
        aria-label="Locais do evento"
        ref="locationsContainer"
        @mousedown="iniciarArrasto"
        @mousemove="arrastar"
        @mouseup="pararArrasto"
        @mouseleave="pararArrasto"
      >
        <button
          v-for="local in locais"
          :key="local.nome"
          type="button"
          class="location-chip"
          :class="{ active: localSelecionado.nome === local.nome }"
          @click="selecionarLocal(local)"
        >
          <div class="location-chip__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
          </div>
          <div class="location-chip__text">
            <span class="location-chip__title">{{ local.nome }}</span>
            <span class="location-chip__meta">{{ local.endereco }}</span>
          </div>
        </button>
      </div>

      <div class="map-route__content">
        <div class="map-wrapper">
          <div id="map" class="map-container"></div>
          
          <div class="map-toolbar-floating">
            <button class="glass-btn primary" @click="obterLocalizacaoUsuario" title="Sua Localização">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Localizar</span>
            </button>
            <button class="glass-btn" @click="toggleTracking" :class="{ 'is-tracking': trackingAtivo }" :disabled="!userLocation && !trackingAtivo" title="Acompanhar em tempo real">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              <span>{{ trackingAtivo ? 'Parar' : 'Acompanhar' }}</span>
            </button>
            <button class="glass-btn icon-only" @click="centralizarTudo" title="Ver rota completa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
            </button>
          </div>
        </div>

        <aside class="map-route__info-card">
          <div class="info-card__head">
            <p class="info-card__eyebrow">Destino</p>
            <h3>{{ localSelecionado.nome }}</h3>
            <p class="info-card__address">{{ localSelecionado.endereco }} • {{ localSelecionado.bairro }}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-box highlight">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
              <div>
                <span class="stat-box__label">Distância</span>
                <strong class="stat-box__value">{{ distanciaFormatada }}</strong>
              </div>
            </div>
            <div class="stat-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div>
                <span class="stat-box__label">A pé</span>
                <strong class="stat-box__value">{{ tempoCaminhada }}</strong>
              </div>
            </div>
            <div class="stat-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect><circle cx="7" cy="21" r="2"></circle><circle cx="17" cy="21" r="2"></circle><path d="M14 11l-2-6H6l-2 6"></path></svg>
              <div>
                <span class="stat-box__label">De carro</span>
                <strong class="stat-box__value">{{ tempoCarro }}</strong>
              </div>
            </div>
            <div class="stat-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              <div>
                <span class="stat-box__label">Direção</span>
                <strong class="stat-box__value">{{ direcaoCardinal }}</strong>
              </div>
            </div>
          </div>

          <div class="actions">
            <a :href="googleMapsLink" target="_blank" rel="noopener noreferrer" class="btn-modern btn-modern--maps">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
              Google Maps
            </a>
            
            <div class="actions-row">
              <a :href="wazeLink" target="_blank" rel="noopener noreferrer" class="btn-modern btn-modern--waze">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10h.01M12 10h.01M7 10h.01M21 11c0-4.418-4.03-8-9-8S3 6.582 3 11s4.03 8 9 8c1.393 0 2.707-.267 3.89-.745C17.65 19.342 19.354 21 21 21v-4.103A8.868 8.868 0 0 0 21 11z"></path></svg>
                Waze
              </a>
              <button type="button" class="btn-modern btn-modern--ghost" @click="copiarEndereco">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copiar
              </button>
            </div>
          </div>

          <p class="helper-text fade-in" :key="mensagemStatus">
            {{ mensagemStatus }}
          </p>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const locais = [
  {
    nome: 'Centro Educacional de Eventos Dep. Ciro Nogueira',
    coords: [-4.427919148311333, -41.45083749513804],
    endereco: 'R. Auto Freire, 380.',
    bairro: 'Centro',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Escola José Teixeira Santos',
    coords: [-4.425063223695662, -41.45858866691448],
    endereco: 'R. Antônio Benício da Silva, 223-93.',
    bairro: 'Centro',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Praça Domingos Mourão Filho',
    coords: [-4.425720967622175, -41.457979453637016],
    endereco: 'Praça Domingos Mourão Filho.',
    bairro: 'Centro',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Clube 11 de Agosto',
    coords: [-4.426571408209469, -41.45929467563859],
    endereco: 'R. João Benício da Silva, 610-668.',
    bairro: 'Centro',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Praça Auditório Padre Norberto',
    coords: [-4.425356995724244, -41.458229746978226],
    endereco: 'Praça Domingos Mourão Filho.',
    bairro: 'Centro',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  }
]

const localSelecionado = ref(locais[0])
const userLocation = ref(null)
const trackingAtivo = ref(false)
const mensagemStatus = ref('Pronto para navegar! Escolha um local ou ative sua localização.')
const permissaoSolicitada = ref(false)

// --- LÓGICA DE ARRASTAR O SCROLL ---
const locationsContainer = ref(null)
let isDown = false
let startX
let scrollLeft

const iniciarArrasto = (e) => {
  isDown = true
  locationsContainer.value.classList.add('is-dragging')
  startX = e.pageX - locationsContainer.value.offsetLeft
  scrollLeft = locationsContainer.value.scrollLeft
}

const pararArrasto = () => {
  isDown = false
  if (locationsContainer.value) {
    locationsContainer.value.classList.remove('is-dragging')
  }
}

const arrastar = (e) => {
  if (!isDown) return
  e.preventDefault()
  const x = e.pageX - locationsContainer.value.offsetLeft
  const walk = (x - startX) * 2 // O multiplicador '2' dita a velocidade do arrasto
  locationsContainer.value.scrollLeft = scrollLeft - walk
}
// -----------------------------------

let map = null
let destinoMarker = null
let userMarker = null
let linhaRota = null
let watchId = null

const destinoIcon = L.divIcon({
  className: 'custom-pin custom-pin--destino',
  html: '<span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
})

const userIcon = L.divIcon({
  className: 'custom-pin custom-pin--user pulse-anim',
  html: '<span></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

const googleMapsLink = computed(() => {
  const [lat, lng] = localSelecionado.value.coords
  if (userLocation.value) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.value.lat},${userLocation.value.lng}&destination=${lat},${lng}&travelmode=driving`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
})

const wazeLink = computed(() => {
  const [lat, lng] = localSelecionado.value.coords
  return `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`
})

const distanciaMetros = computed(() => {
  if (!userLocation.value) return null
  const [lat2, lng2] = localSelecionado.value.coords
  return calcularDistancia(userLocation.value.lat, userLocation.value.lng, lat2, lng2)
})

const distanciaFormatada = computed(() => {
  if (distanciaMetros.value == null) return '--'
  if (distanciaMetros.value < 1000) return `${Math.round(distanciaMetros.value)} m`
  return `${(distanciaMetros.value / 1000).toFixed(2)} km`
})

const tempoCaminhada = computed(() => {
  if (distanciaMetros.value == null) return '--'
  const minutos = distanciaMetros.value / 80
  return formatarTempo(minutos)
})

const tempoCarro = computed(() => {
  if (distanciaMetros.value == null) return '--'
  const minutos = distanciaMetros.value / 500
  return formatarTempo(minutos)
})

const direcaoCardinal = computed(() => {
  if (!userLocation.value) return '--'
  const [lat2, lng2] = localSelecionado.value.coords
  const angulo = calcularDirecao(userLocation.value.lat, userLocation.value.lng, lat2, lng2)
  return converterGrausParaCardinal(angulo)
})

const selecionarLocal = (local) => {
  // Evita selecionar o local se o usuário apenas arrastou o mouse
  if (isDown) return 
  localSelecionado.value = local
}

const copiarEndereco = async () => {
  const texto = `${localSelecionado.value.nome} - ${localSelecionado.value.endereco} ${localSelecionado.value.bairro} ${localSelecionado.value.cep}`
  try {
    await navigator.clipboard.writeText(texto)
    mensagemStatus.value = '✓ Endereço copiado para a área de transferência.'
    setTimeout(() => { mensagemStatus.value = 'Pronto para navegar! Escolha um local ou ative sua localização.' }, 3000)
  } catch {
    mensagemStatus.value = 'Não foi possível copiar o endereço.'
  }
}

const formatarTempo = (minutos) => {
  if (!Number.isFinite(minutos) || minutos <= 0) return '--'
  if (minutos < 60) return `${Math.max(1, Math.round(minutos))} min`
  const horas = Math.floor(minutos / 60)
  const mins = Math.round(minutos % 60)
  if (mins === 0) return `${horas}h`
  return `${horas}h ${mins}m`
}

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371000
  const toRad = (grau) => (grau * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const calcularDirecao = (lat1, lon1, lat2, lon2) => {
  const toRad = (grau) => (grau * Math.PI) / 180
  const toDeg = (rad) => (rad * 180) / Math.PI
  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
  const brng = toDeg(Math.atan2(y, x))
  return (brng + 360) % 360
}

const converterGrausParaCardinal = (graus) => {
  const direcoes = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
  return direcoes[Math.round(graus / 45) % 8]
}

const atualizarDestinoMarker = () => {
  if (!map) return
  const [lat, lng] = localSelecionado.value.coords
  if (!destinoMarker) {
    destinoMarker = L.marker([lat, lng], { icon: destinoIcon }).addTo(map)
  } else {
    destinoMarker.setLatLng([lat, lng])
  }
  destinoMarker.bindPopup(`<strong>${localSelecionado.value.nome}</strong>`)
}

const atualizarUserMarker = () => {
  if (!map) return
  if (!userLocation.value) {
    if (userMarker) {
      map.removeLayer(userMarker)
      userMarker = null
    }
    return
  }
  const latlng = [userLocation.value.lat, userLocation.value.lng]
  if (!userMarker) {
    userMarker = L.marker(latlng, { icon: userIcon }).addTo(map)
  } else {
    userMarker.setLatLng(latlng)
  }
  userMarker.bindPopup('Você está aqui!')
}

const atualizarLinha = () => {
  if (!map) return
  if (linhaRota) {
    map.removeLayer(linhaRota)
    linhaRota = null
  }
  if (!userLocation.value) return
  linhaRota = L.polyline(
    [
      [userLocation.value.lat, userLocation.value.lng],
      localSelecionado.value.coords
    ],
    {
      color: '#4F46E5',
      weight: 4,
      opacity: 0.8,
      dashArray: '10 10',
      className: 'animated-route'
    }
  ).addTo(map)
}

const centralizarDestino = () => {
  if (!map) return
  map.setView(localSelecionado.value.coords, 16, { animate: true, duration: 1 })
}

const centralizarTudo = () => {
  if (!map) return
  if (userLocation.value) {
    const bounds = L.latLngBounds([
      [userLocation.value.lat, userLocation.value.lng],
      localSelecionado.value.coords
    ])
    map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1 })
    return
  }
  centralizarDestino()
}

const atualizarMapaCompleto = (centralizar = false) => {
  atualizarDestinoMarker()
  atualizarUserMarker()
  atualizarLinha()
  if (centralizar) centralizarTudo()
}

const obterLocalizacaoUsuario = () => {
  if (!navigator.geolocation) {
    mensagemStatus.value = 'Seu navegador não suporta geolocalização.'
    return
  }
  permissaoSolicitada.value = true
  mensagemStatus.value = 'Buscando satélites...'
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      }
      mensagemStatus.value = '✓ Localização encontrada!'
      atualizarMapaCompleto(true)
    },
    () => {
      mensagemStatus.value = 'Ops! Não conseguimos acessar sua localização.'
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
  )
}

const iniciarTracking = () => {
  if (!navigator.geolocation) return
  if (watchId !== null) return
  if (!userLocation.value && !permissaoSolicitada.value) {
    obterLocalizacaoUsuario()
  }
  trackingAtivo.value = true
  mensagemStatus.value = 'Modo ao vivo: Acompanhando seus passos.'
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      }
      atualizarUserMarker()
      atualizarLinha()
    },
    () => {
      mensagemStatus.value = 'Sinal de GPS perdido.'
      pararTracking()
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
  )
}

const pararTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  trackingAtivo.value = false
  mensagemStatus.value = 'Modo ao vivo pausado.'
}

const toggleTracking = () => {
  trackingAtivo.value ? pararTracking() : iniciarTracking()
}

watch(localSelecionado, async () => {
  await nextTick()
  atualizarMapaCompleto(true)
})

onMounted(async () => {
  map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false
  }).setView(localSelecionado.value.coords, 16)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '© <a href="https://carto.com/">CARTO</a>'
  }).addTo(map)

  L.control.zoom({ position: 'bottomright' }).addTo(map)

  atualizarDestinoMarker()

  await nextTick()
  requestAnimationFrame(() => { map?.invalidateSize() })
})

onBeforeUnmount(() => {
  pararTracking()
  if (map) { map.remove(); map = null }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.map-route {
  position: relative;
  padding: 4rem 1rem;
  background: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0f172a;
}

.map-route__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.6;
}

.blur--a {
  top: -10%; left: -5%;
  width: 400px; height: 400px;
  background: rgba(79, 70, 229, 0.15);
}

.blur--b {
  right: -5%; bottom: -10%;
  width: 500px; height: 500px;
  background: rgba(14, 165, 233, 0.1);
}

.map-route__wrap {
  position: relative;
  z-index: 1;
  width: min(1200px, 100%);
  margin: 0 auto;
}

/* Header */
.map-route__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
}

.map-route__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.map-route__title {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -1px;
  color: #0f172a;
}

.map-route__desc {
  margin: 0;
  color: #64748b;
  font-size: 1.05rem;
  max-width: 600px;
  line-height: 1.6;
}

/* Status Indicator */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.status-indicator.is-active {
  border-color: #10b981;
  color: #047857;
  background: #ecfdf5;
}

.status-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 0.3s ease;
}

.is-active .status-indicator__dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

/* Chips de Localização e Scrollbar Customizada */
.map-route__locations {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1.2rem; /* Espaço para a scrollbar */
  margin-bottom: 1rem;
  cursor: grab;
  /* Scrollbar para Firefox */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.map-route__locations.is-dragging {
  cursor: grabbing;
}

/* Scrollbar para Chrome/Safari/Edge */
.map-route__locations::-webkit-scrollbar {
  height: 6px;
}
.map-route__locations::-webkit-scrollbar-track {
  background: transparent;
}
.map-route__locations::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.map-route__locations::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.location-chip {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 280px;
  padding: 1.2rem;
  border-radius: 20px;
  border: 2px solid transparent;
  background: white;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none; /* Impede a seleção de texto ao arrastar */
}

.location-chip:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.location-chip.active {
  border-color: #4f46e5;
  background: #f8fafc;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.15);
}

.location-chip__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.location-chip.active .location-chip__icon {
  background: #4f46e5;
  color: white;
}

.location-chip__title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.2rem;
  line-height: 1.3;
  pointer-events: none; /* Melhora a experiência do arrasto */
}

.location-chip__meta {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  pointer-events: none;
}

/* Layout Principal */
.map-route__content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

/* Mapa e Glassmorphism Toolbar */
.map-wrapper {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  height: 600px;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #e2e8f0;
}

.map-toolbar-floating {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1000;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 100px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.glass-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 100px;
  background: transparent;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.glass-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
}

.glass-btn.primary {
  background: #4f46e5;
  color: white;
}
.glass-btn.primary:hover { background: #4338ca; }

.glass-btn.is-tracking {
  background: #ef4444;
  color: white;
}

.glass-btn.icon-only {
  padding: 0.6rem;
}

.glass-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Painel de Informações Lateral */
.map-route__info-card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

.info-card__eyebrow {
  margin: 0 0 0.5rem;
  color: #4f46e5;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-card__head h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.info-card__address {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Grid de Status Moderno */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.stat-box.highlight {
  grid-column: span 2;
  background: #eef2ff;
  border-color: #e0e7ff;
}

.stat-box svg {
  color: #4f46e5;
  flex-shrink: 0;
}

.stat-box__label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.stat-box__value {
  display: block;
  font-size: 1.1rem;
  color: #0f172a;
  font-weight: 800;
}

/* Botões de Ação */
.actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.btn-modern {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-modern--maps {
  background: #0f172a;
  color: white;
}
.btn-modern--maps:hover { background: #1e293b; transform: translateY(-2px); }

.btn-modern--waze {
  background: #f1f5f9;
  color: #0f172a;
}
.btn-modern--waze:hover { background: #e2e8f0; transform: translateY(-2px); }

.btn-modern--ghost {
  background: transparent;
  color: #64748b;
  border: 2px dashed #cbd5e1;
}
.btn-modern--ghost:hover { border-color: #94a3b8; color: #0f172a; }

.helper-text {
  text-align: center;
  margin: 1.5rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

/* Leaflet Custom Pins Modernos */
:deep(.custom-pin) {
  background: transparent;
  border: 0;
}

:deep(.custom-pin span) {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.2);
}

:deep(.custom-pin--destino span) {
  background: #4f46e5;
}

:deep(.custom-pin--user span) {
  background: #10b981;
}

:deep(.pulse-anim span) {
  animation: pulse-pin 2s infinite;
}

@keyframes pulse-pin {
  0% { box-shadow: 0 0 0 4px white, 0 0 0 4px rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 4px white, 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 4px white, 0 0 0 0 rgba(16, 185, 129, 0); }
}

:deep(.animated-route) {
  animation: dash 30s linear infinite;
}

@keyframes dash {
  to { stroke-dashoffset: -1000; }
}

/* Responsivo */
@media (max-width: 992px) {
  .map-route__content {
    grid-template-columns: 1fr;
  }
  .map-wrapper { height: 400px; }
}

@media (max-width: 768px) {
  .map-route__header {
    flex-direction: column;
    align-items: flex-start;
  }
  .location-chip { min-width: 240px; }
  .map-toolbar-floating {
    top: auto;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
  }
}
</style>