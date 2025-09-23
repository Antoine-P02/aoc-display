import { createRouter, createWebHistory } from 'vue-router'
import UserPage from './components/user/UserPage.vue'
import LandingPage from './components/chats/LandingPage.vue'
import AOCPage from './components/aoc/AOCPage.vue'
import Breakout from './components/games/Breakout.vue'
import ChatPage from './components/chats/ChatPage.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/', component: AOCPage },
  { path: '/aoc', component: AOCPage },
  { path: '/feed', component: AOCPage },
  { path: '/quest', component: AOCPage },
  { path: '/login', component: LandingPage },
  { path: '/chat', component: ChatPage },
  { path: '/user', component: UserPage },
  { path: '/game', component: Breakout },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
