import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router' // On importe le routeur

const app = createApp(App)
app.use(router) // On l'active
app.mount('#app')