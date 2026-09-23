const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

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

navToggle.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

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

  const perView = () => Math.max(1, Math.round(reviewsSlider.clientWidth / cards[0].offsetWidth));

  function goToSlide(index) {
    const positions = Math.max(1, cards.length - perView() + 1);
    current = (index + positions) % positions;
    cards[current].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(current + 1));

  let scrollTimeout;
  reviewsSlider.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const width = cards[0].offsetWidth || 1;
      current = Math.round(reviewsSlider.scrollLeft / width);
    }, 100);
  });
}


/* ---------- Tour photo sliders (auto-advance + dots) ---------- */
document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = Array.from(slider.querySelectorAll('.tour-slide')).filter(img => img.getAttribute('src'));
  const dotsWrap = slider.querySelector('.tour-dots');
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.tour-dot')) : [];
  if (slides.length <= 1) { if (dotsWrap) dotsWrap.style.display = 'none'; return; }

  let current = 0;
  let timer;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slider.querySelectorAll('.tour-slide').forEach(img => img.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 4500);
  }

  dots.forEach((dot, i) => {
    if (i >= slides.length) { dot.style.display = 'none'; return; }
    dot.addEventListener('click', () => { show(i); startAuto(); });
  });

  startAuto();
});

/* ---------- Booking modal ---------- */
const bookingOverlay = document.getElementById('bookingOverlay');
const bookingModal = document.getElementById('bookingModal');
const bookingModalClose = document.getElementById('bookingModalClose');
const bookingTitle = document.getElementById('bookingTitle');
const bookingTourName = document.getElementById('bookingTourName');
const bookingNote = document.getElementById('bookingNote');
const bkMessageOptional = document.getElementById('bkMessageOptional');
const bookingForm = document.getElementById('bookingForm');

if (bookingModal) {
  function openBookingModal(tourName, intent) {
    bookingModal.setAttribute('data-intent', intent);
    bookingTourName.textContent = tourName;
    if (intent === 'book') {
      bookingTitle.textContent = 'Book your tour';
      bookingNote.textContent = "You'll pick your dates here, then confirm everything with Chafik directly on WhatsApp or email — nothing is auto-charged.";
      bkMessageOptional.style.display = 'inline';
      document.getElementById('bk-guests').required = true;
      document.getElementById('bk-date').required = true;
    } else {
      bookingTitle.textContent = 'Ask about this tour';
      bookingNote.textContent = "This sends a message straight to Chafik — no booking details needed unless you want to share them.";
      bkMessageOptional.style.display = 'none';
      document.getElementById('bk-guests').required = false;
      document.getElementById('bk-date').required = false;
    }
    bookingOverlay.classList.add('open');
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingOverlay.classList.remove('open');
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openBookingModal(btn.getAttribute('data-tour'), btn.getAttribute('data-intent'));
    });
  });

  bookingModalClose.addEventListener('click', closeBookingModal);
  bookingOverlay.addEventListener('click', closeBookingModal);

  function buildBookingMessage() {
    const intent = bookingModal.getAttribute('data-intent');
    const tourName = bookingTourName.textContent;
    const option = document.getElementById('bk-option').value;
    const guests = document.getElementById('bk-guests').value;
    const date = document.getElementById('bk-date').value;
    const message = document.getElementById('bk-message').value;

    let lines = [];
    if (intent === 'book') {
      lines.push(`Hi! I'd like to book: ${tourName}`);
      lines.push(`Option: ${option}`);
      if (guests) lines.push(`Guests: ${guests}`);
      if (date) lines.push(`Date: ${date}`);
    } else {
      lines.push(`Hi! I have a question about: ${tourName}`);
      if (guests && guests !== '2') lines.push(`Guests: ${guests}`);
      if (date) lines.push(`Preferred date: ${date}`);
    }
    if (message) lines.push(`Message: ${message}`);
    return { intent, tourName, text: lines.join('\n') };
  }

  document.getElementById('bkSendWhatsApp').addEventListener('click', () => {
    if (!bookingForm.reportValidity()) return;
    const { text } = buildBookingMessage();
    window.open('https://wa.me/212628921377?text=' + encodeURIComponent(text), '_blank');
  });

  document.getElementById('bkSendEmail').addEventListener('click', () => {
    if (!bookingForm.reportValidity()) return;
    const { intent, tourName, text } = buildBookingMessage();
    const subject = (intent === 'book' ? 'Booking request — ' : 'Question about — ') + tourName;
    window.location.href = 'mailto:chafik.haqqoum@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  });
}

/* ---------- Tour photo height: match description-through-pricing only ---------- */
(function syncTourPhotoHeights() {
  const grids = document.querySelectorAll('.tour-detail-grid');

  function sync() {
    grids.forEach(grid => {
      const slider = grid.querySelector('.tour-slider');
      const desc = grid.querySelector('.desc');
      const pricing = grid.querySelector('.pricing-table');
      if (!slider || !desc || !pricing) return;

      if (window.innerWidth <= 820) {
        slider.style.height = ''; // let mobile's fixed aspect-ratio (CSS) take over
        return;
      }
      const top = desc.getBoundingClientRect().top;
      const bottom = pricing.getBoundingClientRect().bottom;
      const h = Math.round(bottom - top);
      if (h > 0) slider.style.height = h + 'px';
    });
  }

  sync();
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);
  // Re-check shortly after load too, in case web fonts reflow the text
  setTimeout(sync, 500);
})();
