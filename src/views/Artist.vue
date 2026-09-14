<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import database from '../data/database.json'

const route = useRoute()
const artist = computed(() => database.artists.find(a => a.id === route.params.id))

// On récupère sa discographie
const artistReleases = computed(() => {
  if (!artist.value) return []
  return database.releases
    .filter(r => r.artist_id === artist.value.id || r.artist === artist.value.name)
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
})

// NOUVEAU : On récupère ses projets GATO liés à son artist_id
const artistProjects = computed(() => {
  if (!artist.value || !database.projects) return []
  return database.projects.filter(p => p.artist_id === artist.value.id)
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('public') || imagePath.startsWith('http')) {
    return imagePath.startsWith('public') ? imagePath.replace('public', '') : imagePath
  }
  if (imagePath.startsWith('src/assets/')) {
    const path = imagePath.replace('src/assets/', '')
    return new URL(`../assets/${path}`, import.meta.url).href
  }
  return imagePath
}
</script>

<template>
  <div v-if="artist">
    <router-link to="/artists" class="gato-back">← BACK TO ROSTER</router-link>

    <div class="split-layout">
      <!-- LE WRAPPER QUI FIX LE BUG DE HOVER -->
      <div class="split-visual-wrapper">
        <div class="split-visual artist-visual">
          <div class="gato-sticker" :class="{'black': artist.type.toLowerCase().includes('distribution')}">
            {{ artist.type }}
          </div>
          <img v-if="artist.image" :src="getImageUrl(artist.image)" :alt="artist.name">
        </div>
      </div>

      <div class="split-info">
        <h1 class="split-title title-serif">{{ artist.name }}</h1>
        <h2 class="split-subtitle">{{ artist.role }}</h2>
        <p class="split-desc">{{ artist.desc || 'NO DESCRIPTION AVAILABLE YET.' }}</p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;" v-if="artist.socials">
          <a v-for="(link, platform) in artist.socials" :key="platform" :href="link" target="_blank" class="gato-btn social-btn">
            {{ platform }} ↗
          </a>
        </div>
      </div>
    </div>

    <!-- LA DISCOGRAPHIE -->
    <div v-if="artistReleases.length > 0">
      <div class="section-header">
        <h2>DISCOGRAPHY</h2>
      </div>
      
      <div class="grid-discographie">
        <router-link v-for="release in artistReleases" :key="release.id" :to="'/release/' + release.id" class="release-card">
          <div class="cover-physique interactive-cover">
            <img v-if="release.cover" :src="getImageUrl(release.cover)" :alt="release.title">
            <span v-else>GATO</span>
          </div>
          <div class="release-info">
            <h3>{{ release.title }}</h3>
            <p>{{ release.format || 'RELEASE' }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- NOUVEAU : LES PROJETS DE L'ARTISTE (S'IL Y EN A) -->
    <div v-if="artistProjects.length > 0" class="artist-projects-section">
      <div class="section-header">
        <h2>PROJECTS</h2>
      </div>
      
      <div class="projects-grid">
        <router-link 
          v-for="project in artistProjects" 
          :key="project.id" 
          :to="'/project/' + project.id" 
          class="project-card"
        >
          <div class="project-visual">
            <div class="gato-sticker">{{ project.type }}</div>
            <img v-if="project.thumbnail" :src="getImageUrl(project.thumbnail)" :alt="project.title">
          </div>
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.role }} • {{ project.date }}</p>
          </div>
        </router-link>
      </div>
    </div>

  </div>
  
  <div v-else>
    <div class="section-header"><h1>ARTIST NOT FOUND.</h1></div>
  </div>
</template>

<style scoped>
/* =========================================
   GRILLE DES PROJETS DANS LA PAGE ARTISTE
   ========================================= */
.artist-projects-section {
  margin-top: 60px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.project-card {
  display: flex;
  flex-direction: column;
  border: 3px solid var(--gato-black);
  background-color: #e8e3d8;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 10px 10px 0px rgba(0,0,0,0.15);
  z-index: 10;
}

.project-visual {
  width: 100%;
  aspect-ratio: 16/9;
  border-bottom: 3px solid var(--gato-black);
  background-color: var(--gato-black);
  position: relative;
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
  padding: 15px;
}

.project-info h3 {
  font-family: "Instrument Serif", serif;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
  font-weight: normal;
  text-transform: none;
}

.project-info p {
  margin: 0;
  font-size: 0.75rem;
  font-weight: bold;
  color: #888;
}
</style>