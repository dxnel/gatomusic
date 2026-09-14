<script setup>
import { ref } from 'vue'
import database from '../data/database.json'

const projects = ref(database.projects || [])

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('public') || imagePath.startsWith('http')) {
    return imagePath.startsWith('public') ? imagePath.replace('public', '') : imagePath
  }
  if (imagePath.startsWith('src/assets/')) {
    return new URL(`../assets/${imagePath.replace('src/assets/', '')}`, import.meta.url).href
  }
  return imagePath
}
</script>

<template>
  <div class="section">
    <div class="section-header">
      <h1 style="margin: 0;">PROJECTS</h1>
    </div>

    <div v-if="projects.length === 0" class="warning-label" style="margin-top: 40px;">
      NO PUBLIC PROJECTS AT THIS TIME. ACCESS RESTRICTED.
    </div>

    <!-- LA NOUVELLE GRILLE COMPACTE -->
    <div v-else class="projects-grid">
      <router-link 
        v-for="project in projects" 
        :key="project.id" 
        :to="'/project/' + project.id" 
        class="project-card"
      >
        <!-- L'image en haut de la carte -->
        <div class="project-visual">
          <div class="gato-sticker">{{ project.type }}</div>
          <img v-if="project.thumbnail" :src="getImageUrl(project.thumbnail)" :alt="project.title">
        </div>

        <!-- Les infos en dessous -->
        <div class="project-info">
          <h2>{{ project.title }}</h2>
          
          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">CLIENT</span>
              <span class="meta-value">{{ project.client }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">ROLE</span>
              <span class="meta-value">{{ project.role }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">DATE</span>
              <span class="meta-value">{{ project.date }}</span>
            </div>
          </div>
          
          
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   PROJECTS GRID (Beaucoup plus compact)
   ========================================= */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.project-card {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--gato-black);
  background-color: #e8e3d8;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.1); 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: inherit;
  text-decoration: none;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 10px 10px 0px rgba(0,0,0,0.15);
}

.project-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9; /* Format classique propre */
  border-bottom: 4px solid var(--gato-black);
  background-color: var(--gato-black);
  overflow: hidden;
}

.project-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-visual img {
  opacity: 0.85;
}

.project-visual .gato-sticker {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.project-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permet au bouton de s'aligner en bas si les cartes ont des tailles différentes */
}

.project-info h2 {
  font-family: "Instrument Serif", serif;
  font-size: 2rem; /* Plus petit ! */
  font-weight: normal;
  text-transform: none;
  margin: 0 0 15px 0;
  line-height: 1;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  gap: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 4px;
}

.meta-label {
  font-weight: bold;
  color: #888;
  font-size: 0.7rem;
  letter-spacing: 1px;
  width: 50px;
}

.meta-value {
  font-weight: 900;
  font-size: 0.8rem;
  color: var(--gato-black);
}

.project-btn {
  margin-top: auto;
  align-self: flex-start;
  font-size: 0.75rem;
  padding: 8px 16px;
}
</style>