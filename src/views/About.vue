<template>
  <div class="section">
    <section class="section gato-manifesto" style="margin-bottom: 60px;">
      <div class="section-header">
        <h1>ABOUT GATO</h1>
      </div>

      <div class="manifesto-grid">
        <div class="manifesto-text">
          <h2>ORIGIN</h2>
          <p>
            FOUNDED IN 2025 TO PUSH EMERGING ARTISTS. 
            STARTED FROM NOTHING, GATO IS FIRST AND FOREMOST A TIGHT-KNIT COLLECTIVE OF PASSIONATE CREATORS.
          </p>
        </div>

        <div class="manifesto-text">
          <h2>VISION</h2>
          <p>
            QUALITY OVER QUANTITY. WE BUILD RICH ARTIST UNIVERSES AND DEEP DISCOGRAPHIES ACROSS A VAST NETWORK OF TALENT. 
            GATO HANDLES EVERYTHING IN-HOUSE AND TAKES ON EXTERNAL CLIENT PROJECTS.
          </p>
        </div>
      </div>
    </section>

    <section class="section" style="margin-bottom: 80px;">
      <div class="section-header">
        <h1>CONTACT</h1>
      </div>

      <div class="manifesto-grid">
        <div class="manifesto-text">
          <h2>DIRECT CHANNELS</h2>
          <ul class="contact-list">
            <li>
              <span class="contact-label">GENERAL, MANAGEMENT & BOOKING</span>
              <a href="mailto:gatomusic.contact@gmail.com" class="contact-link">gatomusic.contact@gmail.com &#x2197;&#xFE0E;</a>
            </li>
            <li>
              <span class="contact-label">LYNDXN — HEAD OF GATO</span>
              <a href="mailto:prodeldxn@gmail.com" class="contact-link">prodeldxn@gmail.com &#x2197;&#xFE0E;</a>
            </li>
          </ul>
        </div>

        <div class="manifesto-text" style="display: flex; flex-direction: column; justify-content: center;">
          <h2>GET IN TOUCH</h2>
          <p style="margin-bottom: 25px;">
            FOR ANY BOOKING, INQUIRIES, OR ANYTHING ELSE, REACH OUT DIRECTLY AT <span style="color: var(--gato-red);">GATOMUSIC.CONTACT@GMAIL.COM</span>.
          </p>
          <a href="mailto:gatomusic.contact@gmail.com" class="gato-btn" style="text-align: center; width: 100%;">
            CONTACT US
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.manifesto-text h2 {
  font-family: var(--font-ui);
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0 0 15px 0;
  text-transform: uppercase;
  color: var(--gato-black);
}

.manifesto-text p {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin: 0;
  font-weight: bold;
  text-transform: uppercase;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: #888;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.contact-link {
  font-weight: 900;
  font-size: 1rem;
  color: var(--gato-black);
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: var(--gato-red);
}
</style>