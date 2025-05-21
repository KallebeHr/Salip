<template>
  <div class="container">
<header class="header-local">
  <h1 class="titulo-header">
    Selecione um dos locais para ver no mapa e obter a rota pelo Google Maps
  </h1>
  <div class="radio-inputs">
    <label
      v-for="(local, index) in locais"
      :key="index"
      class="radio"
    >
      <input
        type="radio"
        name="radio"
        :value="local"
        v-model="localSelecionado"
      />
      <span class="name">{{ local.nome }}</span>
    </label>
  </div>
</header>
    <div class="containerMap">
      <div id="map"></div>
      <div class="googleMap">
        <div class="loader"></div>
        <a
  :href="googleMapsLink"
  target="_blank"
  rel="noopener"
  class="btn"
>
<button > Ver rota no Google Maps
</button>
  
</a>
      </div>
      
      <div class="endereco">
        <h2>Pedro II - Piauí</h2>
        <p>{{ localSelecionado.endereco }}</p>
        <p>{{ localSelecionado.bairro }}</p>
        <p>{{ localSelecionado.cep }}</p>
        <p>{{ localSelecionado.evento }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { computed } from 'vue'

const googleMapsLink = computed(() => {
  if (!localSelecionado.value || !localSelecionado.value.coords) return '#'
  const [lat, lng] = localSelecionado.value.coords
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
})
const locais = [
  {
    nome: 'Centro Educacional de Eventos Dep. Ciro Nogueira(Antigo Claudia Eventos)',
    coords: [-4.427919148311333, -41.45083749513804],
    endereco: 'R. Auto Freire, 380.',
    bairro: 'Bairro Centro.',
    cep: 'CEP: 64255-000.',
    evento: 'Evento: 22 a 24 de maio.'
  },
  {
    nome: 'Escola José Teixeira Santos',
    coords: [-4.425063223695662, -41.45858866691448],
    endereco: 'R. Antônio Benício da Silva, 223-93.',
    bairro: 'Bairro Sem informações.',
    cep: 'CEP: 64255-000.',
    evento: 'Evento: 22 a 24 de maio.'
  },
  {
    nome: 'Praça Domingos Mourão Filho',
    coords: [-4.425720967622175, -41.457979453637016],
    endereco: 'Praça Domingos Mourão Filho.',
    bairro: 'Bairro Sem informação.',
    cep: 'CEP: 64255-000.',
    evento: 'Evento: 22 a 24 de maio.'
  },
  {
    nome: 'Clube 11 de Agosto',
    coords: [-4.426571408209469, -41.45929467563859],
    endereco: 'R. João Benício da Silva, 610-668.',
    bairro: 'Bairro Sem informações.',
    cep: 'CEP: 64255-000.',
    evento: 'Evento: 22 a 24 de maio.'
  },
  {
    nome: 'Praça Auditório Padre Norberto',
    coords: [-4.425356995724244, -41.458229746978226],
    endereco: 'Praça Domingos Mourão Filho',
    bairro: 'Bairro sem informações.',
    cep: 'CEP: 64255-000.',
    evento: 'Evento: 22 a 24 de maio.'
  }
]

const localSelecionado = ref(locais[0])
let map, marker

onMounted(() => {
  map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(localSelecionado.value.coords, 18)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: '&copy; KallDev'
  }).addTo(map)

  const customIcon = L.icon({
    iconUrl: '/IMG/iconMap.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  marker = L.marker(localSelecionado.value.coords, { icon: customIcon })
    .addTo(map)
    .bindPopup(localSelecionado.value.endereco)
    .openPopup()
})

// Atualiza o mapa quando localSelecionado muda
watch(localSelecionado, (novo) => {
  map.setView(novo.coords, 18)
  marker.setLatLng(novo.coords)
  marker.setPopupContent(novo.endereco)
})
</script>


  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  background-color: #f8f9fb;

  }
  
.radio-inputs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  background-color: #EEE;
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: rgba(51, 65, 85, 1);
  transition: all .15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: #fff;
  font-weight: 600;
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
.header-local {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: #2734AF;
  color: white;
  width: 100%;
  padding: 20px;
  gap: 1.5rem;
  text-align: center;
}

.titulo-header {
  flex: 1 1 auto;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: left;
  color: white;
  max-width: 300px;
  width: 400px;
}

.radio-inputs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0.5rem;
  background-color: #EEE;
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: rgba(51, 65, 85, 1);
  transition: all .15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
 background-color: #2734AF;
  color: #EEE;
  font-weight: 600;
}

/* Responsivo para mobile */
@media (max-width: 768px) {
  .header-local {
    flex-direction: column;
    text-align: center;
  }

  .titulo-header {
    text-align: center;
  }
}

.btn {
 --color: rgb(41, 41, 41);
 --color2: rgb(10, 25, 30);
 padding: 0.8em 1.75em;
 background-color: transparent;
 border-radius: 6px;
 border: .3px solid var(--color);
 transition: .5s;
 position: relative;
 overflow: hidden;
 cursor: pointer;
 z-index: 1;
 font-weight: 300;
 font-size: 17px;
 font-family: 'Roboto', 'Segoe UI', sans-serif;
 text-transform: uppercase;
 color: var(--color);

}
.btn:hover {
color:#2734AF;
 border: 1px solid #2734AF;


}
  .endereco p {
    margin: 0.3rem 0;
    font-size: 1.3rem;
  }
  </style>
  