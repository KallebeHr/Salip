import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // ⬅️ ADICIONE ISSO
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

let app

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.use(vuetify) 
    app.mount('#app')
  }
})
