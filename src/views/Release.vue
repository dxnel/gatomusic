<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import database from '../data/database.json'

const route = useRoute()
const release = computed(() => database.releases.find(r => r.id === route.params.id))

const artistInfo = computed(() => {
  if (!release.value) return { name: 'Unknown Artist', id: null }
  const artist = database.artists.find(a => a.id === release.value.artist_id)
  return {
    name: artist?.name || 'Unknown Artist',
    id: release.value.artist_id
  }
})

// Ajout du fix image au cas où tu utilises src/assets/ pour tes covers
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

// Fonction aléatoire plastifiée nettoyée et raccourcie
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
</script>

<template>
  <div v-if="release">
    <router-link to="/discography" class="gato-back">← BACK TO DISCOGRAPHY</router-link>

    <div class="split-layout">
      
      <!-- COLONNE GAUCHE -->
      <div class="split-left">
        <div class="split-visual interactive-cover" :style="getPlasticStyle(release.id)">
          <img v-if="release.cover" :src="getImageUrl(release.cover)" :alt="release.title">
        </div>

        <!-- BOUTONS UNIQUEMENT SUR PC (desktop-buttons) -->
        <div class="release-actions desktop-buttons" v-if="release.links?.length">
          <a v-for="(link, index) in release.links" :key="index" :href="link.url" target="_blank" class="gato-btn full-width" :class="{ 'green-btn': index === 0 }">
            <svg v-if="index === 0" class="btn-icon" viewBox="0 0 256 256" width="20" height="20">
              <path fill="#FFFFFF" d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/>
            </svg>
            <span>{{ link.text }}</span>
          </a>
        </div>
      </div>

      <!-- COLONNE DROITE : INFOS -->
      <div class="split-info">
        <h1 class="split-title title-serif">{{ release.title }}</h1>
        <h2 class="split-subtitle">
          <router-link v-if="artistInfo.id" :to="'/artist/' + artistInfo.id" class="artist-link">{{ artistInfo.name }}</router-link>
          <span v-else>{{ artistInfo.name }}</span>
          • {{ release.format }} • {{ release.release_date }}
        </h2>
        
        <p class="split-desc" v-if="release.desc" v-html="release.desc"></p>

        <!-- BOUTONS UNIQUEMENT SUR MOBILE (mobile-buttons) -->
        <div class="release-actions mobile-buttons" v-if="release.links?.length">
          <a v-for="(link, index) in release.links" :key="index" :href="link.url" target="_blank" class="gato-btn full-width" :class="{ 'green-btn': index === 0 }">
            <svg v-if="index === 0" class="btn-icon" viewBox="0 0 256 256" width="20" height="20">
              <path fill="#FFFFFF" d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/>
            </svg>
            <span>{{ link.text }}</span>
          </a>
        </div>

        <div class="tracklist-section" v-if="release.tracklist?.length">
          <h3 class="section-mini-title">TRACKLIST</h3>
          <ul class="tracklist-list">
            <li v-for="(track, index) in release.tracklist" :key="index">{{ track }}</li>
          </ul>
        </div>

        <div class="credits-section" v-if="release.credits">
          <h3 class="section-mini-title">CREDITS</h3>
          <div class="credits-grid">
            <div class="credit-item" v-for="(value, role) in release.credits" :key="role">
              <span class="credit-role">{{ role }}</span>
              <span class="credit-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <div class="copyright-text" v-if="release.copyright">
          {{ release.copyright }}
        </div>
      </div>
    </div>

    <!-- NOUVELLE SECTION VISUALS (En dessous du split-layout pour respirer) -->
    <div class="visuals-section" v-if="release.videos && release.videos.length">
      <div class="section-header">
        <h2>VISUALS</h2>
      </div>
      
      <!-- Grille dynamique : s'il y a 1 vidéo elle prend tout, si plusieurs ça fait une grille -->
      <div class="videos-grid" :class="{'single-video': release.videos.length === 1}">
        <div class="video-container" v-for="(vid, index) in release.videos" :key="index">
          <h3 class="video-title">{{ vid.title }}</h3>
          <div class="iframe-wrapper">
            <iframe 
              :src="'https://www.youtube.com/embed/' + vid.youtube_id" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else>
    <div class="section-header"><h1>RELEASE NOT FOUND.</h1></div>
  </div>
</template>