<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import database from '../data/database.json'

const route = useRoute()
const artist = computed(() => database.artists.find(a => a.id === route.params.id))

const artistReleases = computed(() => {
  if (!artist.value) return []
  return database.releases
    .filter(r => r.artist_id === artist.value.id || r.artist === artist.value.name)
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
})

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

const getPlasticStyle = (id) => {
  if (!id) return {}
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  const absHash = Math.abs(hash)
  const rotations = [0, 90, 180, 270]
  
  return {
    '--plastic-bg': `url('/assets/plastic${(absHash % 4) + 1}.jpeg')`,
    '--plastic-transform': `rotate(${rotations[absHash % 4]}deg) scale(${(absHash % 2) === 0 ? 1 : -1}, ${(absHash % 3) === 0 ? 1 : -1})`
  }
}

const getPlatformColor = (platform) => {
  const p = platform.toLowerCase()
  if (p === 'spotify') return '#1DB954'
  if (p === 'youtube') return '#FF0000'
  if (p === 'tiktok') return '#fe2858'
  if (p === 'instagram') return '#E1306C'
  if (p === 'soundcloud') return '#FF5500' 
  if (p === 'linktree') return '#43E660'   
  return '' 
}
</script>

<template>
  <div v-if="artist">
    <router-link to="/artists" class="gato-back">← BACK TO ROSTER</router-link>

    <div class="split-layout">
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
        <p class="split-desc" v-html="artist.desc || 'NO DESCRIPTION AVAILABLE YET.'"></p>

        <div class="artist-socials" v-if="artist.socials">
          <a 
            v-for="(link, platform) in artist.socials" 
            :key="platform" 
            :href="link" 
            target="_blank" 
            class="gato-btn social-btn"
            :class="{ 'icon-only': ['spotify', 'instagram', 'youtube', 'tiktok', 'soundcloud', 'linktree'].includes(platform.toLowerCase()) }"
            :style="{ backgroundColor: getPlatformColor(platform) }"
          >
            <!-- SPOTIFY -->
            <svg v-if="platform.toLowerCase() === 'spotify'" class="btn-icon" viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
              <path d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/>
            </svg>
            <!-- INSTAGRAM -->
            <svg v-else-if="platform.toLowerCase() === 'instagram'" class="btn-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <!-- YOUTUBE -->
            <svg v-else-if="platform.toLowerCase() === 'youtube'" class="btn-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <!-- TIKTOK -->
            <svg v-else-if="platform.toLowerCase() === 'tiktok'" class="btn-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.53-.42 3.11-1.37 4.31-1.09 1.39-2.73 2.29-4.5 2.5-1.92.23-3.95-.12-5.5-1.29-1.55-1.16-2.58-2.9-2.9-4.78-.34-2.02.09-4.18 1.25-5.83 1.26-1.8 3.32-2.9 5.5-3.05v4.06c-1.07.13-2.14.7-2.76 1.59-.6.86-.81 1.95-.58 2.97.23 1.01.89 1.88 1.77 2.41 1.03.62 2.33.68 3.42.27 1.14-.42 2.01-1.4 2.29-2.57.1-.41.13-.84.14-1.27V.02z"/>
            </svg>
            <!-- SOUNDCLOUD -->
            <svg v-else-if="platform.toLowerCase() === 'soundcloud'" class="btn-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.66 10.71a3.82 3.82 0 0 0 -0.68 0.07 5.47 5.47 0 0 0 -5.39 -4.4 5.56 5.56 0 0 0 -2 0.37 0.84 0.84 0 0 0 -0.6 0.8v9a0.84 0.84 0 0 0 0.8 0.83h7.85a3.33 3.33 0 0 0 0 -6.66Z"></path>
              <path d="M9.74 7.11a0.75 0.75 0 0 0 -0.74 0.75v9a0.75 0.75 0 0 0 1.5 0v-9a0.76 0.76 0 0 0 -0.76 -0.75Z"></path>
              <path d="M6.75 8.61a0.75 0.75 0 0 0 -0.75 0.75v7.51a0.75 0.75 0 0 0 1.5 0V9.36a0.76 0.76 0 0 0 -0.75 -0.75Z"></path>
              <path d="M3.75 10.61a0.76 0.76 0 0 0 -0.75 0.75v5.51a0.75 0.75 0 0 0 1.5 0v-5.51a0.75 0.75 0 0 0 -0.75 -0.75Z"></path>
              <path d="M0.76 11.61a0.76 0.76 0 0 0 -0.75 0.75v4a0.75 0.75 0 0 0 0.75 0.75 0.74 0.74 0 0 0 0.75 -0.75v-4a0.75 0.75 0 0 0 -0.75 -0.75Z"></path>
            </svg>
            <!-- LINKTREE -->
            <svg v-else-if="platform.toLowerCase() === 'linktree'" class="btn-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="m13.73635 5.85251 4.00467 -4.11665 2.3248 2.3808 -4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766 -2.3248 2.3338L12.0005 12.099l-5.74052 5.76852 -2.3248 -2.3248 4.22864 -4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248 -2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"></path>
            </svg>
            
            <span v-else>{{ platform }}</span>
          </a>
        </div>
      </div>
    </div>

    <div v-if="artistReleases.length > 0">
      <div class="section-header">
        <h2>DISCOGRAPHY</h2>
      </div>
      
      <div class="grid-discographie">
        <router-link v-for="release in artistReleases" :key="release.id" :to="'/release/' + release.id" class="release-card">
          <div class="cover-physique interactive-cover" :style="getPlasticStyle(release.id)">
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
  transform: translateZ(0);
  backface-visibility: hidden;
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

.artist-socials {
  display: flex; 
  gap: 10px; 
  flex-wrap: wrap; 
  margin-top: 15px;
}

@media (max-width: 768px) {
  .split-info .split-title, 
  .split-info .split-subtitle {
    text-align: center;
  }
  
  .artist-socials {
    justify-content: center;
    margin-bottom: 20px;
  }

  .split-info .split-desc {
    margin: 0 auto 25px auto;
    width: 90%;
  }
}
</style>