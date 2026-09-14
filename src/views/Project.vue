<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import database from '../data/database.json'

const route = useRoute()
const projectId = route.params.id
const project = computed(() => database.projects?.find(p => p.id === projectId))

// Fonction de résolution d'images
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

// LOGIQUE DE LA MODAL
const selectedImage = ref(null)

const openModal = (imgUrl) => {
  selectedImage.value = getImageUrl(imgUrl)
}

const closeModal = () => {
  selectedImage.value = null
}
</script>

<template>
  <div v-if="project">
    <router-link to="/projects" class="gato-back">← BACK TO PROJECTS</router-link>

    <!-- HAUT DE PAGE : TITRE ET INFOS -->
    <div class="project-header">
      <div class="gato-sticker">{{ project.type }}</div>
      <h1 class="title-serif project-main-title">{{ project.title }}</h1>
      <h2 class="split-subtitle">{{ project.client }} • {{ project.date }}</h2>
    </div>

    <!-- LE CONTENU D'ABORD -->
    <div class="project-details-grid">
      <div class="project-desc-col">
        <h3 class="section-mini-title">PROJECT OVERVIEW</h3>
       <p class="split-desc" v-html="project.desc || 'No description provided.'"></p>
        <div class="copyright-text" v-if="project.copyright" style="margin-top: 20px;">
          {{ project.copyright }}
        </div>
      </div>

      <div class="project-credits-col" v-if="project.credits">
        <h3 class="section-mini-title">CREDITS</h3>
        <div class="credits-grid">
          <div class="credit-item" v-for="(value, role) in project.credits" :key="role">
            <span class="credit-role">{{ role }}</span>
            <span class="credit-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- LE VISUEL MASSIF -->
    <div class="project-hero-media" v-if="project.main_media">
      
      <div v-if="project.main_media.type === 'youtube'" class="hero-iframe-wrapper">
        <iframe 
          :src="'https://www.youtube.com/embed/' + project.main_media.data" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      <!-- Ajout du click sur l'image unique -->
      <div v-else-if="project.main_media.type === 'image'" class="hero-image-wrapper">
        <img :src="getImageUrl(project.main_media.data)" :alt="project.title" class="clickable-img" @click="openModal(project.main_media.data)">
      </div>

      <!-- Ajout du click sur les images de la galerie -->
      <div v-else-if="project.main_media.type === 'gallery'" class="hero-gallery-wrapper">
        <img 
          v-for="(img, index) in project.main_media.data" 
          :key="index" 
          :src="getImageUrl(img)" 
          :alt="project.title + ' ' + (index + 1)"
          class="clickable-img"
          @click="openModal(img)"
        >
      </div>
      
      <div v-else-if="project.main_media.type === 'iframe'" class="hero-embed-wrapper" v-html="project.main_media.data"></div>
    </div>
    
    <div class="project-hero-media" v-else>
      <div class="hero-image-wrapper">
        <img :src="getImageUrl(project.thumbnail)" :alt="project.title" class="clickable-img" @click="openModal(project.thumbnail)">
      </div>
    </div>

    <!-- SECTION BTS & ARCHIVES -->
    <div v-if="project.bts_gallery && project.bts_gallery.length > 0" class="visuals-section">
      <div class="section-header">
        <h2>ARCHIVES</h2>
      </div>
      
      <div class="bts-grid">
        <div class="bts-item" v-for="(item, index) in project.bts_gallery" :key="index">
          <div class="bts-visual clickable-img" @click="openModal(item.image)">
            <img :src="getImageUrl(item.image)" alt="Behind the scenes">
          </div>
          <p class="bts-desc" v-if="item.desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <!-- LA MODAL PLEIN ÉCRAN -->
    <div v-if="selectedImage" class="gato-modal" @click="closeModal">
      <div class="modal-close">✕ CLOSE</div>
      <img :src="selectedImage" alt="Enlarged view" @click.stop>
    </div>

  </div>
  
  <div v-else>
    <div class="section-header"><h1>PROJECT NOT FOUND.</h1></div>
  </div>
</template>

<style scoped>
/* L'astuce pour indiquer que l'image peut s'agrandir */
.clickable-img {
  cursor: zoom-in;
}

/* =========================================
   LA MODAL (Plein écran brutaliste)
   ========================================= */
.gato-modal {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(17, 17, 17, 0.95);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  cursor: zoom-out;
  backdrop-filter: blur(5px);
}

.gato-modal img {
  max-width: 90vw;
  max-height: 90vh;
  border: 4px solid var(--gato-cream);
  box-shadow: 12px 12px 0px rgba(0,0,0,0.8);
  object-fit: contain;
  cursor: default;
}

.modal-close {
  position: absolute;
  top: 30px;
  right: 40px;
  color: var(--gato-cream);
  font-family: var(--font-ui);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--gato-red);
}

/* =========================================
   LE RESTE DU CSS CLASSIQUE DE PROJECT.VUE
   ========================================= */
.project-header { margin-bottom: 40px; }
.project-main-title { font-size: clamp(40px, 8vw, 90px); line-height: 0.9; margin: 15px 0 10px 0; }
.project-details-grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-bottom: 60px; }
@media (min-width: 800px) { .project-details-grid { grid-template-columns: 2fr 1fr; gap: 80px; } }
.credits-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
.credit-item { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 4px; }
.credit-role { font-weight: bold; color: #888; font-size: 0.75rem; letter-spacing: 1px; }
.credit-value { font-weight: 900; text-align: right; font-size: 0.8rem; color: var(--gato-black); }

.project-hero-media { width: 100%; margin-bottom: 80px; }
.hero-iframe-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; border: 4px solid var(--gato-black); box-shadow: 8px 8px 0px rgba(0,0,0,0.1); background-color: var(--gato-black); }
.hero-iframe-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.hero-image-wrapper { width: 100%; border: 4px solid var(--gato-black); box-shadow: 8px 8px 0px rgba(0,0,0,0.1); background-color: var(--gato-black); display: flex; justify-content: center; }
.hero-image-wrapper img { width: 100%; height: auto; max-height: 80vh; object-fit: contain; display: block; }

/* GALERIE EN GRILLE (Responsive 2 à 4 colonnes) */
.hero-gallery-wrapper { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 20px; 
}

@media (min-width: 900px) { 
  .hero-gallery-wrapper { 
    grid-template-columns: repeat(4, 1fr); 
    gap: 30px; 
  } 
}

.hero-gallery-wrapper img { 
  width: 100%; 
  aspect-ratio: 1/1; 
  object-fit: cover; 
  border: 4px solid var(--gato-black); 
  box-shadow: 6px 6px 0px rgba(0,0,0,0.1); 
  background-color: var(--gato-black); 
  display: block; 
  position: relative;
  
  /* Ajout de la transition fluide et nerveuse de GATO */
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
  will-change: transform, box-shadow;
}

/* Le fameux HOVER façon "Release Card" */
.hero-gallery-wrapper img:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 12px 16px 0px rgba(0,0,0,0.15);
  z-index: 2; /* Permet à l'image survolée de passer par-dessus les autres */
}

.visuals-section { margin-top: 40px; }
.bts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; }
@media (min-width: 900px) { .bts-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; } }
.bts-item { display: flex; flex-direction: column; }
.bts-visual { width: 100%; aspect-ratio: 4/3; border: 3px solid var(--gato-black); background-color: var(--gato-black); box-shadow: 6px 6px 0px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 12px; }
.bts-visual img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.3s ease; }
.bts-visual:hover img { opacity: 0.8; }
.bts-desc { font-size: 0.85rem; font-weight: bold; text-transform: none; color: #444; margin: 0; line-height: 1.4; }
</style>