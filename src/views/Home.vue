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

    <div class="hero">
      <div class="hero-bg">
        <video v-if="hero.mediaType === 'video'" :src="hero.mediaUrl" autoplay muted loop playsinline></video>
        <img v-else :src="hero.mediaUrl" :alt="hero.title">
      </div>

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-tag" v-if="hero.tag" v-html="hero.tag"></div>
        <h1 class="hero-title">{{ hero.title }}</h1>
        <p class="hero-desc" v-if="hero.description">{{ hero.description }}</p>

        <div class="hero-actions" v-if="hero.buttons && hero.buttons.length">
          <a 
            v-for="(btn, index) in hero.buttons.slice(0, 2)" 
            :key="index" 
            :href="btn.url" 
            class="gato-btn custom-hero-btn"
            :style="{ backgroundColor: btn.bgColor, color: btn.textColor }"
          >
            {{ btn.text }}
          </a>
        </div>
      </div>
    </div>

    <section class="section gato-manifesto">
      <div class="manifesto-grid">
        <div class="manifesto-text">
          <h2>WHAT IS GATO?</h2>
          <p>
            GATO IS AN INDEPENDENT RECORD LABEL, ARTIST COLLECTIVE, AND MANAGEMENT BASED IN SWITZERLAND. WE PUSH EMERGING TALENTS, BUILD RICH ARTISTIC UNIVERSES, AND HANDLE EVERYTHING FROM SOUND TO VISUALS.
          </p>
        </div>

        <div class="stats-box">
          <div class="stat-item"><span class="stat-number">6</span><span class="stat-label">ARTISTS & PARTNERS</span></div>
          <div class="stat-item"><span class="stat-number">13</span><span class="stat-label">RELEASES</span></div>
          <div class="stat-item"><span class="stat-number">22K+</span><span class="stat-label">TOTAL STREAMS</span></div>
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