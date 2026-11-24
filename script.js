// The standalone calendar has been retired; do not add it back to site navigation.
const isFrenchPage = document.documentElement.lang === 'fr';

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
  link.setAttribute('aria-label', isFrenchPage ? 'Nous contacter sur WhatsApp' : 'Contact us on WhatsApp');
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
  const detailSection = slider.closest('[data-tour-section]');
  let sliderIsVisible = false;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slider.querySelectorAll('.tour-slide').forEach(img => img.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function stopAuto() {
    clearInterval(timer);
    timer = null;
  }

  function startAuto() {
    if (timer) return;
    timer = setInterval(() => show(current + 1), 4500);
  }

  function syncAuto() {
    if (!detailSection || (sliderIsVisible && detailSection.classList.contains('is-open'))) {
      startAuto();
    } else {
      stopAuto();
    }
  }

  dots.forEach((dot, i) => {
    if (i >= slides.length) { dot.style.display = 'none'; return; }
    dot.addEventListener('click', () => { show(i); syncAuto(); });
  });

  if (detailSection && 'IntersectionObserver' in window) {
    const sliderObserver = new IntersectionObserver(entries => {
      sliderIsVisible = entries.some(entry => entry.isIntersecting);
      syncAuto();
    }, { threshold: 0.2 });
    sliderObserver.observe(slider);
    // The selected detail section may be changed without replacing the slider.
    const sectionObserver = new MutationObserver(syncAuto);
    sectionObserver.observe(detailSection, { attributes: true, attributeFilter: ['class'] });
  } else if (!detailSection) {
    startAuto();
  }
});

/* ---------- Email form delivery (Web3Forms) ---------- */
const WEB3FORMS_ACCESS_KEY = 'e5bcc737-8362-4f25-8c0b-689a947f3dad';

async function sendFormSubmission(payload, statusEl, button) {
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  if (statusEl) {
    statusEl.textContent = isFrenchPage ? 'Envoi de votre message…' : 'Sending your message…';
    statusEl.classList.remove('success', 'error');
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        from_name: 'The Secret Marrakech',
        ...payload
      })
    });
    const result = await response.json();
    if (!response.ok || result.success !== true) {
      const detail = result.message || result.body?.message;
      throw new Error(detail || (isFrenchPage ? 'Le service e-mail n’a pas pu accepter votre message. Veuillez réessayer par WhatsApp.' : 'The email service could not accept your message. Please try WhatsApp instead.'));
    }
    if (statusEl) {
      statusEl.textContent = isFrenchPage ? 'Merci ! Votre message a bien été envoyé. Chafik vous répondra dès que possible.' : 'Thank you! Your message has been sent successfully. Chafik will get back to you soon.';
      statusEl.classList.remove('error');
      statusEl.classList.add('success');
    }
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = isFrenchPage ? (error.message || 'Désolé, votre message n’a pas pu être envoyé. Veuillez réessayer par WhatsApp.') : (error.message || 'Sorry, your message could not be sent. Please try WhatsApp instead.');
      statusEl.classList.remove('success');
      statusEl.classList.add('error');
    }
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}

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
      bookingTitle.textContent = isFrenchPage ? 'Réserver votre visite' : 'Book your tour';
      bookingNote.textContent = isFrenchPage ? 'Indiquez vos dates ici, puis confirmez directement avec Chafik sur WhatsApp ou par e-mail. Aucun paiement automatique ne sera effectué.' : "You'll pick your dates here, then confirm everything with Chafik directly on WhatsApp or email — nothing is auto-charged.";
      bkMessageOptional.style.display = 'inline';
      document.getElementById('bk-guests').required = true;
      document.getElementById('bk-date').required = true;
    } else {
      bookingTitle.textContent = isFrenchPage ? 'Demander des renseignements' : 'Ask about this tour';
      bookingNote.textContent = isFrenchPage ? 'Votre message sera envoyé directement à Chafik. Vous n’avez pas besoin de fournir de détails de réservation.' : "This sends a message straight to Chafik — no booking details needed unless you want to share them.";
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

  const bookingOption = document.getElementById('bk-option');
  const guestsHelp = document.getElementById('bk-guests-help');
  if (bookingOption && guestsHelp) {
    function updateBookingOptionHelp() {
      guestsHelp.textContent = bookingOption.value === 'Private'
        ? (isFrenchPage ? 'Indiquez le nombre de participants de votre groupe privé. Le prix total dépend de la visite choisie et de la taille du groupe.' : 'Enter everyone in your private group. The total price depends on the selected tour and group size.')
        : (isFrenchPage ? 'Indiquez le nombre de personnes. Vous rejoindrez un petit groupe avec d’autres voyageurs.' : 'Enter the number of people in your party. You will join a small group with other guests.');
    }
    bookingOption.addEventListener('change', updateBookingOptionHelp);
    updateBookingOptionHelp();
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
    const lines = [
      `${isFrenchPage ? 'Nom' : 'Name'} : ${name}`,
      `${isFrenchPage ? 'Téléphone' : 'Phone'} : ${phone}`,
      `${isFrenchPage ? 'E-mail' : 'Email'} : ${email}`
    ];
    if (intent === 'book') {
      lines.push(`\n${isFrenchPage ? 'Bonjour ! Je souhaite réserver' : "Hi! I'd like to book"} : ${tourName}`);
      lines.push(`${isFrenchPage ? 'Format de visite' : 'Tour format'} : ${option === 'Private' ? (isFrenchPage ? 'Privée — uniquement notre groupe' : 'Private — just our group') : (isFrenchPage ? 'Petit groupe partagé avec d’autres voyageurs' : 'Public small-group — shared with other guests')}`);
      if (guests) lines.push(`${isFrenchPage ? 'Nombre de participants' : 'Total guests'} : ${guests}`);
      if (date) lines.push(`${isFrenchPage ? 'Date souhaitée' : 'Date'} : ${date}`);
    } else {
      lines.push(`\n${isFrenchPage ? 'Bonjour ! J’aimerais des renseignements sur' : 'Hi! I have a question about'} : ${tourName}`);
      if (guests && guests !== '2') lines.push(`${isFrenchPage ? 'Participants' : 'Guests'} : ${guests}`);
      if (date) lines.push(`${isFrenchPage ? 'Date souhaitée' : 'Preferred date'} : ${date}`);
    }
    if (message) lines.push(`${isFrenchPage ? 'Message' : 'Message'} : ${message}`);
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

  document.getElementById('bkSendEmail').addEventListener('click', async (event) => {
    if (!validateBookingForm()) return;
    const { intent, tourName, text } = buildBookingMessage();
    const subject = (intent === 'book' ? (isFrenchPage ? 'Demande de réservation — ' : 'Booking request — ') : (isFrenchPage ? 'Renseignements sur — ' : 'Question about — ')) + tourName;
    const payload = {
      subject,
      name: document.getElementById('bk-name').value.trim(),
      phone: document.getElementById('bk-phone').value.trim(),
      email: document.getElementById('bk-email').value.trim(),
      tour: tourName,
      tour_format: document.getElementById('bk-option').value,
      total_guests: document.getElementById('bk-guests').value,
      preferred_date: document.getElementById('bk-date').value,
      message: document.getElementById('bk-message').value.trim(),
      request_details: text
    };
    await sendFormSubmission(payload, document.getElementById('bkStatus'), event.currentTarget);
  });
}

/* ---------- Contact page form (Send Message / WhatsApp) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const requestedTour = new URLSearchParams(window.location.search).get('tour');
  if (requestedTour) {
    const messageField = document.getElementById('cf-message');
    if (messageField && !messageField.value.trim()) {
      messageField.value = isFrenchPage ? `Je souhaite obtenir un devis pour : ${requestedTour}. Pourriez-vous m’envoyer plus de détails ?` : `I'm interested in a quote for: ${requestedTour}. Please send me more details.`;
    }
  }
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
    const phoneEl = document.getElementById('cf-phone');
    if (!/^\+?[0-9]{7,15}$/.test(phoneEl.value.trim())) {
      if (status) { status.textContent = 'Please enter a valid phone number using 7–15 digits, with an optional + at the beginning and no spaces.'; status.classList.remove('success'); status.classList.add('error'); }
      phoneEl.focus();
      return false;
    }
    const emailEl = document.getElementById('cf-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
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
    return isFrenchPage ? `Bonjour, je m’appelle ${name}.\nTéléphone : ${phone}\nE-mail : ${email}\n\n${message}` : `Hi! My name is ${name}.\nPhone: ${phone}\nEmail: ${email}\n\n${message}`;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateContactForm()) return;
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = isFrenchPage ? 'Demande de renseignements — The Secret Marrakech (de la part de ' + name + ')' : 'Tour inquiry - The Secret Marrakech (from ' + name + ')';
    const payload = {
      subject,
      name,
      phone: document.getElementById('cf-phone').value.trim(),
      email,
      message: document.getElementById('cf-message').value.trim()
    };
    await sendFormSubmission(payload, document.getElementById('cf-status'), document.getElementById('cf-submit'));
  });

  document.getElementById('cf-whatsapp-btn').addEventListener('click', (e) => {
    if (!validateContactForm()) { e.preventDefault(); return; }
    const text = buildContactMessage();
    e.currentTarget.href = 'https://wa.me/212628921377?text=' + encodeURIComponent(text);
  });
}


/* ---------- Shared Plan Your Trip enquiry modal ---------- */
(() => {
  const modal = document.getElementById('planTripModal');
  const overlay = document.getElementById('planTripOverlay');
  const form = document.getElementById('planTripForm');
  if (!modal || !overlay || !form) return;
  const closeButton = document.getElementById('planTripClose');
  const status = document.getElementById('pt-status');
  const submitButton = document.getElementById('pt-submit');
  const fields = {name:document.getElementById('pt-name'),phone:document.getElementById('pt-phone'),email:document.getElementById('pt-email'),message:document.getElementById('pt-message')};

  function openModal() {
    status.textContent = ''; status.classList.remove('success','error');
    modal.classList.add('open'); overlay.classList.add('open');
    modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    window.setTimeout(() => fields.name.focus(),50);
  }
  function closeModal() {
    modal.classList.remove('open'); overlay.classList.remove('open');
    modal.setAttribute('aria-hidden','true'); document.body.style.overflow='';
  }
  document.querySelectorAll('[data-plan-trip-trigger]').forEach(trigger => trigger.addEventListener('click',event => {
    event.preventDefault();
    if (mobileMenu && mobileMenu.classList.contains('open')) closeMobileMenu();
    openModal();
  }));
  closeButton.addEventListener('click',closeModal);
  overlay.addEventListener('click',closeModal);
  document.addEventListener('keydown',event => {if(event.key==='Escape'&&modal.classList.contains('open')) closeModal();});

  form.addEventListener('submit',async event => {
    event.preventDefault();
    const fail=(message,field)=>{status.textContent=message;status.classList.remove('success');status.classList.add('error');field.focus();};
    if(!fields.name.value.trim()) return fail('Please enter your name.',fields.name);
    if(!/^\+?[0-9]{7,15}$/.test(fields.phone.value.trim())) return fail('Please enter a valid phone number using 7–15 digits, with an optional + at the beginning and no spaces.',fields.phone);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) return fail('Please enter a valid email address.',fields.email);
    if(!fields.message.value.trim()) return fail('Please add a message so we know how to help.',fields.message);
    if(form.querySelector('[name="_honey"]').value) return;
    const name=fields.name.value.trim();
    await sendFormSubmission({subject:'Trip planning enquiry - The Secret Marrakech (from '+name+')',name,phone:fields.phone.value.trim(),email:fields.email.value.trim(),message:fields.message.value.trim()},status,submitButton);
  });
})();

/* ---------- English / French page switch ---------- */
(() => {
  const switches = document.querySelectorAll('[data-language-switch]');
  if (!switches.length) return;
  const path = window.location.pathname;
  const isFrench = path === '/fr' || path.startsWith('/fr/');
  let target;
  if (isFrench) {
    target = path.replace(/^\/fr(?=\/|$)/, '') || '/';
    if (target === '/index.html') target = '/';
  } else {
    target = path === '/' || path === '/index.html' ? '/fr/' : '/fr' + path;
  }
  switches.forEach(link => {
    link.href = target + window.location.search + window.location.hash;
    link.textContent = isFrench ? 'EN' : 'FR';
    link.setAttribute('aria-label', isFrench ? 'Switch to English' : 'Passer en français');
    link.setAttribute('hreflang', isFrench ? 'en' : 'fr');
  });
})();

/* ---------- French validation feedback ---------- */
(() => {
  if (document.documentElement.lang !== 'fr') return;
  const messages = {
    'Please enter your name.': 'Veuillez saisir votre nom.',
    'Please enter a valid email address.': 'Veuillez saisir une adresse e-mail valide.',
    'Sending your message…': 'Envoi de votre message…',
    'Please enter a valid phone number using 7–15 digits, with an optional + at the beginning and no spaces.': 'Veuillez saisir un numéro de téléphone valide de 7 à 15 chiffres, avec un + facultatif au début et sans espaces.',
    'Please add a message so we know how to help.': 'Veuillez ajouter un message afin que nous sachions comment vous aider.',
    'Please fill in your name.': 'Veuillez saisir votre nom.',
    'Please fill in your phone number.': 'Veuillez saisir votre numéro de téléphone.',
    'Please fill in your email.': 'Veuillez saisir votre adresse e-mail.',
    'Please fill in a message.': 'Veuillez saisir un message.',
    'Please fill in the number of guests.': 'Veuillez indiquer le nombre de participants.',
    'Please fill in a date.': 'Veuillez indiquer une date.'
  };
  const localize = node => {
    if (!node || !node.textContent) return;
    const original = node.textContent.trim();
    if (messages[original]) node.textContent = messages[original];
  };
  const watch = () => document.querySelectorAll('.form-status, #bkStatus, #pt-status, #cf-status').forEach(localize);
  watch();
  new MutationObserver(watch).observe(document.body, {subtree:true,childList:true,characterData:true});
})();
