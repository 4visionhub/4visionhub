/* ==========================================================================
   MULTI-CLIENT PERSONALIZED DEMO ENGINE
   Detects /client/:slug and renders custom client branding, colors & data
   ========================================================================== */

let activeClient = null;
let currentLang = 'ua';

// 1. ROUTING & CLIENT CONFIG RESOLUTION
function resolveActiveClient() {
  const path = window.location.pathname;
  const match = path.match(/\/client\/([^\/]+)/);

  if (match && match[1]) {
    const slug = match[1].toLowerCase();
    if (window.CLIENTS_DATABASE && window.CLIENTS_DATABASE[slug]) {
      activeClient = window.CLIENTS_DATABASE[slug];
    } else {
      renderClientNotFound(slug);
      return false;
    }
  } else {
    // Default Root Client
    activeClient = window.CLIENTS_DATABASE["alena-zabolotnia"];
  }

  applyClientTheme();
  return true;
}

// 2. APPLY DYNAMIC THEME COLORS TO CSS VARIABLES
function applyClientTheme() {
  if (!activeClient) return;

  const root = document.documentElement;
  if (activeClient.accentColor) root.style.setProperty('--accent-gold', activeClient.accentColor);
  if (activeClient.accentColorLight) root.style.setProperty('--accent-gold-light', activeClient.accentColorLight);
  if (activeClient.primaryColor) root.style.setProperty('--bg-dark', activeClient.primaryColor);

  document.title = activeClient.titleTag || `${activeClient.businessName} | Luxury Salon`;
}

// 3. RENDER CLIENT CONTENT BASED ON CURRENT LANGUAGE
function renderClientContent() {
  if (!activeClient) return;

  // Header Brand Logo
  const logoText = document.querySelector('.site-logo-text');
  const logoTag = document.querySelector('.site-logo-tag');
  if (logoText) logoText.innerText = activeClient.businessName;
  if (logoTag) logoTag.innerText = activeClient.logoSub;

  // Top Bar Info
  const topTag = document.querySelector('[data-i18n="topTag"]');
  if (topTag) topTag.innerText = activeClient.topTag;

  const topLoc = document.querySelector('.top-bar-left .top-bar-item:first-child');
  if (topLoc) topLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${activeClient.location}`;

  // Social Header Links
  const igHeaderLink = document.querySelector('.social-header-link[title="Instagram"]');
  const threadsHeaderLink = document.querySelector('.social-header-link[title="Threads"]');
  if (igHeaderLink) igHeaderLink.href = activeClient.instagram;
  if (threadsHeaderLink) threadsHeaderLink.href = activeClient.threads;

  // Hero Section
  const heroBadgeTag = document.querySelector('[data-i18n="heroBadgeTag"]');
  const heroTitle = document.querySelector('[data-i18n="heroTitle"]');
  const heroDesc = document.querySelector('[data-i18n="heroDesc"]');
  const heroShowcaseImg = document.querySelector('.hero-showcase-img');
  const cardBadgeTitle = document.querySelector('[data-i18n="cardBadgeTitle"]');
  const cardBadgeText = document.querySelector('[data-i18n="cardBadgeText"]');

  if (heroBadgeTag) heroBadgeTag.innerText = activeClient.heroBadgeTag;
  if (heroShowcaseImg) heroShowcaseImg.src = activeClient.ownerPhoto;
  if (cardBadgeTitle) cardBadgeTitle.innerText = activeClient.cardBadgeTitle;
  if (cardBadgeText) cardBadgeText.innerText = activeClient.cardBadgeText;

  if (currentLang === 'de') {
    if (heroTitle) heroTitle.innerHTML = activeClient.heroTitleDE;
    if (heroDesc) heroDesc.innerText = activeClient.heroDescDE;
  } else if (currentLang === 'en') {
    if (heroTitle) heroTitle.innerHTML = activeClient.heroTitleEN;
    if (heroDesc) heroDesc.innerText = activeClient.heroDescEN;
  } else {
    if (heroTitle) heroTitle.innerHTML = activeClient.heroTitleUA;
    if (heroDesc) heroDesc.innerText = activeClient.heroDescUA;
  }

  // Stats Strip
  const statsContainer = document.querySelector('.stats-grid-row');
  if (statsContainer && activeClient.stats) {
    statsContainer.innerHTML = activeClient.stats.map(st => {
      let lbl = st.labelUA;
      if (currentLang === 'de') lbl = st.labelDE;
      if (currentLang === 'en') lbl = st.labelEN;
      return `
        <div>
          <div class="stat-value-num">${st.num}</div>
          <div class="stat-desc-lbl">${lbl}</div>
        </div>
      `;
    }).join('');
  }

  // Price List Menu
  if (activeClient.services) {
    const col1Title = document.querySelector('[data-i18n="col1Title"]');
    const col2Title = document.querySelector('[data-i18n="col2Title"]');

    if (col1Title) {
      let c1 = activeClient.services.col1TitleUA;
      if (currentLang === 'de') c1 = activeClient.services.col1TitleDE;
      if (currentLang === 'en') c1 = activeClient.services.col1TitleEN;
      col1Title.innerText = c1;
    }

    if (col2Title) {
      let c2 = activeClient.services.col2TitleUA;
      if (currentLang === 'de') c2 = activeClient.services.col2TitleDE;
      if (currentLang === 'en') c2 = activeClient.services.col2TitleEN;
      col2Title.innerText = c2;
    }

    // Populate Column 1 Items
    const col1Container = document.querySelector('.menu-columns-grid > div:first-child');
    if (col1Container) {
      const headerHtml = col1Container.querySelector('.menu-cat-title').outerHTML;
      const itemsHtml = activeClient.services.col1Items.map(it => {
        let name = it.nameUA;
        let sub = it.subUA;
        if (currentLang === 'de') { name = it.nameDE; sub = it.subDE; }
        if (currentLang === 'en') { name = it.nameEN; sub = it.subEN; }
        return `
          <div class="menu-item-row">
            <div class="menu-item-top">
              <span class="menu-item-name">${name}</span>
              <span class="menu-item-dots"></span>
              <span class="menu-item-price">${it.price}</span>
            </div>
            <div class="menu-item-details">${sub}</div>
          </div>
        `;
      }).join('');
      col1Container.innerHTML = headerHtml + itemsHtml;
    }

    // Populate Column 2 Items
    const col2Container = document.querySelector('.menu-columns-grid > div:last-child');
    if (col2Container) {
      const headerHtml = col2Container.querySelector('.menu-cat-title').outerHTML;
      const itemsHtml = activeClient.services.col2Items.map(it => {
        let name = it.nameUA;
        let sub = it.subUA;
        if (currentLang === 'de') { name = it.nameDE; sub = it.subDE; }
        if (currentLang === 'en') { name = it.nameEN; sub = it.subEN; }
        return `
          <div class="menu-item-row">
            <div class="menu-item-top">
              <span class="menu-item-name">${name}</span>
              <span class="menu-item-dots"></span>
              <span class="menu-item-price">${it.price}</span>
            </div>
            <div class="menu-item-details">${sub}</div>
          </div>
        `;
      }).join('');
      col2Container.innerHTML = headerHtml + itemsHtml;
    }

    // Modal Service Select Options
    const modalSelect = document.getElementById('modalServiceSelect');
    if (modalSelect) {
      const allServices = [...activeClient.services.col1Items, ...activeClient.services.col2Items];
      modalSelect.innerHTML = allServices.map(it => {
        let name = it.nameUA;
        if (currentLang === 'de') name = it.nameDE;
        if (currentLang === 'en') name = it.nameEN;
        return `<option value="${name}">${name} — ${it.price}</option>`;
      }).join('');
    }
  }

  // About Section
  const aboutImg = document.querySelector('.about-img-src');
  const aboutTitle = document.querySelector('[data-i18n="aboutTitle"]');
  if (aboutImg) aboutImg.src = activeClient.ownerPhoto;
  if (aboutTitle) aboutTitle.innerText = activeClient.aboutTitle;

  const aboutFeatsContainer = document.querySelector('.about-features-group');
  if (aboutFeatsContainer && activeClient.aboutFeats) {
    aboutFeatsContainer.innerHTML = activeClient.aboutFeats.map(af => {
      let t = af.titleUA; let d = af.descUA;
      if (currentLang === 'de') { t = af.titleDE; d = af.descDE; }
      if (currentLang === 'en') { t = af.titleEN; d = af.descEN; }
      return `
        <div class="about-feat-item">
          <div class="about-feat-icon"><i class="fa-solid ${af.icon}"></i></div>
          <div>
            <h3 class="about-feat-title">${t}</h3>
            <p class="about-feat-desc">${d}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Gallery Cards
  const galleryGrid = document.querySelector('.gallery-cards-grid');
  if (galleryGrid && activeClient.gallery) {
    galleryGrid.innerHTML = activeClient.gallery.map(g => {
      let lbl = g.labelUA;
      if (currentLang === 'de') lbl = g.labelDE;
      if (currentLang === 'en') lbl = g.labelEN;
      return `
        <div class="gallery-card-item" onclick="openLightbox('${g.img}', '${lbl}')">
          <img src="${g.img}" alt="${lbl}">
          <div class="gallery-card-hover">
            <div class="gallery-card-label">${lbl}</div>
            <span style="font-size:0.8rem; color:#fff;">Click to view</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Footer
  const footerTitle = document.querySelector('.footer-logo-title');
  const footerLoc = document.querySelector('[data-i18n="footerLoc"]');
  const footerIgBtn = document.querySelector('.footer-social-btn[href*="instagram"]');
  const footerThreadsBtn = document.querySelector('.footer-social-btn[href*="threads"]');

  if (footerTitle) footerTitle.innerText = activeClient.businessName;
  if (footerLoc) footerLoc.innerText = `${activeClient.logoSub}`;
  if (footerIgBtn) footerIgBtn.href = activeClient.instagram;
  if (footerThreadsBtn) footerThreadsBtn.href = activeClient.threads;

  const copyright = document.querySelector('.footer-copyright');
  if (copyright) copyright.innerHTML = `&copy; 2026 ${activeClient.businessName}. All rights reserved.`;
}

// 4. RENDER "DEMO NOT FOUND" PAGE FOR UNKNOWN SLUGS
function renderClientNotFound(slug) {
  document.body.innerHTML = `
    <div style="min-height:100vh; background:#07080a; color:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; text-align:center; font-family:'Plus Jakarta Sans', sans-serif;">
      <div style="width:70px; height:70px; border-radius:50%; background:rgba(212,175,55,0.1); border:1px solid #d4af37; display:flex; align-items:center; justify-content:center; font-size:2rem; color:#d4af37; margin-bottom:1.5rem;">
        <i class="fa-solid fa-store-slash"></i>
      </div>
      <h1 style="font-family:'Cinzel', serif; font-size:2.5rem; color:#d4af37; margin-bottom:0.5rem;">Demo Client Not Found</h1>
      <p style="color:#9ba2b0; max-width:480px; margin-bottom:2rem; font-size:1rem;">
        The requested demo client "<strong>${slug}</strong>" does not exist or has been removed.
      </p>
      
      <div style="background:#13161f; border:1px solid rgba(212,175,55,0.3); border-radius:8px; padding:1.5rem; max-width:450px; width:100%; margin-bottom:2rem;">
        <h3 style="font-size:0.9rem; text-transform:uppercase; letter-spacing:2px; color:#d4af37; margin-bottom:1rem;">Available Client Demos:</h3>
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.75rem;">
          <li><a href="/client/alena-zabolotnia" style="color:#fff; font-weight:600; text-decoration:none; display:block; padding:0.6rem; background:rgba(255,255,255,0.04); border-radius:4px;">✂️ Alena Zabolotnia (Kanton Bern)</a></li>
          <li><a href="/client/alexander-rein" style="color:#fff; font-weight:600; text-decoration:none; display:block; padding:0.6rem; background:rgba(255,255,255,0.04); border-radius:4px;">✨ Alexander Rein (Baden / Zürich)</a></li>
          <li><a href="/client/glow-salon" style="color:#fff; font-weight:600; text-decoration:none; display:block; padding:0.6rem; background:rgba(255,255,255,0.04); border-radius:4px;">🌟 Glow Beauty Salon (Zürich)</a></li>
        </ul>
      </div>

      <a href="/" style="padding:0.8rem 2rem; background:#d4af37; color:#000; font-family:'Cinzel', serif; font-weight:700; text-decoration:none; letter-spacing:1.5px; border-radius:2px;">
        RETURN TO DEFAULT DEMO
      </a>
    </div>
  `;
}

// 5. INITIALIZATION & LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  const isResolved = resolveActiveClient();
  if (!isResolved) return;

  renderClientContent();

  // Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Language Pill Handlers
  document.querySelectorAll('.lang-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.getAttribute('data-lang');
      document.querySelectorAll('.lang-pill-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-lang') === currentLang);
      });
      renderClientContent();
    });
  });

  // Default Date setup
  const dateInput = document.getElementById('modalDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
});

// Lightbox & Modal Functions
function openLightbox(imgSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  if (modal && img) {
    img.src = imgSrc;
    modal.classList.add('active');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const service = document.getElementById('modalServiceSelect').value;
  const date = document.getElementById('modalDate').value;
  const time = document.getElementById('modalTime').value;
  const name = document.getElementById('modalName').value;
  const phone = document.getElementById('modalPhone').value;

  const textMsg = `Hello ${activeClient ? activeClient.ownerName : 'Master'}! ✂️\n\nI would like to book a appointment:\n` +
                  `👤 Name: ${name}\n` +
                  `💇 Service: ${service}\n` +
                  `📅 Date & Time: ${date} at ${time}\n` +
                  `📱 Phone: ${phone}\n` +
                  `\nLocation: ${activeClient ? activeClient.address : 'Schweiz 🇨🇭'}`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(textMsg)}`;
  closeBookingModal();
  window.open(waUrl, '_blank');
}
