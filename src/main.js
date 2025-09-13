import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './index.css'
import 'vue3-emoji-picker/css'

createApp(App).use(router).mount('#app')
