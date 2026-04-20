<template>
  <section class="map-route" aria-labelledby="map-route-title">
    <div class="map-route__bg" aria-hidden="true">
      <span class="blur blur--a"></span>
      <span class="blur blur--b"></span>
      <span class="grid"></span>
    </div>

    <div class="map-route__wrap">
      <header class="map-route__header">
        <div class="map-route__intro">
          <span class="map-route__kicker">Mapa • Locais do evento</span>
          <h2 id="map-route-title" class="map-route__title">
            Selecione um local e escolha como deseja visualizar sua rota
          </h2>
          <p class="map-route__desc">
            Você pode apenas ver o destino no mapa, abrir a navegação externa
            ou, se quiser, ativar sua localização para acompanhar distância
            e direção em tempo real.
          </p>
        </div>

        <div class="map-route__status">
          <span class="status-pill" :class="{ 'is-live': trackingAtivo }">
            {{ trackingAtivo ? 'Modo ao vivo ativo' : 'Modo ao vivo desligado' }}
          </span>

          <span class="status-pill" :class="{ 'is-ok': !!userLocation }">
            {{ userLocation ? 'Localização disponível' : 'Localização não ativada' }}
          </span>
        </div>
      </header>

      <div class="map-route__locations" aria-label="Locais do evento">
        <button
          v-for="local in locais"
          :key="local.nome"
          type="button"
          class="location-chip"
          :class="{ active: localSelecionado.nome === local.nome }"
          @click="selecionarLocal(local)"
        >
          <span class="location-chip__title">{{ local.nome }}</span>
          <span class="location-chip__meta">{{ local.endereco }}</span>
        </button>
      </div>

      <div class="map-route__content">
        <div class="map-route__map-card">
          <div class="map-toolbar">
            <button
              class="toolbar-btn toolbar-btn--primary"
              type="button"
              @click="obterLocalizacaoUsuario"
            >
              Usar minha localização
            </button>

            <button
              class="toolbar-btn"
              type="button"
              @click="toggleTracking"
              :disabled="!userLocation && !trackingAtivo"
            >
              {{ trackingAtivo ? 'Desativar ao vivo' : 'Ativar ao vivo' }}
            </button>

            <button
              class="toolbar-btn"
              type="button"
              @click="centralizarTudo"
            >
              Ver rota no mapa
            </button>

            <button
              class="toolbar-btn"
              type="button"
              @click="centralizarDestino"
            >
              Focar destino
            </button>
          </div>

          <div class="map-permission-note">
            Sua localização só será solicitada quando você clicar em
            <strong>“Usar minha localização”</strong>.
          </div>

          <div id="map"></div>

          <div class="map-note">
            <strong>Mapa interativo:</strong>
            se você ativar sua localização, o sistema mostra a distância em tempo real
            entre você e o destino. Para rota viária completa, use Google Maps ou Waze.
          </div>
        </div>

        <aside class="map-route__info-card">
          <div class="info-card__head">
            <p class="info-card__eyebrow">Destino selecionado</p>
            <h3>{{ localSelecionado.nome }}</h3>
          </div>

          <div class="info-card__grid">
            <div class="info-box">
              <span class="label">Cidade</span>
              <strong>Pedro II - Piauí</strong>
            </div>

            <div class="info-box">
              <span class="label">Evento</span>
              <strong>{{ localSelecionado.evento }}</strong>
            </div>

            <div class="info-box">
              <span class="label">Endereço</span>
              <strong>{{ localSelecionado.endereco }}</strong>
            </div>

            <div class="info-box">
              <span class="label">Bairro</span>
              <strong>{{ localSelecionado.bairro }}</strong>
            </div>

            <div class="info-box">
              <span class="label">CEP</span>
              <strong>{{ localSelecionado.cep }}</strong>
            </div>

            <div class="info-box">
              <span class="label">Coordenadas</span>
              <strong>
                {{ localSelecionado.coords[0].toFixed(6) }},
                {{ localSelecionado.coords[1].toFixed(6) }}
              </strong>
            </div>
          </div>

          <div class="stats-card">
            <div class="stat">
              <span class="stat__label">Distância atual</span>
              <strong class="stat__value">{{ distanciaFormatada }}</strong>
            </div>

            <div class="stat">
              <span class="stat__label">Tempo estimado a pé</span>
              <strong class="stat__value">{{ tempoCaminhada }}</strong>
            </div>

            <div class="stat">
              <span class="stat__label">Tempo estimado de carro</span>
              <strong class="stat__value">{{ tempoCarro }}</strong>
            </div>

            <div class="stat">
              <span class="stat__label">Direção aproximada</span>
              <strong class="stat__value">{{ direcaoCardinal }}</strong>
            </div>
          </div>

          <div class="actions">
            <a
              :href="googleMapsLink"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn action-btn--primary"
            >
              Ver rota no Google Maps
            </a>

            <a
              :href="wazeLink"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn action-btn--ghost"
            >
              Abrir no Waze
            </a>

            <button
              type="button"
              class="action-btn action-btn--soft"
              @click="copiarEndereco"
            >
              Copiar endereço
            </button>
          </div>

          <p class="helper-text">
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
    nome: 'Centro Educacional de Eventos Dep. Ciro Nogueira (Antigo Claudia Eventos)',
    coords: [-4.427919148311333, -41.45083749513804],
    endereco: 'R. Auto Freire, 380.',
    bairro: 'Bairro Centro.',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Escola José Teixeira Santos',
    coords: [-4.425063223695662, -41.45858866691448],
    endereco: 'R. Antônio Benício da Silva, 223-93.',
    bairro: 'Bairro sem informações.',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Praça Domingos Mourão Filho',
    coords: [-4.425720967622175, -41.457979453637016],
    endereco: 'Praça Domingos Mourão Filho.',
    bairro: 'Bairro sem informação.',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Clube 11 de Agosto',
    coords: [-4.426571408209469, -41.45929467563859],
    endereco: 'R. João Benício da Silva, 610-668.',
    bairro: 'Bairro sem informações.',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  },
  {
    nome: 'Praça Auditório Padre Norberto',
    coords: [-4.425356995724244, -41.458229746978226],
    endereco: 'Praça Domingos Mourão Filho.',
    bairro: 'Bairro sem informações.',
    cep: 'CEP: 64255-000.',
    evento: '22 a 24 de maio.'
  }
]

const localSelecionado = ref(locais[0])
const userLocation = ref(null)
const trackingAtivo = ref(false)
const mensagemStatus = ref('Escolha um local. Sua localização só será usada se você ativar manualmente.')
const permissaoSolicitada = ref(false)

let map = null
let destinoMarker = null
let userMarker = null
let linhaRota = null
let watchId = null

const destinoIcon = L.divIcon({
  className: 'custom-pin custom-pin--destino',
  html: '<span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
})

const userIcon = L.divIcon({
  className: 'custom-pin custom-pin--user',
  html: '<span></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
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
  if (distanciaMetros.value == null) return 'Ative sua localização'
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
  localSelecionado.value = local
}

const copiarEndereco = async () => {
  const texto = `${localSelecionado.value.nome} - ${localSelecionado.value.endereco} ${localSelecionado.value.bairro} ${localSelecionado.value.cep}`

  try {
    await navigator.clipboard.writeText(texto)
    mensagemStatus.value = 'Endereço copiado com sucesso.'
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
  return `${horas}h ${mins}min`
}

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371000
  const toRad = (grau) => (grau * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const calcularDirecao = (lat1, lon1, lat2, lon2) => {
  const toRad = (grau) => (grau * Math.PI) / 180
  const toDeg = (rad) => (rad * 180) / Math.PI

  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)

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

  destinoMarker.bindPopup(`
    <strong>${localSelecionado.value.nome}</strong><br>
    ${localSelecionado.value.endereco}<br>
    ${localSelecionado.value.bairro}
  `)
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

  userMarker.bindPopup('Sua localização atual')
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
      color: '#2734AF',
      weight: 4,
      opacity: 0.86,
      dashArray: '10 8',
      lineCap: 'round',
      lineJoin: 'round'
    }
  ).addTo(map)
}

const centralizarDestino = () => {
  if (!map) return
  map.setView(localSelecionado.value.coords, 17, { animate: true })
}

const centralizarTudo = () => {
  if (!map) return

  if (userLocation.value) {
    const bounds = L.latLngBounds([
      [userLocation.value.lat, userLocation.value.lng],
      localSelecionado.value.coords
    ])
    map.fitBounds(bounds, { padding: [50, 50] })
    return
  }

  centralizarDestino()
}

const atualizarMapaCompleto = (centralizar = false) => {
  atualizarDestinoMarker()
  atualizarUserMarker()
  atualizarLinha()

  if (centralizar) {
    centralizarTudo()
  }
}

const obterLocalizacaoUsuario = () => {
  if (!navigator.geolocation) {
    mensagemStatus.value = 'Seu navegador não suporta geolocalização.'
    return
  }

  permissaoSolicitada.value = true
  mensagemStatus.value = 'Solicitando sua localização...'

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      }

      mensagemStatus.value = 'Localização ativada com sucesso.'
      atualizarMapaCompleto(true)
    },
    () => {
      mensagemStatus.value = 'Você não permitiu o acesso à localização ou ela não pôde ser obtida.'
    },
    {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 5000
    }
  )
}

const iniciarTracking = () => {
  if (!navigator.geolocation) {
    mensagemStatus.value = 'Seu navegador não suporta geolocalização.'
    return
  }

  if (watchId !== null) return

  if (!userLocation.value && !permissaoSolicitada.value) {
    obterLocalizacaoUsuario()
  }

  trackingAtivo.value = true
  mensagemStatus.value = 'Modo ao vivo ativado.'

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
      mensagemStatus.value = 'Não foi possível acompanhar sua localização ao vivo.'
      pararTracking()
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 3000
    }
  )
}

const pararTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }

  trackingAtivo.value = false
  mensagemStatus.value = 'Modo ao vivo desativado.'
}

const toggleTracking = () => {
  if (trackingAtivo.value) {
    pararTracking()
    return
  }

  iniciarTracking()
}

watch(localSelecionado, async () => {
  await nextTick()
  atualizarMapaCompleto(true)
})

onMounted(async () => {
  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(localSelecionado.value.coords, 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  atualizarDestinoMarker()

  await nextTick()
  requestAnimationFrame(() => {
    map?.invalidateSize()
  })
})

onBeforeUnmount(() => {
  pararTracking()

  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.map-route {
  position: relative;
  overflow: hidden;
  padding: 5rem 1.2rem;
  background: linear-gradient(180deg, #fafbff 0%, #f4f6fc 100%);
  font-family: 'Inter', sans-serif;
  color: #1f2433;
}

.map-route__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blur {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.42;
}

.blur--a {
  top: -8rem;
  left: -7rem;
  width: 22rem;
  height: 22rem;
  background: rgba(39, 52, 175, 0.11);
}

.blur--b {
  right: -8rem;
  bottom: -8rem;
  width: 24rem;
  height: 24rem;
  background: rgba(39, 52, 175, 0.09);
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(39, 52, 175, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(39, 52, 175, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.22), transparent 85%);
}

.map-route__wrap {
  position: relative;
  z-index: 1;
  width: min(1220px, 100%);
  margin: 0 auto;
}

.map-route__header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1.4rem;
  margin-bottom: 1.6rem;
}

.map-route__kicker {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0.65rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(39, 52, 175, 0.12);
  color: #2734AF;
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  box-shadow: 0 10px 24px rgba(25, 33, 92, 0.05);
}

.map-route__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 1.04;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #1c2232;
  max-width: 800px;
}

.map-route__desc {
  margin: 1rem 0 0;
  max-width: 760px;
  color: #5f677a;
  line-height: 1.78;
  font-size: 1rem;
}

.map-route__status {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem;
}

.status-pill {
  min-height: 40px;
  padding: 0.65rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(39, 52, 175, 0.1);
  color: #2734AF;
  font-size: 0.88rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill.is-live {
  background: rgba(39, 52, 175, 0.12);
}

.status-pill.is-ok {
  border-color: rgba(39, 52, 175, 0.2);
}

.map-route__locations {
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  margin-bottom: 1.4rem;
  scrollbar-width: thin;
}

.location-chip {
  min-width: 250px;
  padding: 1rem;
  border-radius: 22px;
  border: 1px solid rgba(39, 52, 175, 0.1);
  background: rgba(255, 255, 255, 0.86);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(25, 33, 92, 0.05);
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.location-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 26px rgba(25, 33, 92, 0.07);
}

.location-chip.active {
  border-color: rgba(39, 52, 175, 0.24);
  background: linear-gradient(135deg, rgba(39, 52, 175, 0.11), rgba(255, 255, 255, 0.96));
}

.location-chip__title {
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
  color: #1f2433;
  line-height: 1.5;
}

.location-chip__meta {
  display: block;
  margin-top: 0.45rem;
  font-size: 0.86rem;
  color: #667086;
  line-height: 1.5;
}

.map-route__content {
  display: grid;
  grid-template-columns: 1.35fr 0.9fr;
  gap: 1.2rem;
}

.map-route__map-card,
.map-route__info-card {
  border-radius: 28px;
  border: 1px solid rgba(39, 52, 175, 0.1);
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 18px 38px rgba(25, 33, 92, 0.08);
  backdrop-filter: blur(10px);
}

.map-route__map-card {
  padding: 1rem;
}

.map-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 0.9rem;
}

.toolbar-btn {
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(39, 52, 175, 0.12);
  background: #fff;
  color: #2734AF;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(39, 52, 175, 0.08);
  background: #f8f9ff;
}

.toolbar-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.toolbar-btn--primary {
  background: linear-gradient(135deg, #2734AF 0%, #3647d6 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 14px 28px rgba(39, 52, 175, 0.18);
}

.toolbar-btn--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2330a1 0%, #3142ca 100%);
}

.map-permission-note {
  margin-bottom: 0.9rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: rgba(39, 52, 175, 0.05);
  color: #58627a;
  font-size: 0.92rem;
  line-height: 1.7;
}

#map {
  width: 100%;
  height: 520px;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(39, 52, 175, 0.08);
}

.map-note {
  margin-top: 0.9rem;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: rgba(39, 52, 175, 0.05);
  color: #54607a;
  font-size: 0.92rem;
  line-height: 1.7;
}

.map-route__info-card {
  padding: 1.3rem;
}

.info-card__head {
  margin-bottom: 1rem;
}

.info-card__eyebrow {
  margin: 0 0 0.45rem;
  color: #2734AF;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.info-card__head h3 {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.4;
  color: #1f2433;
}

.info-card__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.info-box {
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(39, 52, 175, 0.08);
}

.info-box .label {
  display: block;
  margin-bottom: 0.38rem;
  color: #667086;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.info-box strong {
  color: #1f2433;
  font-size: 0.96rem;
  line-height: 1.6;
}

.stats-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.stat {
  padding: 1rem;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f9faff 100%);
  border: 1px solid rgba(39, 52, 175, 0.08);
}

.stat__label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.8rem;
  color: #667086;
  font-weight: 700;
}

.stat__value {
  font-size: 1rem;
  color: #2734AF;
  font-weight: 800;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.action-btn {
  min-height: 52px;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 0.94rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn--primary {
  background: linear-gradient(135deg, #2734AF 0%, #3647d6 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(39, 52, 175, 0.18);
}

.action-btn--ghost {
  background: #fff;
  color: #2734AF;
  border: 1px solid rgba(39, 52, 175, 0.12);
}

.action-btn--soft {
  background: rgba(39, 52, 175, 0.08);
  color: #2734AF;
}

.helper-text {
  margin: 1rem 0 0;
  color: #5f677a;
  font-size: 0.92rem;
  line-height: 1.7;
}

:deep(.custom-pin) {
  background: transparent;
  border: 0;
}

:deep(.custom-pin span) {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.82), 0 10px 18px rgba(25, 33, 92, 0.18);
}

:deep(.custom-pin--destino span) {
  background: #2734AF;
}

:deep(.custom-pin--user span) {
  background: #12b981;
}

@media (max-width: 1080px) {
  .map-route__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .map-route__status {
    justify-content: flex-start;
  }

  .map-route__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .map-route {
    padding: 4rem 1rem;
  }

  .location-chip {
    min-width: 220px;
  }

  #map {
    height: 420px;
  }
}

@media (max-width: 640px) {
  .map-route__title {
    font-size: 1.9rem;
  }

  .map-route__desc {
    font-size: 0.96rem;
    line-height: 1.72;
  }

  .map-toolbar {
    flex-direction: column;
  }

  .toolbar-btn,
  .action-btn {
    width: 100%;
  }

  #map {
    height: 360px;
    border-radius: 18px;
  }

  .stats-card {
    grid-template-columns: 1fr;
  }

  .map-route__map-card,
  .map-route__info-card {
    border-radius: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .location-chip,
  .toolbar-btn,
  .action-btn {
    transition: none !important;
  }
}
</style>