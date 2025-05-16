<template>
  <div class="container">
    <!-- HEADER COM DADOS GERAIS E FILTROS -->
    <div class="dashboard-header">
      <div class="stat-box" @click="filtroAtual = 'todos'">
        <strong class="bntSerch">Total:</strong>
        <span>{{ usuariosOrdenados.length }}</span>
      </div>
      <div class="stat-box" @click="filtroAtual = 'aluno'">
        <strong class="bntSerch">Alunos:</strong>
        <span>{{ totalAlunos }}</span>
      </div>
      <div class="stat-box" @click="filtroAtual = 'funcionario'">
        <strong class="bntSerch">Funcionários:</strong>
        <span>{{ totalFuncionarios }}</span>
      </div>
      <div class="stat-box" @click="filtroAtual = 'visitante'">
        <strong class="bntSerch">Visitantes:</strong>
        <span>{{ totalVisitantes }}</span>
      </div>
    </div>

    <ul class="lista">
      <li
        v-for="(usuario, index) in usuariosFiltrados"
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
        <v-card-text class="dialog-text" v-if="usuarioSelecionado">
          <p><strong>Cidade:</strong> {{ usuarioSelecionado.cidade }}</p>
          <p><strong>UF:</strong> {{ usuarioSelecionado.uf }}</p>
          <p v-if="usuarioSelecionado.escola"><strong>Escola:</strong> {{ usuarioSelecionado.escola }}</p>
          <p v-if="usuarioSelecionado.localTrabalho"><strong>Trabalho:</strong> {{ usuarioSelecionado.localTrabalho }}</p>
          <p><strong>Data de Nascimento:</strong> {{ usuarioSelecionado.dataNascimento }}</p>
          <p><strong>Tipo:</strong> {{ usuarioSelecionado.tipoParticipante }}</p>
          <p v-if="usuarioSelecionado.eventosSelecionados && usuarioSelecionado.eventosSelecionados.length">
            <strong>Eventos:</strong> {{ usuarioSelecionado.eventosSelecionados.join(', ') }}
          </p>
          <p v-if="usuarioSelecionado.oficinasSelecionadas && Object.keys(usuarioSelecionado.oficinasSelecionadas).length">
            <strong>Oficinas:</strong>
            {{
              Object.entries(usuarioSelecionado.oficinasSelecionadas)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(', ')
            }}
          </p>
          <p v-if="usuarioSelecionado.exposicoesSelecionadas && Object.keys(usuarioSelecionado.exposicoesSelecionadas).length">
            <strong>Exposições:</strong>
            {{
              Object.entries(usuarioSelecionado.exposicoesSelecionadas)
                .map(([key, value]) => value)
                .filter(Boolean)
                .join(', ')
            }}
          </p>
          <p v-if="usuarioSelecionado.palestraSelecionada"><strong>Palestra:</strong> {{ usuarioSelecionado.palestraSelecionada }}</p>
          <p v-if="usuarioSelecionado.telefone"><strong>Telefone:</strong> {{ usuarioSelecionado.telefone }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="dialog-btn" text @click="dialogAberto = false">Fechar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn class="download" text @click="baixarExcel">Baixar Lista no EXCEL</v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const usuariosOrdenados = ref([])
const usuarioSelecionado = ref(null)
const dialogAberto = ref(false)
const filtroAtual = ref('todos')
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

const totalAlunos = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'aluno').length)
const totalFuncionarios = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'funcionario').length)
const totalVisitantes = computed(() => usuariosOrdenados.value.filter(u => u.tipoParticipante === 'visitante').length)

const usuariosFiltrados = computed(() => {
  if (filtroAtual.value === 'todos') return usuariosOrdenados.value
  return usuariosOrdenados.value.filter(u => u.tipoParticipante === filtroAtual.value)
})

const exportarParaExcel = (dados) => {
  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscritos');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, 'inscritos.xlsx');
};

const baixarExcel = () => {
  const dadosParaExportar = usuariosFiltrados.value.map(u => ({
    Nome: u.nomeCompleto || '',
    Cidade: u.cidade || '',
    UF: u.uf || '',
    Tipo: u.tipoParticipante || '',
    Escola: u.escola || '',
    Trabalho: u.localTrabalho || '',
    Eventos: u.evento || '',
    Oficinas: u.oficinaSelecionada || '',
    Exposicoes: u.exposicaoSelecionada || '',
    Palestras: Array.isArray(u.palestraSelecionada) ? u.palestraSelecionada.filter(p => p).join(', ') : (u.palestraSelecionada || ''),
    Telefone: u.telefone || '',
    DataNascimento: u.dataNascimento || '',
  }));

  exportarParaExcel(dadosParaExportar);
};


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
  gap: 1.5rem;
}

.dashboard-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-around;
  background: #f4f4f4;
  padding: 1rem;
  font-size: 0.95rem;
  border: 1px solid #ddd;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  color: #2734AF;
}
.bntSerch{
    cursor: pointer;
    padding: 5px;
    transition: .2s ease-in;
    margin: 5px;
    border-radius: 5px;
    
}
.bntSerch:hover{
    background: #5f5f5f5f;
    transition: .2s ease-in-out;
    transform: scale(1.1);

.bntSerch {
  cursor: pointer;
}
.cinza {
  background-color: #f5f5f5;
}
.lista {
  list-style: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}
.logout {
  margin-top: 20px;
  padding: 10px 15px;
  cursor: pointer;
}
.download {
  margin-top: 15px;
  padding: 10px 15px;
  cursor: pointer;
  background-color: #1976d2;
  color: white;
  border-radius: 4px;
}
.dialog-btn {
  cursor: pointer;
}
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
.download {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #198754;
  color: #fff;
  border: none;
  cursor: pointer;
  align-self: center;
  transition: background 0.3s;
}

.download:hover {
  background-color: #157347;
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
  .dashboard-header {
    flex-direction: column;
    align-items: center;
  }
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
