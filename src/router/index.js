import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { isUserAuthenticated } from '@/auth-guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const isProtected = to.path === '/listaUsuarios'

  if (!isProtected) return next()

  const isLogged = await isUserAuthenticated()

  if (!isLogged) {
    console.warn('Acesso negado. Redirecionando...')
    return next('/')
  }

  next()
})

export default router
