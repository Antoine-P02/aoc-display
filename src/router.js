import { createRouter, createWebHistory } from 'vue-router'
import UserPage from './components/user/UserPage.vue'
import LandingPage from './components/chats/LandingPage.vue'
import AOCPage from './components/aoc/AOCPage.vue'
import Breakout from './components/games/Breakout.vue'
import LayoutDemo from './components/chats/LayoutDemo.vue'
import ChatPage from './components/chats/ChatPage.vue'

const routes = [
  { path: '/', component: AOCPage },
  { path: '/aoc', component: AOCPage },
  { path: '/feed', component: AOCPage },
  { path: '/login', component: LandingPage },
  { path: '/chat', component: ChatPage },
  { path: '/user', component: UserPage },
  { path: '/game', component: Breakout },
  { path: '/layout-demo', component: LayoutDemo }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
