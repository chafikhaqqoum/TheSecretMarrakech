function addCalendarNavigationLink(nav) {
  if (!nav || nav.querySelector('a[href="calendar.html"]')) return;

  const calendarLink = document.createElement('a');
  calendarLink.href = 'calendar.html';
  calendarLink.textContent = 'Calendar';

  const servicesLink = nav.querySelector('a[href="services.html"]');
  const shopLink = nav.querySelector('a[href="shop.html"]');
  if (servicesLink) {
    servicesLink.insertAdjacentElement('afterend', calendarLink);
  } else if (shopLink) {
    shopLink.insertAdjacentElement('beforebegin', calendarLink);
  } else {
    nav.appendChild(calendarLink);
  }
}

// Keep the calendar available from every page that uses the shared site navigation.
addCalendarNavigationLink(document.querySelector('.nav-links'));
addCalendarNavigationLink(document.querySelector('#mobileMenu nav'));

// Shared floating WhatsApp CTA on every page using this script.
(() => {
  const existing = document.querySelector('.wa-float');
  if (existing) return;

  const style = document.createElement('style');
  style.textContent = `
    .wa-float {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 250;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 12px 16px;
      border-radius: 999px;
      background: #25D366;
      color: #0c1c12;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      line-height: 1.2;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 8px 22px rgba(37, 211, 102, 0.35);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .wa-float:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px rgba(37, 211, 102, 0.42);
    }
    .wa-float svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      display: block;
    }
    @media (max-width: 640px) {
      .wa-float {
        right: 16px;
        bottom: 16px;
        padding: 12px;
      }
      .wa-float span {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  const link = document.createElement('a');
  link.href = 'https://wa.me/212628921377';
  link.className = 'wa-float';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Contact us on WhatsApp');
  link.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#0c1c12" opacity=".12"/>
      <path d="M17.47 14.38c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.53-.01-.18 0-.49.07-.74.35-.25.28-.98.96-.98 2.33s1 2.7 1.14 2.89c.14.18 1.97 3 4.77 4.21.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" fill="#0c1c12"/>
    </svg>
    <span>WhatsApp</span>
  `;

  document.body.appendChild(link);
})();

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
    const dateInput = document.getElementById('bk-date');
    if (dateInput) {
      const today = new Date();
      const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
      ].join('-');
      dateInput.min = localToday;
    }
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

  document.getElementById('bkSendEmail').addEventListener('click', () => {
    if (!validateBookingForm()) return;
    const { intent, tourName, text } = buildBookingMessage();
    const subject = (intent === 'book' ? 'Booking request — ' : 'Question about — ') + tourName;
    const mailtoUrl = 'mailto:chafik.haqqoum@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);

    window.location.href = mailtoUrl;

    const fullText = `To: chafik.haqqoum@gmail.com\nSubject: ${subject}\n\n${text}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    const status = document.getElementById('bkStatus');
    if (status) {
      status.textContent = "Opening your email app… the message has also been copied, just in case.";
      status.classList.remove('error');
      status.classList.add('success');
    }
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
    if (honey && honey.value) return false;
    return true;
  }

  function buildContactMessage() {
    const name = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const email = document.getElementById('cf-email').value;
    const message = document.getElementById('cf-message').value;
    return `Hi! My name is ${name}.\nPhone: ${phone}\nEmail: ${email}\n\n${message}`;
  }

  document.getElementById('cf-submit').addEventListener('click', () => {
    if (!validateContactForm()) return;
    const text = buildContactMessage();
    const subject = 'Tour Inquiry - The Secret Marrakech (from ' + document.getElementById('cf-name').value + ')';

    window.location.href = 'mailto:chafik.haqqoum@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);

    const fullText = `To: chafik.haqqoum@gmail.com\nSubject: ${subject}\n\n${text}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    const status = document.getElementById('cf-status');
    if (status) {
      status.textContent = "Opening your email app… the message has also been copied, just in case.";
      status.classList.remove('error');
      status.classList.add('success');
    }
  });

  document.getElementById('cf-whatsapp-btn').addEventListener('click', (e) => {
    if (!validateContactForm()) { e.preventDefault(); return; }
    const text = buildContactMessage();
    e.currentTarget.href = 'https://wa.me/212628921377?text=' + encodeURIComponent(text);
  });
}
