/* ==========================================================================
   LYON AUTO - LUXURY CAR DETAILING
   Interactive Logic & Visual Controls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll Detection
  initHeaderScroll();
  
  // Initialize Mobile Navigation Menu
  initMobileNav();
  
  // Initialize Draggable Before/After Slider
  initBeforeAfterSlider();
  
  // Initialize Instant Price Estimator
  initEstimator();
  
  // Initialize Modals (Booking & Service Details)
  initModals();
  
  // Initialize Scroll Reveal Animations
  initScrollReveal();
  
  // Initialize Testimonial Carousel
  initTestimonialCarousel();
  
  // Initialize Language Switcher
  initLanguageSwitcher();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER SCROLL
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAV DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');
  
  if (!toggle || !overlay) return;
  
  toggle.addEventListener('click', () => {
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. BEFORE / AFTER DRAGGABLE SLIDER
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider');
  const beforeImg = document.querySelector('.ba-image.before');
  const handle = document.querySelector('.ba-handle');
  
  if (!container || !beforeImg || !handle) return;
  
  let isDragging = false;
  
  function updateSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    
    // Clamp bounds between 5% and 95%
    if (position < 5) position = 5;
    if (position > 95) position = 95;
    
    beforeImg.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }
  
  // Mouse events
  handle.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });
  
  // Touch events for mobile/tablet
  handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });
  
  // Click anywhere on container to jump slider
  container.addEventListener('click', (e) => {
    if (e.target.closest('.ba-handle')) return;
    updateSliderPosition(e.clientX);
  });
}

/* --------------------------------------------------------------------------
   4. INSTANT PRICE ESTIMATOR
   -------------------------------------------------------------------------- */
function initEstimator() {
  const vehicleCards = document.querySelectorAll('[data-estimator-category="vehicle"] .option-card');
  const packageCards = document.querySelectorAll('[data-estimator-category="package"] .option-card');
  const addonCheckboxes = document.querySelectorAll('.estimator-addon');
  
  const priceDisplay = document.getElementById('estimated-price');
  const durationDisplay = document.getElementById('estimated-duration');
  
  if (!priceDisplay) return;
  
  let selectedVehicleMultiplier = 1.0;
  let selectedPackageBase = 790;
  let selectedDuration = "2 à 3 Jours";
  
  function calculateTotal() {
    let addonsTotal = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseInt(cb.getAttribute('data-price') || 0, 10);
      }
    });
    
    const total = Math.round((selectedPackageBase * selectedVehicleMultiplier) + addonsTotal);
    
    // Smooth price animation
    animateValue(priceDisplay, parseInt(priceDisplay.innerText.replace(/\D/g, '') || 0), total, 400);
    if (durationDisplay) durationDisplay.innerText = selectedDuration;
  }
  
  vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
      vehicleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedVehicleMultiplier = parseFloat(card.getAttribute('data-multiplier') || 1.0);
      calculateTotal();
    });
  });
  
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPackageBase = parseInt(card.getAttribute('data-base-price') || 790, 10);
      selectedDuration = card.getAttribute('data-duration') || "2 à 3 Jours";
      calculateTotal();
    });
  });
  
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateTotal);
  });
  
  calculateTotal();
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.innerText = `${current.toLocaleString('fr-FR')} €`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   5. MODAL POPUPS (BOOKING & DETAILS)
   -------------------------------------------------------------------------- */
function initModals() {
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const closeButtons = document.querySelectorAll('.modal-close');
  const openBookingBtns = document.querySelectorAll('[data-open-modal="booking"]');
  
  const bookingModal = document.getElementById('booking-modal');
  
  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalBackdrops.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });
  
  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Handle booking form submission simulation
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '✦ Envoi en cours...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Merci ! Votre demande de réservation a été enregistrée avec succès. Notre concierge automobile à Lyon vous recontactera sous 2 heures.');
        bookingForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (bookingModal) bookingModal.classList.remove('active');
        document.body.style.overflow = '';
      }, 1200);
    });
  }
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL & STAT COUNTERS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger stat counter if stat item
        const counters = entry.target.querySelectorAll('[data-counter]');
        counters.forEach(counter => {
          if (!counter.classList.contains('counted')) {
            counter.classList.add('counted');
            const targetVal = parseInt(counter.getAttribute('data-counter') || 0, 10);
            animateCounter(counter, 0, targetVal, 1500);
          }
        });
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => observer.observe(el));
}

function animateCounter(el, start, end, duration) {
  let startTimestamp = null;
  const suffix = el.getAttribute('data-suffix') || '';
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    el.innerText = `${current}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/* --------------------------------------------------------------------------
   7. TESTIMONIAL CAROUSEL
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.review-card');
  if (cards.length === 0) return;
  
  let currentIndex = 0;
  
  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }
  
  // Auto switch reviews every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  }, 6000);
}

/* --------------------------------------------------------------------------
   8. LANGUAGE SWITCHER (FR / EN)
   -------------------------------------------------------------------------- */
function initLanguageSwitcher() {
  const langBtns = document.querySelectorAll('.lang-btn');
  
  const translations = {
    fr: {
      heroTag: "✦ HAUTE COUTURE AUTOMOBILE · LYON FRANCE",
      heroTitle: "L'EXCELLENCE DE LA <span class='text-gold'>RÉNOVATION AUTOMOBILE</span>",
      heroDesc: "Atelier d'élite spécialisé dans le detailing haute précision, la protection céramique Quartz et les films PPF auto-guérissants sur-mesure à Lyon.",
      btnBook: "Réserver un Soin",
      btnWork: "Découvrir nos Réalisations",
      atelierTitle: "UN ATELIER CONÇU POUR L'EXCELLENCE AUTOMOBILE",
      servicesTitle: "PRESTATIONS D'ÉLITE SUR-MESURE",
      loungeTitle: "L'EXPÉRIENCE LOUNGE & CAR SPA",
      protocolTitle: "LE PROTOCOLE EN 6 ÉTAPES",
      galleryTitle: "TRANSFORMATIONS ET CORRECTION DE PEINTURE",
      testimonialsTitle: "L'AVIS DE NOS CLIENTS PASSIONNÉS",
      estimatorTitle: "ESTIMATEUR DE TARIF & RÉSERVATION"
    },
    en: {
      heroTag: "✦ AUTOMOTIVE HIGH TAILORING · LYON FRANCE",
      heroTitle: "THE PINNACLE OF <span class='text-gold'>AUTOMOTIVE DETAILING</span>",
      heroDesc: "Elite workshop specializing in high-precision detailing, Quartz ceramic coatings, and custom self-healing PPF protection in Lyon, France.",
      btnBook: "Book an Appointment",
      btnWork: "Explore Our Work",
      atelierTitle: "AN ATELIER BUILT FOR AUTOMOTIVE PERFECTION",
      servicesTitle: "BESPOKE ELITE SERVICES",
      loungeTitle: "THE VIP LOUNGE & CAR SPA EXPERIENCE",
      protocolTitle: "OUR 6-STEP PROTOCOL",
      galleryTitle: "PAINT CORRECTION & TRANSFORMATIONS",
      testimonialsTitle: "REVIEWS FROM PASSIONATE OWNERS",
      estimatorTitle: "INSTANT QUOTE & BOOKING"
    }
  };
  
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (translations[lang]) {
        const t = translations[lang];
        const heroTag = document.querySelector('.hero .badge');
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-description');
        const btnBooks = document.querySelectorAll('[data-open-modal="booking"]');
        
        if (heroTag) heroTag.innerHTML = t.heroTag;
        if (heroTitle) heroTitle.innerHTML = t.heroTitle;
        if (heroDesc) heroDesc.innerText = t.heroDesc;
      }
    });
  });
}
