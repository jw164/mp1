document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('shrink');
    else header.classList.remove('shrink');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

(() => {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('section[id]')];
  if (!links.length || !sections.length) return;

  const byId = (id) => links.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(a=>a.classList.remove('active'));
    const act = byId(visible.target.id);
    if (act) act.classList.add('active');
  }, { rootMargin: '-80px 0px -50% 0px', threshold: [0.25,0.5,0.75] });
  sections.forEach(s=>io.observe(s));

  const lastLink = links[links.length - 1];
  const checkBottom = () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (nearBottom) {
      links.forEach(a => a.classList.remove('active'));
      lastLink?.classList.add('active');
    }
  };
  window.addEventListener('scroll', checkBottom, { passive: true });
  checkBottom();
})();

(() => {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  const update = () => {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

(() => {
  const track = document.querySelector('.slides');
  if (!track) return;
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');
  const total = track.children.length;
  let index = 0;
  const go = (i) => { index = (i + total) % total; track.style.transform = `translateX(-${index * 100}%)`; };
  prev?.addEventListener('click', ()=>go(index-1));
  next?.addEventListener('click', ()=>go(index+1));
  track.closest('.slider')?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(index-1);
    if (e.key === 'ArrowRight') go(index+1);
  });
})();

(() => {
  const openers = document.querySelectorAll('[data-open-modal]');
  const closers = document.querySelectorAll('[data-close-modal]');
  const getTarget = (el) => document.querySelector(el.getAttribute('data-open-modal'));
  openers.forEach(btn => {
    const target = getTarget(btn); if (!target) return;
    btn.addEventListener('click', () => {
      target.hidden = false;
      document.body.style.overflow = 'hidden';
      target.querySelector('[data-close-modal]')?.focus();
    });
  });
  closers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal'); if (!modal) return;
      modal.hidden = true; document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', (e) => {
    const modal = e.target.classList?.contains('modal') ? e.target : null;
    if (!modal) return; modal.hidden = true; document.body.style.overflow = '';
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal:not([hidden])').forEach(m => m.hidden = true);
    document.body.style.overflow = '';
  });
})();

(() => {
  const targets = document.querySelectorAll('.section, .hero-inner');
  if (!targets.length) return;
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach(el => io.observe(el));
})();

