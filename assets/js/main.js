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
  window.addEventListener('scroll', onScroll);
})();

(() => {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('section[id]')];
  if (!links.length || !sections.length) return;

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

  const lastLink = links[links.length - 1];
  const checkBottom = () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (nearBottom) {
      links.forEach(a => a.classList.remove('active'));
      lastLink?.classList.add('active');
    }
  };
  window.addEventListener('scroll', checkBottom);
  checkBottom();
})();

(() => {
  const track = document.querySelector('.slides');
  if (!track) return;
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');
  const total = track.children.length;
  let index = 0;
  const go = (i) => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  };
  prev?.addEventListener('click', ()=>go(index-1

