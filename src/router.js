import { createRouter, createWebHistory } from 'vue-router'
import AOCPage from './components/aoc/AOCPage.vue'
import UserPage from './components/user/UserPage.vue'

const routes = [
  { path: '/', component: AOCPage },
  { path: '/user', component: UserPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
