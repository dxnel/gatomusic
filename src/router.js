import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Discography from './views/Discography.vue'
import Release from './views/Release.vue'
import Artists from './views/Artists.vue'
import Artist from './views/Artist.vue' 
import Projects from './views/Projects.vue'
import Project from './views/Project.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/discography', name: 'Discography', component: Discography },
  { path: '/release/:id', name: 'Release', component: Release },
  { path: '/artists', name: 'Artists', component: Artists },
  { path: '/artist/:id', name: 'Artist', component: Artist },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/project/:id', name: 'Project', component: Project }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    else return { top: 0 }
  }
})