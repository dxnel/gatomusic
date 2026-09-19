<script setup>
import { ref, computed } from 'vue'
import database from '../data/database.json'

const hero = ref(database.hero || {})
const allReleases = ref(database.releases)
const artists = ref(database.artists)
const services = ref(database.packaging_info.capabilities)

const latestReleases = computed(() => {
  const sorted = [...allReleases.value].sort((a, b) => {
    return new Date(b.release_date) - new Date(a.release_date)
  })
  return sorted.slice(0, 3)
})

const getArtistName = (artistId) => {
  const artist = artists.value.find(a => a.id === artistId)
  return artist ? artist.name : 'Unknown Artist'
}

const isVideo = computed(() => {
  if (!hero.value || !hero.value.background_media) return false
  return hero.value.background_media.match(/\.(mp4|webm)$/i)
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

// --- SYSTÈME DE BOUTON CAMÉLÉON ---
const getButtonConfig = (action) => {
  const configs = {
    'spotify': {
      bgClass: 'btn-spotify',
      defaultText: 'STREAM NOW',
      // Icône SVG Spotify minimaliste
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.361.181.54.78.301 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z"/></svg>`
    },
    'store': {
      bgClass: 'btn-store',
      defaultText: 'BUY PHYSICAL',
      // Icône Disque/Store
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3"/></svg>`
    },
    'tickets': {
      bgClass: 'btn-tickets',
      defaultText: 'GET TICKETS',
      // Icône Ticket
      icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 4h16v6c-1.1 0-2 .9-2 2s.9 2 2 2v6H4v-6c1.1 0 2-.9 2-2s-.9-2-2-2v-6zm2 4v8h12V8H6z" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
    }
  }
  
  // Par défaut, si l'action n'est pas reconnue, ça donne un bouton GATO standard
  return configs[action] || {
    bgClass: 'btn-default',
    defaultText: 'DISCOVER',
    icon: '' 
  }
}
</script>

<template>
  <div>
    <div class="warning-label slap-sticker">
  <span class="sticker-text">
    WARNING: HIGHLY ADDICTIVE MATERIAL. MAY CAUSE SEVERE<br>
    EMOTIONAL DISTORTION AND SENSORY OVERLOAD.<br>
    DO NOT PLAY AT LOW VOLUMES.
  </span>
</div>

    <div class="billboard-wrapper" v-if="hero.mediaUrl">
      <a :href="hero.linkUrl" target="_blank" class="hero-billboard">
        
        <video v-if="hero.mediaType === 'video'" :src="hero.mediaUrl" autoplay muted loop playsinline></video>
        <img v-else :src="hero.mediaUrl" alt="GATO Promo">
        
      </a>
    </div>

    <section class="section gato-manifesto">
      <div class="manifesto-grid">
        <div class="manifesto-text">
          <h2>WHAT IS GATO?</h2>
          <p>
            GATO IS AN INDEPENDENT RECORD LABEL AND CREATIVE HOUSE BASED IN SWITZERLAND. A DEDICATED STRUCTURE BUILT AROUND A CORE ROSTER OF ARTISTS.
          </p>
        </div>

        <div class="stats-box">
          <div class="stat-item"><span class="stat-number">6</span><span class="stat-label">ARTISTS & PARTNERS</span></div>
          <div class="stat-item"><span class="stat-number">13</span><span class="stat-label">RELEASES</span></div>
          <div class="stat-item"><span class="stat-number">100%</span><span class="stat-label">INDEPENDENT</span></div>
        </div>
      </div>

      <div class="services-grid">
        <div class="cap-item" v-for="cap in services" :key="cap.service">
          <div class="cap-tag">{{ cap.service }}</div>
          <div class="cap-desc">{{ cap.desc }}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>LATEST RELEASES</h2>
        <router-link to="/discography" style="color: var(--gato-red); font-weight: bold; text-decoration: none;">
          VIEW ALL
        </router-link>
      </div>

      <div class="grid-discographie">
        <router-link 
          v-for="release in latestReleases" 
          :key="release.id" 
          :to="'/release/' + release.id"
          class="release-card"
        >
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
    </section>
  </div>


</template>