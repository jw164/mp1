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

  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', id);
      }
    });
  });

  // 当前位置高亮 + 底部兜底
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
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));

  // 直接携带 hash 进入时也高亮
  const hash = location.hash;
  if (hash && document.querySelector(`header nav a[href="${hash}"]`)) {
    links.forEach(a => a.classList.remove('active'));
    document.querySelector(`header nav a[href="${hash}"]`).classList.add('active');
  }

  // 轮播
  const slider = document.querySelector('.slider');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slider) {
    const track = slider.querySelector('.slides');
    const slides = [...slider.querySelectorAll('.slide')];
    let i = 0;
    const go = n => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
    };
    slider.querySelector('.prev').addEventListener('click', () => go(i - 1));
    slider.querySelector('.next').addEventListener('click', () => go(i + 1));
    let t = null;
    if (!prefersReduce) {
      t = setInterval(() => go(i + 1), 4500);
      slider.addEventListener('mouseenter', () => clearInterval(t));
      slider.addEventListener('mouseleave', () => t = setInterval(() => go(i + 1), 4500));
    }
    // 键盘左右键支持
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
  }

  // Modal
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = document.getElementById(btn.dataset.open);
      if (m) {
        m.hidden = false;
        // 打开后将焦点放到对话框
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

  // 年份
  document.getElementById('y').textContent = new Date().getFullYear();
})();
