/* ==========================================================================
   EMAIL DELIVERY (Web3Forms) — one thing to do before this works:
   1. Go to https://web3forms.com and enter chafik.haqqoum@gmail.com
   2. Web3Forms emails you an Access Key (free, no password needed)
   3. Paste that key below, replacing the placeholder text
   ========================================================================== */
const WEB3FORMS_ACCESS_KEY = 'e5bcc737-8362-4f25-8c0b-689a947f3dad';

async function sendViaWeb3Forms(fields, statusEl) {
  if (statusEl) {
    statusEl.textContent = 'Sending…';
    statusEl.classList.remove('error', 'success');
    statusEl.classList.add('sending');
  }
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...fields }),
    });
    const result = await response.json();
    if (response.ok && result.success) {
      if (statusEl) {
        statusEl.textContent = "Message sent successfully! We'll get back to you very soon.";
        statusEl.classList.remove('error', 'sending');
        statusEl.classList.add('success');
      }
      return true;
    }
    throw new Error(result.message || 'Submission failed');
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = "Something went wrong sending your message — please try WhatsApp instead, or email chafik.haqqoum@gmail.com directly.";
      statusEl.classList.remove('success', 'sending');
      statusEl.classList.add('error');
    }
    return false;
  }
}

const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');

if (navToggle && mobileMenu && mobileOverlay && mobileMenuClose) {
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
} else {
  console.warn('Mobile menu elements not found on this page — mobile menu disabled, but the rest of the page scripts will still run.');
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
    const status = document.getElementById('bkStatus');
    if (status) { status.textContent = ''; status.classList.remove('success', 'error'); }
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
    const name = document.getElementById('bk-name').value;
    const phone = document.getElementById('bk-phone').value;
    const email = document.getElementById('bk-email').value;
    const option = document.getElementById('bk-option').value;
    const guests = document.getElementById('bk-guests').value;
    const date = document.getElementById('bk-date').value;
    const message = document.getElementById('bk-message').value;

    let lines = [];
    lines.push(`Name: ${name}`);
    lines.push(`Phone: ${phone}`);
    lines.push(`Email: ${email}`);
    if (intent === 'book') {
      lines.push(`\nHi! I'd like to book: ${tourName}`);
      lines.push(`Option: ${option}`);
      if (guests) lines.push(`Guests: ${guests}`);
      if (date) lines.push(`Date: ${date}`);
    } else {
      lines.push(`\nHi! I have a question about: ${tourName}`);
      if (guests && guests !== '2') lines.push(`Guests: ${guests}`);
      if (date) lines.push(`Preferred date: ${date}`);
    }
    if (message) lines.push(`Message: ${message}`);
    return { intent, tourName, text: lines.join('\n') };
  }

  function validateBookingForm() {
    const status = document.getElementById('bkStatus');
    const intent = bookingModal.getAttribute('data-intent');
    const required = [
      [document.getElementById('bk-name'), 'your name'],
      [document.getElementById('bk-phone'), 'your phone number'],
      [document.getElementById('bk-email'), 'your email'],
    ];
    if (intent === 'book') {
      required.push([document.getElementById('bk-guests'), 'the number of guests']);
      required.push([document.getElementById('bk-date'), 'a date']);
    }
    for (const [el, label] of required) {
      if (!el.value.trim()) {
        if (status) { status.textContent = `Please fill in ${label}.`; status.classList.remove('success'); status.classList.add('error'); }
        el.focus();
        return false;
      }
    }
    const emailEl = document.getElementById('bk-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      if (status) { status.textContent = 'Please enter a valid email address.'; status.classList.remove('success'); status.classList.add('error'); }
      emailEl.focus();
      return false;
    }
    return true;
  }

  document.getElementById('bkSendWhatsApp').addEventListener('click', () => {
    if (!validateBookingForm()) return;
    const { text } = buildBookingMessage();
    window.open('https://wa.me/212628921377?text=' + encodeURIComponent(text), '_blank');
  });

  document.getElementById('bkSendEmail').addEventListener('click', async () => {
    if (!validateBookingForm()) return;
    const { intent, tourName, text } = buildBookingMessage();
    const subject = (intent === 'book' ? 'Booking request — ' : 'Question about — ') + tourName;
    const status = document.getElementById('bkStatus');
    await sendViaWeb3Forms({
      subject,
      from_name: document.getElementById('bk-name').value,
      email: document.getElementById('bk-email').value,
      message: text,
    }, status);
  });
}



/* ---------- Contact page form (Send Message / WhatsApp) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  function validateContactForm() {
    const status = document.getElementById('cf-status');
    const required = [
      [document.getElementById('cf-name'), 'your name'],
      [document.getElementById('cf-phone'), 'your phone number'],
      [document.getElementById('cf-email'), 'your email'],
      [document.getElementById('cf-message'), 'a message'],
    ];
    for (const [el, label] of required) {
      if (!el.value.trim()) {
        if (status) { status.textContent = `Please fill in ${label}.`; status.classList.remove('success'); status.classList.add('error'); }
        el.focus();
        return false;
      }
    }
    const emailEl = document.getElementById('cf-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      if (status) { status.textContent = 'Please enter a valid email address.'; status.classList.remove('success'); status.classList.add('error'); }
      emailEl.focus();
      return false;
    }
    const honey = contactForm.querySelector('[name="_honey"]');
    if (honey && honey.value) return false; // likely a bot — silently block
    return true;
  }

  function buildContactMessage() {
    const name = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const email = document.getElementById('cf-email').value;
    const message = document.getElementById('cf-message').value;
    return `Hi! My name is ${name}.\nPhone: ${phone}\nEmail: ${email}\n\n${message}`;
  }

  document.getElementById('cf-submit').addEventListener('click', async () => {
    if (!validateContactForm()) return;
    const text = buildContactMessage();
    const subject = 'Tour Inquiry - The Secret Marrakech (from ' + document.getElementById('cf-name').value + ')';
    const status = document.getElementById('cf-status');
    const ok = await sendViaWeb3Forms({
      subject,
      from_name: document.getElementById('cf-name').value,
      email: document.getElementById('cf-email').value,
      message: text,
    }, status);
    if (ok) contactForm.reset();
  });

  // The WhatsApp button now actually carries the form's content, instead of
  // opening an empty chat.
  document.getElementById('cf-whatsapp-btn').addEventListener('click', (e) => {
    if (!validateContactForm()) { e.preventDefault(); return; }
    const text = buildContactMessage();
    e.currentTarget.href = 'https://wa.me/212628921377?text=' + encodeURIComponent(text);
  });
}
