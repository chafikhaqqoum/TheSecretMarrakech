const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Load shared navigation refinements after the main stylesheet.
const navStylesheet = document.createElement('link');
navStylesheet.rel = 'stylesheet';
navStylesheet.href = 'navbar.css';
document.head.appendChild(navStylesheet);

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');

function openMobileMenu(){
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu(){
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle && mobileMenu && mobileOverlay && mobileMenuClose) {
  navToggle.addEventListener('click', openMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
}

// Add the floating WhatsApp CTA to every page using this shared script.
if (!document.querySelector('.wa-float')) {
  const floatingWhatsApp = document.createElement('a');
  floatingWhatsApp.href = 'https://wa.me/212628921377';
  floatingWhatsApp.className = 'wa-float';
  floatingWhatsApp.setAttribute('aria-label', 'Contact us on WhatsApp');
  floatingWhatsApp.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.12"/>
      <path d="M17.47 14.38c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.53-.01-.18 0-.49.07-.74.35-.25.28-.98.96-.98 2.33s1 2.7 1.14 2.89c.14.18 1.97 3 4.77 4.21.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" fill="currentColor"/>
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.appendChild(floatingWhatsApp);
}

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

const reviewsSlider = document.getElementById('reviewsSlider');
if (reviewsSlider) {
  const cards = Array.from(reviewsSlider.querySelectorAll('.review-card'));
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let current = 0;

  // How many cards are visible at once (3 on desktop, 1 on smaller screens)
  const perView = () => Math.max(1, Math.round(reviewsSlider.clientWidth / cards[0].offsetWidth));
  const maxIndex = () => Math.max(0, cards.length - perView());

  function goToSlide(index) {
    const max = maxIndex();
    current = index > max ? 0 : index < 0 ? max : index;
    reviewsSlider.scrollTo({
      left: cards[current].offsetLeft - cards[0].offsetLeft,
      behavior: 'smooth'
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));

  let scrollTimeout;
  reviewsSlider.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cardWidth = cards[0].offsetWidth || 1;
      current = Math.round(reviewsSlider.scrollLeft / cardWidth);
    }, 100);
  });
}

// Automatically highlight active page in the navigation bar
function highlightActiveNav() {
  const currentUrl = window.location.href.toLowerCase();
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-menu nav a');

  allNavLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    // Clean up the href to match the file name (ignoring anchors like #top)
    const cleanHref = linkHref.split('#')[0].toLowerCase();

    // Check if the current page URL ends with or includes this page's filename
    if (cleanHref && currentUrl.endsWith(cleanHref)) {
      link.classList.add('active-nav');
    } else if ((currentUrl.endsWith('/') || currentUrl.endsWith('index.html')) && (cleanHref === 'index.html' || cleanHref === '')) {
      link.classList.add('active-nav');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightActiveNav);
} else {
  highlightActiveNav();
}
