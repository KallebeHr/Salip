<template>
    <div class="container">
      <header>
        <h1>ONDE ACONTECE?</h1>
      </header>
      <div class="containerMap">
        <div id="map"></div>
        <div class="endereco">
          <h2>Pedro II - Piauí</h2>
          <p>R. Tertuliano B Filho, 467 </p>
          <p>Bairro Centro</p>
          <p>CEP: 64255-000</p>
          <p>Evento: 22 a 24 de maio</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
onMounted(() => {
  // inicializa o mapa com controles de zoom (já ativo por padrão)...
  const map = L.map('map', {
    zoomControl: true,     // garante que o controle de zoom apareça
  })
    .setView([-4.4286, -41.4659], 15) // Pedro II – PI

  // camada de azulejos
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: '&copy; MaxDev contributors'
  }).addTo(map)

  // marcador fixo
  const customIcon = L.icon({
    iconUrl: '/IMG/livro-de-direito.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
  L.marker([-4.425311683306984, -41.45828694109339], { icon: customIcon })
    .addTo(map)
    .bindPopup('Rua tertuliano filho - Pedro II - PI')

  // tenta localizar o usuário e jogar o mapa pra lá
  map.locate({ setView: true, maxZoom: 16, watch: false })

  // quando a localização é encontrada
  map.on('locationfound', e => {
    // adiciona marcador onde o usuário está
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
      .openPopup()
  })

  // se der erro (usuário negou permissão, por ex.)
  map.on('locationerror', err => {
    console.warn('Não foi possível obter localização:', err.message)
    // opcional: informar com toast ou outro alerta
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
  