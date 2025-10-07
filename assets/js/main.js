(() => {
  const $ = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  const header = $('.site-header');
  const progress = $('.reading-progress span');

  function setProgress(){
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
  }
  function onScrollResize(){
    if (window.scrollY > 8) header.classList.add('shrink'); else header.classList.remove('shrink');
    setProgress();
  }
  onScrollResize();
  window.addEventListener('scroll', onScrollResize, {passive:true});
  window.addEventListener('resize', onScrollResize);

  // Smooth anchor scroll + update url
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
          history.pushState(null, '', id);
        }
      }
    });
  });

  // Active nav link while scrolling
  const links = $$('header nav a');
  const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      links.forEach(l=>l.classList.remove('active'));
      links[links.length-1].classList.add('active');
    }
  }, {rootMargin:'-40% 0px -50% 0px', threshold:0});
  sections.forEach(s=>io.observe(s));

  const startHash = location.hash;
  if (startHash && document.querySelector(`header nav a[href="${startHash}"]`)) {
    links.forEach(a=>a.classList.remove('active'));
    document.querySelector(`header nav a[href="${startHash}"]`).classList.add('active');
  }

  // Carousel
  const slider = $('.slider');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slider) {
    slider.setAttribute('role','region');
    const track = $('.slides', slider);
    const slides = $$('.slide', slider);
    const prev = $('.prev', slider);
    const next = $('.next', slider);

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'dots';
    slider.after(dotsWrap);

    let i = 0;
    function update(){
      track.style.transform = `translateX(-${i*100}%)`;
      Array.from(dotsWrap.children).forEach((d,idx)=>d.classList.toggle('active', idx===i));
    }
    function go(n){ i = (n + slides.length) % slides.length; update(); }

    prev.addEventListener('click', ()=>go(i-1));
    next.addEventListener('click', ()=>go(i+1));

    slides.forEach((_,idx)=>{
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Go to slide ${idx+1}`);
      dot.addEventListener('click', ()=>{ i = idx; update(); });
      dotsWrap.appendChild(dot);
    });
    update();

    let timer = null;
    const start = ()=>{ if (!prefersReduce) timer = setInterval(()=>go(i+1), 4500); };
    const stop  = ()=>{ if (timer) clearInterval(timer); };
    start();

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('keydown', e=>{
      if (e.key === 'ArrowLeft') go(i-1);
      if (e.key === 'ArrowRight') go(i+1);
    });
    // 暂停当标签页不可见
    document.addEventListener('visibilitychange', ()=>{ document.hidden ? stop() : start(); });
    window.addEventListener('resize', update);
  }

  // Modal open/close
  $$('[data-open]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const m = document.getElementById(btn.dataset.open);
      if (m) {
        m.hidden = false;
        (m.querySelector('.dialog')||m).focus();
      }
    });
  });
  $$('[data-close]').forEach(btn=>{
    btn.addEventListener('click', ()=> btn.closest('.modal').hidden = true);
  });
  document.addEventListener('keydown', e=>{
    if (e.key === 'Escape') $$('.modal').forEach(m=> m.hidden = true);
  });
  $$('.modal').forEach(m=>{
    m.addEventListener('click', e=>{ if (e.target === m) m.hidden = true; });
  });

  // Footer year
  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();

  // Video fallback (show link if play fails)
  (function setupVideoFallback(){
    const v = document.getElementById('coffeeVideo');
    const tip = document.getElementById('videoFallback');
    if (!v || !tip) return;

    const showTip = ()=>{ tip.style.display = 'block'; };

    v.addEventListener('error', showTip);
    v.addEventListener('stalled', showTip);
    v.addEventListener('abort', showTip);

    const can = v.canPlayType('video/mp4');
    if (!can) showTip();
  })();
})();

