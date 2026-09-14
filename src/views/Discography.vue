<script setup>
import { ref, computed } from 'vue'
import database from '../data/database.json'

const allReleases = ref(database.releases)
const artists = ref(database.artists)
const activeFilter = ref('ALL')

const getArtistName = (artistId) => {
  const artist = artists.value.find(a => a.id === artistId)
  return artist ? artist.name : 'Unknown Artist'
}

const filteredReleases = computed(() => {
  let list = allReleases.value

  if (activeFilter.value !== 'ALL') {
    list = list.filter(release => {
      const artist = artists.value.find(a => a.id === release.artist_id)
      if (!artist) return false
      const isDistro = artist.type.toLowerCase().includes("distribution")
      if (activeFilter.value === 'LABEL') return !isDistro
      if (activeFilter.value === 'DISTRIBUTION') return isDistro
    })
  }

  return [...list].sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
})

const getPlasticStyle = (id) => {
  if (!id) return {}
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const textureNum = (absHash % 4) + 1;
  const rotations = [0, 90, 180, 270];
  const rotation = rotations[absHash % 4];
  const scaleX = (absHash % 2) === 0 ? 1 : -1;
  const scaleY = (absHash % 3) === 0 ? 1 : -1;

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
      <router-link v-for="release in filteredReleases" :key="release.id" :to="'/release/' + release.id" class="release-card">
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