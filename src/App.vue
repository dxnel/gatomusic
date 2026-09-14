<template>
  <div class="pack-wrapper">
    <header class="pack-header">
      <h1 class="brand-title instrument-serif">GATO</h1>
      <div class="brand-subtitle">EST. 2025</div>
    </header>

    <nav class="navbar">
      <ul class="nav-links">
        <li><router-link to="/">HOME</router-link></li>
        
        <li>
          <router-link 
            to="/artists" 
            :class="{ 'router-link-active': $route.name === 'Artist' }"
          >
            ARTISTS
          </router-link>
        </li>
        
        <li>
          <router-link 
            to="/discography" 
            :class="{ 'router-link-active': $route.name === 'Release' }"
          >
            <span class="desktop-text">DISCOGRAPHY</span>
            <span class="mobile-text">DISCO</span>
          </router-link>
        </li>
        
        <li>
          <router-link 
            to="/projects"
            :class="{ 'router-link-active': $route.name === 'Project' }"
          >
            PROJECTS
          </router-link>
        </li>

        <li>
          <router-link 
            to="/about" 
            :class="{ 'router-link-active': $route.name === 'About' }"
          >
            ABOUT
          </router-link>
        </li>
      </ul>
    </nav>

    <main class="vue-main-layout">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="pack-footer">
      <img src="./assets/GATO_LogoPPBlack-1000.png" alt="GATO Seal" class="footer-seal">
      <div class="contact-info">
        MANUFACTURED BY GATO<br>
        SWITZERLAND<br>
        Made with love ● lyndxn, Head Of GATO<br>
        <a href="mailto:gatomusic.contact@gmail.com">gatomusic.contact@gmail.com</a><br>
        IG: <a href="https://instagram.com/gato.records" target="_blank">@GATO.RECORDS</a>
      </div>
      <div class="barcode-massive"></div>
    </footer>
  </div>
</template>