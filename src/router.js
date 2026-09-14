import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Discography from './views/Discography.vue'
import Release from './views/Release.vue'
import Artists from './views/Artists.vue'
import Artist from './views/Artist.vue' 
import Projects from './views/Projects.vue'
import Project from './views/Project.vue'
import About from './views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'GATO' } },
  { path: '/discography', name: 'Discography', component: Discography, meta: { title: 'Discography | GATO' } },
  { path: '/release/:id', name: 'Release', component: Release, meta: { title: 'Release | GATO' } },
  { path: '/artists', name: 'Artists', component: Artists, meta: { title: 'Roster | GATO' } },
  { path: '/artist/:id', name: 'Artist', component: Artist, meta: { title: 'Artist | GATO' } },
  { path: '/projects', name: 'Projects', component: Projects, meta: { title: 'Projects | GATO' } },
  { path: '/project/:id', name: 'Project', component: Project, meta: { title: 'Project | GATO' } },
  { path: '/about', name: 'About', component: About, meta: { title: 'About | GATO' } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { top: 0 }
  }
})

// CETTE LIGNE CHANGE LE TITRE DE L'ONGLET AUTOMATIQUEMENT
router.afterEach((to) => {
  document.title = to.meta.title || 'GATO';
})