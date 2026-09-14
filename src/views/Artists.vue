<script setup>
import { ref, computed } from 'vue'
import database from '../data/database.json'



const allArtists = ref(database.artists)

const labelRoster = computed(() => allArtists.value.filter(a => !a.type.toLowerCase().includes("distribution")))
const distroRoster = computed(() => allArtists.value.filter(a => a.type.toLowerCase().includes("distribution")))

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
      <h1 style="margin: 0;">ROSTER & PARTNERS</h1>
    </div>

    <!-- NOTRE NOUVEAU WRAPPER RESPONSIVE -->
    <div class="roster-split">
      
      <!-- COLONNE 1 : GATO ROSTER -->
      <div class="roster-column">
        <h2 class="roster-category-title">GATO ROSTER</h2>
        <div class="artist-grid">
          <router-link v-for="artist in labelRoster" :key="artist.id" :to="'/artist/' + artist.id" class="release-card">
            <div class="artist-cover">
            <img v-if="artist.image" :src="getImageUrl(artist.image)" :alt="artist.name">
            </div>
            <div class="release-info">
              <h3>{{ artist.name }}</h3>
              <p>{{ artist.role }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- COLONNE 2 : DISTRIBUTION -->
      <div class="roster-column">
        <h2 class="roster-category-title">PARTNERS</h2>
        <div class="artist-grid">
          <router-link v-for="artist in distroRoster" :key="artist.id" :to="'/artist/' + artist.id" class="release-card">
            <div class="artist-cover">
              <img v-if="artist.image" :src="getImageUrl(artist.image)" :alt="artist.name">
            </div>
            <div class="release-info">
              <h3>{{ artist.name }}</h3>
              <p>{{ artist.role }}</p>
            </div>
          </router-link>
        </div>
      </div>

    </div> <!-- Fin du roster-split -->
  </div>
</template>

<style scoped>
.roster-category-title {
  font-size: 1.2rem; 
  font-family: var(--font-ui); 
  font-weight: 900;
  border-bottom: 2px solid var(--gato-black); 
  padding-bottom: 5px; 
  
  /* L'alignement parfait : on annule la marge haute par défaut */
  margin-top: 0; 
  margin-bottom: 30px; 
  
  /* Permet à la ligne noire de prendre 100% de la largeur de la colonne */
  display: block; 
}
</style>