<template>
  <div class="container">
    <h1 class="title">Lista de Inscritos {{ usuariosOrdenados.length }}</h1>

    <ul class="lista">
      <li
        v-for="(usuario, index) in usuariosOrdenados"
        :key="usuario.id"
        :class="{ cinza: index % 2 === 1 }"
        @click="abrirDialog(usuario)"
      >
        {{ usuario.nomeCompleto }}
      </li>
    </ul>

    <button class="logout" @click="logout">Sair da Administração</button>

    <!-- DIALOG -->
    <v-dialog v-model="dialogAberto" max-width="500">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          {{ usuarioSelecionado?.nomeCompleto }}
        </v-card-title>
        <v-card-text class="dialog-text">
          <div v-if="usuarioSelecionado">
            <p><strong>Cidade:</strong> {{ usuarioSelecionado.cidade }}</p>
            <p><strong>UF:</strong> {{ usuarioSelecionado.uf }}</p>
            <p v-if="usuarioSelecionado.escola"><strong>Escola:</strong> {{ usuarioSelecionado.escola }}</p>
            <p v-if="usuarioSelecionado.localTrabalho"><strong>Trabalho:</strong> {{ usuarioSelecionado.localTrabalho }}</p>
            <p><strong>Data de Nascimento:</strong> {{ usuarioSelecionado.dataNascimento }}</p>
            <p><strong>Tipo:</strong> {{ usuarioSelecionado.tipoParticipante }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="dialog-btn" text="Fechar" @click="dialogAberto = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'

const usuariosOrdenados = ref([])
const usuarioSelecionado = ref(null)
const dialogAberto = ref(false)
const router = useRouter()

onMounted(async () => {
  try {
    const q = query(collection(db, 'inscricoes'), orderBy('nomeCompleto'))
    const snapshot = await getDocs(q)
    usuariosOrdenados.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) =>
        a.nomeCompleto.normalize('NFD').toLowerCase()
          .localeCompare(b.nomeCompleto.normalize('NFD').toLowerCase())
      )
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error)
  }
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

const abrirDialog = (usuario) => {
  usuarioSelecionado.value = usuario
  dialogAberto.value = true
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2734AF;
  text-align: center;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista li {
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  color: #000;
  font-size: 1rem;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.2s ease;
}

.lista li:hover {
  background-color: #ececec;
}

.lista li.cinza {
  background-color: #f4f4f4;
}

.logout {
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  background-color: #2734AF;
  color: #fff;
  border: none;
  cursor: pointer;
  align-self: center;
  transition: background 0.2s;
}

.logout:hover {
  background-color: #1d268f;
}

.dialog-card {
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.dialog-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2734AF;
}

.dialog-text p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #333;
}

.dialog-btn {
  color: #2734AF;
  font-weight: 500;
}

@media (max-width: 600px) {
  .dialog-card {
    padding: 0.75rem;
  }
  .dialog-title {
    font-size: 1.1rem;
  }
  .dialog-text p {
    font-size: 0.9rem;
  }
}
</style>
