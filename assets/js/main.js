document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

(() => {
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('section[id]')];

  window.addEventListener('scroll', () => {
    header.style.height = window.scrollY > 8 ? '64px' : '80px';
  });

  const byId = (id) => links.find(a => a.getAttribute('href') === `#${id}`);
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(a=>a.classList.remove('active'));
    const act = byId(visible.target.id);
    if (act) act.classList.add('active');
  }, { rootMargin: '-80px 0px -50% 0px', threshold: [0.25,0.5,0.75] });

  sections.forEach(s=>io.observe(s));
})();

(() => {
  const track = document.querySelector('.slides');
  if (!track) return;
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');
  const total = track.children.length;
  let index = 0;
  function go(i){
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  }
  prev?.addEventListener('click', ()=>go(index-1));
  next?.addEventListener('click', ()=>go(index+1));
})();

(() => {
  const openBtn = document.querySelector('[data-open-modal]');
  const modal = document.querySelector('#demo-modal');
  const closeBtn = document.querySelector('[data-close-modal]');
  if (!openBtn || !modal) return;

  function open() { modal.hidden = false; document.body.style.overflow='hidden'; closeBtn?.focus(); }
  function close(){ modal.hidden = true; document.body.style.overflow=''; }
  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !modal.hidden) close(); });
})();
