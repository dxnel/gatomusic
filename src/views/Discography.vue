<script setup>
import { ref, computed } from 'vue'
import database from '../data/database.json'

const allReleases = ref(database.releases)
const artists = ref(database.artists)
const activeFilter = ref('ALL') // Le filtre par défaut

const getArtistName = (artistId) => {
  const artist = artists.value.find(a => a.id === artistId)
  return artist ? artist.name : 'Unknown Artist'
}

// LOGIQUE DE FILTRAGE
const filteredReleases = computed(() => {
  let list = allReleases.value

  // Filtrage Label / Distribution
  if (activeFilter.value !== 'ALL') {
    list = list.filter(release => {
      const artist = artists.value.find(a => a.id === release.artist_id)
      if (!artist) return false
      const isDistro = artist.type.toLowerCase().includes("distribution")
      if (activeFilter.value === 'LABEL') return !isDistro
      if (activeFilter.value === 'DISTRIBUTION') return isDistro
    })
  }

  // Tri par date (du plus récent au plus ancien)
  return [...list].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
  
})

// Fonction pour générer un "faux aléatoire" basé sur l'ID de l'item
const getPlasticStyle = (id) => {
  if (!id) return {}
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  
  // On choisit la texture (1 à 4)
  const textureNum = (absHash % 4) + 1;
  
  const rotations = [0, 90, 180, 270];
  const rotation = rotations[absHash % 4];
  const scaleX = (absHash % 2) === 0 ? 1 : -1;
  const scaleY = (absHash % 3) === 0 ? 1 : -1;

  // LE SECRET EST ICI : Le "/" initial pointe directement vers le dossier "public" !
  return {
    '--plastic-bg': `url('/assets/plastic${textureNum}.jpeg')`,
    '--plastic-transform': `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`
  }
}

</script>

<template>
  <div class="section">
    <div class="section-header">
      <h1 style="margin: 0;">DISCOGRAPHY</h1>
      <div class="filters">
        <span :class="{ active: activeFilter === 'ALL' }" @click="activeFilter = 'ALL'">ALL</span> 
        <span class="filter-sep">|</span> 
        <span :class="{ active: activeFilter === 'LABEL' }" @click="activeFilter = 'LABEL'">GATO</span> 
        <span class="filter-sep">|</span> 
        <span :class="{ active: activeFilter === 'DISTRIBUTION' }" @click="activeFilter = 'DISTRIBUTION'">DISTRIBUTION</span>
      </div>
    </div>

    <div class="grid-discographie">
      <!-- On boucle sur les sorties FILTRÉES -->
      <router-link v-for="release in filteredReleases" :key="release.id" :to="'/release/' + release.id" class="release-card">
        
        <!-- On ajoute "interactive-cover" et la VRAIE image -->
        <div class="cover-physique interactive-cover" :style="getPlasticStyle(release.id)">
          <img v-if="release.cover" :src="release.cover" :alt="release.title">
          <span v-else>GATO</span>
        </div>
        
        <div class="release-info">
          <h3>{{ release.title }}</h3>
          <p>{{ getArtistName(release.artist_id) }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>