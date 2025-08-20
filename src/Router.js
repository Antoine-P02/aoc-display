import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'
import AOCPage from './components/aoc/AOCPage.vue'
import DebugChat from './components/chats/DebugChat.vue'

const routes = [
    { path: '/', name: 'AOC', component: AOCPage },
    { path: '/Home', name: 'Home', component: App },
    { path: '/Chats', name: 'Chats', component: DebugChat }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
