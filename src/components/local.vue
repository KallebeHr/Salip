<template>
    <div class="container">
      <header>
        <h1>ONDE ACONTECE?</h1>
      </header>
      <div class="containerMap">
        <div id="map"></div>
        <div class="endereco">
          <h2>Pedro II - Piauí</h2>
          <p>Rua das Letras, nº 128</p>
          <p>Quadra 3, Bairro Centro</p>
          <p>CEP: 64255-000</p>
          <p>Evento: 25 a 30 de Julho</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  
  onMounted(() => {
    const map = L.map('map').setView([-4.4286, -41.4659], 15) // Coordenadas Pedro II - PI
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  
    const customIcon = L.icon({
      iconUrl: '/IMG/livro-de-direito.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  
    L.marker([-4.4286, -41.4659], { icon: customIcon })
      .addTo(map)
      .bindPopup('Local do Evento - Pedro II - PI')
  })
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  