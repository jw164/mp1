(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.reading-progress span');

  const setProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  };

  const onScrollResize = () => {
    if (window.scrollY > 8) header.classList.add('shrink'); else header.classList.remove('shrink');
    setProgress();
  };
  onScrollResize();
  window.addEventListener('scroll', onScrollResize);
  window.addEventListener('resize', onScrollResize);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
        history.pushState(null, '', id);
      }
    });
  });

  const links = [...document.querySelectorAll('header nav a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      links.forEach(l => l.classList.remove('active'));
      links[links.length - 1].classList.add('active');
    }
  }, {rootMargin: '-40% 0px -50% 0px', threshold: 0});
  sections.forEach(s => io.observe(s));

  const startHash = location.hash;
  if (startHash && document.querySelector(`header nav a[href="${startHash}"]`)) {
    links.forEach(a => a.classList.remove('active'));
    document.querySelector(`header nav a[href="${startHash}"]`).classList.add('active');
  }

  const slider = document.querySelector('.slider');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slider) {
    const track = slider.querySelector('.slides');
    const slides = [...slider.querySelectorAll('.slide')];
    const prev = slider.querySelector('.prev');
    const next = slider.querySelector('.next');
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    slider.after(dotsWrap);

    let i = 0;
    const update = () => {
      track.style.transform = `translateX(-${i * 100}%)`;
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
    };
    const go = n => { i = (n + slides.length) % slides.length; update(); };

    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));

    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => { i = idx; update(); });
      dotsWrap.appendChild(dot);
    });
    update();

    let t = null;
    const start = () => { if (!prefersReduce) t = setInterval(() => go(i + 1), 4500); };
    const stop  = () => { if (t) clearInterval(t); };
    start();
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    window.addEventListener('resize', update);
  }

  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = document.getElementById(btn.dataset.open);
      if (m) {
        m.hidden = false;
        m.querySelector('.dialog')?.focus();
      }
    });
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.modal').hidden = true);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => m.hidden = true);
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.hidden = true; });
  });

  document.getElementById('y').textContent = new Date().getFullYear();
})();
