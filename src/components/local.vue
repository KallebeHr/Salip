<template>
    <div class="container">
      <header>
        <h1>ONDE ACONTECE?</h1>
      </header>
      <div class="containerMap">
        <div id="map"></div>
        <div class="endereco">
          <h2>Pedro II - Piauí</h2>
          <p>R. Tertuliano B Filho, 467. </p>
          <p>Bairro Centro.</p>
          <p>CEP: 64255-000.</p>
          <p>Evento: 22 a 24 de maio.</p>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

onMounted(() => {
  // Coordenadas do evento
  const eventoLatLng = [-4.425311683306984, -41.45828694109339]

  // Inicializa o mapa centralizado no evento
  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView(eventoLatLng, 18)

  // Camada do mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Ícone personalizado do evento
  const customIcon = L.icon({
    iconUrl: '/IMG/iconMap.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  // Marcador fixo do evento com popup já aberto
  L.marker(eventoLatLng, { icon: customIcon })
    .addTo(map)
    .bindPopup('Rua Tertuliano B Filho, 467 – Pedro II - PI')
    .openPopup()

  // Localiza o usuário, mas não muda a centralização do mapa
  map.locate({ setView: false, maxZoom: 16 })

  map.on('locationfound', e => {
    L.circleMarker(e.latlng, {
      radius: 8,
      fillColor: '#136AEC',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup('Você está aqui!')
  })

  map.on('locationerror', err => {
    console.warn('Localização do usuário não permitida:', err.message)
  })
})
</script>

  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  background-color: #f8f9fb;

  }
  
  header {
    background-color: #2734AF;
    color: white;
    width: 100%;
    padding: 20px;
    text-align: center;
  }
  
  .containerMap {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 2rem;
    gap: 2rem;
    flex-wrap: wrap;
    background: #f4f4f4;
  }
  
  #map {
    flex: 1 1 45%;
    height: 400px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(69, 115, 200, 0.686);
    min-width: 300px;
  }
  
  .endereco {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1 1 45%;
    padding: 1.5rem;
    border-radius: 10px;
    min-width: 300px;
    color: black;
  }
  
  .endereco h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #2734AF;
  }
  
  .endereco p {
    margin: 0.3rem 0;
    font-size: 1.3rem;
  }
  </style>
  