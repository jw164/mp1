document.querySelectorAll('a[data-link]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.startsWith('#')) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nav = document.getElementById('topnav');
      nav.classList.remove('open');
      const tgl = document.querySelector('.nav__toggle');
      if (tgl) tgl.setAttribute('aria-expanded', 'false');
    }
  });
});

const nav = document.getElementById('topnav');
const shrinkThreshold = 64;
const onScroll = () => {
  if (window.scrollY > shrinkThreshold) nav.classList.add('shrink');
  else nav.classList.remove('shrink');
};
window.addEventListener('scroll', onScroll);
onScroll();

const tgl = document.querySelector('.nav__toggle');
if (tgl) {
  tgl.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    tgl.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

const sections = [...document.querySelectorAll('section, header')].filter(s => s.id);
const linkMap = new Map(
  [...document.querySelectorAll('a[data-link]')].map(a => [a.getAttribute('href').slice(1), a])
);
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      linkMap.forEach(a => a.classList.remove('active'));
      const link = linkMap.get(id);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
sections.forEach(sec => io.observe(sec));
window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
  if (nearBottom) {
    linkMap.forEach(a => a.classList.remove('active'));
    const last = document.querySelector('.nav__links li:last-child a');
    if (last) last.classList.add('active');
  }
});

const animatedBlocks = document.querySelectorAll('.section, .card, .carousel, .video, .hero__title, .hero__tag');
const ioAnim = new IntersectionObserver((ents) => {
  ents.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.15 });
animatedBlocks.forEach(el => ioAnim.observe(el));

const modal = document.getElementById('modal-hours');
const openButtons = document.querySelectorAll('[data-open-modal="hours"]');
const closeSelectors = modal.querySelectorAll('[data-close-modal], .modal__close');
let lastFocus = null;
const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
const trapFocus = (e) => {
  if (modal.getAttribute('aria-hidden') === 'true') return;
  const nodes = modal.querySelectorAll(focusableSelector);
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
};
const openModal = () => {
  lastFocus = document.activeElement;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  const first = modal.querySelector(focusableSelector);
  if (first) first.focus();
};
const closeModal = () => {
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastFocus) lastFocus.focus();
};
openButtons.forEach(btn => btn.addEventListener('click', openModal));
closeSelectors.forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); trapFocus(e); });

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-track]');
  const viewport = carousel.querySelector('[data-viewport]');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  const dotsWrap = document.querySelector('.dots');
  let index = 0;
  const update = () => {
    const width = viewport.clientWidth;
    track.style.transform = `translateX(${-index * width}px)`;
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
    }
  };
  const go = (dir) => {
    index = (index + dir + slides.length) % slides.length;
    update();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  window.addEventListener('resize', update);
  update();
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => { index = i; update(); });
      dotsWrap.appendChild(b);
    });
    update();
  }
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.querySelector('.form');
const hint = document.querySelector('.form__hint');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (!valid) {
      hint.textContent = 'Please complete the form.';
      return;
    }
    hint.textContent = 'Thanks! Your message has been recorded locally.';
    form.reset();
  });
}

const totop = document.getElementById('totop');
const onScrollTop = () => {
  if (window.scrollY > 400) totop.classList.add('show');
  else totop.classList.remove('show');
};
window.addEventListener('scroll', onScrollTop);
totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
onScrollTop();



