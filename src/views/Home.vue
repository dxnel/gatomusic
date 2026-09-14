<script setup>
import { ref, computed } from 'vue'
import database from '../data/database.json'

const hero = ref(database.hero || {})
const allReleases = ref(database.releases)
const artists = ref(database.artists)
// On charge les services (capabilities) depuis le JSON
const services = ref(database.packaging_info.capabilities)

// On prend seulement les 3 premières sorties pour l'accueil
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

// Vérifie si le média en fond est une vidéo
const isVideo = computed(() => {
  if (!heroData.value || !heroData.value.background_media) return false
  return heroData.value.background_media.match(/\.(mp4|webm)$/i)
})

// Fonction pour générer un "faux aléatoire" basé sur l'ID
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
    <!-- LE WARNING LABEL EXCLUSIF À L'ACCUEIL -->
    <div class="warning-label">
      WARNING: HIGHLY ADDICTIVE MATERIAL. MAY CAUSE SEVERE EMOTIONAL DISTORTION AND SENSORY OVERLOAD. <span style="display:block">DO NOT PLAY AT LOW VOLUMES.</span>
    </div>

    <!-- CAROUSEL PUBLICITAIRE -->
    <!-- SECTION HERO CUSTOMISABLE -->
    <div class="hero">
      
      <!-- Fond : Image ou Vidéo selon le choix -->
      <div class="hero-bg">
        <video v-if="hero.mediaType === 'video'" :src="hero.mediaUrl" autoplay muted loop playsinline></video>
        <img v-else :src="hero.mediaUrl" :alt="hero.title">
      </div>

      <div class="hero-overlay"></div>

      <!-- Contenu du Hero -->
      <div class="hero-content">
        <div class="hero-tag" v-if="hero.tag">{{ hero.tag }}</div>
        <h1 class="hero-title">{{ hero.title }}</h1>
        
        <!-- Petite description optionnelle -->
        <p class="hero-desc" v-if="hero.description">{{ hero.description }}</p>

        <!-- Boutons multiples personnalisables (Max 2) -->
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

    <!-- MANIFESTO GATO & STATS & SERVICES -->
    <section class="section gato-manifesto">
      <div class="manifesto-grid">
        <!-- Colonne Gauche : About -->
        <div class="manifesto-text">
          <h2>WHAT IS GATO?</h2>
          <p>
            GATO IS AN INDEPENDENT RECORD LABEL, ARTIST MANAGEMENT, AND GLOBAL MUSIC DISTRIBUTION PIPELINE BASED IN SWITZERLAND. 
            WE ARCHITECT AUDIO CAMPAIGNS, ENGINEER HIGH-FIDELITY SOUND, AND CURATE VISUAL WORLDS FOR OUR ROSTER.
          </p>
        </div>

        <!-- Colonne Droite : Statistiques -->
        <div class="stats-box">
          <div class="stat-item"><span class="stat-number">6</span><span class="stat-label">ARTISTS & PARTNERS</span></div>
          <div class="stat-item"><span class="stat-number">13</span><span class="stat-label">RELEASES</span></div>
          <div class="stat-item"><span class="stat-number">22K+</span><span class="stat-label">TOTAL STREAMS</span></div>
        </div>
      </div>

      <!-- LA GRILLE DES SERVICES (En dessous des stats) -->
      <div class="services-grid">
        <div class="cap-item" v-for="cap in services" :key="cap.service">
          <div class="cap-tag">{{ cap.service }}</div>
          <div class="cap-desc">{{ cap.desc }}</div>
        </div>
      </div>
    </section>

    <!-- LATEST RELEASES -->
    <section class="section">
      <div class="section-header">
        <h2>LATEST RELEASES</h2>
        <router-link to="/discography" style="color: var(--gato-red); font-weight: bold; text-decoration: none;">
          VIEW ALL ↗
        </router-link>
      </div>

      <div class="grid-discographie">
        <!-- BOUCLE SUR LES 3 DERNIÈRES RELEASES -->
        <router-link 
          v-for="release in latestReleases" 
          :key="release.id" 
          :to="'/release/' + release.id"
          class="release-card"
        >
          <!-- ICI : ON AFFICHE LA VRAIE POCHETTE AVEC L'EFFET 3D -->
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