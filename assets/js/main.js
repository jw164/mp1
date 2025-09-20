document.querySelectorAll('a[data-link]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.startsWith('#')) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
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
const openModal = () => { modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); };
const closeModal = () => { modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); };
openButtons.forEach(btn => btn.addEventListener('click', openModal));
closeSelectors.forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-track]');
  const viewport = carousel.querySelector('[data-viewport]');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  let index = 0;
  const update = () => {
    const width = viewport.clientWidth;
    track.style.transform = `translateX(${-index * width}px)`;
  };
  const go = (dir) => {
    index = (index + dir + slides.length) % slides.length;
    update();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  window.addEventListener('resize', update);
  update();
});

document.getElementById('year').textContent = new Date().getFullYear();

